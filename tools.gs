  //Crea un string de opciones para añadirlas al desplegable del modulo nde validación.
    function fillSelect() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)"),
            values = bd.getRange('b1').getValue().split(","),
            options = '<option style="font-weight:bold;">' + values[0] + '</option>';
        for (var i = 1; i < values.length; i++) {
            options = options + '<option style="font-weight:bold;">' + values[i] + '</option>'
        }
        return options;
    }

    //Metodo DoPost comunicar correo y script.
    function doPost(e) {
        var val = e.parameter.validation,
            comm = e.parameter.coment,
            regId = e.parameter.id_reg,
            nameSh = e.parameter.name_sheet,
            idSs = e.parameter.id_ss,
            user = e.parameter.usuario,
            petic = e.parameter.peticion,
            name_f = e.parameter.name_form;



        // Loads the index.html file
        var t = HtmlService.createTemplateFromFile('index');
        t.validation = val;
        t.coment = comm;
        t.id_reg = regId;
        t.id_ss = idSs;
        t.name_sheet = nameSh;
        t.name_form = name_f;
        t.usuario = user;
        t.peticion = petic;
        fun(val, comm, regId, idSs, nameSh, user, name_f);
        return t.evaluate();

    }



    //Detecta la celda que debe modificar segun su id.
    function fun(val, comm, regId, idSs, nameSh, usuario, name_f) {

        var ss = SpreadsheetApp.openById(idSs), //seleccionamos la spreadsheet.
            sheet = ss.getSheetByName(nameSh), //Selecciona la hoja por su nombre.
            columnValidacion = getColIndexByName('*Validación', sheet),
            columnComentario = getColIndexByName('*Comentario adicional', sheet),
            data = sheet.getRange(2, 1, (sheet.getLastRow() - 1), 1),
            ids = data.getValues(); //Captura todos los ids
        for (var i = 0; i < ids.length; i++) { //Recorre los ids para compararlo con el del mail
            if (ids[i].toString() == regId.toString()) {
                sheet.getRange(i + 2, columnValidacion).setValue(val).setFontWeight("bold");
                sheet.getRange(i + 2, columnComentario).setValue(comm);
                sendEmailDest(usuario, name_f, val, comm);
                return;
            }
        }
    }



    //Comprueba que no hay triggers ON_FORM_SUBMIT, si es asi, lo crea;
    function getTriggers() {
        var sheet = SpreadsheetApp.getActive(),
            ss = SpreadsheetApp.getActiveSpreadsheet(),
            triggers = ScriptApp.getUserTriggers(ss);//Obtiene los triggers

        if (triggers.length == 0.0) {
            ScriptApp.newTrigger("triggerOn")
                .forSpreadsheet(sheet)
                .onFormSubmit()
                .create();
            return;
        }
        //recorre los triggers   
        for (var i = 0; i < triggers.length; i++) {
            if (triggers[i].getEventType().toString() == 'ON_FORM_SUBMIT') {
                return;
            } else {
                ScriptApp.newTrigger("triggerOn")
                    .forSpreadsheet(sheet)
                    .onFormSubmit()
                    .create();
            }
        }

    }



    //Añade una columna oculta al principio en la que se almacenean los ids de cada registro
    function addColumnID() {
        var sheet = SpreadsheetApp.getActive();
        var range = sheet.getRange("A1");
        if (range.getValue() == "ID-Reg") {
            return;
        } else {
            sheet.insertColumnBefore(1).hideColumn(range);
            range.setValue("ID-Reg");
            return;
        }
    }



    //Elimina los disparadores del proyecto activo de tipo 'ON_FORM_SUBMIT'.
    function eliminarTrigger() {
        var sheet = SpreadsheetApp.getActive();
        //Obtiene los triggers
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        var triggers = ScriptApp.getUserTriggers(ss);

        if (triggers.length == 0.0) {
            return;
        }
        //recorre los triggers
        for (var i = 0; i < triggers.length; i++) {
            if (triggers[i].getEventType().toString() == 'ON_FORM_SUBMIT') {
                ScriptApp.deleteTrigger(triggers[i]);
                return;
            } else {

            }
        }

    }



    //Añade las columnas de validacion si no existen.
    function addColumnRespuesta() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            sheet = ss.getSheetByName(ss.getSheetByName("BD(No modificar)").getRange('B6').getValue()),
            nameColumns = captureColumns(),
            activeSheet = ss.getActiveSheet(),
            contv = 0,
            contc = 0;

        for (var i = 0; i < nameColumns.length; i++) {

            if (nameColumns[i] == '*Validación') {} else {
                contv++
            }
            if (nameColumns[i] == '*Comentario adicional') {} else {
                contc++
            }
        }
        if (contv == nameColumns.length) { //No esta creada la columna 'validacion'.
            activeSheet.getRange(1, activeSheet.getLastColumn() + 1).setValue('*Validación').setFontWeight("bold").setBackground("#2196F3").setFontColor("#FFFFFF");
            activeSheet.setColumnWidth(activeSheet.getLastColumn(), 150);
        }
        if (contc == nameColumns.length) { //No esta creada la columna 'Comentario adicional'.
            activeSheet.getRange(1, activeSheet.getLastColumn() + 1).setValue('*Comentario adicional').setFontWeight("bold").setBackground("#2196F3").setFontColor("#FFFFFF");
            activeSheet.setColumnWidth(activeSheet.getLastColumn(), 250);
        }
        return;
    }


    //Comprueba que la hoja tiene un formulario asociado.
    function checkForm() {
        var ss = SpreadsheetApp.getActiveSpreadsheet();
        if (ss.getFormUrl() == null) {
            return false;
        } else {
            return true;
        }
    }


    //Comprueba si el complemento esta activado.
    function checkOnOff() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            triggers = ScriptApp.getUserTriggers(ss); //Obtiene los triggers
        

        if (triggers.length == 0.0) {
            return false;
        }
        //recorre los triggers
        for (var i = 0; i < triggers.length; i++) {
            if (triggers[i].getEventType().toString() == 'ON_FORM_SUBMIT') {
                return true;
            }
        }
        return false;
    }





    //Detecta el indice de validación para rellenar la grafica.
    function fillGraph() {

        try {
            var ss = SpreadsheetApp.getActiveSpreadsheet(),
                bd = ss.getSheetByName("BD(No modificar)"),
                sheet = ss.getActiveSheet(),
                ncol = getColIndexByName("*Validación", sheet),
                values = sheet.getRange(2, ncol, sheet.getLastRow() - 1).getValues(),
                desplegable_values = bd.getRange('b1').getValue().split(","),
                esperando = 0.0,
                otros = 0, //Valores agenos al complemento.
                result = new Array(desplegable_values.length),
                graphContent = new Array((desplegable_values.length + 1));


            for (var a = 0; a < result.length; a++) {
                result[a] = 0
            } //Iguala a 0 todas las posiciones del array,convirtiendolo en un array de contadores

            //recorre los valores de la columna validación.
            for (var i = 0; i < values.length; i++) {
                if (values[i] == 'Esperando respuesta...') {
                    esperando++;
                    continue;
                } //contador de validaciones en espera.
                for (var j = 0; j < desplegable_values.length; j++) { //recorre los valores del desplegable
                    if (values[i].toString() == desplegable_values[j].toString()) {

                        result[j]++; //Aumenta el contador asignado a cada valor del desplegable segun su comparación.
                        otros--
                    }

                }
                otros++;

            }
            //inserta los datos de validación de la hoja en un array, en el formato correcto para google charts.
            for (var f = 0; f < graphContent.length; f++) {
                graphContent[f] = [desplegable_values[f], result[f]];

            }
            graphContent.unshift(['Validación', 'nº']); //Agrega el valor al principio del array sin sustituir el actual.
            graphContent[graphContent.length] = ['Esperando respuesta', esperando];
            graphContent[graphContent.length] = ['Otros', otros];
            return graphContent;

        } catch (e) {
            if (e == 'Exception: Las coordenadas o dimensiones del intervalo no son válidas.') {

                return false;
            }
        }
    }


    //Captura el email del usuario de la fila a modificar.
    function getMailUser(bd, ss) {

        var colMailUser = bd.getRange('b3').getValue(),
            sheet = ss.getActiveSheet(),
            index = getColIndexByName(colMailUser, sheet),
            mailUser = sheet.getRange(sheet.getLastRow(), index).getValue();
        return mailUser;

    }


    //Crea las variables para suplir en la plantilla.
    function templateValues() {
        var values = captureColumns(),
            replaceValues = [];
        for (var i = 1; i < values.length; i++) {
            if (values[i] == '*Validación' || values[i] == '*Comentario adicional' || values[i] == 'Responsable de aprobación') {
                continue;
            } else {

                replaceValues[i - 1] = '{{' + values[i] + '}}';
            }
        }
        return replaceValues;
    }

    // crea la bd de plantillas.
    function createDB() {
        var ss = SpreadsheetApp.getActiveSpreadsheet();

        if (!ss.getSheetByName("BD(No modificar)")) {
            ss.insertSheet("BD(No modificar)");
            var bd = ss.getSheetByName("BD(No modificar)");
            // Oculta la BD
            bd.hideSheet().protect();

            bd.getRange('a1').setValue('Valores validación').setFontWeight('bold');
            bd.getRange('a3').setValue('Columna de usuario').setFontWeight('bold');
            bd.getRange('a4').setValue('Nombre plantilla').setFontWeight('bold');
            bd.getRange('a5').setValue('Plantilla').setFontWeight('bold');
            bd.getRange('a6').setValue('Hoja de peticiones').setFontWeight('bold');
            return;
        }
        return;
    }

    //Devuelve el nombre de la plantilla actual
    function returnNameTemplate() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)");
        return bd.getRange('b4').getValue();
    }

    //Devuelve la plantilla actual
    function returnTemplate() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)");

        return bd.getRange('b5').getValue();

    }

    //Comprueba si hay una plantilla creada.
    function templateExist() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)");
        if (bd.getRange('b5').getValue() == "") {
            return false;
        } else {
            return true;
        }

    }


    //devuelve los valores del ultimo registro.
    function getRegValues() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            sheet = ss.getActiveSheet(),
            valores_registro = [],
            datos = getData(sheet); // Recogemos los valores pasandole como parametro la hoja.

        if (datos == false) {
            return
        };
        datos = datos[datos.length - 1];
        for (var i = 0; i < datos.length - 1; i++) {
            valores_registro[i] = datos[i + 1];

        }

        return valores_registro;
    }


    //Reemplaza los valores en la plantilla y la devuelve.
    function replaceTemplate() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)"),
            template = bd.getRange('b5').getValue(),
            valores_registro = getRegValues(),
            cont =0,
            replaceValues = templateValues();

        for (var i = 0; i < valores_registro.length; i++) {
            if (typeof valores_registro[i] == 'object') {                                 //Poner un contador para evitar el timestamp
                valores_registro[i] = formattedDate(valores_registro[i].toString(),cont);
                cont++;
            }
            template = template.replace(replaceValues[i], valores_registro[i]);
        }
        return template;
    }


    //Añade al formulario la eleccion del responsable de validación.
    function addSelectValidator(validators) {
        var checkitem = checkSelectValidator();
        if (checkitem == false) { //si la pregunta no existe...se crea.
            var ss = SpreadsheetApp.getActiveSpreadsheet(),
                sheet = ss.getActiveSheet(),
                formUrl = ss.getFormUrl(),
                form = FormApp.openByUrl(formUrl);
            // Añade un checkBox item al formulario con las opciones indicadas en el array que recibe por parametros.

            var itemValidator = form.addMultipleChoiceItem();
            itemValidator.setTitle('Responsable de aprobación');
            itemValidator.setChoiceValues(validators);
            return;
        }

        checkitem.setChoiceValues(validators);
        return;
    }


    function getAdminUsers() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)"),
            admins = bd.getRange('b2').getValue().split(",");
        return admins;
    }


    //Comprueba que la pregunta del formulario "Responsable de aprobación" no exista.
    function checkSelectValidator() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            sheet = ss.getActiveSheet(),
            formUrl = ss.getFormUrl(),
            form = FormApp.openByUrl(formUrl),
            items = form.getItems();
        for (var i = 0; i < items.length; i++) {
            if (items[i].getTitle().toString() == "Responsable de aprobación") {
                return items[i].asMultipleChoiceItem();
            }
        }
        return false;
    }

    //Envia un email al usuario avisando de la proximidad al límite de peticiones.
    function mailFewPetitions() {
        var user = Session.getActiveUser();
        MailApp.sendEmail({
            to: user,
            name: "EasyRequest",
            subject: "AVISO: Easy Request",
            htmlBody:

                "<html>" +
                "<head>" +
                "<style>#txt{color:#424242;font-weight: bold}</style>" +
                "</head>" +
                "<body>" +
                "<h1><p style='color:#0288D1'><b>Easy Request</b></p></h1><hr>" +
                "<p id='txt'>AVISO:</p>" +
                "<p id='txt'>Se acerca al límite de peticiones disponibles.</p>" +
                "<p id='txt'>Peticiones restantes: 5</p>" +
                "</body>" +
                "</html>"
        });
    }

    function mailEndPetitions() {
        var user = Session.getActiveUser();
        MailApp.sendEmail({
            to: user,
            name: "EasyRequest",
            subject: "AVISO: Easy Request",
            htmlBody:

                "<html>" +
                "<head>" +
                "<style>#txt{color:#424242;font-weight: bold}</style>" +
                "</head>" +
                "<body>" +
                "<h1><p style='color:#0288D1'><b>Easy Request</b></p></h1><hr>" +
                "<p id='txt'>AVISO:</p>" +
                "<p id='txt'>Ha alcanzado el límite de peticiones disponibles.</p>" +
                "<p style='color:#424242'>*Las peticiones quedarán registradas, pero no recibirá el email de validación.</p>" +
                "</body>" +
                "</html>"
        });
    }




    //Modifica el caracter '.' por  '!' del dominio para utilizarlo como id.
    function replaceIdDomain(dominio) {
        var replacedDomain = dominio.replace(".", "!");
        return replacedDomain;
    }


    //Captura los valores de validacion de bd de la hoja
    function getValidationValues() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)"),
            values = bd.getRange('b1').getValue().split(",");
        return values;
    }