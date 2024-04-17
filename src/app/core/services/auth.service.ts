import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {LocalStorageService} from "@core/services/local-storage.service";
import {DetailedUser} from "@core/types/users/detailed-user";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {User} from "@core/types/users/user";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService,
              private router: Router) {
  }

  login(username: string, password: string): Observable<string> {
    const url = API_URL + '/authenticate';

    const body = {username, password};
    return this.http.post(url, body, {responseType: 'text'});
  }

  logout() {
    this.localStorageService.removeToken();
    this.router.navigate(['/login']);
  }

  createAccount(user: any): Observable<DetailedUser> {
    const url = API_URL_ADMIN + "/users";
    return this.http.post<DetailedUser>(url, user);
  }

  register(user: any): Observable<User> {
    const url = API_URL + '/register';
    return this.http.post<User>(url, user);
  }
}
