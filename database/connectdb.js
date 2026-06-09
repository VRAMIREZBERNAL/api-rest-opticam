import mongoose from "mongoose";

try { 
    await mongoose.connect(process.env.URI_MONGO);
    console.log('Conexión a MongoDB establecida')
} catch (error) {
    console.log('Error al conectar a MongoDB:', error);
}
