import {Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {ProjectService} from "@core/services/project.service";
import {TreeSelectModule} from "primeng/treeselect";
import {TreeNode} from "primeng/api";
import {ListboxModule} from "primeng/listbox";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {lastValueFrom} from "rxjs";
import {ProjectTeam} from "@core/types/projects/project-team";
import {ChipsModule} from "primeng/chips";
import {ButtonModule} from "primeng/button";
import {DateSelectArg} from '@fullcalendar/core';
import {DatePipe} from "@angular/common";
import {MeetingService} from "@core/services/meeting.service";
import {DetailedMeeting} from "@core/types/meetings/detailed-meeting";
import {LocalStorageService} from "@core/services/local-storage.service";
import {Role} from "@core/role.enum";
import {CalendarModule} from "primeng/calendar";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {CreateMeetingData} from "@core/types/meetings/create-meeting-data";
import {generateRandomString} from "@core/utils";

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [
    TreeSelectModule,
    ListboxModule,
    FormsModule,
    ChipsModule,
    ButtonModule,
    DatePipe,
    CalendarModule,
    ReactiveFormsModule
  ],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.scss'
})
export class CreateMeetingComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  @Input({required: true}) selectInfo!: DateSelectArg;
  @Output() newMeetingEvent: EventEmitter<DetailedMeeting> = new EventEmitter<DetailedMeeting>();

  projects: ProjectTeam[] = [];
  options: TreeNode[] = [];
  selectedData: TreeNode[] = [];
  title: string = '';
  start!: Date;
  end!: Date;

  constructor(private projectService: ProjectService,
              private meetingService: MeetingService,
              private localStorageService: LocalStorageService) {
  }

  async ngOnInit() {
    await this.loadProjects();

    for (const project of this.projects) {
      const record: TreeNode = {
        key: generateRandomString(),
        label: project.title,
        data: project.id.toString(),
        icon: 'pi pi-folder',
      }

      record.children = (project.teams ?? []).map(t => ({
        key: generateRandomString(),
        label: t.name,
        data: t.id.toString(),
        icon: 'pi pi-users',

      }))
      this.options.push(record);
    }
    this.start = this.selectInfo.start;
    this.end = this.selectInfo.end;
  }

  async loadProjects() {
    if (this.localStorageService.getAuthUserRole() === Role.PM.valueOf()) {
      this.projects = await lastValueFrom(this.projectService.getPMProjectsWithTeams());
    } else if (this.localStorageService.getAuthUserRole() === Role.ADMIN.valueOf()) {
      this.projects = await lastValueFrom(this.projectService.getAllProjectsWithTeams());
    }
  }


  createMeeting(): void {
    let projectId;
    let teamIds: number[] = [];
    for (const node of this.selectedData) {
      if (!node.parent) {
        projectId = node.data;
        if (node.children) {
          teamIds = node.children.map((child: any) => parseInt(child.data));
        }
      } else {
        projectId = node.parent.data;
        teamIds.push(Number.parseInt(<string>node.data));
      }
    }

    const body: CreateMeetingData = {
      title: this.title,
      projectId: Number.parseInt(projectId!),
      teamIds: teamIds,
      start: this.start.getTime(),
      end: this.end.getTime(),
    }

    if (this.localStorageService.getAuthUserRole() === Role.PM.valueOf()) {
      this.meetingService.createPm(body)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: DetailedMeeting) => {
            this.newMeetingEvent.emit(response);
          },
          error: (err) => {
            console.log(err);
          }
        })
    } else if (this.localStorageService.getAuthUserRole() === Role.ADMIN.valueOf()) {
      this.meetingService
        .createAdmin(body)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: DetailedMeeting) => {
            this.newMeetingEvent.emit(response);
          },
          error: (err) => {
            console.log(err);
          }
        })
    }
  }
}

