import { Component, OnInit } from '@angular/core';
import { CancionesService } from '../services/canciones.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'canciones',
  templateUrl: './canciones.component.html'
})
export class CancionesComponent implements OnInit {
  constructor(
    private cancionesService: CancionesService,
    private route: ActivatedRoute
  ) { }

  usuarios;
  contenido = {
    remitente : '',
    destinatario : '',
    message : ''
  };

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let email = params['email'];
      console.log(email);
      this.contenido.remitente=email;

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
    })
  };

  onItemClick(event, item){
    console.log("Checking passed item: ",item);
    this.contenido.destinatario=item;
  }

  sendMessage(){
    console.log("Remitente: "+this.contenido.remitente);
    console.log("Destinatario: "+this.contenido.destinatario); //also on token
    console.log("Mensaje: "+this.contenido.message);

    var resObservable = this.cancionesService.enviarMensaje(this.contenido);

    resObservable.subscribe(
      res => {
        console.log("Mensaje agregado Correctamente");
      },
      error => {
        console.log("AgregarComponent - Error al agregar");
      }
    );
  }

}
