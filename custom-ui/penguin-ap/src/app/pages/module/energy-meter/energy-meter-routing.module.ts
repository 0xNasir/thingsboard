import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EnergyMeterComponent} from './energy-meter.component';
import {EnergyMeterLinkComponent} from "./energy-meter-link/energy-meter-link.component";

const routes: Routes = [
  {path: '', component: EnergyMeterComponent},
  {
    path: ':id',
    component: EnergyMeterLinkComponent
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnergyMeterRoutingModule {
}
