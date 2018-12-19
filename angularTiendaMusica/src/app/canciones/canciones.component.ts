import { Component, OnInit } from '@angular/core';
import { CancionesService } from '../services/canciones.service';
@Component({
  selector: 'canciones',
  templateUrl: './canciones.component.html'
})
export class CancionesComponent implements OnInit {
  constructor(
    private cancionesService: CancionesService,
  ) { }

  canciones;

  ngOnInit(): void {
    console.log("onInit - inicio");

    var resObservable = this.cancionesService.getCanciones();
    resObservable.subscribe(
      res => {
        this.canciones = res.json();
        console.log(this.canciones);
      },
      error => {
        console.log("Error");
      }
    );
    console.log("onInit - final");
  };

  eliminarCancion(id) {
    var resObservable = this.cancionesService.eliminarCancion(id);
    resObservable.subscribe(
      res => {
        this.canciones = this.canciones.filter(cancion => cancion._id != id);
        // filtramos y conservamos las canciones con _id distinto al borrado
      },
      error => {
        console.log("Error");
      }
    );
  }

}
