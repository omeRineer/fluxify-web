import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserContext } from '../services/common/user-context';
import { StorageKeys } from '../constants/local-storage-keys';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userContext = inject(UserContext)

  if(userContext.state$().isAuthenticated){
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
