// backend/server.js

const path = require('path');

// ✅ SOLUCIÓN: Cargar .env SÓLO si NO estamos en 'production'
// Render automáticamente define NODE_ENV como 'production'
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const eventRoutes = require('./routes/eventRoutes'); 

// Conexión a la base de datos
// (Ahora usará la variable de Render si está en producción)
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// Rutas
app.use('/api/eventos', eventRoutes);

// Iniciar el servidor
app.listen(PORT, () => console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`));