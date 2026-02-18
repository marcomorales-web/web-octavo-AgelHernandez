import { Component,ViewEncapsulation  } from '@angular/core';
import { RouterModule, Router} from "@angular/router";

@Component({
  selector: 'app-form',
  standalone: true,
  templateUrl: './form.component.html',
  styleUrl: './form.component.css',
  encapsulation: ViewEncapsulation.None
})
export class FormComponent {
  constructor(private router: Router) {}

  goLogin() {
    this.router.navigate(['login']);
  }
}
