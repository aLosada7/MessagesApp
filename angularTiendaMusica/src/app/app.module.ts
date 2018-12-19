import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { CancionesComponent } from './canciones/canciones.component';
import { DetallesComponent } from './detalles/detalles.component';
import { AgregarComponent } from './agregar/agregar.component';

//Services
import { CancionesService } from './services/canciones.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CancionesComponent,
    DetallesComponent,
    AgregarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
     { path: '', component: LoginComponent },
     { path: 'login', component: LoginComponent },
     { path: 'canciones', component: CancionesComponent },
     { path: 'cancion/:id', component: DetallesComponent },
     { path: 'agregar', component: AgregarComponent }
    ]),
    HttpModule
  ],
  providers: [CancionesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
