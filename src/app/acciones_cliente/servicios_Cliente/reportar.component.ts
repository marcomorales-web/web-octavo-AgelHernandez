import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallerService } from '../../datos/datos.taller';

@Component({
  selector: 'app-reportar-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportar.component.html',
  styleUrl: './reportar.component.css',
})
export class ReportarComponent {
  private taller = inject(TallerService);

  vehiculos = this.taller.vehiculos;
  enviado   = signal(false);
  form      = { vehiculoId: '', zona: '', descripcion: '' };
  zonas     = ['Motor','Frenos','Suspensión','Carrocería / Golpes','Interior','Eléctrico','Llantas','Otro'];

  // ── Subida de imágenes ──
  imagenes = signal<{ url: string; nombre: string }[]>([]);
  dragging = signal(false);

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) this.procesarArchivos(Array.from(input.files));
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging.set(false);
    const files = event.dataTransfer?.files;
    if (files) this.procesarArchivos(Array.from(files));
  }

  onDragOver(event: DragEvent) { event.preventDefault(); this.dragging.set(true); }
  onDragLeave()                 { this.dragging.set(false); }

  private procesarArchivos(files: File[]) {
    const validos = files.filter(f => f.type.startsWith('image/') && f.size <= 10 * 1024 * 1024);
    validos.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => {
        this.imagenes.update(imgs => [
          ...imgs,
          { url: e.target!.result as string, nombre: f.name },
        ]);
      };
      reader.readAsDataURL(f);
    });
  }

  eliminarImagen(i: number) {
    this.imagenes.update(imgs => imgs.filter((_, idx) => idx !== i));
  }

  enviar() {
    this.enviado.set(true);
    this.form     = { vehiculoId: '', zona: '', descripcion: '' };
    this.imagenes.set([]);
    setTimeout(() => this.enviado.set(false), 3500);
  }

  valido() { return !!this.form.vehiculoId && !!this.form.descripcion; }
}
