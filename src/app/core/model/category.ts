export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'spend';
  addedByUser: boolean;
}
