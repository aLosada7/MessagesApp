import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { CancionesService } from '../services/canciones.service';
@Component({
  selector: 'detalles',
  templateUrl: './detalles.component.html'
})
export class DetallesComponent implements OnInit {
  constructor(
    private cancionesService: CancionesService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  cancion = { "_id": 1, "nombre": "Can 1", "genero": "pop", "precio": "4" };

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      console.log(id);

      var resObservable = this.cancionesService.getCancion(id);
      resObservable.subscribe(
        res => {
          this.cancion = res.json();
        },
        error => {
          console.log("Error");
        }

      );
    })
  }

  volver(){
   this.location.back();
  }

}
