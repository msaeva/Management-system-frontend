import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {Meeting} from "@core/types/meeting";
import {MeetingService} from "@core/services/meeting.service";
import {ConfirmationService} from "primeng/api";
import {Role} from "@core/role.enum";
import {LocalStorageService} from "@core/services/local-storage.service";

@Component({
  selector: 'app-detailed-meeting',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './detailed-meeting.component.html',
  styleUrl: './detailed-meeting.component.scss'
})
export class DetailedMeetingComponent implements OnInit{
  @Input() set meeting(value: Meeting) {
    if (value) {
      this.setUpUpdateMeetingFormGroup(value);
      this._meeting = value;
    }
  };

  @Output() updatedMeetingEvent: EventEmitter<Meeting> = new EventEmitter<Meeting>();
  @Output() deletedMeetingEvent: EventEmitter<number> = new EventEmitter<number>();

  updateMeetingFormGroup!: FormGroup;
  private _meeting!: Meeting;
  constructor(private formBuilder: FormBuilder,
              private meetingService: MeetingService,
              private localStorageService: LocalStorageService,
              private confirmationService: ConfirmationService) {
  }

  ngOnInit(): void {
    console.log("in detailed component")
    console.log(this._meeting)
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

    if (this.localStorageService.getRole() === Role.ADMIN.valueOf()) {
      this.meetingService.updateMeeting(this._meeting.id, updatedMeetingFormValue).subscribe({
        next: (response) => {
          this.toggleEditMode();
          this.updatedMeetingEvent.emit(response);
        },
        error: (err) => {
          console.log(err);
        }
      })
    } else if (this.localStorageService.getRole() === Role.PM.valueOf()) {
      this.meetingService.updateMeetingPM(this._meeting.id, updatedMeetingFormValue).subscribe({
        next: (response) => {
          this.toggleEditMode();
          this.updatedMeetingEvent.emit(response);
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
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
    if (this.localStorageService.getRole() === Role.ADMIN.valueOf()){
      this.meetingService.deleteMeeting(id).subscribe({
        next: (response) => {
          this.deletedMeetingEvent.emit(id);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }else if(this.localStorageService.getRole() === Role.PM.valueOf()){
      this.meetingService.deleteMeetingPM(id).subscribe({
        next: (response) => {
          this.deletedMeetingEvent.emit(id);
        },
        error: (err) => {
          console.log(err);
        }
      });
    }

  }
}
