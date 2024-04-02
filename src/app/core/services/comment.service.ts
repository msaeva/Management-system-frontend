import {Injectable} from "@angular/core";
import {API_URL} from "@core/constants";
import {HttpClient} from "@angular/common/http";
import {Comment} from "@core/types/Comment";


@Injectable({providedIn: 'root'})
export class CommentService {
  constructor(private http: HttpClient) {
  }

  getTaskComments(taskId: number) {
    const url = API_URL + "/tasks/" + taskId + "/comments";
    return this.http.get<Comment[]>(url);
  }

  createComment(body: any) {
    const url = API_URL + "/comments";
    return this.http.post<Comment>(url, body);
  }
}
