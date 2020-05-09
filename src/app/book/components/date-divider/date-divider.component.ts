import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-date-divider',
  templateUrl: './date-divider.component.html',
  styleUrls: ['./date-divider.component.scss']
})
export class DateDividerComponent implements OnInit {
  readonly weekDays = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  @Input() date: Date;
  @Input() daySummary: { income: number, spend: number };

  constructor() {
  }

  ngOnInit(): void {
  }

  getDateDisplay(): string {
    return `${this.date.getMonth() + 1}月${this.date.getDate()}日 ${this.weekDays[this.date.getDay()]}`;
  }

}
