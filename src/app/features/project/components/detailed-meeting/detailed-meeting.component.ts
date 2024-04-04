import {Component, Input} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {DatePipe, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Meeting} from '@core/types/meeting';
import {CalendarModule} from "primeng/calendar";

@Component({
  selector: 'app-detailed-meeting',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    DropdownModule,
    InputTextModule,
    InputTextareaModule,
    NgIf,
    ReactiveFormsModule,
    CalendarModule,
    FormsModule,
    DatePipe
  ],
  templateUrl: './detailed-meeting.component.html',
  styleUrl: './detailed-meeting.component.scss'
})
export class DetailedMeetingComponent {
  @Input({required: true}) meeting!: Meeting;

}
