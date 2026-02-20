import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { FormComponent } from './auth/form.component';
import { RecoverComponent } from './auth/recover.component';
import { DashboardComponent } from './Dashboard/Cliente/dashboard.component';
import { DashboardComponent as AdminDashboard } from './Dashboard/Admin/admin.component';
import { ResumenComponent } from './acciones/Resumen/resumen.component';
import { ServiciosComponent } from './acciones/Servicios/servicios.component';
import { CalendarioComponent } from './acciones/Calendario/calendario.component';
import { InventarioComponent } from './acciones/Inventario/inventario.component';
import { AnalisisComponent } from './acciones/Analisis/analisis.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'form', component: FormComponent },
  { path: 'recover', component: RecoverComponent },
  {path: 'dashboard', component: DashboardComponent},
  {path: 'admin', component: AdminDashboard,
    children: [
      { path: 'resumen', component: ResumenComponent },
      { path: 'servicios', component: ServiciosComponent },
      { path: 'calendario', component: CalendarioComponent },
      { path: 'inventario', component: InventarioComponent },
      { path: 'analisis', component: AnalisisComponent },
      { path: '', redirectTo: 'resumen', pathMatch: 'full' },
    ]
  },
];
