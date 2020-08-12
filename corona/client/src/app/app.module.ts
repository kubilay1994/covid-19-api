import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidelistComponent } from './components/sidelist/sidelist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './components/main-page/main-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { FilterPipe } from './pipes/filter.pipe';
import { WorldMapComponent } from './components/world-map/world-map.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { CountryDetailsComponent } from './components/country-details/country-details.component';

import { httpInterceptorProviders } from './interceptors';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidelistComponent,
        MainPageComponent,
        LoginPageComponent,
        FilterPipe,
        WorldMapComponent,
        LineChartComponent,
        AdminPanelComponent,
        CountryDetailsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [httpInterceptorProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}
