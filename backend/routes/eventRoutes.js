const express = require('express');
// 1. IMPORTA la nueva función 'deleteEvent'
const { getEvents, createEvent, registerParticipant, deleteEvent } = require('../controllers/eventController');
const router = express.Router();

router.route('/')
  .get(getEvents)
  .post(createEvent);

// 2. AÑADE esta nueva ruta para el ID
// Manejará la petición DELETE para un evento específico
router.route('/:id')
  .delete(deleteEvent);

router.post('/:id/registro', registerParticipant);

module.exports = router;