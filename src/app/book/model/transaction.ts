export interface Transaction {
  id: number;
  bookId: number;
  amount: number;
  description: string;
  categoryId: number;
  dateCreated: string;
  dateModified: string;
}
