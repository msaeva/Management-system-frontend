import {Injectable} from "@angular/core";
import {API_URL} from "@core/constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Project} from "@core/types/Project";
import {LocalStorageService} from "@core/services/local-storage.service";
import {Task} from "@core/types/Task";
import {SingleTask} from "@core/types/SingleTask";

@Injectable({
  providedIn: 'root'
})
export class SingleTaskService {
  constructor(private http: HttpClient) {
  }

  getById(id: number | undefined) {
    const url = API_URL + "/tasks/" + id;
    return this.http.get<SingleTask>(url);
  }
}

