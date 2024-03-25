import { Component } from '@angular/core';
import {MenubarModule} from "primeng/menubar";
import {NgClass} from "@angular/common";
import {AuthService} from "@core/services/auth.service";

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MenubarModule,
    NgClass
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }
}
