import { HttpInterceptorFn } from '@angular/common/http';
// import { finalize } from 'rxjs';

// import { LoadingService } from '../../shared/services/loading.service';
// import { inject } from '@angular/core';

// const loadingSrv =  inject(LoadingService);
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
  // loadingSrv.show();

  // return next(req).pipe(
  //   finalize(() => {
  //     loadingSrv.hide();
  //   })
  // );
};
