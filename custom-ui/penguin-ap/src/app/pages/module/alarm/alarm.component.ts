import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import moment from "moment";
import {LocalstorageService} from "../../../core/services/localstorage.service";
import TinyColor from "tinycolor2";
import {AlarmService} from "../../../core/services/alarm.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import $ from 'jquery';
import {DeviceService} from "../../../core/services/device.service";
import {FormControl} from "@angular/forms";
import {MatSelectChange} from "@angular/material/select";
import {animation} from "@angular/animations";


@Component({
  selector: 'app-alarm',
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.scss'
})
export class AlarmComponent implements OnInit, AfterViewInit{
  bgColor=this.storageService.getDataByKey('snTheme')=='dark'?'#424242':'#9f9c9c';
  year=Number(moment(new Date()).format('YYYY'));
  cYear=Number(moment(new Date()).format('YYYY'));
  alarmColumnDef:any=[{'key': 'label', 'title': 'Alarm Label'}, {'key': 'createdTime', 'title': 'Created Time'}, {'key': 'originatorLabel', 'title': 'Originator Name'}, {key: 'duration', title: 'Duration'}, {key: 'type', title: 'Type'}, {key: 'severity', title: 'Severity'}, {key: 'status', title: 'Status'}];
  alarmColumns:string[]=[ 'label', 'createdTime', 'originatorLabel','duration', 'type', 'severity', 'status'];
  defaultPageSize = 20;
  totalElements = 0;
  pageSizeOptions = [this.defaultPageSize, this.defaultPageSize * 2, this.defaultPageSize * 3, this.defaultPageSize * 4]
  totalAlarm=0;
  dates: any[] = [];
  dataArray: any[] = [];
  alarmData:any[]=[];
  allAlarmData:any[]=[];
  days=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  selectedStartDate: any;
  selectedEndDate: any;
  public deviceHeight: number=0;

  moldingMachines:any[]=[];
  selectedMoldMachines:any[]=[];
  moldingMachine = new FormControl();

  moldGatewayAttribute: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private storageService: LocalstorageService,
              private alarmService: AlarmService,
              private deviceService: DeviceService) {
    this.getDeviceHeight();
  }
  ngOnInit(): void {

    this.deviceService.getAttributeData('5e3903f0-d1fd-11ee-b0d8-756d52ed05f2').subscribe({
      next: data => {
        this.moldGatewayAttribute = data;

        this.fetchAlarmData(new Date(moment(new Date(this.year, 0, 1)).format('YYYY-MM-DD 00:00:00')).getTime(), new Date(moment(new Date(this.year, 0, 1)).format('YYYY-12-31 23:59:59')).getTime());

        this.deviceService.getDevicesByDeviceProfile(0, 200, '95cc3bc0-d3e7-11ee-b0d8-756d52ed05f2').subscribe({
          next: data => {
            this.moldingMachines=data.data.filter((dt: any) => dt.name != 'Moulding Machine GW');
            this.toggleAllSelection();
          }
        })

        // Data Current Month Alarms
        this.monthSelected(this.getCurrentMonthName());

      }
    });
  }

  onMoldingMachineSelect(event: MatSelectChange) {
    if(event.value.filter((v:any) => v == undefined).length == 1 &&  event.value.length > 1) {
      this.alarmData = [];
    } else if(event.value.filter((v:any) => v == undefined).length == 1 && event.value.length == 1) {
      this.alarmData = this.allAlarmData;
    } else {
      this.selectedMoldMachines = event.value.filter((v:any) => v);
      this.alarmData = this.allAlarmData.filter((dt: any) => {
        return this.selectedMoldMachines.find((mm: any) => mm?.name == dt.originatorName);
      });
    }
  }

  toggleAllSelection() {
    if (this.isAllSelected()) {
      this.selectedMoldMachines = [];
      this.moldingMachine.setValue([]);
      this.alarmData = [];
    } else {
      this.selectedMoldMachines = this.moldingMachines;
      this.moldingMachine.setValue(this.moldingMachines);
      this.alarmData = this.allAlarmData;
    }
  }

  isAllSelected() {
    const numSelected = this.selectedMoldMachines.length;
    const numOptions = this.moldingMachines.length;
    return numSelected === numOptions;
  }

  fetchAlarmData(startTs:number, endTs:number){
    this.alarmService.getAlarmInRangeCount(startTs, endTs).subscribe({
      next: (data: any) => {
        if(data.data){
          data.data.forEach((element:any) => {
            this.totalAlarm+= element.count;
          })
        }
        this.buildDataForChart(data.data||[]);
      },
      error: (data: any) => {
        this.buildDataForChart();
      }
    });
  }
  ngAfterViewInit() {
    this.paginator.page.subscribe((page: PageEvent) => {
      this.fetchAlarmDetails(page.pageIndex, page.pageSize);
    })
  }
  @HostListener('window:resize', ['$event'])
  getDeviceHeight() {
    this.deviceHeight = window.innerHeight - 153-36-205;
  }
  buildDataForChart(conTrib:any[]=[]) {
    this.dates=[];
    let i = new Date(this.year, 0, 1);
    const endDate=this.year==Number(moment().format('YYYY'))?new Date():new Date(this.year, 11,31);
    for (; i <= endDate;i.setDate(i.getDate() + 1)) {
      let sdt=conTrib.filter(ct=>moment(new Date(ct.day_ts)).format('YYYY-MM-DD')==moment(new Date(i)).format('YYYY-MM-DD'));
      let indx=this.dates.findIndex(dt=>dt.month==moment(i).format('MMM'));
      if (indx>-1){
        this.dates[indx].dates.push({date: moment(i).format('YYYY-MM-DD'), value: sdt.length?sdt[0].count:0});
      }else{
        let dayIndex=this.days.findIndex(d=>d==moment(i).format('ddd'));
        if(dayIndex>0){
          for(let j=0;j<dayIndex;j++){
            if(j==0){
              this.dates.push({month: moment(i).format('MMM'), dates: [{date: '', value: -1}]});
            }else{
              let x=this.dates.findIndex(dt=>dt.month==moment(i).format('MMM'));
              if (x>-1){
                this.dates[x].dates.push({date: '', value: -1});
              }
            }
          }
          let x=this.dates.findIndex(dt=>dt.month==moment(i).format('MMM'));
          if (x>-1){
            this.dates[x].dates.push({date: moment(i).format('YYYY-MM-DD'), value:  sdt.length?sdt[0].count:0});
          }
        }else{
          this.dates.push({month: moment(i).format('MMM'), dates: [{date: moment(i).format('YYYY-MM-DD'), value: sdt.length?sdt[0].count:0}]});
        }
      }
    }
    this.dates.forEach(date=>{
      date.dates=this.rearrangeArray(date.dates);
    });
    this.dataArray=this.dates;
  }
  rearrangeArray(inputArray:any[], columns=7) {
    const result:any = [];
    for (let i = 0; i < columns; i++) {
      result.push([]);
    }

    inputArray.forEach((element, index) => {
      const columnIndex = index % columns;
      result[columnIndex].push(element);
    });
    return result;
  }

  changeYear(inc: string) {
    this.year+=inc=='inc'?1:-1;
    this.fetchAlarmData(new Date(moment(new Date(this.year, 0, 1)).format('YYYY-MM-DD 00:00:00')).getTime(), new Date(moment(new Date(this.year, 0, 1)).format('YYYY-12-31 23:59:59')).getTime());
  }

  getBgColor(data:any) {
    let color=TinyColor("#ff0000");
    return data==-1?'transparent':data==0?this.bgColor:color.darken(data).toString();
  }

  showToolTip(data:any) {
    return data.value+' alarms on '+data.date;
  }

  getAlarms(data: any) {
    this.totalElements=0;
    this.alarmData=[];
    this.selectedStartDate=new Date(data.date+' 00:00:00');
    this.selectedEndDate=new Date(data.date+' 23:59:59');
    if (data.value>0){
      this.fetchAlarmDetails();
    }
  }

  private fetchAlarmDetails(page:number=0, pageSize:number=20) {
    this.alarmService.getAlarmsForSelectedDate(this.selectedStartDate.getTime(), this.selectedEndDate.getTime(), pageSize, page).subscribe({
      next: (data: any) => {

        let alarmDictionary = this.moldGatewayAttribute.find((gwa: any) => gwa.key == 'alarmData').value;
        this.alarmData=data.data;
        this.allAlarmData = data.data;

        this.allAlarmData.map((ad :any) => {
          let aDic = alarmDictionary.find((aDic: any) => aDic.alarmId == ad.type);
          if (aDic) {
            ad.label = aDic.alarmTitle;
          }
        });

        console.log("aDic: ", this.allAlarmData);

        console.log("Alarm Data: ", this.alarmData);
        this.alarmData =this.alarmData.filter((dt: any) => {
          return this.selectedMoldMachines.find((mm: any) => mm.name == dt.originatorName);
        });
        console.log("Alarm Data: ", this.alarmData);

        this.alarmData=data.data;
        this.alarmData.forEach((alm:any) => {
          alm['duration']=this.msToHs(alm.endTs-alm.startTs);
          alm['status']=alm.status=='ACTIVE_UNACK'?'Active unacknowledged':alm.status=='ACTIVE_ACK'?'Active acknowledged':alm.status=='CLEARED_UNACK'?'Cleared unacknowledged':'Cleared acknowledged';
          alm.createdTime=moment(new Date(alm.createdTime)).format('YYYY-MM-DD hh:mm A');
        });
        this.totalElements = data.totalElements;
      },
      error: (data: any) => {
        this.alarmData=[];
        this.totalElements = 0;
      }
    });
  }
  private msToHs(ms:number){
    let h=Math.floor(ms/36e5);
    let m=Math.floor((ms%36e5)/60000)
    let s=Math.round(((ms%36e5)%60000)/1000)
    return (h<10?'0'+h:h)+':'+(m<10?'0'+m:m)+':'+(s<10?'0'+s:s);
  }

  monthSelected(month: string) {
    $('.month.active').removeClass('active');
    $('#'+month.toLowerCase()).addClass('active');
    $('[data-month='+month+']').addClass('active');
    this.selectedStartDate=this.parseCustomDateFormat(this.year+'-'+month+'-01 00:00:00');
    let lastEar=moment(this.parseCustomDateFormat(this.year+'-'+month+'-01 00:00:00'));
    this.selectedEndDate=this.parseCustomDateFormat(this.year+'-'+month+'-'+lastEar.daysInMonth()+' 23:59:59');
    console.log(month, this.selectedStartDate, this.selectedEndDate);
    this.fetchAlarmDetails();

  }

  dtObjFromStr(date: string) {
    return new Date(date);
  }

  parseCustomDateFormat(dateString: string): Date {
    // Mapping month abbreviations to month numbers (0-indexed)
    const monthMap: { [key: string]: number } = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    // Splitting the date string into components
    const parts = dateString.split(' ');
    const dateParts = parts[0].split('-');
    const timeParts = parts[1].split(':');

    const year = parseInt(dateParts[0], 10);
    const month = monthMap[dateParts[1]]; // Using the map to get the month number
    const day = parseInt(dateParts[2], 10);
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const seconds = parseInt(timeParts[2], 10);

    // Constructing the Date object
    return new Date(year, month, day, hours, minutes, seconds);
  }

  getCurrentMonthName(): string {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const monthIndex = currentDate.getMonth(); // getMonth() returns a zero-based index.
    return monthNames[monthIndex];
  }

}
