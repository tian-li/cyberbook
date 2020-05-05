export interface Category {
  id: number;
  bookId: number;
  name: string;
  icon: string;
  parentId?: number; // if parentId is null, this category is root category
}
