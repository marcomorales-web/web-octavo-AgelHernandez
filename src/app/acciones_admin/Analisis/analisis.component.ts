import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule, ApexChart, ApexAxisChartSeries,
  ApexXAxis, ApexNonAxisChartSeries, ApexPlotOptions, ApexYAxis
} from 'ng-apexcharts';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-analisis',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './analisis.component.html',
  styleUrl: './analisis.component.css',
})
export class AnalisisComponent {
  private taller = inject(TallerService);

  // 
  ingresosMes   = this.taller.ingresosMes;
  stockBajo     = this.taller.stockBajo;
  serviciosAct  = this.taller.serviciosActivos;
  satisfaccion  = '4.7';

  totalVehiculos = computed(() => this.taller.vehiculos().length);

  // Gráfica de ingresos por mes (line) Apexcharts
  lineChart: ApexChart = { type: 'line', height: 240, toolbar: { show: false }, fontFamily: 'Courier New, monospace' };
  lineSeries: ApexAxisChartSeries = [
    { name: 'Ingresos', data: [15000, 18000, 25000, 22000, 19000, 25000] },
    { name: 'Meta',     data: [18000, 18000, 20000, 20000, 22000, 22000] },
  ];
  lineXAxis: ApexXAxis  = { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] };
  lineYAxis: ApexYAxis  = { labels: { formatter: (v: number) => `$${(v/1000).toFixed(0)}k` } };
  lineColors: string[] = ['#2E5F8A', '#C9A84C'];

  // Servicios por categoría (bar horizontal)
  hbarChart: ApexChart = { type: 'bar', height: 200, toolbar: { show: false }, fontFamily: 'Courier New, monospace' };
  hbarSeries: ApexAxisChartSeries = [{ name: 'Servicios', data: [12, 8, 6, 5, 4, 3] }];
  hbarXAxis: ApexXAxis = { categories: ['Mantenimiento', 'Frenos', 'Afinación', 'Eléctrico', 'Suspensión', 'Carrocería'] };
  hbarPlot: ApexPlotOptions = { bar: { horizontal: true, borderRadius: 3 } };
  hbarColors: string[] = ['#C0392B'];



  // Citas por día de semana (área)
  areaChart: ApexChart = { type: 'area', height: 180, toolbar: { show: false }, fontFamily: 'Courier New, monospace' };
  areaSeries: ApexAxisChartSeries = [{ name: 'Citas', data: [3, 5, 8, 6, 7, 4, 2] }];
  areaXAxis: ApexXAxis = { categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'] };
  areaColors: string[] = ['#C9A84C'];
}
