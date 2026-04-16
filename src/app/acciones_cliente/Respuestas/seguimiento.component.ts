import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-seguimiento.component',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './seguimiento.component.html',
  styleUrl: './seguimiento.component.css',
})
export class SeguimientoComponent {
  private taller = inject(TallerService);
  vehiculos = this.taller.vehiculos;
  historial = this.taller.historial;
  get servicioActivo() {
    return this.historial().find((s) => s.estado === 'activo');
  }
}
