import { Component, inject } from '@angular/core';
import { Router, RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  nombre = this.auth.nombre;
  email = this.auth.email; // ← nuevo: exponer email para el perfil

  cerrarSesion() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
