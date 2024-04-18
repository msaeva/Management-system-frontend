import {Injectable} from "@angular/core";
import {API_URL} from "@core/constants";
import {HttpClient} from "@angular/common/http";
import {Comment} from "@core/types/comments/comment";
import {Observable} from "rxjs";
import {CreateCommentData} from "@core/types/comments/create-comment-data";


@Injectable({providedIn: 'root'})
export class CommentService {
  constructor(private http: HttpClient) {
  }

  getTaskComments(taskId: number): Observable<Comment[]> {
    const url = API_URL + "/tasks/" + taskId + "/comments";
    return this.http.get<Comment[]>(url);
  }

  createComment(data: CreateCommentData): Observable<Comment> {
    const url = API_URL + "/comments";
    return this.http.post<Comment>(url, data);
  }

  deleteComment(id: number): Observable<void> {
    const url = API_URL + "/comments/" + id;
    return this.http.delete<void>(url);
  }

  updateComment(id: number, comment: string): Observable<Comment> {
    const url = API_URL + "/comments/" + id;
    return this.http.put<Comment>(url, comment);
  }
}
