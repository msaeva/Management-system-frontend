import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Inplace, InplaceModule} from "primeng/inplace";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {DetailedProject} from "@core/types/projects/DetailedProject";
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
import {CalendarModule} from "primeng/calendar";
import {InputTextareaModule} from "primeng/inputtextarea";
import {projectStatus, roleOptions} from "@core/constants";

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
    AdminProjectManagerTableComponent,
    CalendarModule,
    InputTextareaModule
  ],
  templateUrl: './detailed-project.component.html',
  styleUrl: './detailed-project.component.scss'
})
export class DetailedProjectComponent implements OnInit {
  @Input({required: true}) project!: DetailedProject;

  @Input({required: true}) allProjectManagersOptions!: SimpleUser[];
  @Output() projectDeleted = new EventEmitter<number>();
  @Output() teamDeleted = new EventEmitter<number>();

  updateProjectFormGroup!: FormGroup;

  usersToAddToTeam: SimpleUser[] = [];
  loadingUsersToAddToTeam: boolean = true;

  constructor(private projectService: ProjectService,
              private teamService: TeamService,
              private confirmationService: ConfirmationService,
              private toastService: ToastService,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.loadFormGroup();
    this.loadUsersToAddToTeam();
  }

  loadFormGroup() {
    this.updateProjectFormGroup = this.formBuilder.group({
      id: [
        {value: this.project.id, disabled: true},
        [Validators.required, Validators.minLength(3)]
      ],
      title: [
        {value: this.project.title, disabled: true},
        [Validators.required, Validators.minLength(4)]
      ],
      abbreviation: [
        {value: this.project.abbreviation, disabled: true},
        [Validators.required, Validators.minLength(3)]
      ],
      createdDate: [
        {value: this.project.createdDate, disabled: true},
        Validators.required],
      description: [
        {value: this.project.description, disabled: true},
        [Validators.required, Validators.minLength(4)]
      ],
      status: [
        {value: this.project.status, disabled: true},
        [Validators.required, Validators.minLength(6)]
      ],
    });
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

  toggleEditMode() {
    const func = this.updateProjectFormGroup.get('title')!.disabled ? 'enable' : 'disable';

    this.updateProjectFormGroup.controls['title'][func]();
    this.updateProjectFormGroup.controls['description'][func]();
    this.updateProjectFormGroup.controls['abbreviation'][func]();
    this.updateProjectFormGroup.controls['status'][func]();
  }

  updateProject(id: number | undefined) {
    this.projectService.update(id, this.updateProjectFormGroup.value).subscribe({
      next: (response) => {
        this.project = response;
        this.toggleEditMode();
        console.log(response);

      }, error: (err) => {
        console.log(err);
      }
    })
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

  removeDeletedProjectHandler(teamId: number) {
    if (this.project) {
      this.project.teams = this.project.teams.filter(t => t.id !== teamId);
    }
  }

  cancelUpdateProject() {
    this.loadFormGroup();
  }

  protected readonly projectStatus = projectStatus;
}
