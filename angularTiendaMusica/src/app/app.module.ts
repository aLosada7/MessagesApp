import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

//Components
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MensajesComponent } from './mensajes/mensajes.component';
import { DetallesComponent } from './detalles/detalles.component';
import { AgregarComponent } from './agregar/agregar.component';
import { RegistroComponent } from './registro/registro.component';

//Services
import { CancionesService } from './services/canciones.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MensajesComponent,
    DetallesComponent,
    AgregarComponent,
    RegistroComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot([
     { path: '', component: LoginComponent },
     { path: 'login', component: LoginComponent },
     { path: 'mensajes/:email', component: MensajesComponent },
     { path: 'agregar', component: AgregarComponent },
     { path: 'registro', component: RegistroComponent }
    ]),
    HttpModule
  ],
  providers: [CancionesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
