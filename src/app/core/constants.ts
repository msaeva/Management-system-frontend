import {Role} from "@core/role.enum";

export const JWT_LOCAL_STORAGE_KEY = "token"
export const API_URL = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api';
export const API_URL_ADMIN = 'http://localhost:8080/system-management-1.0-SNAPSHOT/api/admin';

export const DEFAULT_ROUTING = new Map([
  [Role.ADMIN, "admin"],
  [Role.USER, "project-management"],
])
