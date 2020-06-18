export interface Category {
  id: string;
  userId: string;
  sortOrder: number;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'spend';
  addedByUser: boolean;
}
