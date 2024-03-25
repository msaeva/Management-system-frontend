import {HttpClient} from "@angular/common/http";
import {ActivatedRoute, Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {LocalStorageService} from "@core/services/local-storage.service";
import {DetailedUser} from "@core/types/DetailedUser";
import {API_URL_ADMIN} from "@core/constants";

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  login(username: string, password: string) {
    const url = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api/authenticate';

    const body = {username, password};
    return this.http.post(url, body, {responseType: 'text'});
  }

  logout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/login']);
  }

  createAccount(user: any) {
    const url = API_URL_ADMIN + "/users";
    const body = {
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      role: user.role
    };
    return this.http.post(url, body);
  }

  // register(user: any) {
  //   const url = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api/register';
  //
  //   const body = {
  //     username: this.registerForm.value.username,
  //     email: this.registerForm.value.email,
  //     firstName: this.registerForm.value.firstName,
  //     lastName: this.registerForm.value.lastName,
  //     password: this.registerForm.value.password,
  //     role: "USER"
  //   };
  // }
}
