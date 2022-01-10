import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromUI, fromUser } from '@cyberbook/core/store';
import { updateProfile } from '@cyberbook/core/store/user';
import { FullDate } from '@cyberbook/shared/model/helper-models';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  readonly usernamePattern = new RegExp(/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/);
  // readonly passwordPattern =
  // new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|]).{8,32}$/);

  userId!: string;
  form!: FormGroup;

  private unsubscribe$: Subject<void> = new Subject();

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.store.dispatch(fromUI.hideToolbar());

    this.store.pipe(
      select(fromUser.selectUser),
      takeUntil(this.unsubscribe$)
    ).subscribe((user) => {
      this.userId = user.id!;

      this.form = this.fb.group({
        username: new FormControl(user.username, Validators.required),
        email: new FormControl(user.email, [Validators.email, Validators.required]),
        gender: new FormControl(user.gender ? user.gender : 0, Validators.required),
        birthday: new FormControl(dayjs(user.birthday).toDate(), Validators.required),
      });
    });
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  save() {
    const formValue = this.form.value;
    const birthday = dayjs(formValue.birthday).startOf('day').format(FullDate);

    this.store.dispatch(updateProfile({
      user: {
        ...formValue,
        id: this.userId,
        birthday
      }
    }));
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }
}
