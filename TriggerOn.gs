  //Secuencia que se activa al recibir una nueva petición.
    function triggerOn() {
        try {
            var ss = SpreadsheetApp.getActiveSpreadsheet(),
                sheet = ss.getActiveSheet(),
                idSS = SpreadsheetApp.getActiveSpreadsheet().getId(),
                nameSheet = sheet.getName(),
                idreg = ID_Generator(),
                columnValidacion = getColIndexByName('*Validación', sheet),
                columnComentario = getColIndexByName('*Comentario adicional', sheet),
                us = typeUser(),
                petitions = getPetitions();

            //Comprueba el numero de peticiones para enviar un email de aviso si se acerca al límite.
            if (petitions[0] == petitions[1] - 6) {
                mailFewPetitions();
            } else if (petitions[0] == petitions[1]) {
                mailEndPetitions();
            }



            if (checKBloq(us) == true) {
                sheet.getRange(sheet.getLastRow(), columnValidacion).setValue("Petición no enviada.").setBackground('#EF9A9A');
                sheet.getRange(sheet.getLastRow(), columnComentario).setValue("Ha superado el limite de peticiones.").setBackground('#EF9A9A');
                return;
            }

            numPeticIncrement(); //Incrementa +1 las peticiones.

            //Asigna un id al registro.
            sheet.getRange(sheet.getLastRow(), 1).setValue(idreg);
            sheet.getRange(sheet.getLastRow(), columnValidacion).setValue("Esperando respuesta...");


            send_Email(idreg, idSS, nameSheet); //Envía el email con los datos correspondientes.
            return;

        } catch (e) {
            MailApp.sendEmail({
                to: 'luis.castellano@ieducando.com',
                name: "ERROR-EasyRequest",
                subject: 'ERROR-SendMail',
                htmlBody: 'ERROR: ' + e
            });
        }
    }
