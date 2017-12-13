function onOpen(e) {
        var ui = SpreadsheetApp.getUi();
        ui.createAddonMenu()
            .addItem("Iniciar", 'getStarted')
            .addItem("Registro", 'ventanaRegistro')
            .addToUi();

    }

    // Cuando se instala el documento se añaden las opciones del complemento al menu
    function onInstall(e) {
        onOpen(e);
    }


    function getStarted() {
        var html = HtmlService.createHtmlOutputFromFile("SideBar")
            .setSandboxMode(HtmlService.SandboxMode.IFRAME)
            .setTitle("EasyRequest");

        SpreadsheetApp.getUi()
            .showSidebar(html);
        createDB(); //Crea la base de datos al arrancar el complemento, si no esta creada.

    }

    function templateEditor() {

        var html = HtmlService.createHtmlOutputFromFile('templateEditor')
            .setWidth(650)
            .setHeight(550);
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Editor de plantilla');
    }

    function templateEditorAndView() {

        var html = HtmlService.createHtmlOutputFromFile('TemplateEditorAndView')
            .setWidth(650)
            .setHeight(550);
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Editor de plantilla');
    }


    function ventanaRegistro() {

        var html = HtmlService.createHtmlOutputFromFile('ventanaRegistro')
            .setWidth(400)
            .setHeight(520);
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'Registro');
    }
    
    
    function openFeedback() {

        var html = HtmlService.createHtmlOutputFromFile('feedback')
            .setWidth(500)
            .setHeight(190);
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'FeedBack');
    }
    
    
     /////////////////////////////
    ////MENSAJE VERSIÓN BETA/////
   /////////////////////////////
   function alertBeta(){
   
   var html = HtmlService.createHtmlOutputFromFile('BETA-welcome')
            .setWidth(600)
            .setHeight(450);
        SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
            .showModalDialog(html, 'EasyRequest - Beta');
   }
   
   
   
   