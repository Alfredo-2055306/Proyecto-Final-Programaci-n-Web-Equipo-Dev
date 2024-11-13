$(document).ready(function () {
    // Evento que se ejecuta cuando se envía el formulario de inicio de sesión
    $('form').on('submit', function (event) {
        event.preventDefault();

        // Obtiene los valores ingresados por el usuario
        const correo = $('#correo').val().trim();
        const password = $('#password').val().trim();

        // Iniciar el proceso de autenticación
        autenticarUsuario(correo, password);
    });
});

function autenticarUsuario(correo, password) {
    const data = JSON.stringify({ Correo: correo, Contraseña: password });

    console.log("Datos enviados:", data);

    $.ajax({
        url: "https://localhost:7109/api/Usuario/Autenticar",
        type: "POST",
        contentType: "application/json",
        dataType: "json", // Añade esta línea
        data: data,
        success: function (response) {
            if (response.mensaje === "Autenticado") {
                localStorage.setItem("usuario", JSON.stringify(response.response));
                window.location.href = "../Pantallas Admin/HomeAdmin.html";
            } else {
                alert("Correo o contraseña incorrectos. Inténtalo de nuevo.");
            }
        },
        error: function (error) {
            console.error("Error en la autenticación:", error);
            alert("Hubo un error en el inicio de sesión. Inténtalo de nuevo.");
        }
    });
}
