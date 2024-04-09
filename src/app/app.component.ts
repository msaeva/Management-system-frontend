import {Component, inject} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavigationComponent} from "@layouts/shared-components/navigation/navigation.component";
import {ProjectManagementLayout} from "@layouts/project-management/project-management-layout.component";
import {map} from "rxjs";
import {AsyncPipe, NgIf, NgStyle} from "@angular/common";
import {SidebarComponent} from "@layouts/shared-components/sidebar/sidebar.component";
import {ToastModule} from "primeng/toast";
import {ButtonModule} from "primeng/button";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    ProjectManagementLayout,
    NgIf, AsyncPipe, NavigationComponent, SidebarComponent, ToastModule, ButtonModule, ConfirmDialogModule, NgStyle],
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
