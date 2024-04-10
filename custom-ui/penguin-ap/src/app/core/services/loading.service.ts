import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private _loading = new BehaviorSubject<boolean>(false);
  public readonly loading$ = this._loading.asObservable();

  private _privLevel = new BehaviorSubject<boolean>(false);
  public readonly privLevel$ = this._privLevel.asObservable();

  constructor() {
    if (localStorage.getItem('access')){
      let loginInfo:any = jwtDecode(String(localStorage.getItem('access')))
      this._privLevel.next(loginInfo['priv_level']);
    }
  }

  show() {
    this._loading.next(true);
  }

  hide() {
    this._loading.next(false);
  }

  setPrivLevel(level:any) {
    this._privLevel.next(level);
  }
}
