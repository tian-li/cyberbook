import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Category } from '../../model/category';

export const loadCategoriesByBook = createAction('[Category] Load Categories By Book', props<{ bookId: number }>());

export const loadCategoriesByBookSuccess = createAction('[Category] Load Categories By Book Success', props<{ categories: Category[] }>());

export const addCategory = createAction('[Category] Add Category', props<{ category: Partial<Category> }>());

export const addCategorySuccess = createAction('[Category] Add Category Success', props<{ category: Category }>());

export const updateCategory = createAction('[Category] Update Category', props<{ category: Partial<Category> }>());

export const updateCategorySuccess = createAction('[Category] Update Category Success', props<{ update: Update<Category> }>());

export const removeCategory = createAction('[Category] Remove Category', props<{ id: number }>());

export const removeCategorySuccess = createAction('[Category] Remove Category Success');
