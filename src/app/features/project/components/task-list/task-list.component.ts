import {Component, OnInit} from '@angular/core';
import {TaskComponent} from "@feature/project/components/task/task.component";
import {TaskService} from "@core/services/task.service";
import {ActivatedRoute} from "@angular/router";
import {Task} from "@core/types/Task";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-project-task-list',
  standalone: true,
  imports: [
    TaskComponent,
    NgForOf
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

  projectId: string = "";

  constructor(private taskService: TaskService, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadTasks();
    console.log(this.tasks)
  }

  loadTasks() {
    this.taskService.getTasksByProject(this.projectId).subscribe({
      next: (tasks: Task[]) => {
        this.tasks = tasks;
        console.log(this.tasks)
        this.filterTasks()
      },
      error: () => {
        console.log("Error loading tasks");
      }
    });
  }

  private filterTasks() {
    console.log("filterTasks");
    this.doneTasks = this.tasks.filter(task => task.status === "DONE");
    this.todoTasks = this.tasks.filter(task => task.status === "TODO");
    this.inProgressTasks = this.tasks.filter(task => task.status === "IN_PROGRESS");
    this.openTasks = this.tasks.filter(task => task.status === "OPEN");
    // this.reOpenTasks = this.tasks.filter(task => task.status === "RE-OPEN");
  }
}
