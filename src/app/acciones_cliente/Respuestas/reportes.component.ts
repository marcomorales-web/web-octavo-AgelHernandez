import { Component, inject, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TallerService } from '../../datos/datos.taller';


@Component({
  selector: 'app_reportes-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css',
})
export class ReportesComponent {
  private taller = inject(TallerService);

  totalVehiculos = computed(() => this.taller.vehiculos().length);
  totalServicios = computed(() => this.taller.historial().filter(s => s.estado === 'completado').length);
  totalGastado = computed(() => this.taller.historial().reduce((a, s) => a + s.costo, 0));
  citasPendientes = computed(() => this.taller.citas().filter(c => c.estado === 'pendiente').length);
}
