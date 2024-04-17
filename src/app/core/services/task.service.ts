import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL, API_URL_ADMIN, API_URL_PM} from "@core/constants";
import {Observable} from "rxjs";
import {Task} from "@core/types/tasks/task";
import {DetailedTask} from "@core/types/tasks/detailed-task";
import {SingleTask} from "@core/types/tasks/single-task";

@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient) {
  }

  getTasksForUserTeamsByProjectId(projectId: number): Observable<Task[]> {
    const url = API_URL + "/projects/" + projectId + "/tasks";
    return this.http.get<Task[]>(url);
  }

  update(id: number, task: DetailedTask): Observable<object> {
    const url = API_URL_ADMIN + "/tasks/" + id;
    return this.http.put(url, task);
  }

  updatePM(id: number, body: any): Observable<SingleTask> {
    const url = API_URL_PM + "/tasks/" + id;
    return this.http.put<SingleTask>(url, body);
  }

  updateStatus(taskId: number, status: string): Observable<string> {
    const url = API_URL + "/tasks/" + taskId;
    return this.http.put(url, status, {responseType: 'text'});
  }

  delete(taskId: number): Observable<object> {
    const url = API_URL_ADMIN + "/tasks/" + taskId;
    return this.http.delete(url);
  }

  createTaskAdmin(task: any, projectId: number): Observable<DetailedTask> {
    const body = {
      title: task.title,
      description: task.description,
      projectId: projectId,
    }

    const url = API_URL_ADMIN + "/tasks";
    return this.http.post<DetailedTask>(url, body);
  }

  setEstimationTime(id: number, estimationTime: number): Observable<Task> {
    const url = API_URL + "/tasks/" + id + "/estimation-time";
    return this.http.put<Task>(url, estimationTime);
  }

  changeProgress(id: number, progress: number): Observable<Task> {
    const url = API_URL + "/tasks/" + id + "/progress";
    return this.http.put<Task>(url, progress);

  }

  getAllTasksByProject(projectId: number): Observable<Task[]> {
    const url = API_URL_PM + "/projects/" + projectId + "/tasks";
    return this.http.get<Task[]>(url);
  }

  getById(id: number | undefined) {
    const url = API_URL + "/tasks/" + id;
    return this.http.get<SingleTask>(url);
  }

  createTaskPm(task: any, projectId: number): Observable<Task> {
    const body = {
      title: task.title,
      description: task.description,
      projectId: projectId,
      userId: task.assignee ? task.assignee.id : null
    }
    console.log(body)

    const url = API_URL_PM + "/tasks";
    return this.http.post<Task>(url, body);
  }

  assignUser(taskId: number, userId: number): Observable<Task> {
    const url = API_URL_PM + "/tasks/" + taskId + "/users/" + userId;
    return this.http.put<Task>(url, {});
  }

  deletePM(id: number): Observable<object> {
    const url = API_URL_PM + "/tasks/" + id;
    return this.http.delete(url);
  }
}
