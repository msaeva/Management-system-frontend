import {Component, Input, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {SingleTaskService} from "@core/services/single-task.service";
import {SingleTask} from "@core/types/single-task";
import {CardModule} from "primeng/card";
import {AvatarModule} from "primeng/avatar";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CommentService} from "@core/services/comment.service";
import {DatePipe, NgForOf} from "@angular/common";
import {Comment} from "@core/types/comment";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-detailed-task',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule,
    CardModule,
    AvatarModule,
    InputTextareaModule,
    NgForOf,
    FormsModule
  ],
  templateUrl: './detailed-task.component.html',
  styleUrl: './detailed-task.component.scss'
})
export class DetailedTaskComponent implements OnInit {
  @Input() id: number | undefined;
  task: SingleTask | undefined;
  comments: Comment[] = [];
  newCommentInput: string = '';

  constructor(private singleTaskService: SingleTaskService,
              private commentService: CommentService,
              private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.loadTask();
    console.log(this.id)
    // TODO add loading
    this.loadComments(this.id!);
  }

  loadComments(taskId: number) {
    this.commentService.getTaskComments(taskId).subscribe({
      next: (response) => {
        this.comments = response;
        console.log(response);
        console.log(this.comments);
      }, error: () => {
        console.log("Error loading tasks");
      }
    })
  }

  loadTask() {
    this.singleTaskService.getById(this.id).subscribe({
      next: (task: SingleTask) => {
        this.task = task;
      }, error: () => {
        console.log("Error loading tasks");
      }
    });
  }


  formatDateTime(dateTime: string | null): string {
    if (!dateTime) {
      return '';
    }
    return this.datePipe.transform(new Date(dateTime), 'medium') || '';
  }

  postComment() {
    const body = {
      comment: this.newCommentInput,
      taskID: this.task?.id
    };
    this.commentService.createComment(body).subscribe({
      next: (response) => {
        console.log(response);
        this.comments.push(response);
        this.newCommentInput = '';
      }, error: (err) => {
        console.log(err);
      }
    })

  }

}

