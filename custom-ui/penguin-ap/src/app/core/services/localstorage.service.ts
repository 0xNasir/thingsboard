import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() {
  }

  setData(key: string, data: any): void {
    localStorage.setItem(key, data);
  }

  getDataByKey(key: string): any {
    return localStorage.getItem(key);
  }

  removeDataByKey(key: string): void {
    return localStorage.removeItem(key);
  }
}
