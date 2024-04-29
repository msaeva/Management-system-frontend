import {Component, DestroyRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Task} from "@core/types/tasks/task";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {TaskService} from "@core/services/task.service";
import {ToastService} from "@core/services/toast.service";
import {DropdownFilterEvent, DropdownModule} from "primeng/dropdown";
import {ProjectService} from "@core/services/project.service";
import {SimpleUser} from "@core/types/users/simple-user";
import {CreateTaskData} from "@core/types/tasks/create-task-data";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {BehaviorSubject, debounceTime, distinctUntilChanged, Subject, takeUntil} from "rxjs";
import {Pageable} from "@core/types/pageable";
import {SearchAssignee} from "@core/types/SearchAssignee";
import {PaginatorModule, PaginatorState} from "primeng/paginator";

@Component({
  selector: 'app-pm-create-task',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    NgIf,
    ReactiveFormsModule,
    DropdownModule,
    PaginatorModule
  ],
  templateUrl: './pm-create-task.component.html',
  styleUrl: './pm-create-task.component.scss'
})
export class PmCreateTaskComponent implements OnInit, OnDestroy {
  destroyRef: DestroyRef = inject(DestroyRef);
  private destroy$: Subject<void> = new Subject<void>();
  searchAssigneeParams$: BehaviorSubject<SearchAssignee> = new BehaviorSubject<SearchAssignee>({
    page: 1,
    keyword: '',
  });

  pagination: { size: number, totalRecords: number } = {
    size: 2,
    totalRecords: -1
  }

  @Input({required: true}) projectId!: number;
  @Output() newTaskEvent: EventEmitter<Task> = new EventEmitter<Task>();

  createTaskFormGroup = this.formBuilder.group({
    title: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]),
    description: new FormControl('',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200)
      ]),
    assignee: new FormControl<SimpleUser | null>(null)
  });

  assignUsersLazyLoadOptions: SimpleUser[] = [];

  constructor(private formBuilder: FormBuilder,
              private taskService: TaskService,
              private toastService: ToastService,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.setupFilterSubscription();
  }

  setupFilterSubscription(): void {
    this.searchAssigneeParams$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (params) => {
          this.loadUsersToAddToTask(params.page, params.keyword);
        }
      });
  }

  loadUsersToAddToTask(page: number, search: string): void {
    this.projectService.getAllUsersInProject(this.projectId, page, this.pagination.size, search)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Pageable<SimpleUser>) => {
          this.assignUsersLazyLoadOptions = response.data;
          this.pagination.totalRecords = response.totalRecords as number;
        }
      })
  }

  createTask(): void {
    const assigneeId = this.createTaskFormGroup.value?.assignee?.id;
    const body: CreateTaskData = {
      title: this.createTaskFormGroup.value?.title ?? '',
      description: this.createTaskFormGroup.value?.description ?? '',
      projectId: this.projectId,
      userId: assigneeId || null
    }

    this.taskService.createTaskPm(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task: Task) => {
          this.newTaskEvent.emit(task);

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Task created successfully',
            life: 3000
          });
          this.createTaskFormGroup.reset();
        }
      })
  }


  filterUsers($event: DropdownFilterEvent) {
    this.searchAssigneeParams$.next({...this.searchAssigneeParams$.value, page: 1, keyword: $event.filter});
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange($event: PaginatorState) {
    this.searchAssigneeParams$.next({...this.searchAssigneeParams$.value, page: $event.page as number + 1});
  }
}
