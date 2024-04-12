import {Component, OnInit} from '@angular/core';
import {UserService} from "@core/services/user-service";
import {DetailedUser} from "@core/types/users/detailed-user";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    ButtonModule
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
  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    this.userService.getAuthUser().subscribe({
      next: (response) => {
        this.user = response;
        this.loading = false;
        console.log(this.user)
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  changePassword() {
    if (this.changePasswordForm.valid && this.changePasswordForm.value.newPassword === this.changePasswordForm.value.repeatedPassword) {
      this.userService.changePassword();
    } else {
      this.changePasswordForm.get('repeatedPassword')?.setErrors({ 'passwordMismatch': true });
    }
    console.log(this.changePasswordForm.value)
  }
}
