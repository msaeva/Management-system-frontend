import {Component, OnDestroy} from '@angular/core';
import {DividerModule} from "primeng/divider";
import {ButtonModule} from "primeng/button";
import {ChipsModule} from "primeng/chips";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "@core/services/auth.service";
import {Subscription} from "rxjs";
import {LocalStorageService} from "@core/services/local-storage.service";
import {DEFAULT_ROUTING} from "@core/constants";
import {Role} from "@core/role.enum";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DividerModule,
    ButtonModule,
    ChipsModule,
    ReactiveFormsModule,
    NgIf,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  private subscriptions: Subscription = new Subscription();

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  constructor(private authService: AuthService,
              private router: Router,
              private localStorageService: LocalStorageService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  login() {
    this.subscriptions.add(
      this.authService.login(this.username!.value as string, this.password!.value as string)
        .subscribe({
            next: (response: string) => {
              this.localStorageService.setToken(response);

              const url = DEFAULT_ROUTING.get(this.localStorageService.getRole() as Role)
              this.router.navigate(['/', url]);
            },
            error: (error) => {
              console.log(error);
            }
          }
        )
    );
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
