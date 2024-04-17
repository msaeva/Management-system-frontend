import {Component, OnInit} from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {NgClass, NgIf} from "@angular/common";
import {AuthService} from "@core/services/auth.service";
import {LayoutService} from "@core/services/layout.service";
import {LocalStorageService} from "@core/services/local-storage.service";
import {Role} from "@core/role.enum";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MenubarModule,
    NgClass,
    NgIf
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent implements OnInit{
  role: string | null = null

  constructor(private authService: AuthService,
              private localStorageService: LocalStorageService,
              private layoutService: LayoutService) {
  }

  ngOnInit(): void {
    this.role = this.localStorageService.getAuthUserRole();
    console.log(this.role)
  }

  toggleSidebar() {
    this.layoutService.toggleSidebar();
  }

  logout() {
    this.authService.logout();
  }

  protected readonly Role = Role;

}
