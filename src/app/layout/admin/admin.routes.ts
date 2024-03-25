import {Routes} from "@angular/router";
import {ProjectManagementComponent} from "@layouts/project-management/project-management.component";
import {ProjectComponent} from "@feature/project/project.component";
import {MeetingComponent} from "@feature/project/components/meeting/meeting.component";
import {AdminComponent} from "@layouts/admin/admin.component";
import {UserListComponent} from "@feature/admin/user-list/user.list.component";

export default <Routes>[
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent,
      },
      // {
      //   path: 'meetings',
      //   component: MeetingComponent
      // }
    ]
  }
];
