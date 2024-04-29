import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {InplaceModule} from "primeng/inplace";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DatePipe, NgForOf, NgIf, NgStyle} from "@angular/common";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {ProjectService} from "@core/services/project.service";
import {ChipsModule} from "primeng/chips";
import {ConfirmationService} from "primeng/api";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {RippleModule} from "primeng/ripple";
import {TableModule} from "primeng/table";
import {MultiSelectModule} from "primeng/multiselect";
import {SimpleUser} from "@core/types/users/simple-user";
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
import {projectStatus} from "@core/constants";
import {ActivatedRoute} from "@angular/router";
import {UpdateProjectData} from "@core/types/projects/update-project-data";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
  destroyRef = inject(DestroyRef);


  @Input({required: true}) project!: DetailedProject;
  @Output() projectDeleted = new EventEmitter<number>();
  @Output() projectUpdated = new EventEmitter<DetailedProject>();
  @Output() teamDeleted = new EventEmitter<number>();

  updateProjectFormGroup!: FormGroup;

  usersToAddToTeam: SimpleUser[] = [];
  loadingUsersToAddToTeam: boolean = true;

  constructor(private projectService: ProjectService,
              private teamService: TeamService,
              private confirmationService: ConfirmationService,
              private toastService: ToastService,
              private userService: UserService,
              private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const state = window.history.state;
      if (state && state.project) {
        this.project = state.project;
      }
    });
    this.loadFormGroup();
    this.loadUsersToAddToTeam();
  }

  loadFormGroup(): void {
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
        {value: this.formatDateTime(this.project.createdDate), disabled: true},
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

  showDeleteProjectConfirmation(projectId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this project?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteProject(projectId);
      }
    });
  }

  loadUsersToAddToTeam(): void {
    this.userService.getByRole([Role.USER.valueOf()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (users) => {
          this.usersToAddToTeam = users;
          this.loadingUsersToAddToTeam = false;
        }
      })
  }

  toggleEditMode(): void {
    const func = this.updateProjectFormGroup.get('title')!.disabled ? 'enable' : 'disable';

    this.updateProjectFormGroup.controls['title'][func]();
    this.updateProjectFormGroup.controls['description'][func]();
    this.updateProjectFormGroup.controls['abbreviation'][func]();
    this.updateProjectFormGroup.controls['status'][func]();
  }

  updateProject(id: number): void {
    const body: UpdateProjectData = {
      title: this.updateProjectFormGroup.value.title,
      description: this.updateProjectFormGroup.value.description,
      abbreviation: this.updateProjectFormGroup.value.abbreviation,
      status: this.updateProjectFormGroup.value.status,
    }

    this.projectService.update(id, body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: DetailedProject) => {
          this.project = response;
          this.projectUpdated.emit(response);
          this.toggleEditMode();

        }, error: () => {
          this.loadFormGroup();
        }
      })
  }


  deleteProject(id: number): void {
    this.projectService.deleteById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.projectDeleted.emit(id);
        }
      })
  }

  createTeam(): void {
    this.teamService.createTeam(this.project.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.project.teams.push(response);

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully created new team!',
            life: 3000
          });
        }
      })
  }

  formatDateTime(dateTime: string | null): string {
    if (!dateTime) {
      return '';
    }
    return this.datePipe.transform(new Date(dateTime), 'medium') || '';
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
