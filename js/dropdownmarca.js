const currentPath = window.location.pathname;
$(document).ready(function () {
    // Variables para almacenar los divs de formulario
    const formMarca = $("#formMarca");
    const formModelo = $("#formModelo");

    // Evento para mostrar/ocultar el formulario de Marca
    $("#btnMarca").click(function () {
        formMarca.toggleClass("hidden");
        formModelo.addClass("hidden"); // Ocultar el formulario de modelo al mostrar el de marca
    });

    // Evento para mostrar/ocultar el formulario de Modelo
    $("#btnModelo").click(function () {
        formModelo.toggleClass("hidden");
        formMarca.addClass("hidden"); // Ocultar el formulario de marca al mostrar el de modelo
    });

    // Función para registrar nueva marca
    $("#formMarca .btn").click(function () {
        const nombreMarca = $("#nombreMarca").val().trim();
        if (nombreMarca === "") {
            Swal.fire("Error", "El nombre de la marca no puede estar vacío", "error");
            return;
        }

        $.ajax({
            url: "https://localhost:7109/api/Marca/Guardar",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ nombreMarca: nombreMarca }),
            success: function (result) {
                Swal.fire("Éxito", "Marca registrada correctamente", "success");
                $("#nombreMarca").val("");
                formMarca.addClass("hidden"); // Ocultar formulario tras registrar
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", "No se pudo registrar la marca: " + error, "error");
            }
        });
    });

    // Función para registrar nuevo modelo
    $("#formModelo .btn").click(function () {
        const nombreModelo = $("#nombreModelo").val().trim();
        if (nombreModelo === "") {
            Swal.fire("Error", "El nombre del modelo no puede estar vacío", "error");
            return;
        }

        $.ajax({
            url: "https://localhost:7109/api/Modelo/Guardar",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({ nombreModelo: nombreModelo }),
            success: function (result) {
                Swal.fire("Éxito", "Modelo registrado correctamente", "success");
                $("#nombreModelo").val("");
                formModelo.addClass("hidden"); // Ocultar formulario tras registrar
            },
            error: function (xhr, status, error) {
                Swal.fire("Error", "No se pudo registrar el modelo: " + error, "error");
            }
        });
    });

    // Traer Modelos y mostrarlos en la tabla
    function traerModelos() {
        $.ajax({
            url: "https://localhost:7109/api/Modelo/Lista",
            type: "GET",
            dataType: 'json',
            crossDomain: true
        }).done(function (result) {
            $(result.response).each(function () {
                $("#modelodiv").append(generarModelos(this));
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Algo salió mal!", "Los modelos no pudieron traerse debido a este error: " + error, "error");
        });
    }

    // Traer Marcas y mostrarlas en la tabla
    function traerMarcas() {
        $.ajax({
            url: "https://localhost:7109/api/Marca/Lista",
            type: "GET",
            dataType: 'json',
            crossDomain: true
        }).done(function (result) {
            $(result.response).each(function () {
                $("#marcadiv").append(generarMarcas(this));
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Algo salió mal!", "Las marcas no pudieron traerse debido a este error: " + error, "error");
        });
    }

    // Generar HTML para cada modelo
    function generarModelos(post) {
        return `
            <tr>
                <td>${post.idModelo}</td>
                <td>${post.nombreModelo}</td>
                <td>
                    <button class="btn btn-red" data-id="${post.idModelo}">Eliminar</button>
                </td>
            </tr>
        `;
    }

    // Generar HTML para cada marca
    function generarMarcas(post) {
        return `
            <tr>
                <td>${post.idMarca}</td>
                <td>${post.nombreMarca}</td>
                <td>
                    <button class="btn btn-red" data-id="${post.idMarca}">Eliminar</button>
                </td>
            </tr>
        `;
    }

    // Llamadas iniciales para cargar las marcas y modelos al cargar la página
    traerModelos();
    traerMarcas();

    // Borrar modelo al hacer clic en "Eliminar"
    $("#modelodiv").on("click", ".btn-red", function () {
        const idModelo = $(this).data("id");
        const btnDelete = this;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta es una acción irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                borrarModelo(idModelo, btnDelete);
            }
        });
    });

    // Borrar marca al hacer clic en "Eliminar"
    $("#marcadiv").on("click", ".btn-red", function () {
        const idMarca = $(this).data("id");
        const btnDelete = this;

        Swal.fire({
            title: '¿Estás seguro?',
            text: "¡Esta es una acción irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borrar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                borrarMarca(idMarca, btnDelete);
            }
        });
    });

    // Función para borrar un modelo
    function borrarModelo(idModelo, btnDelete) {
        $.ajax({
            url: "https://localhost:7109/api/Modelo/Eliminar/" + idModelo,
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            $(btnDelete).closest("tr").remove();
            Swal.fire("Éxito", "Modelo eliminado correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo eliminar el modelo ya que esta en uso " + error, "error");
        });
    }

    // Función para borrar una marca
    function borrarMarca(idMarca, btnDelete) {
        $.ajax({
            url: "https://localhost:7109/api/Marca/Eliminar/" + idMarca,
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function () {
            $(btnDelete).closest("tr").remove();
            Swal.fire("Éxito", "Marca eliminada correctamente", "success");
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudo eliminar la marca ya que esta en uso " + error, "error");
        });
    }
});
