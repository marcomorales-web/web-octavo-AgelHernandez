import { Component, inject, signal } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: '../Admin/admin.component.html',
  styleUrls: ['../Admin/admin.component.css'],
})
export class DashboardComponent {
  private router = inject(Router);
  private auth   = inject(AuthService);
  private taller = inject(TallerService);

  nombre              = this.auth.nombre;
  email               = this.auth.email;
  perfilAbierto       = signal(false);
  mensajesSinRespuesta = this.taller.mensajesSinRespuesta;

  togglePerfil() { this.perfilAbierto.update(v => !v); }

  goLogin() {
    this.auth.logout();
    this.perfilAbierto.set(false);
    this.router.navigate(['/login']);
  }
}
