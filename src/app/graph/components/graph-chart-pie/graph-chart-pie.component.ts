import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { fromTransaction, fromUI } from '@spend-book/core/store';
import { setDisplayMonth } from '@spend-book/core/store/ui';
import { YearMonthPickerComponent } from '@spend-book/shared/components/year-month-picker/year-month-picker.component';
import { TransactionType } from '@spend-book/shared/constants';
import { ISOString, SpendSummary } from '@spend-book/shared/model/helper-models';
import { Chart, ChartData } from 'chart.js'
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';


@Component({
  selector: 'app-graph-chart-pie',
  templateUrl: './graph-chart-pie.component.html',
  styleUrls: ['./graph-chart-pie.component.scss']
})
export class GraphChartPieComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly TransactionType = TransactionType;
  @ViewChild('myChart', { static: false }) myChart: ElementRef;
  transactionVOs: TransactionVO[];
  displayMonth: ISOString;
  selectedTransactionType = this.TransactionType.spend;
  pieChartData: ChartData = {
    datasets: [],
    labels: []
  }
  pieChart: Chart;
  spendTransactionVOs: TransactionVO[];
  incomeTransactionVOs: TransactionVO[];
  monthSummary: SpendSummary;
  dialogRef: MatDialogRef<any>;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.store.pipe(
      select(fromUI.selectDisplayMonth),
      tap(displayMonth => this.displayMonth = displayMonth),
      switchMap((displayMonth: ISOString) =>
        this.store.pipe(select(fromTransaction.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) }))
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(transactions => {
      // console.log('trans', transactions);
      this.transactionVOs = transactions;

      this.spendTransactionVOs = this.transactionVOs.filter(t => t.amount < 0);
      this.incomeTransactionVOs = this.transactionVOs.filter(t => t.amount > 0);

      if(!!this.pieChart) {
        this.updateChart(this.createChartData(TransactionType.spend));
      }

    });
  }

  ngAfterViewInit() {
    this.pieChartData = this.createChartData(TransactionType.spend);
    this.drawChart();
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

  changeTransactionType(type: TransactionType) {
    this.selectedTransactionType = type;

    this.updateChart(this.createChartData(type))
  }

  createChartData(transactionType: TransactionType): ChartData {
    const categorySummary: { [categoryName: string]: { amount: number, color: string } } = {};
    const amount: number[] = [];
    const labels: string[] = [];
    const colors: string[] = [];
    const transactionVOs = transactionType === TransactionType.spend ? this.spendTransactionVOs : this.incomeTransactionVOs;

    transactionVOs.forEach(transactionVO => {
      if(!!categorySummary[transactionVO.categoryName]) {
        categorySummary[transactionVO.categoryName].amount += transactionVO.amount
      } else {
        categorySummary[transactionVO.categoryName]= {
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
        backgroundColor:colors,
      }],
      labels: labels
    };
  }

  updateChart(chartData: ChartData) {
    this.pieChart.data.labels = [...chartData.labels];
    this.pieChart.data.datasets.forEach((dataset) => {
      dataset.data = chartData.datasets[0].data
    });
    this.pieChart.update();
  }

  drawChart() {
    const ctx = this.myChart.nativeElement.getContext('2d');

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: this.pieChartData,
      options: {
        responsive: true,
        aspectRatio: 1,
        legend: {
          display: true,
          position: 'right',
        }
      }
    },);

  }


  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
