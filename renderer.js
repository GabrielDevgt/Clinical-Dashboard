document.addEventListener("DOMContentLoaded", function (){
    document.getElementById('triggerDiv').addEventListener('click', function() {
        document.getElementById('myModal').style.display = 'block';
    });

    document.getElementById('closeBtn').addEventListener('click', function() {
        document.getElementById('myModal').style.display = 'none';
    });

    document.getElementById('triggerDiv1').addEventListener('click', function() {
        document.getElementById('myModal1').style.display = 'block';
        window.api.send('get-all-patients');
    });

    document.getElementById('closeBtn1').addEventListener('click', function() {
        document.getElementById('myModal1').style.display = 'none';
    });

    document.getElementById('triggerDiv2').addEventListener('click', function() {
        document.getElementById('myModal2').style.display = 'block';
    });

    document.getElementById('closeBtn3').addEventListener('click', function() {
        document.getElementById('myModal2').style.display = 'none';
    });

    // Función para validar campos
    const validateFields = () => {
        const patient = {
            nombre: document.getElementById('name').value,
            edad: document.getElementById('age').value,
            direccion: document.getElementById('address').value,
            numero_telefono: document.getElementById('cell_number').value,
            antecedentes_patologicos: document.getElementById('medical_history').value,
            motivo_de_consulta: document.getElementById('consultation_reason').value,
            historia_de_enfermedad_actual: document.getElementById('current_illness_history').value,
            p_a: document.getElementById('p_a').value,
            f_c: document.getElementById('p_c').value,
            peso: document.getElementById('weight').value,
            talla: document.getElementById('height').value,
            examen_fisico: document.getElementById('physical_exam').value,
            diagnosticos: document.getElementById('diagnostics').value,
            laboratorios: document.getElementById('labs').value,
            plan_terapeutico: document.getElementById('therapeutic_plan').value,
            proxima_cita: document.getElementById('next_appointment').value
        };
    };

// Función para guardar paciente
    const savePatient = () => {
        const patient = {
            nombre: document.getElementById('name').value,
            edad: document.getElementById('age').value,
            direccion: document.getElementById('address').value,
            numero_telefono: document.getElementById('cell_number').value,
            antecedentes_patologicos: document.getElementById('medical_history').value,
            motivo_de_consulta: document.getElementById('consultation_reason').value,
            historia_de_enfermedad_actual: document.getElementById('current_illness_history').value,
            p_a: document.getElementById('p_a').value,
            f_c: document.getElementById('p_c').value,
            peso: document.getElementById('weight').value,
            talla: document.getElementById('height').value,
            examen_fisico: document.getElementById('physical_exam').value,
            diagnosticos: document.getElementById('diagnostics').value,
            laboratorios: document.getElementById('labs').value,
            plan_terapeutico: document.getElementById('therapeutic_plan').value,
            proxima_cita: document.getElementById('next_appointment').value
        };

        // Verificar que todos los campos estén llenos
        let emptyFields = [];
        for (let key in patient) {
            if (patient[key].trim() === '') {
                emptyFields.push(key);
            }
        }

        if (emptyFields.length > 0) {
            // Hay campos vacíos, mostrar mensaje de error
            let message = "Por favor, complete los siguientes campos:";
            message += "<ul>";
            emptyFields.forEach(field => {
                message += `<li>${field}</li>`;
            });
            message += "</ul>";

            const errorMessageElement = document.getElementById('error-message');
            errorMessageElement.innerHTML = message;
            errorMessageElement.classList.remove('hidden');
            setTimeout(() => {
                errorMessageElement.classList.add('show');
            }, 10);

            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                errorMessageElement.classList.remove('show');
                setTimeout(() => {
                    errorMessageElement.classList.add('hidden');
                }, 500); // Espera el tiempo de la transición
            }, 3000);
        } else {
            // Todos los campos están llenos, proceder a guardar
            window.api.send('insert-patient', patient);
            mostrarMensajeExito();
            LimpiarCampos(); // Asegúrate de que esta función esté definida para limpiar el formulario
            obtenerSiguienteNumeroExpediente();
        }
    };

// Función para mostrar el mensaje de éxito
    function mostrarMensajeExito() {
        const successMessageElement = document.getElementById('success-message');
        successMessageElement.classList.remove('hidden');
        setTimeout(() => {
            successMessageElement.classList.add('show');
        }, 10);

        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            successMessageElement.classList.remove('show');
            setTimeout(() => {
                successMessageElement.classList.add('hidden');
            }, 500); // Espera el tiempo de la transición
        }, 3000);
    }

// Cerrar el mensaje de éxito cuando se hace clic en el botón de cierre
    document.querySelector('#success-message .close-btn').addEventListener('click', () => {
        const successMessageElement = document.getElementById('success-message');
        successMessageElement.classList.remove('show');
        setTimeout(() => {
            successMessageElement.classList.add('hidden');
        }, 500); // Espera el tiempo de la transición
    });

// Asignar la función LimpiarCampos al botón con ID 'reset'
    document.getElementById('reset').addEventListener('click', LimpiarCampos);

    function LimpiarCampos() {
        document.getElementById('name').value = '';
        document.getElementById('age').value = '';
        document.getElementById('address').value = '';
        document.getElementById('cell_number').value = '';
        document.getElementById('medical_history').value = '';
        document.getElementById('consultation_reason').value = '';
        document.getElementById('current_illness_history').value = '';
        document.getElementById('p_a').value = '';
        document.getElementById('p_c').value = '';
        document.getElementById('weight').value = '';
        document.getElementById('height').value = '';
        document.getElementById('physical_exam').value = '';
        document.getElementById('diagnostics').value = '';
        document.getElementById('labs').value = '';
        document.getElementById('therapeutic_plan').value = '';
        document.getElementById('next_appointment').value = '';
    }

// Función para solicitar el siguiente número de expediente
    function obtenerSiguienteNumeroExpediente() {
        window.api.send('get-next-record-number');
    }

// Evento click del botón submit
    document.getElementById('submit').addEventListener('click', savePatient);
    function displayPatients(patients) {
        const tableBody = document.querySelector('#patient-table tbody');
        tableBody.innerHTML = ''; // Limpiar tabla existente

        patients.forEach(patient => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${patient.No_Expediente}</td>
            <td>${patient.nombre}</td>
            <td>${patient.edad}</td>
            <td>${patient.direccion}</td>
            <td>${patient.numero_telefono}</td>
            <td>${patient.antecedentes_patologicos}</td>
            <td>${patient.motivo_de_consulta}</td>
            <td>${patient.historia_de_enfermedad_actual}</td>
            <td>${patient.p_a}</td>
            <td>${patient.f_c}</td>
            <td>${patient.peso}</td>
            <td>${patient.talla}</td>
            <td>${patient.examen_fisico}</td>
            <td>${patient.diagnosticos}</td>
            <td>${patient.laboratorios}</td>
            <td>${patient.plan_terapeutico}</td>
            <td>${patient.proxima_cita}</td>
        `;
            tableBody.appendChild(row);
        });
    }

// Añade un listener para el evento 'get-all-patients-reply'
    window.api.receive('get-all-patients-reply', (result) => {
        if (result.error) {
            console.error('Error al obtener pacientes:', result.error);
            // Maneja el error apropiadamente (por ejemplo, muestra un mensaje al usuario)
        } else {
            displayPatients(result);
        }
    });

// Función para solicitar todos los pacientes
    function requestAllPatients() {
        window.api.send('get-all-patients');
    }



})
window.addEventListener('DOMContentLoaded', () => {
    window.api.send('get-next-record-number');
});

window.api.receive('get-next-record-number-reply', (nextRecordNumber) => {
    document.getElementById('No_expediente').value = nextRecordNumber.toString().padStart(5, '0');
});
window.api.receive('insert-patient-reply', (result) => {
    if (result.error) {
        console.error('Error al insertar paciente:', result.error);
        // Manejar el error apropiadamente
    } else {
        document.getElementById('No_expediente').value = result.id;
        mostrarMensajeExito();
        LimpiarCampos();
    }
});


