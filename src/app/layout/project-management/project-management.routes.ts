import {Routes} from '@angular/router';
import {ProjectManagementComponent} from "@layouts/project-management/project-management.component";
import {ProjectComponent} from "@feature/project/project.component";
import {MeetingsComponent} from "@feature/project/components/meetings/meetings.component";

export default <Routes>[
  {
    path: '',
    component: ProjectManagementComponent,
    children: [
      {
        path: 'project/:id',
        component: ProjectComponent,
      },
      {
        path: 'meetings',
        component: MeetingsComponent
      }
    ]
  }
];
