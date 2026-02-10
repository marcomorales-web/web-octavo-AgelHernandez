import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent {
  correo: string = '';
  pass: string = '';

  loading = false;
  error = false;

  constructor(private router: Router) {}
  async login() {
    this.error = false;
    this.loading = true;

    //sim_login
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (this.correo === 'admin@gmail.com' && this.pass === '1234') {
      this.router.navigate(['dashboard']);
    } else {
      this.error = true; 
    }

    this.loading = false;
  }

  goRegister() {
    this.router.navigate(['form']);
  }
  goRecover() {
    this.router.navigate(['recover']);
  }
  goDashboard() {
    this.router.navigate(['dashboard']);
  }
}
