import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService, Cita } from '../../datos/datos.taller';


@Component({
  selector: 'app-agendar_cita.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar_cita.component.html',
  styleUrl: './agendar_cita.component.css',
})

export class AgendarCitaComponent {
  private taller = inject(TallerService);
  vehiculos = this.taller.vehiculos;
  citas = this.taller.citas;
  guardado = signal(false);

  form = { vehiculoId: '', servicio: '', fecha: '', hora: '10:00', notas: '' };

  serviciosOpciones = ['Cambio de aceite','Afinación','Frenos','Suspensión','Revisión general','Eléctrico','Carrocería','Otro'];
  horas = ['08:00','09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00'];

  get today() { return new Date().toISOString().split('T')[0]; }
  formularioValido() { return !!this.form.vehiculoId && !!this.form.servicio && !!this.form.fecha; }

  guardar() {
    const v = this.vehiculos().find(v => v.id === this.form.vehiculoId)!;
    const cita: Cita = {
      id: Date.now().toString(),
      vehiculoId: v.id,
      vehiculoNombre: `${v.make} ${v.model} ${v.year}`,
      servicio: this.form.servicio,
      fecha: new Date(this.form.fecha),
      hora: this.form.hora,
      estado: 'pendiente',
    };
    this.taller.agregarCita(cita);
    this.guardado.set(true);
    this.form = { vehiculoId: '', servicio: '', fecha: '', hora: '10:00', notas: '' };
    setTimeout(() => this.guardado.set(false), 3000);
  }

  diaNum = (f: Date) => new Intl.DateTimeFormat('es-MX',{day:'2-digit'}).format(new Date(f));
  mesCorto = (f: Date) => new Intl.DateTimeFormat('es-MX',{month:'short'}).format(new Date(f)).replace('.','');
}
