import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Category } from '@spend-book/core/model/category';
import { fromCategory, fromUI } from '@spend-book/core/store';
import { TransactionType } from '@spend-book/shared/constants';
import { SwipeInfo } from '@spend-book/shared/model/helper-models';
import { Observable, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manage-categories',
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.scss']
})
export class ManageCategoriesComponent implements OnInit {
  readonly TransactionType = TransactionType;
  readonly defaultCategoryType: TransactionType = TransactionType.spend;
  categories: Category[];
  selectedTransactionType = this.defaultCategoryType;
  categoryTypeControl = new FormControl(this.defaultCategoryType);

  sortingMode = false;

  private unsubscribe$: Subject<void> = new Subject();


  constructor(private store: Store, private router: Router,
              private route: ActivatedRoute) {
  }

  themeName$: Observable<string>;

  ngOnInit() {
    this.store.dispatch(fromUI.hideToolbar());

    this.themeName$ = this.store.pipe(
      select(fromUI.selectThemeName)
    )

    this.categoryTypeControl.valueChanges.pipe(
      startWith(this.defaultCategoryType),
      switchMap((type) => {
        return this.store.pipe(
          select(fromCategory.selectAllSortedCategoriesByType, { type })
        )
      }),
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


  onSwipe(swipeInfo: SwipeInfo) {
    console.log('onSwipe', swipeInfo)
  }


  onEndSwipe(swipeInfo: SwipeInfo) {
    console.log('onEndSwipe', swipeInfo)

  }

  cancelSwipe() {
    console.log('cancelSwipe')

  }

  enableDragging() {
    this.sortingMode = true;
  }

  saveCategoriesSorting() {
    this.sortingMode = false;
  }

  cancelCategoriesSorting() {
    this.sortingMode = false;
  }

  changeTransactionType(type: TransactionType) {
    console.log('changeTransactionType', type)
    this.selectedTransactionType = type;
    this.categoryTypeControl.setValue(type);
  }

  drop(event) {
    console.log('ondrop', event)
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

      console.log('updated category', this.categories)

    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  spend() {
    // this.categoryType = 'spend'
    this.categoryTypeControl.setValue('spend');
  }

  income() {
    // this.categoryType = 'income'
    this.categoryTypeControl.setValue('income');

  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

}
