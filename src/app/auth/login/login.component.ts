import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, of } from 'rxjs';

// custom validator
function mustContainQuestionMark(control: AbstractControl) {
  if (control.value.includes('?')) {
    return null;
  }

  return {
    doesNotContainQuestionMark: true,
  };
}

// custom async validator -> return observable
function emailIsUniue(control: AbstractControl) {
  if (control.value !== 'pengfeihuan@gmail.com') {
    return of(null);
  }
  return of({ notUnique: true });
}

// this only works if its a pure client side app without any server side rendering
let initialEmailValue = ''
const savedForm = window.localStorage.getItem('saved-login-form')
if(savedForm){
  const loadedForm = JSON.parse(savedForm)
  initialEmailValue = loadedForm.email
}

@Component({
  selector: 'app-login',
  standalone: true,
  // import this in order to use it
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private destroyRef = inject(DestroyRef)

  // creat a reactive form
  form = new FormGroup({
    email: new FormControl(initialEmailValue, {
      validators: [Validators.email, Validators.required],
      asyncValidators: [emailIsUniue],
    }),
    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(6),
        mustContainQuestionMark,
      ],
    }),
  });

  get emailIsValid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }
  get passwordIsValid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  ngOnInit(): void {
    // const savedForm = window.localStorage.getItem('saved-login-form')
    // if(savedForm){
    //   const loadedForm = JSON.parse(savedForm)
    //   // updatepart of form
    //   this.form.patchValue({
    //     ...loadedForm
    //   })
    // }

    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next: (value) => {
        window.localStorage.setItem(
          'saved-login-form',
          JSON.stringify({ email: value.email })
        );
      },
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe())
  }

  onSubmit() {
    console.log(this.form.value.email);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
  }
}
