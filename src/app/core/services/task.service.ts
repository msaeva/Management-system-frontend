import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {Observable} from "rxjs";
import {Task} from "@core/types/tasks/task";
import {DetailedTask} from "@core/types/tasks/detailed-task";

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

  updateStatus(taskId: number, status: string) {
    const url = API_URL + "/tasks/" + taskId;

    return this.http.put(url, status, {responseType: 'text'});
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

  setEstimationTime(id: number, estimationTime: number) {
    const url = API_URL + "/tasks/" + id + "/estimation-time";
    return this.http.put<Task>(url, estimationTime);
  }

  changeProgress(id: number, progress: number) {
    const url = API_URL + "/tasks/" + id + "/progress";
    return this.http.put<Task>(url, progress);

  }
}
