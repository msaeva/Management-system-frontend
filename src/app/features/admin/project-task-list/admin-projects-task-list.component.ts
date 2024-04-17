import {Component, OnInit} from '@angular/core';
import {PanelModule} from "primeng/panel";
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import {MenuModule} from "primeng/menu";
import {ProjectTask} from "@core/types/projects/project-task";
import {ProjectService} from "@core/services/project.service";
import {NgForOf} from "@angular/common";
import {TableModule} from "primeng/table";

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
  allProjectTasks: ProjectTask[] = [];


  constructor(private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.loadProjectTasks();
  }

  loadProjectTasks(): void {
    this.projectService.getProjectsWithTasks().subscribe({
      next: (response) => {
        this.allProjectTasks = response;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
