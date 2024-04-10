import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {EnergyMeterRoutingModule} from './energy-meter-routing.module';
import {EnergyMeterComponent} from './energy-meter.component';
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatPaginator} from "@angular/material/paginator";
import {EnergyMeterLinkComponent} from './energy-meter-link/energy-meter-link.component';
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatProgressBar} from "@angular/material/progress-bar";


@NgModule({
  declarations: [
    EnergyMeterComponent,
    EnergyMeterLinkComponent
  ],
    imports: [
        CommonModule,
        EnergyMeterRoutingModule,
        FlexModule,
        MatCard,
        MatCardContent,
        MatCardHeader,
        MatCardTitle,
        MatPaginator,
        FlexLayoutModule,
        MatListModule,
        MatIconModule,
        MatCardSubtitle,
        MatProgressSpinner,
        MatProgressBar
    ]
})
export class EnergyMeterModule {
}
