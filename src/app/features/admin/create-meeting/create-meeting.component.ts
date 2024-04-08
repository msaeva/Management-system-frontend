import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ProjectService} from "@core/services/project.service";
import {TreeSelectModule} from "primeng/treeselect";
import {TreeNode} from "primeng/api";
import {ListboxModule} from "primeng/listbox";
import {FormsModule} from "@angular/forms";
import {lastValueFrom} from "rxjs";
import {ProjectTeam} from "@core/types/projects/project-team";
import {ChipsModule} from "primeng/chips";
import {ButtonModule} from "primeng/button";
import {DateSelectArg} from '@fullcalendar/core';
import {DatePipe} from "@angular/common";
import {MeetingService} from "@core/services/meeting.service";
import {DetailedMeeting} from "@core/types/detailed-meeting";

@Component({
  selector: 'app-create-meeting',
  standalone: true,
  imports: [
    TreeSelectModule,
    ListboxModule,
    FormsModule,
    ChipsModule,
    ButtonModule,
    DatePipe
  ],
  templateUrl: './create-meeting.component.html',
  styleUrl: './create-meeting.component.scss'
})
export class CreateMeetingComponent implements OnInit {
  @Input({required: true}) selectInfo!: DateSelectArg;
  @Output() newMeetingEvent: EventEmitter<DetailedMeeting> = new EventEmitter<DetailedMeeting>();
  projects: ProjectTeam[] = [];
  options: TreeNode[] = [];
  selectedData!: any[];
  title: string = '';


  constructor(private projectService: ProjectService,
              private meetingService: MeetingService) {
  }

  async ngOnInit() {
    await this.loadProjects();

    for (const project of this.projects) {
      const record: TreeNode = {
        key: project.id.toString(),
        label: project.title,
        data: project.id.toString(),
        icon: 'pi pi-folder',
      }

      record.children = (project.teams ?? []).map(t => ({
        key: t.id.toString(),
        label: t.name,
        data: t.id.toString(),
        icon: 'pi pi-users',

      }))
      this.options.push(record);
    }
  }

  async loadProjects() {
    this.projects = await lastValueFrom(this.projectService.getAllProjectsWithTeams());
  }

  onSelect() {
    console.log(this.selectedData)
  }

  createMeeting() {
    const body = {
      title: this.title,
      projectId: this.selectedData[0].key as number,
      teamIds: this.selectedData[0].children.map((child: any) => parseInt(child.key)),
      start: this.selectInfo.start.getTime(),
      end: this.selectInfo.end.getTime(),
    }
    this.meetingService.create(body).subscribe({
      next: (response: DetailedMeeting) => {
        this.newMeetingEvent.emit(response);
      }
    })
  }
}
