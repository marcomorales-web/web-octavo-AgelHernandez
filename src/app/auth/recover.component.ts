import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule, Router} from "@angular/router";

@Component({
  selector: 'app-recover',
  standalone: true,
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
  encapsulation: ViewEncapsulation.None
})
export class RecoverComponent {
  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['login']);
  }
}
