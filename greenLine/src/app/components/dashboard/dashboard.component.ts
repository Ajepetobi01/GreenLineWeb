import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import * as ApexCharts from 'apexcharts';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexChart,
  ApexXAxis,
  ChartComponent,
} from 'ng-apexcharts';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [],
})
export class DashboardComponent implements OnInit {
  chart: any;
  options: any;
  pieLabels: any = [];
  pieData: any = [];
  terrorismSeries: any = [];
  narcoticsSeries: any = [];
  smugglingSeries: any = [];
  IllegalImmigrationSeries: any = [];
  revenueSeries: any = [];

  constructor(private http: HttpClient, private nzNotify: NzMessageService) {
    this.options = {
      chart: {
        height: 350,
        type: 'radar',
      },
      dataLabels: {
        enabled: false,
      },
      series: [],
      title: {
        text: 'Risk Chart',
      },
      noData: {
        text: 'Loading...',
      },
    };

    setTimeout(() => {
      this.chart = new ApexCharts(
        document.querySelector('#chart'),
        this.options
      );
      this.chart.render();
    }, 500);
  }

  ngOnInit(): void {
    this.LoadData();
  }
  LoadData() {
    this.http.get(`${environment.baseUrl}FlightStat`).subscribe((res: any) => {
      console.log(res);
      if (res.data) {
        var series: any = [];

        res.data.reportList.forEach((x: any) => {
          this.pieLabels.push(x.flightName);
          this.terrorismSeries.push(parseInt(x.datePoints[1]));
          this.narcoticsSeries.push(parseInt(x.datePoints[2]));
          this.smugglingSeries.push(parseInt(x.datePoints[0]));
          this.IllegalImmigrationSeries.push(parseInt(x.datePoints[3]));
          this.revenueSeries.push(parseInt(x.datePoints[4]));
          series.push({
            name: x.flightName,
            data: x.datePoints,
          });
        });
        this.chart.updateOptions({
          chart: {
            height: 350,
            type: 'radar',
          },
          dataLabels: {
            enabled: false,
          },
          series: series,
          title: {
            text: 'Risk Chart',
          },
          noData: {
            text: 'Loading...',
          },
          xaxis: {
            categories: res.data.categories,
          },
        });
      } else {
        this.nzNotify.error(res.message);
      }
    });
  }
  updatePieChart(x: string) {
    if ((x = 'terrorism')) {
      this.pieData = this.terrorismSeries;
    }
    if ((x = 'narcotics')) {
      this.pieData = this.narcoticsSeries;
    }
    if ((x = 'revenue')) {
      this.pieData = this.revenueSeries;
    }
    if ((x = 'illegal')) {
      this.pieData = this.IllegalImmigrationSeries;
    }
    if ((x = 'smuggling')) {
      this.pieData = this.smugglingSeries;
    }
    var options = {
      series: [44, 55, 13, 43, 22],
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
    setTimeout(() => {
      var pieChart = new ApexCharts(
        document.querySelector('#pieChart'),
        options
      );
      pieChart.render();
      pieChart.updateOptions({
        series: this.pieData,
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: this.pieLabels,
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: 'bottom',
              },
            },
          },
        ],
      });
    }, 500);
  }
}
