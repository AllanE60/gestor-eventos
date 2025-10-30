// frontend/js/main.js

// URL de tu Backend (Node.js/Express)
const API_BASE_URL = 'https://gestor-eventos-api.onrender.com/api/eventos';

document.addEventListener('DOMContentLoaded', () => {
    fetchEvents();

    const eventForm = document.getElementById('event-form');
    eventForm.addEventListener('submit', createEvent);

    document.getElementById('eventos-container').addEventListener('click', handleEventActions);
});

// --- FUNCIONES DE OBTENCIÓN Y RENDERIZADO ---

async function fetchEvents() {
    const container = document.getElementById('eventos-container');
    container.innerHTML = '<p>Cargando eventos...</p>';
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Error al obtener la lista de eventos.');
        
        const eventos = await response.json();
        renderEvents(eventos);
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        container.innerHTML = `<p style="color: red;">❌ Error al cargar eventos. Asegúrate de que el servidor (Node.js) esté corriendo: ${error.message}</p>`;
    }
}

function renderEvents(eventos) {
    const container = document.getElementById('eventos-container');
    container.innerHTML = '';
    
    if (eventos.length === 0) {
        container.innerHTML = '<p>No hay eventos programados. ¡Sé el primero en crear uno!</p>';
        return;
    }

    eventos.forEach(event => {
        const card = document.createElement('div');
        card.className = 'event-card';

        // Formatear fecha
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Date(event.fecha).toLocaleDateString('es-ES', dateOptions);

        card.innerHTML = `
            <h3>${event.nombre}</h3>
            <p>🗓️ <strong>Fecha:</strong> ${formattedDate} a las ${event.hora}</p>
            <p>📍 <strong>Ubicación:</strong> ${event.ubicacion}</p>
            <p>👥 <strong>Participantes Registrados:</strong> ${event.participantes.length}</p>
            <p>${event.descripcion || 'Sin descripción.'}</p>
            <button class="register-btn" data-id="${event._id}">Inscribirme</button>
            <button class="share-btn" data-name="${event.nombre}" data-id="${event._id}">Compartir</button>
        `;
        container.appendChild(card);
    });
}

// --- FUNCIONES DE INTERACCIÓN ---

async function createEvent(e) {
    e.preventDefault();

    const eventData = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fecha').value,
        hora: document.getElementById('hora').value,
        ubicacion: document.getElementById('ubicacion').value,
        descripcion: document.getElementById('descripcion').value,
    };

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error desconocido al crear evento');
        }
        
        alert('✅ Evento creado con éxito!');
        document.getElementById('event-form').reset();
        fetchEvents();
    } catch (error) {
        console.error("Error al crear evento:", error);
        alert(`❌ Error al crear evento: ${error.message}`);
    }
}

function handleEventActions(e) {
    const target = e.target;
    if (target.classList.contains('register-btn')) {
        promptRegister(target.dataset.id);
    } else if (target.classList.contains('share-btn')) {
        const eventName = target.dataset.name;
        const shareUrl = `http://localhost:5500/frontend/index.html#event-${target.dataset.id}`; 
        shareEvent(eventName, shareUrl);
    }
}

function promptRegister(eventId) {
    const nombre = prompt("Ingresa tu nombre completo:");
    if (!nombre) return;
    const email = prompt("Ingresa tu correo electrónico:");
    if (!email) return;

    registerParticipant(eventId, { nombre, email });
}

async function registerParticipant(eventId, participantData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${eventId}/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(participantData),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(`⚠️ Error en el registro: ${data.msg || data.error || 'Inténtalo de nuevo.'}`);
            return;
        }

        alert(data.msg); 
        fetchEvents();
    } catch (error) {
        console.error("Error al registrar:", error);
        alert('❌ Error de conexión al intentar registrar.');
    }
}

function shareEvent(eventName, url) {
    const shareText = `¡No te pierdas ${eventName}! Regístrate aquí: ${url}`;

    if (navigator.share) {
        navigator.share({
            title: eventName,
            text: `¡Mira este evento: ${eventName}!`,
            url: url,
        }).catch(error => console.error('Error al compartir', error));
    } else {
        navigator.clipboard.writeText(shareText);
        alert(`🔗 Enlace copiado al portapapeles: ${shareText}`);
    }
}