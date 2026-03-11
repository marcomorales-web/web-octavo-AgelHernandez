import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Inventario {
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
}


@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent {

  columnas: string[] = ['id','nombre','cantidad','precio','acciones'];

  inventario: Inventario[] = [
    {id:1, nombre:'Aceite de motor', cantidad:20, precio:150},
    {id:2, nombre:'Filtro de aire', cantidad:15, precio:80},
    {id:3, nombre:'Bujías', cantidad:30, precio:60},
    {id:4, nombre:'Liquido de frenos', cantidad:10, precio:120}
  ];



}