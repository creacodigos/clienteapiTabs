$(document).ready(function(){

    var apiUrl =  'http://apitabs.creacodigos.com/api.php/'; 
    var cabecera_tabla ="<tr><th>ID</th><th>Titulo</th><th>Artista</th><th>Acordes</th><th>editar</th><th>borrar</th></tr>";
    // Obtener partituras
    function getPartituras(){

        $(".table").html(cabecera_tabla);
        $("#form").data("partitura",0);
        $("#form")[0].reset();

        $.ajax({
            url: apiUrl + "partituras",
            type: "get",
            success: function (response){
                $.each(JSON.parse(response),function(i, index){
                    if(index.id.length){
                        $(".table").append("<tr><td>"+ index.id +"</td>"+
                                                "<td>"+ index.titulo +"</td>"+
                                                "<td>"+ index.artista +"</td>"+
                                                "<td>"+ index.acordes +"</td>"+
                                                "<td><span class='update btn btn-warning' data-partitura='"+ index.id +"'>Editar</span></td>"+
                                                "<td><span class='delete btn btn-danger' data-partitura='"+ index.id +"'>Borrar</span></td>"+
                                                "</tr>");
                    }

                });

                // BORRAR
                $(".delete").unbind("click").click(function(){
                    $.ajax({
                        url: apiUrl + "partitura/"+ $(this).data("partitura"),
                        type: "delete",
                        success: function (response){                                    
                            getPartituras();
                        }
                    });
                });

                // MOSTRAR EDITAR
                $(".update").unbind("click").click(function(){
                    $.ajax({
                        url: apiUrl + "partitura/"+ $(this).data("partitura"),
                        type: "get",
                        success: function (response){  
                            $.each(JSON.parse(response),function(i, index){
                                if(index.id.length){

                                    //$("#form").attr("data-partitura",index.id);
                                    $("#form").data("partitura",index.id);
                                    $("#titulo_form").val(index.titulo);
                                    $("#artista_form").val(index.artista);
                                    $("#acordes_form").val(index.acordes);
                                    $("#texto_form").val(index.texto);

                                }
                            });
                        }
                    });
                });
                // FIN EDITAR

            }
        });
    }
    getPartituras();

    // ESCUCHO SI SE ENVÍA EL FORMULARIO
    $("#form").submit(function(e){

        // PARALIZO ENVÍO DEL FORM
        e.preventDefault();

        //alert('$("#form").data("partitura") = ' + $("#form").data("partitura") + '\n$("#form").attr("data-partitura") = ' + $("#form").attr("data-partitura"));
        // INSERTAR PARTITURA
        if($("#form").data("partitura") === 0)
        {
            alert('INSERTO');

            $.ajax({
                url: apiUrl + "partitura",
                type: "post",
                data: {
                        titulo: $("#titulo_form").val(),
                        artista: $("#artista_form").val(),
                        acordes: $("#acordes_form").val(),
                        texto: $("#texto_form").val()
                    },
                success: function (response){
                    alert(response);
                    getPartituras();
                }

            });
        }
        else if ($("#form").data("partitura") > 0)
        {
            // GUARDAMOS DATOS EDITADOS
            alert('EDITO'); 
            
            $.ajax({
                url: apiUrl + "partitura/" + $("#form").data("partitura"),
                type: "put",
                data: {
                        titulo: $("#titulo_form").val(),
                        artista: $("#artista_form").val(),
                        acordes: $("#acordes_form").val(),
                        texto: $("#texto_form").val()
                    },
                success: function (response){
                    alert(response);
                    getPartituras();
                }

            });
        }

    });
});