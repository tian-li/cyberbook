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
  transactionDate: Date;
  dateCreated: Date;
  dateModified: Date;

  constructor(props) {
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
    this.transactionDate = new Date(props.transactionDate);
    this.dateCreated = new Date(props.dateCreated);
    this.dateModified = new Date(props.dateModified);
  }

}
