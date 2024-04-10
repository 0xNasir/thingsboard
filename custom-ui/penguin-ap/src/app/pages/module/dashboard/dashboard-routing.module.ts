import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {DashboardLinkComponent} from "./dashboard-link/dashboard-link.component";

const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: ':id', component: DashboardLinkComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
