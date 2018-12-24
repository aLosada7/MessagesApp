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
  usuarios;

  ngOnInit(): void {
    console.log("onInit - inicio");

    var resObservable = this.cancionesService.getUsuarios();
    resObservable.subscribe(
      res => {
        this.usuarios = res.json();
        console.log(this.usuarios);
      },
      error => {
        console.log("Error");
      }
    );
    console.log("onInit - final");
  };

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
