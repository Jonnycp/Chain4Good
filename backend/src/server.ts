import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import indexRouter from "./routes/index.ts";
import cors from "cors";
import { connectDB } from './database.ts';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Configurazione CORS (per il frontend)
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Configurazione Sessioni
app.use(
  session({
    name: "siwe-session",
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production" || false, // per HTTPS in produzione
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
    },
  })
);
//TODO: Non usare default MemoryStore in prod, usare connect-mongo

// Router rotte
app.use("/", indexRouter);

// Rotta di fallback (gestione 404)
app.use((req, res) => {
  res.status(404).json({ code: "404", error: "Non trovato"});
});

// Avvia il server
app.listen(port, async () => {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length === 0) {
    console.error(
      "⚠️ ERRORE: SESSION_SECRET non è impostato nelle variabili d'ambiente!"
    );
    process.exit(1);
  }
  await connectDB();
  console.log(`🟢 Backend server avviato su http://localhost:${port}`);
});
