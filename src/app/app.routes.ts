import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { FormComponent } from './auth/form.component';
import { RecoverComponent } from './auth/recover.component';
import { DashboardComponent } from './Dashboard/Cliente/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'form', component: FormComponent },
  { path: 'recover', component: RecoverComponent },
  {path: 'dashboard', component: DashboardComponent}
];
