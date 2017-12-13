    function editValidator() {
        var html = HtmlService.createHtmlOutputFromFile('configEditValidator')
            .setWidth(500)
            .setHeight(200);
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Responsables de validación');

    }

    function modificarValidadores(validadores) {

        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)");
        bd.getRange('b2').setValue(validadores);
        aviso("Se ha modificado correctamente");
    }

    function editValidationValues() {
        var html = HtmlService.createHtmlOutputFromFile('configEditValores')
            .setWidth(500)
            .setHeight(200);
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Valores de validación');

    }

    function modificarValoresValidacion(values) {
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            bd = ss.getSheetByName("BD(No modificar)");
        bd.getRange('b1').setValue(values);
        aviso("Se ha modificado correctamente");

    }