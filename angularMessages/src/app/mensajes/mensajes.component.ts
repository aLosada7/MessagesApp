import { Component, OnInit } from '@angular/core';
import { MensajesService } from '../services/mensajes.service';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'mensajes',
  templateUrl: './mensajes.component.html'
})
export class MensajesComponent implements OnInit {
  constructor(
    private mensajesService: MensajesService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  usuariosHablando = [];
  usuariosContacto = [];
  usuarios = [];
  allMessagesUser;
  mensajes;
  destinatario;
  contenido = {
    iniciador : '',
    receptor : '',
    envia: '',
    message : '',
    leido: 'no'
  };

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let email = params['email'];
      console.log(email);
      this.contenido.envia=email;

      console.log("onInit - inicio");
      //Todos los usuarios de la aplicación
      var resObservable = this.mensajesService.getUsuarios();
      resObservable.subscribe(
        res => {
          this.usuarios = res.json();
          console.log(this.usuarios);
          var usuario;
          for (var _i = 0; _i < this.usuarios.length; _i++) {
            usuario = this.usuarios[_i];
            if (usuario.email == this.contenido.envia) {
              this.usuarios.splice(_i, 1);
            }
          }
        },
        error => {
          console.log("Error");
        }
      );
      console.log("onInit - final");
    });
    console.log("aqui");
    var resObservable = this.mensajesService.getAllUserMessages(this.contenido.envia);
    resObservable.subscribe(
      res => {
        console.log(res);
        if ((<any>res)._body !== "[]") {
          this.allMessagesUser = res.json();
          console.log(this.allMessagesUser);
          var message;
          for (var _i = 0; _i < this.allMessagesUser.length; _i++) {
            message = this.allMessagesUser[_i];
              if (this.usuariosContacto.indexOf(message.receptor) == -1 && message.receptor != this.contenido.envia){
                this.usuariosContacto.push(message.receptor);
              }else if (this.usuariosContacto.indexOf(message.iniciador) == -1 && message.iniciador != this.contenido.envia) {
                this.usuariosContacto.push(message.iniciador);
              }
          }
          console.log(this.usuariosContacto);
          var cont=0;
          for(var _i = 0; _i < this.usuariosContacto.length; _i++){
            var usuario=this.usuariosContacto[_i];
            console.log(usuario);
            cont=0;
            for(var _j = 0; _j < this.allMessagesUser.length; _j++){
              message = this.allMessagesUser[_j];
              console.log(message.receptor);
              if((usuario == message.iniciador || usuario==message.receptor) && message.envia == usuario && message.leido == "no"){
                cont++;
              }
            }
            this.usuariosHablando.push({'email': usuario, 'numNoLeidos': cont});
          }
          console.log(this.usuariosHablando);
        }
      },
      error => {
        console.log("Error");
      }
    );

  };

  onItemClick(event, item){
    console.log("Checking passed item: ", item);
    this.destinatario=item;
    //this.contenido. =item;
    this.loadConversation();
    console.log("onInit - final");
  };

  sendMessage(){
    console.log("Remitente: "+this.contenido.envia);
    console.log("Mensaje: "+this.contenido.message);

    var resObservable = this.mensajesService.enviarMensaje(this.contenido);

    resObservable.subscribe(
      res => {
        console.log("Mensaje agregado Correctamente");
        this.loadConversation();
      },
      error => {
        console.log("AgregarComponent - Error al agregar");
      }
    );
  }

  loadConversation(){
    var resObservable = this.mensajesService.getMensajes(this.contenido.envia, this.destinatario);
    resObservable.subscribe(
      res => {
        if((<any>res)._body != "[]") {
          this.mensajes = res.json();
          //console.log(this.mensajes);
          this.contenido.iniciador = this.contenido.envia;
          this.contenido.receptor = this.destinatario;
          for (let message of this.mensajes) {
            if (message.leido == "no" && message.envia != this.contenido.envia) {
              message.leido = "si";
              var update = this.mensajesService.marcarLeido(message);

              update.subscribe(
                res => {
                  console.log("Mensaje leído Correctamente");
                },
                error => {
                  console.log("AgregarComponent - Error al agregar");
                }
              );
            }
          }
        }else{
          resObservable = this.mensajesService.getMensajes(this.destinatario , this.contenido.envia);
          resObservable.subscribe(
            res => {
              console.log(res);
              if((<any>res)._body.length > 0) {
                this.mensajes = res.json();
                console.log(this.mensajes);
                this.contenido.iniciador = this.destinatario;
                this.contenido.receptor = this.contenido.envia;
                for (let message of this.mensajes) {
                  if (message.leido == "no" && message.envia != this.contenido.envia) {
                    message.leido = "si";
                    var update = this.mensajesService.marcarLeido(message);

                    update.subscribe(
                      res => {
                        console.log("Mensaje leído Correctamente");
                      },
                      error => {
                        console.log("AgregarComponent - Error al agregar");
                      }
                    );
                  }
                }
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
  };

  refresh() {
    console.log("aqui");
    this.router.navigate(['/login']);
  };



}
