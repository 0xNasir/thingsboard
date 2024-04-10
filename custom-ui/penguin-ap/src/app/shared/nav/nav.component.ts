import {Component, Inject, inject, signal} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {Router} from "@angular/router";
import {MatSidenav} from "@angular/material/sidenav";
import {DOCUMENT} from "@angular/common";
import {NavItem} from "../../core/models/nav-item";
import {MenuService} from "../../core/services/menu.service";
import {LoadingService} from "../../core/services/loading.service";
import {jwtDecode} from "jwt-decode";
import {LocalstorageService} from "../../core/services/localstorage.service";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {
  public loading$:Observable<any> = this.loader.loading$;
  private static readonly DARK_THEME_CLASS = 'sn-dark';
  private static readonly LIGHT_THEME_CLASS = 'sn-default';
  private static readonly THEME_LIGHT = 'light';
  private static readonly THEME_DARK = 'dark';
  public theme: string;
  public userData:any={};
  private breakpointObserver = inject(BreakpointObserver);
  opened = true;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  iconOnly = signal(this.menuService.getIconOnlyStatus());
  public navList:NavItem[]=this.menuService.getMenu();
  constructor(private router: Router,
              public loader: LoadingService,
              private menuService: MenuService,
              private storage: LocalstorageService,
              @Inject(DOCUMENT) private document: Document) {
    if (localStorage.getItem('snTheme')) {
      this.theme = localStorage.getItem('snTheme') || NavComponent.THEME_LIGHT;
      if (this.theme == 'light') {
        this.document.documentElement.classList.remove(NavComponent.DARK_THEME_CLASS);
        this.document.documentElement.classList.add(NavComponent.LIGHT_THEME_CLASS);
      } else {
        this.document.documentElement.classList.remove(NavComponent.LIGHT_THEME_CLASS);
        this.document.documentElement.classList.add(NavComponent.DARK_THEME_CLASS);
      }
    } else {
      localStorage.setItem('snTheme', NavComponent.THEME_LIGHT)
      this.theme = this.document.documentElement.classList.contains(NavComponent.DARK_THEME_CLASS) ? NavComponent.THEME_DARK : NavComponent.THEME_LIGHT;
    }
    let token: string = this.storage.getDataByKey('access');
    try {
      this.userData = jwtDecode(token);
    }catch (e){

    }
  }

  async doLogout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    await this.router.navigateByUrl('/login');
  }

  async toggleMat(drawer: MatSidenav) {
    this.opened = !this.opened;
    await drawer.toggle();
  }

  async gotoAccount() {
    await this.router.navigateByUrl('/account');
  }

  toggleTheme() {
    if (this.theme == NavComponent.THEME_LIGHT) {
      this.document.documentElement.classList.add(NavComponent.DARK_THEME_CLASS);
      this.document.documentElement.classList.remove(NavComponent.LIGHT_THEME_CLASS);
      this.theme = NavComponent.THEME_DARK;
      localStorage.setItem('snTheme', 'dark')
    } else {
      this.document.documentElement.classList.add(NavComponent.LIGHT_THEME_CLASS);
      this.document.documentElement.classList.remove(NavComponent.DARK_THEME_CLASS);
      this.theme = NavComponent.THEME_LIGHT;
      localStorage.setItem('snTheme', 'light');
    }
    location.reload();
  }

  setIconOnly() {
    this.iconOnly.set(!this.iconOnly());
    this.menuService.setIconOnlyStatus();
  }
}
