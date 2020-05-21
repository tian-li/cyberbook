import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
import { HeaderComponent } from '@spend-book/shared/components/header/header.component';
import { YearMonthPickerComponent } from '@spend-book/shared/components/year-month-picker/year-month-picker.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { TransactionEditorComponent } from './components/transaction-editor/transaction-editor.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';

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
  MatTreeModule
];

const components = [
  NavBarComponent,
  TransactionEditorComponent,
  HeaderComponent,
  YearMonthPickerComponent
];


@NgModule({
  declarations: [...components, DateRangePickerComponent],
  imports: [CommonModule, ReactiveFormsModule, ...material, RouterModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    ...material,
    ...components
  ],
  entryComponents: [
    TransactionEditorComponent,
    YearMonthPickerComponent,
    DateRangePickerComponent
  ]
})
export class SharedModule {
}
