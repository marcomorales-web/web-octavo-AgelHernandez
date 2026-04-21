import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

export interface NhtsaMake  { MakeId: number;   MakeName: string; }
export interface NhtsaModel { Model_ID: number; Model_Name: string; }
export interface NhtsaVin   { make: string; model: string; year: string; bodyClass: string; }

@Injectable({ providedIn: 'root' })
export class NhtsaService {
  private http = inject(HttpClient);
  private readonly BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

  private marcasCache  = new Map<string, NhtsaMake[]>();
  private modelosCache = new Map<string, NhtsaModel[]>();
  private vinCache     = new Map<string, NhtsaVin>();

  getMarcas(): Observable<NhtsaMake[]> {
    const key = 'makes';
    if (this.marcasCache.has(key)) return of(this.marcasCache.get(key)!);

    return this.http
      .get<{ Results: NhtsaMake[] }>(`${this.BASE}/GetMakesForVehicleType/car?format=json`)
      .pipe(
        map(res =>
          res.Results
            .filter(m => m.MakeName?.trim())
            .sort((a, b) => a.MakeName.localeCompare(b.MakeName))
        ),
        tap(list => this.marcasCache.set(key, list)),
      );
  }

  getModelos(make: string, year: string): Observable<NhtsaModel[]> {
    const key     = `${make}|${year}`;
    const makeEnc = encodeURIComponent(make);

    if (this.modelosCache.has(key)) return of(this.modelosCache.get(key)!);

    const urlCar = `${this.BASE}/GetModelsForMakeYear/make/${makeEnc}/modelyear/${year}/vehicletype/car?format=json`;
    const urlGen = `${this.BASE}/GetModelsForMakeYear/make/${makeEnc}/modelyear/${year}?format=json`;

    const parseModelos = (res: { Results: NhtsaModel[] }) =>
      res.Results
        .filter(m => m.Model_Name?.trim())
        .sort((a, b) => a.Model_Name.localeCompare(b.Model_Name));

    return this.http.get<{ Results: NhtsaModel[] }>(urlCar).pipe(
      map(parseModelos),
      // Si no hay resultados para "car", se hace fallback al endpoint genérico
      switchMap(list =>
        list.length > 0
          ? of(list)
          : this.http.get<{ Results: NhtsaModel[] }>(urlGen).pipe(map(parseModelos))
      ),
      tap(list => this.modelosCache.set(key, list)),
    );
  }

  decodeVin(vin: string): Observable<NhtsaVin | null> {
    const key = vin.toUpperCase();
    if (this.vinCache.has(key)) return of(this.vinCache.get(key)!);

    return this.http
      .get<{ Results: any[] }>(`${this.BASE}/DecodeVinValues/${key}?format=json`)
      .pipe(
        map(res => {
          const r = res.Results?.[0];
          if (!r?.Make?.trim()) return null;
          if (r.ErrorCode && !['0', '1'].includes(r.ErrorCode)) return null;
          return { make: r.Make, model: r.Model, year: r.ModelYear, bodyClass: r.BodyClass ?? '' } as NhtsaVin;
        }),
        tap(info => { if (info) this.vinCache.set(key, info); }),
      );
  }
}