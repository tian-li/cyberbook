import * as dayjs from 'dayjs';

import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export class TransactionVO {
  icon: string;
  id: string;
  userId: string;
  amount: number;
  description: string;
  subscriptionId: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryType: 'income' | 'spend';
  transactionDate: dayjs.Dayjs;
  dateCreated: dayjs.Dayjs;
  dateModified: dayjs.Dayjs;

  constructor(props: any) {
    this.icon = props.icon;
    this.id = props.id;
    this.userId = props.userId;
    this.amount = props.amount;
    this.description = props.description;
    this.subscriptionId = props.subscriptionId;
    this.categoryId = props.categoryId;
    this.categoryName = props.categoryName;
    this.categoryColor = props.categoryColor;
    this.categoryType = props.categoryType;
    this.transactionDate = dayjs(props.transactionDate);
    this.dateCreated = dayjs(props.dateCreated);
    this.dateModified = dayjs(props.dateModified);
  }

}
