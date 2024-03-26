import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChipsModule} from "primeng/chips";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {PasswordModule} from "primeng/password";
import {HttpClient} from "@angular/common/http";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "@core/services/auth.service";
import {NgIf} from "@angular/common";

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
    RouterLink,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
  }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(3)]),
    email: new FormControl('', [Validators.email]),
    firstName: new FormControl('', [Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  register() {
    // const body = {
    //   username: this.registerForm.value.username,
    //   email: this.registerForm.value.email,
    //   firstName: this.registerForm.value.firstName,
    //   lastName: this.registerForm.value.lastName,
    //   password: this.registerForm.value.password,
    //   role: "USER"
    // };

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log('Register successful:', response)
        this.router.navigate(['/login']);
      },
      error: (err) => console.log(err)
    })
  }
}
