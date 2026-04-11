import { Component, inject } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, MatTabsModule],
  templateUrl: '../Admin/admin.component.html',
  styleUrls: ['../Admin/admin.component.css'],
})
export class DashboardComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  nombre = this.auth.nombre;

  goLogin() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
