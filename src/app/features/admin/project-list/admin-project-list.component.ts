import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {ProjectComponent} from "@feature/shared/project/project.component";
import {ProjectService} from "@core/services/project.service";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {FieldsetModule} from "primeng/fieldset";
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {InplaceModule} from "primeng/inplace";
import {ChipsModule} from "primeng/chips";
import {FormsModule} from "@angular/forms";
import {DetailedProjectComponent} from "@feature/admin/detailed-project/detailed-project.component";
import {CreateUserComponent} from "@feature/admin/create-user/create-user.component";
import {CreateProjectComponent} from "@feature/admin/create-project/create-project.component";
import {Role} from "@core/role.enum";
import {UserService} from "@core/services/user-service";
import {SimpleUser} from "@core/types/users/simple-user";
import {TextTransformPipe} from "@core/pipes/text-transform.pipe";
import {ToastService} from "@core/services/toast.service";


@Component({
  selector: 'app-admin-project-list',
  standalone: true,
  imports: [
    NgForOf,
    ProjectComponent,
    FieldsetModule,
    ButtonModule,
    DialogModule,
    InplaceModule,
    ChipsModule,
    FormsModule,
    NgIf,
    DetailedProjectComponent,
    CreateUserComponent,
    CreateProjectComponent,
    TextTransformPipe
  ],
  templateUrl: './admin-project-list.component.html',
  styleUrl: './admin-project-list.component.scss'
})
export class AdminProjectListComponent implements OnInit {
  visibleDetailedProjectDialog: boolean = false;
  visibleCreateProjectDialog: boolean = false;
  selectedProject!: DetailedProject;
  projects: DetailedProject[] = [];
  allProjectManagers: SimpleUser[] = [];
  allProjectManagersOptions: SimpleUser[] = [];

  loadingProjectManagers: boolean = true;
  loadingProjectById: boolean = true;

  constructor(private projectService: ProjectService,
              private userService: UserService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.loadPMs();
    this.loadProjects();
  }

  showDialog(id: number): void {
    this.getById(id);
    this.visibleDetailedProjectDialog = true;
  }

  getById(id: number): void {
    this.loadingProjectById = true;
    this.projectService.getDetailedInfoById(id).subscribe({
      next: (project) => {
        this.selectedProject = project;
        this.loadingProjectById = false;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadPMs(): void {
    this.userService.getByRole([Role.PM.valueOf()]).subscribe({
      next: (response) => {
        this.allProjectManagers = response;
        this.allProjectManagersOptions = this.allProjectManagers;

        this.loadingProjectManagers = false;
      }, error: (err) => console.log(err)
    })
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (projects: DetailedProject[]) => {
        this.projects = projects;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  newProjectHandler(project: DetailedProject) {
    // this.initializeForms([...this.projects, project]);
    this.projects.push(project);
    this.visibleCreateProjectDialog = false;
  }

  removeDeletedProjectHandler(deletedProjectId: number): void {
    this.visibleDetailedProjectDialog = false;
    this.projects = this.projects.filter(p => p.id != deletedProjectId);
  }

  showCreateProjectDialog() {
    this.visibleCreateProjectDialog = true;
  }

  updateProjectHandler(updatedProject: DetailedProject) {
    // this.visibleDetailedProjectDialog = false;

    const index = this.projects.findIndex(p => p.id === updatedProject.id);
    if (index !== -1) {
      this.projects[index] = updatedProject;
      this.toastService.showMessage({
        severity: 'success',
        summary: 'Success',
        detail: 'Successfully updated project!',
        life: 3000
      });
      // this.visibleDetailedProjectDialog = false;
    }
  }
}
