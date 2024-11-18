document.addEventListener("DOMContentLoaded", function () {
    const notificationButton = document.getElementById("notification-button");

    let comentariosPendientes = [];
    let mantenimientosPendientes = [];
    let unseenNotifications = 0;

    const notificationBadge = document.createElement("span");
    notificationBadge.classList.add("notification-badge");
    notificationBadge.style.position = "absolute";
    notificationBadge.style.top = "5px";
    notificationBadge.style.right = "5px";
    notificationBadge.style.background = "red";
    notificationBadge.style.color = "white";
    notificationBadge.style.borderRadius = "50%";
    notificationBadge.style.padding = "2px 6px";
    notificationBadge.style.fontSize = "12px";
    notificationBadge.style.display = "none";
    notificationButton.appendChild(notificationBadge);

    function addNotification(type, id, description, date, additionalInfo = "") {
        const formattedDate = getMexicoTime(date);
        const shortDescription = description.length > 10 ? description.substring(0, 10) + "..." : description;

        const message =
            type === "comentario"
                ? `Comentario con ID ${id}, creado el ${formattedDate}, "${shortDescription}" pendiente de aprobación.`
                : `Mantenimiento con ID ${id} para "${additionalInfo}" agendado el ${formattedDate}, "${shortDescription}" pendiente de aprobación.`;

        if (type === "comentario") {
            comentariosPendientes.push({ id, description, date, message });
        } else {
            mantenimientosPendientes.push({ id, description, date, message });
        }

        unseenNotifications++;
        updateNotificationBadge();
    }

    function updateNotificationBadge() {
        if (unseenNotifications > 0) {
            notificationBadge.textContent = unseenNotifications;
            notificationBadge.style.display = "inline-block";
        } else {
            notificationBadge.style.display = "none";
        }
    }

    function markNotificationsAsSeen() {
        unseenNotifications = 0;
        updateNotificationBadge();
    }

    function updateNotificationModal() {
        markNotificationsAsSeen();

        const comentariosHtml = comentariosPendientes
            .sort((a, b) => b.id - a.id)
            .slice(0, 6)
            .map(notification => `<p style="padding:10px; margin: 10px; border:2px solid rgb(91, 111, 161); border-radius: 20px;">${notification.message}</p>`)
            .join("");

        const mantenimientosHtml = mantenimientosPendientes
            .sort((a, b) => b.id - a.id)
            .slice(0, 6)
            .map(notification => `<p style="padding:10px; margin: 10px; border:2px solid rgb(91, 111, 161); border-radius: 20px;">${notification.message}</p>`)
            .join("");

        Swal.fire({
            title: 'Notificaciones',
            html: `
                <h4>Comentarios Pendientes</h4><br>
                ${comentariosHtml || '<p>No tienes comentarios pendientes.</p>'}
                <br><hr><br>
                <h4>Mantenimientos Pendientes</h4><br>
                ${mantenimientosHtml || '<p>No tienes mantenimientos pendientes.</p>'}
            `,
            icon: 'info',
            showCloseButton: true,
            confirmButtonText: 'Cerrar',
        });

        // Mostrar en la consola los arrays completos
        console.log("Comentarios Pendientes:", comentariosPendientes);
        console.log("Mantenimientos Pendientes:", mantenimientosPendientes);
    }

    function getMexicoTime(date) {
        const mexicoTimezone = "America/Mexico_City";
        return new Date(date).toLocaleString('es-MX', { timeZone: mexicoTimezone });
    }

    function obtenerComentariosPendientes() {
        $.ajax({
            url: `https://localhost:7109/api/Comentario/Lista`,
            type: "GET",
            dataType: "json",
            success: function (result) {
                console.log("Comentarios (sin filtrar):", result);
                if (result && result.pendientes && Array.isArray(result.pendientes)) {
                    const comentariosFiltrados = result.pendientes; // Cambiado a pendientes
                    console.log("Comentarios Pendientes (filtrados):", comentariosFiltrados);
                    comentariosFiltrados.forEach(comment => {
                        addNotification(
                            "comentario",
                            comment.idComentario,
                            comment.comentarioTexto || "",
                            comment.fechaCreacion
                        );
                    });
                }
            },
            error: function (xhr, status, error) {
                console.error("Error obteniendo comentarios:", error);
                Swal.fire("Error", "No se pudieron obtener los comentarios pendientes: " + error, "error");
            }
        });
    }

    function obtenerMantenimientosPendientes() {
        $.ajax({
            url: `https://localhost:7109/api/Mantenimiento/Lista`,
            type: "GET",
            dataType: "json",
            success: function (result) {
                console.log("Mantenimientos (sin filtrar):", result);
                if (result && result.response && Array.isArray(result.response)) {
                    const mantenimientosFiltrados = result.response.filter(mantenimiento => !mantenimiento.aprobada); // Verifica si "aprobada" es false
                    console.log("Mantenimientos Pendientes (filtrados):", mantenimientosFiltrados);
                    mantenimientosFiltrados.forEach(mantenimiento => {
                        addNotification(
                            "mantenimiento",
                            mantenimiento.idMantenimiento,
                            mantenimiento.problemaDescripcion || "",
                            mantenimiento.fechaReservacion,
                            `${mantenimiento.nombreMarca} ${mantenimiento.nombreModelo}` // Información adicional
                        );
                    });
                } else {
                    console.error("Estructura de datos no esperada para mantenimientos.");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error obteniendo mantenimientos:", error);
                Swal.fire("Error", "No se pudieron obtener los mantenimientos pendientes: " + error, "error");
            }
        });
    }




    notificationButton.addEventListener("click", function () {
        updateNotificationModal();
    });

    obtenerComentariosPendientes();
    obtenerMantenimientosPendientes();
});
