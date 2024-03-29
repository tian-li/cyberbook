import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@cyberbook/core/model/category';
import { fromCategory, fromTransaction, fromUI, fromUser } from '@cyberbook/core/store';
import { loadCategoriesByUser, updateCategory } from '@cyberbook/core/store/category';
import { ConfirmationAlertComponent } from '@cyberbook/shared/components/confirmation-alert/confirmation-alert.component';
import { AlertLevel, TransactionTypes } from '@cyberbook/shared/constants';
import { SwipeResult } from '@cyberbook/shared/model/helper-models';
import { select, Store } from '@ngrx/store';
import { from, Observable, of, Subject } from 'rxjs';
import { concatMap, debounceTime, delay, filter, map, startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { CategoryEditorComponent } from '../category-editor/category-editor.component';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss'],
  animations: [
    trigger('toggleDragHandle', [
      state('true', style({ transform: 'translateX(0)', display: 'flex' })),
      state('false', style({ transform: 'translateX(100%)', display: 'none' })),
      transition('false => true', [
        sequence([
          style({ display: 'flex' }),
          animate('0.2s', style({ transform: 'translateX(0)' })),
        ])
      ]),
      transition('true => false', [
        sequence([
          animate('0.2s', style({ transform: 'translateX(100%)' })),
          style({ display: 'none' }),
        ]),
      ])
    ])
  ]
})
export class ManageCategoriesComponent implements OnInit, OnDestroy {
  readonly defaultCategoryType: string = TransactionTypes.spend;
  readonly categoryTypes = [
    { value: 'spend', display: '支出' },
    { value: 'income', display: '收入' },
  ];

  @ViewChild('list') list!: ElementRef;

  loading = false;

  categories!: Category[];
  sortingContainerData!: Category[];
  selectedCategoryType = this.defaultCategoryType;
  categoryTypeControl = new FormControl(this.defaultCategoryType);
  sortingMode = false;

  get navHeaderLeftIcon() {
    return this.sortingMode ? 'clear' : 'keyboard_arrow_left';
  }

  get navHeaderRightIcon() {
    return this.sortingMode ? 'done' : 'sort';
  }

  typeSwitcherConfig = {
    enabled: true,
    types: this.categoryTypes
  };

  theme$!: Observable<string | null>;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
              private dialog: MatDialog
  ) {
  }

  onLeftButtonClick() {
    if (this.sortingMode) {
      this.cancelCategoriesSorting();
    } else {
      this.back();
    }
  }

  onRightButtonClick() {
    if (this.sortingMode) {
      this.saveCategoriesSorting();
    } else {
      this.enableDragging();
    }
  }

  ngOnInit() {
    this.store.dispatch(fromUI.hideToolbar());
    this.store.dispatch(loadCategoriesByUser());

    this.theme$ = this.store.pipe(select(fromUser.selectTheme));

    this.categoryTypeControl.valueChanges.pipe(
      startWith(this.defaultCategoryType),
      switchMap((type) => this.store.pipe(select(fromCategory.selectAllSortedCategoriesByType(type)))),
      debounceTime(200),
      takeUntil(this.unsubscribe$)
    ).subscribe(categories => {
      this.loading = false;
      this.categories = [...categories];
      this.sortingContainerData = [...categories];
    });
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  changeCategoryType(type: string | boolean) {
    this.selectedCategoryType = <string>type;
    this.categoryTypeControl.setValue(type);
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  // add or edit category
  editCategory(category: Category) {
    this.openEditor({ category, editMode: true, allCategories: this.categories });
  }

  addCategory() {
    this.openEditor({ editMode: false, allCategories: this.categories });
  }

  // drag and sort
  enableDragging() {
    this.sortingMode = true;
  }

  saveCategoriesSorting() {
    this.disableDragging();
    this.dispatchMultipleActions(
      this.createUpdateSortingActions(this.getCategoriesNeedToUpdate(this.sortingContainerData))
    );
  }

  cancelCategoriesSorting() {
    this.sortingContainerData = [...this.categories];
    this.disableDragging();
  }

  drop(event: any) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  // delete category
  delete(swipeResult: SwipeResult, index: number) {
    if (!swipeResult.result) {
      return;
    }

    this.canDeleteCategory(this.categories[index]).pipe(take(1)).subscribe(result => {
      if (result) {
        this.doDelete(index);
      }
    });
  }

  trackByFn(index: number, item: Category): string {
    return item.id;
  }

  // add or edit category
  private openEditor(data: { editMode: boolean, allCategories: Category[], category?: Category }) {
    this.bottomSheet.open(CategoryEditorComponent, {
      data,
      disableClose: true,
    }).afterDismissed().pipe(
      filter(result => !!result),
      take(1)
    ).subscribe((editedCategory) => {
      this.saveEditedCategory(editedCategory, data.editMode);
    });
  }

  private saveEditedCategory(editedCategory: Partial<Category>, editMode: boolean) {
    if (editMode) {
      this.store.dispatch(fromCategory.updateCategory({ category: editedCategory }));
    } else {
      this.store.dispatch(fromCategory.addCategory({
        category: {
          ...editedCategory,
          addedByUser: true,
          sortOrder: this.categories.length,
          type: this.selectedCategoryType,
        } as Category
      }));
      this.list.nativeElement.scrollTo(0, this.list.nativeElement.scrollHeight);
    }
  }

  // drag and sort
  private disableDragging() {
    this.sortingMode = false;
  }

  private getCategoriesNeedToUpdate(updatedCategories: Category[]): Category[] {
    return updatedCategories.reduce((result: Category[], category: Category, index: number) => {
      if (this.categories[index].name !== category.name) {
        result.push({ ...category, sortOrder: index });
      }
      return result;
    }, []);
  }

  private createUpdateSortingActions(categoriesToUpdate: Category[]) {
    return categoriesToUpdate.map(category => updateCategory({ category }));
  }

  // delete category
  private canDeleteCategory(category: Category): Observable<boolean> {
    return this.getTransactionCountOfCategory(category).pipe(
      switchMap(count => {
        if (count < 1) {
          return of(true);
        } else {
          return this.openDeleteAlert(category, count);
        }
      })
    );
  }

  private doDelete(index: number) {
    this.sortingContainerData.splice(index, 1);
    const categoriesToUpdate: Category[] = [];

    for (let i = index + 1; i < this.categories.length; i++) {
      categoriesToUpdate.push({
        ...this.categories[i],
        sortOrder: this.categories[i].sortOrder - 1
      });
    }
    this.createUpdateSortingActions(categoriesToUpdate);

    this.dispatchMultipleActions([
      fromCategory.removeCategory({ id: this.categories[index].id }),
      ...this.createUpdateSortingActions(categoriesToUpdate)
    ]);
  }

  // TODO: currently, categories associated with transactions can't be deleted. Need to think if should allow this
  private openDeleteAlert(category: Category, count: number): Observable<boolean> {
    return this.dialog.open(ConfirmationAlertComponent, {
      width: '400px',
      height: '200px',
      disableClose: true,
      data: {
        message: `${category.name} 中有 ${count} 笔账目，暂时无法删除。`,
        alertLevel: AlertLevel.danger
      }
    }).afterClosed().pipe(map(response => false));
  }

  private getTransactionCountOfCategory(category: Category): Observable<number> {
    return this.store.pipe(
      select(fromTransaction.getTransactionCountByCategoryId(category.id)),
      take(1)
    );
  }

  // util
  private dispatchMultipleActions(actions: any[]) {
    if (actions.length <= 0) {
      return;
    }
    this.loading = true;
    from(actions).pipe(
      concatMap(a => of(a).pipe(delay(100))),
      take(actions.length)
    ).subscribe(action => {
      this.store.dispatch(action);
    });
  }

}
