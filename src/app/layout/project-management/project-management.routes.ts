import {Routes} from '@angular/router';
import {ProjectManagementComponent} from "@layouts/project-management/project-management.component";
import {ProjectComponent} from "@feature/project/project.component";
import {MeetingComponent} from "@feature/project/components/meeting/meeting.component";

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
        component: MeetingComponent
      }
    ]
  }
];
