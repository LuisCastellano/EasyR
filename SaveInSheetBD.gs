 // Crea una hoja oculta que guarda la cofiguracion y actua como base de datos.
    function saveValues(values, columnMailSolicitante, hojaConForm, admins) {

        try {
            var ss = SpreadsheetApp.getActiveSpreadsheet();
            var bd = ss.getSheetByName("BD(No modificar)");
            // Oculta la BD
            bd.hideSheet();
            //Almacena los valores.
            bd.getRange('b1').setValue(values);
            bd.getRange('b2').setValue(admins);
            bd.getRange('b3').setValue(columnMailSolicitante);
            bd.getRange('b6').setValue(hojaConForm);
            aviso("La configuración se ha guardado correctamente.");
            return true;

        } catch (e) {
            return false;
        }

    }



    function saveTemplate(new_template, name_template) {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)");
        bd.getRange('b4').setValue(name_template.toString());
        bd.getRange('b5').setValue(new_template.toString());

        aviso('Plantilla guardada con exito.');
    }












