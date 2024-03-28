import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {MenuItem} from "primeng/api";
import {LayoutService} from "@core/services/layout.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NavigationComponent,
    RouterOutlet,
    SidebarComponent,
    AsyncPipe,
    NgIf
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
        routerLink: ['/admin/users']
      },
      {
        label: 'Projects',
        icon: 'pi pi-calendar',
        routerLink: ['/admin/projects']
      }, {
        label: 'Tasks',
        icon: 'pi pi-calendar',
        routerLink: ['/admin/tasks']
      })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
