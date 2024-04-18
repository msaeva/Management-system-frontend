import {ChangeDetectorRef, Component, OnInit, signal} from '@angular/core';
import {CalendarOptions, EventApi, EventClickArg, EventInput} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import {FullCalendarModule} from "@fullcalendar/angular";
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {MeetingService} from "@core/services/meeting.service";
import {Meeting} from "@core/types/meetings/meeting";
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
  visibleMeetingInformationDialog: boolean = false;
  selectedMeeting: Meeting | undefined;

  events: EventInput[] = [];

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
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };

  constructor(private changeDetector: ChangeDetectorRef,
              private meetingService: MeetingService) {
  }

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
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


  handleEventClick(clickInfo: EventClickArg): void {
    const clickedEventId = clickInfo.event.id;
    this.selectedMeeting = this.meetings.find(meeting => meeting.id.toString() === clickedEventId) as Meeting;
    this.visibleMeetingInformationDialog = true;
  }

  handleEvents(events: EventApi[]): void {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
