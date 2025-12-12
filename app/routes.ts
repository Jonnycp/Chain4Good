import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/HomePageComune.tsx"),
  route("login", "routes/login.tsx"),
  route("nuovo-progetto", "routes/NuovoProgetto.tsx"),

  route("donazioni-utente", "routes/DonazioniUtente.tsx"), 
  route("progetto-singolo-utente", "routes/ProgettoSingoloUtente.tsx"),

  route("ente-visibile", "routes/EnteVisibile.tsx"),
  route("progetto-singolo", "routes/ProgettoSingolo.tsx"),

  route("pagina-profilo", "routes/PaginaProfilo.tsx"),

] satisfies RouteConfig;