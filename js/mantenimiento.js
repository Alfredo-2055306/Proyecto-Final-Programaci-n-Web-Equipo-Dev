const currentPath = window.location.pathname;

$(document).ready(function () {
    const minisplitUrl = "https://localhost:7109/api/Minisplit/Lista";
    const mantenimientoUrl = "https://localhost:7109/api/Mantenimiento/Lista";

    let minisplitMap = {};

    // Cargar minisplits y generar mapa
    function cargarMinisplits() {
        return $.ajax({
            url: minisplitUrl,
            type: "GET",
            dataType: "json",
            crossDomain: true
        }).done(function (result) {
            if (!result || !Array.isArray(result.response)) {
                console.error("La respuesta de minisplits no es un arreglo:", result);
                Swal.fire("Error", "Los datos de minisplits no están en el formato esperado.", "error");
                return;
            }

            result.response.forEach(minisplit => {
                const clave = `${minisplit.idMarca}-${minisplit.idModelo}`;
                minisplitMap[clave] = minisplit.nombreMinisplit;
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron cargar los minisplits. " + error, "error");
        });
    }

    // Traer solicitudes de mantenimiento
    function traerSolicitudes() {
        $.ajax({
            url: mantenimientoUrl,
            type: "GET",
            dataType: "json",
            crossDomain: true
        }).done(function (result) {
            const solicitudes = result.response;

            const aprobadas = solicitudes.filter(solicitud => solicitud.aprobada === true);
            const pendientes = solicitudes.filter(solicitud => solicitud.aprobada === false);

            $("#approved-maintenance-section").empty();
            $("#pending-maintenance-section").empty();

            aprobadas.forEach(solicitud => {
                $("#approved-maintenance-section").prepend(generarSolicitudAprobada(solicitud));
            });

            pendientes.forEach(solicitud => {
                $("#pending-maintenance-section").prepend(generarSolicitudPendiente(solicitud));
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron traer las solicitudes de mantenimiento: " + error, "error");
        });
    }

    // Generar solicitud aprobada
    function generarSolicitudAprobada(solicitud) {
        const clave = `${solicitud.idMarca}-${solicitud.idModelo}`;
        const nombreMinisplit = minisplitMap[clave] || "Minisplit desconocido";
        const imagenRuta = solicitud.imagenRuta.replace(/^C:\\fakepath\\/, "../img/");
        return `
            <div class="comment-done loww" data-id="${solicitud.idMantenimiento}">
                <div class="card-body">
                    <h3 class="card-title">${solicitud.nombreUsuario} - ${nombreMinisplit}</h3>
                    <h3 class="card-title">${solicitud.nombreMarca} ${solicitud.nombreModelo}</h3><br>
                    <p><strong>Dirección:</strong> ${solicitud.direccion}</p>
                    <p class="card-text">${solicitud.problemaDescripcion}</p>
                    <p class="card-text"><small class="text-muted">${solicitud.fechaReservacion}</small></p>
                    <button class="btn-red delete-btn" data-id="${solicitud.idMantenimiento}">Eliminar registro🗑️</button>
                    <div>
                        <img class="imgsplit" src="${imagenRuta}">
                    </div>
                </div>
            </div>
        `;
    }

    // Generar solicitud pendiente
    function generarSolicitudPendiente(solicitud) {
        const clave = `${solicitud.idMarca}-${solicitud.idModelo}`;
        const nombreMinisplit = minisplitMap[clave] || "Minisplit desconocido";
        const imagenRuta = solicitud.imagenRuta.replace(/^C:\\fakepath\\/, "../img/");
        return `
            <div class="comment pending loww" data-id="${solicitud.idMantenimiento}">
                <div class="card-body">
                    <h3 class="card-title">${solicitud.nombreUsuario} - ${nombreMinisplit}</h3>
                    <h3 class="card-title">${solicitud.nombreMarca} ${solicitud.nombreModelo}</h3><br>
                    <p><strong>Dirección:</strong> ${solicitud.direccion}</p>
                    <p class="card-text">${solicitud.problemaDescripcion}</p>
                    <p class="card-text"><small class="text-muted">${solicitud.fechaReservacion}</small></p><br>
                    <button class="btn btn-green approve-btn">Aprobar</button>
                    <button class="btn-red delete-btn" data-id="${solicitud.idMantenimiento}">Rechazar solicitud🗑️</button>
                </div>
                <div>
                    <img class="imgsplit" src="${imagenRuta}">
                </div>
            </div>
        `;
    }

    // Inicialización
    cargarMinisplits().then(traerSolicitudes);

    $("#pending-maintenance-section").on("click", ".approve-btn", function () {
        const idMantenimiento = $(this).closest(".comment").data("id");
        const btnAceptar = this;

        Swal.fire({
            title: '¿Aprobar esta solicitud?',
            text: "La solicitud será aprobada y movida a la sección de solicitudes aprobadas.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                aprobarSolicitud(idMantenimiento, btnAceptar);
            }
        });
    });

    function aprobarSolicitud(idMantenimiento, btnAceptar) {
        $.ajax({
            url: "https://localhost:7109/api/Mantenimiento/Aprobar/" + idMantenimiento,
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            const solicitud = $(btnAceptar).closest(".comment");
            solicitud.removeClass("pending");
            solicitud.find(".approve-btn").remove();
            $("#approved-maintenance-section").append(solicitud);

            Swal.fire("Éxito", "Solicitud aprobada correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo aprobar la solicitud: " + error, "error");
        });
    }

    $("body").on("click", ".delete-btn", function () {
        const idMantenimiento = $(this).closest(".comment, .comment-done").data("id");
        const btnDelete = this;

        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡Esta acción no se puede deshacer!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "No, cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                borrarSolicitud(idMantenimiento, btnDelete);
            }
        });
    });

    function borrarSolicitud(idMantenimiento, btnDelete) {
        $.ajax({
            url: `https://localhost:7109/api/Mantenimiento/Eliminar/${idMantenimiento}`,
            type: "DELETE",
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
        })
            .done(function () {
                $(btnDelete).closest(".comment, .comment-done").remove();
                Swal.fire("Éxito", "Solicitud eliminada correctamente", "success");
            })
            .fail(function (xhr, status, error) {
                Swal.fire("Error", "No se pudo eliminar la solicitud: " + error, "error");
            });
    }

    traerSolicitudes();
});
