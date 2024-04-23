import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {PanelModule} from "primeng/panel";
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {ProjectTask} from "@core/types/projects/project-task";
import {ProjectService} from "@core/services/project.service";
import {NgForOf} from "@angular/common";
import {TableModule} from "primeng/table";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-admin-project-task-list',
  standalone: true,
  imports: [
    PanelModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    NgForOf,
    TableModule
  ],
  templateUrl: './admin-projects-task-list.component.html',
  styleUrl: './admin-projects-task-list.component.scss'
})
export class AdminProjectsTaskListComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  allProjectTasks: ProjectTask[] = [];

  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.loadProjectTasks();
  }

  loadProjectTasks(): void {
    this.projectService.getProjectsWithTasks()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.allProjectTasks = response;
        },
        error: (err) => {
          console.log(err);
        }
      });
  }
}
