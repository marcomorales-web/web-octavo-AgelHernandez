import { Component, signal, inject, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  correo = '';
  pass = '';
  loading = signal(false);
  error = signal(false);
  mostrarPass = signal(false);

  async login() {
    this.error.set(false);
    this.loading.set(true);
    await new Promise((r) => setTimeout(r, 800));

    const ok = this.auth.login(this.correo.trim().toLowerCase(), this.pass);
    if (ok) {
      this.router.navigate([this.auth.role() === 'admin' ? '/admin' : '/dashboard']);
    } else {
      this.error.set(true);
    }
    this.loading.set(false);
  }

  goRegister() {
    this.router.navigate(['/form']);
  }
  goRecover() {
    this.router.navigate(['/recover']);
  }
}
