///
/// Copyright © 2016-2023 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import {Component, OnInit} from '@angular/core';
import {PageComponent} from '@shared/components/page.component';
import {HasConfirmForm} from '@core/guards/confirm-on-exit.guard';
import {Store} from '@ngrx/store';
import {AppState} from '@core/core.state';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {DashboardService} from '@core/http/dashboard.service';
import {PageLink} from '@shared/models/page/page-link';
import {DropEffect} from 'ngx-drag-drop';
import {DndDropEvent} from 'ngx-drag-drop/lib/dnd-dropzone.directive';
import {CustomerService} from '@core/http/customer.service';
import {MenuSection} from '@core/services/menu.models';
import {TenantService} from '@core/http/tenant.service';
import {AuthState} from '@core/auth/auth.models';
import {getCurrentAuthState} from '@core/auth/auth.selectors';
import {ActionNotificationShow} from "@core/notification/notification.actions";
import {UserService} from "@core/http/user.service";

@Component({
  selector: 'tb-menu-config-admin-settings',
  templateUrl: './menu-config-admin-settings.component.html',
  styleUrls: ['./menu-config-admin-settings.component.scss', './settings-card.scss']
})
export class MenuConfigAdminSettingsComponent extends PageComponent implements OnInit, HasConfirmForm {
  draggableList = [];
  dashboards = [];
  editMenuItem: any;
  customerList: any[];
  selectedCustomer: any = undefined;
  predefinedMenu: any[] = [{
    id: 'home',
    name: 'Home',
    type: 'link',
    path: '/home',
    icon: 'home',
    pages: []
  }, {
    id: 'alarms',
    name: 'Alarms',
    type: 'link',
    path: '/alarms',
    icon: 'warning',
    pages: []
  }, {
    id: 'notification_inbox',
    name: 'Notification',
    fullName: 'Notification Inbox',
    type: 'link',
    path: '/notification/inbox',
    icon: 'inbox',
    pages: []
  }];
// ,{
//   id: 'audit_log',
//   name: 'Audit log',
//   type: 'link',
//   path: '/auditLogs',
//   icon: 'track_changes',
//   pages: []
// }
  authState: AuthState = getCurrentAuthState(this.store);

  constructor(protected store: Store<AppState>,
              private dashboardService: DashboardService,
              private customerService: CustomerService,
              private userService:UserService,
              public fb: UntypedFormBuilder) {
    super(store);
  }

  ngOnInit() {
    const pageLink = new PageLink(200);
    this.customerService.getCustomers(pageLink).subscribe(customers => {
      this.customerList = customers.data;
    });
  }

  onDragged(item: any, list: any[], effect: DropEffect) {
    if (effect === 'move') {
      const index = list.indexOf(item);
      list.splice(index, 1);
    }
  }

  onDrop(event: DndDropEvent, list?: any[]) {
    if (list && (event.dropEffect === 'copy' || event.dropEffect === 'move')) {
      let index = event.index;

      if (typeof index === 'undefined') {
        index = list.length;
      }

      list.splice(index, 0, event.data);
    }
  }

  confirmOnExitMessage: string;

  confirmForm(): UntypedFormGroup {
    return undefined;
  }

  removeItemFromMenu(item: any, list: any) {
    this.deleteObjectById(this.draggableList, item.id);
  }

  deleteObjectById(arr: any[], id: number): boolean {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj.id === id) {
        arr.splice(i, 1);
        return true;
      } else if (obj.pages && obj.pages.length > 0) {
        const deleted = this.deleteObjectById(obj.pages, id);
        if (deleted) {
          return true;
        }
      }
    }
    return false;
  }


  sendToMenu(item: any) {
    this.draggableList.push({
      id: new Date().getTime(),
      uname: item.name,
      name: item.title,
      icon: 'link',
      path: '/dashboards/' + item.id.id,
      type: item.type || 'link',
      pages: []
    });
  }

  sendPredefinedMenuToMenu(item: MenuSection) {
    this.draggableList.push(item);
  }

  updateMenuItem(item: any): void {
    this.editMenuItem=this.editMenuItem===undefined?item:undefined;
  }

  inputMenuData($event: any, id: number, title: string) {
    this.updateObjectById(this.draggableList, id, title, $event.target.value);
  }

  updateObjectById(arr: any[], id: number, title: string, value: string): void {
    for (let i = 0; i < arr.length; i++) {
      const obj = arr[i];
      if (obj.id === id) {
        if (title === 'title') {
          arr[i].name = value;
        } else {
          arr[i].icon = value;
        }
      } else if (obj.children && obj.children.length > 0) {
        this.updateObjectById(obj.children, id, title, value);
      }
    }
  }

  saveMenu() {
    try {
      this.selectedCustomer.additionalInfo.satlConfig = JSON.parse(this.selectedCustomer.additionalInfo.satlConfig);
    } catch (e) {
      this.selectedCustomer.additionalInfo.satlConfig = {};
    }
    this.selectedCustomer.additionalInfo.satlConfig.menu = this.draggableList;
    this.selectedCustomer.additionalInfo.satlConfig = JSON.stringify(this.selectedCustomer.additionalInfo.satlConfig);
    this.customerService.saveCustomer(this.selectedCustomer).subscribe(
      () => {
        this.store.dispatch(new ActionNotificationShow({
          message: 'Menu is saved to selected customer',
          type: 'success',
          duration: 750,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        }));
      }
    );
  }

  addPageToMenu() {
    this.draggableList.push({
      id: new Date().getTime(),
      uname: 'No link',
      name: 'Untitled',
      icon: 'home',
      path: '',
      type: 'toggle',
      pages: []
    });
  }

  customerSelected($event: any) {
    this.selectedCustomer = $event.value;
    try {
      const satlConf = JSON.parse(this.selectedCustomer.additionalInfo.satlConfig);
      this.draggableList = satlConf.menu || [];
    } catch (e) {
      this.draggableList = [];
    }
    const pageLink = new PageLink(200);
    this.dashboardService.getCustomerDashboards(this.selectedCustomer.id.id, pageLink).subscribe(dashboard => {
      this.dashboards = dashboard.data;
    });
  }

  saveMenuToCurrentTenant() {
    this.userService.getUser(this.authState.authUser.userId).subscribe({
      next: user=>{
        user.additionalInfo.satlConfig = {};
        user.additionalInfo.satlConfig.menu = this.draggableList;
        user.additionalInfo.satlConfig = JSON.stringify(user.additionalInfo.satlConfig);
        this.userService.saveUser(user, false, {}).subscribe({
          next: response=>{
            this.store.dispatch(new ActionNotificationShow({
              message: 'Menu set to current tenant',
              type: 'success',
              duration: 750,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            }));
          }
        });
      }
    });
  }
}
