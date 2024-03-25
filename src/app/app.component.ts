import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {ProjectManagementComponent} from "./layout/project-management/project-management.component";
import {BrowserAnimationsModule, NoopAnimationsModule} from "@angular/platform-browser/animations";
import {map} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {ToastModule} from "primeng/toast";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProjectManagementComponent, NgIf, AsyncPipe, NavigationComponent, SidebarComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'management-system';
  route = inject(Router);

  excludedRoutes = ["/login", "/register"];

  hideNavigation$ = this.route
    .routerState.root.url.pipe(map(p => p.map((url) => url.toString())
      .some((currentUrl) => this.excludedRoutes.includes(currentUrl))));
}
