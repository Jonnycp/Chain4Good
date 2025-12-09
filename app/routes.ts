import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("nuovo-progetto", "routes/NuovoProgetto.tsx")
] satisfies RouteConfig;
