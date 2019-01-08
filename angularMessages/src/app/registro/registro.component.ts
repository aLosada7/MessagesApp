import { Component } from '@angular/core';
import { MensajesService } from '../services/mensajes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'RegistroComponent',
  templateUrl: './registro.component.html'
})
export class RegistroComponent {

  constructor(
    private mensajesService: MensajesService,
    private router: Router
  ) { }

  usuario = {}; // Importante {} para saber que es objeto

  registrarUsuarioPro() {
    var resObservable = this.mensajesService.registrarUsuarioPro(this.usuario);

    resObservable.subscribe(
      res => {
        console.log("AgregarComponent - Agregado Correctamente");
        this.router.navigate(['/login']);
      },
      error => {
        console.log("AgregarComponent - Error al agregar");
      }
    );
  }
}
