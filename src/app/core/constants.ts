import {Role} from "@core/role.enum";
import {ProjectStatus} from "@core/project-status";
import {TaskStatus} from "@core/task-status";

export const JWT_LOCAL_STORAGE_KEY = "token"
export const API_URL = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api';
export const API_URL_ADMIN = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api/admin';
export const API_URL_PM = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api/project-manager';

export const DEFAULT_ROUTING = new Map([
  [Role.ADMIN, "admin"],
  [Role.USER, "project-management"],
  [Role.PM, "project-manager"],
])

export  const roleOptions: { value: string, label: string }[] = [
  {value: Role.ADMIN.valueOf(), label: 'Admin'},
  {value: Role.USER.valueOf(), label: 'User'},
  {value: Role.PM.valueOf(), label: 'PM'}
];

export  const projectStatus: { value: string, label: string }[] = [
  {value: ProjectStatus.STARTED.valueOf(), label: 'Started'},
  {value: ProjectStatus.COMPLETED.valueOf(), label: 'Completed'},
  {value: ProjectStatus.NOT_STARTED.valueOf(), label: 'Not Started'},
  {value: ProjectStatus.CANCELLED.valueOf(), label: 'Cancelled'},
];

export  const taskStatus: { value: string, label: string }[] = [
  {value: TaskStatus.OPEN.valueOf(), label: 'Open'},
  {value: TaskStatus.TODO.valueOf(), label: 'Todo'},
  {value: TaskStatus.DONE.valueOf(), label: 'Done'},
  {value: TaskStatus.IN_PROGRESS.valueOf(), label: 'In Progress'}
];
