import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './interceptors/HttpInterceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([httpInterceptor])
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideAnimationsAsync()
  ]
};
