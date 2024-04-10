
export interface DashboardCardDatas {
  id: String,
  _data?: DashboardCardData,
}

export interface DashboardCardData {
  headerParams: KeyValueStatus[],
  params: ParamData[],
  leftParams: LeftParamKeyValue[],
  rightParams: KeyValue[],
  machineLastUpdateAt: KeyValue,
  macMode: KeyValue,
  deviceData: any
}


export interface KeyValueStatus {
  sl: number,
  key: string,
  title: string,
  value: string,
  status: any
}


export interface LeftParamKeyValue {
  sl: number,
  key: string,
  title: string,
  value: string
}

export interface KeyValue {
  key: string,
  value: any
}

export interface ParamData {
  sl: number,
  entity_id: string,
  key: string,
  title: string,
  minval: number,
  maxval: number,
  avgval: number,
  live: number
}
