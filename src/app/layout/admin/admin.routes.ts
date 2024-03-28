import {Routes} from "@angular/router";
import {AdminComponent} from "@layouts/admin/admin.component";
import {UserListComponent} from "@feature/admin/user-list/user.list.component";
import {AdminProjectListComponent} from "@feature/admin/project-list/admin-project-list.component";
import {AdminTaskListComponent} from "@feature/admin/task-list/admin-task-list.component";

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
        path: 'projects',
        component: AdminProjectListComponent
      },
      {
        path: 'tasks',
        component: AdminTaskListComponent
      }
    ]
  }
];
