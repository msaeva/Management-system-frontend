import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter, withRouterConfig} from '@angular/router';

import {routes} from './app.routes';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {provideAnimations} from "@angular/platform-browser/animations";
import {ErrorInterceptor} from "@core/interceptors/error.interceptor";
import {JwtInterceptor} from "@core/interceptors/jwt.interceptor";
import {ConfirmationService, MessageService} from "primeng/api";
import {DatePipe} from "@angular/common";
import {FullCalendarModule} from "@fullcalendar/angular";
import {TextTransformPipe} from "@core/pipes/text-transform.pipe";

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
    TextTransformPipe,
    DatePipe,
    MessageService,
    ConfirmationService,
    FullCalendarModule,
    provideRouter(routes, withRouterConfig({onSameUrlNavigation: 'reload', urlUpdateStrategy: "eager"})),
    importProvidersFrom(HttpClientModule),
    provideAnimations()
  ]
};
