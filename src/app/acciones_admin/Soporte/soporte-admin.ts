import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService, MensajeSoporte } from '../../datos/datos.taller';

@Component({
  selector: 'app-soporte-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte-admin.html',
  styleUrl: './soporte-admin.css',
})
export class SoporteAdminComponent {
  taller = inject(TallerService);

  mensajes            = this.taller.mensajesSoporte;
  msgSeleccionado     = signal<MensajeSoporte | null>(null);
  textoRespuesta      = '';
  guardado            = signal(false);

  abrir(m: MensajeSoporte) {
    this.msgSeleccionado.set(m);
    this.textoRespuesta = m.respuesta ?? '';
    this.guardado.set(false);
  }

  cerrar() {
    this.msgSeleccionado.set(null);
    this.textoRespuesta = '';
    this.guardado.set(false);
  }

  guardarRespuesta() {
    const m = this.msgSeleccionado();
    if (!m || !this.textoRespuesta.trim()) return;

    this.taller.responderMensaje(m.id, this.textoRespuesta.trim());
    this.guardado.set(true);

    // Actualizar el mensaje seleccionado con la respuesta recién guardada
    const actualizado = this.mensajes().find(x => x.id === m.id);
    if (actualizado) this.msgSeleccionado.set({ ...actualizado });
  }

  tieneRespuesta(m: MensajeSoporte) { return !!m.respuesta; }
}
