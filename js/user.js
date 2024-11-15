const currentPath = window.location.pathname;
// Función para traer usuarios y mostrarlos en la tabla
function traerUsuarios() {
    $.ajax({
        url: "https://localhost:7109/api/Usuario/Lista",
        type: "GET",
        dataType: "json",
        crossDomain: true
    })
        .done(function (result) {
            // Iterar sobre la respuesta para generar las filas
            $(result).each(function () {
                $("#listuser").prepend(generarFilaUsuario(this));
            });
            Swal.fire("¡Éxito!", "Los usuarios fueron cargados correctamente.", "success");
        })
        .fail(function (xhr, status, error) {
            Swal.fire("Algo salió mal!", "Los usuarios no pudieron cargarse debido a este error: " + error, "error");
        });
}

// // Función para generar una fila de usuario con los datos del endpoint
// function generarFilaUsuario(usuario) {
//     // Mapear el rol según el ID del rol
//     const roles = {
//         0: "Sin asignar",
//         1: "Admin",
//         2: "Usuario"
//     };
//     const rol = roles[usuario.idRol] || "Desconocido";

//     // Generar el HTML para una fila de tabla
//     return `
//         <tr>
//             <td>${usuario.nombre}</td>
//             <td>${usuario.correo}</td>
//             <td>${rol}</td>
//             <td>
//                 <button class="btn-yellow">Editar</button>
//                 <button class="btn-red" onclick="eliminarUsuario(${usuario.idUsuario})">Eliminar</button>
//             </td>
//         </tr>
//     `;
// }
traerUsuarios();
// Generar HTML para cada modelo
function generarFilaUsuario(post) {
    return `
            <tr${usuario.idUsuario}>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.idRol}</td>
            <td>
                <button class="btn-yellow">Editar</button>
                <button class="btn-red" onclick="eliminarUsuario(${usuario.idUsuario})">Eliminar</button>
            </td>
        </tr>
        `;
}

// Función para eliminar un usuario con confirmación (puedes implementar la lógica DELETE aquí)
function eliminarUsuario(idUsuario) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará permanentemente al usuario.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            // Lógica para eliminar al usuario
            // Aquí podrías implementar la solicitud DELETE al backend si corresponde.
            Swal.fire("Eliminado", "El usuario ha sido eliminado correctamente.", "success");
        }
    });
}

// Llamar a la función traerUsuarios al cargar la página
$(document).ready(function () {
    traerUsuarios();
});
