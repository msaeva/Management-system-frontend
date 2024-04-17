import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {MenuItem, SharedModule} from "primeng/api";
import {LayoutService} from "@core/services/layout.service";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ProjectService} from "@core/services/project.service";
import {Project} from "@core/types/projects/project";

@Component({
  selector: 'app-project-manager',
  standalone: true,
  imports: [
    AsyncPipe,
    NavigationComponent,
    NgIf,
    RouterOutlet,
    SidebarComponent,
    ButtonModule,
    ConfirmDialogModule,
    SharedModule,
    NgStyle
  ],
  templateUrl: './project-manager-layout.component.html',
  styleUrl: './project-manager-layout.component.scss'
})
export class ProjectManagerLayout implements OnInit {

  constructor(private layoutService: LayoutService,
              private projectService: ProjectService) {
  }

  menuItems: MenuItem[] = [];
  showSidebar$ = this.layoutService.getValue();
  loadingProject: boolean = true;

  ngOnInit(): void {
    this.loadProjects();
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.menuItems.push({
        label: 'Meetings',
        icon: 'pi pi-calendar',
        routerLink: ['/project-manager', 'meetings']
      },
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: ['/project-manager', 'profile']
      }
    );
  }

  loadProjects(): void {
    this.projectService.getPMProjects().subscribe({
      next: (response: Project[]) => {
        this.loadingProject = true;
        this.mapProjectsToMenuItems(response);
      },
      error: () => {
        console.log("error");
      }
    })
  }

  mapProjectsToMenuItems(projects: Project[]): void {
    const records = projects.map(project => ({
      label: project.title,
      icon: 'pi pi-folder-open',
      routerLink: ['project', project.id]
    }));

    this.menuItems = [...this.menuItems, {
      label: 'Projects',
      icon: 'pi pi-folder-open',
      items: records,
    }
    ]
  }
}
