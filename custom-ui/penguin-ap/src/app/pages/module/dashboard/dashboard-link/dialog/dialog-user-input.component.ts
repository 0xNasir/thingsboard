import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {AfterViewInit, Component, Inject, OnInit} from "@angular/core";
import {FormBuilder, FormGroup, FormArray, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeviceService} from "../../../../../core/services/device.service";
import {MatSnackBar} from "@angular/material/snack-bar";

import {formatDate, NgForOf, NgIf} from "@angular/common";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule, NativeDateAdapter} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {FlexLayoutModule} from "@angular/flex-layout";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  standalone: true,
  selector: 'app-settings-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    NgForOf,
    NgIf,
    MatToolbar
  ],
  templateUrl: './dialog-user-input.component.html',
  providers: [{provide: NativeDateAdapter}]
})

export class DialogUserInputComponent implements OnInit, AfterViewInit  {

  dataForm!: FormGroup;
  hourArray = [...Array(12).keys()];
  selectedDate = formatDate(new Date(),'yyyy-MM-dd',"en-US"); // "2024-03-24";
  selectedShift = "shift_a";
  hourly_ts = [{
    name: '',
    ts: 0
  }];

  constructor(
    public dialogRef: MatDialogRef<DialogUserInputComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogRefData: any,
    private _snackBar: MatSnackBar,
    private deviceService: DeviceService,
    private fb: FormBuilder) {}

  ngOnInit() {
    console.log(this.dialogRefData);
    this.dataForm = this.fb.group({
      dataArray: this.fb.array(this.hourArray.map((_, index) => this.initDataGroup())) // Pass the index
    });
    this.dataArray.valueChanges.subscribe((values) => {
      values.forEach((value: any, index: number) => {
        let total = 0;
        Object.keys(value).forEach(key => {
          if(key != "component_description" && key != "delta_RejectAct" && value[key]) {
            total += parseInt(value[key]) > 0 ? parseInt(value[key]) : 0;
          }
        });
        this.dataArray.at(index).get('delta_RejectAct')?.setValue(total, {emitEvent: false});
      });
    });

    this.fetchRejectionDataAndUpdateView();
  }
  ngAfterViewInit() {

  }

  fetchRejectionDataAndUpdateView() {


    const date = new Date(this.selectedDate);
    // @ts-ignore
    this.hourly_ts = this.generateHourlyTimestamps(this.selectedShift == "shift_a" ? 8 : 20, 12, date);
    console.log("Hourly Ts: ", this.hourly_ts);

    // console.log('this.dataArray1', this.dataArray);
    this.deviceService.getTelemetryData(this.dialogRefData.data.id, 'RejectDetails', this.hourly_ts[0].ts, this.hourly_ts[this.hourly_ts.length-1].ts, 0, 'NONE').subscribe(telemetry => {
      console.log('this.data', telemetry.RejectDetails);
      if (telemetry.RejectDetails) {
        telemetry.RejectDetails.sort((a: { ts: number; }, b: { ts: number; }) => a.ts - b.ts);
        telemetry.RejectDetails.forEach((type: any, index: number) => {
          let datas = JSON.parse(type.value);
          Object.keys(datas).forEach((key: any, index1: number) => {
            this.dataArray.at(index).get(key)?.setValue(datas[key], {emitEvent: false});
          });
        });
      } else {
        this.hourly_ts.forEach((hour, index) => {
          this.rejectionTypes.forEach((type: any, index1: number) => {
            this.dataArray.at(index).get(type.name)?.setValue('', {emitEvent: false});
          });
        })
      }
    });
  }

  initDataGroup() {
    const group: any = {};
    this.rejectionTypes.forEach(type => {
      group[type.name] = [type.value];
    });
    return this.fb.group(group);
  }

  get dataArray(): FormArray {
    return this.dataForm.get('dataArray') as FormArray;
  }

  public rejectionTypes = [
    {name: 'component_description', label: 'Component Description', value: ''},
    {name: 'BS', label: 'Black Spot', value: ''},
    {name:'SC', label: 'SCRATCHES', value: ''},
    {name:'SS', label: 'SILVER STREAKS', value: ''},
    {name:'CL', label: 'CLIP DAMAGE', value: ''},
    {name:'SF', label: 'SHORT FILL', value: ''},
    {name:'F', label: 'FLASHES', value: ''},
    {name:'GM', label: 'GET MARK', value: ''},
    {name:'OM', label: 'OIL MARK', value: ''},
    {name:'FM', label: 'FLOW MARK', value: ''},
    {name:'SM', label: 'SHINK MARK', value: ''},
    {name:'DP', label: 'DIMENSION PROBLEMS', value: ''},
    {name:'delta_RejectAct', label: 'Total Rejection Qty', value: ''}
  ];

  public isVisible = true;
  public title = 'Rejection Data Input';

  getRejectionData() {
    console.log("getRejectionData: ", this.selectedDate);
    this.fetchRejectionDataAndUpdateView();
  }

  submitForm() {

    if (this.dataForm.valid) {
      let data: any = {};
      var date = new Date(this.selectedDate);
      // date.setDate(date.getDate() - 1);
      let hourly_ts = this.generateHourlyTimestamps(this.selectedShift == "shift_a" ? 8 : 20, 12, date);
      data = this.dataArray.value.map((val: any, index: number) => {
        return { ts: hourly_ts[index].ts, values: { delta_RejectAct: val.delta_RejectAct, RejectDetails: val }}
      });

      console.log(data);

      this.deviceService.saveTelemetryData(this.dialogRefData.data.id, data
      ).subscribe({
        next: data => {
          this._snackBar.open('Rejection Data saved successfully', 'OK', {duration: 2000});
          this.dialogRef.close()
        }
      })
    }
  }

  generateHourlyTimestamps(startHour: number, duration: number, day = new Date()) {
    const timestamps = [];
    for (let t = 0; t < duration; t++) {
      let tempDate = new Date(day.getTime());
      tempDate.setHours(startHour+t, 0, 0, 0);
      let dt = {
        name: startHour+t > 23 ? startHour+t - 24 : startHour+t,
        ts: tempDate.getTime()
      }
      timestamps.push(dt);
    }
    return timestamps;
  }

  protected readonly parseInt = parseInt;
}
