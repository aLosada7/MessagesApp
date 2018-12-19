import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { CancionesService } from '../services/canciones.service';
@Component({
  selector: 'agregar-cancion',
  templateUrl: './agregar.component.html'
})
export class AgregarComponent {
  constructor(
    private cancionesService: CancionesService,
    private router: Router
  ) { }

  cancion = {}; // Importante {} para saber que es objeto

  agregarCancion() {
    var resObservable = this.cancionesService.agregarCancion(this.cancion);

    resObservable.subscribe(
      res => {
        console.log("AgregarComponent - Agregada Correctamente");
        this.router.navigate(['/canciones']);
      },
      error => {
        console.log("AgregarComponent - Error al agregar");
      }
    );

  }
}
