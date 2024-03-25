import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {PanelMenuModule} from "primeng/panelmenu";
import {MenuItem} from "primeng/api";
import {TieredMenuModule} from "primeng/tieredmenu";
import {ToggleButtonModule} from "primeng/togglebutton";
import {FormsModule} from "@angular/forms";
import {ProjectService} from "@core/services/project.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    PanelMenuModule,
    TieredMenuModule,
    ToggleButtonModule,
    FormsModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() menuItems!: MenuItem[];

  constructor(private projectService: ProjectService) {
  }
}
