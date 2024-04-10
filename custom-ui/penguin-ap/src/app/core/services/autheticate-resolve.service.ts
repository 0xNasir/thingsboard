import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from "@angular/router";
import {User} from "../models/user";
import {LocalstorageService} from "./localstorage.service";
import {Token} from "../models/login";
import {AuthService} from "./auth.service";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AutheticateResolveService implements Resolve<any> {

  constructor(private storage: LocalstorageService,
              private authService: AuthService,
              private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.storage.getDataByKey('access') != null) {
      let token = String(this.storage.getDataByKey('access'));
      try {
        let user: User = jwtDecode(token);
        if (user.exp > new Date().getTime() / 1000) {
          this.router.navigateByUrl('/home')
          return true
        } else {
          this.retrieveToken();
        }
      } catch (e) {
        return true;
      }
    } else {
      if (this.storage.getDataByKey('refresh') != null) {
        this.retrieveToken();
      }else{
        return true
      }
    }
  }

  retrieveToken() {
    this.authService.retrieveAccessTokenFromRefreshToken().subscribe((response: Token) => {
      this.storage.setData('access', response.token);
      this.storage.setData('refresh', response.refreshToken);
      this.router.navigateByUrl('/home');
      return true;
    }, error => {return true});
  }
}
