
 /*       JSON.parse = JSON.parse || function(str){
            if(str === "")
                str = '""';
            eval("var p="+ str +";");
            return p;
        }
*/
$(document).ready(function(){

    var apiUrl =  'http://apitabs.creacodigos.com/api.php/'; 
    var cabecera_tabla ="<tr><th>ID</th><th>Titulo</th><th>Artista</th><th>Acordes</th><th>editar</th><th>borrar</th></tr>";
    // Obtener partituras
    function getProductos(){

        $(".table").html(cabecera_tabla);
        $("#form").attr("data-producto",0);
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
                                                "<td><span class='update btn btn-warning' data-producto='"+ index.id +"'>Editar</span></td>"+
                                                "<td><span class='delete btn btn-danger' data-producto='"+ index.id +"'>Borrar</span></td>"+
                                                "</tr>");
                    }

                });

                // BORRAR
                $(".delete").unbind("click").click(function(){
                    $.ajax({
                        url: apiUrl + "partitura/"+ $(this).data("producto"),
                        type: "delete",
                        success: function (response){                                    
                            getProductos();
                        }
                    });
                });

                // MOSTRAR EDITAR
                $(".update").unbind("click").click(function(){
                    $.ajax({
                        url: apiUrl + "partitura/"+ $(this).data("producto"),
                        type: "get",
                        success: function (response){  
                            $.each(JSON.parse(response),function(i, index){
                                if(index.id.length){

                                    $("#form").attr("data-producto",index.id);
                                    $("#titulo_form").val(index.titulo);
                                    $("#artista_form").val(index.artista);
                                    $("#acordes_form").val(index.acordes);
                                    $("#texto_form").val(index.texto);
                                
                                    // GUARDAMOS DATOS EDITADOS
                                    if($("#form").attr("data-producto") > 0)
                                    {                                                
                                        $("#form").submit(function(e){
                                            alert("EDITO tas submit " + $("#form").data("producto") + " - " + $("#form").attr("data-producto")); 
                                            e.preventDefault();
                                            $.ajax({
                                                url: apiUrl + "partitura/" + $("#form").attr("data-producto"),
                                                type: "put",
                                                data: {
                                                        titulo: $("#titulo_form").val(),
                                                        artista: $("#artista_form").val(),
                                                        acordes: $("#acordes_form").val(),
                                                        texto: $("#texto_form").val()
                                                    },
                                                success: function (response){
                                                    getProductos();
                                                }

                                            });

                                        });
                                    }

                                }
                            });
                        }
                    });
                });
                // FIN EDITAR

            }
        });
    }
    getProductos();

    /*
    function insertarProducto(){

        $("#form").submit(function(e){

            alert("INSERTO tras submit " + $("#form").data("producto") + " - " + $("#form").attr("data-producto"));

            e.preventDefault();
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
                    getProductos();
                }

            });

        });
    }
    */

    // Guardar Partitura
    if($("#form").data("producto") === 0)
    {
        //insertarProducto();
        $("#form").submit(function(e){

            alert("INSERTO tras submit " + $("#form").data("producto") + " - " + $("#form").attr("data-producto"));

            e.preventDefault();
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
                    getProductos();
                }

            });

        });
    }

    //$("#logHTML").html($("#form").data("producto") + " - " + $("#form").attr("data-producto"));
});