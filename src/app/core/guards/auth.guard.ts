import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserContextService } from '../services/common/userContext.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userContext = inject(UserContextService)
  const router = inject(Router)

  return userContext.user$().isAuthenticated ? true : router.navigate([ '/login' ]);
};
