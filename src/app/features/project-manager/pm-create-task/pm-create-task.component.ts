import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Task} from "@core/types/tasks/task";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {NgIf} from "@angular/common";
import {FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {TaskService} from "@core/services/task.service";
import {ToastService} from "@core/services/toast.service";
import {DropdownModule} from "primeng/dropdown";
import {ProjectService} from "@core/services/project.service";
import {SimpleUser} from "@core/types/users/simple-user";
import {CreateTaskData} from "@core/types/tasks/create-task-data";

@Component({
  selector: 'app-pm-create-task',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    NgIf,
    ReactiveFormsModule,
    DropdownModule
  ],
  templateUrl: './pm-create-task.component.html',
  styleUrl: './pm-create-task.component.scss'
})
export class PmCreateTaskComponent implements OnInit {
  @Input({required: true}) projectId!: number;
  @Output() newTaskEvent: EventEmitter<Task> = new EventEmitter<Task>();

  createTaskFormGroup = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]),
    assignee: new FormControl<SimpleUser | null>(null)
  });

  usersOptions: SimpleUser[] = [];


  constructor(private formBuilder: FormBuilder,
              private taskService: TaskService,
              private toastService: ToastService,
              private projectService: ProjectService) {
  }

  ngOnInit(): void {
    this.loadUsersToAddToTask();
  }

  loadUsersToAddToTask(): void {
    this.projectService.getAllUsersInProject(this.projectId).subscribe({
      next: (response) => {
        this.usersOptions = response;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  createTask(): void {
    const assigneeId = this.createTaskFormGroup.value?.assignee?.id;
    const body: CreateTaskData = {
      title: this.createTaskFormGroup.value?.title ?? '',
      description: this.createTaskFormGroup.value?.description ?? '',
      projectId: this.projectId,
      userId: assigneeId || null
    }

    this.taskService.createTaskPm(body).subscribe({
      next: (task: Task) => {
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
