import { Update } from '@ngrx/entity';
import { createAction, props } from '@ngrx/store';
import { Category } from '../../model/category';

export const loadCategoriesByUser = createAction('[Category] Load Categories By User');
export const loadCategoriesByUserSuccess = createAction(
  '[Category] Load Categories By User Success',
  props<{ categories: Category[] }>()
);

export const addCategory = createAction('[Category] Add Category', props<{ category: Category }>());
export const addCategorySuccess = createAction('[Category] Add Category Success', props<{ category: Category }>());

export const updateCategory = createAction('[Category] Update Category', props<{ category: Partial<Category> }>());
export const updateCategorySuccess = createAction(
  '[Category] Update Category Success',
  props<{ update: Update<Category> }>()
);

export const removeCategory = createAction('[Category] Remove Category', props<{ id: string }>());
export const removeCategorySuccess = createAction('[Category] Remove Category Success');
