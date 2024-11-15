const currentPath = window.location.pathname;

$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7109/api/AcercaDe/";

    // Mostrar todos los registros "AcercaDe"
    function mostrarAcercaDe() {
        $.ajax({
            url: apiBaseUrl + "Lista",
            type: "GET",
            dataType: 'json',
            crossDomain: true,
        })
            .done(function (result) {
                if (result && result.response) {
                    const listaAcercaDe = result.response;
                    $("#aboutsec").empty(); // Limpiar contenido previo

                    listaAcercaDe.forEach(item => {
                        $("#aboutsec").append(generarAcercaDe(item));
                    });
                } else {
                    $("#aboutsec").html("<p>No hay información disponible sobre 'Acerca de Nosotros'.</p>");
                }
            })
            .fail(function (xhr, status, error) {
                console.error("Error al obtener la lista:", error);
                $("#aboutsec").html("<p>No hay información disponible sobre 'Acerca de Nosotros'.</p>");
            });
    }

    // Generar HTML para cada registro "AcercaDe"
    function generarAcercaDe(about) {
        return `
            <div class="textabout card" id="acerca-${about.idAcercaDe}">
                <p>${about.contenido}</p>
                <button class="btn btn-red" onclick="eliminarAcercaDe(${about.idAcercaDe})">Eliminar</button>
                <button class="btn btn-yellow" onclick="traerModalEditar(${about.idAcercaDe})">Editar</button>
            </div>
        `;
    }

    // Eliminar un registro "AcercaDe"
    window.eliminarAcercaDe = function (idAcercaDe) {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: apiBaseUrl + "Eliminar/" + idAcercaDe,
                    type: "DELETE",
                    crossDomain: true
                })
                    .done(function () {
                        Swal.fire("Eliminado", "El registro se ha eliminado con éxito.", "success");
                        $(`#acerca-${idAcercaDe}`).remove(); // Elimina el registro del DOM
                    })
                    .fail(function (xhr, status, error) {
                        Swal.fire("Error", "No se pudo eliminar el registro: " + error, "error");
                        console.error("Error al eliminar:", error);
                    });
            }
        });
    };

    window.traerModalEditar = function (idAcercaDe) {
        $.ajax({
            url: `${apiBaseUrl}Obtener/${idAcercaDe}`,
            type: 'GET',
            dataType: 'json',
            crossDomain: true
        })
            .done(function (result) {
                if (result && result.response) {
                    const contenidoActual = result.response.contenido;

                    Swal.fire({
                        title: 'Editar contenido',
                        input: 'textarea',
                        inputLabel: 'Modifica el contenido:',
                        inputValue: contenidoActual,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        cancelButtonText: 'Cerrar',
                        inputAttributes: {
                            'aria-label': 'Modifica el contenido del AcercaDe',
                        },
                        preConfirm: (nuevoContenido) => {
                            if (!nuevoContenido) {
                                Swal.showValidationMessage('El contenido no puede estar vacío');
                            }
                            return nuevoContenido;
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            modificarAcercaDe(idAcercaDe, result.value);
                        }
                    });
                } else {
                    Swal.fire('Error', 'No se encontraron datos para editar.', 'error');
                }
            })
            .fail(function (xhr, status, error) {
                Swal.fire('Error', `No se pudieron obtener los datos: ${error}`, 'error');
            });
    };


    function modificarAcercaDe(idAcercaDe, nuevoContenido) {
        $.ajax({
            url: `${apiBaseUrl}Editar/${idAcercaDe}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({ Contenido: nuevoContenido }), // JSON bien formado
            crossDomain: true
        })
            .done(function () {
                Swal.fire('Editado!', 'El contenido ha sido actualizado.', 'success');
                $(`#acerca-${idAcercaDe} p`).text(nuevoContenido); // Actualizar el DOM
            })
            .fail(function (xhr, status, error) {
                const errorMessage = xhr.responseJSON?.mensaje || 'Error desconocido en el servidor';
                Swal.fire('Error', `No se pudo editar el registro: ${errorMessage}`, 'error');
            });
    }



    // Cargar contenido al iniciar
    mostrarAcercaDe();
});
