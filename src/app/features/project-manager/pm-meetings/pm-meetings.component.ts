import {ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {DetailedMeetingComponent} from "@feature/shared/detailed-meeting/detailed-meeting.component";
import {CreateMeetingComponent} from "@feature/shared/create-meeting/create-meeting.component";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FullCalendarModule} from "@fullcalendar/angular";
import {NgIf} from "@angular/common";
import {SharedModule} from "primeng/api";
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput} from "@fullcalendar/core";
import {FormGroup, FormsModule} from "@angular/forms";
import {DetailedMeeting} from "@core/types/detailed-meeting";
import {SimpleUser} from "@core/types/users/simple-user";
import {ProjectUser} from "@core/types/projects/project-user";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import {Meeting} from "@core/types/meetings/meeting";
import {MeetingService} from "@core/services/meeting.service";
import {ProjectService} from "@core/services/project.service";
import {ToastService} from "@core/services/toast.service";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@Component({
  selector: 'app-pm-meetings',
  standalone: true,
  imports: [
    DetailedMeetingComponent,
    CreateMeetingComponent,
    DialogModule,
    DropdownModule,
    FullCalendarModule,
    NgIf,
    SharedModule,
    FormsModule,
    ProgressSpinnerModule
  ],
  templateUrl: './pm-meetings.component.html',
  styleUrl: './pm-meetings.component.scss'
})
export class PmMeetingsComponent implements OnInit {
  currentEvents = signal<EventApi[]>([]);
  forms: FormGroup[] = [];
  meetings: DetailedMeeting[] = [];
  users: SimpleUser[] = [];
  projects: ProjectUser[] = [];
  selectInfo!: DateSelectArg;

  loading: { meeting: boolean } = {
    meeting: true,
  }

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
  visibleCreateMeetingDialog: boolean = false;

  constructor(private changeDetector: ChangeDetectorRef,
              private meetingService: MeetingService,
              private projectService: ProjectService,
              private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.meetingService.getPMMeetings().subscribe({
      next: (response: DetailedMeeting[]) => {
        this.meetings = response;
        this.loading.meeting = false;

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
    this.selectedMeeting = this.meetings.find(meeting => meeting.id.toString() === clickedEventId) as Meeting;

    this.visibleMeetingInformationDialog = true;
  }

  handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }

  updateMeetingHandler(updatedMeeting: Meeting) {
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

    this.meetings.push(meeting);

    this.visibleCreateMeetingDialog = false;
    this.toastService.showMessage({
      severity: 'success',
      summary: 'Success',
      detail: 'Meeting created successfully',
      life: 3000
    });
  }
}
