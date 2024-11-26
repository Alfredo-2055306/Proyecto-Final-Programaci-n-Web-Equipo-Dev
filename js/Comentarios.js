$(document).ready(function () {
    // Verificar si el usuario está logueado
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioGuardado || !usuarioGuardado.idUsuario) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener la información del usuario. Por favor, inicia sesión de nuevo.'
        }).then(() => {
            window.location.href = "../Pantallas Sesion/login.html";
        });
        return;
    }

    const idUsuario = usuarioGuardado.idUsuario;

    // Función para cargar todos los comentarios (supervisores)
    function traerComentarios() {
        $.ajax({
            url: "https://localhost:7109/api/Comentario/Lista",
            type: "GET",
            dataType: 'json',
            crossDomain: true
        }).done(function (result) {
            // Procesar comentarios aprobados
            $(result.aprobados).each(function () {
                $("#comments-section").prepend(generarComentario(this));
            });

            // Procesar comentarios pendientes de revisión
            $(result.pendientes).each(function () {
                $(".pending-review-section").prepend(generarComentarioPendiente(this));
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron traer los comentarios: " + error, "error");
        });
    }

    // Función para traer los comentarios del usuario
    function traerComentariosUsuario() {
        $.ajax({
            url: `https://localhost:7109/api/Comentario/ListaPorUsuario/${idUsuario}`, // URL con el idUsuario
            type: "GET",
            dataType: 'json',
            crossDomain: true
        }).done(function (result) {
            // Verificar si hay comentarios aprobados
            if (result.aprobados && result.aprobados.length > 0) {
                $(result.aprobados).each(function () {
                    $("#comments-section2").prepend(generarComentarioUsuario(this)); // Añadir comentario aprobado al DOM
                });
            } else {
                $("#comments-section2").append('<p>No tienes comentarios aprobados.</p>'); // Mensaje si no hay comentarios aprobados
            }
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron traer los comentarios: " + error, "error");
        });
    }

    // Generar HTML para cada comentario aprobado (supervisores)
    function generarComentario(comment) {
        return `
            <div class="comment" data-id="${comment.idComentario}">
                <p><strong>${comment.nombreUsuario}:</strong> ${comment.comentarioTexto}</p>
                <small>Fecha: ${new Date(comment.fechaCreacion).toLocaleDateString()}</small>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
    }

    // Generar HTML para cada comentario pendiente de revisión (supervisores)
    function generarComentarioPendiente(comment) {
        return `
            <div class="comment pending" data-id="${comment.idComentario}">
                <p><strong>${comment.nombreUsuario}:</strong> ${comment.comentarioTexto}</p>
                <small>Fecha: ${new Date(comment.fechaCreacion).toLocaleDateString()}</small>
                <button class="acept-btn">✅</button>
                <button class="delete-btn">🗑️</button>
            </div>
        `;
    }

    // Generar HTML para cada comentario aprobado del usuario
    function generarComentarioUsuario(comment) {
        return `
            <div class="comment" data-id="${comment.idComentario}">
                <p><strong>${comment.nombreUsuario}:</strong> ${comment.comentarioTexto}</p>
                <br>
                <small>Fecha: ${new Date(comment.fechaCreacion).toLocaleDateString()}</small>
                <button class="delete-btn">🗑️</button> 
            </div>
        `;
    }

    // Función para aprobar un comentario (supervisores)
    function aprobarComentario(idComentario, btnAceptar) {
        $.ajax({
            url: "https://localhost:7109/api/Comentario/Aprobar/" + idComentario,
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            const comment = $(btnAceptar).closest(".comment");
            comment.removeClass("pending");
            comment.find(".acept-btn").remove(); // Elimina el botón de aprobación
            $("#comments-section").append(comment); // Mueve el comentario aprobado a la sección principal

            Swal.fire("Éxito", "Comentario aprobado correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo aprobar el comentario: " + error, "error");
        });
    }

    // Función para borrar un comentario
    function borrarComentario(idComentario, btnDelete) {
        $.ajax({
            url: `https://localhost:7109/api/Comentario/Eliminar/${idComentario}`,
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            $(btnDelete).closest(".comment").remove();
            Swal.fire("Éxito", "Comentario eliminado correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo eliminar el comentario: " + error, "error");
        });
    }

    // Eventos para supervisores
    $(".pending-review-section").on("click", ".acept-btn", function () {
        const idComentario = $(this).closest(".comment").data("id");
        aprobarComentario(idComentario, this);
    });

    $(".pending-review-section, #comments-section").on("click", ".delete-btn", function () {
        const idComentario = $(this).closest(".comment").data("id");
        borrarComentario(idComentario, this);
    });

    // Evento para eliminar un comentario del usuario
    $("#comments-section2").on("click", ".delete-btn", function () {
        const idComentario = $(this).closest(".comment").data("id");
        const btnDelete = this;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta es una acción irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                borrarComentario(idComentario, btnDelete); // Llamar función para borrar comentario
            }
        });
    });

    // Cargar los comentarios al inicio
    if (usuarioGuardado.idRol === 1) {
        traerComentarios(); // Supervisores
    } else {
        traerComentariosUsuario(); // Clientes
    }

    // Evento para enviar un comentario
    $('form').on('submit', function (event) {
        event.preventDefault();
        const comentarioTexto = $('#comentario').val().trim();
        if (comentarioTexto === "") {
            Swal.fire("Error", "El comentario no puede estar vacío.", "error");
            return;
        }

        const data = {
            idUsuario: idUsuario,
            comentarioTexto: comentarioTexto,
            fechaCreacion: new Date().toISOString()
        };

        $.ajax({
            url: "https://localhost:7109/api/Comentario/Guardar",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: function () {
                Swal.fire("Éxito", "Su comentario será enviado para revisión.", "success");
                $('#comentario').val('');
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", "No se pudo enviar el comentario: " + error, "error");
            }
        });
    });



    function traerComentariosUsuariocom() {
        $.ajax({
            url: "https://localhost:7109/api/Comentario/Lista",
            type: "GET",
            dataType: 'json',
            crossDomain: true
        }).done(function (result) {
            // Procesar comentarios aprobados
            $(result.aprobados).each(function () {
                $("#comments-section3").prepend(generarComentarioUsuario3(this));
            });

        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron traer los comentarios: " + error, "error");
        });
    }

    // Generar HTML para cada comentario aprobado
    function generarComentarioUsuario3(comment) {
        return `
            <div class="comment" data-id="${comment.idComentario}">
                <p><strong>${comment.nombreUsuario}:</strong> ${comment.comentarioTexto}</p>
                <br>
                <small>Fecha: ${new Date(comment.fechaCreacion).toLocaleDateString()}</small>
            </div>
        `;
    }

    traerComentariosUsuariocom()

    // Botón para cerrar sesión
    $('#btnCerrarSesion').on('click', function () {
        localStorage.removeItem("usuario");
        window.location.href = "../Pantallas Sesion/login.html";
    });

    // Mostrar nombre del usuario logueado
    $(".btnCerrarSesion").text("Bienvenido " + usuarioGuardado.nombre);
});
