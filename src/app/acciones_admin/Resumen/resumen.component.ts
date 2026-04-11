import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule, ApexChart, ApexAxisChartSeries,
  ApexXAxis, ApexNonAxisChartSeries, ApexPlotOptions} from 'ng-apexcharts';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.css',
})
export class ResumenComponent {
  private taller = inject(TallerService);

  // Stats conectados al servicio
  ingresosMes      = this.taller.ingresosMes;
  serviciosActivos = this.taller.serviciosActivos;
  citasPendientes  = this.taller.citasPendientes;
  totalVehiculos   = () => this.taller.vehiculos().length;

  // Gráfica de ingresos mensuales (barras)
  barChart: ApexChart = { type: 'bar', height: 260, toolbar: { show: false }, fontFamily: 'Courier New, monospace' };
  barSeries: ApexAxisChartSeries = [{ name: 'Ingresos ($)', data: [15000, 18000, 20000, 22000, 19000, 25000] }];
  barXAxis: ApexXAxis = { categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'] };
  barColors: string[] = ['#2E5F8A'];
  barPlot: ApexPlotOptions = { bar: { borderRadius: 4, columnWidth: '55%' } };

  // Gráfica distribución de servicios (donut)
  pieChart: ApexChart = { type: 'donut', height: 260, fontFamily: 'Courier New, monospace' };
  pieSeries: ApexNonAxisChartSeries = [44, 33, 23];
  pieLabels = ['Mantenimiento', 'Reparación', 'Diagnóstico'];
  pieColors: string[] = ['#2E5F8A', '#C0392B', '#C9A84C'];
}
