import { Injectable } from '@angular/core';
import {ChartData, ChartDataset} from "chart.js/auto";
import moment from "moment/moment";

@Injectable({
  providedIn: 'root'
})
export class ScriptService {

  constructor() { }

  generateChartData(data: any, datasetLabels: string[], bgColor: string[], type: string, start: any, end: any, chartType='bar'): ChartData {
    let labels: string[] = [];
    if (type == 'MONTHLY') {
      for (let i = start; i < end; i.setMonth(i.getMonth() + 1)) {
        labels.push(moment(i).format('MMM, YYYY'));
      }
    } if (type=='24HOURS'){
      for (let i = start; i < end; i.setHours(i.getHours() + 1)) {
        labels.push(moment(i).format('hh:00 A'));
      }
    } else {
      for (let i = start; i < end; i.setDate(i.getDate() + 1)) {
        labels.push(moment(i).format('DD-MM-YYYY'));
      }
    }
    let dataset: ChartDataset[] = [];
    Object.keys(data).forEach((key, index) => {
      let obj: any = {label: datasetLabels[index], data: [], backgroundColor: bgColor[index], borderWidth: chartType=='bar'?0:1, borderColor: bgColor[index]};
      labels.forEach((label, labelIndex) => {
        if (type == 'MONTHLY') {
          let filteredData = data[key].filter((dt: any) => moment(new Date(dt.ts)).format('MMM, YYYY') == label);
          if (filteredData.length > 0) {
            let sum = 0;
            filteredData.forEach((d: any) => {
              sum += Number(d.value)
            });
            obj.data.push(sum);
          } else {
            obj.data.push(0);
          }
        } else if(type == '24HOURS') {
          let indx = data[key].findIndex((dt: any) => moment(new Date(dt.ts)).format('hh:00 A') == label);
          obj.data.push(indx >= 0 ? Number(data[key][indx].value) : 0);
        } else {
          let indx = data[key].findIndex((dt: any) => moment(new Date(dt.ts)).format('DD-MM-YYYY') == label);
          obj.data.push(indx >= 0 ? Number(data[key][indx].value) : 0);
        }
      });
      obj['tension']=0.1;
      dataset.push(obj);
    });
    return {labels: labels, datasets: dataset};
  }
}
