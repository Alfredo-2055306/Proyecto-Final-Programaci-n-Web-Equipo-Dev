$(document).ready(function () {
    const mantenimientoUrl = "https://localhost:7109/api/Mantenimiento/Lista";
    const minisplitUrl = "https://localhost:7109/api/Minisplit/Lista";

    let minisplitMap = {};
    let mantenimientosData = [];
    let ordenActual = {}; // Para rastrear el estado de ordenación de cada columna

    // Cargar lista de minisplits
    function cargarMinisplits() {
        return $.ajax({
            url: minisplitUrl,
            type: "GET",
            dataType: "json",
            crossDomain: true
        }).done(function (result) {
            if (!result || !Array.isArray(result.response)) {
                console.error("La respuesta de minisplits no es un arreglo:", result);
                Swal.fire("Error", "Los datos de minisplits no están en el formato esperado.", "error");
                return;
            }

            result.response.forEach(minisplit => {
                const clave = `${minisplit.idMarca}-${minisplit.idModelo}`;
                minisplitMap[clave] = minisplit.nombreMinisplit;
            });
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron cargar los minisplits. " + error, "error");
        });
    }

    // Cargar mantenimientos y generar tabla
    function cargarMantenimientos() {
        $.ajax({
            url: mantenimientoUrl,
            type: "GET",
            dataType: "json",
            crossDomain: true
        }).done(function (result) {
            if (!result || !Array.isArray(result.response)) {
                console.error("La respuesta de mantenimientos no es un arreglo:", result);
                Swal.fire("Error", "Los datos de mantenimientos no están en el formato esperado.", "error");
                return;
            }

            mantenimientosData = result.response;
            llenarTabla();
            generarGraficas(mantenimientosData);
        }).fail(function (xhr, status, error) {
            Swal.fire("Error", "No se pudieron cargar los mantenimientos. " + error, "error");
        });
    }

    // Llenar tabla con DataTables
    function llenarTabla() {
        const data = mantenimientosData.map(mantenimiento => {
            const clave = `${mantenimiento.idMarca}-${mantenimiento.idModelo}`;
            const nombreMinisplit = minisplitMap[clave] || "Desconocido";
            const fecha = new Date(mantenimiento.fechaReservacion);

            return {
                id: mantenimiento.idMantenimiento,
                usuario: mantenimiento.nombreUsuario,
                direccion: mantenimiento.direccion,
                minisplit: nombreMinisplit,
                problema: mantenimiento.problemaDescripcion,
                hora: fecha.toLocaleTimeString(),
                fecha: fecha.toLocaleDateString(),
                estado: mantenimiento.aprobada ? "Aprobado" : "No aprobado"
            };
        });

        const table = $('#tabla-mantenimientos').DataTable({
            data: data,
            destroy: true,
            columns: [
                { data: 'id', title: 'ID' },
                { data: 'usuario', title: 'Usuario' },
                { data: 'direccion', title: 'Dirección' },
                { data: 'minisplit', title: 'Minisplit' },
                { data: 'problema', title: 'Problema' },
                { data: 'hora', title: 'Hora' },
                { data: 'fecha', title: 'Fecha' },
                { data: 'estado', title: 'Estado' }
            ],
            order: [[6, 'desc']], // Por defecto, ordena por fecha descendente
            pageLength: 10,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.6/i18n/es-ES.json"
            }
        });

        // Configurar eventos para alternar ordenación
        $('#tabla-mantenimientos thead th').off('click').on('click', function () {
            const colIndex = $(this).index();
            const colName = table.settings()[0].aoColumns[colIndex].data;

            // Alternar ordenación
            if (ordenActual[colName] === 'asc') {
                ordenActual[colName] = 'desc';
                table.order([colIndex, 'desc']).draw();
            } else if (ordenActual[colName] === 'desc') {
                ordenActual[colName] = 'none'; // Deshabilitar orden
                table.order([]).draw();
            } else {
                ordenActual[colName] = 'asc';
                table.order([colIndex, 'asc']).draw();
            }
        });
    }

    // Función para generar gráficos dinámicos
    function generarGraficas(mantenimientos) {
        const minisplitsContador = {};
        const diasContador = {
            "Lunes": 0,
            "Martes": 0,
            "Miércoles": 0,
            "Jueves": 0,
            "Viernes": 0,
            "Sábado": 0,
            "Domingo": 0
        };

        mantenimientos.forEach(mantenimiento => {
            const clave = `${mantenimiento.idMarca}-${mantenimiento.idModelo}`;
            const nombreMinisplit = minisplitMap[clave] || "Desconocido";

            // Contar minisplits
            minisplitsContador[nombreMinisplit] = (minisplitsContador[nombreMinisplit] || 0) + 1;

            // Contar días de la semana
            const fecha = new Date(mantenimiento.fechaReservacion);
            const diaSemana = fecha.toLocaleDateString("es-ES", { weekday: "long" });
            const diaNormalizado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1).toLowerCase(); // Capitalizar
            if (diasContador[diaNormalizado] !== undefined) {
                diasContador[diaNormalizado]++;
            }
        });
        // Actualizar el número total de mantenimientos en el HTML
        const totalMantenimientos = mantenimientos.length;
        document.querySelector(".stat-item").innerHTML = `
        <h3>Cantidad de mantenimientos hechos en total: ${totalMantenimientos}</h3>
    `;

        // Ordenar días de lunes a domingo
        const diasOrdenados = [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo"
        ].map(dia => ({ dia, cantidad: diasContador[dia] }));

        const dias = diasOrdenados.map(item => item.dia);
        const cantidadesDias = diasOrdenados.map(item => item.cantidad);

        const nombresMinisplit = Object.keys(minisplitsContador);
        const cantidadesMinisplit = Object.values(minisplitsContador);

        const colores = [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(199, 199, 199, 0.6)"
        ];

        // Gráfica de dona
        new Chart($("#doughnutChart"), {
            type: "doughnut",
            data: {
                labels: nombresMinisplit,
                datasets: [{
                    data: cantidadesMinisplit,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.6)",
                        "rgba(54, 162, 235, 0.6)",
                        "rgba(255, 206, 86, 0.6)",
                        "rgba(75, 192, 192, 0.6)",
                        "rgba(153, 102, 255, 0.6)",
                        "rgba(255, 159, 64, 0.6)",
                        "rgba(199, 199, 199, 0.6)"
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });

        // Gráfica de barras
        new Chart($("#barChart"), {
            type: "bar",
            data: {
                labels: dias,
                datasets: [{
                    label: "Grafica de demanda por dias",
                    data: cantidadesDias,
                    backgroundColor: colores
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "Días de la semana" } },
                    y: { title: { display: true, text: "Cantidad de mantenimientos" } }
                }
            }
        });
    }



    // Inicialización
    cargarMinisplits().then(cargarMantenimientos);
});
