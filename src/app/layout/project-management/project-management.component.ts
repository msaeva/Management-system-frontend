import {Component, OnInit} from '@angular/core';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {ProjectService} from "@core/services/project.service";
import {MenuItem} from "primeng/api";
import {AsyncPipe, NgIf} from "@angular/common";
import {LayoutService} from "@core/services/layout.service";

@Component({
  selector: 'app-project-management',
  standalone: true,
  imports: [
    NavigationComponent,
    SidebarComponent,
    RouterOutlet,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './project-management.component.html',
  styleUrl: './project-management.component.scss'
})
export class ProjectManagementComponent implements OnInit {
  menuItems: MenuItem[] = [];
  showSidebar$ = this.layoutService.getValue();

  constructor(private projectService: ProjectService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    this.loadProjects();
    this.loadMeetings();

    // this.menuItems.push({
    //   label: 'Users',
    //   icon: 'pi pi-calendar',
    //   routerLink: ['/admin/users'],
    // })
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
