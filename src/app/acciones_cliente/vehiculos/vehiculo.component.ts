import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TallerService, Vehiculo } from '../../datos/datos.taller';
import { Init } from 'v8';

@Component({
  selector: 'app-vehiculo.component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehiculo.component.html',
  styleUrl: './vehiculo.component.css',
})
export class VehiculoComponent implements OnInit {
  private taller = inject(TallerService);
  private http = inject(HttpClient);

  // API
  private readonly API = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  vehiculos = this.taller.vehiculos;
  historial = this.taller.historial;
  citas = this.taller.citas;

  modalAbierto = signal(false);
  tab = signal<'buscar' | 'vin'>('buscar');

  // Formulario
  form = { year: '', make: '', model: '', placa: '', km: 0, vin: '' };

  // Datos de el coche
  marcas: { MakeId: number; MakeName: string }[] = [];
  modelos: { Model_ID: number; Model_Name: string }[] = [];
  anios: number[] = [];

  // Estados carga
  cargandoMarcas = false;
  cargandoModelos = false;
  errorMarcas = '';
  errorModelos = '';
  errorVin = '';

  // VIN decodificado
  vinInfo: { make: string; model: string; year: string } | null = null;

  get vehiculosEnServicio() {
    return this.vehiculos().filter((v) => v.estado === 'service').length;
  }
  get proximaCita() {
    return this.citas()[0] ?? null;
  }

  ngOnInit() {
    const dia = new Date().getFullYear();
    for (let i = dia; i >= 1981; i--) this.anios.push(i);
  }

  abrirModal() {
    this.modalAbierto.set(true);
    this.resetForm();
  }

  cerrarModal() {
    this.modalAbierto.set(false);
  }

  resetForm() {
    this.form = { year: '', make: '', model: '', placa: '', km: 0, vin: '' };
    this.marcas = [];
    this.modelos = [];
    this.vinInfo = null;
    this.errorMarcas = '';
    this.errorModelos = '';
    this.errorVin = '';
  }

  // enpoint 1 para cargar todos loc coches mediante el año seleccionado
  cargarMarcas() {
    if (!this.form.year) return;
    this.cargandoMarcas = true;
    this.errorMarcas = '';
    this.marcas = [];
    this.modelos = [];
    this.form.make = '';
    this.form.model = '';

    // filtrar el tupo de vehiculo mediante el año seleccionaado
    const url = `${this.API}/GetMakesForVehicleType/car?format=json`;

    this.http.get<{ Results: { MakeId: number; MakeName: string }[] }>(url).subscribe({
      next: (res) => {
        // Ordenar alfabéticamente para UX
        this.marcas = res.Results.filter((m) => m.MakeName && m.MakeName.trim() !== '').sort(
          (a, b) => a.MakeName.localeCompare(b.MakeName),
        );
        this.cargandoMarcas = false;
      },
      error: () => {
        this.errorMarcas = 'No se pudieron cargar las marcas. Verifica tu conexión.';
        this.cargandoMarcas = false;
      },
    });
  }

  //enpoint 2 para buscar mediante el año, marca y modelo
  cargarModelos() {
    if (!this.form.make || !this.form.year) return;
    this.cargandoModelos = true;
    this.errorModelos = '';
    this.modelos = [];
    this.form.model = '';

    const make = encodeURIComponent(this.form.make);
    const year = this.form.year;

    // api url para filtrar
    const url = `${this.API}/GetModelsForMakeYear/make/${make}/modelyear/${year}/vehicletype/car?format=json`;

    this.http.get<{ Results: { Model_ID: number; Model_Name: string }[] }>(url).subscribe({
      next: (res) => {
        this.modelos = res.Results.filter((m) => m.Model_Name && m.Model_Name.trim() !== '').sort(
          (a, b) => a.Model_Name.localeCompare(b.Model_Name),
        );

        if (this.modelos.length === 0) {
          // buscar resultados sin filtrar
          this.cargarModelosSinFiltro(make, year);
        } else {
          this.cargandoModelos = false;
        }
      },
      error: () => {
        this.errorModelos = 'No se pudieron cargar los modelos.';
        this.cargandoModelos = false;
      },
    });
  }

  // filtrar los modelos
  private cargarModelosSinFiltro(make: string, year: string) {
    const url = `${this.API}/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`;
    this.http.get<{ Results: { Model_ID: number; Model_Name: string }[] }>(url).subscribe({
      next: (res) => {
        this.modelos = res.Results.filter((m) => m.Model_Name && m.Model_Name.trim() !== '').sort(
          (a, b) => a.Model_Name.localeCompare(b.Model_Name),
        );
        this.cargandoModelos = false;
      },
      error: () => {
        this.errorModelos = 'No se pudieron cargar los modelos.';
        this.cargandoModelos = false;
      },
    });
  }

  // endpoint con vin
  decodificarVin() {
    const vin = this.form.vin.trim().toUpperCase();
    if (vin.length !== 17) return;

    this.errorVin = '';
    this.vinInfo = null;

    const url = `${this.API}/DecodeVinValues/${vin}?format=json`;

    this.http.get<{ Results: any[] }>(url).subscribe({
      next: (res) => {
        const r = res.Results?.[0];

        // Verificar que el VIN decodificó correctamente
        // ErrorCode "0" = limpio, "1" = errores en posición
        if (!r || !r.Make || r.Make.trim() === '') {
          this.errorVin = 'VIN no encontrado. Verifica que sea correcto.';
          return;
        }

        if (r.ErrorCode && r.ErrorCode !== '0' && r.ErrorCode !== '1') {
          this.errorVin = `VIN inválido: ${r.ErrorText || 'verifica los caracteres'}`;
          return;
        }

        this.vinInfo = {
          make: r.Make,
          model: r.Model,
          year: r.ModelYear,
        };

        // prellenar datos con el resultado del VIN
        this.form.make = r.Make;
        this.form.model = r.Model;
        this.form.year = r.ModelYear;
      },
      error: () => {
        this.errorVin = 'Error al conectar con el servicio. Intenta de nuevo.';
      },
    });
  }

  formularioValido(): boolean {
    const tieneVehiculo =
      this.tab() === 'vin'
        ? !!this.vinInfo
        : !!this.form.make && !!this.form.model && !!this.form.year;
    return tieneVehiculo && !!this.form.placa.trim();
  }

  guardarVehiculo() {
    const nuevo: Vehiculo = {
      id: Date.now().toString(),
      make: this.form.make || this.vinInfo!.make,
      model: this.form.model || this.vinInfo!.model,
      year: Number(this.form.year || this.vinInfo!.year),
      placa: this.form.placa.toUpperCase().trim(),
      km: this.form.km || 0,
      estado: 'ok',
      proximoEvento: 'Por definir',
      vin: this.form.vin || undefined,
    };
    this.taller.agregarVehiculo(nuevo);
    this.cerrarModal();
  }
}
