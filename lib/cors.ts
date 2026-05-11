const ALLOWED_ORIGINS = [
  "https://atlas-app.vercel.app", // producción (ajusta si el dominio es diferente)
  "http://localhost:3000", // desarrollo local
];

// Acepta cualquier subdominio de vercel.app para previews de PR
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // server-to-server, ok
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/atlas-app-[a-z0-9-]+-[a-z0-9]+\.vercel\.app$/.test(origin)) return true;
  return false;
}

export function checkOrigin(req: Request): Response | null {
  const origin = req.headers.get("origin");
  if (!isAllowedOrigin(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return null;
}
