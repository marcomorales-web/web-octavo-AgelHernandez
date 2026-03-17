import { Component } from "@angular/core";
import { RouterModule, Router} from "@angular/router";
import { HeaderComponent } from "./header.component";
import { SidebarComponent } from "./sidebar.component";


@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [RouterModule, SidebarComponent],
    templateUrl: '../Cliente/dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    constructor(private router: Router) {}

    goLogin() {
        this.router.navigate(['login']);
    }

}