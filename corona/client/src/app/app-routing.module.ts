import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { MainPageComponent } from './components/main-page/main-page.component';

import { LoginPageComponent } from './components/login-page/login-page.component';
import { CountryDetailsComponent } from './components/country-details/country-details.component';

import { AuthGuard } from '../app/guards/auth.guard';

const routes: Routes = [
    {
        path: '',
        component: MainPageComponent,
    },
    {
        path: 'admin',
        component: AdminPanelComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'admin/:countryId',
        component: CountryDetailsComponent,
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
