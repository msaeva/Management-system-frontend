import {Injectable} from "@angular/core";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {User} from "@core/types/users/user";
import {ProjectTask} from "@core/types/projects/project-task";
import {DetailedTask} from "@core/types/detailed-task";
import {Pagination} from "@core/types/pagination";
import {Pageable} from "@core/types/pageable";
import {ProjectUser} from "@core/types/projects/project-user";

@Injectable({providedIn: 'root'})
export class ProjectService {
  constructor(private http: HttpClient) {
  }

  getUserProjects() {
    const url = API_URL + "/projects/user";
    return this.http.get(url);
  }

  getById(id: string | null) {
    const url = API_URL + "/projects/" + id;
    return this.http.get<DetailedProject>(url);
  }

  getAll() {
    const url = API_URL_ADMIN + "/projects";
    return this.http.get<DetailedProject[]>(url);
  }

  getDetailedInfoById(id: number) {
    const url = API_URL_ADMIN + "/projects/" + id;
    return this.http.get<DetailedProject>(url);
  }

  update(id: number, body: any) {
    const url = API_URL_ADMIN + "/projects/" + id;
    return this.http.put<DetailedProject>(url, body);
  }

  deleteById(id: number | undefined) {
    const url = API_URL_ADMIN + "/projects/" + id;
    return this.http.delete(url);
  }

  create(project: any) {
    const url = API_URL_ADMIN + "/projects";
    return this.http.post<DetailedProject>(url, project);
  }

  deleteTeamFromProject(teamId: number, projectId: number) {
    const url = API_URL_ADMIN + "/projects/" + projectId + "/teams/" + teamId;
    return this.http.delete(url);
  }

  addProjectManagers(projectId: number, pmIds: number[]) {
    const url = API_URL_ADMIN + "/projects/" + projectId + "/project-managers";
    return this.http.put<User[]>(url, pmIds);
  }

  removeProjectManager(projectId: number, pmId: number) {
    const url = `${API_URL_ADMIN}/projects/${projectId}/project-managers/${pmId}`;
    return this.http.delete<User[]>(url);
  }

  getProjectsWithTasks() {
    const url = `${API_URL_ADMIN}/projects/tasks`;
    return this.http.get<ProjectTask[]>(url);
  }

  getAllProjectTasks(projectId: number, pagination: Pagination) {
    const url = `${API_URL_ADMIN}/projects/${projectId}/tasks`;
    let params = new HttpParams();

    Object.entries(pagination).filter((entry) => entry[0] !== "totalRecords")
      .forEach((entry) => {
      params = params.append(entry[0], entry[1]);
    });

    return this.http.get<Pageable<DetailedTask>>(url, {params: params});
  }

  getProjectsWithUsers() {
    const url = `${API_URL_ADMIN}/projects/users`;
    return this.http.get<ProjectUser[]>(url);
  }
}
