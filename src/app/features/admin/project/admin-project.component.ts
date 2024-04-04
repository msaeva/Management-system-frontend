import {Component, Input} from '@angular/core';
import {DetailedProject} from "@core/types/projects/detailed-project";

@Component({
  selector: 'app-admin-project',
  standalone: true,
  imports: [],
  templateUrl: './admin-project.component.html',
  styleUrl: './admin-project.component.scss'
})
export class AdminProjectComponent {
  @Input({required:true}) project!: DetailedProject;

}
