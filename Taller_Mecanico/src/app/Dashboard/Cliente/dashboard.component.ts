import { Component } from "@angular/core";
import { RouterModule, Router} from "@angular/router";


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterModule],
    templateUrl: '../Cliente/dashboard.component.html',
    styleUrls: ['../Cliente/dashboard.component.css']
})
export class DashboardComponent {
    constructor(private router: Router) {}

    goLogin() {
        this.router.navigate(['login']);
    }
    toggleDark() {
    document.body.classList.toggle('dark');
    }


}