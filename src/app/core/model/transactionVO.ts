export class TransactionVO {
  icon: string;
  id: number;
  bookId: number;
  amount: number;
  description: string;
  categoryId: number;
  categoryName: string;
  transactionDate: Date;
  dateCreated: Date;
  dateModified: Date;

  constructor(props) {
    this.icon = props.icon;
    this.id = props.id;
    this.bookId = props.bookId;
    this.amount = props.amount;
    this.description = props.description;
    this.categoryId = props.categoryId;
    this.categoryName = props.categoryName;
    this.transactionDate = new Date(props.transactionDate);
    this.dateCreated = new Date(props.dateCreated);
    this.dateModified = new Date(props.dateModified);
  }

}
