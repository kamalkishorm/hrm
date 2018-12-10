import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { Http, HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { EmployeeComponent } from './employee/employee.component';
import { AdminComponent } from './admin/admin.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import {HrmService} from './hrm.service';
import { AppMaterialModule } from './app.material.module';

@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    AdminComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
        BrowserAnimationsModule,
        ChartsModule,
        FormsModule,
        HttpModule,
        NgbModule.forRoot(),
        SimpleNotificationsModule.forRoot(),
        // Ng4LoadingSpinnerModule.forRoot(),
        AppRoutingModule,
        NgxSpinnerModule,
        AppMaterialModule,
    AppRoutingModule
  ],
  providers: [HrmService],
  bootstrap: [AppComponent]
})
export class AppModule { }
