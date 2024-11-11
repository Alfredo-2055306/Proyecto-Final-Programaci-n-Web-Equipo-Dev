function toggleEditMode() {
    const fields = document.querySelectorAll('.editable');
    fields.forEach(field => {

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = "Escribe aquí...";
        input.className = 'text-input';


        input.onblur = () => {
            if (input.value.trim() !== "") {
                field.innerText = input.value;
            } else {
                field.innerText = "Texto eliminado. Haz clic en 'Editar' para agregar nuevo contenido.";
            }
            field.classList.remove('editing');
            field.onclick = toggleEditMode;
        };


        field.innerText = '';
        field.appendChild(input);
        field.classList.add('editing');
        field.onclick = null;
        input.focus();
    });
}

function clearText() {
    document.querySelectorAll('.editable').forEach(field => {
        field.innerText = '';
    });
}