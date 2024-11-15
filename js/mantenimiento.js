const currentPath = window.location.pathname;

$(document).ready(function () {
    // Función para traer las solicitudes de mantenimiento de la API
    function traerSolicitudes() {
        $.ajax({
            url: "https://localhost:7109/api/Mantenimiento/Lista", // Ajusta la URL a tu controlador
            type: "GET",
            dataType: 'json',
            crossDomain: true
        }).done(function (result) {
            // Procesar solicitudes aprobadas
            $(result.filter(item => item.aprobada)).each(function () {
                $("#approved-maintenance-section").append(generarSolicitudAprobada(this));
            });

            // Procesar solicitudes no aprobadas
            $(result.filter(item => !item.aprobada)).each(function () {
                $("#pending-maintenance-section").append(generarSolicitudPendiente(this));
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron traer las solicitudes: " + error, "error");
        });
    }

    // Generar HTML para cada solicitud aprobada
    function generarSolicitudAprobada(solicitud) {
        return `
            <div class="maintenance-card" data-id="${solicitud.idMantenimiento}">
                <p><strong>Usuario:</strong> ${solicitud.nombreUsuario}</p>
                <p><strong>Marca:</strong> ${solicitud.nombreMarca}</p>
                <p><strong>Modelo:</strong> ${solicitud.nombreModelo}</p>
                <p><strong>Dirección:</strong> ${solicitud.direccion}</p>
                <p><strong>Fecha de Reservación:</strong> ${new Date(solicitud.fechaReservacion).toLocaleDateString()}</p>
                <button class="delete-btn">🗑️ Eliminar</button>
                <div class="replies"></div>
            </div>
        `;
    }

    // Generar HTML para cada solicitud pendiente de aprobación
    function generarSolicitudPendiente(solicitud) {
        return `
            <div class="maintenance-card pending" data-id="${solicitud.idMantenimiento}">
                <p><strong>Usuario:</strong> ${solicitud.nombreUsuario}</p>
                <p><strong>Marca:</strong> ${solicitud.nombreMarca}</p>
                <p><strong>Modelo:</strong> ${solicitud.nombreModelo}</p>
                <p><strong>Dirección:</strong> ${solicitud.direccion}</p>
                <p><strong>Fecha de Reservación:</strong> ${new Date(solicitud.fechaReservacion).toLocaleDateString()}</p>
                <button class="approve-btn">✅ Aprobar</button>
                <button class="delete-btn">🗑️ Eliminar</button>
                <div class="replies"></div>
            </div>
        `;
    }

    // Función para aprobar una solicitud
    function aprobarSolicitud(idMantenimiento, btnAceptar) {
        $.ajax({
            url: "https://localhost:7109/api/Mantenimiento/Aprobar/" + idMantenimiento,
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            const solicitud = $(btnAceptar).closest(".maintenance-card");
            solicitud.removeClass("pending");
            solicitud.find(".approve-btn").remove();
            $("#approved-maintenance-section").append(solicitud);

            Swal.fire("Éxito", "Solicitud aprobada correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo aprobar la solicitud: " + error, "error");
        });
    }

    // Evento para aprobar una solicitud
    $("#pending-maintenance-section").on("click", ".approve-btn", function () {
        const idMantenimiento = $(this).closest(".maintenance-card").data("id");
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

    // Cargar solicitudes al inicio
    traerSolicitudes();

    // Evento para eliminar una solicitud
    $(".maintenance-section").on("click", ".delete-btn", function () {
        const idMantenimiento = $(this).closest(".maintenance-card").data("id");
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
                borrarSolicitud(idMantenimiento, btnDelete);
            }
        });
    });

    // Función para borrar una solicitud
    function borrarSolicitud(idMantenimiento, btnDelete) {
        $.ajax({
            url: "https://localhost:7109/api/Mantenimiento/Eliminar/" + idMantenimiento,
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            $(btnDelete).closest(".maintenance-card").remove();
            Swal.fire("Éxito", "Solicitud eliminada correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo eliminar la solicitud: " + error, "error");
        });
    }
});
