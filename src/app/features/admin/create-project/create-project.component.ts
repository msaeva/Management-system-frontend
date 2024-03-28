import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {NgIf} from "@angular/common";
import {PasswordModule} from "primeng/password";
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextareaModule} from "primeng/inputtextarea";
import {UserService} from "@core/services/user-service";
import {SimpleUser} from "@core/types/users/SimpleUser";
import {MultiSelectModule} from "primeng/multiselect";
import {ProjectService} from "@core/services/project.service";
import {DetailedProject} from "@core/types/DetailedProject";
import {ToastService} from "@core/services/toast.service";

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
export class CreateProjectComponent implements OnInit {
  @Output() newProjectEvent = new EventEmitter<DetailedProject>();
  @Input() allProjectManagers!: SimpleUser[];


  createProjectFormGroup = this.formBuilder.group({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(250)]),
    abbreviation: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pmIds: new FormControl([], [Validators.required]),
  })


  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private projectService: ProjectService,
              private toastService: ToastService,) {
  }

  ngOnInit(): void {
    // this.loadPMs();
  }

  // loadPMs() {
  //   this.userService.getByRole(Role.PM.valueOf()).subscribe({
  //     next: (response) => {
  //       this.projectManagers = response;
  //       this.projectManagersOptions = this.projectManagers;
  //       console.log(this.projectManagersOptions);
  //     }, error: (err) => console.log(err)
  //   })
  // }


  createProject() {
    this.projectService.create(this.createProjectFormGroup.value).subscribe({
      next: (project) => {
        this.newProjectEvent.emit(project);
        console.log(project);

        this.toastService.showMessage({
          severity: 'success',
          summary: 'Success',
          detail: 'Project created successfully',
          life: 3000
        });

        this.createProjectFormGroup.reset();
      },
      error: (err) => console.log(err)
    })
  }
}
