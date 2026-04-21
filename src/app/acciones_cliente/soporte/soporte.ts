import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService, MensajeSoporte } from '../../datos/datos.taller';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-soporte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './soporte.html',
  styleUrl: './soporte.css',
})
export class SoporteComponent {
  private taller = inject(TallerService);
  private auth = inject(AuthService);

  nombre = this.auth.nombre;
  email = this.auth.email;

  form = { asunto: '', mensaje: '' };
  enviado = signal(false);
  error = signal('');

  /** Mensajes del cliente actual, incluyendo las respuestas del admin */
  misConversaciones = computed(() =>
    this.taller.mensajesSoporte().filter((m) => m.clienteEmail === this.email()),
  );

  enviar() {
    this.error.set('');

    if (!this.form.asunto.trim()) {
      this.error.set('Escribe un asunto para tu mensaje.');
      return;
    }
    if (this.form.mensaje.trim().length < 10) {
      this.error.set('El mensaje debe tener al menos 10 caracteres.');
      return;
    }

    const msg: MensajeSoporte = {
      id: `msg-${Date.now()}`,
      clienteNombre: this.nombre(),
      clienteEmail: this.email(),
      asunto: this.form.asunto.trim(),
      mensaje: this.form.mensaje.trim(),
      fecha: new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    this.taller.enviarMensajeSoporte(msg);
    this.form = { asunto: '', mensaje: '' };
    this.enviado.set(true);
    setTimeout(() => this.enviado.set(false), 5000);
  }

  valido() {
    return this.form.asunto.trim().length > 0 && this.form.mensaje.trim().length >= 10;
  }
}
