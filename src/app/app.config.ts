import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ErrorInterceptor} from "@core/interceptors/error.interceptor";
import {JwtInterceptor} from "@core/interceptors/jwt.interceptor";
import {ConfirmationService, MessageService} from "primeng/api";
import {ToastModule} from "primeng/toast";
import {DatePipe} from "@angular/common";

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    DatePipe,
    MessageService,
    ConfirmationService,
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    provideAnimations()
  ]
};
