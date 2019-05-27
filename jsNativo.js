document.addEventListener("DOMContentLoaded", function(e) {

    var apiUrl =  'http://apitabs.creacodigos.com/api.php/'; 
    //var apiUrl =  'http://localhost:8888/ApiRestFul/api.php/'; 
    var cabecera_tabla ="<tr><th>ID</th><th>Titulo</th><th>Artista</th><th>Acordes</th><th>editar</th><th>borrar</th></tr>";
    var tablaListado = document.getElementsByClassName("table")[0];
    var botonDelete  = document.getElementsByClassName("delete");
    var botonUpdate  = document.getElementsByClassName("update");
    var formulario   = document.getElementById("form");

    document.getElementById("boton_borrar").addEventListener('click', function(e){
        formulario.reset();
        formulario.setAttribute("data-partitura",0);
    }, false);

    function getPartituras(){

        tablaListado.innerHTML = "";
        tablaListado.innerHTML = cabecera_tabla;
        formulario.setAttribute("data-partitura",0);
        formulario.reset();

        // PETICION HTTP REQUEST AJAX
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

                var response = JSON.parse( xhttp.responseText );
                
                response.forEach((index, value) => {
                    //console.log(index);
                    
                        tablaListado.insertAdjacentHTML('beforeend', "<tr><td>"+ index.id +"</td>"+
                                                "<td>"+ index.titulo +"</td>"+
                                                "<td>"+ index.artista +"</td>"+
                                                "<td>"+ index.acordes +"</td>"+
                                                "<td><span class='update btn btn-warning' data-partitura='"+ index.id +"'>Editar</span></td>"+
                                                "<td><span class='delete btn btn-danger' data-partitura='"+ index.id +"'>Borrar</span></td>"+
                                                "</tr>");
                });

                // BORRAR
                for (var i = 0; i < botonDelete.length; i++) {
                    botonDelete[i].addEventListener('click', Delete, false);
                }
                
                function Delete(){

                    if(!confirm("Confirma que quieres borrar el id: "+ this.getAttribute("data-partitura"))) 	return;
                    //var params = "parametro=valor&otro_parametro=otro_valor";
                    // PETICION HTTP REQUEST AJAX
                    var xhttp = new XMLHttpRequest();

                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            getPartituras();
                        }
                    };
                    xhttp.open("DELETE", apiUrl + "partitura/"+ this.getAttribute("data-partitura"), true);
                    xhttp.send();

                };

                // MOSTRAR EDITAR
                // document.getElementsByClassName("update")
                for (var i = 0; i < botonUpdate.length; i++) {
                    botonUpdate[i].addEventListener('click', Update, false);
                }

                function Update(){

                    // PETICION HTTP REQUEST AJAX
                    var xhttp = new XMLHttpRequest();

                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            var response = JSON.parse( xhttp.responseText );
                
                            response.forEach((index, value) => {
                                
                                    document.formulario.titulo.value            = index.titulo;
                                    document.formulario.artista.value           = index.artista;
                                    document.formulario.acordes.value           = index.acordes;
                                    document.formulario.texto.value             = index.texto;
                                    
                                    formulario.setAttribute("data-partitura",index.id);
                                    document.formulario.titulo.focus();

                            });
                        }
                    };
                    xhttp.open("GET", apiUrl + "partitura/"+ this.getAttribute("data-partitura"), true);
                    xhttp.send();

                };
                // FIN EDITAR

            }
        };
        xhttp.open("GET", apiUrl + "partituras", true);
        xhttp.send();

    }
    getPartituras();

    // ESCUCHO SI SE ENVÍA EL FORMULARIO
    formulario.addEventListener('submit', function(e){

        // PARALIZO ENVÍO DEL FORM
        e.preventDefault();

        var params = "titulo=" + document.formulario.titulo.value +
                    "&artista=" + document.formulario.artista.value +
                    "&acordes=" + document.formulario.acordes.value +
                    "&texto=" + document.formulario.texto.value;

        // PETICION HTTP REQUEST AJAX
        var xhttp = new XMLHttpRequest();
                
        if(formulario.getAttribute("data-partitura") == 0)
        {
            console.log('INSERTO');
            xhttp.open("POST", apiUrl + "partitura", true);
        }
        else if (formulario.getAttribute("data-partitura") > 0)
        {
            console.log('EDITO');
            xhttp.open("PUT", apiUrl + "partitura/" + formulario.getAttribute("data-partitura"), true);
        }

        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(JSON.parse(xhttp.responseText));
                getPartituras();
            }
        };

        // Ponemos las cabeceras de la solicitud como si fuera un formulario, necesario si se utiliza POST
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhttp.send(params);
        
    }, false);

});