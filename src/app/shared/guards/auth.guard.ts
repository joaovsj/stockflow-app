import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookie: CookieService = inject(CookieService)
  const router: Router = inject(Router)

  const token = cookie.get('token')
  if(!token){
    router.navigate(['login'])
    return false;
  }

  return true;
};
