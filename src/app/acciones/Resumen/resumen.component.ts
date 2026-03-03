import { Component } from '@angular/core';
import {NgApexchartsModule,ApexAxisChartSeries,ApexChart,ApexXAxis,
        ApexTitleSubtitle,ApexNonAxisChartSeries} from "ng-apexcharts";

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css',
})
export class ResumenComponent {

  public lineChartTitle: ApexTitleSubtitle = {
    text: "Ingresos Mensuales"
  };


  public lineChart: ApexChart = {
    type: "line",
    height: 300
  };

  public lineChartXAxis: ApexXAxis = {
    categories: ["Ene","Feb","Mar","Abr","May","Jun"]
  };

  public lineChartSeries: ApexAxisChartSeries = [
    {
      name: "Ingresos",
      data: [15000, 18000, 20000, 22000, 19000, 25000]
    }
  ];


  //distribucion de servicios
  public pieChartSeries: ApexNonAxisChartSeries = [44, 33, 23];

  public pieChart: ApexChart = {
    type: "pie",
    height: 300
  };

  public pieChartLabels: string[] = [
    "Mantenimiento",
    "Reparación",
    "Diagnóstico"
  ];


}
