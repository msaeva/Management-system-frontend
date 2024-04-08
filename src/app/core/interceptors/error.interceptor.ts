import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {Router} from "@angular/router";
import {inject, Injectable} from "@angular/core";
import {LocalStorageService} from "@core/services/local-storage.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private router: Router = inject(Router);
  private localStorageService: LocalStorageService = inject(LocalStorageService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err) {
          switch (err.status) {
            case 400:
              break;
            case 401:
              this.localStorageService.removeToken();
              this.router.navigate(['login']);
              break;
            default:
              break;
          }
        }
        throw err;
      })
    );
  }
}
