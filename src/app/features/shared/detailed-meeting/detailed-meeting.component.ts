import {Component, DestroyRef, EventEmitter, inject, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgForOf, NgIf} from "@angular/common";
import {Meeting} from "@core/types/meetings/meeting";
import {MeetingService} from "@core/services/meeting.service";
import {ConfirmationService} from "primeng/api";
import {Role} from "@core/role.enum";
import {LocalStorageService} from "@core/services/local-storage.service";
import {UpdateMeetingData} from "@core/types/meetings/update-meeting-data";
import {DetailedMeeting} from "@core/types/meetings/detailed-meeting";
import {ListboxModule} from "primeng/listbox";
import {DividerModule} from "primeng/divider";
import {ToastService} from "@core/services/toast.service";
import {MeetingStatus} from "@core/meeting-status.enum";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-detailed-meeting',
  standalone: true,
  imports: [
    ButtonModule,
    CalendarModule,
    FormsModule,
    InputTextModule,
    NgIf,
    ReactiveFormsModule,
    NgForOf,
    ListboxModule,
    DividerModule
  ],
  templateUrl: './detailed-meeting.component.html',
  styleUrl: './detailed-meeting.component.scss'
})
export class DetailedMeetingComponent {
  destroyRef = inject(DestroyRef);

  @Input() set meeting(value: DetailedMeeting) {
    if (value) {
      this.setUpUpdateMeetingFormGroup(value);
      this._meeting = value;
      this.calculateStatus();
    }
  };

  @Output() updatedMeetingEvent: EventEmitter<Meeting> = new EventEmitter<Meeting>();
  @Output() deletedMeetingEvent: EventEmitter<number> = new EventEmitter<number>();

  updateMeetingFormGroup!: FormGroup;
  currentStatus: string = ''
  _meeting!: DetailedMeeting;

  constructor(private formBuilder: FormBuilder,
              private meetingService: MeetingService,
              private localStorageService: LocalStorageService,
              private toastService: ToastService,
              private confirmationService: ConfirmationService) {
  }

  private setUpUpdateMeetingFormGroup(meeting: DetailedMeeting): void {
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

  updateMeeting(): void {
    const updatedMeetingFormValue: UpdateMeetingData = {
      ...this.updateMeetingFormGroup.value,
      start: this.updateMeetingFormGroup.value.start.getTime(),
      end: this.updateMeetingFormGroup.value.end.getTime()
    };

    if (this.getAuthUserRole() === Role.ADMIN.valueOf()) {
      this.meetingService.updateMeeting(this._meeting.id, updatedMeetingFormValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            this.toggleEditMode();
            this.updatedMeetingEvent.emit(response);
          },
          error: (err) => {
            console.log(err);
          }
        })
    } else if (this.getAuthUserRole() === Role.PM.valueOf()) {
      this.meetingService.updateMeetingPM(this._meeting.id, updatedMeetingFormValue)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
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

  toggleEditMode(): void {
    const func = this.updateMeetingFormGroup.get('title')!.disabled ? 'enable' : 'disable';

    this.updateMeetingFormGroup.controls['title'][func]();
    this.updateMeetingFormGroup.controls['start'][func]();
    this.updateMeetingFormGroup.controls['end'][func]();
  }

  cancelUpdateMeeting(): void {
    this.setUpUpdateMeetingFormGroup(this._meeting);
  }

  showDeleteMeetingConfirmation(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this meeting ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteMeeting(this._meeting.id);
      }
    });
  }

  private deleteMeeting(id: number): void {
    if (this.getAuthUserRole() === Role.ADMIN.valueOf()) {
      this.meetingService.deleteMeeting(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.deletedMeetingEvent.emit(id);
          },
          error: (err) => {
            console.log(err);
          }
        });
    } else if (this.getAuthUserRole() === Role.PM.valueOf()) {
      this.meetingService.deleteMeetingPM(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.deletedMeetingEvent.emit(id);
          },
          error: (err) => {
            console.log(err);
          }
        });
    }
  }

  getAuthUserRole() {
    return this.localStorageService.getAuthUserRole();
  }

  calculateStatus(): void {
    const now = new Date();
    const start = new Date(this.updateMeetingFormGroup.get('start')!.value);
    const end = new Date(this.updateMeetingFormGroup.get('end')!.value);

    if (now < start) {
      this.currentStatus = MeetingStatus.NOT_STARTED.valueOf();
    } else if (now > end) {
      this.currentStatus = MeetingStatus.FINISHED;
    } else {
      this.currentStatus = MeetingStatus.IN_PROGRESS;
    }
  }

  protected readonly Role = Role;


  removeTeamFromMeeting(teamId: number, meetingId: number): void {
    this.meetingService.removeTeamFromMeeting(meetingId, teamId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated: DetailedMeeting) => {
          this._meeting = updated;

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Team removed successfully',
            life: 3000
          });
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  showRemoveTeamFromMeeting(teamId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this team from the meeting ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removeTeamFromMeeting(teamId, this._meeting.id);
      }
    });
  }
}
