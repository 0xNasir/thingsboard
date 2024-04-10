export interface RealTimeData {
  title: string;
  key: string;
  type:SNDataType;
  data: RealTimeData[]|any;
}
export enum SNDataType{
  OBJECT='object',
  ARRAY='array'
}
