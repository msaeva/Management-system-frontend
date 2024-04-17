import {Routes} from '@angular/router';
import {ProjectComponent} from "@feature/shared/project/project.component";
import {ProjectManagerLayout} from "@layouts/project-manager/project-manager-layout.component";
import {PmMeetingsComponent} from "@feature/project-manager/pm-meetings/pm-meetings.component";
import {ProfileComponent} from "@feature/shared/profile/profile.component";

export default <Routes>[
  {
    path: '',
    component: ProjectManagerLayout,
    children: [
      {
        path: 'project/:id',
        component: ProjectComponent,
      },
      {
        path: 'meetings',
        component: PmMeetingsComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      },
      {
        path: '', redirectTo: '/project-manager/meetings', pathMatch: 'full'
      }
    ]
  }
];
