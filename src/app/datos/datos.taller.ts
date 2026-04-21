import { Injectable, signal, computed } from '@angular/core';

export interface Vehiculo {
  id: string;
  make: string;
  model: string;
  year: number;
  placa: string;
  km: number;
  estado: 'ok' | 'service';
  proximoEvento: string;
  vin?: string;
}

export interface Cita {
  id: string;
  vehiculoId: string;
  vehiculoNombre: string;
  servicio: string;
  fecha: Date;
  hora: string;
  estado: 'pendiente' | 'confirmada' | 'completada';
  costo?: number;
  notas?: string;
}

export interface Servicio {
  id: string;
  vehiculoId: string;
  vehiculoNombre: string;
  nombre: string;
  fecha: string;
  costo: number;
  estado: 'activo' | 'completado';
  progreso: number;
  tecnico?: string;
  entrega?: string;
  cliente?: string;
}

export interface ProductoInventario {
  id: number;
  nombre: string;
  categoria: string;
  cantidad: number;
  minimo: number;
  precio: number;
  unidad: string;
}

export interface Cotizacion {
  id: string;
  vehiculoId: string;
  vehiculoNombre: string;
  descripcion: string;
  urgencia: 'normal' | 'medio' | 'urgente';
  estado: 'pendiente' | 'respondida';
  fecha: string;
  respuesta?: string;
  monto?: number;
}

/**
 * Mensaje de soporte — el cliente escribe su consulta,
 * el admin la lee en su panel y escribe una respuesta manual.
 * Sin estados automáticos, sin tickets, sin flujos de aprobación.
 */
export interface MensajeSoporte {
  id: string;
  clienteNombre: string;
  clienteEmail: string;
  asunto: string;
  mensaje: string;
  fecha: string;
  respuesta?: string; // escrita manualmente por el admin
  fechaRespuesta?: string;
}

@Injectable({ providedIn: 'root' })
export class TallerService {
  // ── Cliente ──────────────────────────────────────────────
  vehiculos = signal<Vehiculo[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Corolla',
      year: 2019,
      placa: 'ABC-123-MX',
      km: 48200,
      estado: 'ok',
      proximoEvento: 'Jun 25',
    },
    {
      id: '2',
      make: 'Nissan',
      model: 'Sentra',
      year: 2021,
      placa: 'XYZ-789-MX',
      km: 22500,
      estado: 'service',
      proximoEvento: 'Abr 20',
    },
  ]);

  citas = signal<Cita[]>([
    {
      id: '1',
      vehiculoId: '1',
      vehiculoNombre: 'Toyota Corolla 2019',
      servicio: 'Cambio de frenos',
      fecha: new Date('2026-04-22'),
      hora: '10:00',
      estado: 'confirmada',
    },
    {
      id: '2',
      vehiculoId: '2',
      vehiculoNombre: 'Nissan Sentra 2021',
      servicio: 'Afinación completa',
      fecha: new Date('2026-05-05'),
      hora: '09:00',
      estado: 'pendiente',
    },
  ]);

  historial = signal<Servicio[]>([
    {
      id: '1',
      vehiculoId: '1',
      vehiculoNombre: 'Toyota Corolla 2019',
      nombre: 'Cambio de aceite 5W-30',
      fecha: '10 Feb 2025',
      costo: 580,
      estado: 'completado',
      progreso: 5,
      cliente: 'Angel Hernandez',
    },
    {
      id: '2',
      vehiculoId: '1',
      vehiculoNombre: 'Toyota Corolla 2019',
      nombre: 'Afinación completa',
      fecha: '05 Ene 2025',
      costo: 1200,
      estado: 'completado',
      progreso: 5,
      cliente: 'Angel Hernandez',
    },
    {
      id: '3',
      vehiculoId: '2',
      vehiculoNombre: 'Nissan Sentra 2021',
      nombre: 'Frenos y rotores',
      fecha: 'En taller',
      costo: 2400,
      estado: 'activo',
      progreso: 3,
      tecnico: 'Ing. Ramírez',
      entrega: 'Abr 20',
      cliente: 'Angel Hernandez',
    },
  ]);

  cotizaciones = signal<Cotizacion[]>([
    {
      id: '1',
      vehiculoId: '1',
      vehiculoNombre: 'Toyota Corolla 2019',
      descripcion: 'Revisión de suspensión delantera, ruido al girar',
      urgencia: 'medio',
      estado: 'respondida',
      fecha: '01 Abr 2026',
      monto: 1800,
      respuesta: 'Revisamos rótulas y amortiguadores. Incluye mano de obra.',
    },
    {
      id: '2',
      vehiculoId: '2',
      vehiculoNombre: 'Nissan Sentra 2021',
      descripcion: 'Cambio de clutch completo',
      urgencia: 'urgente',
      estado: 'pendiente',
      fecha: '04 Abr 2026',
    },
  ]);

  /** Mensajes de soporte — el cliente escribe, el admin responde manualmente */
  mensajesSoporte = signal<MensajeSoporte[]>([
    {
      id: 'demo-1',
      clienteNombre: 'Angel Hernandez',
      clienteEmail: 'user@gmail.com',
      asunto: 'Pregunta sobre garantía de frenos',
      mensaje:
        'Quisiera saber cuánto tiempo cubre la garantía del cambio de frenos que me realizaron el mes pasado.',
      fecha: '15 Abr 2026',
      respuesta:
        'La garantía cubre 6 meses o 10,000 km, lo que ocurra primero. Si tienes algún problema, visítanos o llámanos.',
      fechaRespuesta: '15 Abr 2026',
    },
  ]);

  // ── Admin ─────────────────────────────────────────────────
  inventario = signal<ProductoInventario[]>([
    {
      id: 1,
      nombre: 'Aceite de motor 5W-30',
      categoria: 'Lubricantes',
      cantidad: 24,
      minimo: 10,
      precio: 150,
      unidad: 'litros',
    },
    {
      id: 2,
      nombre: 'Filtro de aire',
      categoria: 'Filtros',
      cantidad: 8,
      minimo: 10,
      precio: 80,
      unidad: 'piezas',
    },
    {
      id: 3,
      nombre: 'Bujías NGK (juego x4)',
      categoria: 'Encendido',
      cantidad: 15,
      minimo: 5,
      precio: 240,
      unidad: 'juegos',
    },
    {
      id: 4,
      nombre: 'Líquido de frenos DOT4',
      categoria: 'Frenos',
      cantidad: 6,
      minimo: 8,
      precio: 120,
      unidad: 'litros',
    },
    {
      id: 5,
      nombre: 'Pastillas de freno',
      categoria: 'Frenos',
      cantidad: 12,
      minimo: 6,
      precio: 380,
      unidad: 'juegos',
    },
    {
      id: 6,
      nombre: 'Filtro de aceite',
      categoria: 'Filtros',
      cantidad: 20,
      minimo: 8,
      precio: 95,
      unidad: 'piezas',
    },
    {
      id: 7,
      nombre: 'Anticongelante 50/50',
      categoria: 'Refrigeración',
      cantidad: 4,
      minimo: 6,
      precio: 160,
      unidad: 'litros',
    },
    {
      id: 8,
      nombre: 'Correa de distribución',
      categoria: 'Motor',
      cantidad: 3,
      minimo: 4,
      precio: 680,
      unidad: 'piezas',
    },
  ]);

  // ── Computed stats ────────────────────────────────────────
  totalProductos = computed(() => this.inventario().length);
  stockBajo = computed(() => this.inventario().filter((p) => p.cantidad <= p.minimo).length);
  valorInventario = computed(() =>
    this.inventario().reduce((a, p) => a + p.cantidad * p.precio, 0),
  );
  serviciosActivos = computed(() => this.historial().filter((s) => s.estado === 'activo').length);
  citasPendientes = computed(() => this.citas().filter((c) => c.estado === 'pendiente').length);
  ingresosMes = computed(() =>
    this.historial()
      .filter((s) => s.estado === 'completado')
      .reduce((a, s) => a + s.costo, 0),
  );
  mensajesSinRespuesta = computed(() => this.mensajesSoporte().filter((m) => !m.respuesta).length);

  // ── Mutaciones ────────────────────────────────────────────
  agregarVehiculo(v: Vehiculo) {
    this.vehiculos.update((l) => [v, ...l]);
  }
  agregarCita(c: Cita) {
    this.citas.update((l) => [c, ...l]);
  }
  agregarCotizacion(c: Cotizacion) {
    this.cotizaciones.update((l) => [c, ...l]);
  }
  agregarProducto(p: ProductoInventario) {
    this.inventario.update((l) => [p, ...l]);
  }
  actualizarProducto(p: ProductoInventario) {
    this.inventario.update((l) => l.map((x) => (x.id === p.id ? p : x)));
  }
  eliminarProducto(id: number) {
    this.inventario.update((l) => l.filter((p) => p.id !== id));
  }

  /** Cliente envía un mensaje de soporte */
  enviarMensajeSoporte(m: MensajeSoporte) {
    this.mensajesSoporte.update((l) => [m, ...l]);
  }

  /** Admin responde manualmente un mensaje */
  responderMensaje(id: string, respuesta: string) {
    this.mensajesSoporte.update((l) =>
      l.map((m) =>
        m.id === id
          ? {
              ...m,
              respuesta,
              fechaRespuesta: new Date().toLocaleDateString('es-MX', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              }),
            }
          : m,
      ),
    );
  }

  responderCotizacion(id: string, respuesta: string, monto: number) {
    this.cotizaciones.update((l) =>
      l.map((c) => (c.id === id ? { ...c, estado: 'respondida', respuesta, monto } : c)),
    );
  }
}
