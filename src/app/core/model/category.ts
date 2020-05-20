export interface Category {
  id: number;
  bookId: number;
  name: string;
  icon: string;
  color: string;
  parentId?: number; // if parentId is null, this category is root category
}
