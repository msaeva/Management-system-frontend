import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {SingleTask} from "@core/types/tasks/single-task";
import {CardModule} from "primeng/card";
import {AvatarModule} from "primeng/avatar";
import {InputTextareaModule} from "primeng/inputtextarea";
import {CommentService} from "@core/services/comment.service";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Comment} from "@core/types/comments/comment";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
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
import {ConfirmationService} from "primeng/api";
import {CreateCommentData} from "@core/types/comments/create-comment-data";
import {UpdateTaskData} from "@core/types/tasks/update-task-data";
import {taskStatus} from "@core/constants";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
  destroyRef = inject(DestroyRef);

  @Input({required: true}) id!: number;
  @Input({required: true}) projectId!: number;
  @Output() updatedStatusTaskEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() assignedUserToTaskEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() deletedTaskEvent: EventEmitter<number> = new EventEmitter<number>();
  @Output() updatedTaskEvent: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() setCompletionTimeEvent: EventEmitter<Task> = new EventEmitter<Task>();

  task!: SingleTask;
  comments: Comment[] = [];
  estimationTime: number = 0;
  completionTime: number = 0;
  progress: number = 0;
  assignUserOptions: SimpleUser[] = [];
  selectedUserToAssign!: SimpleUser;

  createCommentFormControl: FormControl = new FormControl();
  updateTaskFormGroup!: FormGroup;
  loading: { task: boolean, comments: boolean } = {
    task: true,
    comments: true,
  }

  constructor(private commentService: CommentService,
              private toastService: ToastService,
              private taskService: TaskService,
              private projectService: ProjectService,
              private formBuilder: FormBuilder,
              private confirmationService: ConfirmationService,
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

  toggleEditMode() {
    const func = this.updateTaskFormGroup.get('title')!.disabled ? 'enable' : 'disable';

    this.updateTaskFormGroup.controls['title'][func]();
    this.updateTaskFormGroup.controls['description'][func]();
    this.updateTaskFormGroup.controls['status'][func]();
    this.updateTaskFormGroup.controls['assignee'][func]();
  }

  loadFormGroup() {
    this.updateTaskFormGroup = this.formBuilder.group({
      title: [
        {value: this.task.title, disabled: true},
        [Validators.required, Validators.minLength(4)]
      ],
      assignee: [
        {value: this.task.userFullName, disabled: true},
        [Validators.required, Validators.minLength(3)]
      ],
      description: [
        {value: this.task.description, disabled: true},
        [Validators.required, Validators.minLength(4)]
      ],
      status: [
        {value: this.task.status, disabled: true},
        [Validators.required, Validators.minLength(6)]
      ],
    });
  }

  loadAssignUsers() {
    this.projectService.getAllUsersInProject(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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
    this.commentService.getTaskComments(taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.comments = response;
        }, error: () => {
          console.log("Error loading tasks");
        }
      })
  }

  loadTask(): void {
    this.taskService.getById(this.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task: SingleTask) => {
          this.task = task;
          this.loading.task = false;
          this.progress = this.task.progress;

          if (this.task.estimationTime) {
            this.estimationTime = this.task.estimationTime;
          }
          if (this.task.completionTime) {
            this.completionTime = this.task.completionTime;
          }

          this.loadFormGroup();
        }, error: () => {
          console.log("Error loading tasks");
        }
      });
  }

  getAuthUserId(): number {
    return this.localStorageService.getAuthUserId() as number;
  }

  postComment(): void {
    const body: CreateCommentData = {
      comment: this.createCommentFormControl.value,
      taskID: this.task?.id
    };

    this.commentService.createComment(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Comment) => {
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

  deleteCommentHandler(id: number): void {
    this.comments = this.comments.filter(c => c.id !== id);

    this.toastService.showMessage({
      severity: 'success',
      summary: 'Success',
      detail: 'Meeting deleted successfully',
      life: 3000
    });
  }

  startTask(): void {
    this.taskService.updateStatus(this.task.id, TaskStatus.IN_PROGRESS.valueOf())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updateTask: Task) => {
          this.task.status = updateTask.status;
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

  submitEstimationTime(): void {
    this.taskService.setEstimationTime(this.task.id, this.estimationTime)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
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

  submitCompletionTime() {
    this.taskService.setCompletionTime(this.task.id, this.completionTime)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.task.completionTime = this.completionTime;

          this.setCompletionTimeEvent.emit(response);
          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Completion time submitted successfully',
            life: 3000
          });
        },
        error: (err) => {
          console.log(err);
        }
      })

  }

  onProgressChange(progress: number): void {
    this.taskService.changeProgress(this.task.id, progress)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Progress added successfully',
            life: 3000
          });
        },
        error: (err) => {
          console.log(err);
        }
      })

  }

  assignUser(): void {
    this.taskService.assignUser(this.task.id, this.selectedUserToAssign.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Task) => {
          this.assignedUserToTaskEvent.emit(response);
          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'User assigned to the task successfully!',
            life: 3000
          });
        },
        error: (err) => {
          console.log(err)
        }
      })
  }

  protected readonly Role = Role;

  showDeleteTaskConfirmation(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTask(this.task.id);
      }
    });
  }

  cancelUpdateTask(): void {
    this.loadFormGroup();
  }

  deleteTask(id: number): void {
    this.taskService.deletePM(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.deletedTaskEvent.emit(id);
          this.toastService.showMessage({

            severity: 'success',
            summary: 'Success',
            detail: 'Task deleted successfully',
            life: 3000
          });
        }, error: (err) => console.log(err)
      });
  }

  updateTask(id: number): void {
    const assignee = this.updateTaskFormGroup.get('assignee')?.value ?? null;

    const data: UpdateTaskData = {
      id: this.updateTaskFormGroup.value.id,
      title: this.updateTaskFormGroup.value.title,
      status: this.updateTaskFormGroup.value.status,
      description: this.updateTaskFormGroup.value.description,
      userId: assignee?.id ?? null,
      projectId: this.projectId
    }

    this.taskService.updatePM(id, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: SingleTask) => {
          this.task = response;
          this.updatedTaskEvent.emit(response as Task);
          this.toggleEditMode();

        }, error: (err) => {
          console.log(err);
        }
      })
  }

  protected readonly taskStatus = taskStatus;

}

