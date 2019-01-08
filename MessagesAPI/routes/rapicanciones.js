module.exports = function(app, gestorBD) {

    app.get("/api/cancion", function(req, res) {
        gestorBD.obtenerCanciones( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/usuarios", function(req, res) {
        gestorBD.obtenerUsuarios( {} , function(canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.get("/api/mensajesUser/:user", function(req, res) {
        var criterio = { "iniciador" : req.params.user}
        var allMessages = [];

        gestorBD.obtenerAllMensajes(criterio,function(mensajes){
            if ( mensajes == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                for(message of mensajes){
                    allMessages.push(message);
                }

            }
        });

        criterio = { "receptor" : req.params.user}

        gestorBD.obtenerAllMensajes(criterio,function(mensajes){
            if ( mensajes == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                for(message of mensajes){
                    allMessages.push(message);
                }
                res.send( JSON.stringify(allMessages) );
            }
        });
    });

    app.post('/api/marcarLeido/:id', function (req, res) {

        var id = req.params.id;
        var criterio = { "_id" : gestorBD.mongo.ObjectID(id)  };

        console.log(req.body);

        var mensaje={
            'iniciador': req.body.iniciador,
            'receptor': req.body.receptor,
            'envia': req.body.envia,
            'messsage': req.body.message,
            'leido': 'si'
        }

        gestorBD.modificarMensaje(criterio, mensaje, function(result) {
            if (result == null) {
                res.send("Error al modificar ");
            } else {
                if( result == null){
                    res.status(500);
                    res.json({
                        error : "se ha producido un error"
                    })
                } else {
                    res.status(200);
                }
            }
        });

    })

    app.get("/api/mensajes/:iniciador/:receptor", function(req, res) {
        var criterio = { "iniciador" : req.params.iniciador,
                        "receptor" : req.params.receptor }

        gestorBD.obtenerMensajes(criterio,function(mensajes){
            if ( mensajes == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(mensajes) );
            }
        });
    });

    app.get("/api/cancion/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.obtenerCanciones(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones[0]) );
            }
        });
    });

    app.delete("/api/cancion/:id", function(req, res) {
        var criterio = { "_id" : gestorBD.mongo.ObjectID(req.params.id)}

        gestorBD.eliminarCancion(criterio,function(canciones){
            if ( canciones == null ){
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send( JSON.stringify(canciones) );
            }
        });
    });

    app.post("/api/cancion", function(req, res) {
        var cancion = {
            nombre : req.body.nombre,
            genero : req.body.genero,
            precio : req.body.precio,
        }
        // ¿Validar nombre, genero, precio?

        gestorBD.insertarCancion(cancion, function(id){
            if (id == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje : "canción insertarda",
                    _id : id
                })
            }
        });

    });

    app.post("/api/registrarusuario", function(req, res) {
      var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
          .update(req.body.password).digest('hex');

        var usuario = {
            email : req.body.email,
            password : seguro
        }
        // ¿Validar nombre, genero, precio?

        gestorBD.insertarUsuario(usuario, function(id){
            if (id == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje : "usuario insertado",
                    _id : id
                })
            }
        });

    });

    app.post("/api/autenticar/", function(req, res) {
        var seguro = app.get("crypto").createHmac('sha256', app.get('clave'))
            .update(req.body.password).digest('hex');

        var criterio = {
            email : req.body.email,
            password : seguro
        }

        gestorBD.obtenerUsuarios(criterio, function(usuarios) {
            if (usuarios == null || usuarios.length == 0) {
                res.status(500);
                res.json({
                    autenticado : false
                })
            } else {
                var token = app.get('jwt').sign(
                    {usuario: criterio.email , tiempo: Date.now()/1000},
                    "secreto");
                res.status(200);
                res.json({
                    autenticado: true,
                    token : token
                });
            }

        });
    });

    app.post("/api/enviarMensaje", function(req,res){
        console.log(req.body);

        var mensaje=req.body;

        gestorBD.insertarMensaje(mensaje, function(id){
            if (id == null) {
                res.status(500);
                res.json({
                    error : "se ha producido un error"
                })
            } else {
                res.status(201);
                res.json({
                    mensaje : "canción insertarda",
                    _id : id
                })
            }
        });
    })

}
