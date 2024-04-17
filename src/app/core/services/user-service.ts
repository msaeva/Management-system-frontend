import {Injectable} from "@angular/core";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DetailedUser} from "@core/types/users/detailed-user";
import {SimpleUser} from "@core/types/users/simple-user";
import {Pagination} from "@core/types/pagination";
import {Pageable} from "@core/types/pageable";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getAllUsers(pagination: Pagination) {
    const url = API_URL_ADMIN + "/users";

    let params = new HttpParams();

    Object.entries(pagination).filter((entry) => entry[0] !== "totalRecords")
      .forEach((entry) => {
        params = params.append(entry[0], entry[1]);
      });

    return this.http.get<Pageable<DetailedUser>>(url, {params: params});
  }

  deleteById(id: number): Observable<object> {
    const url = API_URL_ADMIN + "/users/" + id.toString();
    return this.http.delete(url);
  }

  updateAdmin(user: DetailedUser): Observable<object> {
    const url = API_URL_ADMIN + "/users/";

    const body = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    return this.http.put(url, body);
  }

  getByRole(roles: string[]): Observable<SimpleUser[]> {
    const url = API_URL_ADMIN + "/users/roles?roles=" + roles.join(',');
    return this.http.get<SimpleUser[]>(url);
  }

  getAuthUser(): Observable<DetailedUser> {
    const url = API_URL + "/users/profile"
    return this.http.get<DetailedUser>(url);
  }

  changePassword(body: any): Observable<object> {
    const url = API_URL + "/users/change-password"
    return this.http.put(url, body);
  }

  updateProfile(body: any): Observable<DetailedUser> {
    const url = API_URL + "/users"
    return this.http.put<DetailedUser>(url, body);
  }
}
