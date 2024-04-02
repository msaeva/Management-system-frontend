import {Component, EventEmitter, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DetailedUser} from "@core/types/users/DetailedUser";
import {AuthService} from "@core/services/auth.service";
import {ToastService} from "@core/services/toast.service";
import {roleOptions} from "@core/constants";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    InputTextModule,
    NgIf,
    PasswordModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {

  @Output() newUserEvent = new EventEmitter<DetailedUser>();

  createUserFormGroup = this.formBuilder.group({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    role: new FormControl('Select a Role', [Validators.required])
  })

  constructor(private authService: AuthService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
  }

  createAccount() {
    this.authService.createAccount(this.createUserFormGroup.value).subscribe({
      next: (user: DetailedUser) => {

        const userToAdd: DetailedUser = {
          ...this.createUserFormGroup.value, id: user.id
        } as DetailedUser

        this.newUserEvent.emit(userToAdd);

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'User created successfully',
          life: 3000
        });

        this.createUserFormGroup.reset();
      },
      error: (err) => {
        console.log(err);
        this.toastService.showMessage({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create user',
          life: 3000
        });
      }
    })
  }

  protected readonly roleOptions = roleOptions;
}
