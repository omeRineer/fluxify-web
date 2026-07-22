import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserContext } from '../services/common/user-context';

export const authGuard: CanActivateFn = (route, state) => {
  const userContext = inject(UserContext)
  const router = inject(Router)

  return userContext.state$().isAuthenticated ? true : router.navigate([ '/login' ]);
};
