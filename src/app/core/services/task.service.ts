import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {API_URL} from "@core/constants";
import {LocalStorageService} from "@core/services/local-storage.service";
import {Observable} from "rxjs";
import {Task} from "@core/types/Task";

@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient) {
  }

  getTasksByProject(projectId: string | null): Observable<Task[]> {
    const url = API_URL + "/projects/" + projectId + "/tasks";
    return this.http.get<Task[]>(url);
  }
}
