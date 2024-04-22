import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_URL, API_URL_ADMIN, API_URL_PM} from "@core/constants";
import {Meeting} from "@core/types/meetings/meeting";
import {DetailedMeeting} from "@core/types/meetings/detailed-meeting";
import {Observable} from "rxjs";
import {CreateMeetingData} from "@core/types/meetings/create-meeting-data";
import {UpdateMeetingData} from "@core/types/meetings/update-meeting-data";
import {LocalStorageService} from "@core/services/local-storage.service";
import {Role} from "@core/role.enum";

@Injectable({providedIn: 'root'})
export class MeetingService {
  constructor(private http: HttpClient,
              private localStorageService: LocalStorageService) {
  }

  getUserMeetings(): Observable<Meeting[]> {
    const url = API_URL + "/meetings";
    return this.http.get<Meeting[]>(url);
  }

  updateMeeting(id: number, body: UpdateMeetingData): Observable<Meeting> {
    const url = API_URL_ADMIN + "/meetings/" + id;
    return this.http.put<Meeting>(url, body);
  }

  getMeetings(userId: number | null, projectId: number | null): Observable<DetailedMeeting[]> {

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

  deleteMeeting(id: number): Observable<void> {
    const url = API_URL_ADMIN + "/meetings/" + id;
    return this.http.delete<void>(url);
  }

  createAdmin(body: CreateMeetingData): Observable<DetailedMeeting> {
    const url = API_URL_ADMIN + "/meetings";
    return this.http.post<DetailedMeeting>(url, body);
  }

  getPMMeetings(): Observable<DetailedMeeting[]> {
    const url = API_URL_PM + "/meetings";
    return this.http.get<DetailedMeeting[]>(url);
  }

  createPm(body: CreateMeetingData): Observable<DetailedMeeting> {
    const url = API_URL_PM + "/meetings";
    return this.http.post<DetailedMeeting>(url, body);
  }

  updateMeetingPM(id: number, body: UpdateMeetingData): Observable<Meeting> {
    const url = API_URL_PM + "/meetings/" + id;
    return this.http.put<Meeting>(url, body);
  }

  deleteMeetingPM(id: number): Observable<void> {
    const url = API_URL_PM + "/meetings/" + id;
    return this.http.delete<void>(url);
  }

  removeTeamFromMeeting(meetingId: number, teamId: number) {
    const role = this.localStorageService.getAuthUserRole();
    let url: string;

    if (role === Role.PM) {
      url = `${API_URL_PM}/meetings/${meetingId}/teams/${teamId}`;
    } else {
      url = `${API_URL_ADMIN}/meetings/${meetingId}/teams/${teamId}`;
    }

    return this.http.delete<DetailedMeeting>(url);
  }
}
