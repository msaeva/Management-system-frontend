import {Component, OnInit} from '@angular/core';
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {TaskComponent} from "@feature/project/components/task/task.component";
import {DialogModule} from "primeng/dialog";
import {AvatarModule} from "primeng/avatar";
import {ButtonModule} from "primeng/button";
import {AutoFocusModule} from "primeng/autofocus";
import {TaskListComponent} from "@feature/project/components/task-list/task-list.component";
import {ActivatedRoute} from "@angular/router";
import {ProjectService} from "@core/services/project.service";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {DatePipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [
    SidebarComponent,
    TaskComponent,
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
  projectId: string = '';
  project: DetailedProject;

  constructor(private projectService: ProjectService,
              private activatedRoute: ActivatedRoute) {
    this.project = {} as DetailedProject;
  }

  showDialog() {
    this.visible = true;
    this.loadProject();
  }

  ngOnInit(): void {
    this.projectId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.loadProject();
  }

  loadProject() {
    this.projectService.getById(this.projectId).subscribe({
      next: (project: DetailedProject) => {
        this.project = project;
        console.log(project);
        console.log(this.project);
      },
      error: () => {
        console.log("Error loading projects");
      }
    });
  }
}
