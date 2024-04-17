import {Injectable} from "@angular/core";
import {API_URL} from "@core/constants";
import {HttpClient} from "@angular/common/http";
import {Comment} from "@core/types/comment";
import {Observable} from "rxjs";


@Injectable({providedIn: 'root'})
export class CommentService {
  constructor(private http: HttpClient) {
  }

  getTaskComments(taskId: number): Observable<Comment[]> {
    const url = API_URL + "/tasks/" + taskId + "/comments";
    return this.http.get<Comment[]>(url);
  }

  createComment(body: { comment: string; taskID: number | undefined }): Observable<Comment> {
    const url = API_URL + "/comments";
    return this.http.post<Comment>(url, body);
  }

  deleteComment(id: number): Observable<Object> {
    const url = API_URL + "/comments/" + id;
    return this.http.delete(url);
  }

  updateComment(id: number, value: string): Observable<Comment> {
    const url = API_URL + "/comments/" + id;
    return this.http.put<Comment>(url, value);
  }
}
