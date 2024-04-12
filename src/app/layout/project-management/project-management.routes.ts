import {Routes} from '@angular/router';
import {ProjectManagementLayout} from "@layouts/project-management/project-management-layout.component";
import {ProjectComponent} from "@feature/shared/project/project.component";
import {MeetingsComponent} from "@feature/user/meetings/meetings.component";
import {ProfileComponent} from "@feature/user/profile/profile.component";

export default <Routes>[
  {
    path: '',
    component: ProjectManagementLayout,
    children: [
      {
        path: 'project/:id',
        component: ProjectComponent,
      },
      {
        path: 'meetings',
        component: MeetingsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: '', redirectTo: '/project-management/meetings', pathMatch: 'full'
      }
    ]
  }
];
