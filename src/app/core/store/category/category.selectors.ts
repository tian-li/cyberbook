import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Category } from '@cyberbook/core/model/category';
import * as fromCategory from './category.reducer';
import { RootState } from '@cyberbook/core/store';

const selectCategoryState = createFeatureSelector<RootState, fromCategory.State>(
  fromCategory.categoryFeatureKey
);

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

export const selectAllSortedCategories = createSelector(
  selectAllCategories,
  (categories: Category[]) => {
    return categories.sort((a, b) => a.sortOrder - b.sortOrder);
  }
);

export const selectAllSortedCategoriesByType = createSelector(
  selectAllSortedCategories,
  (categories: Category[], props: { type: 'income' | 'spend' }) => {
    return categories.filter((c) => c.type === props.type);
  }
);
