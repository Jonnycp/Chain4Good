import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Chain4Good</title>
        <meta
          name="description"
          content="Chain4Good è il crowdfunding etico e trasparente. Traccia la tua donazione con la Blockchain, approva le spese e verifica l'impatto reale."
        />
        <meta
          name="keywords"
          content="Crowdfunding, donazioni, raccolta fondi, filantropia, beneficenza, enti no profit, cause sociali"
        />
        <meta name="robots" content="index, follow" />

        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="logos/logo-180x180.png"
        />
        <link rel="icon" sizes="192x192" href="logos/logo-192x192.png" />
        <link rel="icon" sizes="512x512" href="logos/logo-512x512.png" />
        <meta name="msapplication-TileImage" content="logos/logo-152x152.png" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="theme-color" content="#6AAB29" />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
