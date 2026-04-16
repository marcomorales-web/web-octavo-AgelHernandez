import { Component, signal, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FormComponent {
  private router = inject(Router);

  // Campos del formulario 
  form = {
    nombre:    '',
    correo:    '',
    telefono:  '',
    password:  '',
    confirmar: '',
  };

  // Estado del componente
  enviado  = signal(false);
  error    = signal('');
  mostrarPass = signal(false);

  registrar() {
    this.error.set('');

    // Validaciones básicas
    const { nombre, correo, telefono, password, confirmar } = this.form;

    if (!nombre.trim()) {
      this.error.set('El nombre es obligatorio.');
      return;
    }
    if (!correo.trim() || !correo.includes('@')) {
      this.error.set('Ingresa un correo electrónico válido.');
      return;
    }
    if (!telefono.trim()) {
      this.error.set('El teléfono es obligatorio.');
      return;
    }
    if (password.length < 4) {
      this.error.set('La contraseña debe tener al menos 4 caracteres.');
      return;
    }
    if (password !== confirmar) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }

    
    this.enviado.set(true);

    // Redirigir al login 
    setTimeout(() => this.goLogin(), 2200);
  }

  goLogin() { this.router.navigate(['/login']); }
}
