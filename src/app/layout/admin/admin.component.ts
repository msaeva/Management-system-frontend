import {Component, OnInit} from '@angular/core';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {RouterOutlet} from "@angular/router";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NavigationComponent,
    RouterOutlet,
    SidebarComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  menuItems: MenuItem[] = [];

  ngOnInit(): void {
    this.menuItems.push({
      label: 'Users',
      icon: 'pi pi-calendar',
      routerLink: ['/admin/users']
    })
    this.menuItems.push({
      label: 'Projects',
      icon: 'pi pi-calendar',
      routerLink: ['/admin/projects']
    })
  }
}
