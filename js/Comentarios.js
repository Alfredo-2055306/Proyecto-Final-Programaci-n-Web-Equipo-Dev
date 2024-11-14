const currentPath = window.location.pathname;

$(document).ready(function () {
    // Función para traer los comentarios de la API
    function traerComentarios() {
        $.ajax({
            url: "https://localhost:7109/api/Comentario/Lista",
            type: "GET",
            dataType: 'json',
            crossDomain: true
        }).done(function (result) {
            // Procesar comentarios aprobados
            $(result.aprobados).each(function () {
                $("#comments-section").append(generarComentario(this));
            });

            // Procesar comentarios pendientes de revisión
            $(result.pendientes).each(function () {
                $(".pending-review-section").append(generarComentarioPendiente(this));
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron traer los comentarios: " + error, "error");
        });
    }

    // Generar HTML para cada comentario aprobado
    function generarComentario(comment) {
        return `
            <div class="comment" data-id="${comment.idComentario}">
                <p><strong>${comment.nombreUsuario}:</strong> ${comment.comentarioTexto}</p>
                <small>Fecha: ${new Date(comment.fechaCreacion).toLocaleDateString()}</small>
                <button class="delete-btn">🗑️</button>
                <button class="reply-btn">Responder</button>
                <!-- Contenedor para la respuesta -->
                <div class="reply-form hidden">
                    <input type="text" class="reply-input" placeholder="Escribe tu respuesta">
                    <button class="send-reply-btn">Enviar respuesta</button>
                </div>
                <div class="replies"></div>
            </div>
        `;
    }

    // Generar HTML para cada comentario pendiente
    function generarComentarioPendiente(comment) {
        return `
            <div class="comment pending" data-id="${comment.idComentario}">
                <p><strong>${comment.nombreUsuario}:</strong> ${comment.comentarioTexto}</p>
                <small>Fecha: ${new Date(comment.fechaCreacion).toLocaleDateString()}</small>
                <button class="acept-btn">✅</button>
                <button class="delete-btn">🗑️</button>
                <div class="reply-form hidden">
                    <input type="text" class="reply-input" placeholder="Escribe tu respuesta">
                    <button class="send-reply-btn">Enviar respuesta</button>
                </div>
                <div class="replies"></div>
            </div>
        `;
    }

    // Función para aprobar un comentario
    function aprobarComentario(idComentario, btnAceptar) {
        $.ajax({
            url: "https://localhost:7109/api/Comentario/Aprobar/" + idComentario,
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            // Mueve el comentario aprobado a la sección de comentarios aprobados
            const comment = $(btnAceptar).closest(".comment");
            comment.removeClass("pending");
            comment.find(".acept-btn").remove(); // Elimina el botón de aprobación
            $("#comments-section").append(comment); // Mueve el comentario aprobado a la sección principal

            Swal.fire("Éxito", "Comentario aprobado correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo aprobar el comentario: " + error, "error");
        });
    }

    // Evento para aprobar un comentario
    $(".pending-review-section").on("click", ".acept-btn", function () {
        const idComentario = $(this).closest(".comment").data("id");
        const btnAceptar = this;

        Swal.fire({
            title: '¿Aprobar este comentario?',
            text: "El comentario será aprobado y movido a la sección de comentarios aprobados.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                aprobarComentario(idComentario, btnAceptar);
            }
        });
    });
    // Cargar comentarios al inicio
    traerComentarios();

    // Evento para eliminar un comentario
    $("#comments-section").on("click", ".delete-btn", function () {
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
                borrarComentario(idComentario, btnDelete);
            }
        });
    });

    // Función para borrar un comentario
    function borrarComentario(idComentario, btnDelete) {
        $.ajax({
            url: "https://localhost:7109/api/Comentario/Eliminar/" + idComentario,
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            $(btnDelete).closest(".comment").remove();
            Swal.fire("Éxito", "Comentario eliminado correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo eliminar el comentario: " + error, "error");
        });
    }

    // Evento para mostrar el formulario de respuesta
    $("#comments-section").on("click", ".reply-btn", function () {
        const replyForm = $(this).siblings(".reply-form");

        // Mostrar el formulario de respuesta si está oculto y ocultar si ya se mostró
        if (replyForm.hasClass("hidden")) {
            $(".reply-form").addClass("hidden"); // Oculta otros formularios de respuesta
            replyForm.removeClass("hidden");
        } else {
            replyForm.addClass("hidden");
        }
    });

    // Evento para enviar la respuesta al comentario
    $("#comments-section").on("click", ".send-reply-btn", function () {
        const commentId = $(this).closest(".comment").data("id");
        const replyInput = $(this).siblings(".reply-input");
        const replyText = replyInput.val().trim();

        if (replyText === "") {
            Swal.fire("Error", "La respuesta no puede estar vacía", "error");
            return;
        }

        $.ajax({
            url: "https://localhost:7109/api/Comentario/Responder",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ idComentario: commentId, texto: replyText }),
            success: function () {
                Swal.fire("Éxito", "Respuesta enviada correctamente", "success");
                replyInput.val(""); // Limpiar el input
                $(this).closest(".reply-form").addClass("hidden"); // Ocultar formulario
                // Agregar la respuesta al comentario
                const replyHtml = `<div class="reply"><p><strong>Tú:</strong> ${replyText}</p></div>`;
                $(this).closest(".comment").find(".replies").append(replyHtml);
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", "No se pudo enviar la respuesta: " + error, "error");
            }
        });
    });
});
