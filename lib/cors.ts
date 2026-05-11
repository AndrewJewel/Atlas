const ALLOWED_ORIGINS = [
  "https://atlasmundialista.com",
  "https://www.atlasmundialista.com",
  "http://localhost:3000",
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // server-to-server, ok
  return ALLOWED_ORIGINS.includes(origin);
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
