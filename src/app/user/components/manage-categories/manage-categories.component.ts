import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { fromCategory, fromUI, fromUser } from '@spend-book/core/store';
import { updateCategory } from '@spend-book/core/store/category';
import { CategoryEditorComponent } from '@spend-book/shared/components/category-editor/category-editor.component';
import { TransactionType, TransactionTypes } from '@spend-book/shared/constants';
import { from, Observable, of, Subject } from 'rxjs';
import { concatMap, debounceTime, delay, filter, startWith, switchMap, take, takeUntil } from 'rxjs/operators';

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
export class ManageCategoriesComponent implements OnInit {
  readonly TransactionType = TransactionTypes;
  readonly defaultCategoryType: TransactionType = TransactionTypes.spend;

  categories: Category[];
  sortingContainerData: Category[];
  selectedCategoryType = this.defaultCategoryType;
  categoryTypeControl = new FormControl(this.defaultCategoryType);
  themeName$: Observable<string>;
  sortingMode = false;
  userId: string;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet,
  ) {
  }

  ngOnInit() {
    this.store.dispatch(fromUI.hideToolbar());
    this.themeName$ = this.store.pipe(select(fromUI.selectThemeName));

    this.store.pipe(
      select(fromUser.selectUser),
      filter(user => !!user.id),
      take(1),
    ).subscribe(user => this.userId = user.id);

    this.categoryTypeControl.valueChanges.pipe(
      startWith(this.defaultCategoryType),
      switchMap((type) => this.store.pipe(select(fromCategory.selectAllSortedCategoriesByType, { type }))),
      debounceTime(500),
      takeUntil(this.unsubscribe$)
    ).subscribe(categories => {
      this.categories = [...categories];
      this.sortingContainerData = [...categories];
    });
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editCategory(category: Category) {
    this.openEditor({ category, editMode: true })
  }

  addCategory() {
    this.openEditor({ editMode: false });
  }

  delete(event) {
    console.log('delete', event)
  }

  enableDragging() {
    this.sortingMode = true;
  }

  saveCategoriesSorting() {
    this.disableDragging();
    this.updateSorting(this.getCategoriesNeedToUpdate(this.sortingContainerData))
  }

  cancelCategoriesSorting() {
    this.sortingContainerData = [...this.categories];
    this.disableDragging();
  }

  changeCategoryType(type: TransactionType) {
    this.selectedCategoryType = type;
    this.categoryTypeControl.setValue(type);
  }

  drop(event) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private openEditor(data: { editMode: boolean, category?: Category }) {
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
        category: <Category>{
          ...editedCategory,
          addedByUser: true,
          sortOrder: this.categories.length,
          type: this.selectedCategoryType,
          userId: this.userId
        }
      }));
    }
  }

  private disableDragging() {
    this.sortingMode = false;
  }

  private getCategoriesNeedToUpdate(updatedCategories: Category[]): Category[] {
    return updatedCategories.reduce((result, category, index) => {
      if (this.categories[index].name !== category.name) {
        result.push({ ...category, sortOrder: index })
      }
      return result
    }, []);
  }

  private updateSorting(categoriesToUpdate: Category[]) {
    from(categoriesToUpdate).pipe(
      concatMap(c => of(c).pipe(delay(200))),
      take(categoriesToUpdate.length)
    ).subscribe(category => {
      this.store.dispatch(updateCategory({ category }));
    });
  }

}
