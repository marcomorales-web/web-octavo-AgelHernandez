import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg, DateSelectArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [CommonModule, FormsModule, FullCalendarModule],
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css',
})
export class CalendarioComponent {
  private taller = inject(TallerService);

  fechaSel    = signal<string>('');
  modalNueva  = signal(false);
  nuevaCita   = { titulo: '', hora: '10:00', descripcion: '' };

  horas = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

  // Eventos del calendario derivados de las citas del servicio
  eventos = computed(() =>
    this.taller.citas().map(c => ({
      id: c.id,
      title: `${c.hora} · ${c.servicio}`,
      date: new Date(c.fecha).toISOString().split('T')[0],
      backgroundColor: c.estado === 'confirmada' ? '#2E5F8A' : c.estado === 'pendiente' ? '#f97316' : '#16a34a',
      borderColor: 'transparent',
      textColor: '#fff',
    }))
  );

  // Citas para la fecha seleccionada
  citasDelDia = computed(() => {
    const fecha = this.fechaSel();
    if (!fecha) return [];
    return this.taller.citas().filter(c =>
      new Date(c.fecha).toISOString().split('T')[0] === fecha
    );
  });

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    selectable: true,
    locale: 'es',
    buttonText: { today: 'Hoy', month: 'Mes', week: 'Semana' },
    headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
    select: (arg: DateSelectArg) => {
      this.fechaSel.set(arg.startStr);
    },
    eventClick: (arg: EventClickArg) => {
      const fecha = arg.event.startStr;
      this.fechaSel.set(fecha);
    },
    events: () => this.eventos(),
  };

  formatFecha(fecha: string) {
    return new Intl.DateTimeFormat('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(fecha + 'T12:00'));
  }

  agregarCita() {
    if (!this.fechaSel() || !this.nuevaCita.titulo) return;
    this.taller.agregarCita({
      id: Date.now().toString(),
      vehiculoId: '',
      vehiculoNombre: 'Sin vehículo asignado',
      servicio: this.nuevaCita.titulo,
      fecha: new Date(this.fechaSel() + 'T12:00'),
      hora: this.nuevaCita.hora,
      estado: 'pendiente',
    });
    this.nuevaCita = { titulo: '', hora: '10:00', descripcion: '' };
    this.modalNueva.set(false);
  }
}
