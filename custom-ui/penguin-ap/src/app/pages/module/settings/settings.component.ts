import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AlarmData, TelemetryDataSettings, EnergyMeterDataSettings} from "../../../core/models/data-settings";
import {DeviceService} from "../../../core/services/device.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatDialog} from "@angular/material/dialog";
import {DialogSettingsComponent} from "./dialog/dialog-settings.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import Swal from "sweetalert2";
import {LocalstorageService} from "../../../core/services/localstorage.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit, AfterViewInit {
  alarmSettings: AlarmData[] = [];
  telemetrySettings: TelemetryDataSettings[] = [];
  emSettings: EnergyMeterDataSettings[] = [];
  alarmColumns = [{key: 'alarmId', title: 'Alarm ID'}, {key: 'alarmTitle', title: 'Alarm Title'}, {
    key: 'severity',
    title: 'Severity'
  }, {key: 'notes', title: 'Notes'}];
  alarmDisplayedColumns = ['alarmId', 'alarmTitle', 'severity', 'notes', 'action'];

  telemetryColumns = [{key: 'moldType', title: 'Mold Type'}, {key: 'title', title: 'Title'},
    {key: 'telemetryKey', title: 'Telemetry Key'}, {key: 'target', title: 'Target'}, {key: 'min', title: 'Min'},
    {key: 'max', title: 'Max'}, {key: 'faultId', title: 'Fault ID'}];

  telemetryDisplayedColumns = ['moldType', 'title', 'telemetryKey', 'target', 'min', 'max', 'faultId', 'action'];

  emColumns = [{key: 'name', title: 'Energy Meter'},
    {key: 'telemetryKey', title: 'Telemetry Key'}, {key: 'target', title: 'Target'}, {key: 'min', title: 'Min'},
    {key: 'max', title: 'Max'}, {key: 'faultId', title: 'Fault ID'}];

  emDisplayedColumns = ['name', 'telemetryKey', 'target', 'min', 'max', 'faultId', 'action'];


  totalAlarmElements: number = 0;
  totalTelemetryElements: number = 0;
  totalEMElements: number = 0;
  defaultPageSize = 20;
  pageSizeOptions = [this.defaultPageSize, this.defaultPageSize * 2, this.defaultPageSize * 3, this.defaultPageSize * 4]
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private deviceService: DeviceService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private storageService: LocalstorageService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.deviceService.getAttributeData('5e3903f0-d1fd-11ee-b0d8-756d52ed05f2').subscribe({
      next: data => {
        let fs = data.filter((item: any) => item.key == 'alarmData')
        if (fs.length > 0) {
          this.alarmSettings = fs[0].value
          this.totalAlarmElements = this.alarmSettings.length;
        }
        let fs2 = data.filter((item: any) => item.key == 'telemetryData')
        if (fs2.length > 0) {
          this.telemetrySettings = fs2[0].value
          this.totalTelemetryElements = this.telemetrySettings.length;
        }
        this.cdr.detectChanges();
      },
      error: err => {
      }
    })

    this.deviceService.getAttributeData('c9f4f7e0-d49e-11ee-b0d8-756d52ed05f2').subscribe({
      next: data => {
        let fs = data.filter((item: any) => item.key == 'emData')
        if (fs.length > 0) {
          this.emSettings = fs[0].value
          this.totalEMElements = this.emSettings.length;
        }
        this.cdr.detectChanges();
      },
      error: err => {
      }
    })
  }

  ngAfterViewInit(): void {
  }

  openDialog(type: string, data: any, index: number): void {
    const dialogRef = this.dialog.open(DialogSettingsComponent, {
      data: {
        type: type,
        data: data,
        index: index,
        oldData: type == 'alarm' ? this.alarmSettings : type == 'telemetry' ? this.telemetrySettings : this.emSettings
      }, width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
  deleteData(type: string, element:any, i:number) {
    Swal.fire({
      title: "Are you sure you want to delete this "+type+"?",
      icon: "warning",
      background:this.storageService.getDataByKey('snTheme')=='dark'?'#333333':'#ffffff',
      color:this.storageService.getDataByKey('snTheme')=='dark'?'#ffffff':'#000000',
      customClass: this.storageService.getDataByKey('snTheme')=='dark'?'dark':'light',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      showClass: {
        popup: `
      animate__animated
      animate__fadeIn
      animate__faster
    `
      },
      hideClass: {
        popup: `
      animate__animated
      animate__fadeOut
      animate__faster
    `
      }
    }).then((result) => {
      if (result.isConfirmed) {
        let data: any = {};
        if (type == 'alarm') {
          data['alarmData'] = this.alarmSettings;
          data['alarmData'].splice(i, 1);
        } else  if (type == 'telemetry') {
          data['telemetryData'] = this.telemetrySettings;
          data['telemetryData'].splice(i, 1);
        } else {
          data['emData'] = this.emSettings;
          data['emData'].splice(i, 1);
        }
        this.deviceService.saveAttributeData(type == 'alarm' || type == 'telemetry' ? '5e3903f0-d1fd-11ee-b0d8-756d52ed05f2' : 'c9f4f7e0-d49e-11ee-b0d8-756d52ed05f2', data).subscribe({
          next: data => {
            Swal.fire({
              title: "Deleted!",
              text: (type == 'alarm' ? 'Alarm' : type == 'telemetry' ? 'Telemetry' : 'Energy') + ' settings Data deleted successfully',
              icon: "success"
            });
            this.ngOnInit();
          }
        });
      }
    })
  }
}
