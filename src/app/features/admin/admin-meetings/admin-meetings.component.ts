import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {RippleModule} from "primeng/ripple";
import {SharedModule} from "primeng/api";
import {TableModule} from "primeng/table";
import {DetailedMeeting} from "@core/types/meetings/detailed-meeting";
import {FullCalendarModule} from "@fullcalendar/angular";
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput} from "@fullcalendar/core";
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {Meeting} from "@core/types/meetings/meeting";
import {MeetingService} from "@core/services/meeting.service";
import {DetailedMeetingComponent} from "@feature/shared/detailed-meeting/detailed-meeting.component";
import {SimpleUser} from "@core/types/users/simple-user";
import {UserService} from "@core/services/user-service";
import {Role} from "@core/role.enum";
import {ProjectService} from "@core/services/project.service";
import {ProjectUser} from "@core/types/projects/project-user";
import {ToastService} from "@core/services/toast.service";
import {CreateMeetingComponent} from "@feature/shared/create-meeting/create-meeting.component";
import {CheckboxModule} from "primeng/checkbox";
import {TriStateCheckboxModule} from "primeng/tristatecheckbox";
import {meetingStatus} from "@core/constants";
import {MeetingStatus} from "@core/meeting-status.enum";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";


@Component({
  selector: 'app-meetings-list',
  standalone: true,
  imports: [
    ButtonModule,
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
    DetailedMeetingComponent,
    CreateMeetingComponent,
    CheckboxModule,
    TriStateCheckboxModule
  ],
  templateUrl: './admin-meetings.component.html',
  styleUrl: './admin-meetings.component.scss'
})
export class AdminMeetingsComponent implements OnInit {
  destroyRef = inject(DestroyRef);

  currentEvents = signal<EventApi[]>([]);
  forms: FormGroup[] = [];
  meetings: DetailedMeeting[] = [];
  filteredMeetings: DetailedMeeting[] = [];

  users: SimpleUser[] = [];
  selectedUser!: SimpleUser;

  projects: ProjectUser[] = [];
  selectedProject!: ProjectUser;
  filteredProjects: ProjectUser[] = [];

  selectedMeetingStatus: string | undefined;
  selectInfo!: DateSelectArg;

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
  selectedMeeting: DetailedMeeting | undefined;

  visibleMeetingInformationDialog: boolean = false;
  visibleCreateMeetingDialog: boolean = false;
  protected readonly meetingStatus = meetingStatus;

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


  loadProjects(): void {
    this.projectService
      .getProjectsWithUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.projects = response;
          this.filteredProjects = response;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  private loadUsers(): void {
    this.userService
      .getByRole([Role.USER.valueOf(), Role.PM.valueOf()])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.users = response;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  loadMeetings(): void {
    this.meetingService
      .getMeetings(null, null)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
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

  handleDateSelect(selectInfo: DateSelectArg): void {
    this.selectInfo = selectInfo;

    const today = new Date();

    if (selectInfo.start < today) {
      this.toastService.showMessage({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot create meeting for past dates.',
        life: 3000
      });
      return;
    }
    this.visibleCreateMeetingDialog = true;
  }


  handleEventClick(clickInfo: EventClickArg): void {
    const clickedEventId = clickInfo.event.id;
    this.selectedMeeting = this.meetings.find(meeting => meeting.id.toString() === clickedEventId) as DetailedMeeting;

    this.visibleMeetingInformationDialog = true;
  }

  handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  updateMeetingHandler(updatedMeeting: Meeting): void {
    const updatedEventIndex = this.events.findIndex(event => event.id === updatedMeeting.id.toString());

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

  deleteMeetingHandler(id: number): void {
    this.events = this.events.filter(event => event.id !== id.toString());
    this.visibleMeetingInformationDialog = false;

    this.toastService.showMessage({
      severity: 'success',
      summary: 'Success',
      detail: 'Meeting deleted successfully',
      life: 3000
    });
  }


  private mapEvents(): void {
    this.events = this.filteredMeetings.map(meeting => ({
      id: meeting.id.toString(),
      title: meeting.title,
      date: new Date(meeting.start).toISOString().slice(0, 10),
      start: meeting.start,
      end: meeting.end
    }));

  }


  newMeetingHandler(meeting: DetailedMeeting, selectInfo: DateSelectArg): void {
    this.events.push({
      id: meeting.id.toString(),
      title: meeting.title,
      date: new Date(meeting.start).toISOString().slice(0, 10),
      start: meeting.start,
      end: meeting.end
    })

    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    calendarApi.addEvent({
      id: meeting.id.toString(),
      title: meeting.title,
      start: meeting.start,
      end: meeting.end,
    });

    this.visibleCreateMeetingDialog = false;
    this.meetings.push(meeting);
    this.toastService.showMessage({
      severity: 'success',
      summary: 'Success',
      detail: 'Meeting created successfully',
      life: 3000
    });
  }


  onUserChange(): void {
    if (this.selectedUser) {
      if (this.selectedMeetingStatus || this.selectedProject) {
        this.fetchMeetingsAndUpdate(this.selectedUser.id, this.selectedProject ? this.selectedProject.id : null);
      }
      this.fetchMeetingsAndUpdate(this.selectedUser.id, null);
    } else {
      if (this.selectedMeetingStatus || this.selectedProject) {
        this.filteredMeetings = this.meetings.slice();
      }
      this.filteredMeetings = this.meetings;
    }
    this.mapEvents();
  }

  onProjectChange(): void {
    if (this.selectedProject) {
      if (this.selectedMeetingStatus || this.selectedUser) {
        this.fetchMeetingsAndUpdate(this.selectedUser ? this.selectedUser.id : null, this.selectedProject.id);
      }
      this.fetchMeetingsAndUpdate(null, this.selectedProject.id);

    } else {
      if (this.selectedMeetingStatus || this.selectedUser) {
        this.fetchMeetingsAndUpdate(this.selectedUser ? this.selectedUser.id : null, null)
      }
      this.filteredMeetings = this.meetings;
      this.mapEvents();

    }
  }

  fetchMeetingsAndUpdate(userId: number | null, projectId: number | null): void {
    this.meetingService
      .getMeetings(userId, projectId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((meetings: DetailedMeeting[]) => {
        this.filteredMeetings = meetings;
        this.mapEvents();
      });
  }

  onMeetingStatusChange(): void {
    if (this.selectedMeetingStatus === MeetingStatus.FINISHED.valueOf()) {
      this.filteredMeetings = this.selectedUser || this.selectedProject ?
        this.filteredMeetings.filter(meeting => new Date(meeting.end) < new Date()) :
        this.meetings.filter(meeting => new Date(meeting.end) < new Date());

    } else if (this.selectedMeetingStatus === MeetingStatus.NOT_STARTED.valueOf()) {
      this.filteredMeetings = this.selectedUser || this.selectedProject ?
        this.filteredMeetings.filter(meeting => new Date(meeting.end) > new Date()) :
        this.meetings.filter(meeting => new Date(meeting.end) > new Date());
    } else {
      if (this.selectedUser || this.selectedProject) {
        this.fetchMeetingsAndUpdate(this.selectedUser ? this.selectedUser.id : null,
          this.selectedProject ? this.selectedProject.id : null);
      }
      this.filteredMeetings = this.meetings;
    }
    this.mapEvents();
  }
}
