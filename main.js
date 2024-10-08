const { app, BrowserWindow, ipcMain } = require('electron');
const path = require("node:path");
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
// Ruta de la carpeta y la base de datos
const dbFolder = path.join(__dirname, 'database');
const dbPath = path.join(dbFolder, 'database.db');


// Función para crear la carpeta "database"
function crearCarpeta(ruta) {
    fs.mkdir(ruta, { recursive: true }, (err) => {
        if (err) {
            console.error('Error al crear la carpeta:', err);
        } else {
            console.log('Carpeta creada exitosamente:', ruta);
        }
    });
}
// Función para crear la base de datos "database.db"
function crearBaseDatos(ruta) {
    const db = new sqlite3.Database(ruta, (err) => {
        if (err) {
            console.error('Error al crear la base de datos:', err);
        } else {
            console.log('Base de datos creada exitosamente:', ruta);
            // Crear las tablas solo si la base de datos es recién creada
            db.run(`CREATE TABLE IF NOT EXISTS patients (
                No_Expediente INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                edad INTEGER,
                direccion TEXT,
                numero_telefono TEXT,
                antecedentes_patologicos TEXT,
                motivo_de_consulta TEXT,
                historia_de_enfermedad_actual TEXT,
                p_a TEXT,
                f_c TEXT,
                peso TEXT,
                talla TEXT,
                examen_fisico TEXT,
                diagnosticos TEXT,
                laboratorios TEXT,
                plan_terapeutico TEXT,
                proxima_cita DATE
            )`, (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('Tabla de pacientes creada exitosamente');
                }
            });
        }
    });
    return db;
}
    function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 900,
        minHeight: 500,
        webPreferences:{
            preload:path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
}

let db;
app.whenReady().then(() => {
    // Verificar si la carpeta 'database' existe, y crearla si no
    if (!fs.existsSync(dbFolder)) {
        crearCarpeta(dbFolder);
    }

    // Verificar si la base de datos existe dentro de la carpeta 'database', y crearla si no
    if (!fs.existsSync(dbPath)) {
        db = crearBaseDatos(dbPath);
    } else {
        db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Conexión exitosa a la base de datos');
            }
        });
    }
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
function insertPatient(patient, callback) {
    db.run(`INSERT INTO patients(nombre, edad, direccion, numero_telefono, antecedentes_patologicos, motivo_de_consulta, historia_de_enfermedad_actual, p_a, f_c, peso, talla, examen_fisico, diagnosticos, laboratorios, plan_terapeutico, proxima_cita) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            patient.nombre, patient.edad, patient.direccion,
            patient.numero_telefono, patient.antecedentes_patologicos,
            patient.motivo_de_consulta, patient.historia_de_enfermedad_actual,
            patient.p_a, patient.f_c, patient.peso, patient.talla,
            patient.examen_fisico, patient.diagnosticos, patient.laboratorios,
            patient.plan_terapeutico, patient.proxima_cita
        ],
        function(err) {
            if (err) {
                console.error('Error al insertar paciente:', err.message);
                if (typeof callback === 'function') callback(err);
            } else {
                console.log(`Paciente insertado con éxito. ID: ${this.lastID}`);
                if (typeof callback === 'function') callback(null, { id: this.lastID });
            }
        });
}
function getAllPatients() {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM patients", [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

ipcMain.on('get-all-patients', async (event) => {
    try {
        const patients = await getAllPatients();
        event.reply('get-all-patients-reply', patients);
    } catch (error) {
        event.reply('get-all-patients-reply', { error: error.message });
    }
});

function getNextRecordNumber(callback) {
    db.get('SELECT MAX(No_Expediente) AS maxRecordNumber FROM patients', (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }
        const nextRecordNumber = (row.maxRecordNumber || 0) + 1;
        callback(nextRecordNumber);
    });
}



// Eventos IPC
ipcMain.on('insert-patient', (event, patient) => {
    insertPatient(patient, (err, result) => {
        if (err) {
            event.reply('insert-patient-reply', { error: err.message });
        } else {
            event.reply('insert-patient-reply', { id: result.id });
        }
    });
});
ipcMain.on('get-next-record-number', (event) => {
    getNextRecordNumber((nextRecordNumber) => {
        event.reply('get-next-record-number-reply', nextRecordNumber);
    });
});


