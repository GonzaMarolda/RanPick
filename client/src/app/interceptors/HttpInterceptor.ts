import { HttpInterceptorFn, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpLoadService } from '../services/HttpLoadService';
import { finalize } from 'rxjs/operators';

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const httpLoadService = inject(HttpLoadService);
  
  httpLoadService.incrementRequests();

  return next(req).pipe(
    finalize(() => {
      httpLoadService.decrementRequests();
    })
  );
};