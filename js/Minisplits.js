

$(document).ready(function () {
    // Cargar las marcas y los modelos al cargar la página
    cargarMarcas();
    cargarModelos();
    cargarMinisplits();
    cargarMinisplitsCliente();

    // Función para cargar todas las marcas en el dropdown
    function cargarMarcas() {
        $.ajax({
            url: "https://localhost:7109/api/Marca/Lista",
            type: "GET",
            dataType: 'json',
            success: function (result) {
                result.response.forEach(function (marca) {
                    $('#brand').append(new Option(marca.nombreMarca, marca.idMarca));
                });
            },
            error: function (xhr, status, error) {
                Swal.fire('Error', 'No se pudieron cargar las marcas: ' + error, 'error');
            }
        });
    }

    // Función para cargar todos los modelos en el dropdown, sin depender de una marca específica
    function cargarModelos() {
        $.ajax({
            url: "https://localhost:7109/api/Modelo/Lista",
            type: "GET",
            dataType: 'json',
            success: function (result) {
                result.response.forEach(function (modelo) {
                    $('#model').append(new Option(modelo.nombreModelo, modelo.idModelo));
                });
            },
            error: function (xhr, status, error) {
                Swal.fire('Error', 'No se pudieron cargar los modelos: ' + error, 'error');
            }
        });
    }

    // Función para cargar los minisplits en el catálogo
    function cargarMinisplits() {
        $.ajax({
            url: "https://localhost:7109/api/Minisplit/Lista",
            type: "GET",
            dataType: 'json',
            success: function (result) {
                const catalogo = $('#catalogoMinisplits');
                catalogo.empty();

                result.response.forEach(function (minisplit) {
                    // Reemplazar "C:\fakepath" con "../img/"
                    const imagenRuta = minisplit.imagenRuta.replace(/^C:\\fakepath\\/, "../img/");

                    const minisplitHTML = `
                    <div class="device" data-idmarca="${minisplit.idMarca}" data-idmodelo="${minisplit.idModelo}">
                        <img class="imgmini" src="${imagenRuta}" alt="${minisplit.nombreMinisplit}">
                        <h3>${minisplit.nombreMinisplit}</h3>
                        <p>Marca: ${minisplit.nombreMarca}</p>
                        <p>Modelo: ${minisplit.nombreModelo}</p>
                        <p>Descripción: ${minisplit.descripcion}</p>
                        <button class="btn btn-red" data-idmarca="${minisplit.idMarca}" data-idmodelo="${minisplit.idModelo}">Eliminar</button>
                    </div>
                `;
                    catalogo.append(minisplitHTML);
                });
            },
            error: function (xhr, status, error) {
                Swal.fire('Error', 'No se pudieron cargar los minisplits: ' + error, 'error');
            }
        });
    }


    // Función para cargar los minisplits en el catálogo
    function cargarMinisplitsCliente() {
        $.ajax({
            url: "https://localhost:7109/api/Minisplit/Lista",
            type: "GET",
            dataType: 'json',
            success: function (result) {
                const catalogo = $('#catalogoMinisplitsUser');
                catalogo.empty();

                result.response.forEach(function (minisplit) {
                    // Reemplazar "C:\fakepath" con "../img/"
                    const imagenRuta = minisplit.imagenRuta.replace(/^C:\\fakepath\\/, "../img/");

                    const minisplitHTML = `
                    <div class="device" data-idmarca="${minisplit.idMarca}" data-idmodelo="${minisplit.idModelo}">
                        <img class="imgmini" src="${imagenRuta}" alt="${minisplit.nombreMinisplit}">
                        <h3>${minisplit.nombreMinisplit}</h3>
                        <p>Marca: ${minisplit.nombreMarca}</p>
                        <p>Modelo: ${minisplit.nombreModelo}</p>
                        <p>Descripción: ${minisplit.descripcion}</p>
                    </div>
                `;
                    catalogo.append(minisplitHTML);
                });
            },
            error: function (xhr, status, error) {
                Swal.fire('Error', 'No se pudieron cargar los minisplits: ' + error, 'error');
            }
        });
    }

    // Función para borrar un minisplit
    function borrarMinisplit(idMarca, idModelo, btnDelete) {
        $.ajax({
            url: "https://localhost:7109/api/Minisplit/Eliminar/" + idMarca + "/" + idModelo,
            type: 'DELETE',
            contentType: "application/json; charset=utf-8",
            crossDomain: true
        }).done(function (result) {
            $(btnDelete).closest(".device").remove();
            console.log("Se borró exitosamente el Minisplit con IDMarca: " + idMarca + " e IDModelo: " + idModelo);
        }).fail(function (xhr, status, error) {
            console.log(error)
            Swal.fire(
                'Algo salió mal!',
                'El minisplit no pudo ser eliminado ya que esta siendo usado en un registro de mantenimiento' + error,
                'error'
            );
        });
    }

    // Evento de click para el botón eliminar de cada minisplit
    $("#catalogoMinisplits").on("click", ".btn-red", function () {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-green',
                cancelButton: 'btn btn-red'
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: '¿Estás seguro?',
            text: "¡Esta es una acción irreversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, borra el minisplit!',
            cancelButtonText: 'No, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                const idMarca = $(this).data("idmarca");
                const idModelo = $(this).data("idmodelo");
                borrarMinisplit(idMarca, idModelo, this);
            }
        });
    });




    function crearMinisplit() {
        var nombreMinisplit = $("#nombreMinisplit").val();
        var idMarca = $("#brand").val();
        var idModelo = $("#model").val();
        var nombreModelo = $("#model").val();
        var nombreMarca = $("#brand").val();
        var descripcion = $("#descripcion").val();
        var imagenRuta = $("#upload").val();

        // Validación de campos
        if (!nombreMinisplit || !idMarca || !idModelo || !descripcion || !imagenRuta) {
            Swal.fire('Error', 'Por favor, rellena todos los campos obligatorios', 'error');
            return;
        }

        $.ajax({
            url: "https://localhost:7109/api/Minisplit/Guardar",
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            data: JSON.stringify({
                "IdMarca": idMarca,
                "IdModelo": idModelo,
                "NombreModelo": nombreModelo,
                "NombreMarca": nombreMarca,
                "NombreMinisplit": nombreMinisplit,
                "Descripcion": descripcion,
                "ImagenRuta": imagenRuta
            }),
            crossDomain: true
        }).done(function (result) {
            $("#catalogoMinisplits").prepend(generarMinisplitHTML(result.response));
            closeModal();
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡El minisplit ha sido creado!",
                showConfirmButton: false,
                timer: 1500
            });
        }).fail(function (xhr, status, error) {
            console.log(xhr.responseText); // Imprime la respuesta del servidor para más detalles
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡El minisplit ha sido creado!",
                showConfirmButton: false,
                timer: 1500
            });
        });
    }


    // Función para generar el HTML de un minisplit (para agregarlo al catálogo)
    function generarMinisplitHTML(minisplit) {
        return `
        <div class="device" ${minisplit.idMarca}${minisplit.idModelo}>
            <img class="imgmini" src="${minisplit.imagenRuta}" alt="${minisplit.nombreMinisplit}">
            <h3>${minisplit.nombreMinisplit}</h3>
            <p>Marca: ${minisplit.nombreMarca}</p>
            <p>Modelo: ${minisplit.nombreModelo}</p>
            <p>Descripción: ${minisplit.descripcion}</p>
        </div>
    `;
    }

    // Manejar el envío del formulario para crear un minisplit
    $("#formMinisplit").submit(function (event) {
        event.preventDefault();

        if (!this.checkValidity()) {
            event.stopPropagation();
        } else {
            crearMinisplit();
        }
    });

});

