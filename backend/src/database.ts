import mongoose from 'mongoose';

export const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI; 

    if (!mongoUri || mongoUri.length === 0) {
        console.error("⚠️ ERRORE: Variabile d'ambiente MONGO_URI non impostata.");
        process.exit(1); 
    }

    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 20000 });
        console.log("🟢 Connessione a MongoDB riuscita!");
    } catch (error) {
        console.error("⚠️ ERRORE Connessione MongoDB - Causa:", error.cause.type);
        process.exit(1); 
    }
};
