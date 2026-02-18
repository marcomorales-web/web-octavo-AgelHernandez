import { Component } from "@angular/core";
import { RouterModule, Router} from "@angular/router";


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterModule],
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