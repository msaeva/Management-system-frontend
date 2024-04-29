import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL, API_URL_ADMIN, API_URL_PM} from "@core/constants";
import {Observable} from "rxjs";
import {Task} from "@core/types/tasks/task";
import {DetailedTask} from "@core/types/tasks/detailed-task";
import {SingleTask} from "@core/types/tasks/single-task";
import {CreateTaskData} from "@core/types/tasks/create-task-data";
import {UpdateTaskData} from "@core/types/tasks/update-task-data";
import {LocalStorageService} from "@core/services/local-storage.service";
import {Role} from "@core/role.enum";

@Injectable({providedIn: 'root'})
export class TaskService {
  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {
  }

  getTasksForUserTeamsByProjectId(projectId: number): Observable<Task[]> {
    const url = API_URL + "/projects/" + projectId + "/tasks";
    return this.http.get<Task[]>(url);
  }

  update(id: number, task: UpdateTaskData): Observable<SingleTask> {
    let url = API_URL_ADMIN + "/tasks/" + id;
    if (this.localStorageService.getAuthUserRole() == Role.PM) {
      url = API_URL_PM + "/tasks/" + id;
    } else if (this.localStorageService.getAuthUserRole() == Role.USER) {
      url = API_URL + "/tasks/" + id;
    }
    return this.http.put<SingleTask>(url, task);
  }

  updateStatus(taskId: number, status: string): Observable<Task> {
    const url = API_URL + "/tasks/" + taskId + "/status";
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

  deletePM(id: number): Observable<void> {
    const url = API_URL_PM + "/tasks/" + id;
    return this.http.delete<void>(url);
  }
}
