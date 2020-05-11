import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-year-month-picker',
  templateUrl: './year-month-picker.component.html',
  styleUrls: ['./year-month-picker.component.scss']
})
export class YearMonthPickerComponent implements OnInit {
  readonly today: Date = new Date();

  years: number[] = [];
  months: string[] = [
    '一月',
    '二月',
    '三月',
    '四月',
    '五月',
    '六月',
    '七月',
    '八月',
    '九月',
    '十月',
    '十一月',
    '十二月',
  ];

  formGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<YearMonthPickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Date,
    private fb: FormBuilder
  ) {
    for(let i = this.today.getFullYear() - 5; i <= this.today.getFullYear() + 5; i++) {
      this.years.push(i);
    }
    // console.log(this.years)
  }

  ngOnInit(): void {
    // const year = this.data.substring(0,3);
    // const month =
    this.formGroup = this.fb.group({
      year: new FormControl(this.data.getFullYear()),
      month: new FormControl(this.data.getMonth())
    });
  }


  cancel() {
    this.dialogRef.close();
  }

  submit() {
    // console.log('value', this.formGroup.value)

    this.dialogRef.close({year: this.formGroup.value.year, month: this.formGroup.value.month});
  }
}
