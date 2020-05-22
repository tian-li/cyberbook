import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { fromTransaction } from '@spend-book/core/store';
import { DateRangePickerComponent } from '@spend-book/shared/components/date-range-picker/date-range-picker.component';
import { TransactionType } from '@spend-book/shared/constants';
import { PeriodSummary } from '@spend-book/shared/model/helper-models';
import { getMonthSummary } from '@spend-book/shared/utils/get-month-summary';
import { Chart, ChartData, ChartDataSets } from 'chart.js';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

dayjs.extend(isSameOrBefore);

enum DateAxisScales {
  day = 'day',
  month = 'month',
}

enum DateFormats {
  day = 'MM/DD',
  month = 'YYYY/MM',
}

@Component({
  selector: 'app-graph-chart-line',
  templateUrl: './graph-chart-line.component.html',
  styleUrls: ['./graph-chart-line.component.scss']
})
export class GraphChartLineComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly TransactionType = TransactionType;
  readonly today = dayjs();
  readonly defaultLineOption = {
    backgroundColor: 'transparent',
    lineTension: 0,
    borderWidth: 2,
    pointBorderWidth: 2,
  };
  readonly incomeColor = 'green';
  readonly spendColor = 'red';

  @ViewChild('myChart', { static: false }) myChart: ElementRef;
  startDate = this.today.subtract(4, 'month').date(1);
  endDate = this.today.endOf('month');
  selectedTransactionType = TransactionType.both;
  dateAxisFormat = DateFormats.month;

  private lineChart: Chart;
  private dateAxisScale = DateAxisScales.month;
  private transactionVOs: TransactionVO[];
  private dialogRef: MatDialogRef<DateRangePickerComponent>;
  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromTransaction.selectAllTransactionVOs),
      takeUntil(this.unsubscribe$)
    ).subscribe((transactionVOs) => {
      this.transactionVOs = transactionVOs;

      if (!!this.lineChart) {
        this.updateChartData(this.createChartData(this.selectedTransactionType))
      }
    });
  }

  ngAfterViewInit() {
    this.drawChart(this.createChartData(this.selectedTransactionType));
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeMonthRange() {
    this.dialogRef = this.dialog.open(DateRangePickerComponent, {
      width: '400px',
      height: '300px',
      disableClose: true,
      data: {
        startDate: this.startDate.toDate(),
        endDate: this.endDate.toDate(),
        minDate: this.today.subtract(1, 'year').toDate(),
        maxDate: this.today.endOf('month').toDate()
      }
    });

    this.dialogRef.afterClosed().pipe(take(1))
    .subscribe((result: { startDate: Date, endDate: Date }) => {
      if (!!result) {
        this.startDate = dayjs(result.startDate);
        this.endDate = dayjs(result.endDate);
        this.dateAxisScale = this.endDate.diff(this.startDate, 'day') <= 31 ? DateAxisScales.day : DateAxisScales.month;
        this.dateAxisFormat = this.dateAxisScale === DateAxisScales.day ? DateFormats.day : DateFormats.month;
        this.updateChartData(this.createChartData(this.selectedTransactionType));
      }
    });
  }

  changeTransactionType(type: TransactionType) {
    this.selectedTransactionType = type;
    this.lineChart.data.datasets.forEach((dataset: ChartDataSets) => {
      let lineColor;
      switch (type) {
        case TransactionType.spend:
          lineColor = dataset.label === '花费' ? this.spendColor : 'transparent';
          break;
        case TransactionType.income:
          lineColor = dataset.label === '收入' ? this.incomeColor : 'transparent';
          break;
        case TransactionType.both:
          lineColor = dataset.label === '收入' ? this.incomeColor : this.spendColor;
          break;
        default:
          lineColor = dataset.borderColor;
      }
      dataset.borderColor = lineColor;
      dataset.pointBackgroundColor = lineColor;
    });
    this.lineChart.update();
  }

  updateChartData(chartData: ChartData) {
    this.lineChart.data.labels = [...chartData.labels];
    this.lineChart.data.datasets = [...chartData.datasets];
    this.lineChart.update();
  }

  private createChartData(transactionType: TransactionType): ChartData {
    const spendSet: ChartDataSets = {
      ...this.defaultLineOption,
      data: [],
      borderColor: this.spendColor,
      pointBackgroundColor: transactionType === TransactionType.spend || transactionType === TransactionType.both ? this.spendColor : 'transparent',
      label: '花费',
    };
    const incomeSet: ChartDataSets = {
      ...this.defaultLineOption,
      data: [],
      borderColor: this.incomeColor,
      pointBackgroundColor: transactionType === TransactionType.income || transactionType === TransactionType.both ? this.incomeColor : 'transparent',
      label: '收入',
    };
    const labels: string[] = [];

    let datasets: ChartDataSets[];
    let periodSummaries: { [yearMonth: string]: PeriodSummary } = {};
    let tempDate = this.startDate;
    while (tempDate.isSameOrBefore(this.endDate)) {
      periodSummaries[tempDate.format(this.dateAxisFormat)] = getMonthSummary(this.transactionVOs, tempDate, this.dateAxisScale);
      tempDate = tempDate.add(1, this.dateAxisScale);
    }

    Object.keys(periodSummaries)
    .forEach((month) => {
      spendSet.data.push(periodSummaries[month].spend)
      incomeSet.data.push(periodSummaries[month].income)
      labels.push(month);
    });

    switch (transactionType) {
      case TransactionType.both:
        datasets = [
          spendSet,
          incomeSet
        ];
        break;
      case TransactionType.income:
        datasets = [
          { ...spendSet, borderColor: 'transparent' },
          incomeSet
        ];
        break;
      case TransactionType.spend:
        datasets = [
          spendSet,
          { ...incomeSet, borderColor: 'transparent' }
        ];
        break;
      default:
        datasets = [
          spendSet,
          incomeSet
        ];
    }

    return {
      datasets,
      labels: labels
    };
  }

  private drawChart(chartData: ChartData) {
    const ctx = this.myChart.nativeElement.getContext('2d');

    this.lineChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        legend: {
          display: false,
          position: 'right',
        },
      }
    });
  }
}
