import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fromUI, fromUser } from '@spend-book/core/store';
import { login, register } from '@spend-book/core/store/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

const passwordNotMatch = 'passwordNotMatch';

@Component({
  selector: 'app-login',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit, OnDestroy {
  readonly usernamePattern = new RegExp(/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/);
  // TODO: readonly passwordPattern = new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|]).{8,32}$/);
  matcher = new MyErrorStateMatcher();
  userId;
  form: FormGroup;
  registerMode = true;

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
      this.userId = user.id;

      this.form = this.fb.group({
        username: new FormControl({
          value: this.userId ? user.username : null,
          disabled: !this.registerMode
        }, Validators.required),
        confirmPassword: new FormControl({ value: null, disabled: !this.registerMode }, Validators.required),
        email: new FormControl(user.email, [Validators.email, Validators.required]),
        password: new FormControl(null, Validators.required),
      }, { validators: this.isPasswordMatch });
    })
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  submit() {
    const formValue = this.form.value;

    if (this.registerMode) {

      // if (!this.userId) {
      //   this.userId = uuid();
        this.store.dispatch(register({
          user: { id: this.userId, username: formValue.username, email: formValue.email },
          // TODO: encrypt
          password: formValue.password
        }));
      // } else {
      //   this.store.dispatch(saveTempUser({
      //     user: { id: this.userId, username: formValue.username, email: formValue.email },
      //     // TODO: encrypt
      //     password: formValue.password
      //   }));
      // }

    } else {
      this.store.dispatch(login({ email: formValue.email, password: formValue.password }))
    }
  }

  toggleRegisterMode() {
    this.registerMode = !this.registerMode;
    if (this.registerMode) {
      this.form.controls.username.enable();
      this.form.controls.confirmPassword.enable();
    } else {
      this.form.controls.username.disable();
      this.form.controls.confirmPassword.disable();
    }
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private isPasswordMatch: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    if (!this.registerMode) {
      return null;
    }
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value ?
      null : { [passwordNotMatch]: true };
  }
}


class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return control && control.touched && form && (form.hasError(passwordNotMatch) || control.hasError('required'));
  }
}
