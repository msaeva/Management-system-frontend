import {Component, Input} from '@angular/core';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {Task} from "@core/types/task";
import {DetailedTaskComponent} from "@feature/project/components/detailed-task/detailed-task.component";
import {NgIf} from "@angular/common";
import {SingleTaskService} from "@core/services/single-task.service";
import {DialogModule} from "primeng/dialog";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DetailedTaskComponent,
    NgIf,
    DialogModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {
  @Input() task!: Task;
  visible: boolean = false;
  taskId: number | undefined;

  openModal(id: number) {
    this.taskId = this.task.id;
    this.visible = true;
  }
}
