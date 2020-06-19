import { animate, sequence, state, style, transition, trigger } from '@angular/animations';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { fromCategory, fromUI } from '@spend-book/core/store';
import { CategoryEditorComponent } from '@spend-book/shared/components/category-editor/category-editor.component';
import { TransactionType } from '@spend-book/shared/constants';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

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
  readonly TransactionType = TransactionType;
  readonly defaultCategoryType: TransactionType = TransactionType.spend;

  categories: Category[];
  selectedTransactionType = this.defaultCategoryType;
  categoryTypeControl = new FormControl(this.defaultCategoryType);
  themeName$: Observable<string>;

  sortingMode = false;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private store: Store,
              private router: Router,
              private route: ActivatedRoute,
              private bottomSheet: MatBottomSheet
  ) {
  }


  ngOnInit() {
    this.store.dispatch(fromUI.hideToolbar());
    this.themeName$ = this.store.pipe(select(fromUI.selectThemeName));

    this.categoryTypeControl.valueChanges.pipe(
      startWith(this.defaultCategoryType),
      switchMap((type) => this.store.pipe(select(fromCategory.selectAllSortedCategoriesByType, { type }))),
      takeUntil(this.unsubscribe$)
    ).subscribe(categories => {
      this.categories = categories;
    });
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  editCategory(category: Category) {
    this.bottomSheet.open(CategoryEditorComponent, {
      data: { category, editMode: true },
      disableClose: true
    })
  }

  delete(event) {
    console.log('delete', event)
  }

  enableDragging() {
    this.sortingMode = true;
  }

  disableDragging() {
    this.sortingMode = false;
  }

  saveCategoriesSorting() {
    this.disableDragging();
  }

  cancelCategoriesSorting() {
    this.disableDragging();
  }

  changeTransactionType(type: TransactionType) {
    console.log('changeTransactionType', type)
    this.selectedTransactionType = type;
    this.categoryTypeControl.setValue(type);
  }

  drop(event) {
    console.log('ondrop', event)
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
