// backend/models/Event.js

const mongoose = require('mongoose');

// 1. Sub-Esquema para los participantes
// Define qué datos se guardan por cada persona que se registra
const ParticipantSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre del participante es obligatorio'] 
    },
    email: { 
        type: String, 
        required: [true, 'El email del participante es obligatorio'],
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Por favor, usa un email válido'] 
    },
});

// 2. Esquema principal del Evento
const EventSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: [true, 'El nombre del evento es obligatorio'], 
    trim: true 
  },
  fecha: { 
    type: Date, // Usamos Date para que MongoDB pueda ordenar y filtrar por fecha
    required: [true, 'La fecha es obligatoria'] 
  },
  hora: { 
    type: String, 
    required: [true, 'La hora es obligatoria'] 
  },
  ubicacion: { 
    type: String, 
    required: [true, 'La ubicación es obligatoria'] 
  },
  descripcion: { 
    type: String, 
    default: '' 
  },
  // La lista de participantes será un array que contiene documentos ParticipantSchema
  participantes: [ParticipantSchema], 
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// 3. Exportamos el modelo
module.exports = mongoose.model('Event', EventSchema);