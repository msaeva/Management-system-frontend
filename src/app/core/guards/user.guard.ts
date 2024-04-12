import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {LocalStorageService} from "@core/services/local-storage.service";
import {Role} from "@core/role.enum";
import {DEFAULT_ROUTING} from "@core/constants";

export const userGuard: CanActivateFn = () => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  const role = localStorageService.getAuthUserRole() as Role;
  return role  === Role.USER ? true : router.navigate([DEFAULT_ROUTING.get(role)]);
}
