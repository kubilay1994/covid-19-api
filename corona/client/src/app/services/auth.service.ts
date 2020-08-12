import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    token = new BehaviorSubject<string>(null);

    private tokenExpirationTimer: number;

    constructor(private http: HttpClient, private router: Router) {}

    login(username: string, password: string) {
        return this.http
            .post<User>('api/login', {
                username,
                password,
            })
            .pipe(
                tap(user => {
                    this.token.next(user.token);
                    localStorage.setItem(
                        'userInfo',
                        JSON.stringify({
                            ...user,
                            expiresIn: Date.now() + user.expiresIn,
                        })
                    );
                })
            );
    }

    autoLogin() {
        const user: User = JSON.parse(localStorage.getItem('userInfo'));

        if (!user || user.expiresIn < Date.now()) {
            return;
        }

        if (user.token) {
            this.token.next(user.token);
            this.autoLogout(user.expiresIn - Date.now());
        }
    }

    logout() {
        localStorage.removeItem('userInfo');
        this.token.next(null);
        this.router.navigate(['/login']);
        clearTimeout(this.tokenExpirationTimer);
    }

    autoLogout(expirationTime: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationTime);
    }
}
