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
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
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
      },
      error: (err) => console.log(err)
    }))

    this.loadMenuItems();
  }

  loadMenuItems() {
    this.menuItems.push({
        label: 'Users',
        icon: 'pi pi-calendar',
        routerLink: ['/admin/users'],
        routerLinkActiveOptions: {
          exact:
            true
        }
      },
      {
        label: 'Projects',
        icon: 'pi pi-calendar',
        routerLink: ['/admin/projects'],
        routerLinkActiveOptions: {
          exact:
            true
        }
      }, {
        label: 'Tasks',
        icon: 'pi pi-calendar',
        routerLink: ['/admin/tasks'],
        routerLinkActiveOptions: {
          exact:
            true
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
