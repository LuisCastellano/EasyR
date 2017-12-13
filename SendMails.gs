 // Envia un correo electronico con el modulo de validación.
    function send_Email(idreg, idSS, namesh) {
    /*var idreg = 'ID_ywhv2rc1m',
        idSS = '1y4J4lUrfh1hn6Wgn3vcHKVhpWhsuy3x5R4cIPSWwaNk',
        namesh = 'Form responses 13';*/
        
        var ss = SpreadsheetApp.getActiveSpreadsheet(),
            sheet = ss.getActiveSheet(),
            bd = ss.getSheetByName("BD(No modificar)"),
            usuario = getMailUser(bd, ss),
            template = replaceTemplate(),
            nameForm = getNameForm(),
            admin = sheet.getRange(sheet.getLastRow(), getColIndexByName('Responsable de aprobación', sheet)).getValue(),
            options = fillSelect();

        try {

            MailApp.sendEmail({
                to: admin,
                name: "EasyRequest",
                subject: 'Petición formulario: ' + nameForm,
                htmlBody:


                    template +
                    '<br><br><br><br><br>' +

                    ///////////////////MODULO DE VALIDACIÓN/////////////////
                    '<div style="width:362px;padding:15px;border-radius:5px;background-color:#fff;border-bottom:3px solid rgba(0,0,0,0.10);border-left:1px solid rgba(0,0,0,0.10);border-right:1px solid rgba(0,0,0,0.10);border-top:1px solid rgba(0,0,0,0.10)">' +
                    '<p><b style="font-size:20px;color:#2196F3"><center>Módulo de validación</center></b></p>' +
                    '<form action="https://script.google.com/macros/s/AKfycbzs0-tP4G3UBnbhc7EFq_Tro_nhd_D4UZuJawjLZ8kZV4oTq8Q/exec" method="Post" target="_blank" onsubmit="try {return window.confirm(&quot;Vas a enviar información a una página externa.\n¿Seguro que quieres continuar?&quot;);} catch (e) {return false;}">' +
                    '<table>' +
                    '<tbody>' +
                    '<tr>' +
                    '<td colspan="2"></td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<select id="validation" name="validation" style="width:358px;border-radius:1px;height:30px">' +
                    options +
                    '</select>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<label><b style="color:#2196F3;">Comentario adicional :</b></label>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<textarea id="coment" name="coment" style="min-width:354px;min-height:100px;border-radius:3px"></textarea>' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<input type="hidden" id="id_reg" name="id_reg" value="' + idreg + '">' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<input type="hidden" id="id_ss" name="id_ss" value="' + idSS + '">' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<input type="hidden" id="name_sheet" name="name_sheet" value="' + namesh + '">' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<input type="hidden" id="name_form" name="name_form" value="' + nameForm + '">' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td colspan="2">' +
                    '<input type="hidden" id="usuario" name="usuario" value="' + usuario + '">' +
                    '</td>' +
                    '</tr>' +
                    '<tr>' +
                    '<td style="width:270px"></td>' +
                    '<td>' +
                    '<input type="submit" value="Enviar" id="submit" name="submit" style="color:#fff;background-color:#2196F3;padding:6px 18px 6px 18px;border-radius:1px;font-size:16px;border:0">' +
                    '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</form>' +
                    '</div>'
            });

        } catch (e) {
            MailApp.sendEmail({
                to: 'luis.castellano@ieducando.com',
                name: "ERROR-EasyRequest",
                subject: 'ERROR-SendMail',
                htmlBody: 'ERROR: ' + e
            });
        }
    }



    // Envia un correo electronico al solicitante con la respuesta.
    function sendEmailDest(usuario, nameForm, validacion, comentario) {
        MailApp.sendEmail({
            to: usuario,
            name: "EasyRequest",
            subject: 'Respuesta ' + nameForm,
            htmlBody: '<div>' +
                '<p><b style="font-size:16px;color:#2196F3">Respuesta del formulario "' + nameForm + '".</b></p></br>' +
                '<p style="color:#424242;"><b>Validación: </b>' + validacion + '</p></br>' +
                '<p style="color:#424242;"><b>Comentario adicional: </b></p></br>' +
                '<p style="color:#424242;">' + comentario + '</p>' +
                '</div>'
        });
    }




