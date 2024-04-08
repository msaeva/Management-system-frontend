import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChipsModule} from "primeng/chips";
import {ButtonModule} from "primeng/button";
import {DividerModule} from "primeng/divider";
import {PasswordModule} from "primeng/password";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "@core/services/auth.service";
import {NgIf} from "@angular/common";
import {ToastService} from "@core/services/toast.service";

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

  constructor(private router: Router,
              private authService: AuthService,
              private toastService: ToastService) {
  }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.required, Validators.minLength(6)])
  });

  register() {
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'REGISTRATION SUCCESS!',
          life: 3000
        });
      },
      error: (err) => {
        this.registerForm.setErrors({ taken: true });

        this.toastService.showMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'REGISTRATION FAILED!',
          life: 3000
        });
      }
    })
  }
}
