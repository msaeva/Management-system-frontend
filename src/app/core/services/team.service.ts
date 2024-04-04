import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL_ADMIN} from "@core/constants";
import {User} from "@core/types/users/user";
import {Team} from "@core/types/team";

@Injectable({providedIn: 'root'})
export class TeamService {
  constructor(private http: HttpClient) {
  }

  addUsersToTeam(teamId: number, userIds: number[]) {
    const url = API_URL_ADMIN + "/teams/" + teamId + "/users/";
    return this.http.put<User[]>(url, userIds);
  }

  removeUserFromTeam(userId: number, teamId: number) {
    const url = API_URL_ADMIN + "/teams/" + teamId + "/users/" + userId;
    return this.http.delete(url);
  }

  createTeam(projectId: number | undefined) {
    const url = API_URL_ADMIN + "/teams";
    return this.http.post<Team>(url, {projectId});
  }
}
