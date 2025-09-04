// IMPORTANTE: Este script es SÓLO para el frontend.
// NO implementa un backend real ni una base de datos persistente en el servidor.
// La persistencia SIMULADA se logra utilizando localStorage del navegador,
// lo que significa que los datos se guardan localmente en el navegador del usuario.
// Estos datos NO son accesibles desde otros navegadores o computadoras,
// y pueden ser eliminados por el usuario limpiando su caché/historial.
// Para una aplicación real con persistencia y acceso multi-usuario,
// se REQUIERE un backend (servidor) y una base de datos real.

const STORAGE_KEY = 'iglesia_contacto_data';

// Function to get data from localStorage
const getDataFromStorage = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error loading data from localStorage:", e);
        return [];
    }
};

// Function to save data to localStorage
const saveDataToStorage = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving data to localStorage:", e);
    }
};

// Function to render data list on datos.html
const renderDataList = (dataToRender) => {
    const dataListElement = document.getElementById('dataList');
    if (!dataListElement) return; // Exit if not on the datos.html page

    dataListElement.innerHTML = ''; // Clear current list

    if (dataToRender.length === 0) {
        dataListElement.innerHTML = '<li><em>No hay datos disponibles (simulados).</em></li>';
        return;
    }

    dataToRender.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>Nombre:</strong> ${escapeHTML(item.nombre)}<br>
            <strong>Email:</strong> ${escapeHTML(item.email)}<br>
            <strong>Interés:</strong> ${escapeHTML(item.interes || 'No especificado')}<br>
            <strong>Mensaje:</strong> ${escapeHTML(item.mensaje || 'Sin mensaje')}
        `;
        dataListElement.appendChild(listItem);
    });
};

// Basic HTML escaping to prevent XSS when rendering user input
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

document.addEventListener('DOMContentLoaded', () => {

    // --- Formulario de Contacto (Solo en contacto.html) ---
    const dataForm = document.getElementById('dataForm');
    const formMessage = document.getElementById('formMessage');

    if (dataForm && formMessage) { // Check if these elements exist on the page (contacto.html)
        dataForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Previene el envío tradicional del formulario

            const formData = new FormData(dataForm);
            const data = Object.fromEntries(formData.entries());

            // Get existing data, add new data, and save back to localStorage
            const allData = getDataFromStorage();
            allData.push(data);
            saveDataToStorage(allData);

            console.log('Datos del formulario (simulado y guardado en localStorage):', data);

            // Mostrar mensaje de éxito y limpiar el formulario
            formMessage.textContent = '¡Gracias! Tu información (simulada) ha sido recibida y guardada localmente.';
            formMessage.style.display = 'block';
            formMessage.style.color = 'green';
            formMessage.style.borderColor = 'green';
            formMessage.style.backgroundColor = '#e9ffe9';
            dataForm.reset();

            // Ocultar el mensaje después de unos segundos
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 8000); // Show message a bit longer
        });
    }

    // --- Datos Recolectados (Solo en datos.html) ---
    const dataListElement = document.getElementById('dataList');
    const filterInteresSelect = document.getElementById('filterInteres');
    const sortByNameButton = document.getElementById('sortByName');
    const sortByInteresButton = document.getElementById('sortByInteres');

    if (dataListElement) { // Check if on the datos.html page
        let currentData = getDataFromStorage();
        let currentSort = ''; // 'name' or 'interes'

        const updateDisplayedData = () => {
            let filteredData = [...currentData]; // Work with a copy

            // Apply Filter
            const filterValue = filterInteresSelect ? filterInteresSelect.value : '';
            if (filterValue) {
                filteredData = filteredData.filter(item => item.interes === filterValue);
            }

            // Apply Sort
            if (currentSort === 'name') {
                filteredData.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
            } else if (currentSort === 'interes') {
                 filteredData.sort((a, b) => (a.interes || '').localeCompare(b.interes || ''));
            }
             // Default sort: keep original order (effectively by entry time)

            renderDataList(filteredData);
        };

        // Initial render
        updateDisplayedData();

        // Add Event Listeners for Controls
        if (filterInteresSelect) {
            filterInteresSelect.addEventListener('change', updateDisplayedData);
        }

        if (sortByNameButton) {
            sortByNameButton.addEventListener('click', () => {
                currentSort = 'name';
                updateDisplayedData();
            });
        }

        if (sortByInteresButton) {
             sortByInteresButton.addEventListener('click', () => {
                 currentSort = 'interes';
                 updateDisplayedData();
             });
         }

         // Note: If the user opens two tabs of datos.html and one submits data,
         // the other won't automatically update without more advanced techniques
         // like the 'storage' event listener or polling. Keeping it simple for now.
         // The note about simulation and localStorage persistence is already in datos.html
    }
});