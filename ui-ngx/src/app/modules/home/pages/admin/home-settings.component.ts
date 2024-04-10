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

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@core/core.state';
import { PageComponent } from '@shared/components/page.component';
import { Router } from '@angular/router';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { HasConfirmForm } from '@core/guards/confirm-on-exit.guard';
import { DashboardService } from '@core/http/dashboard.service';
import { HomeDashboardInfo } from '@shared/models/dashboard.models';
import { isDefinedAndNotNull } from '@core/utils';
import { DashboardId } from '@shared/models/id/dashboard-id';
import {PageLink} from "@shared/models/page/page-link";
import {CustomerService} from "@core/http/customer.service";
import {UserService} from "@core/http/user.service";
import {AuthState} from "@core/auth/auth.models";
import {getCurrentAuthState} from "@core/auth/auth.selectors";
import {User} from "@shared/models/user.model";
import {ActionNotificationShow} from "@core/notification/notification.actions";

@Component({
  selector: 'tb-home-settings',
  templateUrl: './home-settings.component.html',
  styleUrls: ['./home-settings.component.scss', './settings-card.scss']
})
export class HomeSettingsComponent extends PageComponent implements OnInit, HasConfirmForm {
  homeSettings: UntypedFormGroup;
  publicConfig:UntypedFormGroup;
  customerList:any[];
  selectedCustomer:any=undefined;
  customerHomeSettings: UntypedFormGroup;
  customerDashboards:any[]=[];
  pageLink = new PageLink(200);
  authState: AuthState = getCurrentAuthState(this.store);
  constructor(protected store: Store<AppState>,
              private router: Router,
              private dashboardService: DashboardService,
              private customerService: CustomerService,
              private userService: UserService,
              public cd: ChangeDetectorRef,
              public fb: UntypedFormBuilder) {
    super(store);
  }

  ngOnInit() {
    this.homeSettings = this.fb.group({
      dashboardId: [null],
      hideDashboardToolbar: [true]
    });
    this.customerHomeSettings = this.fb.group({
      dashboardId: [null],
      hideDashboardToolbar: [true]
    });
    this.publicConfig=this.fb.group({
      theme: ['light', Validators.required],
      primaryToolbarBgColor: ['#FF0000'],
      breadcrumbBgColor: ['#000000'],
      drawerBgColor: ['#000000'],
      drawerLogoBgColor: ['#000000'],
      primaryColor: ['#2196f3'],
      accentColor: ['#ffc107'],
      warnColor: ['#f44336'],
      profileUrl: ['/account'],
      poweredByHtml: [`<div style="margin: 0 auto; width: 100%; text-align: center; background-color: #232222;padding: 5px 0;"><div style=" color: white;font-size: 14px;">Powered By Sincos</div></div>`],
    });
    this.publicConfig.disable();
    this.customerHomeSettings.disable();
    this.dashboardService.getTenantHomeDashboardInfo().subscribe(
      (homeDashboardInfo) => {
        this.setHomeDashboardInfo(homeDashboardInfo);
      }
    );

    this.customerService.getCustomers(this.pageLink).subscribe(customers=>{
      this.customerList=customers.data;
    });
  }

  save(): void {
    const strDashboardId = this.homeSettings.get('dashboardId').value;
    const dashboardId: DashboardId = strDashboardId ? new DashboardId(strDashboardId) : null;
    const hideDashboardToolbar = this.homeSettings.get('hideDashboardToolbar').value;
    const homeDashboardInfo: HomeDashboardInfo = {
      dashboardId,
      hideDashboardToolbar
    };
    this.dashboardService.setTenantHomeDashboardInfo(homeDashboardInfo).subscribe(
      () => {
        this.setHomeDashboardInfo(homeDashboardInfo);
      }
    );
  }

  confirmForm(): UntypedFormGroup {
    return this.homeSettings;
  }

  private setHomeDashboardInfo(homeDashboardInfo: HomeDashboardInfo) {
    this.homeSettings.reset({
      dashboardId: homeDashboardInfo?.dashboardId?.id,
      hideDashboardToolbar: isDefinedAndNotNull(homeDashboardInfo?.hideDashboardToolbar) ?
        homeDashboardInfo?.hideDashboardToolbar : true
    });
  }

  customerSelected($event: any) {
    this.selectedCustomer=$event.value;
    this.publicConfig.enable();
    this.customerHomeSettings.enable();
    this.dashboardService.getCustomerDashboards(this.selectedCustomer.id.id, this.pageLink).subscribe(dashboard=>{
      this.customerDashboards=dashboard.data;
    });
    this.setCustomerDashboard(this.selectedCustomer.additionalInfo);
    try{
      let satlConf=JSON.parse(this.selectedCustomer.additionalInfo.satlConfig);
      this.setPublicInfo(satlConf['publicConfig']);
    }catch (e) {
      this.setPublicInfo({});
    }
  }
  private setPublicInfo(publicConfigData:any) {
    console.log(publicConfigData)
    this.publicConfig.reset({
      theme: publicConfigData.theme||'light',
      primaryToolbarBgColor: publicConfigData.primaryToolbarBgColor||'#FF0000',
      breadcrumbBgColor: publicConfigData.breadcrumbBgColor||'#000000',
      drawerBgColor: publicConfigData.drawerBgColor||'#000000',
      drawerLogoBgColor: publicConfigData.drawerLogoBgColor||'#FF0000',
      primaryColor: publicConfigData.primaryColor||'#2196f3',
      accentColor: publicConfigData.accentColor||'#ffc107',
      warnColor: publicConfigData.warnColor||'#f44336',
      profileUrl: publicConfigData.profileUrl||'/account',
      poweredByHtml: decodeURI(publicConfigData.poweredByHtml)
    });
  }

  saveConfig() {
    if(!this.selectedCustomer.additionalInfo){
      this.selectedCustomer.additionalInfo={};
    }
    this.selectedCustomer.additionalInfo.homeDashboardId=this.customerHomeSettings.value.dashboardId;
    this.selectedCustomer.additionalInfo.homeDashboardHideToolbar=this.customerHomeSettings.value.hideDashboardToolbar;
    try {
      this.selectedCustomer.additionalInfo.satlConfig=JSON.parse(this.selectedCustomer.additionalInfo.satlConfig);
    }catch (e){
      this.selectedCustomer.additionalInfo.satlConfig={publicConfig:{}};
    }
    this.selectedCustomer.additionalInfo.satlConfig['publicConfig']=this.publicConfig.value;
    this.selectedCustomer.additionalInfo.satlConfig['publicConfig']['poweredByHtml']=encodeURI(this.publicConfig.value.poweredByHtml);

    this.selectedCustomer.additionalInfo.satlConfig=JSON.stringify(this.selectedCustomer.additionalInfo.satlConfig);
    this.customerService.saveCustomer(this.selectedCustomer).subscribe(res=>{
      this.publicConfig.value.poweredByHtml=decodeURI(this.publicConfig.value.poweredByHtml);
    }, error => {
      this.publicConfig.value.poweredByHtml=decodeURI(this.publicConfig.value.poweredByHtml);
    });
  }

  private setCustomerDashboard(additionalInfo) {
    this.customerHomeSettings.reset({
      dashboardId: additionalInfo?.homeDashboardId,
      hideDashboardToolbar: isDefinedAndNotNull(additionalInfo?.homeDashboardHideToolbar) ?
        additionalInfo?.homeDashboardHideToolbar : true
    });
  }

  applyColorToThisDevice() {
    localStorage.setItem('satlTheme', this.publicConfig.value.theme||'light');
    localStorage.setItem('satlUIPrimaryColor', this.publicConfig.value.primaryColor);
    localStorage.setItem('satlUIAccentColor', this.publicConfig.value.accentColor);
    localStorage.setItem('satlUIWarnColor', this.publicConfig.value.warnColor);
    localStorage.setItem('satlPrimaryToolbar', this.publicConfig.value.primaryToolbarBgColor)
    localStorage.setItem('satlBreadcrumb', this.publicConfig.value.breadcrumbBgColor)
    localStorage.setItem('satlDrawerBgColor', this.publicConfig.value.drawerBgColor)
    localStorage.setItem('satlDrawerLogoBgColor', this.publicConfig.value.drawerLogoBgColor)
    this.userService.getUser(this.authState.authUser.userId).subscribe({
      next:(user:User)=>{
        try {
          user.additionalInfo.satlConfig=JSON.parse(user.additionalInfo.satlConfig);
        }catch (e){
          user.additionalInfo.satlConfig={publicConfig:{}};
        }
        user.additionalInfo.satlConfig['publicConfig']=this.publicConfig.value;
        user.additionalInfo.satlConfig['publicConfig']['poweredByHtml']=encodeURI(this.publicConfig.value.poweredByHtml);

        user.additionalInfo.satlConfig=JSON.stringify(user.additionalInfo.satlConfig);
        this.userService.saveUser(user).subscribe(res=>{
          this.store.dispatch(new ActionNotificationShow({
            message: 'Setting is set to current tenant user',
            type: 'success',
            duration: 750,
            verticalPosition: 'top',
            horizontalPosition: 'right'
          }));
        })
      }
    });
    this.cd.detectChanges();
  }

}
