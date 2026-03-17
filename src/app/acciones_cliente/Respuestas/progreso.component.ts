import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app_progreso-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './progreso.component.html',
  styleUrl: './progreso.component.css',
})
export class ProgresoComponent {
  private taller = inject(TallerService);
  vehiculos = this.taller.vehiculos;
  historial = this.taller.historial;

  vehiculoId = signal(
    this.taller.vehiculos().find(v => v.estado === 'service')?.id ?? this.taller.vehiculos()[0]?.id ?? ''
  );

  servicioActivo = computed(() =>
    this.historial().find(s => s.vehiculoId === this.vehiculoId() && s.estado === 'activo')
  );

  readonly pasos = ['Recibido','Diagnóstico','Reparación','Control de calidad','Listo'];

  getEstado(i: number, progreso: number): 'done' | 'active' | 'todo' {
    if (i + 1 < progreso) return 'done';
    if (i + 1 === progreso) return 'active';
    return 'todo';
  }

  getPct(p: number) { return Math.round(((p - 1) / (this.pasos.length - 1)) * 100); }
}