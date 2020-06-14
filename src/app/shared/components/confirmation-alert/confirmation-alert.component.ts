import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertLevel, defaultNegativeAction, defaultPositiveAction } from '@spend-book/shared/constants';
import { ConfirmationAlertData } from '@spend-book/shared/model/helper-models';

@Component({
  selector: 'app-confirmation-alert',
  templateUrl: './confirmation-alert.component.html',
  styleUrls: ['./confirmation-alert.component.scss']
})
export class ConfirmationAlertComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationAlertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationAlertData,
  ) { }

  get alertIconColor() {
    switch (this.data.alertLevel) {
      case AlertLevel.danger:
        return '#f44336';
      case AlertLevel.warn:
        return '#ffca28';
      default:
        return '#78909c'
    }
  }

  get positiveAction() {
    return this.data.positiveAction ? this.data.positiveAction : defaultPositiveAction;
  }

  get negativeAction() {
    return this.data.negativeAction ? this.data.negativeAction : defaultNegativeAction;
  }

  onNegativeClick() {
    this.dialogRef.close('negative');
  }

  onPositiveClick() {
    this.dialogRef.close('positive');
  }

}
