import {Component, OnInit} from '@angular/core';
import {UserService} from "@core/services/user-service";
import {DetailedUser} from "@core/types/users/detailed-user";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ButtonModule} from "primeng/button";
import {AuthService} from "@core/services/auth.service";
import {ToastService} from "@core/services/toast.service";
import {PasswordModule} from "primeng/password";
import {ChangePasswordData} from "@core/types/users/change-password-data";
import {UpdateUserProfile} from "@core/types/users/update-user-profile";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  user!: DetailedUser;
  loading: boolean = true;

  changePasswordForm = new FormGroup({
    oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatedPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });
  updateProfileForm!: FormGroup;

  constructor(private userService: UserService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.loadUser();
  }

  initializeUpdateProfileFormGroup(): void {
    this.updateProfileForm = this.formBuilder.group({
      firstName: [
        {value: this.user.firstName, disabled: true},
        [Validators.required, Validators.minLength(4)]
      ],
      lastName: [
        {value: this.user.lastName, disabled: true},
        [Validators.required, Validators.minLength(4)]
      ],
      email: [
        {value: this.user.email, disabled: true}
      ],
      username: [
        {value: this.user.username, disabled: true}
      ],
    })
  }

  loadUser(): void {
    this.userService.getAuthUser().subscribe({
      next: (response) => {
        this.user = response;
        this.loading = false;
        this.initializeUpdateProfileFormGroup();

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  changePassword(): void {
    if (this.changePasswordForm.valid && this.changePasswordForm.value.newPassword === this.changePasswordForm.value.repeatedPassword) {

      const body: ChangePasswordData = {
        oldPassword: this.changePasswordForm.value?.oldPassword ?? '',
        newPassword: this.changePasswordForm.value?.newPassword ?? '',
      }

      this.userService.changePassword(body).subscribe({
        next: (response) => {
          this.authService.logout();
        },
        error: (err) => {
          if (err.status === 400) {
            this.changePasswordForm.get('oldPassword')?.setErrors({'incorrectPassword': true});
            this.toastService.showMessage({
              severity: 'error',
              summary: 'Error',
              detail: 'INVALID OLD PASSWORD!',
              life: 3000
            });
          }
        }
      });
    } else {
      this.changePasswordForm.get('repeatedPassword')?.setErrors({'passwordMismatch': true});
    }
  }

  updateProfile(): void {
    const data: UpdateUserProfile = {
      id: this.updateProfileForm.value.id,
      firstName: this.updateProfileForm.value.firstName,
      lastName: this.updateProfileForm.value.lastName,
    }

    this.userService.updateProfile(data).subscribe({
      next: (response) => {
        this.user = response;
        this.toggleEditMode();

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully updated!',
          life: 3000
        });

      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  cancelUpdateMeeting(): void {
    this.initializeUpdateProfileFormGroup();
  }

  toggleEditMode(): void {
    const func = this.updateProfileForm.get('firstName')!.disabled ? 'enable' : 'disable';

    this.updateProfileForm.controls['firstName'][func]();
    this.updateProfileForm.controls['lastName'][func]();
  }
}
