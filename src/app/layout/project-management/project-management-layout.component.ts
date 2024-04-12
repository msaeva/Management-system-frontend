import {Component, OnInit} from '@angular/core';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {ProjectService} from "@core/services/project.service";
import {MenuItem, SharedModule} from "primeng/api";
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";
import {LayoutService} from "@core/services/layout.service";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [
    NavigationComponent,
    SidebarComponent,
    RouterOutlet,
    NgIf,
    AsyncPipe,
    ButtonModule,
    ConfirmDialogModule,
    SharedModule,
    NgStyle
  ],
  templateUrl: './project-management-layout.component.html',
  styleUrl: './project-management-layout.component.scss'
})
export class ProjectManagementLayout implements OnInit {
  menuItems: MenuItem[] = [];
  showSidebar$ = this.layoutService.getValue();

  constructor(private projectService: ProjectService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    this.loadProjects();
    this.loadMeetings();

    this.menuItems.push({
      label: 'Profile',
      icon: 'pi pi-user',
      routerLink: ['/project-management/profile'],
    })
  }

  loadMeetings() {
    this.menuItems.push({
      label: 'Meetings',
      icon: 'pi pi-calendar',
      routerLink: ['/project-management', 'meetings']
    });
  }

  loadProjects() {
    this.projectService.getUserProjects().subscribe({
      next: (response: any) => {
        console.log(response);
        this.mapProjectsToMenuItems(response);
      },
      error: () => {
        console.log("error");
      }
    })
  }

  mapProjectsToMenuItems(projects: any[]) {
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
