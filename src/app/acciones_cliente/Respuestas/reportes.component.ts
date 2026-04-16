import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NgApexchartsModule,
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexNonAxisChartSeries,
} from 'ng-apexcharts';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent {
  private taller = inject(TallerService);

  totalVehiculos = computed(() => this.taller.vehiculos().length);
  totalServicios = computed(
    () => this.taller.historial().filter((s) => s.estado === 'completado').length,
  );
  totalGastado = computed(() => this.taller.historial().reduce((a, s) => a + s.costo, 0));
  citasPendientes = computed(
    () => this.taller.citas().filter((c) => c.estado === 'pendiente').length,
  );

  barChart: ApexChart = { type: 'bar', height: 220, toolbar: { show: false } };
  barSeries: ApexAxisChartSeries = [{ name: 'Gasto ($)', data: [580, 1200, 2400, 0, 0, 0] }];
  barXAxis: ApexXAxis = { categories: ['Feb', 'Ene', 'Abr', 'May', 'Jun', 'Jul'] };

  pieChart: ApexChart = { type: 'donut', height: 220 };
  pieSeries: ApexNonAxisChartSeries = [580, 1200, 2400];
  pieLabels = ['Aceite', 'Afinación', 'Frenos'];
}
