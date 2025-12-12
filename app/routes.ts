import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home Page Utente
  index("routes/HomePageComune.tsx"),
  // Login
  route("login", "routes/login.tsx"),
  // Ente
  route("profilo-ente", "routes/profiloEnte.tsx"),
  route("nuovo-progetto", "routes/NuovoProgetto.tsx"),

  // Utente
  route("profilo-utente", "routes/profiloUtente.tsx"),
  route("donazioni-utente", "routes/DonazioniUtente.tsx"), 
  route("progetto-singolo-utente", "routes/ProgettoSingoloUtente.tsx"),

  // Comune
  route("ente-visibile", "routes/EnteVisibile.tsx"),
  route("progetto-singolo", "routes/ProgettoSingolo.tsx"),

] satisfies RouteConfig;