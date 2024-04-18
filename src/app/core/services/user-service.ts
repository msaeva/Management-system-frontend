import {Injectable} from "@angular/core";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DetailedUser} from "@core/types/users/detailed-user";
import {SimpleUser} from "@core/types/users/simple-user";
import {Pagination} from "@core/types/pagination";
import {Pageable} from "@core/types/pageable";
import {Observable} from "rxjs";
import {UpdateUserData} from "@core/types/users/update-user-data";
import {ChangePasswordData} from "@core/types/users/change-password-data";
import {UpdateUserProfile} from "@core/types/users/update-user-profile";

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getAllUsers(pagination: Pagination): Observable<Pageable<DetailedUser>> {
    const url = API_URL_ADMIN + "/users";

    let params = new HttpParams();

    Object.entries(pagination).filter((entry) => entry[0] !== "totalRecords")
      .forEach((entry) => {
        params = params.append(entry[0], entry[1]);
      });

    return this.http.get<Pageable<DetailedUser>>(url, {params: params});
  }

  deleteById(id: number): Observable<void> {
    const url = API_URL_ADMIN + "/users/" + id.toString();
    return this.http.delete<void>(url);
  }

  updateAdmin(data: UpdateUserData): Observable<DetailedUser> {
    const url = API_URL_ADMIN + "/users/";
    return this.http.put<DetailedUser>(url, data);
  }

  getByRole(roles: string[]): Observable<SimpleUser[]> {
    const url = API_URL_ADMIN + "/users/roles?roles=" + roles.join(',');
    return this.http.get<SimpleUser[]>(url);
  }

  getAuthUser(): Observable<DetailedUser> {
    const url = API_URL + "/users/profile"
    return this.http.get<DetailedUser>(url);
  }

  changePassword(data: ChangePasswordData): Observable<void> {
    const url = API_URL + "/users/change-password"
    return this.http.put<void>(url, data);
  }

  updateProfile(data: UpdateUserProfile): Observable<DetailedUser> {
    const url = API_URL + "/users"
    return this.http.put<DetailedUser>(url, data);
  }
}
