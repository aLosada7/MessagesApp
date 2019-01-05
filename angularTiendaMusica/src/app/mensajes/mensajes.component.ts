import { Component, OnInit } from '@angular/core';
import { CancionesService } from '../services/canciones.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'mensajes',
  templateUrl: './mensajes.component.html'
})
export class MensajesComponent implements OnInit {
  constructor(
    private cancionesService: CancionesService,
    private route: ActivatedRoute
  ) { }

  usuarios;
  mensajes;
  destinatario;
  contenido = {
    iniciador : '',
    receptor : '',
    envia: '',
    message : ''
  };

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let email = params['email'];
      console.log(email);
      this.contenido.envia=email;

      console.log("onInit - inicio");
//Todos los usuarios de la aplicación
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
    });
  };

  onItemClick(event, item){
    console.log("Checking passed item: ", item);
    this.destinatario=item;
    //this.contenido. =item;
    var resObservable = this.cancionesService.getMensajes(this.contenido.envia, item);
    resObservable.subscribe(
      res => {
        console.log(res);
          if(res._body != "[]") {
            this.mensajes = res.json();
            console.log(this.mensajes);
            this.contenido.iniciador = this.contenido.envia;
            this.contenido.receptor = item;
          }else{
            resObservable = this.cancionesService.getMensajes(item , this.contenido.envia);
            resObservable.subscribe(
              res => {
                console.log(res);
                if(res._body.length > 0) {
                  this.mensajes = res.json();
                  console.log(this.mensajes);
                  this.contenido.iniciador = item;
                  this.contenido.receptor = this.contenido.envia;
                }
              },
              error => {
                console.log("Error");
              }
            );
          }
      },
      error => {
        console.log("Error");
      }
    );
    console.log("onInit - final");
  };

  sendMessage(){
    console.log("Remitente: "+this.contenido.envia);
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
