import {Injectable} from "@angular/core";
import {API_URL} from "@core/constants";
import {HttpClient} from "@angular/common/http";
import {SingleTask} from "@core/types/tasks/single-task";

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

