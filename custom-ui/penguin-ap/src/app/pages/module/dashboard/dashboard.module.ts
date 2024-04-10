import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DashboardRoutingModule} from './dashboard-routing.module';
import {DashboardComponent} from './dashboard.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {MatPaginatorModule} from "@angular/material/paginator";
import {DashboardLinkComponent} from './dashboard-link/dashboard-link.component';
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatList, MatListItem, MatListItemTitle, MatListSubheaderCssMatStyler} from "@angular/material/list";
import {MatTableModule} from "@angular/material/table";
import {MatChip} from "@angular/material/chips";
import {DialogUserInputComponent} from "./dashboard-link/dialog/dialog-user-input.component";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatDialogActions, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import { NgxGaugeModule } from 'ngx-gauge';

import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle
} from "@angular/material/datepicker";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatProgressSpinner} from "@angular/material/progress-spinner";


import { BrowserModule } from '@angular/platform-browser';
import { NgxEchartsModule } from 'ngx-echarts';



@NgModule({
  declarations: [
    DashboardComponent,
    DashboardLinkComponent,
  ],
  exports: [
    DialogUserInputComponent
  ],
  imports: [
    NgxGaugeModule,
    CommonModule,
    DashboardRoutingModule,
    FlexLayoutModule,
    MatCardModule,
    MatButtonModule,
    MatPaginatorModule,
    MatDivider,
    MatIcon,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListSubheaderCssMatStyler,
    MatTableModule,
    MatChip,
    MatFormField,
    MatError,
    MatLabel,
    MatDialogContent,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogTitle,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    FormsModule,
    MatSelect,
    MatOption,
    MatProgressSpinner,
    DialogUserInputComponent,
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    })
  ],
  providers:[],
  bootstrap: [DashboardLinkComponent]
})
export class DashboardModule {
}
