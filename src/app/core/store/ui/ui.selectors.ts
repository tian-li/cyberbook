import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootState } from '@spend-book/core/store';
import * as fromUI from './ui.reducer';

const selectUIState = createFeatureSelector<RootState, fromUI.State>(
  fromUI.uiFeatureKey
);

export const selectDisplayMonth = createSelector(
  selectUIState,
  (state: fromUI.State) => state.displayMonth
);

export const selectShowToolbar = createSelector(
  selectUIState,
  (state: fromUI.State) => state.showToolbar
);

export const selectDarkThemeEnabled = createSelector(
  selectUIState,
  (state: fromUI.State) => state.darkThemeEnabled
);

export const selectThemeName = createSelector(
  selectUIState,
  (state: fromUI.State) => state.themeName
);

export const selectLoading = createSelector(
  selectUIState,
  (state: fromUI.State) => state.loading
);
