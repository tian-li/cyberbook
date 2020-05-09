export interface Transaction {
  id: number;
  bookId: number;
  amount: number;
  description: string;
  categoryId: number;
  transactionDate: string;
  dateCreated: string;
  dateModified: string;
}
