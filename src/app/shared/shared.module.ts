import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { YearMonthPickerComponent } from '@spend-book/shared/components/year-month-picker/year-month-picker.component';
import { PreventScrollDirective } from '@spend-book/shared/directives/prevent-scroll.directive';
import { CategoryEditorComponent } from './components/category-editor/category-editor.component';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SwipeableItemComponent } from './components/swipeable-item/swipeable-item.component';
import { TransactionEditorComponent } from './components/transaction-editor/transaction-editor.component';
import { SwipeEventDirective } from './directives/swipe-event.directive';

const material = [
  MatButtonModule,
  MatToolbarModule,
  MatSelectModule,
  MatTabsModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatChipsModule,
  MatCardModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatListModule,
  MatMenuModule,
  MatIconModule,
  MatTooltipModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatDividerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatProgressBarModule,
  MatRippleModule,
  MatButtonToggleModule,
  MatTreeModule,
  DragDropModule,
  MatBottomSheetModule,
];

const components = [

  // components
  NavBarComponent,
  TransactionEditorComponent,
  YearMonthPickerComponent,
  DateRangePickerComponent,
  ConfirmationAlertComponent,
  SwipeableItemComponent,
  CategoryEditorComponent,

  // directives
  SwipeEventDirective,
  PreventScrollDirective,
];

@NgModule({
  declarations: [...components],
  imports: [CommonModule, ReactiveFormsModule, ...material, RouterModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ...material,
    ...components,

  ],
  entryComponents: [
    TransactionEditorComponent,
    YearMonthPickerComponent,
    DateRangePickerComponent,
    ConfirmationAlertComponent,
    CategoryEditorComponent,
  ]
})
export class SharedModule {
}
