import {Injectable} from "@angular/core";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {HttpClient} from "@angular/common/http";
import {DetailedProject} from "@core/types/DetailedProject";
import {User} from "@core/types/users/User";

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

  update(id: number | undefined, body: any) {
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
}
