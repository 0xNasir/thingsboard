import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {environment} from "../../../../../environments/environment";
import {LocalstorageService} from "../../../../core/services/localstorage.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RealTimeData, SNDataType} from "../../../../core/models/real-time-data";
import {Chart, ChartData} from "chart.js/auto";
import moment from "moment";
import {LoadingService} from "../../../../core/services/loading.service";
import {DeviceService} from "../../../../core/services/device.service";
import {ScriptService} from "../../../../core/services/script.service";
import {AlarmService} from "../../../../core/services/alarm.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {Title} from "@angular/platform-browser";
import {MatDialog} from "@angular/material/dialog";
import {RejectionInputData} from "../../../../core/models/user-input-data";
import {DialogUserInputComponent} from "./dialog/dialog-user-input.component";
import { EChartsOption } from 'echarts';
import {PgRestService} from "../../../../core/services/pg.rest.service";

@Component({
  selector: 'app-dashboard-link',
  templateUrl: './dashboard-link.component.html',
  styleUrl: './dashboard-link.component.scss'
})
export class DashboardLinkComponent implements OnInit, OnDestroy, AfterViewInit {




  chart: any = {};
  fill: string = this.storage.getDataByKey('snTheme') == 'dark' ? '#FFFFFF' : '#000000';
  socket: WebSocket = new WebSocket('wss://' + environment.host + ':' + environment.port + '/api/ws');
  realtimeData: RealTimeData[] = [
    {title: 'Cycle Time', key: 'CycleTime', type: SNDataType.OBJECT, data: 0},
    {title: 'Oil Temperature', key: 'OilTmp', type: SNDataType.OBJECT, data: 0},
    {title: 'Zone3Temp', key: 'Zone3Temperature', type: SNDataType.OBJECT, data: 0},
    {title: 'Zone2Temp', key: 'Zone2Temperature', type: SNDataType.OBJECT, data: 0},
    {title: 'Melt Cushion', key: 'MeltCushion', type: SNDataType.OBJECT, data: 0},
    {title: 'Injection Time', key: 'InjectionTime', type: SNDataType.OBJECT, data: 0},
    {title: 'Nozzle2 Temp', key: 'Nozzle2Temperature', type: SNDataType.OBJECT, data: 0},
    {title: 'Nozzle1 Temp', key: 'Nozzle1Temperature', type: SNDataType.OBJECT, data: 0},
    {title: 'Pressure', key: 'PeakInjectionPressure', type: SNDataType.OBJECT, data: 0},
    {title: 'Feed Temperature', key: 'FeedTemperature', type: SNDataType.OBJECT, data: 0},
    {title: 'Zone1 Temp', key: 'Zone1Temperature', type: SNDataType.OBJECT, data: 0},
  ];
  leftSideRealtimeData: RealTimeData[] = [
    {title: 'MAC ID', key: 'MacID', type: SNDataType.OBJECT, data: ''},
    {title: 'MAC No', key: 'MacNo', type: SNDataType.OBJECT, data: ''},
    {title: 'MAC Cf', key: 'MacCf', type: SNDataType.OBJECT, data: ''},
    {title: 'Mold ID', key: 'MoldId', type: SNDataType.OBJECT, data: ''},
    {title: 'Part No', key: 'PartNo', type: SNDataType.OBJECT, data: ''},
    {title: 'Material Name', key: 'MaterialName', type: SNDataType.OBJECT, data: ''},
    {title: 'Heater Status', key: 'HtrSts', type: SNDataType.OBJECT, data: ''},
  ];

  public rejectionInputData: RejectionInputData[] = [];

  public deviceInfo: any;
  public alarms: any;
  public gauges: any;


  alarmColumnDef: any = [{'key': 'createdTime', 'title': 'Created Time'}, {key: 'duration', title: 'Duration'}, {key: 'type', title: 'Type'}, {
    key: 'severity',
    title: 'Severity'
  }, {key: 'status', title: 'Status'}];
  alarmColumns: string[] = ['createdTime', 'duration', 'type', 'severity', 'status'];
  id: string = '';
  defaultPageSize = 20;
  totalElements = 0;
  pageSizeOptions = [this.defaultPageSize, this.defaultPageSize * 2, this.defaultPageSize * 3, this.defaultPageSize * 4]
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private storage: LocalstorageService,
              private router: Router,
              private loadingService: LoadingService,
              private pgRestService: PgRestService,
              private deviceService: DeviceService,
              private scriptService: ScriptService,
              private alarmService: AlarmService,
              private titleService: Title,
              public dialog: MatDialog,
              private activeRoute: ActivatedRoute) {
    Chart.defaults.color = storage.getDataByKey('snTheme') == 'dark' ? '#FFFFFF' : '#000000';

  }


  showPopup = false;

  liveValue = 21;
  averageValue = 22;
  minValue = 20;
  maxValue = 25;

  getGaugeData(title: String, avg: number, live: number): any {
    return [
    {
      value: live,
      name: title,
      title: {
        offsetCenter: ['0%', '95%'],
        color: "#5470c6"
      },
      detail: {
        offsetCenter: ['0%', '70%']
      }
    },
    {
      value: avg,
      name: 'AVG',
      title: {
        offsetCenter: ['0%', '40%'],
        color: "#92cc74"
      },
      detail: {
        offsetCenter: ['0%', '20%']
      }
    }
  ]};


  getChartOptions(title: string, min: number, max: number, avg: number, live: number): EChartsOption {
    return {
      series: [
        {
          type: 'gauge',
          min: min,
          max: max,
          anchor: {
            show: true,
            showAbove: true,
            size: 18,
            itemStyle: {
              color: '#FAC858'
            }
          },
          // axisLabel: {
          //   color: 'red'
          // },
          pointer: {
            icon:
              'path://M2.9,0.7L2.9,0.7c1.4,0,2.6,1.2,2.6,2.6v115c0,1.4-1.2,2.6-2.6,2.6l0,0c-1.4,0-2.6-1.2-2.6-2.6V3.3C0.3,1.9,1.4,0.7,2.9,0.7z',
            width: 8,
            length: '80%',
            offsetCenter: [0, '8%']
          },
          progress: {
            show: true,
            overlap: true,
            roundCap: true
          },
          axisLine: {
            roundCap: true
          },
          data: this.getGaugeData(title, avg, live),
          title: {
            fontSize: 14
          },
          detail: {
            width: 40,
            height: 14,
            fontSize: 14,
            color: '#fff',
            backgroundColor: 'inherit',
            borderRadius: 3,
            formatter: '{value}s'
          }
        }
      ]
    };
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.activeRoute.paramMap.subscribe(param => {
      this.id = param.get('id') || '';
      if (this.id != '') {
        this.deviceService.getDeviceByDeviceId(this.id).subscribe(device => {
          this.deviceInfo = device;
          this.titleService.setTitle('PenguinAP - Molding Machine: ' + this.deviceInfo?.label || this.deviceInfo?.name);
        });
        let startHTs = new Date(moment().format('YYYY-MM-DD HH:00:00'));
        startHTs.setHours(startHTs.getHours() - 24);
        this.deviceService.getTelemetryData(this.id, 'delta_GoodPartAct,delta_RejectAct', startHTs.getTime(), new Date().getTime(), 3600 * 1000, 'SUM').subscribe(telemetry => {
          if (Object.keys(telemetry).length >= 1) {
            console.log('telemetry: ', telemetry)
            telemetry.delta_RejectAct = telemetry.delta_RejectAct ?? [];
            telemetry.delta_GoodPartAct = telemetry.delta_GoodPartAct ?? [];
            let ls24hTxt = moment(startHTs).format('YYYY-MM-DD HH:00:00');
            let chartData: ChartData = this.scriptService.generateChartData(telemetry,
              ['Good Part', 'Reject Part'], ['#0e84d3', '#bc566b'], '24HOURS', new Date(ls24hTxt), new Date(), 'bar');
            // let chartData: ChartData = this.scriptService.generateChartData(telemetry, ['Production', 'Reject'], ['#0e84d3', '#bc566b'], 'DAILY', startDTs, new Date());
            this.comChart('productionDefect24Hours', chartData, 'bar');
          }
        });
        let startDTs = new Date(moment().format('YYYY-MM-DD 00:00:00'));
        startDTs.setDate(startDTs.getDate() - 29);
        this.deviceService.getTelemetryData(this.id, 'delta_GoodPartAct,delta_RejectAct', startDTs.getTime(), new Date().getTime(), 3600 * 24 * 1000, 'SUM').subscribe(telemetry => {
          let chartData: ChartData = this.scriptService.generateChartData(telemetry, ['Production', 'Reject'], ['#0e84d3', '#bc566b'], 'DAILY', startDTs, new Date());
          this.comChart('productionDefect30Days', chartData);
        });
        let startMTs = new Date(moment().format('YYYY-MM-DD 00:00:00'));
        startMTs.setMonth(startMTs.getMonth() - 12);
        this.deviceService.getTelemetryData(this.id, 'delta_GoodPartAct,delta_RejectAct', startMTs.getTime(), new Date().getTime(), 3600 * 24 * 1000, 'SUM').subscribe(telemetry => {
          let chartData: ChartData = this.scriptService.generateChartData(telemetry, ['Production', 'Reject'], ['#0e84d3', '#bc566b'], 'MONTHLY', startMTs, new Date());
          this.comChart('productionDefect12Month', chartData);
        });
        let ls24h = new Date(moment().format('YYYY-MM-DD HH:00:00'));
        ls24h.setHours(ls24h.getHours() - 24);
        this.deviceService.getTelemetryData(this.id, 'CycleTime,HldTim1,HldTim2,HldTim3,HldTim4,CoolTimAct,MoldCloseTime,MoldOpenTime,EjectorForwardTime,EjectorBackTime,InjectionTime,OilTmp,Zone1Temperature,Zone2Temperature,Zone3Temperature,FeedTemperature,Nozzle1Temperature,Nozzle2Temperature', ls24h.getTime(), new Date().getTime(), 3600 * 1000, 'AVG').subscribe(telemetry => {
          if (Object.keys(telemetry).length > 1) {
            let ls24hTxt = moment(ls24h).format('YYYY-MM-DD HH:00:00');
            let chartData: ChartData = this.scriptService.generateChartData({
                CycleTime: telemetry['CycleTime'],
                HldTim1: telemetry['HldTim1'],
                CoolTimAct: telemetry['CoolTimAct'],
                MoldCloseTime: telemetry['MoldCloseTime'],
                MoldOpenTime: telemetry['MoldOpenTime'],
                EjectorForwardTime: telemetry['EjectorForwardTime'],
                EjectorBackTime: telemetry['EjectorBackTime'],
                InjectionTime: telemetry['InjectionTime']
              },
              ['Cycle Time', 'HldTim1', 'Cooling Time', 'Mold Close Time', 'Mold Open Time', 'Ejector Forward Time', 'Ejector Back Time', 'Injection Time'], ['#0e84d3', '#bc566b', 'magenta', '#56bf00', '#00675d', '#40675d', '#60675d', '#80675d',], '24HOURS', new Date(ls24hTxt), new Date(), 'line');
            this.comChart('cycleTimeLineChart', chartData, 'line');
            let chartData2: ChartData = this.scriptService.generateChartData({
              OilTmp: telemetry['OilTmp'],
              Zone1Temperature: telemetry['Zone1Temperature'],
              Zone2Temperature: telemetry['Zone2Temperature'],
              Zone3Temperature: telemetry['Zone3Temperature'],
              FeedTemperature: telemetry['FeedTemperature']
            }, ['Oil Temp.', 'Zone1 Temp.', 'Zone2 Temp.', 'Zone3 Temp.', 'Feed Temp.'], ['#0e84d3', '#bc566b', 'magenta', '#56bf00', '#00675d'], '24HOURS', new Date(ls24hTxt), new Date(), 'line');
            this.comChart('temperatureLineChart', chartData2, 'line');
          }
        });
        this.fetchData();
      }
      this.socket.onopen = () => {
        let object = {
          authCmd: {
            cmdId: 0,
            token: this.storage.getDataByKey('access')
          },
          cmds: [
            {
              entityType: "DEVICE",
              entityId: this.id,
              scope: "LATEST_TELEMETRY",
              cmdId: 10,
              type: "TIMESERIES"
            }
          ]
        };
        let data = JSON.stringify(object);
        this.socket.send(data);
      }
      this.socket.onmessage = (event) => {
        this.loadingService.hide();
        let jsonData = JSON.parse(event.data);
        Object.keys(jsonData.data).forEach(key => {
          if (jsonData.data[key][0].length > 0) {
            let index = this.realtimeData.findIndex(rdt => rdt.key == key);
            if (index > -1) {
              this.realtimeData[index].data = Number(jsonData.data[key][0][1]).toFixed(2);
            }
            let index2 = this.leftSideRealtimeData.findIndex(rdt => rdt.key == key);
            if (index2 > -1) {
              if (key == 'HtrSts') {
                this.leftSideRealtimeData[index2].data = jsonData.data[key][0][1] == 1 ? 'ON' : 'OFF';
              } else {
                this.leftSideRealtimeData[index2].data = jsonData.data[key][0][1];
              }
            }
          }
        });
      };

      this.socket.onclose = function (event) {
        console.log("Connection is closed!");
      };
    });
  }

  ngAfterViewInit() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.fetchData(page.pageIndex, page.pageSize);
    })
  }

  openDialog(type: string, data: any, index: number): void {
    data.id = this.id;
    const dialogRef = this.dialog.open(DialogUserInputComponent, {
      data: {
        type: type,
        data: data,
        index: index,
        oldData: this.rejectionInputData,
      }, width: '95%'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  fetchData(index = 0, pageSize = this.defaultPageSize) {

    let latestKeys = [
      { sl: 1, label: "Cycle Time", key: "CycleTime" },
      { sl: 2, label: "Cooling Time", key: "CoolTimAct" },
      { sl: 3, label: "Melt Cushion", key: "MeltCushion" },
      { sl: 4, label: "Nozzle1 Temperature", key: "Nozzle1Temperature" },
      { sl: 5, label: "Oil Temperature", key: "OilTemperature" }];

    this.pgRestService.getCustomData('get_mold_dashboard_data', {"ts_time": new Date().getTime(), "json_data": {"keys": latestKeys.map(item => item.key)} }).subscribe({
    next:(moldDashboardData)=> {
      this.gauges = [];
      moldDashboardData[0].t_latest.forEach((tl: any) => {

        if (tl.entity_id == this.id && latestKeys.map(item => item.key).includes(tl.key)) {
          let aggrVal = moldDashboardData[1].t_aggr.find((ml: any) => {
            return ml.entity_id == this.id && tl.key == ml.key;
          });
          this.gauges.push({
            chartOptions: this.getChartOptions(latestKeys.find((k: any)=> k.key == tl.key)?.label ?? '',
              Number(Number(aggrVal.minval).toFixed(2)),
              Number(Number(aggrVal.maxval).toFixed(2)),
              Number(Number(aggrVal.avgval).toFixed(2)),
              Number(Number(tl.dbl_v ?? tl.long_v ?? tl.str_v).toFixed(2))),
            sl: latestKeys.find((k: any)=> k.key == tl.key)?.sl });
        }
      });
      this.gauges.sort((a: any, b: any) => a.sl - b.sl);
    }});



    this.alarmService.getDeviceAlarms(this.id, 'DEVICE', index, pageSize).subscribe(alarm => {
      this.alarms = alarm.data;
      this.alarms.forEach((alm: any) => {
        alm['duration'] = this.msToHs(alm.endTs - alm.startTs);
        alm['status'] = alm.status == 'ACTIVE_UNACK' ? 'Active unacknowledged' : alm.status == 'ACTIVE_ACK' ? 'Active acknowledged' : alm.status == 'CLEARED_UNACK' ? 'Cleared unacknowledged' : 'Cleared acknowledged';
        alm.createdTime = moment(new Date(alm.createdTime)).format('YYYY-MM-DD hh:mm A');
      });
      this.totalElements = alarm.totalElements;
    });
  }

  private msToHs(ms: number) {
    let h = Math.floor(ms / 36e5);
    let m = Math.floor((ms % 36e5) / 60000)
    let s = Math.round(((ms % 36e5) % 60000) / 1000)
    return (h < 10 ? '0' + h : h) + ':' + (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

  ngOnDestroy() {
    this.socket.close();
  }

  comChart(id: string, data: ChartData, chartType: string = 'bar') {
    if (this.chart[id] != undefined) {
      this.chart[id].data = data;
      this.chart[id].update();
    } else {
      this.chart[id] = new Chart(id, {
        type: chartType == 'bar' ? 'bar' : 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
        }
      });
    }
  }

  showDateFromTs(createdTime: number) {
    return moment(new Date(createdTime)).format('YYYY-MM-DD');
  }
}
