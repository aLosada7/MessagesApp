import { Component } from '@angular/core';
import { CancionesService } from '../services/canciones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'LoginComponente',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  constructor(
    private cancionesService: CancionesService,
    private router: Router
  ) { }

  email: string;
  password: string;

  identificarUsuario(): void {
    var resObservable = this.cancionesService.identificarUsuario(this.email, this.password);

    resObservable.subscribe(
      res => {
        this.router.navigate(['/canciones']);
        console.log("LoginComponent - Ir a la lista de canciones");
      },
      error => {
        console.log("LoginComponent - Mensaje de error");
      }
    );
  };

  identificarUsuarioPro() {
    var promesa = this.cancionesService.identificarUsuarioPro(this.email, this.password);

    promesa.then(
      retorno => {
        if (retorno) {
          this.router.navigate(['/canciones']);
          console.log("Login Promesa- Ir a la lista de canciones");
        } else {
          console.log("Login Promesa - Mensaje de error");
        }
      }
    );
  }
}
