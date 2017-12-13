
    // Variables de conexión.
    var database = FirebaseApp.getDatabaseByUrl("https://backend-easyrequest.firebaseio.com/", "fQICYnwcvywK9zbPw1DK3lbxmVToP1haafJ7esXv"),
        nameUser = Session.getActiveUser().getEmail().toString(),
        domain = nameUser.split("@");



    //Al iniciar el complemento se cargan en la base de datos valores por defecto.
    function checkRegisteredUser() {
        var check = typeUser();
        if (check == 'd') { //Si es un dominio.
            var dom = [true, check];
            return dom;
        } else if (check == 'u') { //Si es usuario individual.
            var use = [true, 'u'];
            return use;
        }
        return false;
    }


    //Registra los datos de usuario en la BD segun la tabla que recibe (Dominio, Usuarios).
    function regUsuarioBD(tipoReg) {
        var userId = getUserId(),
            imgUrl = getProfile();
        
        //Si el usuario no existe, se registra.
        if (typeUser() == false) {
        if (tipoReg == 'u') {
                //El usuario se registra como individual.
                var data = {
                    "Name": nameUser,
                    "id_profile": userId,
                    "Num_max_peticiones": 50,
                    "Num_peticiones": 0,
                    "Bloqueo": 0,
                    "img_profile": imgUrl[1]
                };
                database.setData("Usuarios/"+userId, data);
                //aviso("Se ha registrado correctamente\nBienvenido a EasyRequest");
                alertBeta();
                return;
            } else if (tipoReg == 'd') {
                if (domain[1] == 'gmail.com') {
                    aviso("AVISO\n'gmail.com' no se puede registrar como dominio.\nPor favor, hágalo de forma individual");
                    return;
                }
                //El usuario se registra como dominio.
                var dominio = replaceIdDomain(domain[1]),
                    data = {
                    "Name": domain[1],
                    "id_domain": dominio,
                    "Num_max_peticiones": 50,
                    "Num_peticiones": 0,
                    "Bloqueo": 0
                };
                database.setData("dominios/" + dominio, data);
                aviso("Su dominio " + domain[1] + " se ha registrado correctamente\nBienvenido a EasyRequest");
                return;
            }
            //Si es un dominio.
        } else if (typeUser() == 'd') {
            aviso("El dominio " + domain[1] + " ya está registrado en EasyRequest");
            return;
            //Si es un usuario.
        } else {
            aviso("El usuario ya está registrado en EasyRequest");
            return;
        }
    }

    //Bloquea al usuario.
    function bloqUser() {
        //ESTO SOLO BLOQUEA USUARIOS, SIN IMPORTAR DE DONDE SE LE LLAME.LOS DOMINIOS NO ESTAN CONTEMPLADOS 
        var data = {
                "Bloqueo": 1
            },
            userId = getUserId();
        database.updateData("Usuarios/" + userId, data);
    }

    function bloqDomain() {
        var data = {
            "Bloqueo": 1
        },
            dominio = replaceIdDomain(domain[1]);
        database.updateData("dominios/" + dominio, data);
    }


    //Comprueba si el usuario esta bloqueado.
    function checKBloq(typeUs) {
        try {
            var userId = getUserId();
            if (typeUs == 'u') { //Si el usuario es individual
                //Comprueba bloqueo. Devuelve true si está bloqueado y false si no lo está.
                var bloqueo = database.getData("Usuarios/" + userId + "/Bloqueo");
                if (bloqueo == 0) { //si no está bloqueado.
                    //Comprueba el número de peticiones.
                    var petitions = getPetitions();

                    if (petitions[0] >= petitions[1]) { //Si ha superado el número de peticiones.
                        bloqUser();
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else if (typeUs == 'd') { //Si el usuario es dominio.
                //Comprueba bloqueo. Devuelve true si está bloqueado y false si no lo está.
                var dominio = replaceIdDomain(domain[1]),
                    bloqueo = database.getData("dominios/" + dominio + "/Bloqueo");

                if (bloqueo == 0) { //si no está bloqueado.
                    //Comprueba el número de peticiones.
                    var petitions = getPetitions();

                    if (petitions[0] >= petitions[1]) { //Si ha superado el número de peticiones.
                        bloqDomain();
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        } catch (e) {
            return;
        }
    }


    //Obtiene el numero de peticiones y el maximo que puede tener.
    function getPetitions() {
        var petitions,
            userId = getUserId(),
            typeUs = typeUser();
        if (typeUs == 'u') { //Si es usuario undividual
            var result = database.getData("Usuarios/" + userId);
            petitions = [result.Num_peticiones, result.Num_max_peticiones];
            return petitions;
        } else if (typeUs == 'd') { //Si es Dominio.
            var replacedId = replaceIdDomain(domain[1]),
                result = database.getData("dominios/" + replacedId);
            petitions = [result.Num_peticiones, result.Num_max_peticiones]; //Cambiar el 17 por algo genérico para qu cargue cualquier usuario.
            return petitions;
        }
    }


    //Incrementa +1 el numero de peticiones y comprueba si ha sobrepasado el limite de estas.
    function numPeticIncrement() {
        var userId = getUserId(),
            petitions = getPetitions(),
            typeUs = typeUser(),
            data = {
                "Num_peticiones": petitions[0] + 1
            };
        if (typeUs == 'u') {
            database.updateData("Usuarios/" + userId, data);
            return;
        } else if (typeUs == 'd') {
            var dominio = replaceIdDomain(domain[1]);
            database.updateData("dominios/" + dominio, data);
            return;
        } else {
            return;
        }
    }


//Devuelve si el usuario es individual o por dominio.
    function typeUser() {
        var queryParameters = {
            orderBy: "Name",
            equalTo: domain[1]
        },
            result = database.getData("dominios", queryParameters);

        if (Object.getOwnPropertyNames(result).length == 0) {
            var queryParameters = {
                orderBy: "Name",
                equalTo: nameUser
            };
            result = database.getData("Usuarios", queryParameters);

            if (Object.getOwnPropertyNames(result).length == 0) {
                return false;
            } else {
                return 'u';
            }
        } else {
            return 'd';
        }
    }