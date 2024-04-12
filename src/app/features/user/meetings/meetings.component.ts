import {ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import {FullCalendarModule} from "@fullcalendar/angular";
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {MeetingService} from "@core/services/meeting.service";
import {Meeting} from "@core/types/meeting";
import {DialogModule} from "primeng/dialog";
import {NgIf} from "@angular/common";
import {DetailedMeetingComponent} from "@feature/shared/detailed-meeting/detailed-meeting.component";

@Component({
  selector: 'app-meetings',
  standalone: true,
  imports: [
    FullCalendarModule,
    DialogModule,
    NgIf,
    DetailedMeetingComponent
  ],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.scss'
})
export class MeetingsComponent implements OnInit {
  currentEvents = signal<EventApi[]>([]);
  meetings: Meeting[] = [];

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

  constructor(private changeDetector: ChangeDetectorRef,
              private meetingService: MeetingService) {
  }

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings() {
    this.meetingService.getUserMeetings().subscribe({
      next: (response: Meeting[]) => {
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


  visibleMeetingInformationDialog: boolean = false;

  handleEventClick(clickInfo: EventClickArg) {
    const clickedEventId = clickInfo.event.id;
    console.log(clickedEventId);
    this.selectedMeeting = this.meetings.find(meeting => meeting.id.toString() === clickedEventId) as Meeting;

    console.log(this.selectedMeeting);
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
    }
  }
}
