import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuthenticated = false;
    private _tokenSubscription: Subscription;

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this._tokenSubscription = this.authService.token.subscribe(token => {
            this.isAuthenticated = token !== null;
        });
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy(): void {
        this._tokenSubscription.unsubscribe();
    }
}
