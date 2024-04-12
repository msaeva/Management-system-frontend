import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {ButtonModule} from "primeng/button";
import {taskStatus} from "@core/constants";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {DatePipe, NgIf, NgStyle} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RippleModule} from "primeng/ripple";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {ProjectService} from "@core/services/project.service";
import {DetailedTask} from "@core/types/tasks/detailed-task";
import {ConfirmationService} from "primeng/api";
import {ToastService} from "@core/services/toast.service";
import {TaskService} from "@core/services/task.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CreateProjectComponent} from "@feature/admin/create-project/create-project.component";
import {DialogModule} from "primeng/dialog";
import {Pagination} from "@core/types/pagination";
import {Pageable} from "@core/types/pageable";
import {AdminCreateTaskComponent} from "@feature/admin/admin-create-task/admin-create-task.component";

@Component({
  selector: 'app-admin-task-list',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    RippleModule,
    TableModule,
    ConfirmDialogModule,
    NgStyle,
    CreateProjectComponent,
    DialogModule,
    AdminCreateTaskComponent,
  ],
  templateUrl: './admin-task-list.component.html',
  styleUrl: './admin-task-list.component.scss'
})
export class AdminTaskListComponent implements OnInit {
  projectId!: number;
  allTasks: DetailedTask[] = [];
  forms: FormGroup[] = [];

  visibleCreateTaskDialog: boolean = false;

  pagination: Pagination = {
    page: 0,
    size: 5,
    sort: "id",
    order: "asc",
    totalRecords: -1
  }

  constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private confirmationService: ConfirmationService,
              private toastService: ToastService,
              private datePipe: DatePipe,
              private projectService: ProjectService,
              private taskService: TaskService) {
  }

  clonedTasks: Map<number, DetailedTask> = new Map<number, DetailedTask>();

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
  }

  showCreateNewTaskDialog() {
    this.visibleCreateTaskDialog = true;
  }

  onRowEditInit(task: DetailedTask) {
    this.clonedTasks.set(task.id, {...task});
  }

  onRowEditSave(task: DetailedTask) {
    this.taskService.update(task).subscribe({
      next: () => {
        const taskToUpdate = this.allTasks.find(u => u.id === task.id);
        taskToUpdate!.title = task.title
        taskToUpdate!.abbreviation = task.abbreviation;
        taskToUpdate!.description = task.description;
        taskToUpdate!.status = task.status;

        this.clonedTasks.delete(task.id);
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  private initializeForms(tasks: DetailedTask[]) {
    console.log(tasks)
    this.forms = tasks.map(task => {
      return this.formBuilder.group({
        id: [task.id, [Validators.required]],
        title: [task.title, [Validators.required, Validators.minLength(3)]],
        abbreviation: [task.abbreviation, [Validators.required, Validators.minLength(3)]],
        description: [task.description, [Validators.required, Validators.minLength(5), Validators.maxLength(300)]],
        status: [task.status, [Validators.required]],
        createdDate: [task.createdDate, [Validators.required]],
      });
    });
  }

  onRowEditCancel(task: DetailedTask, index: number) {
    this.allTasks[index] = <DetailedTask>this.clonedTasks.get(task.id);
    this.clonedTasks.delete(task.id);
  }

  formatDateTime(dateTime: string | null): string {
    if (!dateTime) {
      return '';
    }
    return this.datePipe.transform(new Date(dateTime), 'short') || '';
  }

  showConfirmation(taskId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this task?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTask(taskId);
      }
    });

  }

  deleteTask(id: number) {
    this.taskService.delete(id).subscribe({
      next: () => {
        this.allTasks = this.allTasks.filter(task => task.id !== id);
        this.toastService.showMessage({

          severity: 'success',
          summary: 'Success',
          detail: 'Task deleted successfully',
          life: 3000
        });
      }, error: (err) => console.log(err)
    });

  }

  newTaskHandler(task: DetailedTask) {
    // this.initializeForms([...this.projects, project]);
    this.allTasks.push(task);
    this.visibleCreateTaskDialog = false;
  }

  readonly taskStatus = taskStatus;

  loadTasks($event: TableLazyLoadEvent) {
    const rowsPerPage = $event.rows != null ? $event.rows as number : this.pagination.page;

    const pageNumber = Math.ceil(($event.first as number) / rowsPerPage);

    this.pagination.sort = $event.sortField as string;
    this.pagination.order = $event.sortOrder === 1 ? 'asc' : 'desc' as string;


    this.projectService.getAllProjectTasks(this.projectId, {...this.pagination, page: pageNumber + 1}).subscribe({
      next: (response: Pageable<DetailedTask>) => {
        this.pagination.totalRecords = response.totalRecords;
        this.allTasks = response.data;
        this.initializeForms(this.allTasks);
      }, error: (err) => {
        console.log(err);
      }
    })
  }
}

