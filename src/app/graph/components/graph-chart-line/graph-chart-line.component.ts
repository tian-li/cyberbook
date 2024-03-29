import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionVO } from '@cyberbook/core/model/transactionVO';
import { fromTransaction } from '@cyberbook/core/store';
import { DateRangePickerComponent } from '@cyberbook/shared/components/date-range-picker/date-range-picker.component';
import { TransactionTypes } from '@cyberbook/shared/constants';
import { PeriodSummary } from '@cyberbook/shared/model/helper-models';
import { getMonthSummary } from '@cyberbook/shared/utils/get-month-summary';
import { select, Store } from '@ngrx/store';
import { Chart, ChartData, ChartDataSets } from 'chart.js';
import * as dayjs from 'dayjs';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
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
  readonly today = dayjs();
  readonly defaultLineOption = {
    backgroundColor: 'transparent',
    lineTension: 0,
    borderWidth: 2,
    pointBorderWidth: 2,
  };
  readonly incomeColor = 'green';
  readonly spendColor = 'red';
  readonly categoryTypes = [
    { value: 'both', display: '合并' },
    { value: 'spend', display: '支出' },
    { value: 'income', display: '收入' },
  ];

  @ViewChild('myChart', { static: false }) myChart!: ElementRef;
  startDate = this.today.subtract(4, 'month').date(1);
  endDate = this.today.endOf('month');
  selectedTransactionType: string = TransactionTypes.both;
  dateAxisFormat = DateFormats.month;
  transactionVOs!: TransactionVO[];

  private lineChart!: Chart;
  private dateAxisScale = DateAxisScales.month;
  private dialogRef!: MatDialogRef<DateRangePickerComponent>;
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
        this.updateChartData(this.createChartData(this.selectedTransactionType));
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

  changeTransactionType(type: string | boolean) {
    this.selectedTransactionType = <string>type;
    this.lineChart.data.datasets!.forEach((dataset: ChartDataSets) => {
      let lineColor: string;
      switch (type) {
        case TransactionTypes.spend:
          lineColor = dataset.label === '花费' ? this.spendColor : 'transparent';
          break;
        case TransactionTypes.income:
          lineColor = dataset.label === '收入' ? this.incomeColor : 'transparent';
          break;
        case TransactionTypes.both:
          lineColor = dataset.label === '收入' ? this.incomeColor : this.spendColor;
          break;
        default:
          lineColor = <string>dataset.borderColor!;
      }
      dataset.borderColor = lineColor;
      dataset.pointBackgroundColor = lineColor;
    });
    this.lineChart.update();
  }

  updateChartData(chartData: ChartData) {
    this.lineChart.data.labels = [...chartData.labels!];
    this.lineChart.data.datasets = [...chartData.datasets!];
    this.lineChart.update();
  }

  private createChartData(transactionType: string): ChartData {
    const spendSet: ChartDataSets = {
      ...this.defaultLineOption,
      data: [],
      borderColor: this.spendColor,
      pointBackgroundColor: transactionType === TransactionTypes.spend || transactionType === TransactionTypes.both ?
        this.spendColor : 'transparent',
      label: '花费',
    };
    const incomeSet: ChartDataSets = {
      ...this.defaultLineOption,
      data: [],
      borderColor: this.incomeColor,
      pointBackgroundColor: transactionType === TransactionTypes.income || transactionType === TransactionTypes.both ?
        this.incomeColor : 'transparent',
      label: '收入',
    };
    const labels: string[] = [];

    let datasets: ChartDataSets[];
    const periodSummaries: { [yearMonth: string]: PeriodSummary } = {};
    let tempDate = this.startDate;
    while (tempDate.isSameOrBefore(this.endDate)) {
      periodSummaries[tempDate.format(this.dateAxisFormat)] = getMonthSummary(
        this.transactionVOs, tempDate, this.dateAxisScale
      );
      tempDate = tempDate.add(1, this.dateAxisScale);
    }

    Object.keys(periodSummaries)
    .forEach((month) => {
      spendSet.data!.push(periodSummaries[month].spend);
      incomeSet.data!.push(periodSummaries[month].income);
      labels.push(month);
    });

    switch (transactionType) {
      case TransactionTypes.both:
        datasets = [
          spendSet,
          incomeSet
        ];
        break;
      case TransactionTypes.income:
        datasets = [
          { ...spendSet, borderColor: 'transparent' },
          incomeSet
        ];
        break;
      case TransactionTypes.spend:
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
      labels
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
