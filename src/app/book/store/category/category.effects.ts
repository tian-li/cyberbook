import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { notifyWithSnackBar } from '../../../core/store/notification/notification.actions';

import { Category } from '../../model/category';
import { CategoryService } from '../../services/category.service';
import {
  addCategory,
  addCategorySuccess,
  loadCategoriesByBook,
  loadCategoriesByBookSuccess,
  removeCategory,
  removeCategorySuccess,
  updateCategory,
  updateCategorySuccess
} from './category.actions';

@Injectable()
export class CategoryEffects {

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCategoriesByBook),
      switchMap(action =>
        this.categoryService.loadCategoriesByBook(action.bookId).pipe(
          map((categories: Category[]) => loadCategoriesByBookSuccess({ categories })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '类别载入失败，请稍后重试' } })))
        ))
    )
  );

  addCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCategory),
      mergeMap(action =>
        this.categoryService.addCategory(action.category).pipe(
          map((category: Category) => addCategorySuccess({ category })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '添加类别失败，请稍后重试' } })))
        ))
    )
  );

  updateCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCategory),
      mergeMap(action =>
        this.categoryService.updateCategory(action.category).pipe(
          map((category: Category) => updateCategorySuccess({ update: { id: category.id, changes: category } })),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '编辑类别失败，请稍后重试' } })))
        ))
    )
  );

  removeCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeCategory),
      mergeMap(action =>
        this.categoryService.removeCategory(action.id).pipe(
          map(() => removeCategorySuccess()),
          catchError(() => of(notifyWithSnackBar({ snackBar: { message: '删除类别失败，请稍后重试' } })))
        ))
    )
  );

  constructor(
    private actions$: Actions,
    private categoryService: CategoryService
  ) {
  }
}