import {Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {TaskService} from "@core/services/task.service";
import {ActivatedRoute} from "@angular/router";
import {Task} from "@core/types/tasks/task";
import {NgForOf, NgIf, NgStyle, TitleCasePipe} from "@angular/common";
import {DragDropModule} from "primeng/dragdrop";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ChipModule} from "primeng/chip";
import {TaskStatus} from "@core/task-status";
import {DetailedTaskComponent} from "@feature/shared/detailed-task/detailed-task.component";
import {DialogModule} from "primeng/dialog";
import {ToastService} from "@core/services/toast.service";
import {Role} from "@core/role.enum";
import {PmCreateTaskComponent} from "@feature/project-manager/pm-create-task/pm-create-task.component";
import {DividerModule} from "primeng/divider";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-project-task-list',
  standalone: true,
  imports: [
    NgForOf,
    DragDropModule,
    ButtonModule,
    CardModule,
    ChipModule,
    TitleCasePipe,
    NgIf,
    DetailedTaskComponent,
    DialogModule,
    PmCreateTaskComponent,
    DividerModule,
    ProgressSpinnerModule,
    RippleModule,
    TableModule,
    NgStyle
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnChanges {
  destroyRef = inject(DestroyRef);

  @Input({required: true}) tasks!: Task[];
  doneTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  openTasks: Task[] = [];

  allowedTransitions: { [key: string]: string[] } = {
    [TaskStatus.OPEN.valueOf()]: [TaskStatus.TODO.valueOf()],
    [TaskStatus.RE_OPEN.valueOf()]: [TaskStatus.TODO.valueOf()],
    [TaskStatus.TODO.valueOf()]: [TaskStatus.IN_PROGRESS.valueOf()],
    [TaskStatus.IN_PROGRESS.valueOf()]: [TaskStatus.DONE.valueOf()],
    [TaskStatus.DONE.valueOf()]: [TaskStatus.OPEN.valueOf()]
  };

  projectId!: number;
  visibleDetailedTask: boolean = false;
  selectedTask: Task | null = null;

  loading: { tasks: boolean } = {
    tasks: false,
  }

  protected readonly TaskStatus = TaskStatus;
  protected readonly Role = Role;

  constructor(private taskService: TaskService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterTasks();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: params => {
        this.projectId = params['id'];
      }
    });

    this.filterTasks();
  }

  public type = '';
  public draggedTask: any;
  isDropDisabled: boolean = false;

  dragStart(task: Task): void {
    this.draggedTask = task;
  }

  drop(type: string): void {

    if (type === TaskStatus.DONE && !this.draggedTask.completionTime) {

      this.toastService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter completion time first!',
        life: 3000
      });
      return;
    }

    if (type === TaskStatus.IN_PROGRESS && !this.draggedTask.estimationTime) {

      this.toastService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Enter estimation time first!',
        life: 3000
      });
      return;
    }

    if (type === TaskStatus.TODO && !this.draggedTask.userId ) {

      this.toastService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'No assigned user!',
        life: 3000
      });
      return;
    }


    const sourceColumn = this.draggedTask.status as string;
    const targetColumn = type;

    if (this.allowedTransitions[sourceColumn].includes(targetColumn)) {
      this.isDropDisabled = false;
      switch (type) {
        case TaskStatus.OPEN.valueOf():
          this.type = TaskStatus.OPEN.valueOf();
          this.openTasks.push(this.draggedTask);
          break;
        case TaskStatus.TODO.valueOf():
          this.type = TaskStatus.TODO.valueOf();
          this.todoTasks.push(this.draggedTask);
          break;
        case TaskStatus.IN_PROGRESS.valueOf():
          this.type = TaskStatus.IN_PROGRESS.valueOf();
          this.inProgressTasks.push(this.draggedTask);
          break;
        case TaskStatus.DONE.valueOf():
          this.type = TaskStatus.DONE.valueOf();
          this.doneTasks.push(this.draggedTask);
          break;
        default:
          break;
      }
    } else {
      this.isDropDisabled = true;

      this.toastService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot move task!',
        life: 3000
      });
      console.log(`Cannot move task from ${sourceColumn} to ${targetColumn}`);
    }
  }

  dragEnd(task: any): void {
    if (!this.draggedTask.completionTime && task.status === TaskStatus.IN_PROGRESS) return;
    if (!this.draggedTask.estimationTime && task.status === TaskStatus.TODO) return;
    if (!this.draggedTask.userId && (task.status === TaskStatus.OPEN || TaskStatus.RE_OPEN)) return;

    const taskStatus = task.status;
    const taskId = task.id;


    if (!this.isDropDisabled) {
      if (this.type === TaskStatus.TODO.valueOf()) {
        task.status = TaskStatus.TODO.valueOf();
      } else if (this.type === TaskStatus.IN_PROGRESS.valueOf()) {
        task.status = TaskStatus.IN_PROGRESS.valueOf();
      } else if (this.type === TaskStatus.OPEN.valueOf()) {
        task.status = TaskStatus.OPEN.valueOf();
      } else if (this.type === TaskStatus.DONE.valueOf()) {
        task.status = TaskStatus.DONE.valueOf();
      } else {
        console.error("Invalid drop action. Drop action is disabled.");
      }


      this.taskService.updateStatus(taskId, task.status)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (updatedTask: Task) => {
            const index = this.tasks.findIndex(t => t.id === updatedTask.id);
            if (index !== -1) {
              this.tasks[index] = updatedTask;
              this.filterTasks();
            }

            this.toastService.showMessage({
              severity: 'success',
              summary: 'Success',
              detail: 'Status updated successfully',
              life: 3000
            });
          }
        })


      switch (taskStatus) {
        case TaskStatus.OPEN.valueOf():
          this.openTasks = this.openTasks.filter((task) => task.id !== taskId);
          break;
        case TaskStatus.TODO.valueOf():
          this.todoTasks = this.todoTasks.filter((task) => task.id !== taskId);
          break;
        case TaskStatus.IN_PROGRESS.valueOf():
          this.inProgressTasks = this.inProgressTasks.filter((task) => task.id !== taskId);
          break;
        case TaskStatus.DONE.valueOf():
          this.doneTasks = this.doneTasks.filter((task) => task.id !== taskId);
          break;
      }

      this.draggedTask = null;
      return;
    }
  }


  private filterTasks(): void {
    this.doneTasks = this.tasks.filter(task => task.status === TaskStatus.DONE.valueOf());
    this.todoTasks = this.tasks.filter(task => task.status === TaskStatus.TODO.valueOf());
    this.inProgressTasks = this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS.valueOf());
    this.openTasks = this.tasks.filter(task => task.status === TaskStatus.OPEN.valueOf() || task.status === TaskStatus.RE_OPEN.valueOf());
  }

  openDetailedTaskDialog(task: Task): void {
    this.selectedTask = task;
    this.visibleDetailedTask = true
  }

  updatedStatusTaskHandler(updatedTask: Task, newStatus: string): void {
    const foundTask: Task = this.tasks.find(task => task.id === updatedTask.id) as Task;

    if (foundTask !== undefined) {
      foundTask.status = newStatus;
      this.filterTasks();
    }
  }

  assignedUserToTaskHandler(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.filterTasks();
      this.visibleDetailedTask = false;
    }
  }

  deleteTaskHandler(taskId: number): void {
    this.visibleDetailedTask = false;
    this.tasks = this.tasks.filter(t => t.id !== taskId);
    this.filterTasks();
  }

  updateTaskHandler(updatedTask: Task): void {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.filterTasks();

      this.toastService.showMessage({
        severity: 'success',
        summary: 'Success',
        detail: 'Task updated successfully!',
        life: 3000
      });
    }
  }

  setCompletionTimeHandler(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.filterTasks();
    }
  }
}
