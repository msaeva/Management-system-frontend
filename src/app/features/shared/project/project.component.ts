import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {DialogModule} from "primeng/dialog";
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import {AutoFocusModule} from "primeng/autofocus";
import {TaskListComponent} from "@feature/shared/task-list/task-list.component";
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "@core/services/project.service";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {Role} from "@core/role.enum";
import {LocalStorageService} from "@core/services/local-storage.service";
import {PmCreateTaskComponent} from "@feature/project-manager/pm-create-task/pm-create-task.component";
import {Task} from "@core/types/tasks/task";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {TaskService} from "@core/services/task.service";


@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    SidebarComponent,
    DialogModule,
    AvatarModule,
    ButtonModule,
    AutoFocusModule,
    TaskListComponent,
    NgForOf,
    DatePipe,
    NgIf,
    PmCreateTaskComponent,
    ProgressSpinnerModule
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  visibleProjectDetailedTask: boolean = false;
  project: DetailedProject = {} as DetailedProject;
  visibleCreateTaskDialog: boolean = false;
  tasks: Task[] = [];

  loadingProject: boolean = true;

  constructor(private projectService: ProjectService,
              private taskService: TaskService,
              private activatedRoute: ActivatedRoute,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: params => {
        this.loadProject(params['id']);
      }
    })
  }

  showDialog(): void {
    this.visibleProjectDetailedTask = true;
  }

  loadTasks(): void {
    if (this.getAuthUserRole() === Role.USER.valueOf()) {
      this.taskService.getTasksForUserTeamsByProjectId(this.project.id).subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
        },
        error: () => {
          console.log("Error loading tasks");
        }
      });
    } else if (this.getAuthUserRole() === Role.PM.valueOf()) {
      this.taskService.getAllTasksByProject(this.project.id).subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
        },
        error: () => {
          console.log("Error loading tasks");
        }
      });
    }
  }

  getAuthUserRole(): string | null {
    return this.localStorageService.getAuthUserRole()
  }

  loadProject(id: string): void {
    this.projectService.getById(id).subscribe({
      next: (project: DetailedProject) => {
        this.project = project;
        this.loadingProject = false;
        this.loadTasks();
        console.log(this.project)
      },
      error: () => {
        console.log("Error loading projects");
      }
    });
  }

  protected readonly Role = Role;

  showCreateNewTaskDialog(): void {
    this.visibleCreateTaskDialog = true;
  }

  newTaskHandler(task: Task): void {
    this.tasks = [...this.tasks, task];
    this.visibleCreateTaskDialog = false;
  }
}
