import { Injectable, signal, computed } from '@angular/core';

export type Role = 'cliente' | 'admin' | null;

interface Usuario {
  nombre: string;
  email: string;
  role: Role;
}

const USUARIOS: { email: string; password: string; nombre: string; role: Role }[] = [
  { email: 'user@gmail.com',  password: '1234',     nombre: 'Angel Hernandez',    role: 'cliente' },
  { email: 'admin@gmail.com', password: '1234',     nombre: 'Rafael Peralta',  role: 'admin'   },
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _user = signal<Usuario | null>(null);

  isLoggedIn = computed(() => !!this._user());
  role       = computed(() => this._user()?.role ?? null);
  nombre     = computed(() => this._user()?.nombre ?? '');
  email      = computed(() => this._user()?.email  ?? '');

  login(email: string, password: string): boolean {
    const found = USUARIOS.find(u => u.email === email && u.password === password);
    if (found) {
      this._user.set({ nombre: found.nombre, email: found.email, role: found.role });
      return true;
    }
    return false;
  }

  logout() { this._user.set(null); }
}
