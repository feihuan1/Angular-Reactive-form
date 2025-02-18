import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  // import this in order to use it
  imports:[ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // creat a reactive form 
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })

  onSubmit(){
    this.form.value.email
  }
}
