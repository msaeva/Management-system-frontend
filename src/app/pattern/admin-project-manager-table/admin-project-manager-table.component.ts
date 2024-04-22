import {Component, Input, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {MultiSelectModule} from "primeng/multiselect";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {SimpleUser} from "@core/types/users/simple-user";
import {ProjectService} from "@core/services/project.service";
import {ToastService} from "@core/services/toast.service";
import {User} from "@core/types/users/user";
import {NgIf} from "@angular/common";
import {Role} from "@core/role.enum";
import {UserService} from "@core/services/user-service";
import {lastValueFrom} from "rxjs";

@Component({
  selector: 'app-admin-project-manager-table',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    MultiSelectModule,
    SharedModule,
    TableModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './admin-project-manager-table.component.html',
  styleUrl: './admin-project-manager-table.component.scss'
})
export class AdminProjectManagerTableComponent implements OnInit {
  @Input({required: true}) project!: DetailedProject;

  dropdownOptions: SimpleUser[] = [];
  selectedPMToAddToProject: SimpleUser[] = [];

  loading: { pms: boolean } = {
    pms: true
  }
  allProjectManagers: SimpleUser[] = []

  constructor(private toastService: ToastService,
              private projectService: ProjectService,
              private userService: UserService,
              private confirmationService: ConfirmationService) {
  }

  async ngOnInit() {
    await this.loadPMs();

    const teamPmsIds = new Set(this.project?.pms.map(user => user.id));
    this.dropdownOptions = this.allProjectManagers
      .filter(user => !teamPmsIds.has(user.id));
  }

  async loadPMs() {
    this.allProjectManagers = await lastValueFrom(this.userService.getByRole([Role.PM.valueOf()]));
  }

  addProjectManager(projectId: number) {
    const pmIds = this.selectedPMToAddToProject.map(user => user.id);
    this.projectService.addProjectManagers(projectId, pmIds).subscribe({
      next: (response: User[]) => {
        if (this.project) {
          this.project.pms = response || [];
        }
        this.selectedPMToAddToProject = [];

        this.dropdownOptions = this.dropdownOptions.filter(u => !pmIds.includes(u.id));

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully added Project Manager',
          life: 3000
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  removeProjectManager(pmId: number) {
    this.projectService.removeProjectManager(this.project?.id!, pmId).subscribe({
      next: (response) => {
        console.log(response);
        let removed = this.allProjectManagers?.find(user => user.id === pmId) as SimpleUser;
        this.dropdownOptions.push(removed);

        if (this.project) {
          this.project.pms = response || [];
        }

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Successfully removed Project Manager!',
          life: 3000
        });

      }, error: (err) => console.log(err)
    })
  }

  showDeleteProjectConfirmation(pmId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this Project Manager?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeProjectManager(pmId);
      }
    });
  }
}
