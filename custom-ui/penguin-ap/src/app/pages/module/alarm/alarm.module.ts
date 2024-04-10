import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AlarmRoutingModule} from './alarm-routing.module';
import {AlarmComponent} from './alarm.component';
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDivider} from "@angular/material/divider";
import {
  MatTableModule
} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatFormField} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    AlarmComponent
  ],
  imports: [
    CommonModule,
    AlarmRoutingModule,
    FlexLayoutModule,
    MatButton,
    MatTooltip,
    MatDivider,
    MatTableModule,
    MatPaginatorModule,
    MatFormField,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ]
})
export class AlarmModule {
}
