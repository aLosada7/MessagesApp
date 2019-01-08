import { Component } from '@angular/core';
import { MensajesService } from './services/mensajes.service';
// Aqui no lleva ../ no está en una carpeta.
@Component({
 selector: 'app-root',
 templateUrl: './app.component.html',
 styleUrls: ['./app.component.css']
})
export class AppComponent {
 title = 'Angular Tienda Música';

 constructor(
 private mensajesService: MensajesService
 ) { }

}
