import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromCategory from './category.reducer';
import { RootState } from '@spend-book/core/store';

const selectCategoryState = createFeatureSelector<RootState, fromCategory.State>(
  fromCategory.categoryFeatureKey
);

// const selectCategoryEntitiesState = createSelector(
//   selectSpendBookState,
//   state => state.category
// );

export const selectSelectedCategoryId = createSelector(
  selectCategoryState,
  fromCategory.getSelectedCategoryId
);

export const {
  selectIds: selectCategoryIds,
  selectEntities: selectCategoryEntities,
  selectAll: selectAllCategories,
  selectTotal: selectCategoryTotal,
} = fromCategory.adapter.getSelectors(selectCategoryState);
