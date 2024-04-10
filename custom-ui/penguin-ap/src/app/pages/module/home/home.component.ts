import {Component, HostListener, OnInit} from '@angular/core';
import {PgRestService} from "../../../core/services/pg.rest.service";
import {DeviceService} from "../../../core/services/device.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  deviceHeight: number = 0;
  temperature: number = 0;
  deviceList:any={};
  moldDashboardData:any={};
  constructor(private pgRestService: PgRestService,
              private deviceService: DeviceService,
              private router: Router) {
    this.getDeviceHeight();
  }

  @HostListener('window:resize', ['$event'])
  getDeviceHeight() {
    this.deviceHeight = window.innerHeight - 75;
  }

  ngOnInit(): void {
    setInterval(() => {
      this.temperature = Number((Math.random() * 80).toFixed(2));
    }, 2000);
    this.deviceService.getDevicesByDeviceProfile(0, 1000, '95cc3bc0-d3e7-11ee-b0d8-756d52ed05f2').subscribe({
      next: (result) => {
        if (result.data.length > 0) {
          result.data.forEach((device: any) => {
            if (device.label!='Gateway') {
              this.deviceList[device.name]={
                label: device.label,
                id: device.id,
                active: device.active
              }
            }
          });
        }
        this.pgRestService.getCustomData('get_mold_dashboard_data', {"ts_time": new Date().getTime(), "json_data": {"keys": ["CycleTime","InjPrs1","Nozzle1Temperature","MeltCushion","CoolTimAct","pds_para_datetime"]} }).subscribe({
          next:(moldDashboardData)=> {
            this.moldDashboardData=moldDashboardData;
          }
        });
      }
    });
  }

  gotoDashboard(device: any) {
    $('.cpopup').remove();
    this.router.navigateByUrl(`/dashboard/${device.id.id}`);
  }

  onMouseEnter(device: any, event:any) {
    let tAggr=this.moldDashboardData[1].t_aggr.filter((aggrVal:any)=>aggrVal.entity_id==device.id.id);
    let lAggr=this.moldDashboardData[0].t_latest.filter((latestVal:any)=>latestVal.entity_id==device.id.id);
    let cycleTime=lAggr.filter((l:any)=>l.key=='CycleTime');
    let nozzleTemp=lAggr.filter((l:any)=>l.key=='Nozzle1Temperature');
    let goodPart=tAggr.filter((l:any)=>l.key=='delta_GoodPartAct');
    let goodShot=tAggr.filter((l:any)=>l.key=='delta_GoodShotAct');
    $('body').append(`
<div class="cpopup" style="padding:10px; width: 300px; background-color: #939393;position: absolute;box-shadow:1px 1px 6px black; top:${event.pageY}px; left:${event.pageX}px;z-index: 9999;">
<table style="border-collapse: collapse; color:white;">
<tr><th>Name</th><td>: ${device.label}</td></tr>
<tr><th>Active status</th><td>: ${device.active ? 'Active' : 'Inactive'}</td></tr>
<tr><th>Cycle time</th><td>: ${cycleTime.length ? (cycleTime[0].dbl_v || 0).toFixed(2) : 0}</td></tr>
<tr><th>Nozzle1 Temperature</th><td>: ${nozzleTemp.length ? (nozzleTemp[0]?.dbl_v || 0).toFixed(2) : 0}</td></tr>
<tr><th>Good part</th><td>: ${goodPart.length ? (goodPart[0]?.sumval || 0).toFixed(0) : 0}</td></tr>
<tr><th>Good shot</th><td>: ${goodShot.length ? (goodShot[0]?.sumval || 0).toFixed(0) : 0}</td></tr>
</table>
</div>`)
  }

  onMouseLeave(device: any) {
    $('.cpopup').remove();
  }
}
