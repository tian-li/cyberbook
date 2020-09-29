import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { addTransaction, updateTransaction } from '@cyberbook/core/store/transaction';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FeedbackComponent>,
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      feedback: new FormControl('', Validators.required)
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    // this.loading = true;
    //
    // const action = this.data.editMode ?
    //   updateTransaction({ transaction: this.editedTransaction }) :
    //   addTransaction({ transaction: this.editedTransaction });
    //
    // this.store.dispatch(action);
  }

}
