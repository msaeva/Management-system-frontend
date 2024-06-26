import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {MenuItem, SharedModule} from "primeng/api";
import {LayoutService} from "@core/services/layout.service";
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";
import {Subscription} from "rxjs";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NavigationComponent,
    RouterOutlet,
    SidebarComponent,
    AsyncPipe,
    NgIf,
    ButtonModule,
    ConfirmDialogModule,
    SharedModule,
    NgStyle
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayout implements OnInit, OnDestroy {
  menuItems: MenuItem[] = [];
  sidebarSubject = this.layoutService.showSidebarSubject;
  subscriptions: Subscription = new Subscription();
  showSidebar: boolean = true;

  constructor(private layoutService: LayoutService) {
  }

  ngOnInit(): void {
    this.subscriptions.add(this.sidebarSubject.subscribe({
      next: (response) => {
        this.showSidebar = response;
      }
    }))

    this.loadMenuItems();
  }

  loadMenuItems() {
    this.menuItems.push({
        label: 'Users',
        icon: 'pi pi-users',
        routerLink: ['/admin/users'],
        routerLinkActiveOptions: {
          exact:
            false
        }
      },
      {
        label: 'Projects',
        icon: 'pi pi-folder-open',
        routerLink: ['/admin/projects'],
        routerLinkActiveOptions: {
          exact:
            false
        }
      }, {
        label: 'Tasks',
        icon: 'pi pi-file-edit',
        routerLink: ['/admin/tasks'],
        routerLinkActiveOptions: {
          exact:
            false
        },
      },
      {
        label: 'Meetings',
        icon: 'pi pi-calendar',
        routerLink: ['/admin/meetings'],
        routerLinkActiveOptions: {
          exact:
            true
        },
      })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
