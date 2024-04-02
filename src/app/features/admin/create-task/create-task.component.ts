import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {MultiSelectModule} from "primeng/multiselect";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {DetailedTask} from "@core/types/DetailedTask";
import {TaskService} from "@core/services/task.service";
import {ToastService} from "@core/services/toast.service";

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss'
})
export class CreateTaskComponent {
  @Output() newTaskEvent = new EventEmitter<DetailedTask>();
  @Input({required: true}) projectId!: number;

  createTaskFormGroup = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
  });

  constructor(private formBuilder: FormBuilder,
              private taskService: TaskService,
              private toastService: ToastService) {
  }

  createTask() {
    console.log(this.createTaskFormGroup.value)
    this.taskService.create(this.createTaskFormGroup.value, this.projectId).subscribe({
      next: (task) => {
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
