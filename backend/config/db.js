// backend/config/db.js

const mongoose = require('mongoose');

// ❌ ELIMINAMOS CUALQUIER CARGA DE 'dotenv' O URI LITERAL DE AQUÍ ❌

const connectDB = async () => {
  try {
    // ✅ VOLVEMOS A USAR LA VARIABLE DE ENTORNO
    // Esta variable la obtendrá de server.js
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (err) {
    // Si process.env.MONGO_URI no está definida, aquí dará el error "undefined"
    console.error(`❌ Error de conexión a MongoDB: ${err.message}`);
    process.exit(1); 
  }
};

module.exports = connectDB;