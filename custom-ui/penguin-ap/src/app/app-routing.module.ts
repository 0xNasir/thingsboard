import {NgModule} from '@angular/core';
import {
  provideRouter,
  RouterModule, Routes,
  withViewTransitions
} from '@angular/router';
import {AuthLayoutComponent} from "./shared/layout/auth-layout/auth-layout.component";
import {BaseLayoutComponent} from "./shared/layout/base-layout/base-layout.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {AutheticateResolveService} from "./core/services/autheticate-resolve.service";


const routes: Routes = [{
  path: 'login',
  resolve: {isAuthenticate: AutheticateResolveService},
  component: AuthLayoutComponent,
  loadChildren: () => import('./pages/auth/login/login.module').then(m => m.LoginModule),
  data: {title: 'Login'}
}, {
  path: 'home',
  component: BaseLayoutComponent,
  canActivate: [AuthGuard],
  loadChildren: () => import('./pages/module/home/home.module').then(m => m.HomeModule),
  data: {title: 'Home'}

}, {
  path: 'dashboard',
  canActivate: [AuthGuard],
  component: BaseLayoutComponent,
  loadChildren: () => import('./pages/module/dashboard/dashboard.module').then(m => m.DashboardModule),
  data: {title: 'Dashboard'}
}, {
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'account',
  canActivate: [AuthGuard],
  component: BaseLayoutComponent,
  loadChildren: () => import('./pages/auth/account/account.module').then(m => m.AccountModule),
  data: {title: 'Account'}
},
  {
    path: 'alarm',
    canActivate: [AuthGuard],
    component: BaseLayoutComponent,
    loadChildren: () => import('./pages/module/alarm/alarm.module').then(m => m.AlarmModule),
    data: {title: 'Alarm'}
  },
  {
    path: 'energy-meter',
    canActivate: [AuthGuard],
    component: BaseLayoutComponent,
    loadChildren: () => import('./pages/module/energy-meter/energy-meter.module').then(m => m.EnergyMeterModule),
    data: {title: 'Energy Meter'}
  },
  {
    path: 'report',
    canActivate: [AuthGuard],
    component: BaseLayoutComponent,
    loadChildren: () => import('./pages/module/report/report.module').then(m => m.ReportModule),
    data: {title: 'Report'}
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: BaseLayoutComponent,
    loadChildren: () => import('./pages/module/settings/settings.module').then(m => m.SettingsModule),
    data: {title: 'Settings'}
  }, {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [
    provideRouter(routes, withViewTransitions())
  ]
})
export class AppRoutingModule {
}
