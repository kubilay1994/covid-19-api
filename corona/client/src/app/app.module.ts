import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidelistComponent } from './sidelist/sidelist.component';
import { CountryPickerComponent } from './country-picker/country-picker.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FilterPipe } from './pipes/filter.pipe';
import { WorldMapComponent } from './world-map/world-map.component';
import { LineChartComponent } from './line-chart/line-chart.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        SidelistComponent,
        CountryPickerComponent,
        MainPageComponent,
        LoginPageComponent,
        FilterPipe,
        WorldMapComponent,
        LineChartComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
