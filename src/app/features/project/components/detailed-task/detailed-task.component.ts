import {Component, Input, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {SingleTaskService} from "@core/services/single-task.service";
import {SingleTask} from "@core/types/SingleTask";

@Component({
  selector: 'app-detailed-task',
  standalone: true,
  imports: [
    ButtonModule,
    DialogModule
  ],
  templateUrl: './detailed-task.component.html',
  styleUrl: './detailed-task.component.scss'
})
export class DetailedTaskComponent implements OnInit {
  @Input() id: number | undefined;
  task: SingleTask | undefined;

  constructor(private singleTaskService: SingleTaskService) {
  }

  ngOnInit(): void {
    this.loadTask()
  }

  loadTask() {
    this.singleTaskService.getById(this.id).subscribe({
      next: (task: SingleTask) => {
        this.task = task;
      }, error: () => {
        console.log("Error loading tasks");
      }
    });
  }

}

