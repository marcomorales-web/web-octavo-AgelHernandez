import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService } from '../../datos/datos.taller';




@Component({
  selector: 'app-reportar-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportar.component.html',
  styleUrl: './reportar.component.css',
})

export class ReportarComponent {
  private taller = inject(TallerService);
  vehiculos = this.taller.vehiculos;
  enviado = signal(false);
  form = { vehiculoId: '', zona: '', descripcion: '' };
  zonas = ['Motor','Frenos','Suspensión','Carrocería / Golpes','Interior','Eléctrico','Llantas','Otro'];

  enviar() {
    this.enviado.set(true);
    this.form = { vehiculoId: '', zona: '', descripcion: '' };
    setTimeout(() => this.enviado.set(false), 3000);
  }
  valido() { return !!this.form.vehiculoId && !!this.form.descripcion; }
}
