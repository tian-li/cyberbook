import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { logout } from '@cyberbook/core/store/user/user.actions';
import { Category } from '../../model/category';
import {
  addCategory,
  addCategorySuccess,
  loadCategoriesByUser,
  loadCategoriesByUserSuccess,
  removeCategory,
  updateCategory,
  updateCategorySuccess
} from './category.actions';

export const categoryFeatureKey = 'category';

export interface State extends EntityState<Category> {
  selectedCategoryId: string | number | null;
}

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>({
  selectId: (category: Category) => category.id,
  sortComparer: false,
});

export const initialState: State = adapter.getInitialState({
  selectedCategoryId: null,
});

const reducer = createReducer(
  initialState,
  on(loadCategoriesByUserSuccess, (state, { categories }) =>
    adapter.setAll(categories, { ...state, selectedCategoryId: null })
  ),
  on(addCategorySuccess, (state, { category }) =>
    adapter.setOne(category, { ...state, selectedCategoryId: category.id })
  ),
  on(updateCategorySuccess, (state, { update }) =>
    adapter.updateOne(update, { ...state, selectedCategoryId: update.id })
  ),
  on(removeCategory, (state, { id }) =>
    adapter.removeOne(id, { ...state, selectedCategoryId: null })
  ),
  on(logout, (state) => initialState),
);

export function categoryReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

export const getSelectedCategoryId = (state: State) => state.selectedCategoryId;
