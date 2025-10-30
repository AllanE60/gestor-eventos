// backend/routes/eventRoutes.js

const express = require('express');
// Importamos las funciones de lógica que crearemos en el siguiente paso
const { getEvents, createEvent, registerParticipant } = require('../controllers/eventController');
const router = express.Router();

// Ruta Base: /api/eventos
router.route('/')
  .get(getEvents)   // GET /api/eventos -> Obtener todos los eventos
  .post(createEvent); // POST /api/eventos -> Crear un nuevo evento

// Ruta Específica para Registro: /api/eventos/:id/registro
router.post('/:id/registro', registerParticipant); // POST para registrar un participante

module.exports = router;