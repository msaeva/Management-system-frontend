import {Injectable} from "@angular/core";
import {API_URL, API_URL_ADMIN, API_URL_PM} from "@core/constants";
import {HttpClient, HttpParams} from "@angular/common/http";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {User} from "@core/types/users/user";
import {ProjectTask} from "@core/types/projects/project-task";
import {DetailedTask} from "@core/types/tasks/detailed-task";
import {Pagination} from "@core/types/pagination";
import {Pageable} from "@core/types/pageable";
import {ProjectUser} from "@core/types/projects/project-user";
import {ProjectTeam} from "@core/types/projects/project-team";
import {Project} from "@core/types/projects/project";
import {SimpleUser} from "@core/types/users/simple-user";
import {Observable} from "rxjs";

@Injectable({providedIn: 'root'})
export class ProjectService {

  constructor(private http: HttpClient) {
  }

  getUserProjects(): Observable<Project[]> {
    const url = API_URL + "/projects/user";
    return this.http.get<Project[]>(url);
  }

  getById(id: string | null): Observable<DetailedProject> {
    const url = API_URL + "/projects/" + id;
    return this.http.get<DetailedProject>(url);
  }

  getAll(): Observable<DetailedProject[]> {
    const url = API_URL_ADMIN + "/projects";
    return this.http.get<DetailedProject[]>(url);
  }

  getDetailedInfoById(id: number): Observable<DetailedProject> {
    const url = API_URL_ADMIN + "/projects/" + id;
    return this.http.get<DetailedProject>(url);
  }

  update(id: number, body: any): Observable<DetailedProject> {
    const url = API_URL_ADMIN + "/projects/" + id;
    return this.http.put<DetailedProject>(url, body);
  }

  deleteById(id: number | undefined): Observable<object> {
    const url = API_URL_ADMIN + "/projects/" + id;
    return this.http.delete(url);
  }

  create(project: any): Observable<DetailedProject> {
    const url = API_URL_ADMIN + "/projects";
    return this.http.post<DetailedProject>(url, project);
  }

  deleteTeamFromProject(teamId: number, projectId: number): Observable<object> {
    const url = API_URL_ADMIN + "/projects/" + projectId + "/teams/" + teamId;
    return this.http.delete(url);
  }

  addProjectManagers(projectId: number, pmIds: number[]): Observable<User[]> {
    const url = API_URL_ADMIN + "/projects/" + projectId + "/project-managers";
    return this.http.put<User[]>(url, pmIds);
  }

  removeProjectManager(projectId: number, pmId: number): Observable<User[]> {
    const url = `${API_URL_ADMIN}/projects/${projectId}/project-managers/${pmId}`;
    return this.http.delete<User[]>(url);
  }

  getProjectsWithTasks(): Observable<ProjectTask[]> {
    const url = `${API_URL_ADMIN}/projects/tasks`;
    return this.http.get<ProjectTask[]>(url);
  }

  getAllProjectTasks(projectId: number, pagination: Pagination): Observable<Pageable<DetailedTask>> {
    const url = `${API_URL_ADMIN}/projects/${projectId}/tasks`;
    let params = new HttpParams();

    Object.entries(pagination).filter((entry) => entry[0] !== "totalRecords")
      .forEach((entry) => {
        params = params.append(entry[0], entry[1]);
      });

    return this.http.get<Pageable<DetailedTask>>(url, {params: params});
  }

  getProjectsWithUsers(): Observable<ProjectUser[]> {
    const url = `${API_URL_ADMIN}/projects/users`;
    return this.http.get<ProjectUser[]>(url);
  }

  getAllProjectsWithTeams(): Observable<ProjectTeam[]> {
    const url = `${API_URL_ADMIN}/projects/teams`;
    return this.http.get<ProjectTeam[]>(url);
  }

  getPMProjectsWithTeams(): Observable<ProjectTeam[]> {
    const url = `${API_URL_PM}/projects/teams`;
    return this.http.get<ProjectTeam[]>(url);
  }

  getPMProjects(): Observable<Project[]> {
    const url = API_URL_PM + "/projects/user";
    return this.http.get<Project[]>(url);
  }

  getAllUsersInProject(projectId: number): Observable<SimpleUser[]> {
    const url = API_URL_PM + "/projects/" + projectId + "/users";
    return this.http.get<SimpleUser[]>(url);
  }
}
