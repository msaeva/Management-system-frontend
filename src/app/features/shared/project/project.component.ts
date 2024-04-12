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
import {DatePipe, NgForOf} from "@angular/common";


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
    DatePipe
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent implements OnInit {
  visible: boolean = false;
  project: DetailedProject = {} as DetailedProject;

  constructor(private projectService: ProjectService,
              private activatedRoute: ActivatedRoute) {
  }

  showDialog() {
    this.visible = true;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: params => {
        this.loadProject(params['id']);
      }
    })
  }

  private loadProject(id: string) {
    this.projectService.getById(id).subscribe({
      next: (project: DetailedProject) => {
        this.project = project;
      },
      error: () => {
        console.log("Error loading projects");
      }
    });
  }
}
