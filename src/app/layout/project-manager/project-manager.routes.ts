import {Routes} from '@angular/router';
import {ProjectComponent} from "@feature/project/project.component";
import {ProjectManagerLayout} from "@layouts/project-manager/project-manager-layout.component";
import {PmMeetingsComponent} from "@feature/project-manager/pm-meetings/pm-meetings.component";

export default <Routes>[
  {
    path: '',
    component: ProjectManagerLayout,
    children: [
      {
        path: 'project-manager/:id',
        component: ProjectComponent,
      },
      {
        path: 'meetings',
        component: PmMeetingsComponent
      }
    ]
  }
];
