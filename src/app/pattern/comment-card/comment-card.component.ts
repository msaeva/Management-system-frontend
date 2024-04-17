import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {AvatarModule} from "primeng/avatar";
import {CommentService} from "@core/services/comment.service";
import {DatePipe, NgIf} from "@angular/common";
import {Comment} from "@core/types/comment";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ConfirmationService} from "primeng/api";
import {ToastService} from "@core/services/toast.service";
import {LocalStorageService} from "@core/services/local-storage.service";

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    AvatarModule,
    ReactiveFormsModule,
    InputTextareaModule,
    NgIf
  ],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.scss'
})
export class CommentCardComponent implements OnInit {
  @Input({required: true}) comment!: Comment;
  @Output() deleteCommentEvent: EventEmitter<number> = new EventEmitter<number>();

  mode: 'modify' | 'display' = "display";

  constructor(private commentService: CommentService,
              private datePipe: DatePipe,
              private confirmationService: ConfirmationService,
              private toastService: ToastService,
              private localStorageService: LocalStorageService) {
  }

  updateCommentFormControl: FormControl = new FormControl();

  ngOnInit(): void {
    this.initializeCommentFormGroup()
  }

  initializeCommentFormGroup() {
    this.updateCommentFormControl.setValue(this.comment.comment);
    this.updateCommentFormControl.setValidators(
      [Validators.required,
        Validators.minLength(5),
        Validators.maxLength(200)
      ]);
    this.updateCommentFormControl.updateValueAndValidity();
  }

  getAuthUserId(): number {
    return this.localStorageService.getAuthUserId() as number;
  }

  formatDateTime(dateTime: string | null): string {
    if (!dateTime) {
      return '';
    }
    return this.datePipe.transform(new Date(dateTime), 'medium') || '';
  }

  showDeleteCommentConfirmation(id: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this comment ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteComment(id);
      }
    });
  }

  deleteComment(id: number) {
    this.commentService.deleteComment(id).subscribe({
      next: (response) => {
        this.deleteCommentEvent.emit(id);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  updateComment(id: number) {
    this.mode = 'modify';

    this.commentService.updateComment(id, this.updateCommentFormControl.value).subscribe({
      next: (response) => {
        this.comment = response;
        this.mode = 'display';

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Task updated successfully',
          life: 3000
        });
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  cancelUpdateComment() {
    this.initializeCommentFormGroup();
    this.mode = 'display';
  }


  getFirstLetter(fullName: string): string {
    return fullName ? fullName.charAt(0).toUpperCase() : '';
  }

  getAvatarColor() {
    const colors = ['#fbe7c6', '#e1d093', '#b4f8c8', '#b9f5af', '#00ffff', '#ffaebc'];
    const index = Math.floor(Math.random() * colors.length);
    return {'background-color': colors[index]};
  }
}
