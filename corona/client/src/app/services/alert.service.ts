import { Injectable } from '@angular/core';

import * as alertify from 'alertifyjs';

alertify.defaults.transition = 'zoom';
alertify.defaults.theme.ok = 'btn btn-success';
alertify.defaults.theme.cancel = 'btn btn-danger';
alertify.defaults.theme.input = 'form-control';

interface AlertConfig {
    title: string;
    message: string;
    okMessage?: string;
    errorMessage?: string;
}

@Injectable({
    providedIn: 'root',
})
export class AlertService {
    constructor() {}

    successAlert({ title, message, okMessage }: AlertConfig) {
        alertify.alert(title, message, () =>
            alertify.success(okMessage ? okMessage : message)
        );
    }

    errorAlert({ title, message, errorMessage }: AlertConfig) {
        alertify
            .alert(title, message, () =>
                alertify.error(errorMessage ? errorMessage : message)
            )
            .setHeader(
                `<span class="fa fa-times-circle fa-2x" 
                 style="vertical-align:middle;color:#e10000;"> 
                </span> <em style="margin-left: 0.3rem;"><strong>${title}</strong></em>`
            );
    }
}
