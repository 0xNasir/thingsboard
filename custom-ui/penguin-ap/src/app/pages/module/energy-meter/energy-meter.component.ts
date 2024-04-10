import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {DeviceService} from "../../../core/services/device.service";
import {Router} from "@angular/router";
import moment from "moment";
import {LocalstorageService} from "../../../core/services/localstorage.service";
import {last} from "rxjs";
import {ScriptService} from "../../../core/services/script.service";
import {Chart, ChartData} from "chart.js/auto";

@Component({
  selector: 'app-energy-meter',
  templateUrl: './energy-meter.component.html',
  styleUrl: './energy-meter.component.scss'
})
export class EnergyMeterComponent implements OnInit, AfterViewInit {
  chart: any = {};
  deviceHeight: number = 0;
  defaultPageSize = 20;
  deviceData: any[] = [];
  showingSpin=true;
  totalTodaysConsumption=0.00;
  totalYesterdayConsumption=0.00;
  last7DaysTotal=0.00;
  prev7DaysTotal=0.00;
  theme=this.storageService.getDataByKey('snTheme')||'light';
  energyMeterGWAttribute: any;
  emData: any;

  constructor(private deviceService: DeviceService,
              private storageService: LocalstorageService,
              private scriptService: ScriptService,
              private router: Router) {
    this.getDeviceHeight();
    Chart.defaults.color = this.storageService.getDataByKey('snTheme') == 'dark' ? '#FFFFFF' : '#000000';
  }

  @HostListener('window:resize', ['$event'])
  getDeviceHeight() {
    this.deviceHeight = window.innerHeight - 75;
  }

  ngOnInit(): void {
    this.fetchData();

    this.deviceService.getAttributeData('c9f4f7e0-d49e-11ee-b0d8-756d52ed05f2').subscribe({
      next: data => {
        this.energyMeterGWAttribute = data;
        this.emData = data.find((d: any) => d.key == 'emData').value;
      }
    });

  }

  ngAfterViewInit() {
  }

  fetchData(index = 0, pageSize = this.defaultPageSize) {
    this.deviceService.getDevicesByDeviceProfile(index, pageSize, 'ef0fad00-d49d-11ee-b0d8-756d52ed05f2').subscribe(response => {
      this.deviceData = response.data;
      if (this.deviceData.length > 0) {
        this.recursiveDeviceDataLoading(this.deviceData);
      }
    });
  }
  recursiveDeviceDataLoading(device:any, index=0, ){
    if (device.length > index){
      let startTs=new Date(moment().format('YYYY-MM-DDT00:00:00'));
      startTs.setDate(startTs.getDate() - 14);
      this.deviceService.getTelemetryData(device[index].id.id, 'delta_kWh_I', startTs.getTime(), new Date().getTime(), 36e5, 'SUM').subscribe(response => {
        device[index]['response']=response;
        let cEnergy=0;
        Object.keys(response).forEach(key => {
          cEnergy=Number(response[key][response[key].length-1].value);
        });
        device[index]['cEnergy']=cEnergy;
        this.deviceService.getTelemetryData(device[index].id.id, 'WT', startTs.getTime(), new Date().getTime(), 36e5, 'NONE').subscribe(response1 => {
          let target = this.emData.find((emd: any) => emd.name == device[index].name && emd.telemetryKey == "WT")?.target;
          let actual = Number(Object.keys(response1).length ? response1?.WT[0]?.value : "0");
          device[index]['cWT'] = actual;
          device[index]['cPercentage'] = target ? 100*(actual/target) : 0;
          // console.log('cTarget: ', target ? 100*(actual/target) : 0, actual, target);
        });
        this.recursiveDeviceDataLoading(device, index+1);
      });
    }else{
      device.forEach((item:any,index:number) => {
        Object.keys(item.response).forEach((key:any) => {
          item.response[key].forEach((value:any) => {
            if(moment(new Date(value.ts)).format('YYYY-MM-DDT00:00:00')==moment().format('YYYY-MM-DDT00:00:00')){
              this.totalTodaysConsumption+=Number(value.value);
            }
            if(moment(new Date(value.ts)).format('YYYY-MM-DDT00:00:00')==moment().subtract(1, 'day').format('YYYY-MM-DDT00:00:00')){
              this.totalYesterdayConsumption+=Number(value.value);
            }
          });
          let sevenDaysData=item.response[key].filter((item:any) => item.ts<=new Date().getTime() && item.ts>new Date(moment().subtract(7, 'days').format('YYYY-MM-DDTHH:mm:00')).getTime());
          sevenDaysData.forEach((item:any) => {
            this.last7DaysTotal+=Number(item.value)
          });
          let prevSevenDaysData=item.response[key].filter((item:any) => item.ts<=new Date(moment().subtract(7, 'days').format('YYYY-MM-DDTHH:mm:00')).getTime() && item.ts>new Date(moment().subtract(14, 'days').format('YYYY-MM-DDTHH:mm:00')));
          prevSevenDaysData.forEach((item:any) => {
            this.prev7DaysTotal+=Number(item.value);
          });
        });
      });
      this.showingSpin=false;
      this.initiateChart(device);
    }
  }
  initiateChart(deviceData:any){
    let data:any={};
    let label:string[]=[];
    let colors: string[]=[]
    deviceData.forEach((device:any) => {
      if(device.name!='em-gateway'){
        label.push(device.name);
        data[device.name]=device?.response?.delta_kWh_I?.filter((kwh:any)=>kwh.ts<new Date().getTime())||[];
        colors.push(this.getRandomColor());
      }
    });
    let chartData: ChartData=this.scriptService.generateChartData(data, label, colors, '24HOURS', new Date(moment().subtract(24, 'hours').format('YYYY-MM-DDTHH:00:00')), new Date(), 'line')
    this.visualizeChart('consumptionBreakdown', chartData, 'line');
  }
  getRandomColor(): string {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Convert RGB to hex
    const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return hex;
  }
  gotoDevice(device: any) {
    this.router.navigateByUrl('/energy-meter/' + device.id.id);
  }
  visualizeChart(id: string, data: ChartData, chartType:string='bar') {
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
          scales:{
            x:{
              title: {
                display: false,
                text: 'Time'
              }
            },
            y:{
              title: {
                display: true,
                text: 'Energy (kWh)'
              }
            }
          },
          plugins:{
            legend: {
              display: true,
              align:'center',
              position: 'right'
            }
          }
        }
      });
    }
  }
}
