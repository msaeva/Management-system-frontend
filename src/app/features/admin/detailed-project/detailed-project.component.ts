import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Inplace, InplaceModule} from "primeng/inplace";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {DetailedProject} from "@core/types/DetailedProject";
import {ProjectService} from "@core/services/project.service";
import {ChipsModule} from "primeng/chips";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {MultiSelectModule} from "primeng/multiselect";
import {SimpleUser} from "@core/types/users/SimpleUser";
import {UserService} from "@core/services/user-service";
import {Role} from "@core/role.enum";
import {TeamService} from "@core/services/team.service";
import {AdminTeamCardComponent} from "@pattern/admin-team-card/admin.team.card.component";
import {ToastService} from "@core/services/toast.service";
import {
  AdminProjectManagerTableComponent
} from "@pattern/admin-project-manager-table/admin-project-manager-table.component";

@Component({
  selector: 'app-detailed-project',
  standalone: true,
  imports: [
    InplaceModule,
    FormsModule,
    NgIf,
    ChipsModule,
    ConfirmDialogModule,
    NgStyle,
    NgForOf,
    CardModule,
    DropdownModule,
    ReactiveFormsModule,
    RippleModule,
    TableModule,
    MultiSelectModule,
    AdminTeamCardComponent,
    AdminProjectManagerTableComponent
  ],
  templateUrl: './detailed-project.component.html',
  styleUrl: './detailed-project.component.scss'
})
export class DetailedProjectComponent implements OnInit {
  @Input({required: true}) project!: DetailedProject | undefined;
  @Input({required: true}) allProjectManagersOptions!: SimpleUser[];
  @Output() projectDeleted = new EventEmitter<number>();
  @Output() teamDeleted = new EventEmitter<number>();
  @ViewChild("title") titleControl!: Inplace;
  @ViewChild("description") descriptionControl!: Inplace;
  @ViewChild("status") statusControl!: Inplace;
  @ViewChild("abbreviation") abbreviationControl!: Inplace;

  usersToAddToTeam: SimpleUser[] = [];
  loadingUsersToAddToTeam: boolean = true;

  constructor(private projectService: ProjectService,
              private teamService: TeamService,
              private confirmationService: ConfirmationService,
              private toastService: ToastService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadUsersToAddToTeam();
  }

  showDeleteProjectConfirmation(projectId: number | undefined) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject(projectId);
      },
      reject: () => {
        // this.toastService.showMessage({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
      }
    });
  }

  loadUsersToAddToTeam() {
    this.userService.getByRole(Role.USER.valueOf()).subscribe({
      next: (users) => {
        this.usersToAddToTeam = users;
        this.loadingUsersToAddToTeam = false;
      }, error: (err) => console.log(err)
    })
  }

  updateProject(id: number | undefined) {
    const body = {
      title: this.project?.title,
      description: this.project?.description,
      status: this.project?.status,
      abbreviation: this.project?.abbreviation,
    }
    this.projectService.update(id, body).subscribe({
      next: (response) => {
        this.project = response;
        this.deactivateUpdateProject();
        console.log(response);

      }, error: (err) => {
        console.log(err);
      }
    })
  }

  deactivateUpdateProject() {
    this.titleControl.deactivate();
    this.descriptionControl.deactivate();
    this.statusControl.deactivate();
    this.abbreviationControl.deactivate();
  }


  deleteProject(id: number | undefined) {
    this.projectService.deleteById(id).subscribe({
      next: (response) => {
        console.log(response);
        this.projectDeleted.emit(id);
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  createTeam() {
    this.teamService.createTeam(this.project?.id).subscribe({
      next: (response) => {
        this.project?.teams.push(response);

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully created new team!',
          life: 3000
        });
        console.log(response);
      }, error: (err) => {
        console.log(err);
      }
    })

  }
  removeDeletedProjectHandler(teamId: unknown) {
    if (this.project) {
      this.project.teams = this.project.teams.filter(t => t.id !== teamId);
    }
  }
}
