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

    if (this.getAuthUserId() === this.task.userId) {

      if (this.task.status === TaskStatus.TODO) {
        this.updateTaskFormGroup.controls['estimationTime'][func]();
      } else if (this.task.status === TaskStatus.IN_PROGRESS) {
        this.updateTaskFormGroup.controls['progress'][func]();
        this.updateTaskFormGroup.controls['completionTime'][func]();
      }
      return
    }

    this.updateTaskFormGroup.controls['title'][func]();
    this.updateTaskFormGroup.controls['description'][func]();
    this.updateTaskFormGroup.controls['status'][func]();
    this.updateTaskFormGroup.controls['assignee'][func]();
    // this.updateTaskFormGroup.controls['estimationTime'][func]();
    // this.updateTaskFormGroup.controls['completionTime'][func]();
    this.updateTaskFormGroup.controls['progress'][func]();
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
      estimationTime: [
        {value: this.task.estimationTime ?? 0, disabled: true},
        [Validators.required]
      ],
      completionTime: [
        {value: this.task.completionTime ?? 0, disabled: true},
        [Validators.required]
      ],
      progress: [
        {value: this.task.progress ?? 0, disabled: true},
        [Validators.required]
      ]
    });
  }

  loadAssignUsers() {
    this.projectService.getAllUsersInProject(this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.assignUserOptions = response;
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

          this.loadFormGroup();
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

  protected readonly TaskStatus = TaskStatus;

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
        }
      });
  }

  updateTask(id: number): void {
    const assignee = this.updateTaskFormGroup.get('assignee')?.value ?? null;

    let found = null;
    if (assignee) {
      found = this.assignUserOptions.find(u => u.fullName === assignee.fullName) as SimpleUser;
    }

    this.updateTaskFormGroup.enable();
    const data: UpdateTaskData = {
      title: this.updateTaskFormGroup.value.title,
      status: this.updateTaskFormGroup.value.status,
      description: this.updateTaskFormGroup.value.description,
      userId: found?.id ?? null,
      projectId: this.projectId,
      completionTime: this.updateTaskFormGroup.value.completionTime,
      estimationTime: this.updateTaskFormGroup.value.estimationTime,
      progress: this.updateTaskFormGroup.value.progress,
    }

    this.taskService.update(id, data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: SingleTask) => {
          this.task = response;
          this.updatedTaskEvent.emit(response as Task);
          this.toggleEditMode();
          this.updateTaskFormGroup.disable();
        }
      })
  }

  protected readonly taskStatus = taskStatus;

}

