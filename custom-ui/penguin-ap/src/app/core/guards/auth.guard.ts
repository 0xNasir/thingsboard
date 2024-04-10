import {CanActivateFn, Router} from '@angular/router';
import {jwtDecode} from "jwt-decode";
import {User} from "../models/user";
import {inject, Injectable} from "@angular/core";
import {LocalstorageService} from "../services/localstorage.service";

export const AuthGuard: CanActivateFn = (route, state) => {
  let router:Router=inject(Router);
  let storage:LocalstorageService=inject(LocalstorageService)
  if (storage.getDataByKey('access') != null) {
    let token = String(storage.getDataByKey('access'));
    try {
      let user: User = jwtDecode(token);
      if (user.exp > new Date().getTime() / 1000) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    }catch (e) {
      storage.removeDataByKey('access');
      return router.createUrlTree(['/login']);
    }
  } else {
    return router.createUrlTree(['/login']);
  }
}
