import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserContextService } from '../services/common/userContext.service';
import { StorageKeys } from '../constants/local-storage-keys';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userContext = inject(UserContextService)

  if(userContext.user$().isAuthenticated){
    const token = localStorage.getItem(StorageKeys.TOKEN_KEY)
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
