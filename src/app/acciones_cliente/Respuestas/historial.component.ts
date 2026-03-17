import { Component, inject, signal, computed} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService } from '../../datos/datos.taller';


@Component({
  selector: 'app-historial.component',
  imports: [CommonModule, FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css',
})
export class HistorialComponent {
  private taller = inject(TallerService);
  vehiculos = this.taller.vehiculos;
  vehiculoId = signal(this.taller.vehiculos()[0]?.id ?? '');

  historialVehiculo = computed(() =>
    this.taller.historial().filter(s => s.vehiculoId === this.vehiculoId() && s.estado === 'completado')
  );
  totalGastado = computed(() => this.historialVehiculo().reduce((a, s) => a + s.costo, 0));
}
