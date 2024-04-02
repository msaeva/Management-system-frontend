import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {Observable} from "rxjs";
import {Task} from "@core/types/Task";
import {DetailedTask} from "@core/types/DetailedTask";

@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient) {
  }

  getTasksByProject(projectId: string | null): Observable<Task[]> {
    const url = API_URL + "/projects/" + projectId + "/tasks";
    return this.http.get<Task[]>(url);
  }

  update(task: DetailedTask) {
    const url = API_URL_ADMIN + "/tasks";
    return this.http.put(url, task);
  }

  delete(taskId: number) {
    const url = API_URL_ADMIN + "/tasks/" + taskId;
    return this.http.delete(url);
  }

  create(task: any, projectId: number) {
    const body = {
        title: task.title,
        description: task.description,
        projectId: projectId,
      },

      url = API_URL_ADMIN + "/tasks";
    return this.http.post<DetailedTask>(url, body);
  }
}
