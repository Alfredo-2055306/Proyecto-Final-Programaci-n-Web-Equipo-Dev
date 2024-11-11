document.getElementById('btnMarca').addEventListener('click', function () {
    const formMarca = document.getElementById('formMarca');
    const formModelo = document.getElementById('formModelo');

    if (formMarca.classList.contains('hidden')) {
        formMarca.classList.remove('hidden');
        formModelo.classList.add('hidden');
    } else {
        formMarca.classList.add('hidden');
    }
});

document.getElementById('btnModelo').addEventListener('click', function () {
    const formModelo = document.getElementById('formModelo');
    const formMarca = document.getElementById('formMarca');

    if (formModelo.classList.contains('hidden')) {
        formModelo.classList.remove('hidden');
        formMarca.classList.add('hidden');
    } else {
        formModelo.classList.add('hidden');
    }
});
