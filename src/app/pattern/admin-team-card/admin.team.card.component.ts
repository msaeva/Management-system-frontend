import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {MultiSelectModule} from "primeng/multiselect";
import {ConfirmationService, SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {FormsModule} from "@angular/forms";
import {Team} from "@core/types/team";
import {TeamService} from "@core/services/team.service";
import {SimpleUser} from "@core/types/users/simple-user";
import {ToastService} from "@core/services/toast.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {NgIf, NgStyle} from "@angular/common";
import {ProjectService} from "@core/services/project.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


@Component({
  selector: 'app-admin-team-card',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    MultiSelectModule,
    SharedModule,
    TableModule,
    FormsModule,
    ConfirmDialogModule,
    NgStyle,
    NgIf
  ],
  templateUrl: './admin.team.card.component.html',
  styleUrl: './admin.team.card.component.scss'
})
export class AdminTeamCardComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  @Input({required: true}) team!: Team;
  @Input({required: true}) usersToAddToTeam!: SimpleUser[];
  @Input({required: true}) projectId!: number;

  dropdownOptions: SimpleUser[] = [];
  selectedUsersToAddToTeam: SimpleUser[] = [];

  @Output() projectDeletedEvent = new EventEmitter<number>();

  constructor(private confirmationService: ConfirmationService,
              private teamService: TeamService,
              private toastService: ToastService,
              private projectService: ProjectService) {
  }
  ngOnInit(): void {
    const teamUserIds = new Set(this.team.users.map(user => user.id));

    this.dropdownOptions = this.usersToAddToTeam
      .filter(user => !teamUserIds.has(user.id));
  }

  showRemoveUserFromTeamConfirmation(userId: number, teamId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this user?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeUserFromTeam(userId, teamId);
      }
    });
  }

  removeUserFromTeam(userId: number, teamId: number) {
    this.teamService.removeUserFromTeam(userId, teamId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.team.users = this.team.users.filter(user => user.id !== userId);

          this.dropdownOptions.push(
            this.usersToAddToTeam.find(user => user.id === userId) as SimpleUser
          );

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully removed user!',
            life: 3000
          });

        }
      })

  }

  addNewUsersToTeam(teamId: number) {
    const userIds = this.selectedUsersToAddToTeam.map(user => user.id);
    this.teamService.addUsersToTeam(teamId, userIds)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.team.users = response;
          this.selectedUsersToAddToTeam = [];
          this.dropdownOptions = this.dropdownOptions.filter(u => !userIds.includes(u.id));

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully added new user!',
            life: 3000
          });
        }
      })
  }

  deleteTeamFromProject(teamId: number) {
    this.projectService.deleteTeamFromProject(teamId, this.projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.projectDeletedEvent.emit(teamId);

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Successfully deleted team!',
            life: 3000
          });
        }
      });
  }

  showDeleteTeamConfirmation(teamId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this team?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTeamFromProject(teamId);
      }
    });
  }
}
