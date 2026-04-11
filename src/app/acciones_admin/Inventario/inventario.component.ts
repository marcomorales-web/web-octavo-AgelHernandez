import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TallerService, ProductoInventario } from '../../datos/datos.taller';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
})
export class InventarioComponent {
  private taller = inject(TallerService);

  inventario    = this.taller.inventario;
  totalProd     = this.taller.totalProductos;
  stockBajo     = this.taller.stockBajo;
  valorTotal    = this.taller.valorInventario;

  modalAbierto  = signal(false);
  modoEditar    = signal(false);
  busqueda      = signal('');
  confirmarElim = signal<number | null>(null);

  form: ProductoInventario = this.formVacio();

  columnas = ['id', 'nombre', 'categoria', 'cantidad', 'minimo', 'precio', 'acciones'];

  inventarioFiltrado = computed(() => {
    const q = this.busqueda().toLowerCase();
    return this.inventario().filter(p =>
      p.nombre.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)
    );
  });

  categorias = ['Lubricantes', 'Filtros', 'Encendido', 'Frenos', 'Refrigeración', 'Motor', 'Eléctrico', 'Otro'];

  formVacio(): ProductoInventario {
    return { id: Date.now(), nombre: '', categoria: 'Filtros', cantidad: 0, minimo: 5, precio: 0, unidad: 'piezas' };
  }

  abrirNuevo() {
    this.form = this.formVacio();
    this.modoEditar.set(false);
    this.modalAbierto.set(true);
  }

  abrirEditar(p: ProductoInventario) {
    this.form = { ...p };
    this.modoEditar.set(true);
    this.modalAbierto.set(true);
  }

  cerrar() { this.modalAbierto.set(false); }

  guardar() {
    if (!this.form.nombre || this.form.precio <= 0) return;
    if (this.modoEditar()) {
      this.taller.actualizarProducto({ ...this.form });
    } else {
      this.taller.agregarProducto({ ...this.form, id: Date.now() });
    }
    this.cerrar();
  }

  eliminar(id: number) {
    this.taller.eliminarProducto(id);
    this.confirmarElim.set(null);
  }

  esStockBajo(p: ProductoInventario) { return p.cantidad <= p.minimo; }
  valido() { return !!this.form.nombre && this.form.precio > 0; }
}
