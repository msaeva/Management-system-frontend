import {Injectable} from "@angular/core";
import {API_URL_ADMIN} from "@core/constants";
import {HttpClient} from "@angular/common/http";
import {DetailedUser} from "@core/types/DetailedUser";

@Injectable({providedIn: 'root'})
export class UserService {
  constructor(private http: HttpClient) {
  }

  getAllUsers() {
    const url = API_URL_ADMIN + "/users";
    return this.http.get<DetailedUser[]>(url);
  }

  deleteById(id: number) {
    const url = API_URL_ADMIN + "/users/" + id.toString();
    console.log(url)
    return this.http.delete(url);
  }

  update(user: DetailedUser) {
    const url = API_URL_ADMIN + "/users/";

    const body = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    return this.http.put(url, body);
  }
}