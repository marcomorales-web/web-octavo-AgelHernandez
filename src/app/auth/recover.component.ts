import { Component, signal, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class RecoverComponent {
  private router = inject(Router);

  form = { nombre: '', correo: '', telefono: '' };
  enviado = signal(false);
  error = signal('');

  enviar() {
    this.error.set('');
    if (!this.form.nombre.trim() || !this.form.correo.trim()) {
      this.error.set('Completa nombre y correo para continuar.');
      return;
    }
    this.enviado.set(true);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
