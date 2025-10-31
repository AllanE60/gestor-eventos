// backend/controllers/eventController.js

const Event = require('../models/Event'); // Importamos el Modelo de Evento

// @desc    Obtener todos los eventos
// @route   GET /api/eventos
exports.getEvents = async (req, res) => {
  try {
    // Busca todos los eventos y los ordena por fecha
    const eventos = await Event.find().sort({ fecha: 1 });
    res.json(eventos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener eventos', details: err.message });
  }
};

// @desc    Crear un nuevo evento
// @route   POST /api/eventos
exports.createEvent = async (req, res) => {
  try {
    // Crea una nueva instancia del modelo con los datos del cuerpo de la petición (req.body)
    const nuevoEvento = new Event(req.body);
    const eventoGuardado = await nuevoEvento.save();
    res.status(201).json(eventoGuardado); // 201 Created
  } catch (err) {
    // Si falta un campo requerido o hay un error de validación
    res.status(400).json({ error: 'Datos de evento incompletos o incorrectos', details: err.message });
  }
};

// @desc    Registrar un participante a un evento
// @route   POST /api/eventos/:id/registro
exports.registerParticipant = async (req, res) => {
  const { nombre, email } = req.body;
  
  if (!nombre || !email) {
      return res.status(400).json({ msg: 'Nombre y email son obligatorios para el registro.' });
  }

  try {
    // 1. Encontrar el evento por ID
    const evento = await Event.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    // 2. Verificar si el email ya está registrado en ESTE evento
    const yaRegistrado = evento.participantes.some(p => p.email.toLowerCase() === email.toLowerCase());
    if (yaRegistrado) {
      return res.status(400).json({ msg: 'Ya estás registrado en este evento.' });
    }

    // 3. Agregar el participante y guardar el evento actualizado
    evento.participantes.push({ nombre, email });
    await evento.save();

    // NOTA: La funcionalidad de envío de email (con Nodemailer, SendGrid, etc.) iría aquí.

    res.json({ msg: `✅ Registro exitoso para ${evento.nombre}!`, evento });
  } catch (err) {
    res.status(500).json({ error: 'Error en el registro', details: err.message });
  }
};
// @desc    Eliminar un evento
// @route   DELETE /api/eventos/:id
exports.deleteEvent = async (req, res) => {
  try {
    const evento = await Event.findById(req.params.id);

    if (!evento) {
      return res.status(404).json({ msg: 'Evento no encontrado' });
    }

    // Usamos el método de Mongoose para encontrar y eliminar por ID
    await Event.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Evento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor al eliminar', details: err.message });
  }
};