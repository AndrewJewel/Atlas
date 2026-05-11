const ALLOWED_ORIGINS = [
  "https://atlasmundialista.com",
  "https://www.atlasmundialista.com",
  "http://localhost:3000",
];

// Acepta previews de Vercel para desarrollo
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // server-to-server, ok
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  if (/^https:\/\/atlas-[a-z0-9-]+-[a-z0-9]+\.vercel\.app$/.test(origin)) return true;
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
