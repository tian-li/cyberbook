import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { PrivateMessage } from '@cyberbook/core/model/private-message';
import { fromUser } from '@cyberbook/core/store';
import { sendFeedback } from '@cyberbook/core/store/private-message';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  formGroup!: FormGroup;
  userId!: string;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FeedbackComponent>,
    private store: Store
  ) {
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      message: new FormControl('', Validators.required)
    });

    this.store.pipe(select(fromUser.selectUser), take(1)).subscribe(user => {
      this.userId = user.id!;
    });
  }

  cancel() {
    this.dialogRef.close();
  }

  submit() {
    const message = this.formGroup.get('message')?.value;
    const privateMessage: Partial<PrivateMessage> = {
      message,
      fromUserId: this.userId
    };
    this.store.dispatch(sendFeedback({ privateMessage }));
  }

}
