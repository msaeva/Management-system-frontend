import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL, API_URL_ADMIN, API_URL_PM} from "@core/constants";
import {Observable} from "rxjs";
import {Task} from "@core/types/tasks/task";
import {DetailedTask} from "@core/types/tasks/detailed-task";
import {SingleTask} from "@core/types/tasks/single-task";
import {CreateTaskData} from "@core/types/tasks/create-task-data";
import {UpdateTaskData} from "@core/types/tasks/update-task-data";

@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient) {
  }

  getTasksForUserTeamsByProjectId(projectId: number): Observable<Task[]> {
    const url = API_URL + "/projects/" + projectId + "/tasks";
    return this.http.get<Task[]>(url);
  }

  update(id: number, task: DetailedTask): Observable<void> {
    const url = API_URL_ADMIN + "/tasks/" + id;
    return this.http.put<void>(url, task);
  }

  updatePM(id: number, data: UpdateTaskData): Observable<SingleTask> {
    const url = API_URL_PM + "/tasks/" + id;
    return this.http.put<SingleTask>(url, data);
  }

  updateStatus(taskId: number, status: string): Observable<Task> {
    const url = API_URL + "/tasks/" + taskId;
    return this.http.put<Task>(url, status);
  }

  delete(taskId: number): Observable<void> {
    const url = API_URL_ADMIN + "/tasks/" + taskId;
    return this.http.delete<void>(url);
  }

  createTaskAdmin(data: CreateTaskData): Observable<DetailedTask> {
    const url = API_URL_ADMIN + "/tasks";
    return this.http.post<DetailedTask>(url, data);
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

  getById(id: number): Observable<SingleTask> {
    const url = API_URL + "/tasks/" + id;
    return this.http.get<SingleTask>(url);
  }

  createTaskPm(data: CreateTaskData): Observable<Task> {
    const url = API_URL_PM + "/tasks";
    return this.http.post<Task>(url, data);
  }

  assignUser(taskId: number, userId: number): Observable<Task> {
    const url = API_URL_PM + "/tasks/" + taskId + "/users/" + userId;
    return this.http.put<Task>(url, {});
  }

  deletePM(id: number): Observable<void> {
    const url = API_URL_PM + "/tasks/" + id;
    return this.http.delete<void>(url);
  }

  setCompletionTime(id: number, completionTime: number) {
    const url = API_URL + "/tasks/" + id + "/completion-time";
    return this.http.put<Task>(url, completionTime);
  }
}
