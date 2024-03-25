import {CanActivateFn, Router} from "@angular/router";
import {inject} from "@angular/core";
import {LocalStorageService} from "@core/services/local-storage.service";

export const privateGuard: CanActivateFn = () => {
  const localStorageService = inject(LocalStorageService);
  const router = inject(Router);

  return localStorageService.getToken() !== null ? true : router.navigate(['/login']);
}
