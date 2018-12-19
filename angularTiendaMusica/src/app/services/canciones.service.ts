import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
//import { toPromise } from 'rxjs/operators/toPromise';

@Injectable()
export class CancionesService {
  constructor(
    private http: Http,
  ) { }

  token;
  urlBase = "http://localhost:8081/api";

  getCanciones() {
    console.log(this.token);
    var url = this.urlBase + "/cancion";
    var headers = new Headers();
    headers.append('Content-Type', 'application/JSON');
    headers.append('token', this.token);

    var resObservable = this.http.get(url, { headers: headers });
    return resObservable;
  };

  getCancion(id) {
    var url = this.urlBase + "/cancion/" + id;
    var headers = new Headers();
    headers.append('Content-Type', 'application/JSON');
    headers.append('token', this.token);

    var resObservable = this.http.get(url, { headers: headers });
    return resObservable;
  };

  agregarCancion(cancion) {
    var url = this.urlBase + "/cancion";
    var body = cancion; // Suponemos que esta en formato JSON
    var headers = new Headers();
    headers.append('Content-Type', 'application/JSON');
    headers.append('token', this.token);

    var resObservable = this.http.post(url, body, { headers: headers });

    return resObservable;
  };

  eliminarCancion(id) {
    var url = this.urlBase + "/cancion/" + id;
    var headers = new Headers();
    headers.append('Content-Type', 'application/JSON');
    headers.append('token', this.token);

    var resObservable = this.http.delete(url, { headers: headers });
    return resObservable;
  };

  identificarUsuario(email, password) {
    //console.log("CancionesService email:" + email + " password:" + password);

    var url = this.urlBase + "/autenticar";
    var body = { "email": email, "password": password };
    var headers = new Headers();
    headers.append('Content-Type', 'application/JSON');

    var resObservable = this.http.post(url, body, { headers: headers });

    resObservable.subscribe(
      res => {
        this.token = res.json().token;
        console.log(this.token);
      },
      error => {
        console.log(error.json());
      }
    );

    return resObservable;
  };

  identificarUsuarioPro(email, password) {
    console.log("CancionesService e:" + email + " p:" + password);

    var url = this.urlBase + "/autenticar";
    var body = { "email": email, "password": password };
    var headers = new Headers();
    headers.append('Content-Type', 'application/JSON');

    return this.http.post(url, body, { headers: headers })
      .toPromise().then(
        res => {
          this.token = res.json().token;
          console.log(this.token);
          return true;
        },
        error => {
          return false;
        }
      );
  };

}
