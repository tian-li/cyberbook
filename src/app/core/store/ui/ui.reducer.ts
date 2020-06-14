import { Action, createReducer, on } from '@ngrx/store';
import { defaultThemeName } from '@spend-book/shared/constants';
import { ISOString } from '../../../shared/model/helper-models';
import { disableDarkTheme, enableDarkTheme, hideToolbar, setDisplayMonth, setTheme, showToolbar } from './ui.actions';

const today = new Date();

export const uiFeatureKey = 'ui';

export interface State {
  displayMonth: ISOString;
  showToolbar: boolean;
  darkThemeEnabled: boolean;
  themeName: string;
}

export const initialState: State = {
  displayMonth: today.toISOString(),
  showToolbar: true,
  darkThemeEnabled: false,
  themeName: defaultThemeName
};

const reducer = createReducer(
  initialState,
  on(setDisplayMonth, (state, { displayMonth }) => ({ ...state, displayMonth })),
  on(showToolbar, (state) => ({ ...state, showToolbar: true })),
  on(hideToolbar, (state) => ({ ...state, showToolbar: false })),
  on(enableDarkTheme, (state) => ({ ...state, darkThemeEnabled: true, themeName: 'dark' })),
  on(disableDarkTheme, (state) => ({ ...state, darkThemeEnabled: false, themeName: 'default' })),
  on(setTheme, (state, { themeName }) => ({ ...state, themeName })),
);

export function uiReducer(
  state: State | undefined,
  action: Action
): State {
  return reducer(state, action);
}

