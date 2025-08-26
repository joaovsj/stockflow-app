import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home-routing.module').then((p) => p.HomeRoutingModule)
  },
  {
      path: 'produtos',
      loadChildren: () => import('./products/products.module').then((p) => p.ProductsModule)
  },
  {
      path: 'fornecedores',
      loadChildren: () => import('./providers/providers.module').then((f) => f.ProvidersModule)
  },
  {
      path: 'movimentacoes',
      loadChildren: () => import('./movements/movements.module').then((m) => m.MovementsModule)
  },
  {
      path: 'relatorios',
      loadChildren: () => import('./reports/reports.module').then((r) => r.ReportsModule)
  },
  {
      path: 'funcionarios',
      loadChildren: () => import('./employees/employees.module').then((f) => f.EmployeesModule)
  },
  {
      path: 'perfil',
      loadComponent: () => import('./profile/profile.component')
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
