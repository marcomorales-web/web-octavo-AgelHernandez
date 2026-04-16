import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-cotizacion.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cotizacion.component.html',
  styleUrl: './cotizacion.component.css',
})
export class CotizacionComponent {
  private taller = inject(TallerService);
  vehiculos = this.taller.vehiculos;
  enviado = signal(false);
  form = { vehiculoId: '', descripcion: '', urgencia: 'normal' };

  enviar() {
    console.log('Cotización enviada:', this.form);
    this.enviado.set(true);
    this.form = { vehiculoId: '', descripcion: '', urgencia: 'normal' };
    setTimeout(() => this.enviado.set(false), 3000);
  }
  valido() {
    return !!this.form.vehiculoId && !!this.form.descripcion;
  }
}
