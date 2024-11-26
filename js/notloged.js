const currentPath = window.location.pathname;

$(document).ready(function () {
    const apiBaseUrl = "https://localhost:7109/api/AcercaDe/";
    // Mostrar todos los registros "AcercaDe"
    function mostrarAcercaDeUser() {
        $.ajax({
            url: apiBaseUrl + "Lista",
            type: "GET",
            dataType: "json",
            crossDomain: true,
        })
            .done(function (result) {
                if (result && result.response) {
                    const listaAcercaDe = result.response;
                    $("#aboutsec1").empty(); // Limpiar contenido previo

                    listaAcercaDe.forEach((item) => {
                        $("#aboutsec1").append(generarAcercaDeUsuarios(item));
                    });
                } else {
                    $("#aboutsec1").html("<p>No hay información disponible sobre 'Acerca de Nosotros'.</p>");
                }
            })
            .fail(function (xhr, status, error) {
                console.error("Error al obtener la lista:", error);
                $("#aboutsec1").html("<p>No hay información disponible sobre 'Acerca de Nosotros'.</p>");
            });
    }

    // Generar HTML para cada registro "AcercaDe"
    function generarAcercaDeUsuarios(about) {
        return `
            <div class="textabout card" id="acerca-${about.idAcercaDe}">
                <p>${about.contenido}</p>
            </div>
        `;
    }
    mostrarAcercaDeUser();

});
$(document).ready(function () {
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
    cargarListaMinisplits();
});