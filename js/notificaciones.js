document.addEventListener("DOMContentLoaded", function () {
    const notificationButton = document.getElementById("notification-button");

    let notificationsPending = [];
    let notificationsApproved = [];
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


    function addNotification(type, id, description, date, status, additionalInfo = "") {
        const formattedDate = getMexicoTime(date);
        const shortDescription = description.length > 10 ? description.substring(0, 10) + "..." : description;

        const message =
            type === "comentario"
                ? `Comentario con ID ${id}, creado el ${formattedDate}, "${shortDescription}" ${status === "pendiente" ? "pendiente de aprobación" : "aprobado"}.`
                : `Mantenimiento con ID ${id} para "${additionalInfo}" agendado el ${formattedDate}, "${shortDescription}" ${status === "pendiente" ? "pendiente de aprobación" : "aprobado"}.`;

        if (status === "pendiente") {
            notificationsPending.push({ message, date, seen: false });
        } else if (status === "aprobado") {
            notificationsApproved.push({ message, date, seen: false });
        }

        if (status === "pendiente") unseenNotifications++;
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
        notificationsPending.forEach(notification => notification.seen = true);
        unseenNotifications = 0;
        updateNotificationBadge();
    }

    function updateNotificationModal() {
        markNotificationsAsSeen();

        const pendingNotifications = notificationsPending
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
            .map(notification => `<p style="padding:10px; margin: 10px; border:2px solid rgb(91, 111, 161); border-radius: 20px;">${notification.message}</p>`)
            .join("");

        const approvedNotifications = notificationsApproved
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 3)
            .map(notification => `<p style="padding:10px; margin: 10px; border:2px solid rgb(91, 111, 161); border-radius: 20px;">${notification.message}</p>`)
            .join("");

        Swal.fire({
            title: 'Notificaciones',
            html: `
                <h4>Pendientes de aprobación</h4><br>
                ${pendingNotifications || '<p>No tienes notificaciones pendientes.</p>'}
                <br><hr><br>
                <h4>Aprobados</h4><br>
                ${approvedNotifications || '<p>No tienes notificaciones aprobadas.</p>'}
            `,
            icon: 'info',
            showCloseButton: true,
            confirmButtonText: 'Cerrar',
        });
    }

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

    function getMexicoTime(date) {
        const mexicoTimezone = "America/Mexico_City"; // Zona horaria para Ciudad de México
        return new Date(date).toLocaleString('es-MX', { timeZone: mexicoTimezone });
    }

    function obtenerComentariosUsuario() {
        $.ajax({
            url: `https://localhost:7109/api/Comentario/ListaPorUsuario/${usuarioGuardado.idUsuario}`,
            type: "GET",
            dataType: "json",
            success: function (result) {
                if (result.pendientes && Array.isArray(result.pendientes)) {
                    result.pendientes.forEach(comment => {
                        addNotification(
                            "comentario",
                            comment.idComentario,
                            comment.comentarioTexto || "",
                            comment.fechaCreacion,
                            "pendiente"
                        );
                    });
                }

                if (result.aprobados && Array.isArray(result.aprobados)) {
                    result.aprobados.forEach(comment => {
                        addNotification(
                            "comentario",
                            comment.idComentario,
                            comment.comentarioTexto || "",
                            comment.fechaCreacion,
                            "aprobado"
                        );
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", "No se pudieron obtener los comentarios: " + error, "error");
            }
        });
    }

    function obtenerMantenimientosUsuario() {
        $.ajax({
            url: `https://localhost:7109/api/Mantenimiento/ListaPorUsuario/${usuarioGuardado.idUsuario}`,
            type: "GET",
            dataType: "json",
            success: function (result) {
                if (result && Array.isArray(result.response)) {
                    result.response.forEach(mantenimiento => {
                        addNotification(
                            "mantenimiento",
                            mantenimiento.idMantenimiento,
                            mantenimiento.problemaDescripcion || "",
                            mantenimiento.fechaReservacion,
                            mantenimiento.aprobada ? "aprobado" : "pendiente",
                            mantenimiento.nombreMinisplit
                        );
                    });
                }
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", "No se pudieron obtener los mantenimientos: " + error, "error");
            }
        });
    }

    notificationButton.addEventListener("click", function () {
        updateNotificationModal();
    });

    obtenerComentariosUsuario();
    obtenerMantenimientosUsuario();
});
