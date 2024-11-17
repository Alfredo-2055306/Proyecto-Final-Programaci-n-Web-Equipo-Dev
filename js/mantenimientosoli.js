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
    $(".btnCerrarSesion").text("Bienvenido " + usuarioGuardado.nombre);

    // Función para cargar la lista de Minisplits
    function cargarListaMinisplits() {
        $.getJSON("https://localhost:7109/api/Minisplit/Lista", function (data) {
            const minisplitSelect = $("#minisplit");
            minisplitSelect.empty();
            minisplitSelect.append('<option value="">Seleccionar Minisplit</option>');
            data.response.forEach(minisplit => {
                minisplitSelect.append(
                    `<option value="${minisplit.idMarca}-${minisplit.idModelo}">
                        ${minisplit.nombreMinisplit} (${minisplit.nombreMarca} - ${minisplit.nombreModelo})
                    </option>`
                );
            });
        }).fail(function (xhr, status, error) {
            console.error("Error al cargar la lista de Minisplits:", xhr, status, error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo cargar la lista de Minisplits. Intente nuevamente.'
            });
        });
    }

    // Función para cargar las solicitudes de mantenimiento del usuario
    function cargarMantenimientos() {
        $.ajax({
            url: `https://localhost:7109/api/Mantenimiento/ListaPorUsuario/${idUsuario}`,
            type: 'GET',
            success: function (response) {
                if (response && response.response) {
                    const mantenimientos = response.response;

                    if (mantenimientos.length === 0) {
                        $('#listuser').html('<tr><td colspan="4">No hay solicitudes de mantenimiento registradas.</td></tr>');
                        return;
                    }

                    let contenidoTabla = '';
                    mantenimientos.forEach((mantenimiento) => {
                        const fecha = new Date(mantenimiento.fechaReservacion);
                        const fechaFormateada = fecha.toLocaleDateString(); // Formato de fecha (DD/MM/AAAA)
                        const horaFormateada = fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Formato de hora (HH:MM)

                        contenidoTabla += `
                            <tr>
                                <td>${mantenimiento.idMantenimiento}</td>
                                <td>${mantenimiento.nombreMinisplit}</td>
                                <td>${mantenimiento.problemaDescripcion}</td>
                                <td>${fechaFormateada}</td>
                                <td>${horaFormateada}</td>
                            </tr>
                        `;
                    });

                    $('#listuser').html(contenidoTabla);
                } else {
                    $('#listuser').html('<tr><td colspan="4">Error al cargar los datos.</td></tr>');
                }
            },
            error: function (xhr, status, error) {
                console.error("Error al cargar las solicitudes de mantenimiento:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las solicitudes de mantenimiento. Inténtalo más tarde.'
                });
            }
        });
    }

    // Manejo del formulario para registrar un mantenimiento
    $('form').on('submit', function (e) {
        e.preventDefault();

        const selectedMinisplit = $('#minisplit').val();
        if (!selectedMinisplit) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, selecciona un Minisplit.'
            });
            return;
        }

        const [idMarca, idModelo] = selectedMinisplit.split('-').map(Number);

        const fechaReservacionInput = $('#fechaReservacion').val();
        if (!fechaReservacionInput) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, selecciona una fecha y hora.'
            });
            return;
        }

        const mantenimiento = {
            idUsuario: idUsuario,
            idMarca,
            idModelo,
            direccion: $('#ubicacion').val(),
            problemaDescripcion: $('#descripcion').val(),
            fechaReservacion: fechaReservacionInput
        };

        if (!mantenimiento.direccion || !mantenimiento.problemaDescripcion) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos obligatorios.'
            });
            return;
        }

        console.log("Datos enviados al servidor:", mantenimiento);
        $.ajax({
            url: 'https://localhost:7109/api/Mantenimiento/Guardar',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(mantenimiento),
            success: function (response) {
                console.log("Respuesta del servidor:", response);
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'La solicitud de mantenimiento fue registrada correctamente.'
                }).then(() => {
                    $('form')[0].reset();
                    cargarMantenimientos(); // Recargar la lista de mantenimientos
                });
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud de mantenimiento:", xhr, status, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo registrar el mantenimiento. Verifica los datos enviados.'
                });
            }
        });
    });

    // Botón para cerrar sesión
    $('#btnCerrarSesion').on('click', function () {
        localStorage.removeItem("usuario");
        window.location.href = "../Pantallas Sesion/login.html";
    });

    // Cargar la lista de Minisplits y los mantenimientos al iniciar
    cargarListaMinisplits();
    cargarMantenimientos();
});
