import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Home Page comune
  index("routes/home.tsx"),
  route("profiloEnte", "routes/profiloEnte.tsx"),
  route("nuovo-progetto", "routes/NuovoProgetto.tsx")

] satisfies RouteConfig;