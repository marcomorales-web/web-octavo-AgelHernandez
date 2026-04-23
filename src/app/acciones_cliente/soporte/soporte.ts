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

}
