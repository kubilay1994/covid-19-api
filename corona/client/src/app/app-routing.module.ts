import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryPickerComponent } from './country-picker/country-picker.component';
import { MainPageComponent } from './main-page/main-page.component';

import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
    {
        path: '',
        component: MainPageComponent,
    },
    {
        path: 'admin',
        component: CountryPickerComponent,
    },
    {
        path: 'login',
        component: LoginPageComponent,
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
