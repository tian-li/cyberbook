import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TransactionVO } from '@spend-book/core/model/transactionVO';
import { fromTransaction, fromUI } from '@spend-book/core/store';
import { ISOString, PeriodSummary } from '@spend-book/shared/model/helper-models';
import { Chart } from 'chart.js'
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-graph-home',
  templateUrl: './graph-home.component.html',
  styleUrls: ['./graph-home.component.scss']
})
export class GraphHomeComponent {
  // @ViewChild('myChart', { static: false }) myChart: ElementRef;
  // transactionVOs: TransactionVO[];
  // spendByCategory = {};
  // chartData: {
  //   amount: number[],
  //   label: string[]
  // } = { amount: [], label: [] }
  // displayMonth: ISOString;
  // getTransactionSummaryByMonth: PeriodSummary = {
  //   income: 0,
  //   spend: 0
  // };
  // private unsubscribe$: Subject<void> = new Subject();
  //
  // constructor(private store: Store) {
  // }
  //
  // ngOnInit(): void {
  //   this.store.pipe(
  //     select(fromUI.selectDisplayMonth),
  //     tap(displayMonth => this.displayMonth = displayMonth),
  //     switchMap((displayMonth: ISOString) =>
  //       this.store.pipe(select(fromTransaction.selectAllTransactionVOsByYearMonth, { displayMonth: new Date(displayMonth) }))
  //     ),
  //     takeUntil(this.unsubscribe$)
  //   ).subscribe(transactions => {
  //     console.log('subs', transactions)
  //     this.transactionVOs = transactions;
  //     // this.transactionVOs.forEach((transaction) => {
  //     //   if (transaction.amount > 0) {
  //     //     this.getTransactionSummaryByMonth.income += transaction.amount
  //     //   } else {
  //     //     this.getTransactionSummaryByMonth.spend -= transaction.amount
  //     //   }
  //     // });
  //
  //
  //     this.transactionVOs.filter(t => t.amount < 0).forEach(transactionVO => {
  //       this.spendByCategory[transactionVO.categoryName] ?
  //         this.spendByCategory[transactionVO.categoryName] += transactionVO.amount :
  //         this.spendByCategory[transactionVO.categoryName] = transactionVO.amount;
  //     });
  //
  //
  //     console.log('spendByCategory', this.spendByCategory)
  //
  //
  //     Object.keys(this.spendByCategory).forEach(category => {
  //       this.chartData.amount.push(this.spendByCategory[category]);
  //       this.chartData.label.push(category);
  //     });
  //
  //
  //   });
  // }
  //
  // ngAfterViewInit() {
  //   const ctx = this.myChart.nativeElement.getContext('2d');
  //   // const ctx = document.getElementById('myChart')
  //   console.log('ctx', ctx);
  //   const data = {
  //     datasets: [{
  //       data: [10, 20, 30]
  //     }],
  //
  //     // These labels appear in the legend and in the tooltips when hovering different arcs
  //     labels: [
  //       'Red',
  //       'Yellow',
  //       'Blue'
  //     ]
  //   };
  //
  //   const data2 = {
  //     datasets: [{
  //       data: this.chartData.amount
  //     }],
  //     labels: this.chartData.label
  //   };
  //
  //   console.log('daata', this.chartData)
  //   new Chart(ctx, {
  //     type: 'pie',
  //     data: data2,
  //     // options: options
  //     options: {
  //       responsive: false,
  //       display: true
  //     }
  //   },);
  // }
  //
  // ngOnDestroy() {
  //   this.unsubscribe$.next();
  //   this.unsubscribe$.complete();
  // }

}
