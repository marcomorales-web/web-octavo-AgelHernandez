import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService, Vehiculo } from '../../datos/datos.taller';
import { NhtsaService, NhtsaMake, NhtsaModel, NhtsaVin } from '../../services/nhtsa.service';
import { finalize } from 'rxjs/operators';

interface VehiculoForm {
  year: string;
  make: string;
  model: string;
  placa: string;
  km: number;
  vin: string;
}

@Component({
  selector: 'app-vehiculo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css',
})
export class VehiculoComponent implements OnInit {

  // inyecciones de servicios
  private taller = inject(TallerService);
  private nhtsa  = inject(NhtsaService);
  private cdr    = inject(ChangeDetectorRef);  // fuerza la detección de cambios

  // datos del vehiculo
  vehiculos = this.taller.vehiculos;
  historial = this.taller.historial;
  citas     = this.taller.citas;

  // estados modales
  modalAbierto = signal(false);
  tab          = signal<'buscar' | 'vin'>('buscar');

  // formulario
  form: VehiculoForm = this.formVacio();

  // listas 
  marcas:  NhtsaMake[]  = [];
  modelos: NhtsaModel[] = [];
  anios:   number[]     = [];

  // estados y errores
  loading = { marcas: false, modelos: false, vin: false };
  errors  = { marcas: '',    modelos: '',    vin: ''    };

  vinInfo: NhtsaVin | null = null;

  //vehiculos en servicio
  vehiculosEnServicio = computed(() =>
    this.vehiculos().filter(v => v.estado === 'service').length
  );

  // ciclo
  ngOnInit() {
    const actual = new Date().getFullYear();
    this.anios = Array.from({ length: actual - 1980 }, (_, i) => actual - i);
  }

  // Modal
  abrirModal()  { this.resetForm(); this.modalAbierto.set(true);  }
  cerrarModal() { this.modalAbierto.set(false); }


  onYearChange(year: string) {
    this.form.year  = year;
    this.form.make  = '';
    this.form.model = '';
    this.marcas     = [];
    this.modelos    = [];

    if (year) this.cargarMarcas();
  }

  onMakeChange(make: string) {
    this.form.make  = make;
    this.form.model = '';
    this.modelos    = [];

    if (make && this.form.year) this.cargarModelos(make, this.form.year);
  }

  decodificarVin() {
    const vin = this.form.vin.trim().toUpperCase();
    if (vin.length !== 17) return;

    this.vinInfo     = null;
    this.errors.vin  = '';
    this.loading.vin = true;

    this.nhtsa.decodeVin(vin)
      .pipe(finalize(() => { this.loading.vin = false; this.cdr.markForCheck(); }))
      .subscribe({
        next: info => {
          if (!info) { this.errors.vin = 'VIN no válido'; return; }
          this.vinInfo = info;
          this.form = { ...this.form, make: info.make, model: info.model, year: info.year };
        },
        error: () => this.errors.vin = 'Error de conexión',
      });
  }

  // guardar vehiculo

  formularioValido(): boolean {
    const tieneVehiculo = this.tab() === 'vin'
      ? !!this.vinInfo
      : !!this.form.make && !!this.form.model && !!this.form.year;

    return tieneVehiculo && !!this.form.placa.trim();
  }

  guardarVehiculo() {
    if (!this.formularioValido()) return;

    const nuevo: Vehiculo = {
      id:            Date.now().toString(),
      make:          this.form.make  || this.vinInfo!.make,
      model:         this.form.model || this.vinInfo!.model,
      year:          Number(this.form.year || this.vinInfo!.year),
      placa:         this.form.placa.toUpperCase().trim(),
      km:            this.form.km || 0,
      estado:        'ok',
      proximoEvento: 'Por definir',
      vin:           this.form.vin || undefined,
    };

    this.taller.agregarVehiculo(nuevo);
    this.cerrarModal();
  }

  // colores de las marcas

  getBrandColor(make: string): string {
    const colors: Record<string, string> = {
      Toyota: '#eb0a1e', Honda: '#cc0000', Ford: '#003087',
      Chevrolet: '#d4af37', BMW: '#0066b2', 'Mercedes-Benz': '#00adef',
      Nissan: '#c3002f', Volkswagen: '#1a1a2e', Audi: '#bb0a30',
      Hyundai: '#002c5f', Kia: '#05141f', Mazda: '#910a2d',
    };
    return colors[make] ?? '#6b7280';
  }

  getBrandInitials(make: string): string {
    return make.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

 //MARCAS Y MODELOS

  private cargarMarcas() {
    this.loading.marcas = true;
    this.errors.marcas  = '';

    this.nhtsa.getMarcas()
      .pipe(finalize(() => { this.loading.marcas = false; this.cdr.markForCheck(); }))
      .subscribe({
        next:  list => { this.marcas = list; this.cdr.markForCheck(); },
        error: ()   => this.errors.marcas = 'No se pudieron cargar las marcas',
      });
  }

  private cargarModelos(make: string, year: string) {
    this.loading.modelos = true;
    this.errors.modelos  = '';

    this.nhtsa.getModelos(make, year)
      .pipe(finalize(() => { this.loading.modelos = false; this.cdr.markForCheck(); }))
      .subscribe({
        next:  list => { this.modelos = list; this.cdr.markForCheck(); },
        error: ()   => this.errors.modelos = 'No se pudieron cargar los modelos',
      });
  }

  private formVacio(): VehiculoForm {
    return { year: '', make: '', model: '', placa: '', km: 0, vin: '' };
  }

  private resetForm() {
    this.form    = this.formVacio();
    this.marcas  = [];
    this.modelos = [];
    this.vinInfo = null;
    this.errors  = { marcas: '', modelos: '', vin: '' };
  }
}