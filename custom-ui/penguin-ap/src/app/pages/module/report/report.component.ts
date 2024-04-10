import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import moment from "moment/moment";
import {DeviceService} from "../../../core/services/device.service";
import $ from "jquery";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Chart, ChartData} from "chart.js/auto";
import {LocalstorageService} from "../../../core/services/localstorage.service";
import {ScriptService} from "../../../core/services/script.service";

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrl: './report.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportComponent implements OnInit, AfterViewInit, OnDestroy {
  chart: any = {};
  reportType: string[] = ['Hourly', 'Daily', 'Monthly', 'Yearly'];
  reportLabel = '';
  form: FormGroup = this.fb.group({});
  tableData: any = undefined;
  machineList: any[] = [];
  sumColumn: { key: string; title: string; }[] = [{key: 'delta_GoodPartAct', title: 'Good Part'},
    {key: 'delta_RejectAct', title: 'Reject Part'},
    {key: 'delta_TotalShotAct', title: 'Total Shot'},
    {key: 'delta_GoodShotAct', title: 'Good Shot'},
    {key: 'delta_EnergyVal', title: 'Energy (kWh)'}];
  aggColumn = [{key: 'CycleTime', title: 'Cycle Time'},
    {key: 'InjPrs1', title: 'Injection Pressure'},
    {key: 'Nozzle1Temperature', title: 'Nozzle1 Temp'},
    {key: 'MeltCushion', title: 'Melt Cushion'},
    {key: 'CoolTimAct', title: 'Colling Time'},
    {key: "OilTemperature", title: "Oil Temperature"},
    {key: "InjectionTime", title: "Injection Time"},
    {key: "MoldCloseTime", title: "Mold Close Time"},
    {key: "MoldOpenTime", title: "Mold Open Time"},
    {key: "DosingStop", title: "Dosing Stop"},
    {key: "FeedTemperature", title: "Feed Temperature"},
    {key: "MeltTemperature", title: "Melt Temperature"},
    {key: "EjectorForwardTime", title: "Ejector Forward Time"},
    {key: "EjectorBackTime", title: "Ejector Back Time"},
    {key: "PeakInjectionPressure", title: "Peak Injection Pressure"},
    {key: "MTCTemperature", title: "MTC Temperature"},
    {key: "Zone1Temperature", title: "Zone1 Temperature"},
    {key: "Zone2Temperature", title: "Zone2 Temperature"},
    {key: "Zone3Temperature", title: "Zone3 Temperature"},
    {key: "Zone4Temperature", title: "Zone4 Temperature"},
    {key: "Tonnage", title: "Tonnage"}];

  energyColumn: { key: string; title: string }[] = [
    {key: 'delta_kWh_I', title: 'Energy (kWh)'},
    {key: 'V1', title: 'L1 Voltage(V)'},
    {key: 'V2', title: 'L2 Voltage(V)'},
    {key: 'V3', title: 'L3 Voltage(V)'},
    {key: 'V12', title: 'L12 Voltage(V)'},
    {key: 'V23', title: 'L23 Voltage(V)'},
    {key: 'V31', title: 'L31 Voltage(V)'},
    {key: 'A1', title: 'L1 Current(A)'},
    {key: 'A2', title: 'L2 Current(A)'},
    {key: 'A3', title: 'L3 Current(A)'},
    {key: 'PF1', title: 'L1 PF'},
    {key: 'PF2', title: 'L2 PF'},
    {key: 'PF3', title: 'L3 PF'},
  ]
  tableColumn: any[] = [];
  displayedColumns: string[] = [];

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              private deviceService: DeviceService,
              private storage: LocalstorageService,
              private scriptService: ScriptService,) {
    this.resetForm();
    Chart.defaults.color = storage.getDataByKey('snTheme') == 'dark' ? '#FFFFFF' : '#000000';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param: Params) => {
      if (param['type'] != undefined) {
        this.reportLabel = param['type'];
        if (this.reportLabel == 'molding') {
          this.deviceService.getDevicesByDeviceProfile(0, 200, '95cc3bc0-d3e7-11ee-b0d8-756d52ed05f2').subscribe({
            next: data => {
              this.machineList = data.data;
              this.resetForm();
            }
          });
        } else {
          this.deviceService.getDevicesByDeviceProfile(0, 200, 'ef0fad00-d49d-11ee-b0d8-756d52ed05f2').subscribe({
            next: data => {
              this.machineList = data.data;
              this.resetForm();
            }
          });
        }
        this.cdr.detectChanges();
      } else {
        const queryParams = {type: 'molding'};

        // Navigate to the current URL with the added query parameters
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: queryParams,
          queryParamsHandling: 'merge' // merge with existing query parameters
        });
      }
    });
  }

  ngAfterViewInit(): void {}

  searchInitiate() {
    if (this.form.valid) {
      this.generateTableMetaData();
      const keys = this.form.value.aggField.map((obj: any) => obj.key);
      let interval = 0;
      let startDate = undefined;
      let endDate = undefined;
      if (this.form.value.reportType == 'Hourly') {
        interval = 36e5;
        startDate = new Date(moment(this.form.value.startDate).format('YYYY-MM-DD ') + this.form.value.startTime + ':00');
        endDate = new Date(moment(this.form.value.endDate).format('YYYY-MM-DD ') + this.form.value.endTime + ':00');
      } else if (this.form.value.reportType == 'Daily') {
        interval = 36e5 * 24;
        startDate = new Date(moment(this.form.value.startDate).format('YYYY-MM-DD 00:00:00'));
        endDate = new Date(moment(this.form.value.endDate).format('YYYY-MM-DD 23:59:59'));
      } else if (this.form.value.reportType == 'Monthly') {
        interval = 36e5 * 24 * 30;
        startDate = new Date(this.form.value.startDate + '-01 00:00:00');
        endDate = new Date(this.form.value.endDate + '-30 00:00:00');
        let e = moment(new Date(this.form.value.endDate));
      } else {
        interval = 36e5 * 24 * 365;
        startDate = new Date(this.form.value.startDate + '-01-01 00:00:00');
        endDate = new Date(this.form.value.endDate + '-12-31 23:59:59');
      }
      this.tableData = this.generateDataModel(moment(startDate).format('YYYY-MM-DD HH:mm:ss'), moment(endDate).format('YYYY-MM-DD HH:mm:ss'), interval);
      let aggr = this.form.value.aggr == 'SUM' ? ['SUM'] : ['MIN', 'MAX', 'AVG'];

      if (this.reportLabel == 'molding') {
        this.recursiveDataFetching(aggr, 0, {
          startDate: startDate,
          endDate: endDate,
          interval: interval
        }, keys.join(','), []);
      } else {
        this.recursiveEnergyDataFetching(['SUM', 'MIN', 'MAX', 'AVG'], 0, {
          startDate: startDate,
          endDate: endDate,
          interval: interval
        }, keys.join(','), []);
      }
    }
  }

  generateTableMetaData() {
    this.displayedColumns = [];
    this.tableColumn = [...[{key: 'date', title: 'Date'}]];
    if (this.reportLabel == 'molding') {
      if (this.form.value.aggr == 'SUM') {
        this.form.value.aggField.forEach((field: any) => {
          this.tableColumn.push(field)
        });
      } else {
        this.form.value.aggField.forEach((field: any) => {
          this.tableColumn.push({key: 'min_' + field.key, title: 'Min. ' + field.title});
          this.tableColumn.push({key: 'max_' + field.key, title: 'Max. ' + field.title});
          this.tableColumn.push({key: 'avg_' + field.key, title: 'Avg. ' + field.title});
        });
      }
    } else {
      this.form.value.aggField.forEach((field: any) => {
        if (field.key == 'delta_kWh_I') {
          this.tableColumn.push({key: field.key, title: field.title});
        } else {
          this.tableColumn.push({key: 'min_' + field.key, title: 'Min. ' + field.title});
          this.tableColumn.push({key: 'max_' + field.key, title: 'Max. ' + field.title});
          this.tableColumn.push({key: 'avg_' + field.key, title: 'Avg. ' + field.title});
        }
      });
    }
    this.tableColumn.forEach((column: any) => {
      this.displayedColumns.push(column.key);
    });
  }

  recursiveDataFetching(aggrs: string[], index: number, timeData: any, keys: string, fetchedData: any[]) {
    if (aggrs.length > index) {
      this.deviceService.getTelemetryData(this.form.value.devices.id.id, keys, timeData.startDate.getTime(), timeData.endDate.getTime(), timeData.interval, aggrs[index]).subscribe({
        next: data => {
          fetchedData.push(data);
          Object.keys(data).forEach(key => {
            data[key].forEach((tsv: any) => {
              let indx = this.tableData.findIndex((tbdt: any) => tbdt.date == moment(new Date(tsv.ts)).format(this.form.value.reportType == 'Hourly' ? 'YYYY-MM-DD hh:00 A' : this.form.value.reportType == 'Daily' ? 'YYYY-MM-DD' : this.form.value.reportType == 'Monthly' ? 'YYYY-MMM' : 'YYYY'));
              if (indx >= 0) {
                const newKey = aggrs[index] == 'SUM' ? key : aggrs[index].toLowerCase() + '_' + key;
                this.tableData[indx][newKey] = Number(Number(tsv.value).toFixed(2));
              }
            });
          });
          this.recursiveDataFetching(aggrs, index + 1, timeData, keys, fetchedData);
        }
      });
    } else {
      this.cdr.detectChanges();
      this.initiateChart();
    }
  }

  recursiveEnergyDataFetching(aggrs: string[], index: number, timeData: any, keys: string, fetchedData: any[]) {
    if (aggrs.length > index) {
      this.deviceService.getTelemetryData(this.form.value.devices.id.id, keys, timeData.startDate.getTime(), timeData.endDate.getTime(), timeData.interval, aggrs[index]).subscribe({
        next: data => {
          Object.keys(data).forEach(key => {
            data[key].forEach((tsv: any) => {
              let indx = this.tableData.findIndex((tbdt: any) => tbdt.date == moment(new Date(tsv.ts)).format(this.form.value.reportType == 'Hourly' ? 'YYYY-MM-DD hh:00 A' : this.form.value.reportType == 'Daily' ? 'YYYY-MM-DD' : this.form.value.reportType == 'Monthly' ? 'YYYY-MMM' : 'YYYY'));
              if (indx >= 0) {
                const newKey = aggrs[index] == 'SUM' ? key : aggrs[index].toLowerCase() + '_' + key;
                if (key == 'delta_kWh_I') {
                  if (aggrs[index] == 'SUM') {
                    this.tableData[indx][newKey] = Number(Number(tsv.value).toFixed(2));
                  }
                } else {
                  if (aggrs[index] != 'SUM') {
                    this.tableData[indx][newKey] = Number(Number(tsv.value).toFixed(2));
                  }
                }
              }
            });
          });
          this.recursiveEnergyDataFetching(aggrs, index + 1, timeData, keys, fetchedData);
        }
      });
    } else {
      this.cdr.detectChanges();
      this.initiateChart();
    }
  }

  initiateChart() {
    let cColor: string[] = [];
    const cLabel = this.tableData.map((obj: any) => {
      return obj.date;
    });
    let chartData: ChartData = {
      labels: cLabel,
      datasets: []
    };
    if (this.reportLabel == 'molding') {
      if (this.form.value.aggr == 'SUM') {
        this.form.value.aggField.forEach((field: any) => {
          const color = this.randomColor();
          let obj: any = {label: field.title, data: [], backgroundColor: color, borderWidth: 1, borderColor: color};
          obj.data = this.tableData.map((dt: any) => {
            return dt[field.key];
          });
          chartData.datasets.push(obj);
        })
      } else {
        ['Min', 'Max', 'Avg'].forEach(aggr => {
          this.form.value.aggField.forEach((field: any) => {
            const color = this.randomColor();
            let obj: any = {
              label: aggr + '. ' + field.title,
              data: [],
              backgroundColor: color,
              borderWidth: 1,
              borderColor: color
            };
            obj.data = this.tableData.map((dt: any) => {
              return dt[aggr.toLowerCase() + '_' + field.key];
            });
            chartData.datasets.push(obj);
          })
        })
      }
    } else {
      Object.keys(this.tableData[0]).forEach(key => {
        if (key != 'date') {
          const column = this.tableColumn.filter(tbc => tbc.key == key);
          const color = this.randomColor();
          let obj: any = {
            label: column[0].title,
            data: [],
            backgroundColor: color,
            borderWidth: 1,
            borderColor: color
          };
          obj.data = this.tableData.map((dt: any) => {
            return dt[key];
          });
          chartData.datasets.push(obj);
        }
      });
    }
    this.consumptionChart('reportChart', chartData, 'line');
  }

  randomColor(): string {
    // Generate random values for red, green, and blue components
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Construct the CSS color string
    return `rgb(${red},${green},${blue})`;
  }

  generateDataModel(startDate: string, endDate: string, interval: number) {
    let data = [];
    for (let i = new Date(startDate); i <= new Date(endDate);) {
      let obj: any = {date: moment(i).format(this.form.value.reportType == 'Hourly' ? 'YYYY-MM-DD hh:00 A' : this.form.value.reportType == 'Daily' ? 'YYYY-MM-DD' : this.form.value.reportType == 'Monthly' ? 'YYYY-MMM' : 'YYYY')};
      if (this.reportLabel == 'molding') {
        if (this.form.value.aggr == 'SUM') {
          this.form.value.aggField.forEach((field: any) => {
            obj[field.key] = 0;
          });
        } else {
          this.form.value.aggField.forEach((field: any) => {
            obj['min_' + field.key] = 0;
            obj['max_' + field.key] = 0;
            obj['avg_' + field.key] = 0;
          });
        }
      } else {
        this.form.value.aggField.forEach((field: any) => {
          if (field.key == 'delta_kWh_I') {
            obj[field.key] = 0;
          } else {
            obj['min_' + field.key] = 0;
            obj['max_' + field.key] = 0;
            obj['avg_' + field.key] = 0;
          }
        });
      }
      data.push(obj);
      switch (this.form.value.reportType) {
        case 'Hourly':
          i.setHours(i.getHours() + 1);
          break;
        case 'Daily':
          i.setDate(i.getDate() + 1);
          break;
        case 'Monthly':
          i.setMonth(i.getMonth() + 1);
          break;
        default:
          i.setFullYear(i.getFullYear() + 1);
      }
    }
    return data;
  }

  selectedPicker($event: any, id: string, dp: any, pos: string, format: string) {
    // @ts-ignore
    this.form.get(id).setValue(moment($event).format(format));
    $('#' + id).val(moment($event).format(format));
    dp.close();
  }

  changeRouteParam(text: string) {
    this.resetForm();
    this.tableData = undefined;
    this.chart = {};
    const queryParams = {type: text};

    // Navigate to the current URL with the added query parameters
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge' // merge with existing query parameters
    });
  }

  private resetForm() {
    this.form = this.fb.group({
      reportType: ['Daily', [Validators.required]],
      startDate: ['', [Validators.required]],
      startTime: [''],
      endDate: [new Date(), [Validators.required]],
      endTime: [moment().format('HH:mm')],
      devices: ['', [Validators.required]],
      aggr: ['SUM', [Validators.required]],
      aggField: ['', [Validators.required]]
    });
  }

  consumptionChart(id: string, data: ChartData, chartType: string = 'bar') {
    if (this.chart[id] != undefined) {
      this.chart[id].data = data;
      this.chart[id].update();
    } else {
      this.chart[id] = new Chart(id, {
        type: chartType == 'bar' ? 'bar' : 'line',
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

  ngOnDestroy(): void {
    this.chart={};
    this.tableData=undefined;
  }

  exportData() {
    const fields = Object.keys(this.tableData[0]);
    let csv = this.tableData.map((row: any) => fields.map(field => row[field]).join(',')).join('\n');
    const csvData = ['device',this.form.value.devices.label||this.form.value.devices.name].join(',')+'\n\n'+fields.join(',') + '\n' + csv;
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', this.reportLabel + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
