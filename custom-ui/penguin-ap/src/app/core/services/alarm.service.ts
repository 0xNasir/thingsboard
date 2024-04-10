import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AlarmService {

  constructor(private httpClient: HttpClient) {
  }

  getDeviceAlarms(deviceId: string, deviceType: string, index: number, pageSize: number): Observable<any> {
    return this.httpClient.get(environment.apiUrl + `/api/alarm/${deviceType}/${deviceId}?pageSize=${pageSize}&page=${index}&sortProperty=createdTime&sortOrder=DESC&statusList=ACTIVE`)
  }

  getAlarmInRangeCount(startTs: number, endTs: number) {
    return this.httpClient.get(environment.apiUrl+`/ap/api/pg/rpc/alarm_counter?a_severity=&a_start_ts=${startTs}&a_end_ts=${endTs}`, {headers:{api_token:'wirdaw-napjy9-vyzwiP'}});
  }

  getAlarmsForSelectedDate(startTs: number, endTs: number, pageSize:number=20, page=0):Observable<any> {
    return this.httpClient.get(environment.apiUrl+`/api/v2/alarms?pageSize=${pageSize}&page=${page}&startTime=${startTs}&endTime=${endTs}`);
  }
}
