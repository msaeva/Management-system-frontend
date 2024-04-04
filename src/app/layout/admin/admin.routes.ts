import {Routes} from "@angular/router";
import {AdminComponent} from "@layouts/admin/admin.component";
import {UserListComponent} from "@feature/admin/user-list/user.list.component";
import {AdminProjectListComponent} from "@feature/admin/project-list/admin-project-list.component";
import {AdminProjectsTaskListComponent} from "@feature/admin/project-task-list/admin-projects-task-list.component";
import {AdminTaskListComponent} from "@feature/admin/admin-task-list/admin-task-list.component";
import {AdminMeetingsComponent} from "@feature/admin/admin-meetings/admin-meetings.component";

export default <Routes>[
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'projects/:id/tasks',
        component: AdminTaskListComponent
      },
      {
        path: 'projects',
        component: AdminProjectListComponent
      },
      {
        path: 'tasks',
        component: AdminProjectsTaskListComponent
      },
      {
        path: 'meetings',
        component: AdminMeetingsComponent
      }
    ]
  }
];
