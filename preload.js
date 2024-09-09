const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    send: (channel, data) => {
        // Lista blanca de canales permitidos
        let validChannels = [
            "insert-patient",
            "get-all-patients",
            "search-patient-by-name",
            "search-patient-by-record-number",
            "get-next-record-number",
            "update-patient-info",
            "insert-consult"  // Añadido
        ];
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        let validChannels = [
            "get-all-patients-reply",
            "search-patient-reply",
            "get-next-record-number-reply",
            "update-patient-info-response",
            "insert-consult-reply"  // Añadido
        ];
        if (validChannels.includes(channel)) {
            // Elimina el listener anterior para evitar duplicados
            ipcRenderer.removeAllListeners(channel);
            // Añade el nuevo listener
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
});

