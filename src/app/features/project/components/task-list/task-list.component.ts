import {Component, OnInit} from '@angular/core';
import {TaskComponent} from "@feature/project/components/task/task.component";
import {TaskService} from "@core/services/task.service";
import {ActivatedRoute} from "@angular/router";
import {Task} from "@core/types/tasks/task";
import {NgForOf, NgIf, TitleCasePipe} from "@angular/common";
import {DragDropModule} from "primeng/dragdrop";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {ChipModule} from "primeng/chip";
import {TaskStatus} from "@core/task-status";
import {DetailedTaskComponent} from "@feature/project/components/detailed-task/detailed-task.component";
import {DialogModule} from "primeng/dialog";
import {ToastService} from "@core/services/toast.service";

@Component({
  selector: 'app-project-task-list',
  standalone: true,
  imports: [
    TaskComponent,
    NgForOf,
    DragDropModule,
    ButtonModule,
    CardModule,
    ChipModule,
    TitleCasePipe,
    NgIf,
    DetailedTaskComponent,
    DialogModule
  ],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  doneTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  openTasks: Task[] = [];
  reOpenTasks: Task[] = [];


  allowedTransitions: { [key: string]: string[] } = {
    [TaskStatus.OPEN.valueOf()]: [TaskStatus.TODO.valueOf()],
    [TaskStatus.TODO.valueOf()]: [TaskStatus.IN_PROGRESS.valueOf()],
    [TaskStatus.IN_PROGRESS.valueOf()]: [TaskStatus.DONE.valueOf()],
    [TaskStatus.DONE.valueOf()]: []
  };

  projectId: string = "";
  visible: boolean = false;
  selectedTask: Task | null = null;

  constructor(private taskService: TaskService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService) {
  }

  ngOnInit() {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadTasks();
  }

  public type = '';
  public draggedTask: any;
  isDropDisabled: boolean = false;

  dragStart(task: Task) {
    this.draggedTask = task;
  }

  drop(type: string, event: any) {
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

  dragEnd(task: any) {

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


  loadTasks() {
    this.taskService.getTasksByProject(this.projectId).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        this.filterTasks();
      },
      error: () => {
        console.log("Error loading tasks");
      }
    });
  }

  private filterTasks() {
    this.doneTasks = this.tasks.filter(task => task.status === TaskStatus.DONE.valueOf());
    this.todoTasks = this.tasks.filter(task => task.status === TaskStatus.TODO.valueOf());
    this.inProgressTasks = this.tasks.filter(task => task.status === TaskStatus.IN_PROGRESS.valueOf());
    this.openTasks = this.tasks.filter(task => task.status === TaskStatus.OPEN.valueOf());
    // this.reOpenTasks = this.tasks.filter(task => task.status === "RE-OPEN");
  }

  openDetailedTaskDialog(task: Task) {
    this.selectedTask = task;
    this.visible = true
  }
}
