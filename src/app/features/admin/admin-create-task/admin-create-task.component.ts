import {Component, DestroyRef, EventEmitter, inject, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MultiSelectModule} from "primeng/multiselect";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DetailedTask} from "@core/types/tasks/detailed-task";
import {TaskService} from "@core/services/task.service";
import {ToastService} from "@core/services/toast.service";
import {CreateTaskData} from "@core/types/tasks/create-task-data";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-admin-create-task',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './admin-create-task.component.html',
  styleUrl: './admin-create-task.component.scss'
})
export class AdminCreateTaskComponent {
  destroyRef = inject(DestroyRef);

  @Output() newTaskEvent = new EventEmitter<DetailedTask>();
  @Input({required: true}) projectId!: number;

  createTaskFormGroup = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(4)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
  });

  constructor(private formBuilder: FormBuilder,
              private taskService: TaskService,
              private toastService: ToastService) {
  }

  createTask(): void {
    const body: CreateTaskData = {
      title: this.createTaskFormGroup.value?.title ?? '',
      description: this.createTaskFormGroup.value?.description ?? '',
      projectId: this.projectId,
      userId: null
    }

    this.taskService.createTaskAdmin(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task: DetailedTask) => {
          this.newTaskEvent.emit(task);

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Task created successfully',
            life: 3000
          });

          this.createTaskFormGroup.reset();

        },
        error: (err) => console.log(err)
      })
  }
}
