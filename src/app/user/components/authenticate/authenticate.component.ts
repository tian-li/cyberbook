import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromUI, fromUser } from '@cyberbook/core/store';
import { login, register, saveTempUser } from '@cyberbook/core/store/user';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

const passwordNotMatch = 'passwordNotMatch';

@Component({
  selector: 'app-login',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
  animations: [
    trigger('fade', [
      state('show', style({ opacity: 1 })),
      state('hide', style({ opacity: 0 })),
      transition('show <=> hide', [animate('0.2s ease')]),
    ]),
    trigger('slideUp', [
      state('up', style({ transform: 'translateY(0%)' })),
      state('down', style({ transform: 'translateY(46%)' })),
      transition('up <=> down', [animate('0.2s ease')]),
    ]),
    trigger('slideDown', [
      state('up', style({ transform: 'translateY(-50%)' })),
      state('down', style({ transform: 'translateY(0%)' })),
      transition('up <=> down', [animate('0.2s ease')]),
    ]),
  ]
})
export class AuthenticateComponent implements OnInit, OnDestroy {
  readonly usernamePattern = new RegExp(/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/);
  // TODO: readonly passwordPattern =
  //  new RegExp(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?\/~_+-=|]).{8,32}$/);
  matcher = new MyErrorStateMatcher();
  userId!: string;
  form!: FormGroup;
  registerMode = true;

  slideDownState = 'up';
  slideUpState = 'down';
  fadeState = 'hide';

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.data.subscribe(data => {
      this.registerMode = data['registerMode'];
      if(this.registerMode) {
        this.animateToRegisterMode();
      } else {
        this.animateToLoginMode();
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(fromUI.hideToolbar());

    this.store.pipe(
      select(fromUser.selectUser),
      take(1),
    ).subscribe((user) => {
      this.userId = user.id!;

      this.form = this.fb.group({
        username: new FormControl({
          value: this.userId ? user.username : null,
          disabled: !this.registerMode
        }, Validators.required),
        confirmPassword: new FormControl({ value: null, disabled: !this.registerMode }, Validators.required),
        email: new FormControl(user.email, [Validators.email, Validators.required]),
        password: new FormControl(null, Validators.required),
      }, { validators: this.isPasswordMatch });
    });
  }

  ngOnDestroy() {
    this.store.dispatch(fromUI.showToolbar());
  }

  submit() {
    const formValue = this.form.value;

    if (this.registerMode) {

      if (!this.userId) {
        this.userId = uuid();
        this.store.dispatch(register({
          user: { username: formValue.username, email: formValue.email },
          // TODO: encrypt
          password: formValue.password
        }));
      } else {
        this.store.dispatch(saveTempUser({
          user: { username: formValue.username, email: formValue.email },
          // TODO: encrypt
          password: formValue.password
        }));
      }

    } else {
      this.store.dispatch(login({ email: formValue.email, password: formValue.password }));
    }
  }

  toggleRegisterMode() {
    this.registerMode = !this.registerMode;
    if (this.registerMode) {
      this.form.controls['username'].enable();
      this.form.controls['confirmPassword'].enable();
      this.animateToRegisterMode();
    } else {
      this.form.controls['username'].disable();
      this.form.controls['confirmPassword'].disable();
      this.animateToLoginMode();
    }
  }

  back() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private animateToRegisterMode() {
    this.slideDownState = 'down';
    this.slideUpState = 'up';
    this.fadeState = 'show';
  }

  private animateToLoginMode() {
    this.slideDownState = 'up';
    this.slideUpState = 'down';
    this.fadeState = 'hide';
  }

  private isPasswordMatch: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (!this.registerMode) {
      return null;
    }
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value ?
      null : { [passwordNotMatch]: true };
  };
}


class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return (control && control.touched && form && (form.hasError(passwordNotMatch) || control.hasError('required')))!;
  }
}
