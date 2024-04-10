import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, switchMap} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  constructor(private httpClient: HttpClient) { }
  getDevices(index: number, pageSize: number):Observable<any>{
    return this.httpClient.get(environment.apiUrl+`/api/tenant/deviceInfos?pageSize=${pageSize}&page=${index}&sortProperty=createdTime&sortOrder=DESC`);
  }
  getDevicesByDeviceProfile(index: number, pageSize: number, profileId: string):Observable<any>{
    return this.httpClient.get(environment.apiUrl+`/api/tenant/deviceInfos?pageSize=${pageSize}&page=${index}&sortProperty=createdTime&sortOrder=DESC&deviceProfileId=${profileId}`);
  }
  getDeviceByDeviceId(deviceId: string):Observable<any>{
    return this.httpClient.get(environment.apiUrl+`/api/device/info/${deviceId}`);
  }
  getTelemetryData(deviceId: string,keys:string, startTs:number, endTs:number, interval:number, agg:string):Observable<any>{
    return this.httpClient.get(environment.apiUrl+`/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${keys}&startTs=${startTs}&endTs=${endTs}&interval=${interval}&agg=${agg}`);
  }
  getAttributeData(deviceId: string):Observable<any>{
    return this.httpClient.get(environment.apiUrl+`/api/plugins/telemetry/DEVICE/${deviceId}/values/attributes/SERVER_SCOPE`);
  }
  saveAttributeData(deviceId: string='5e3903f0-d1fd-11ee-b0d8-756d52ed05f2', value: any):Observable<any>{
    return this.httpClient.post(environment.apiUrl+`/api/plugins/telemetry/DEVICE/${deviceId}/SERVER_SCOPE`, value);
  }
  saveTelemetryData(deviceId: string='e391b880-db62-11ee-b0d8-756d52ed05f2', value: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/api/plugins/telemetry/DEVICE/${deviceId}/timeseries/ANY?scope=ANY`, value);
  }

}
