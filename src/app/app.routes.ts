import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { FormComponent } from './auth/form.component';
import { RecoverComponent } from './auth/recover.component';

import { DashboardComponent } from './Dashboard/Cliente/dashboard.component';
import { HeaderComponent } from './Dashboard/Cliente/header.component';
import { SidebarComponent } from './Dashboard/Cliente/sidebar.component';

import { VehiculoComponent } from './acciones_cliente/vehiculos/vehiculo.component';
import { ServiciosClienteComponent } from './acciones_cliente/servicios_Cliente/servicios_cliente.component';
import { AgendarCitaComponent } from './acciones_cliente/servicios_Cliente/agendar_cita.component';
import { CotizacionComponent } from './acciones_cliente/servicios_Cliente/cotizacion.component';
import { ReportarComponent } from './acciones_cliente/servicios_Cliente/reportar.component';

import { SeguimientoComponent } from './acciones_cliente/Respuestas/seguimiento.component';
import { HistorialComponent } from './acciones_cliente/Respuestas/historial.component';
import { ProgresoComponent } from './acciones_cliente/Respuestas/progreso.component';
import { ReportesComponent } from './acciones_cliente/Respuestas/reportes.component';



import { DashboardComponent as AdminDashboard } from './Dashboard/Admin/admin.component';
import { ResumenComponent } from './acciones_admin/Resumen/resumen.component';
import { ServiciosComponent } from './acciones_admin/Servicios/servicios.component';
import { CalendarioComponent } from './acciones_admin/Calendario/calendario.component';
import { InventarioComponent } from './acciones_admin/Inventario/inventario.component';
import { AnalisisComponent } from './acciones_admin/Analisis/analisis.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'form', component: FormComponent },
  { path: 'recover', component: RecoverComponent },


  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: VehiculoComponent },

      {
      path: 'Servicios',
      component: ServiciosClienteComponent,
      children: [

        { path: 'citas', component: AgendarCitaComponent },

        { path: 'cotizacion', component: CotizacionComponent },

        { path: 'reporte', component: ReportarComponent },

        { path: '', redirectTo: 'citas', pathMatch: 'full' }

      ]
    },

      {
      path: 'Seguimiento',
      component: SeguimientoComponent,
      children: [

        { path: 'historial', component: HistorialComponent },

        { path: 'progreso', component: ProgresoComponent },

        { path: 'reportes', component: ReportesComponent },

        { path: '', redirectTo: 'progreso', pathMatch: 'full' }

      ]
    },
      

    ]
  },




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
