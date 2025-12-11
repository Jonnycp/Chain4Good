import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home Page Utente
  index("routes/HomePageUtente.tsx"),
  // Login
  route("login", "routes/login.tsx"),
  // Ente
  route("profilo-ente", "routes/profiloEnte.tsx"),
  route("nuovo-progetto", "routes/NuovoProgetto.tsx"),
  route("ente-visibile", "routes/EnteVisibile.tsx"),
  route("home-page-ente", "routes/HomePageEnte.tsx"),

] satisfies RouteConfig;