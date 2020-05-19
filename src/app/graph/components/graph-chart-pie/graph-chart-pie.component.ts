import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { fromTransaction, fromUI } from '@spend-book/core/store';
import { TransactionType } from '@spend-book/shared/constants';
import { ISOString } from '@spend-book/shared/model/helper-models';
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

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store) {
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
      this.transactionVOs = transactions;

      this.spendTransactionVOs = this.transactionVOs.filter(t => t.amount < 0);
      this.incomeTransactionVOs = this.transactionVOs.filter(t => t.amount > 0);

      this.updateChart(this.createChartData(TransactionType.spend));
    });
  }

  ngAfterViewInit() {
    this.pieChartData = this.createChartData(TransactionType.spend);
    this.drawChart();
  }

  changeTransactionType(type: TransactionType) {
    this.selectedTransactionType = type;

    this.updateChart(this.createChartData(type))
  }

  createChartData(transactionType: TransactionType): ChartData {
    const amountByCategory: { [categoryName: string]: number } = {};
    const amount: number[] = [];
    const labels: string[] = [];
    const transactionVOs = transactionType === TransactionType.spend ? this.spendTransactionVOs : this.incomeTransactionVOs;

    transactionVOs.forEach(transactionVO => {
      amountByCategory[transactionVO.categoryName] ?
        amountByCategory[transactionVO.categoryName] += transactionVO.amount :
        amountByCategory[transactionVO.categoryName] = transactionVO.amount;
    });

    Object.keys(amountByCategory)
    .map(categoryName => ({
      amount: Math.abs(Number.parseFloat(amountByCategory[categoryName].toFixed(2))),
      label: categoryName
    }))
    .sort((a, b) => b.amount - a.amount)
    .forEach((d) => {
      amount.push(d.amount);
      labels.push(d.label);
    });

    return {
      datasets: [{
        data: amount,
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(99, 255, 64, 0.6)',
          'rgba(223,195,110,0.6)'
        ],
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
