$(document).ready(function () {
    // Verifica en qué página estás para evitar redirecciones innecesarias
    const currentPage = window.location.pathname.split("/").pop().toLowerCase(); // Obtiene el nombre del archivo actual

    // Si no es la página de inicio de sesión y no hay un usuario autenticado, redirige
    if (currentPage !== "login.html") {
        const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
        if (!usuarioGuardado) {
            window.location.href = "../Pantallas Sesion/login.html";
        } else {
            // Si hay usuario, personaliza la página
            $('#nombreUsuario').text(usuarioGuardado.Nombre || "Usuario");
        }
    }

    // Evento para el formulario de inicio de sesión
    $('form').on('submit', function (event) {
        event.preventDefault();

        const correo = $('#correo').val().trim();
        const password = $('#password').val().trim();

        autenticarUsuario(correo, password);
    });

    // Evento para el botón de cerrar sesión
    $('#btnCerrarSesion').on('click', function () {
        // Elimina el usuario del Local Storage
        localStorage.removeItem("usuario");

        // Redirige al usuario a la página de inicio de sesión
        window.location.href = "../Pantallas Sesion/login.html";
    });
});

function autenticarUsuario(correo, password) {
    const data = JSON.stringify({ Correo: correo, Contraseña: password });

    $.ajax({
        url: "https://localhost:7109/api/Usuario/Autenticar",
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: data,
        success: function (response) {
            if (response.mensaje === "Autenticado") {
                // Guarda la información del usuario en Local Storage
                localStorage.setItem("usuario", JSON.stringify(response.response));

                // Redirige según el rol del usuario
                redirigirSegunRol(response.response.idRol);
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

function redirigirSegunRol(idRol) {
    if (idRol === 1) {
        // Redirige a la página del Supervisor
        window.location.href = "../Pantallas Admin/HomeAdmin.html";
    } else {
        // Redirige a la página del Cliente
        window.location.href = "../Pantallas Logeadas/HomeCliente.html";
    }
}


// Segunda inicialización para gestionar la sesión en otras páginas
$(document).ready(function () {
    const LoggedUser = window.localStorage.getItem("usuario");
    if (LoggedUser) {
        let usuario = JSON.parse(LoggedUser);
        $(".btnCerrarSesion").text("Bienvenido " + usuario.nombre);
        console.log(LoggedUser);
    }
});
