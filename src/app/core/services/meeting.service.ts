import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL, API_URL_ADMIN} from "@core/constants";
import {Meeting} from "@core/types/meeting";
import {DetailedMeeting} from "@core/types/detailed-meeting";

@Injectable({providedIn: 'root'})
export class MeetingService {
  constructor(private http: HttpClient) {
  }

  getUserMeetings() {
    const url = API_URL + "/meetings";
    return this.http.get<Meeting[]>(url);
  }

  updateMeeting(id: number, body: any) {
    const url = API_URL_ADMIN + "/meetings/" + id;
    return this.http.put<Meeting>(url, body);
  }

  getMeetings(userId: number | null, projectId: number | null) {

    let url = API_URL_ADMIN + "/meetings";
    if (userId !== null || projectId !== null) {
      url += "?";
      if (userId !== null) {
        url += "userId=" + userId;
      }
      if (projectId !== null) {
        url += (userId !== null ? "&" : "") + "projectId=" + projectId;
      }
    }

    return this.http.get<DetailedMeeting[]>(url);
  }

  deleteMeeting(id: number) {
    const url = API_URL_ADMIN + "/meetings/" + id;
    return this.http.delete(url);
  }
}
