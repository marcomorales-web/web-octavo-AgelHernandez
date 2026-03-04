import { Component } from "@angular/core";
import { RouterModule, Router} from "@angular/router";  
import {MatTabsModule} from '@angular/material/tabs';


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterModule,MatTabsModule],
    templateUrl: '../Admin/admin.component.html',
    styleUrls: ['../Admin/admin.component.css']
})
export class DashboardComponent {
    constructor(private router: Router) {}

    goLogin() {
        this.router.navigate(['login']);
    }

    activeTab: string = 'resumen';

    setTab(tab: string) {
    this.activeTab = tab;
}

}