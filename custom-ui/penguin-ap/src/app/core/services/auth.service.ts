import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Login} from "../models/login";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient) {
  }

  postLogin(data: Login): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/api/auth/login', data);
  }

  retrieveAccessTokenFromRefreshToken(): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/api/auth/token', {"refreshToken": localStorage.getItem('refresh')});
  }

  getAuthUser(userId: string): Observable<any> {
    return this.httpClient.get(environment.apiUrl + '/api/user/' + userId);
  }

  postUserData(userData: any): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/api/user?sendActivationMail=false', userData);
  }
}
