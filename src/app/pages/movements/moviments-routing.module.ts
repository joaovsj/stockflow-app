import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MovementsListComponent } from './movements-list/movements-list.component';

const routes: Routes = [
  {
    path: '', component: MovementsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MovementsRoutingModule { }
