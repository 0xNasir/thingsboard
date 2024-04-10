import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Component, Inject} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DeviceService} from "../../../../core/services/device.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './dialog-settings.component.html'
})

export class DialogSettingsComponent {
  public title: string = this.data.type == 'alarm' ? 'Manage Alarm Settings Data' : this.data.type == 'telemetry'
    ? 'Manage Telemetry Settings Data' : 'Energy Meter Settings';
  public formType: string = this.data.type;
  form: FormGroup = this.fb.group({});

  constructor(
    public dialogRef: MatDialogRef<DialogSettingsComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private deviceService: DeviceService,
    private _snackBar: MatSnackBar
  ) {
    if (data.type == 'alarm') {
      this.form = this.fb.group({
        alarmId: [data.data.alarmId || '', Validators.required],
        alarmTitle: [data.data.alarmTitle || '', Validators.required],
        severity: [data.data.severity || '', Validators.required],
        notes: [data.data.notes || '']
      });
    } else if (data.type == 'telemetry') {
      this.form = this.fb.group({
        moldType: [data.data.moldType || '', Validators.required],
        title: [data.data.title || '', Validators.required],
        telemetryKey: [data.data.telemetryKey || '', Validators.required],
        target: [data.data.target || '', [Validators.required]],
        min: [data.data.min || '', Validators.required],
        max: [data.data.max || '', Validators.required],
        faultId: [data.data.faultId || '']
      });
    } else if (data.type == 'emForm') {
      this.form = this.fb.group({
        name: [data.data.name || '', Validators.required],
        telemetryKey: [data.data.telemetryKey || '', Validators.required],
        target: [data.data.target || '', [Validators.required]],
        min: [data.data.min || '', Validators.required],
        max: [data.data.max || '', Validators.required],
        faultId: [data.data.faultId || '']
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  submitForm() {
    if (this.form.valid) {
      let data: any = {};
      if (this.data.type == 'alarm') {
          data['alarmData'] = this.data.oldData;
        if (this.data.index==-1){
          data['alarmData'].push(this.form.value);
        }else{
          data['alarmData'][this.data.index]=this.form.value;
        }
      } else if (this.data.type == 'telemetry') {
        data['telemetryData'] = this.data.oldData;
        if (this.data.index==-1){
          data['telemetryData'].push(this.form.value);
        }else{
          data['telemetryData'][this.data.index]=this.form.value;
        }
      } else {
        data['emData'] = this.data.oldData;
        if (this.data.index==-1){
          data['emData'].push(this.form.value);
        }else{
          data['emData'][this.data.index]=this.form.value;
        }
      }
      this.deviceService.saveAttributeData(this.data.type == 'alarm' || this.data.type == 'telemetry' ? '5e3903f0-d1fd-11ee-b0d8-756d52ed05f2' : 'c9f4f7e0-d49e-11ee-b0d8-756d52ed05f2', data).subscribe({
        next: data => {
          this._snackBar.open(this.data.type == 'alarm' ? 'Alarm settigs Data deleted successfully' : this.data.type == 'telemetry' ? 'Telemetry data settings deleted successfully' : 'Energy data settings deleted successfully', 'OK', {duration: 2000});
          this.dialogRef.close()
        }
      })
    }
  }
}
