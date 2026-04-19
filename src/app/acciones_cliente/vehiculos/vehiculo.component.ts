import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService, Vehiculo } from '../../datos/datos.taller';
import { NhtsaService, NhtsaMake, NhtsaModel } from '../../services/nhtsa.service';

// ── Color de acento por fabricante ─────────────────────────
const BRAND_COLORS: Record<string, string> = {
  toyota: '#EB0A1E', nissan: '#C3002F', honda: '#E40521', ford: '#003499',
  chevrolet: '#D4A017', volkswagen: '#001E50', bmw: '#0066B1', mercedes: '#9A9A9A',
  audi: '#BB0A30', hyundai: '#002C5F', kia: '#05141F', mazda: '#910000',
  subaru: '#004B97', jeep: '#374B00', dodge: '#D01212', ram: '#000000',
  gmc: '#CC0000', cadillac: '#282828', buick: '#B39B6E', chrysler: '#702020',
  lincoln: '#354F5C', infiniti: '#1F1F1F', lexus: '#1A1A1A', acura: '#CC0000',
  mitsubishi: '#ED1A3B', volvo: '#003057', peugeot: '#003A8C', renault: '#EFDF00',
  fiat: '#8B0000', alfa: '#B01C2E', porsche: '#C40000', ferrari: '#FF2800',
  lamborghini: '#E8B900', maserati: '#00529B', tesla: '#CC0000',
};

/** Devuelve el color de acento para una marca dada */
function getBrandColor(make: string): string {
  const key = make.toLowerCase().split(' ')[0];
  return BRAND_COLORS[key] ?? '#2E5F8A'; // default: azul Jirafitas
}

/** Devuelve las iniciales del fabricante para el avatar */
function getBrandInitials(make: string): string {
  return make.trim().slice(0, 2).toUpperCase();
}

@Component({
  selector: 'app-vehiculo.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css',
})
export class VehiculoComponent implements OnInit {
  private taller = inject(TallerService);
  private nhtsa  = inject(NhtsaService);   // ← servicio dedicado

  vehiculos = this.taller.vehiculos;
  historial = this.taller.historial;
  citas     = this.taller.citas;

  modalAbierto = signal(false);
  tab          = signal<'buscar' | 'vin'>('buscar');

  form = { year: '', make: '', model: '', placa: '', km: 0, vin: '' };

  marcas:  NhtsaMake[]  = [];
  modelos: NhtsaModel[] = [];
  anios:   number[]     = [];

  cargandoMarcas  = false;
  cargandoModelos = false;
  errorMarcas     = '';
  errorModelos    = '';
  errorVin        = '';
  cargandoVin     = false;

  vinInfo: { make: string; model: string; year: string; bodyClass: string } | null = null;

  // Helpers expuestos al template
  getBrandColor    = getBrandColor;
  getBrandInitials = getBrandInitials;

  get vehiculosEnServicio() { return this.vehiculos().filter(v => v.estado === 'service').length; }

  ngOnInit() {
    const actual = new Date().getFullYear();
    for (let i = actual; i >= 1981; i--) this.anios.push(i);
  }

  abrirModal()  { this.modalAbierto.set(true);  this.resetForm(); }
  cerrarModal() { this.modalAbierto.set(false); }

  resetForm() {
    this.form        = { year: '', make: '', model: '', placa: '', km: 0, vin: '' };
    this.marcas      = [];
    this.modelos     = [];
    this.vinInfo     = null;
    this.errorMarcas = this.errorModelos = this.errorVin = '';
  }

  // ── FIX DEL BUG: usar (ngModelChange) en lugar de (change) ──
  // El evento (change) en Angular/SSR no se dispara correctamente al cambiar
  // por primera vez. ngModelChange se activa en cuanto el valor del signal cambia.
  onYearChange(year: string) {
    this.form.year = year;
    if (!year) return;

    this.cargandoMarcas = true;
    this.errorMarcas    = '';
    this.marcas         = [];
    this.modelos        = [];
    this.form.make      = '';
    this.form.model     = '';

    this.nhtsa.getMarcas().subscribe({
      next: list  => { this.marcas = list; this.cargandoMarcas = false; },
      error: ()   => { this.errorMarcas = 'No se pudieron cargar las marcas.'; this.cargandoMarcas = false; },
    });
  }

  onMakeChange(make: string) {
    this.form.make  = make;
    this.form.model = '';
    if (!make || !this.form.year) return;

    this.cargandoModelos = true;
    this.errorModelos    = '';
    this.modelos         = [];

    this.nhtsa.getModelos(make, this.form.year).subscribe({
      next: list => { this.modelos = list; this.cargandoModelos = false; },
      error: ()  => { this.errorModelos = 'No se pudieron cargar los modelos.'; this.cargandoModelos = false; },
    });
  }

  decodificarVin() {
    const vin = this.form.vin.trim().toUpperCase();
    if (vin.length !== 17) return;

    this.errorVin    = '';
    this.vinInfo     = null;
    this.cargandoVin = true;

    this.nhtsa.decodeVin(vin).subscribe({
      next: info => {
        this.cargandoVin = false;
        if (!info) { this.errorVin = 'VIN no encontrado. Verifica que sea correcto.'; return; }
        this.vinInfo    = info;
        this.form.make  = info.make;
        this.form.model = info.model;
        this.form.year  = info.year;
      },
      error: () => { this.cargandoVin = false; this.errorVin = 'Error de conexión. Intenta de nuevo.'; },
    });
  }

  formularioValido(): boolean {
    const tieneVehiculo = this.tab() === 'vin'
      ? !!this.vinInfo
      : !!this.form.make && !!this.form.model && !!this.form.year;
    return tieneVehiculo && !!this.form.placa.trim();
  }

  guardarVehiculo() {
    const nuevo: Vehiculo = {
      id:             Date.now().toString(),
      make:           this.form.make  || this.vinInfo!.make,
      model:          this.form.model || this.vinInfo!.model,
      year:           Number(this.form.year || this.vinInfo!.year),
      placa:          this.form.placa.toUpperCase().trim(),
      km:             this.form.km || 0,
      estado:         'ok',
      proximoEvento:  'Por definir',
      vin:            this.form.vin || undefined,
    };
    this.taller.agregarVehiculo(nuevo);
    this.cerrarModal();
  }
}
