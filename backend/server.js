// backend/server.js

// PASO 1: Importar 'path'
const path = require('path');

// PASO 2: Cargar .env usando una ruta absoluta
// __dirname es la ruta de la carpeta actual (backend)
// path.resolve() construye la ruta completa a la raíz del proyecto
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const eventRoutes = require('./routes/eventRoutes'); 

// Conexión a la base de datos
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