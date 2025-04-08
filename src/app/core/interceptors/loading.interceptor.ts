import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';

import { LoadingService } from '../services/loading.service';
import { inject } from '@angular/core';

const loadingSrv =  inject(LoadingService);
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  loadingSrv.show();

  return next(req).pipe(
    finalize(() => {
      loadingSrv.hide();
    })
  );
};