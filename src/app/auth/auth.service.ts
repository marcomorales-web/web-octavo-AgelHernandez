import { Injectable, signal, computed } from '@angular/core';

export type Role = 'cliente' | 'admin' | null;

interface Usuario {
  nombre: string;
  email: string;
  role: Role;
}

const USUARIOS: { email: string; password: string; nombre: string; role: Role }[] = [
  { email: 'user@gmail.com',  password: '1234', nombre: 'Angel Hernandez', role: 'cliente' },
  { email: 'admin@gmail.com', password: '1234', nombre: 'Rafael Peralta',  role: 'admin'   },
];

const SESSION_KEY = 'taller_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Al iniciar, se intenta restaurar la sesión desde sessionStorage
  private _user = signal<Usuario | null>(this.cargarSesion());

  isLoggedIn = computed(() => !!this._user());
  role       = computed(() => this._user()?.role ?? null);
  nombre     = computed(() => this._user()?.nombre ?? '');
  email      = computed(() => this._user()?.email  ?? '');

  login(email: string, password: string): boolean {
    const found = USUARIOS.find(u => u.email === email && u.password === password);
    if (!found) return false;

    const usuario: Usuario = { nombre: found.nombre, email: found.email, role: found.role };
    this._user.set(usuario);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
    return true;
  }

  logout() {
    this._user.set(null);
    sessionStorage.removeItem(SESSION_KEY);
  }

  private cargarSesion(): Usuario | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }
}