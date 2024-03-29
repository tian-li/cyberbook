import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUI from './ui.reducer';

const selectUIState = createFeatureSelector<fromUI.State>(
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

export const selectLoading = createSelector(
  selectUIState,
  (state: fromUI.State) => state.loading
);

export const selectIsWeChat = createSelector(
  selectUIState,
  (state: fromUI.State) => state.isWeChat
);

// export const selectIsWeChat = (selectUIState: { isWeChat: any; }) => selectUIState.isWeChat
