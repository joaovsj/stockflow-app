import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./pages/pages.module').then((p) => p.PagesModule),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component')
    },
];
