import { Component } from '@angular/core';
import { RouterModule, Router} from "@angular/router";  

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  constructor(private router: Router) {}
    activeTab: string = 'dashboard';

    setTab(tab: string) {
    this.activeTab = tab;
    }

}
