import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Category } from '@cyberbook/core/model/category';
import * as fromCategory from './category.reducer';

const selectCategoryState = createFeatureSelector<fromCategory.State>(
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

export const selectAllSortedCategoriesByType = (type: 'income' | 'spend') => 
  createSelector(
    selectAllSortedCategories,
    (categories: Category[]) => {
      return categories.filter((c) => c.type === type);
    }
  );
