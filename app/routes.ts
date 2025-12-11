import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home Page
  index("routes/home.tsx"),
  // Login
  route("login", "routes/login.tsx"),
  // Ente
  route("profiloEnte", "routes/profiloEnte.tsx"),
  route("nuovo-progetto", "routes/NuovoProgetto.tsx"),
  route("ente-visibile", "routes/EnteVisibile.tsx"),

] satisfies RouteConfig;