import {Injectable} from '@angular/core';
import {NavItem} from "../models/nav-item";

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  iconOnly = false;
  navList: NavItem[] = [{
    icon: 'home',
    title: 'Home',
    link: '/home'
  }, {
    icon: 'dashboard',
    title: 'Dashboard',
    link: '/dashboard'
  }, {
    icon: 'report',
    title: 'Report',
    link: '/report'
  }, {
    icon: 'alarm',
    title: 'Alarm',
    link: '/alarm'
  }, {
    icon: 'power',
    title: 'Energy meter',
    link: '/energy-meter'
  }, {
    icon: 'settings',
    title: 'Settings',
    link: '/settings'
  }]

  constructor() {
  }

  getMenu(): NavItem[] {
    return this.navList;
  }

  getIconOnlyStatus(): Boolean {
    return this.iconOnly;
  }

  setIconOnlyStatus() {
    this.iconOnly = !this.iconOnly;
  }
}
