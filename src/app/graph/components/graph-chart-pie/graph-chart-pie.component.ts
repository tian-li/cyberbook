import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TransactionVO } from '@cyberbook/core/model/transactionVO';
import { fromTransaction, fromUI } from '@cyberbook/core/store';
import { setDisplayMonth } from '@cyberbook/core/store/ui';
import { YearMonthPickerComponent } from '@cyberbook/shared/components/year-month-picker/year-month-picker.component';
import { TransactionTypes } from '@cyberbook/shared/constants';
import { ISOString } from '@cyberbook/shared/model/helper-models';
import { select, Store } from '@ngrx/store';
import { Chart, ChartData } from 'chart.js';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-graph-chart-pie',
  templateUrl: './graph-chart-pie.component.html',
  styleUrls: ['./graph-chart-pie.component.scss']
})
export class GraphChartPieComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly categoryTypes = [
    { value: 'spend', display: '支出' },
    { value: 'income', display: '收入' },
  ];

  @ViewChild('myChart', { static: false }) myChart: ElementRef;
  transactionVOs: TransactionVO[];
  displayMonth: ISOString;
  selectedTransactionType: string = TransactionTypes.spend;
  pieChartData: ChartData = {
    datasets: [],
    labels: []
  };
  pieChart: Chart;
  spendTransactionVOs: TransactionVO[];
  incomeTransactionVOs: TransactionVO[];
  dialogRef: MatDialogRef<any>;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromUI.selectDisplayMonth),
      tap(displayMonth => this.displayMonth = displayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(
          select(fromTransaction.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) })
        )
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(transactions => {
      this.transactionVOs = transactions;

      this.spendTransactionVOs = this.transactionVOs.filter(t => t.amount < 0);
      this.incomeTransactionVOs = this.transactionVOs.filter(t => t.amount > 0);

      if (!!this.pieChart) {
        this.updateChart(this.createChartData(this.selectedTransactionType));
      }
    });
  }

  ngAfterViewInit() {
    this.pieChartData = this.createChartData(TransactionTypes.spend);
    this.drawChart();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  previousMonth() {
    this.store.dispatch(setDisplayMonth({ displayMonth: dayjs(this.displayMonth).subtract(1, 'month').toISOString() }));
  }

  nextMonth() {
    this.store.dispatch(setDisplayMonth({ displayMonth: dayjs(this.displayMonth).add(1, 'month').toISOString() }));
  }

  changeMonth() {
    this.dialogRef = this.dialog.open(YearMonthPickerComponent, {
      width: '400px',
      height: '300px',
      disableClose: true,
      data: new Date(this.displayMonth)
    });

    this.dialogRef.afterClosed().pipe(takeUntil(this.unsubscribe$))
    .subscribe(result => {
      if (!!result) {
        const yearMonth = new Date();
        yearMonth.setFullYear(result.year, result.month);
        this.store.dispatch(setDisplayMonth({ displayMonth: yearMonth.toISOString() }));
      }
    });
  }

  changeTransactionType(type: string) {
    this.selectedTransactionType = type;

    this.updateChart(this.createChartData(type));
  }

  private createChartData(transactionType: string): ChartData {
    const categorySummary: { [categoryName: string]: { amount: number, color: string } } = {};
    const amount: number[] = [];
    const labels: string[] = [];
    const colors: string[] = [];
    const transactionVOs = transactionType === TransactionTypes.spend ?
      this.spendTransactionVOs : this.incomeTransactionVOs;

    if (transactionVOs.length <= 0) {
      return this.defaultChartData;
    }

    transactionVOs.forEach(transactionVO => {
      if (!!categorySummary[transactionVO.categoryName]) {
        categorySummary[transactionVO.categoryName].amount += transactionVO.amount;
      } else {
        categorySummary[transactionVO.categoryName] = {
          amount: transactionVO.amount,
          color: transactionVO.categoryColor
        };
      }
    });

    Object.keys(categorySummary)
    .map(categoryName => ({
      amount: Math.abs(Number.parseFloat(categorySummary[categoryName].amount.toFixed(2))),
      label: categoryName,
      color: categorySummary[categoryName].color
    }))
    .sort((a, b) => b.amount - a.amount)
    .forEach((d) => {
      amount.push(d.amount);
      labels.push(d.label);
      colors.push(d.color);
    });

    return {
      datasets: [{
        data: amount,
        backgroundColor: colors,
        borderWidth: 0,
      }],
      labels
    };
  }

  private updateChart(chartData: ChartData) {
    this.pieChart.data.labels = [...chartData.labels];
    this.pieChart.data.datasets.forEach((dataset) => {
      dataset.data = chartData.datasets[0].data;
      dataset.backgroundColor = chartData.datasets[0].backgroundColor;
    });

    this.pieChart.update();
  }

  private drawChart() {
    const ctx = this.myChart.nativeElement.getContext('2d');

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: this.pieChartData,
      options: {
        responsive: true,
        aspectRatio: 1,
        legend: {
          display: true,
          position: 'left',
        }
      }
    });
  }

  private get defaultChartData() {
    return Object.create({
      datasets: [{
        data: [100],
        backgroundColor: ['rgba(0, 0, 0, 0.1)']
      }],
      labels: ['暂无']
    });
  }
}
