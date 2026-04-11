import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService, Servicio } from '../../datos/datos.taller';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css',
})
export class ServiciosComponent {
  private taller = inject(TallerService);

  historial    = this.taller.historial;
  filtro       = signal<'todos' | 'activo' | 'completado'>('todos');
  busqueda     = signal('');
  modalAbierto = signal(false);
  servicioSel  = signal<Servicio | null>(null);

  serviciosFiltrados = computed(() => {
    const f = this.filtro();
    const q = this.busqueda().toLowerCase();
    return this.historial().filter(s =>
      (f === 'todos' || s.estado === f) &&
      (s.nombre.toLowerCase().includes(q) || s.vehiculoNombre.toLowerCase().includes(q) || (s.cliente ?? '').toLowerCase().includes(q))
    );
  });

  pendientes  = computed(() => this.historial().filter(s => s.estado === 'activo').length);
  completados = computed(() => this.historial().filter(s => s.estado === 'completado').length);
  ingresos    = computed(() => this.historial().filter(s => s.estado === 'completado').reduce((a, s) => a + s.costo, 0));

  abrirDetalle(s: Servicio) { this.servicioSel.set(s); this.modalAbierto.set(true); }
  cerrar()                  { this.modalAbierto.set(false); this.servicioSel.set(null); }

  avanzarProgreso(s: Servicio) {
    if (s.progreso >= 5) return;
    const actualizado: Servicio = {
      ...s,
      progreso: s.progreso + 1,
      estado: s.progreso + 1 >= 5 ? 'completado' : 'activo',
    };
    this.taller.historial.update(l => l.map(x => x.id === s.id ? actualizado : x));
    this.servicioSel.set(actualizado);
  }

  readonly pasos = ['Recibido', 'Diagnóstico', 'Reparación', 'Control calidad', 'Listo'];
}
