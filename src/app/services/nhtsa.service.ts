import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface NhtsaMake  { MakeId: number;   MakeName: string; }
export interface NhtsaModel { Model_ID: number; Model_Name: string; }
export interface NhtsaVin   { make: string; model: string; year: string; bodyClass: string; }

@Injectable({ providedIn: 'root' })
export class NhtsaService {
  private http = inject(HttpClient);
  private readonly BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  // ── Caché para evitar llamadas repetidas ──────────────────
  private cacheMarcas  = new Map<string, NhtsaMake[]>();
  private cacheModelos = new Map<string, NhtsaModel[]>();
  private cacheVin     = new Map<string, NhtsaVin>();

  /**
   * Obtiene todas las marcas de autos.
   * El año no filtra en este endpoint — se usa la misma lista para todos.
   * Resultado cacheado: sólo llama a la API la primera vez.
   */
  getMarcas(): Observable<NhtsaMake[]> {
    const key = 'makes';
    if (this.cacheMarcas.has(key)) return of(this.cacheMarcas.get(key)!);

    const url = `${this.BASE}/GetMakesForVehicleType/car?format=json`;
    return this.http.get<{ Results: NhtsaMake[] }>(url).pipe(
      map(res =>
        res.Results
          .filter(m => m.MakeName?.trim())
          .sort((a, b) => a.MakeName.localeCompare(b.MakeName))
      ),
      tap(list => this.cacheMarcas.set(key, list)),
    );
  }

  /**
   * Obtiene modelos por marca y año.
   * Primero intenta con filtro vehicletype=car; si no hay resultados, busca sin filtro.
   * Resultado cacheado por combinación make+year.
   */
  getModelos(make: string, year: string): Observable<NhtsaModel[]> {
    const key = `${make}|${year}`;
    if (this.cacheModelos.has(key)) return of(this.cacheModelos.get(key)!);

    const makeEnc = encodeURIComponent(make);
    const urlCar  = `${this.BASE}/GetModelsForMakeYear/make/${makeEnc}/modelyear/${year}/vehicletype/car?format=json`;

    return this.http.get<{ Results: NhtsaModel[] }>(urlCar).pipe(
      map(res => res.Results.filter(m => m.Model_Name?.trim()).sort((a, b) => a.Model_Name.localeCompare(b.Model_Name))),
      // Si no hay resultados con filtro, intentar sin filtro de tipo
      tap(async list => {
        if (list.length === 0) {
          const urlGen = `${this.BASE}/GetModelsForMakeYear/make/${makeEnc}/modelyear/${year}?format=json`;
          this.http.get<{ Results: NhtsaModel[] }>(urlGen).subscribe(res2 => {
            const fallback = res2.Results.filter(m => m.Model_Name?.trim()).sort((a, b) => a.Model_Name.localeCompare(b.Model_Name));
            this.cacheModelos.set(key, fallback);
          });
        } else {
          this.cacheModelos.set(key, list);
        }
      }),
    );
  }

  /**
   * Decodifica un VIN de 17 caracteres.
   * Resultado cacheado por VIN.
   */
  decodeVin(vin: string): Observable<NhtsaVin | null> {
    const key = vin.toUpperCase();
    if (this.cacheVin.has(key)) return of(this.cacheVin.get(key)!);

    const url = `${this.BASE}/DecodeVinValues/${key}?format=json`;
    return this.http.get<{ Results: any[] }>(url).pipe(
      map(res => {
        const r = res.Results?.[0];
        if (!r?.Make?.trim()) return null;
        if (r.ErrorCode && !['0', '1'].includes(r.ErrorCode)) return null;
        return { make: r.Make, model: r.Model, year: r.ModelYear, bodyClass: r.BodyClass ?? '' } as NhtsaVin;
      }),
      tap(info => { if (info) this.cacheVin.set(key, info); }),
    );
  }
}
