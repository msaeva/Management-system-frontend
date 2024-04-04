import {ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CreateTaskComponent} from "@feature/admin/create-task/create-task.component";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {DetailedMeeting} from "@core/types/detailed-meeting";
import {FullCalendarModule} from "@fullcalendar/angular";
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import {DetailedMeetingComponent} from "@feature/project/components/detailed-meeting/detailed-meeting.component";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {Meeting} from "@core/types/meeting";
import {MeetingService} from "@core/services/meeting.service";
import {AdminDetailedMeetingComponent} from "@feature/admin/admin-detailed-meeting/admin-detailed-meeting.component";
import {SimpleUser} from "@core/types/users/simple-user";
import {Project} from "@core/types/projects/project";
import {User} from "@core/types/users/user";
import {UserService} from "@core/services/user-service";
import {Role} from "@core/role.enum";
import {ProjectService} from "@core/services/project.service";
import {ProjectUser} from "@core/types/projects/project-user";
import {ToastService} from "@core/services/toast.service";

@Component({
  selector: 'app-meetings-list',
  standalone: true,
  imports: [
    ButtonModule,
    CreateTaskComponent,
    DialogModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    RippleModule,
    SharedModule,
    TableModule,
    FullCalendarModule,
    DetailedMeetingComponent,
    AdminDetailedMeetingComponent
  ],
  templateUrl: './admin-meetings.component.html',
  styleUrl: './admin-meetings.component.scss'
})
export class AdminMeetingsComponent implements OnInit {
  currentEvents = signal<EventApi[]>([]);
  forms: FormGroup[] = [];
  meetings: DetailedMeeting[] = [];
  filteredMeetings: DetailedMeeting[] = [];

  users: SimpleUser[] = [];
  selectedUser!: SimpleUser;

  projects: ProjectUser[] = [];
  selectedProject!: ProjectUser;
  filteredProjects: ProjectUser[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    plugins: [interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    weekends: false,
    editable: true,
    selectable: true,
    selectMirror: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  events: EventInput[] = [];
  selectedMeeting: Meeting | undefined;

  visibleMeetingInformationDialog: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef,
              private meetingService: MeetingService,
              private userService: UserService,
              private projectService: ProjectService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadProjects();
    this.loadMeetings();
  }

  loadProjects() {
    this.projectService.getProjectsWithUsers().subscribe({
      next: (response) => {
        this.projects = response;
        this.filteredProjects = response;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private loadUsers() {
    this.userService.getByRole([Role.USER.valueOf(), Role.PM.valueOf()]).subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  loadMeetings() {
    this.meetingService.getMeetings(null, null).subscribe({
      next: (response: DetailedMeeting[]) => {
        this.meetings = response;

        this.events = this.meetings.map(meeting => ({
          id: meeting.id.toString(),
          title: meeting.title,
          date: new Date(meeting.start).toISOString().slice(0, 10),
          start: meeting.start,
          end: meeting.end
        }));
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: "1",
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }


  handleEventClick(clickInfo: EventClickArg) {
    const clickedEventId = clickInfo.event.id;
    this.selectedMeeting = this.meetings.find(meeting => meeting.id.toString() === clickedEventId) as Meeting;

    this.visibleMeetingInformationDialog = true;
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  updateMeetingHandler(updatedMeeting: Meeting) {
    const updatedEventIndex = this.events.findIndex(event => event.id === updatedMeeting.id.toString());
    console.log(updatedEventIndex);

    if (updatedEventIndex !== -1) {
      const updatedEvents = [...this.events];
      updatedEvents[updatedEventIndex] = {
        id: updatedMeeting.id.toString(),
        title: updatedMeeting.title,
        start: updatedMeeting.start,
        end: updatedMeeting.end
      };
      this.events = updatedEvents;

      this.toastService.showMessage({
        severity: 'success',
        summary: 'Success',
        detail: 'Meeting updated successfully',
        life: 3000
      });
    }
  }

  deleteMeetingHandler(id: number) {
    this.events = this.events.filter(event => event.id !== id.toString());
    this.visibleMeetingInformationDialog = false;

    this.toastService.showMessage({
      severity: 'success',
      summary: 'Success',
      detail: 'Meeting deleted successfully',
      life: 3000
    });
  }

  onUserChange() {
    if (this.selectedUser) {
      this.meetingService.getMeetings(this.selectedUser.id, this.selectedProject ? this.selectedProject.id : null)
        .subscribe((meetings: DetailedMeeting[]) => {
          this.filteredMeetings = meetings;
          this.mapEvents();
        });
    } else {
      this.filteredMeetings = this.meetings.slice();
      this.mapEvents();
    }
  }

  private mapEvents() {
    this.events = this.filteredMeetings.map(meeting => ({
      id: meeting.id.toString(),
      title: meeting.title,
      date: new Date(meeting.start).toISOString().slice(0, 10),
      start: meeting.start,
      end: meeting.end
    }));
  }

  onProjectChange() {
    if (this.selectedProject) {
      this.meetingService.getMeetings(this.selectedUser ? this.selectedUser.id : null, this.selectedProject.id)
        .subscribe((meetings: DetailedMeeting[]) => {
          this.filteredMeetings = meetings;
          this.mapEvents();
        });
    } else {
      this.filteredMeetings = this.meetings.slice();
      this.mapEvents();
    }
  }

}
