const currentPath = window.location.pathname;

// Función para traer usuarios y mostrarlos en la tabla
function traerUsuarios() {
    $.ajax({
        url: "https://localhost:7109/api/Usuario/Lista",
        type: "GET",
        dataType: "json",
        crossDomain: true
    }).done(function (result) {
        if (result && result.response) {
            $("#listuser").empty();
            result.response.forEach(usuario => {
                $("#listuser").prepend(generarFilaUsuario(usuario));
            });
        } else {
            Swal.fire("Error", "No se encontraron usuarios en la respuesta.", "warning");
        }
    }).fail(function (xhr, status, error) {
        Swal.fire("Algo salió mal!", "Los usuarios no pudieron cargarse debido a este error: " + error, "error");
    });
}

traerUsuarios();

function abrirEditarUsuario(idUsuario, nombre, correo, rolActual) {
    Swal.fire({
        title: "Editar Usuario",
        html: `
            <form id="editUserForm">
                <label for="editUserName">Nombre</label>
                <input id="editUserName" type="text" class="swal2-input" value="${nombre}" readonly style="background-color: #e9ecef;">

                <label for="editUserEmail">Correo</label>
                <input id="editUserEmail" type="email" class="swal2-input" value="${correo}" readonly style="background-color: #e9ecef;">

                <label for="editUserRole">Rol</label>
                <select id="editUserRole" class="swal2-select">
                    <option value="1" ${rolActual == 1 ? "selected" : ""}>Supervisor</option>
                    <option value="2" ${rolActual == 2 ? "selected" : ""}>Cliente</option>
                </select>
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: "Guardar cambios",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const nuevoRol = document.getElementById("editUserRole").value;
            return { idUsuario, nuevoRol };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const { idUsuario, nuevoRol } = result.value;
            actualizarRolUsuario(idUsuario, nuevoRol);
        }
    });
}

function actualizarRolUsuario(idUsuario, nuevoRol) {
    $.ajax({
        url: "https://localhost:7109/api/Usuario/Editar",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            IDUsuario: parseInt(idUsuario),
            IDRol: parseInt(nuevoRol)
        }),
        success: function () {
            Swal.fire("¡Éxito!", "El rol del usuario se ha actualizado correctamente.", "success");
            const rolTexto = nuevoRol == 1 ? "Supervisor" : "Cliente";
            $(`#usuario-${idUsuario} td:nth-child(3)`).text(rolTexto);
        },
        error: function (xhr, status, error) {
            Swal.fire("Error", `No se pudo actualizar el usuario. Error: ${xhr.responseJSON.mensaje}`, "error");
        }
    });
}

function generarFilaUsuario(usuario) {
    const rolTexto = usuario.idRol == 1 ? "Supervisor" : "Cliente";
    return `
        <tr id="usuario-${usuario.idUsuario}">
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${rolTexto}</td>
            <td>
                <button class="btn-yellow" 
                    onclick="abrirEditarUsuario(${usuario.idUsuario}, '${usuario.nombre}', '${usuario.correo}', ${usuario.idRol})">
                    Editar
                </button>
                <button class="btn-red" onclick="eliminarUsuario(${usuario.idUsuario})">Eliminar</button>
            </td>
        </tr>
    `;
}

function eliminarUsuario(idUsuario) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `https://localhost:7109/api/Usuario/Eliminar/${idUsuario}`,
                type: "DELETE",
                success: function () {
                    Swal.fire("¡Eliminado!", "El usuario ha sido eliminado correctamente.", "success");
                    $(`#usuario-${idUsuario}`).remove();
                },
                error: function (xhr, status, error) {
                    Swal.fire("Error", `No se pudo eliminar el usuario. Error: ${error}`, "error");
                }
            });
        }
    });
}

document.getElementById("crearUsuarioForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contraseña = document.getElementById("contraseña").value;
    const confirmarContraseña = document.getElementById("confirmarContraseña").value;
    const rol = document.getElementById("rol").value;

    if (contraseña !== confirmarContraseña) {
        Swal.fire("Error", "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.", "error");
        return;
    }

    if (!nombre || !correo || !contraseña || !rol) {
        Swal.fire("Error", "Todos los campos son obligatorios.", "error");
        return;
    }

    const usuarioData = {
        Nombre: nombre,
        Correo: correo,
        Contraseña: contraseña,
        IDRol: parseInt(rol)
    };

    $.ajax({
        url: "https://localhost:7109/api/Usuario/Guardar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(usuarioData),
        success: function () {
            Swal.fire("¡Éxito!", "Usuario creado correctamente.", "success").then(() => {
                document.getElementById("crearUsuarioForm").reset();
                traerUsuarios(); // Actualizar la tabla automáticamente
            });
        },
        error: function (xhr, status, error) {
            Swal.fire("Error", `No se pudo crear el usuario. Error: ${xhr.responseJSON.mensaje}`, "error");
        }
    });
});
