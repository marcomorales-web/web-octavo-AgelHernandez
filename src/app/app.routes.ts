import { Routes } from '@angular/router';
import { LoginComponent }   from './auth/login.component';
import { FormComponent }    from './auth/form.component';
import { RecoverComponent } from './auth/recover.component';

import { DashboardComponent }        from './Dashboard/Cliente/dashboard.component';
import { VehiculoComponent }         from './acciones_cliente/vehiculos/vehiculo.component';
import { ServiciosClienteComponent } from './acciones_cliente/servicios_Cliente/servicios_cliente.component';
import { AgendarCitaComponent }      from './acciones_cliente/servicios_Cliente/agendar_cita.component';
import { CotizacionComponent }       from './acciones_cliente/servicios_Cliente/cotizacion.component';
import { ReportarComponent }         from './acciones_cliente/servicios_Cliente/reportar.component';
import { SeguimientoComponent }      from './acciones_cliente/Respuestas/seguimiento.component';
import { HistorialComponent }        from './acciones_cliente/Respuestas/historial.component';
import { ProgresoComponent }         from './acciones_cliente/Respuestas/progreso.component';
import { ReportesComponent }         from './acciones_cliente/Respuestas/reportes.component';
import { SoporteComponent }          from './acciones_cliente/soporte/soporte';

import { DashboardComponent as AdminDashboard } from './Dashboard/Admin/admin.component';
import { ResumenComponent }       from './acciones_admin/Resumen/resumen.component';
import { ServiciosComponent }     from './acciones_admin/Servicios/servicios.component';
import { CalendarioComponent }    from './acciones_admin/Calendario/calendario.component';
import { InventarioComponent }    from './acciones_admin/Inventario/inventario.component';
import { AnalisisComponent }      from './acciones_admin/Analisis/analisis.component';
import { SoporteAdminComponent }  from './acciones_admin/Soporte/soporte-admin';

import { clienteGuard, adminGuard } from '../guard/auth.guard';

export const routes: Routes = [
  { path: '',        redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',   component: LoginComponent   },
  { path: 'form',    component: FormComponent    },
  { path: 'recover', component: RecoverComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [clienteGuard],
    children: [
      { path: '', component: VehiculoComponent },
      {
        path: 'Servicios',
        component: ServiciosClienteComponent,
        children: [
          { path: 'citas',      component: AgendarCitaComponent },
          { path: 'cotizacion', component: CotizacionComponent  },
          { path: 'reporte',    component: ReportarComponent    },
          { path: '', redirectTo: 'citas', pathMatch: 'full'    },
        ],
      },
      {
        path: 'Seguimiento',
        component: SeguimientoComponent,
        children: [
          { path: 'historial', component: HistorialComponent },
          { path: 'progreso',  component: ProgresoComponent  },
          { path: 'reportes',  component: ReportesComponent  },
          { path: '', redirectTo: 'progreso', pathMatch: 'full' },
        ],
      },
      { path: 'soporte', component: SoporteComponent },
    ],
  },

  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [adminGuard],
    children: [
      { path: 'resumen',    component: ResumenComponent      },
      { path: 'servicios',  component: ServiciosComponent    },
      { path: 'calendario', component: CalendarioComponent   },
      { path: 'inventario', component: InventarioComponent   },
      { path: 'analisis',   component: AnalisisComponent     },
      { path: 'soporte',    component: SoporteAdminComponent },
      { path: '', redirectTo: 'resumen', pathMatch: 'full'   },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
