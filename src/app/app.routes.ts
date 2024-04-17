import {Routes} from '@angular/router';
import {PageNotFoundComponent} from "./ui/page-not-found/page-not-found.component";
import {LoginComponent} from "@pattern/login/login.component";
import {RegisterComponent} from "@pattern/register/register.component";
import {privateGuard} from "@core/guards/private.guard";
import {ProfileComponent} from "@feature/shared/profile/profile.component";
import {adminGuard} from "@core/guards/admin.guard";
import {userGuard} from "@core/guards/user.guard";
import {pmGuard} from "@core/guards/pm.guard";
import {publicGuard} from "@core/guards/public.guard";

export const routes: Routes = [
  {
    path: 'project-management',
    loadChildren: () => import('@layouts/project-management/project-management.routes'),
    canActivate: [privateGuard, userGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('@layouts/admin/admin.routes'),
    canActivate: [privateGuard, adminGuard]
  },
  {
    path: 'project-manager',
    loadChildren: () => import('@layouts/project-manager/project-manager.routes'),
    canActivate: [privateGuard, pmGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [publicGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
