// Módulos
var express = require('express');
var app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "POST, GET, DELETE, UPDATE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    };
    // debemos poner todas las headers que se aceptan. Content-Type , token
    next();
});

var cors = require('cors');
app.use(cors());

var jwt = require('jsonwebtoken');
app.set('jwt',jwt);

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}));

var crypto = require('crypto');
var fileUpload = require('express-fileupload');
app.use(fileUpload());

var mongo = require('mongodb');
var swig  = require('swig');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var gestorBD = require("./modules/gestorBD.js");
gestorBD.init(app,mongo);

// routerUsuarioToken
var routerUsuarioToken = express.Router();
routerUsuarioToken.use(function(req, res, next) {
    // obtener el token, puede ser un parámetro GET , POST o HEADER
    var token = req.body.token || req.query.token || req.headers['token'];
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', function(err, infoToken) {
            if (err || (Date.now()/1000 - infoToken.tiempo) > 240 ){
                res.status(403)
                res.json({
                    acceso : false,
                    error: 'Token invalido o caducado'
                });
                // También podríamos comprobar que intoToken.usuario existe
                return;

            } else {
                // dejamos correr la petición
                res.usuario = infoToken.usuario;
                next();
            }
        });

    } else {
        res.status(403)
        res.json({
            acceso : false,
            mensaje: 'No hay Token'
        });
    }
});
// Aplicar routerUsuarioToken
app.use('/api/cancion', routerUsuarioToken);

//routerUsuarioSession
var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
	 console.log("routerUsuarioSession");
	  if ( req.session.usuario ) {
	    // dejamos correr la petición
	     next();
	  } else {
	     console.log("va a : "+req.session.destino)
	     res.redirect("/identificarse");
	  }
});

//Aplicar routerUsuarioSession
app.use("/canciones/agregar",routerUsuarioSession);
app.use("/publicaciones",routerUsuarioSession);
app.use("/cancion/comprar",routerUsuarioSession);
app.use("/compras",routerUsuarioSession);

//routerUsuarioAutor
var routerUsuarioAutor = express.Router();
routerUsuarioAutor.use(function(req, res, next) {
	 console.log("routerUsuarioAutor");
	 var path = require('path');
	 var id = path.basename(req.originalUrl);
	 // Cuidado porque req.params no funciona
	 // en el router si los params van en la URL.

	 gestorBD.obtenerCanciones(
			 { _id : mongo.ObjectID(id) }, function (canciones) {
		 console.log(canciones[0]);
		 if(canciones[0].autor == req.session.usuario ){
			 next();
		 } else {
		     res.redirect("/tienda");
		 }
	 })

});

//Aplicar routerUsuarioAutor
app.use("/cancion/modificar",routerUsuarioAutor);
app.use("/cancion/eliminar",routerUsuarioAutor);

//routerAudios
var routerAudios = express.Router();
routerAudios.use(function(req, res, next) {
	 console.log("routerAudios");
	 var path = require('path');
	 var idCancion = path.basename(req.originalUrl, '.mp3');

	 gestorBD.obtenerCanciones(
			 { _id : mongo.ObjectID(idCancion) }, function (canciones) {

		 if( canciones[0].autor == req.session.usuario ){
			 next();
		 } else {
             gestorBD.obtenerUsuarios(
                     { email : req.session.usuario }, function (usuarios) {

                 if ( usuarios[0].compras != null  ){
                     for(var i=0; i < usuarios[0].compras.length; i++ ){
                         if( usuarios[0].compras[i] == idCancion ){
                             next();
                             return;
                         }
                     }
                     res.redirect("/tienda");

                 } else {
                     res.redirect("/tienda");
                 }
             });



		 }
	 })

});

//Aplicar routerAudios
app.use("/audios/",routerAudios);




app.use(express.static('public'));

// Variables
app.set('port', 8081);
app.set('db','mongodb://admin2018:admin2018@ds241664.mlab.com:41664/messagesapp');
app.set('clave','abcdefg');
app.set('crypto',crypto);

//Rutas/controladores por lógica
require("./routes/rapicanciones.js")(app, gestorBD);

app.get('/', function (req, res) {
	res.send('Bienvenido a la API de mensajeria');
})

app.use( function (err, req, res, next ) {
    console.log("Error producido: " + err); //we log the error in our db
    if (! res.headersSent) {
        res.status(400);
        res.send("Recurso no disponible");
    }
});

// lanzar el servidor
app.listen(app.get('port'), function() {
	console.log("Servidor activo");
})
