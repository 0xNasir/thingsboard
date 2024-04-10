import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../../../../environments/environment";
import {LocalstorageService} from "../../../../core/services/localstorage.service";
import {LoadingService} from "../../../../core/services/loading.service";
import {DeviceService} from "../../../../core/services/device.service";
import moment from "moment";
import {Chart, ChartData} from "chart.js/auto";
import {ScriptService} from "../../../../core/services/script.service";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-energy-meter-link',
  templateUrl: './energy-meter-link.component.html',
  styleUrl: './energy-meter-link.component.scss'
})
export class EnergyMeterLinkComponent implements OnInit {
  chart: any = {};
  deviceInfo: any;
  socket: WebSocket = new WebSocket('wss://' + environment.host + ':' + environment.port + '/api/ws');
  realtimeData: any = {
    L1: 0,
    L2: 0,
    L3: 0,
    V1: 0,
    V2: 0,
    V3: 0,
    V12: 0,
    V23: 0,
    V31: 0,
    W1: 0,
    W2: 0,
    W3: 0,
    PF1: 0,
    PF2: 0,
    PF3: 0,
    kWhT_I: 0,
    F:0
  };
  fill: string = this.storage.getDataByKey('snTheme') == 'dark' ? '#FFFFFF' : '#000000';

  constructor(private router: Router,
              private activeRoute: ActivatedRoute,
              private loadingService: LoadingService,
              private deviceService: DeviceService,
              private scriptService: ScriptService,
              private titleService: Title,
              private storage: LocalstorageService) {
    Chart.defaults.color = storage.getDataByKey('snTheme') == 'dark' ? '#FFFFFF' : '#000000';
  }

  ngOnInit(): void {
    this.loadingService.show();
    this.activeRoute.paramMap.subscribe(param => {
      let id: string = param.get('id') || '';
      if (id != '') {
        this.deviceService.getDeviceByDeviceId(id).subscribe(device => {
          this.deviceInfo = device;
          this.titleService.setTitle('PenguinAP - Energy Meter: '+(this.deviceInfo?.label==''?this.deviceInfo?.name:this.deviceInfo?.label));
        });
        let startTs = new Date(moment().format('YYYY-MM-DDT00:00:00'));
        startTs.setDate(startTs.getDate() - 29);
        this.deviceService.getTelemetryData(id, 'delta_kWh_I', startTs.getTime(), new Date().getTime(), 3600 * 24 * 1000, 'SUM').subscribe(telemetry => {
          let chartData: ChartData = this.scriptService.generateChartData(telemetry, ['Consumption (kWh)'], ['#bc566b'], 'DAILY', startTs, new Date());
          this.consumptionChart('consumption30Days', chartData);
        });
        let startMTs = new Date(moment().format('YYYY-MM-DDT00:00:00'));
        startMTs.setMonth(startMTs.getMonth() - 12);
        this.deviceService.getTelemetryData(id, 'delta_kWh_I', startMTs.getTime(), new Date().getTime(), 3600 * 24 * 1000, 'SUM').subscribe(telemetry => {
          let chartData: ChartData = this.scriptService.generateChartData(telemetry, ['Consumption (kWh)'], ['#bc566b'],'MONTHLY', startMTs, new Date());
          this.consumptionChart('consumption12Month', chartData);
        });

        let startLTs=new Date();
        startLTs.setHours(startLTs.getHours()-24);
        let lineChartStart=moment(startLTs).format('YYYY-MM-DDTHH:mm:ss');
        this.deviceService.getTelemetryData(id, 'V1,V2,V3,V12,V23,V31,L1,L2,L3,W1,W2,W3,PF1,PF2,PF3', new Date(lineChartStart).getTime(), new Date().getTime(), 36e5, 'AVG').subscribe({
          next: res=>{
            let chartData: ChartData = this.scriptService.generateChartData({V1: res?.V1||[], V2: res?.V2||[], V3:res?.V3||[]}, ['L1 Voltage (V)', 'L2 Voltage (V)', 'L3 Voltage (V)'], ['#bc566b', '#0E84D3FF', '#00b2a1'],'24HOURS', new Date(lineChartStart), new Date(), 'line');
            this.consumptionChart('3phaseVoltage', chartData, 'line');
            let chartData2: ChartData = this.scriptService.generateChartData({V12: res?.V12||[], V23: res?.V23||[], V31:res?.V31||[]}, ['L12 Voltage (V)', 'L23 Voltage (V)', 'L31 Voltage (V)'], ['#bc566b', '#0E84D3FF', '#00b2a1'],'24HOURS', new Date(lineChartStart), new Date(), 'line');
            this.consumptionChart('lineToLineVoltage', chartData2, 'line');
            let pfChartData: ChartData = this.scriptService.generateChartData({PF1: res?.PF1||[], PF2: res?.PF2||[], PF3:res?.PF3||[]}, ['Power factor 1', 'Power factor 1', 'Power factor 1'], ['#bc566b', '#0E84D3FF', '#00b2a1'],'24HOURS', new Date(lineChartStart), new Date(), 'line');
            this.consumptionChart('pf', pfChartData, 'line');
            let currentChartData: ChartData = this.scriptService.generateChartData({L1: res?.L1||[], L2: res?.L2||[], L3:res?.L3||[]}, ['Electricity L1(A)', 'Electricity L2(A)', 'Electricity L3(A)'], ['#bc566b', '#0E84D3FF', '#00b2a1'],'24HOURS', new Date(lineChartStart), new Date(), 'line');
            this.consumptionChart('current', currentChartData, 'line');
          },
          error: err=>{}
        })
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
              entityId: id,
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
          if (jsonData.data[key][0].length > 1) {
            this.realtimeData[key] = Number(jsonData.data[key][0][1]);
          }
        });
      };

      this.socket.onclose = function (event) {
        console.log("Connection is closed!");
      };
    });
  }

  showDateFromTs(createdTime: number) {
    return moment(new Date(createdTime)).format('YYYY-MM-DD');
  }

  consumptionChart(id: string, data: ChartData, chartType:string='bar') {
    if (this.chart[id] != undefined) {
      this.chart[id].data = data;
      this.chart[id].update();
    } else {
      this.chart[id] = new Chart(id, {
        type: chartType=='bar'?'bar':'line',
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
}
