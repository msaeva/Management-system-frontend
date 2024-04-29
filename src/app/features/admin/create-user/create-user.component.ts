import {Component, DestroyRef, EventEmitter, inject, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DetailedUser} from "@core/types/users/detailed-user";
import {AuthService} from "@core/services/auth.service";
import {ToastService} from "@core/services/toast.service";
import {roleOptions} from "@core/constants";
import {RegisterUserData} from "@core/types/users/register-user-data";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
  destroyRef = inject(DestroyRef);

  @Output() newUserEvent = new EventEmitter<DetailedUser>();

  createUserFormGroup = this.formBuilder.group({
    username: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
    email: new FormControl('',
      [
        Validators.required, Validators.email,
        Validators.maxLength(25)
      ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
    lastName: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30)
    ]),
    role: new FormControl(roleOptions[1].value, [
      Validators.required
    ])
  })

  constructor(private authService: AuthService,
              private toastService: ToastService,
              private formBuilder: FormBuilder) {
  }

  createAccount(): void {
    const data: RegisterUserData = {
      username: this.createUserFormGroup.value.username ?? '',
      email: this.createUserFormGroup.value.email ?? '',
      firstName: this.createUserFormGroup.value.firstName ?? '',
      lastName: this.createUserFormGroup.value.lastName ?? '',
      password: this.createUserFormGroup.value.password ?? '',
      role: this.createUserFormGroup.value.role ?? ''
    }

    this.authService.createAccount(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
        error: () => {
          this.createUserFormGroup.setErrors({taken: true});

          this.toastService.showMessage({
            severity: 'error',
            summary: 'Error',
            detail: 'REGISTRATION FAILED!',
            life: 3000
          });
        }
      })
  }

  protected readonly roleOptions = roleOptions;
}
