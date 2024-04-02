import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TaskComponent} from "@feature/project/components/task/task.component";
import {ProjectComponent} from "@feature/project/project.component";
import {AdminProjectComponent} from "@feature/admin/project/admin-project.component";
import {ProjectService} from "@core/services/project.service";
import {DetailedProject} from "@core/types/projects/DetailedProject";
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
import {SimpleUser} from "@core/types/users/SimpleUser";


@Component({
  selector: 'app-admin-project-list',
  standalone: true,
  imports: [
    NgForOf,
    TaskComponent,
    ProjectComponent,
    AdminProjectComponent,
    FieldsetModule,
    ButtonModule,
    DialogModule,
    InplaceModule,
    ChipsModule,
    FormsModule,
    NgIf,
    DetailedProjectComponent,
    CreateUserComponent,
    CreateProjectComponent
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

  constructor(private projectService: ProjectService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadPMs();
    this.loadProjects();
  }

  showDialog(id: number) {
    this.getById(id);
    this.visibleDetailedProjectDialog = true;
  }

  getById(id: number) {
    this.projectService.getDetailedInfoById(id).subscribe({
      next: (project) => {
        this.selectedProject = project;
        this.loadingProjectById = false;
        console.log(this.selectedProject);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }


  loadPMs() {
    this.userService.getByRole(Role.PM.valueOf()).subscribe({
      next: (response) => {
        this.allProjectManagers = response;
        this.allProjectManagersOptions = this.allProjectManagers;

        this.loadingProjectManagers = false;
      }, error: (err) => console.log(err)
    })
  }

  loadProjects() {
    this.projectService.getAll().subscribe({
      next: (projects) => {
        this.projects = projects;
        console.log(projects);
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

  removeDeletedProject(deletedProjectId: number) {
    this.visibleDetailedProjectDialog = false;
    this.projects = this.projects.filter(p => p.id != deletedProjectId);
  }

  showCreateUserDialog() {
    this.visibleCreateProjectDialog = true;
  }
}
