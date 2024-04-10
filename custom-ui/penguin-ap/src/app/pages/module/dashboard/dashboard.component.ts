import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {DeviceService} from "../../../core/services/device.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Router} from "@angular/router";
import {color} from "chart.js/helpers";
import {
  DashboardCardData,
  DashboardCardDatas,
  KeyValue,
  KeyValueStatus, LeftParamKeyValue,
  ParamData
} from "../../../core/models/dashboard-card-data";
import {PgRestService} from "../../../core/services/pg.rest.service";
import moment from "moment/moment";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, AfterViewInit {
  showSpin=true;
  deviceHeight: number = 0;
  defaultPageSize = 20;
  deviceData: any[] = [];
  totalElements = 0;
  pageSizeOptions = [this.defaultPageSize, this.defaultPageSize * 2, this.defaultPageSize * 3, this.defaultPageSize * 4]
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dashboardCardDatas: DashboardCardDatas[] = [];
  dashboardCardData: DashboardCardData;
  // headerParams = [{ key: '', value: '', status: '' }];
  // leftParams = [{ key: '', value: '' }];
  // rightParams = [{ key: '', value: '' }];
  // params = [{ name: '' }];
  // machineLastUpdateAt = '';
  // macMode = { name: 'Auto', value: 4 };

  leftParamKeys: any[];
  aggrParamKeys: any[];
  leftSumParamKeys: String[];
  rightParamKeys: String[];
  headerParamKeys: any[];
  paramKeys: any[];
  lastUpdatedAtKeys: String[];

  constructor(private deviceService: DeviceService,
              private pgRestService: PgRestService,
              private router: Router) {
    this.getDeviceHeight();

    this.dashboardCardData = {
      deviceData: {},
      headerParams: [],
      params: [],
      leftParams: [],
      rightParams: [],
      machineLastUpdateAt: { key: '', value: '' },
      macMode: { key: '', value: '' }
    }

    this.leftParamKeys = [];
    this.aggrParamKeys = [];
    this.leftSumParamKeys = [];
    this.rightParamKeys = [];
    this.headerParamKeys = [];
    this.paramKeys = [];
    this.lastUpdatedAtKeys = [];

  }

  @HostListener('window:resize', ['$event'])
  getDeviceHeight() {
    this.deviceHeight = window.innerHeight - 75;
  }
  ngOnInit(): void {
    this.fetchData();

    // this.dashboardCardData.headerParams = [{key: 'MCT Status', value: 'circle', status: '#820000'}, {key: 'Heater Status', value: 'circle', status: 'green'}, {key: 'Material Name', value: 'ABS', status: ''}]
    // this.dashboardCardData.params = [{key: 'Cycle Time', minval: 1, maxval: 9, avgval: 2, live: 2, entity_id: '1'}, {key: 'Injection Pressure', minval: 3, maxval: 10, avgval: 3, live: 2, entity_id: '1'}, {key: 'Nozzle Temp', minval: 4, maxval: 13, avgval: 3, live: 2, entity_id: '1'}, {key: 'Melt cushion', minval: 1, maxval: 14, avgval: 3, live: 2, entity_id: '1'}, {key: 'Cooling Temp', minval: 5, maxval: 10, avgval: 3, live: 2, entity_id: '1'}]
    // this.dashboardCardData.leftParams = [{key: 'Cavity', value: '20'}, {key: 'Good Part', value: '20'}, {key: 'Reject Part', value: '20'},{key: 'Shot Weight', value: '20'},{key: 'Energy Unit', value: '22'}]
    // this.dashboardCardData.rightParams   = [{key: 'Availability', value: '85%'}, {key: 'Performance', value: '90%'}, {key: 'Quality', value: '87%'},{key: 'OEE', value: '70%'}]
    // this.dashboardCardData.machineLastUpdateAt = [];

    this.dashboardCardData.macMode = { key: 'Auto', value: '' };

    this.headerParamKeys = [
      { sl: 0, key: 'PmpSts', title: "Pump Status"},
      { sl: 1, key: 'HtrSts', title: "Heater Status"},
      { sl: 2, key: 'MaterialName', title: "Material Name"}];

    this.leftParamKeys = [
      { sl: 4, key: 'CavityCnt', title: "Cavity Count"},
      { sl: 5, key: 'ShotWeight', title: "Shot Weight"}];

    this.aggrParamKeys = [
      { sl: 0, key: 'delta_GoodPartAct', title: 'Good Part'},
      { sl: 1, key: 'delta_RejectAct', title: 'Reject Part'},
      { sl: 2, key: 'delta_TotalShotAct', title: 'Total Shot'},
      { sl: 2, key: 'delta_GoodShotAct', title: 'Good Shot'},
      { sl: 3, key: 'delta_EnergyVal', title: 'Energy (kWh)'}];

    this.paramKeys = [
      { sl: 0, key: 'CycleTime', title: 'Cycle Time'},
      { sl: 1, key: 'InjPrs1', title: 'Injection Pressure'},
      { sl: 2, key: 'Nozzle1Temperature', title: 'Nozzle1 Temp'},
      { sl: 3, key: 'MeltCushion', title: 'Melt Cushion'},
      { sl: 4, key: 'CoolTimAct', title: 'Colling Time'}];

    this.rightParamKeys = ['delta_GoodPartAct'];
    this.lastUpdatedAtKeys = ['Alarm_datetime', 'mac_para_datetime', 'molding_para_datetime', 'pds_para_datetime'];

  }


  ngAfterViewInit() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.fetchData(page.pageIndex, page.pageSize);
    })
  }

  fetchData(index = 0, pageSize = this.defaultPageSize) {

    this.dashboardCardDatas = [];

    this.deviceService.getDevicesByDeviceProfile(index, pageSize, '95cc3bc0-d3e7-11ee-b0d8-756d52ed05f2').subscribe(deviceData => {
      this.dashboardCardDatas = [];
      this.deviceData = deviceData.data;
      this.totalElements = deviceData.totalElements;
      this.deviceData.forEach((dd) => {
        if(dd.label != "Gateway") {
          let dashboardCardData = {
            deviceData: dd,
            headerParams: [],
            params: [],
            leftParams: [],
            rightParams: [],
            machineLastUpdateAt: { key: '', value: '' },
            macMode: { key: '', value: '' }
          }
          this.dashboardCardDatas.push({id: dd.id.id, _data: dashboardCardData});
        }
      })

      let queryBody = {
        startts: 1711324800000,
        endts: 1711497600000,
        key_arr: ['CycleTime', 'InjPrs1', 'Nozzle1Temperature', 'MeltCushion', 'CoolTimAct'],
        key_arr_sum: ['delta_GoodPartAct', 'delta_GoodShotAct', 'delta_RejectAct', 'delta_TotalShotAct']
      }

      let currentTs = new Date().getTime();

      this.pgRestService.getCustomData('get_mold_dashboard_data', {"ts_time": new Date().getTime(), "json_data": {"keys": ["MacMode","ShotWeight","CavityCnt","CycleTime","InjPrs1","Nozzle1Temperature","MeltCushion","CoolTimAct","pds_para_datetime","MaterialName","HtrSts","PmpSts"]} }).subscribe({
        next:(moldDashboardData)=> {

          console.log('moldDashboardData', moldDashboardData);
          console.log('mdd.t_latest', moldDashboardData[0].t_latest);
          console.log('mdd.t_aggr', moldDashboardData[1].t_aggr);

          moldDashboardData[1].t_aggr.forEach((param: any) => {
            let liveD = moldDashboardData[0].t_latest.find((l: any) => {
              return param.entity_id == l.entity_id && param.key == l.key;
            });

            this.dashboardCardDatas.find((dcd: DashboardCardDatas) => {
              return dcd.id == param.entity_id && this.paramKeys.map(item => item.key).includes(param.key)
            })?._data?.params.push({
              sl: this.paramKeys.find(k => k.key == param.key).sl,
              entity_id: param.entity_id,
              key: param.key,
              title: this.paramKeys.find(k => k.key == param.key).title,
              minval: Number(param.minval ? param.minval.toFixed(2) : 0),
              maxval: Number(param.minval ? param.maxval.toFixed(2) : 0),
              avgval: Number(param.minval ? param.avgval.toFixed(2) : 0),
              live: Number(parseFloat(liveD?.dbl_v ?? liveD?.str_v ?? liveD?.long_v).toFixed(2)),
            });

            this.dashboardCardDatas.find((dcd: DashboardCardDatas) => {
              return dcd.id == param.entity_id && this.aggrParamKeys.map(item => item.key).includes(param.key)
            })?._data?.leftParams.push({
              sl: this.aggrParamKeys.find(k => k.key == param.key).sl,
              key: param.key,
              title: this.aggrParamKeys.find(k => k.key == param.key).title,
              value: param.sumval
            });

            // console.log('this.dashboardCardDatas', moldDashboardData[1].t_aggr, this.dashboardCardDatas);

          });

          moldDashboardData[0].t_latest.forEach((param: any) => {
            let dcDatas = this.dashboardCardDatas.find((dcd: DashboardCardDatas) => {
              return dcd.id == param.entity_id && this.headerParamKeys.map(item => item.key).includes(param.key)
            });
            this.dashboardCardDatas.find((dcd: DashboardCardDatas) => {
              return dcd.id == param.entity_id && this.headerParamKeys.map(item => item.key).includes(param.key)
            })?._data?.headerParams.push({
              sl: this.headerParamKeys.find(k => k.key == param.key).sl,
              key: param.key,
              title: this.headerParamKeys.find(k => k.key == param.key).title,
              value: param.key == 'MaterialName' ? String(param.long_v ?? param.dbl_v ?? param.str_v) : 'circle',
              status: param.key != 'MaterialName' ? dcDatas?._data?.deviceData.active && String(param.long_v ?? param.dbl_v ?? param.str_v) == '1' ? '#008200' : '#820000' : null
            });
            if (param.key == "MaterialName") {
              console.log("MaterialName", String(param.long_v ?? param.dbl_v ?? param.str_v))
            }
          });

          this.dashboardCardDatas.forEach(dcd => {

            let updatedData = moldDashboardData[0].t_latest.find((l: any) => {
              return dcd.id == l.entity_id && l.key == "pds_para_datetime";
            });

            console.log("1. pds_para_datetime", updatedData);

            if(dcd._data?.machineLastUpdateAt) {
              console.log("2. pds_para_datetime",updatedData?.long_v);
              dcd._data!.machineLastUpdateAt.value = dcd?._data?.deviceData.active ? this.displayInLocalTimezone(updatedData?.long_v) : this.millisecondsToHumanReadable(new Date().getTime() - this.convertISTToUTC(String(updatedData?.long_v)).valueOf());
              // moment(String(updatedData?.long_v), 'YYYYMMddHHmmss').format('YYYY MMM DD hh:mm:ss a');
            }

            moldDashboardData[0].t_latest.forEach((l: any) => {
              if(dcd.id == l.entity_id && l.key == 'MacMode') {
                let lVal = l.long_v ?? l.dbl_v ?? l.str_v;
                dcd._data!.macMode.value = lVal == 1 ? 'Manual' : lVal == 2 ? 'Semi-Auto' : lVal == 3 ? 'Auto' : 'Auto'
              }
            });

            moldDashboardData[0].t_latest.forEach((l: any) => {
              if(dcd.id == l.entity_id && this.leftParamKeys.map(item => item.key).includes(l.key)) {
                dcd._data?.leftParams.push({sl: this.leftParamKeys.find(k => k.key == l.key).sl, title: this.leftParamKeys.find(k => k.key == l.key).title, key: l.key, value: l.long_v ?? l.dbl_v ?? l.str_v });
              }
            });

            //
            // let left_p_data = moldDashboardData[0].t_latest.find((l: any) => {
            //   return dcd.id == l.entity_id && l.key == "CavityCnt";
            // });
            //
            // if(left_p_data) {
            //   dcd._data!.leftParams.push(left_p_data);
            // }

            let goodPart = moldDashboardData[1].t_aggr.find((r: any) => {
              return r.entity_id == dcd.id && r.key == 'delta_GoodPartAct';
            });

            let rejectPart = moldDashboardData[1].t_aggr.find((r: any) => {
              return r.entity_id == dcd.id && r.key == 'delta_RejectAct';
            });

            let gp = goodPart ? goodPart.sumval : 0;
            let rp = rejectPart ? rejectPart.sumval : 0;

            console.log('goodPart rejectPart: ', moldDashboardData[1].t_aggr, goodPart, rejectPart);

            let right_p: KeyValue[] = [
              {
                key: 'Availability',
                value: '-'
              },
              {
                key: 'Performance',
                value: '-'
              },
              {
                key: 'Quality',
                value: rp == 0 ? (gp == 0 && rp == 0 ? 'N/A' : '100%') : (100*(gp/(gp+rp))).toFixed(2) + '%'
              },
              {
                key: 'OEE',
                value: rp == 0 ? (gp == 0 && rp == 0 ? 'N/A' : '100%') : (100*(gp/(gp+rp))).toFixed(2) + '%'
              }
            ]
            this.dashboardCardDatas.find((dcd1: DashboardCardDatas) => {
              return dcd.id == dcd1.id
            })?._data?.rightParams.push(...right_p);

            // Sort Data to show in order
            dcd._data?.headerParams.sort((a: KeyValueStatus, b: KeyValueStatus) => a.sl - b.sl);
            dcd._data?.leftParams.sort((a: LeftParamKeyValue, b: LeftParamKeyValue) => a.sl - b.sl);
            dcd._data?.params.sort((a: ParamData, b: ParamData) => a.sl - b.sl);



          });

          console.log("this.dashboardCardDatas: ", this.dashboardCardDatas);

          this.showSpin=false;
        },
        error: error => {
          this.showSpin=false;
        }
      });
    }, error => {
      this.showSpin=false;
    });
  }

  convertISTToUTC(datetimeStr: string): moment.Moment {
    // Parse the datetime string
    datetimeStr = String(datetimeStr);

    const year = datetimeStr.substring(0, 4);
    const month = datetimeStr.substring(4, 6);
    const day = datetimeStr.substring(6, 8);
    const hour = datetimeStr.substring(8, 10);
    const minute = datetimeStr.substring(10, 12);
    const second = datetimeStr.substring(12);

    // Create a moment object in IST by adding the IST offset (UTC+5:30)
    // Note: Moment.js months are 0-based
    let utcMoment = moment.utc({
      year: parseInt(year, 10),
      month: parseInt(month, 10) - 1, // Adjust for 0-based indexing
      day: parseInt(day, 10),
      hour: parseInt(hour, 10),
      minute: parseInt(minute, 10),
      second: parseInt(second, 10),
    });

    // Manually adjust for IST to UTC conversion (-5 hours and -30 minutes)
    utcMoment = utcMoment.subtract(5, 'hours').subtract(30, 'minutes');

    return utcMoment;
  }

  displayInLocalTimezone(datetimeStr: string): string {
    const utcMoment = this.convertISTToUTC(datetimeStr);
    // Format the moment object for display
    // This will automatically use the browser's/local machine's timezone
    return utcMoment.local().format('YYYY-MM-DD hh:mm:ssa');
  }

  gotoDevice(device: any) {
    this.router.navigateByUrl('/dashboard/' + device.id.id);
  }

  millisecondsToHumanReadable(ms: number) {
    const seconds = Math.round(ms / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    const timeUnits = [
      { label: "day", value: days },
      { label: "hour", value: hours % 24 },
      { label: "minute", value: minutes % 60 },
      { label: "second", value: seconds % 60 },
    ];

    const filteredUnits = timeUnits.filter((unit) => unit.value > 0);

    if (filteredUnits.length === 0) {
      return "Just now";
    }

    const labels = filteredUnits.map((unit) => {
      return `${unit.value} ${unit.label}${unit.value > 1 ? "s" : ""}`;
    });

    return labels.join(", ") + " ago";
  }

  protected readonly color = color;
}
