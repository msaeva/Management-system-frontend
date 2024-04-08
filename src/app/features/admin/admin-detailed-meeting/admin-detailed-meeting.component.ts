import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {Meeting} from "@core/types/meeting";
import {MeetingService} from "@core/services/meeting.service";
import {ToastService} from "@core/services/toast.service";
import {ConfirmationService} from "primeng/api";

@Component({
  selector: 'app-admin-detailed-meeting',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './admin-detailed-meeting.component.html',
  styleUrl: './admin-detailed-meeting.component.scss'
})
export class AdminDetailedMeetingComponent {
  @Input() set meeting(value: Meeting) {
    if (value) {
      this.setUpUpdateMeetingFormGroup(value);
      this._meeting = value;
    }
  };

  private _meeting!: Meeting;

  @Output() updatedMeetingEvent: EventEmitter<Meeting> = new EventEmitter<Meeting>();
  updateMeetingFormGroup!: FormGroup;

  @Output() deletedMeetingEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(private formBuilder: FormBuilder,
              private meetingService: MeetingService,
              private toastService: ToastService,
              private confirmationService: ConfirmationService) {
  }

  private setUpUpdateMeetingFormGroup(meeting: Meeting) {
    this.updateMeetingFormGroup = this.formBuilder.group({
      id: [
        {value: meeting.id, disabled: true},
        [Validators.required, Validators.minLength(3)]
      ],
      title: [
        {value: meeting.title, disabled: true},
        [Validators.required, Validators.minLength(4)]
      ],
      start: [
        {value: new Date(meeting.start), disabled: true},
      ],
      end: [
        {value: new Date(meeting.end), disabled: true},
      ],
      status: [
        {value: meeting.status, disabled: true},
        [Validators.required, Validators.minLength(6)]
      ],
    });
  }

  updateMeeting() {
    const updatedMeetingFormValue = {
      ...this.updateMeetingFormGroup.value,
      start: this.updateMeetingFormGroup.value.start.getTime(),
      end: this.updateMeetingFormGroup.value.end.getTime()
    };

    this.meetingService.updateMeeting(this._meeting.id, updatedMeetingFormValue).subscribe({
      next: (response) => {
        this.toggleEditMode();
        this.updatedMeetingEvent.emit(response);
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  toggleEditMode() {
    const func = this.updateMeetingFormGroup.get('title')!.disabled ? 'enable' : 'disable';

    this.updateMeetingFormGroup.controls['title'][func]();
    this.updateMeetingFormGroup.controls['start'][func]();
    this.updateMeetingFormGroup.controls['end'][func]();
  }

  cancelUpdateMeeting() {
    this.setUpUpdateMeetingFormGroup(this._meeting);
  }

  showDeleteMeetingConfirmation() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this meeting ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMeeting(this._meeting.id);
      }
    });
  }

  private deleteMeeting(id: number) {
    this.meetingService.deleteMeeting(id).subscribe({
      next: (response) => {
        this.deletedMeetingEvent.emit(id);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
