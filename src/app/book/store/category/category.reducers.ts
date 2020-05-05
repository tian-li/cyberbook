import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';

import { Category } from '../../model/category';
import { addCategorySuccess, loadCategoriesByBookSuccess, removeCategory, updateCategorySuccess } from './category.actions';

export interface State extends EntityState<Category> {
  selectedCategoryId: number;
}

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>();

export const initialState: State = adapter.getInitialState({
  selectedCategoryId: null,
});

const reducer = createReducer(
  initialState,
  on(loadCategoriesByBookSuccess, (state, { categories }) =>
    adapter.addMany(categories, { ...state, selectedCategoryId: null })
  ),
  on(addCategorySuccess, (state, { category }) =>
    adapter.addOne(category, { ...state, selectedCategoryId: category.id })
  ),
  on(updateCategorySuccess, (state, { update }) =>
    adapter.updateOne(update, { ...state, selectedCategoryId: update.id })
  ),
  on(removeCategory, (state, { id }) =>
    adapter.removeOne(id, { ...state, selectedCategoryId: null })
  ),
);

export function categoryReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

export const getSelectedCategoryId = (state: State) => state.selectedCategoryId;

// export const {
//   selectIds: selectCategoryIds,
//   selectEntities: selectCategoryEntities,
//   selectAll: selectAllCategories,
//   selectTotal: selectCategoryTotal,
// } = adapter.getSelectors();
