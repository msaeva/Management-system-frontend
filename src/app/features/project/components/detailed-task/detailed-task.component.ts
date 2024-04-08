import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {SingleTaskService} from "@core/services/single-task.service";
import {SingleTask} from "@core/types/tasks/single-task";
import {CardModule} from "primeng/card";
import {AvatarModule} from "primeng/avatar";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CommentService} from "@core/services/comment.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Comment} from "@core/types/comment";
import {FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ChipsModule} from "primeng/chips";
import {CommentCardComponent} from "@pattern/comment-card/comment-card.component";
import {ToastService} from "@core/services/toast.service";
import {LocalStorageService} from "@core/services/local-storage.service";
import {TaskService} from "@core/services/task.service";
import {TaskStatus} from "@core/task-status";
import {Task} from "@core/types/tasks/task";
import {T} from "@fullcalendar/core/internal-common";
import {PaginatorModule} from "primeng/paginator";
import {FileUploadModule} from "primeng/fileupload";

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
    FormsModule,
    ChipsModule,
    DatePipe,
    CommentCardComponent,
    ReactiveFormsModule,
    NgIf,
    PaginatorModule,
    FileUploadModule
  ],
  templateUrl: './detailed-task.component.html',
  styleUrl: './detailed-task.component.scss'
})
export class DetailedTaskComponent implements OnInit {
  @Input() id: number | undefined;
  @Output() updatedStatusTaskEvent = new EventEmitter<Task>();

  task!: SingleTask;
  comments: Comment[] = [];
  estimationTime: number = 2;
  progress: number = 0;

  createCommentFormControl: FormControl = new FormControl();

  constructor(private singleTaskService: SingleTaskService,
              private commentService: CommentService,
              private toastService: ToastService,
              private taskService: TaskService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.loadTask();
    // TODO add loading
    this.loadComments(this.id!);
    this.initializeCommentFormGroup();
  }

  initializeCommentFormGroup() {
    this.createCommentFormControl.setValue("");
    this.createCommentFormControl.setValidators(
      [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]);
    this.createCommentFormControl.updateValueAndValidity();
  }

  loadComments(taskId: number) {
    this.commentService.getTaskComments(taskId).subscribe({
      next: (response) => {
        this.comments = response;
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

  getAuthUserId(): number {
    return this.localStorageService.getAuthUserId() as number;
  }

  postComment() {
    const body = {
      comment: this.createCommentFormControl.value,
      taskID: this.task?.id
    };
    this.commentService.createComment(body).subscribe({
      next: (response) => {
        this.comments.push(response);

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment created successfully',
          life: 3000
        });

        this.initializeCommentFormGroup();

      }, error: (err) => {
        console.log(err);
      }
    })

  }

  deleteCommentHandler(id: number) {
    this.comments = this.comments.filter(c => c.id !== id);

    this.toastService.showMessage({
      severity: 'success',
      summary: 'Success',
      detail: 'Meeting deleted successfully',
      life: 3000
    });
  }

  startTask() {
    this.taskService.updateStatus(this.task.id, TaskStatus.IN_PROGRESS.valueOf()).subscribe({
      next: (newStatus) => {
        console.log(newStatus);
        this.task.status = newStatus;
        this.updatedStatusTaskEvent.emit(this.task as Task);

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Status updated successfully',
          life: 3000
        });
      },
      error: (err) => console.log(err)
    })
  }

  protected readonly TaskStatus = TaskStatus;


  submitEstimationTime() {
    this.taskService.setEstimationTime(this.task.id, this.estimationTime).subscribe({
      next: (response) => {
        console.log(response);

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Estimation time added successfully',
          life: 3000
        });
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  onProgressChange(progress: number) {
    this.taskService.changeProgress(this.task.id, progress).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      }
    })

  }
}

