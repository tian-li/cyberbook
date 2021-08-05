import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { defaultProfilePhoto, registeredDays, User } from '@cyberbook/core/model/user';
import { ImageUploadService } from '@cyberbook/core/services/image-upload.service';
import { fromTransaction, fromUI, fromUser } from '@cyberbook/core/store';
import { notifyWithSnackBar } from '@cyberbook/core/store/notification';
import { ConfirmationAlertComponent } from '@cyberbook/shared/components/confirmation-alert/confirmation-alert.component';
import { FeedbackComponent } from '@cyberbook/shared/components/feedback/feedback.component';
import { ImageEditorComponent } from '@cyberbook/shared/components/image-editor/image-editor.component';
import { AlertLevel, feedbackDialogId, UploadRole } from '@cyberbook/shared/constants';
import { select, Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent implements OnInit, OnDestroy {
  readonly defaultProfilePhoto = defaultProfilePhoto;
  user: User;
  registeredLength = 1;
  numberOfAllTransactions$: Observable<number>;
  darkThemeEnabled;
  @ViewChild('uploader') uploader: ElementRef;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private imageUploadService: ImageUploadService,
    // private matModal: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.numberOfAllTransactions$ = this.store.pipe(select(fromTransaction.selectTransactionTotal));
    this.store.pipe(
      select(fromUser.selectUser),
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User) => {
      console.log('user', user);
      this.user = user;
      this.registeredLength = registeredDays(this.user) + 1;
    });

    this.store.pipe(
      select(fromUI.selectDarkThemeEnabled),
      takeUntil(this.unsubscribe$)
    ).subscribe(darkThemeEnabled => this.darkThemeEnabled = darkThemeEnabled);
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  logout() {
    this.dialog.open(ConfirmationAlertComponent, {
      width: '400px',
      height: '200px',
      disableClose: true,
      data: {
        message: '确定退出登录吗？',
        alertLevel: AlertLevel.warn
      }
    }).afterClosed().pipe(
      takeUntil(this.unsubscribe$)
    ).subscribe((result) => {
      if (result === 'positive') {
        this.store.dispatch(fromUser.logout());
        this.router.navigate(['./login'], { relativeTo: this.route });
      }
    });
  }

  gotoAccountDetail() {
    if (this.user.registered) {
      this.router.navigate(['./profile'], { relativeTo: this.route });
    } else {
      this.router.navigate(['./register'], { relativeTo: this.route });
    }
  }

  goToMessageCenter() {
    this.router.navigate(['/message-center']);
  }

  selectTheme() {
    this.router.navigate(['./theme'], { relativeTo: this.route });
  }

  manageCategories() {
    this.router.navigate(['./category-management'], { relativeTo: this.route });
  }

  subscriptionManagement() {
    this.router.navigate(['./subscription-management'], { relativeTo: this.route });
  }

  openFeedbackForm() {
    this.dialog.open(FeedbackComponent, {
      id: feedbackDialogId,
      width: '400px',
      height: '400px',
      disableClose: true,
    }).afterClosed().pipe(
      take(1)
    ).subscribe((result) => {
      if (result === 'feedback success') {
        this.store.dispatch(notifyWithSnackBar({
          snackBar: {
            message: '信息已收到，感谢您的反馈！',
            duration: 2500,
            level: 'success'
          }
        }));
      }
    });
  }

  changeProfilePhoto() {
    this.uploader.nativeElement.click();
  }

  resetUploader(event) {
    event.target.value = '';
  }

  profileImageSelected(event) {
    if (event.target.files?.length > 0) {
      this.imageUploadService.image = event.target.files[0]
      // this.router.navigate(['/image-editor']);
      // this.dialog.open(ImageEditorComponent, {
      //   height: '450px',
      //   data: {
      //     image: event.target.files[0]
      //   }
      // })
      this.imageUploadService.uploadImage(event.target.files[0], UploadRole.Profile);
    }
  }
}
