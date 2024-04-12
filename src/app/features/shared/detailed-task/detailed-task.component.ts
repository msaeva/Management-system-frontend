import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
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
import {PaginatorModule} from "primeng/paginator";
import {FileUploadModule} from "primeng/fileupload";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {SimpleUser} from "@core/types/users/simple-user";
import {ProjectService} from "@core/services/project.service";
import {Role} from "@core/role.enum";

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
    FileUploadModule,
    ProgressSpinnerModule
  ],
  templateUrl: './detailed-task.component.html',
  styleUrl: './detailed-task.component.scss'
})
export class DetailedTaskComponent implements OnInit {
  @Input({required: true}) id!: number;
  @Input({required: true}) projectId!: number;
  @Output() updatedStatusTaskEvent = new EventEmitter<Task>();
  @Output() assignedUserToTaskEvent = new EventEmitter<Task>();

  task!: SingleTask;
  comments: Comment[] = [];
  estimationTime!: number;
  progress: number = 0;
  assignUserOptions: SimpleUser[] = [];
  selectedUserToAssign!: SimpleUser;


  createCommentFormControl: FormControl = new FormControl();

  loading: { task: boolean, comments: boolean } = {
    task: true,
    comments: true,
  }

  constructor(private commentService: CommentService,
              private toastService: ToastService,
              private taskService: TaskService,
              private projectService: ProjectService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.loadTask();
    this.loadComments(this.id!);
    this.initializeCommentFormGroup();

    if (this.getAuthUserRole() === Role.PM) {
      this.loadAssignUsers();
    }
  }

  loadAssignUsers() {
    this.projectService.getAllUsersInProject(this.projectId).subscribe({
      next: (response) => {
        this.assignUserOptions = response;
      },
      error: (err) => {
        console.log(err);
      }

    })
  }

  getAuthUserRole() {
    return this.localStorageService.getAuthUserRole();
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
    this.taskService.getById(this.id).subscribe({
      next: (task: SingleTask) => {
        console.log(task)
        this.task = task;
        this.loading.task = false;
        this.progress = this.task.progress;
        this.estimationTime = this.task.estimationTime;
        console.log(this.task)
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

        this.task.estimationTime = this.estimationTime;

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

  assignUser() {
    this.taskService.assignUser(this.task.id, this.selectedUserToAssign.id).subscribe({
      next: (response: Task) => {
        this.assignedUserToTaskEvent.emit(response);
        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Estimation time added successfully',
          life: 3000
        });
      },
      error: (err) => {
        console.log(err)
      }
    })
    console.log(this.selectedUserToAssign)
  }

  protected readonly Role = Role;
}
