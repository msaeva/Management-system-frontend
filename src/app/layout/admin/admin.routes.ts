import {Routes} from "@angular/router";
import {AdminComponent} from "@layouts/admin/admin.component";
import {UserListComponent} from "@feature/admin/user-list/user.list.component";
import {ProjectListComponent} from "@feature/admin/project.list/project.list.component";

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
        component: ProjectListComponent
      }
    ]
  }
];
