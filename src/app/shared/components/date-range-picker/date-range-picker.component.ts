import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  formGroup!: FormGroup;
  matcher = new MyErrorStateMatcher();
  readonly inValidRange = 'inValidRange';

  constructor(
    private dialogRef: MatDialogRef<DateRangePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      startDate: Date,
      endDate: Date,
      minDate: Date,
      maxDate: Date
    },
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      startDate: new FormControl(this.data.startDate),
      endDate: new FormControl(this.data.endDate)
    }, { validators: this.rangeValidator });
  }

  rangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const startDate = control.get('startDate');
    const endDate = control.get('endDate');

    return startDate && endDate && dayjs(startDate.value).isBefore(dayjs(endDate.value)) ?
      null : { [this.inValidRange]: true };
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    this.dialogRef.close({ startDate: this.formGroup.value.startDate, endDate: this.formGroup.value.endDate });
  }

}

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (form && form.invalid)!;
  }
}
