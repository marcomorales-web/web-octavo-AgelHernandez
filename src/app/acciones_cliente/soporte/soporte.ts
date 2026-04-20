import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService, TicketSoporte } from '../../datos/datos.taller';
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
  private auth   = inject(AuthService);

  nombre = this.auth.nombre;
  email  = this.auth.email;

  // Tickets del usuario actual
  misTickets = computed(() =>
    this.taller.tickets().filter(t => t.clienteEmail === this.email())
  );

  // Estado del formulario
  form = { asunto: '', mensaje: '' };
  enviado  = signal(false);
  error    = signal('');

  asuntoOpciones = [
    'Consulta sobre mi servicio',
    'Problema con mi cita',
    'Solicitud de información',
    'Queja o sugerencia',
    'Consulta de garantía',
    'Otro',
  ];

  enviar() {
    this.error.set('');
    if (!this.form.asunto.trim()) { this.error.set('Selecciona un asunto.'); return; }
    if (this.form.mensaje.trim().length < 10) { this.error.set('Describe tu mensaje con al menos 10 caracteres.'); return; }

    const ticket: TicketSoporte = {
      id: `t${Date.now()}`,
      clienteNombre: this.nombre(),
      clienteEmail:  this.email(),
      asunto:  this.form.asunto,
      mensaje: this.form.mensaje.trim(),
      fecha:   new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      estado:  'abierto',
    };

    this.taller.agregarTicket(ticket);
    this.form = { asunto: '', mensaje: '' };
    this.enviado.set(true);
    setTimeout(() => this.enviado.set(false), 4000);
  }

  valido() { return !!this.form.asunto && this.form.mensaje.trim().length >= 10; }
}
