import { Injectable, signal } from '@angular/core';

export interface Vehiculo {
  id: string; make: string; model: string;
  year: number; placa: string; km: number;
  estado: 'ok' | 'service'; proximoEvento: string; vin?: string;
}
export interface Cita {
  id: string; vehiculoId: string; vehiculoNombre: string;
  servicio: string; fecha: Date; hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada'; costo?: number;
}
export interface Servicio {
  id: string; vehiculoId: string; vehiculoNombre: string;
  nombre: string; fecha: string; costo: number;
  estado: 'activo' | 'completado'; progreso: number;
  tecnico?: string; entrega?: string;
}

@Injectable({ providedIn: 'root' })
export class TallerService {
  vehiculos = signal<Vehiculo[]>([
    { id: '1', make: 'Toyota', model: 'Corolla', year: 2019, placa: 'ABC-123-MX', km: 48200, estado: 'ok', proximoEvento: 'Jun 25' },
    { id: '2', make: 'Nissan', model: 'Sentra', year: 2021, placa: 'XYZ-789-MX', km: 22500, estado: 'service', proximoEvento: 'Mar 20' },
  ]);
  citas = signal<Cita[]>([
    { id: '1', vehiculoId: '1', vehiculoNombre: 'Toyota Corolla 2019', servicio: 'Cambio de frenos', fecha: new Date('2026-03-22'), hora: '10:00', estado: 'confirmada' },
    { id: '2', vehiculoId: '2', vehiculoNombre: 'Nissan Sentra 2021', servicio: 'Afinación completa', fecha: new Date('2026-04-05'), hora: '09:00', estado: 'pendiente' },
  ]);
  historial = signal<Servicio[]>([
    { id: '1', vehiculoId: '1', vehiculoNombre: 'Toyota Corolla 2019', nombre: 'Cambio de aceite 5W-30', fecha: '10 Feb 2025', costo: 580, estado: 'completado', progreso: 5 },
    { id: '2', vehiculoId: '1', vehiculoNombre: 'Toyota Corolla 2019', nombre: 'Afinación completa', fecha: '05 Ene 2025', costo: 1200, estado: 'completado', progreso: 5 },
    { id: '3', vehiculoId: '2', vehiculoNombre: 'Nissan Sentra 2021', nombre: 'Frenos y rotores', fecha: 'En taller', costo: 2400, estado: 'activo', progreso: 3, tecnico: 'Ing. Ramírez', entrega: 'Mar 20' },
  ]);
  agregarVehiculo(v: Vehiculo) { this.vehiculos.update(l => [v, ...l]); }
  agregarCita(c: Cita) { this.citas.update(l => [c, ...l]); }
}