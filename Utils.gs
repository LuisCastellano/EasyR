    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                       Recoge los datos de la hoja de calculo activa                         ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function getData(sheet) {
        try {
            var startRow = 2, // Numero de la fila de comienzo donde se empezará a tratar los datos
                numRows = sheet.getLastRow() - 1; // Ultima fila a tratar
            var data = sheet.getRange(startRow, 1, numRows, sheet.getLastColumn()),// Seleccionamos el rango de datos a devolver
                values = data.getValues();// Nos hacemos con los valores
        } catch (e) {
            return false;
        }

        return values;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///        Obtiene el nombre del formulario asociado a la hoja de cálculo.                      ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function getNameForm() {
        var formUrl = SpreadsheetApp.getActiveSpreadsheet().getFormUrl(),
            form = FormApp.openByUrl(formUrl),
            nameForm = form.getTitle();
        return nameForm;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///       Devuelve el numero de columna segun su nombre.                                        ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function getColIndexByName(colName, sheet) {
        var numColumns = sheet.getLastColumn(),
            row = sheet.getRange(1, 1, 1, numColumns).getValues();
        for (var i in row[0]) {
            var name = row[0][i];
            if (name == colName) {
                return parseInt(i) + 1;
            }
        }
        return -1;
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                               Genera un ID aleatoriamente.                                  ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function ID_Generator() {
        return 'ID_' + Math.random().toString(36).substr(2, 9);
    }



   
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                              Capturar nombre de las columnas.                               ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function captureColumns() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            sheet = ss.getActiveSheet(),
            range = sheet.getDataRange(),
            values = range.getValues();
        return values[0];
    }



    ////////////////////////////////////////////////////////////////////////////////////////////////
    ///                              Captura nombre de las hojas dejando fuera la hoja BD.       ///
    ////////////////////////////////////////////////////////////////////////////////////////////////
    function captureSheets() {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            hojas = ss.getSheets(),
            j = 0,
            valores_hojas = [];
        for (var i = 0; i < hojas.length; i++) {
            if (hojas[i].getName() != "BD(No modificar)") {
                valores_hojas[j] = hojas[i].getName();
                j++;
            }
        }
        return valores_hojas;
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /// Muestra una ventana de alerta con el texto recibido por parametros.                         ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function aviso(str) {
    try{
        var ui = SpreadsheetApp.getUi(); // Captura interfaz de usuario.
        ui.alert(str);
        }catch(e){
        "Error al mostrar el aviso: "+console.log(e);
        }
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///  Comprueba que el email es válido.                                                          ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function validarEmail(validators) {
        var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

        for (var i = 0; i < validators.length; i++) {


            if (!expr.test(validators[i])) {
                return false;
            }
        }
        return true;
    }




    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                 captura los datos de la configuración actual.                               ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    function viewConfig() {

        try {
            var ss = SpreadsheetApp.getActiveSpreadsheet(),
                bd = ss.getSheetByName("BD(No modificar)"),
                values = bd.getRange('b1:b4').getValues();
            return values;
        } catch (e) {
            return false;
        }
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                               Formatea la fecha a dd/mm/yyyy.                               ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function formattedDate(date, cont) {
    
        var d = new Date(date || Date.now());
        var month = '' + (d.getMonth()+1);
        var   day = '' + (d.getDate());
        if(cont > 0){//Si no es TimeStamp
         day = '' + (d.getDate()+1);
        }
        
        var year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        //var fechaGmt = new Date(Date.UTC(year, month, day));
        return [day, month, year].join('/');
        console.log("fecha: "+fechaGmt);
        //return fechaGmt;
    }



    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                      Comprueba si el usuario actial es el propietario.                      ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function isOwner() {
        try {
            var prop = SpreadsheetApp.getActiveSpreadsheet().getOwner().getEmail(),
                propName = SpreadsheetApp.getActiveSpreadsheet(),
                currentUser = Session.getActiveUser().getEmail();

            if (prop == currentUser) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            aviso("Ha ocurrido un error, reinicie el complemento.")
        }

    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                      Captura el perfil de usuario de Google+                                ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function getProfile() {
        var person = Plus.People.get('me'),
            name = person.getDisplayName(),
            urlImg = person.getImage().getUrl(),
            profileData = [name, urlImg];
        return profileData;
    }
    
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                      Devuelve el nombre de la plantilla actual                               ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function getNameTemplate() {
    var ss = SpreadsheetApp.getActiveSpreadsheet(),
        bd = ss.getSheetByName("BD(No modificar)"),
        nameTemplate = bd.getRange('B4').getValue();
        
        return nameTemplate;
    }
    

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    ///                      Captura el ID de usuario de Google+                                    ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////

    function getUserId() {
        var person = Plus.People.get('me');
        return person.getId();
    }
    
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    /// Configura la región y zona oraria para evitar arrores de fecha y hora                       ///
    ///////////////////////////////////////////////////////////////////////////////////////////////////
    
    function setLocaleAndTime(){
    try{
    var ss = SpreadsheetApp.getActiveSpreadsheet(),
        actual_locale = ss.getSpreadsheetLocale(),
        actual_timeZone = ss.getSpreadsheetTimeZone();
    if(actual_locale != 'es_ES') {
        aviso("Se ha configurado la región/zona horaria.\nPor favor, vuelva a iniciar el complemento.");
        ss.setSpreadsheetLocale('es_ES');
        ss.setSpreadsheetTimeZone('Europe/Madrid');
        
        return;
    }else if(actual_timeZone =='Europe/Madrid'){
        return;
      }else{
        ss.setSpreadsheetTimeZone('Europe/Madrid');
        return;
      }
      }catch(e){
      aviso("No se ha podido configurar la región/zona horaria.\nPuede que se vean afectados los valores fecha y hora.");
      }
    }
    