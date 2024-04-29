import {Component, DestroyRef, EventEmitter, inject, Input, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {SimpleUser} from "@core/types/users/simple-user";
import {MultiSelectModule} from "primeng/multiselect";
import {ProjectService} from "@core/services/project.service";
import {DetailedProject} from "@core/types/projects/detailed-project";
import {ToastService} from "@core/services/toast.service";
import {CreateProjectData} from "@core/types/projects/create-project-data";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [
    ButtonModule,
    DropdownModule,
    InputTextModule,
    NgIf,
    PasswordModule,
    ReactiveFormsModule,
    InputTextareaModule,
    MultiSelectModule,
    FormsModule
  ],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss'
})
export class CreateProjectComponent {
  destroyRef = inject(DestroyRef);

  @Output() newProjectEvent = new EventEmitter<DetailedProject>();
  @Input() allProjectManagers!: SimpleUser[];

  createProjectFormGroup = this.formBuilder.group({
    title: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20)
      ]),
    description: new FormControl('',
      [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]),
    abbreviation: new FormControl('',
      [Validators.required,
        Validators.minLength(2),
        Validators.maxLength(4)
      ]
    ),
    pmIds: new FormControl([]),
  })


  constructor(private formBuilder: FormBuilder,
              private projectService: ProjectService,
              private toastService: ToastService,) {
  }


  createProject(): void {
    const body: CreateProjectData = {
      title: this.createProjectFormGroup.value?.title ?? '',
      description: this.createProjectFormGroup.value?.description ?? '',
      abbreviation: this.createProjectFormGroup.value?.abbreviation ?? '',
      pmIds: this.createProjectFormGroup.value?.pmIds ?? [],
    }

    this.projectService.create(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (project: DetailedProject) => {
          this.newProjectEvent.emit(project);

          this.toastService.showMessage({
            severity: 'success',
            summary: 'Success',
            detail: 'Project created successfully',
            life: 3000
          });

          this.createProjectFormGroup.reset();
        }
      })
  }
}
