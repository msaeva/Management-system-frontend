import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChipsModule} from "primeng/chips";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {PasswordModule} from "primeng/password";
import {HttpClient} from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ChipsModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    PasswordModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private http: HttpClient, private router: Router) {
  }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(3)]),
    email: new FormControl('', [Validators.minLength(3)]),
    firstName: new FormControl('', [Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  register() {

    const url = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api/register';

    const body = {
      username: this.registerForm.value.username,
      email: this.registerForm.value.email,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      password: this.registerForm.value.password,
      role: "USER"
    };

    console.log("register")

    this.http.post(url, body).subscribe(
      (response) => {
        console.log('Register successful:', response)
        this.router.navigate(['/login']);
      },
      (error) => console.error('Login failed:', error)
    )
  }

}
