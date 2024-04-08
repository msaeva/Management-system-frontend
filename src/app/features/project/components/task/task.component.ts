import {Component, Input} from '@angular/core';
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {Task} from "@core/types/tasks/task";
import {DetailedTaskComponent} from "@feature/project/components/detailed-task/detailed-task.component";
import {NgIf, TitleCasePipe} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DragDropModule} from "primeng/dragdrop";
import {ChipModule} from "primeng/chip";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    DetailedTaskComponent,
    NgIf,
    DialogModule,
    DragDropModule,
    ChipModule,
    TitleCasePipe
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
