$(document).ready(function () {
    // Evento de envío del formulario de registro
    $("#registerForm").on("submit", function (e) {
        e.preventDefault();  // Prevenir el comportamiento predeterminado del formulario

        const nombre = $("#nombre").val().trim();
        const correo = $("#correo").val().trim();
        const contraseña = $("#password").val();
        const confirmarContraseña = $("#confirmarContraseña").val();

        // Validar contraseñas coincidentes
        if (contraseña !== confirmarContraseña) {
            Swal.fire("Error", "Las contraseñas no coinciden. Por favor, inténtalo de nuevo.", "error");
            return;
        }

        // Validar que los campos no estén vacíos
        if (!nombre || !correo || !contraseña) {
            Swal.fire("Error", "Todos los campos son obligatorios.", "error");
            return;
        }

        // Crear objeto con los datos del usuario
        const usuarioData = {
            Nombre: nombre,
            Correo: correo,
            Contraseña: contraseña,
            IDRol: 2  // Asignar el rol de Cliente por defecto en el registro
        };

        // Llamada AJAX para registrar el nuevo usuario
        $.ajax({
            url: "https://localhost:7109/api/Usuario/Guardar",  // Ruta a tu API
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(usuarioData),
            success: function () {
                Swal.fire("¡Éxito!", "Usuario registrado correctamente.", "success").then(() => {
                    // Redirige al usuario a la página de inicio de sesión después del registro exitoso
                    window.location.href = "../Pantallas Sesion/login.html";
                });
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", `No se pudo crear el usuario. Error: ${xhr.responseJSON.mensaje}`, "error");
            }
        });
    });
});
