import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';

@Component({
    selector: 'app-login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
})
export class LoginPageComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) {}

    ngOnInit(): void {}

    onSubmit(form: NgForm) {
        const { username, password } = form.value;
        this.authService.login(username, password).subscribe(
            res => {
                this.router.navigateByUrl('/admin');
            },
            err =>
                this.alertService.errorAlert({
                    title: 'Login Failed',
                    message: 'Invalid credentials',
                })
        );
        form.reset();
    }
}
