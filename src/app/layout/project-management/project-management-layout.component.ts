import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {RouterOutlet} from "@angular/router";
import {ProjectService} from "@core/services/project.service";
import {MenuItem, SharedModule} from "primeng/api";
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";
import {LayoutService} from "@core/services/layout.service";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {Project} from "@core/types/projects/project";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

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
  destroyRef = inject(DestroyRef);

  menuItems: MenuItem[] = [];
  showSidebar$ = this.layoutService.getValue();

  constructor(private projectService: ProjectService,
              private layoutService: LayoutService) {
  }

  ngOnInit() {
    this.loadProjects();

    this.menuItems.push({
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: ['/project-management/profile'],
      },
      {
        label: 'Meetings',
        icon: 'pi pi-calendar',
        routerLink: ['/project-management', 'meetings']
      })
  }


  loadProjects() {
    this.projectService.getUserProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: Project[]) => {
          this.mapProjectsToMenuItems(response);
        },
        error: () => {
          console.log("error");
        }
      })
  }

  mapProjectsToMenuItems(projects: Project[]) {
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
