import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { fromTransaction, fromUI } from '@spend-book/core/store';
import { ISOString } from '@spend-book/shared/model/helper-models';
import { Chart } from 'chart.js'
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-graph-chart-pie',
  templateUrl: './graph-chart-pie.component.html',
  styleUrls: ['./graph-chart-pie.component.scss']
})
export class GraphChartPieComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('myChart', { static: false }) myChart: ElementRef;
  // @ViewChild('transactionType', { static: false }) transactionType: ElementRef;

  transactionVOs: TransactionVO[];
  displayMonth: ISOString;
  transactionType = 'spend';

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
      console.log('subs', transactions)
      this.transactionVOs = transactions;
    });
  }

  changeTransactionType(event) {
    console.log('event', event);
    this.drawChart(event === 'spend');
  }

  createChartData(spend: boolean): {
    amount: number[],
    label: string[]
  } {
    const amountByCategory = {};
    const chartData: {
      amount: number[],
      label: string[]
    } = { amount: [], label: [] }

    this.transactionVOs.filter(t => spend ? t.amount < 0 : t.amount > 0).forEach(transactionVO => {
      amountByCategory[transactionVO.categoryName] ?
        amountByCategory[transactionVO.categoryName] += transactionVO.amount :
        amountByCategory[transactionVO.categoryName] = transactionVO.amount;
    });

    Object.keys(amountByCategory).forEach(category => {
      chartData.amount.push(amountByCategory[category]);
      chartData.label.push(category);
    });
    return chartData;
  }

  drawChart(spend: boolean) {
    const chartData = this.createChartData(spend);
    console.log('chartData', chartData);
    const ctx = this.myChart.nativeElement.getContext('2d');
    const data2 = {
      datasets: [{
        data: chartData.amount
      }],
      labels: chartData.label
    };

    // console.log('daata', this.chartData)
    new Chart(ctx, {
      type: 'pie',
      data: data2,
      // options: options
      options: {
        responsive: false,
        display: true
      }
    },);
  }


  ngAfterViewInit() {
    this.drawChart(true);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
