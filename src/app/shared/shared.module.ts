import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { RouterModule } from '@angular/router';
import { YearMonthPickerComponent } from '@cyberbook/shared/components/year-month-picker/year-month-picker.component';
import { PreventScrollDirective } from '@cyberbook/shared/directives/prevent-scroll.directive';
import { TouchDragEventDirective } from '@cyberbook/shared/directives/touch-drag-event.directive';
import { ImageUrlPipe } from '@cyberbook/shared/pipes/image-url.pipe';
import { ConfirmationAlertComponent } from './components/confirmation-alert/confirmation-alert.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { NavHeaderComponent } from './components/nav-header/nav-header.component';
import { SwipeableItemComponent } from './components/swipeable-item/swipeable-item.component';
import { TransactionEditorComponent } from './components/transaction-editor/transaction-editor.component';
import { TypeSwitcherComponent } from './components/type-switcher/type-switcher.component';
import { SwipeEventDirective } from './directives/swipe-event.directive';
import { ImageEditorComponent } from './components/image-editor/image-editor.component';

const material = [
  MatButtonModule,
  MatBadgeModule,
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
  MatRadioModule,
  MatExpansionModule,
];

const components = [
  // modals
  TransactionEditorComponent,
  YearMonthPickerComponent,
  DateRangePickerComponent,
  ConfirmationAlertComponent,

  // components
  NavBarComponent,
  SwipeableItemComponent,
  TypeSwitcherComponent,
  NavHeaderComponent,

  // directives
  SwipeEventDirective,
  PreventScrollDirective,
  TouchDragEventDirective,

  // pipes
  ImageUrlPipe
];

@NgModule({
    declarations: [...components, FeedbackComponent, ImageEditorComponent],
    imports: [CommonModule, ReactiveFormsModule, ...material, RouterModule],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        ...material,
        ...components,
    ]
})
export class SharedModule {
}
