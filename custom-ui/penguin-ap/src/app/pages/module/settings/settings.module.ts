import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatInputModule} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {
  MatCell,
  MatCellDef,
  MatHeaderCell,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef, MatTable, MatTableModule
} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButton, MatIconButton} from "@angular/material/button";
import {DialogSettingsComponent} from "./dialog/dialog-settings.component";
import {ReactiveFormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatToolbar} from "@angular/material/toolbar";
import {SweetAlert2Module} from "@sweetalert2/ngx-sweetalert2";


@NgModule({
  declarations: [
    SettingsComponent,
    DialogSettingsComponent
  ],
  exports:[
    DialogSettingsComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    MatInputModule,
    MatIcon,
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatTable,
    MatTableModule,
    MatDialogModule,
    MatIconButton,
    ReactiveFormsModule,
    MatButton,
    FlexLayoutModule,
    MatToolbar,
    SweetAlert2Module
  ]
})
export class SettingsModule { }
