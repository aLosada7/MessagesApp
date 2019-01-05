import { Component } from '@angular/core';
import { CancionesService } from '../services/canciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'RegistroComponent',
  templateUrl: './registro.component.html'
})
export class RegistroComponent {

  constructor(
    private cancionesService: CancionesService,
    private router: Router
  ) { }

  usuario = {}; // Importante {} para saber que es objeto

  registrarUsuarioPro() {
    var resObservable = this.cancionesService.registrarUsuarioPro(this.usuario);

    resObservable.subscribe(
      res => {
        console.log("AgregarComponent - Agregado Correctamente");
        this.router.navigate(['/mensajes/'+this.usuario.email]);
      },
      error => {
        console.log("AgregarComponent - Error al agregar");
      }
    );
  }
}
