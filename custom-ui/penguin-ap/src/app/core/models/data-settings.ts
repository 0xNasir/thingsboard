export interface AlarmData {
  alarmId: number;
  alarmTitle: string;
  severity: string;
  notes: string;
}

export interface TelemetryDataSettings{
  moldType: string;
  title: string;
  telemetryKey:string;
  target: number;
  min: number;
  max: number;
  faultId: number;
}



export interface EnergyMeterDataSettings{
  name: string;
  title: string;
  telemetryKey:string;
  target: number;
  min: number;
  max: number;
  faultId: number;
}
