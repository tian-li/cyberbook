export interface Category {
  id: number;
  bookId: number;
  userId: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'spend';
  parentId?: number; // if parentId is null, this category is root category
}
