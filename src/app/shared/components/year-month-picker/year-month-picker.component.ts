import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { months, years } from '@cyberbook/shared/constants';

@Component({
  selector: 'app-year-month-picker',
  templateUrl: './year-month-picker.component.html',
  styleUrls: ['./year-month-picker.component.scss']
})
export class YearMonthPickerComponent implements OnInit {
  readonly allowedYears = years;
  readonly allMonths = months;

  formGroup: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<YearMonthPickerComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Date,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      year: new FormControl(this.data.getFullYear()),
      month: new FormControl(this.data.getMonth())
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ year: this.formGroup.value.year, month: this.formGroup.value.month });
  }
}
