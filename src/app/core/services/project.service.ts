import {Injectable} from "@angular/core";
import {API_URL, JWT_LOCAL_STORAGE_KEY} from "@core/constants";
import {AuthService} from "@core/services/auth.service";
import {Router} from "@angular/router";
import {LocalStorageService} from "@core/services/local-storage.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project} from "@core/types/Project";

@Injectable({providedIn: 'root'})
export class ProjectService {
  constructor(private localStorageService: LocalStorageService, private http: HttpClient) {
  }

  getUserProjects() {
    const url = API_URL + "/projects/user";
    return this.http.get(url);
  }

  getById(id: string | null) {
    const url = API_URL + "/projects/" + id;
    return this.http.get<Project>(url);
  }
}
