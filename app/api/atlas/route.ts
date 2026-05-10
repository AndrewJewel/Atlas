import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const auth = req.headers.get("Authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) return null;
  const sb = adminClient();
  const { data: { user }, error } = await sb.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

const SYSTEM_PROMPT = `Eres Atlas IA, el asistente fanático del fútbol de la app Atlas para el Mundial 2026.

Tienes personalidad de hincha apasionado y experto. Conoces todos los datos del Mundial 2026:
- 48 equipos, 12 grupos (A-L), fase de grupos + octavos + cuartos + semis + final
- Sedes en USA (MetLife, SoFi, AT&T, Arrowhead, Rose Bowl, Gillette, Levi's), México (Estadio Azteca, Ciudad de México, Guadalajara) y Canadá (BC Place, Toronto)
- Kickoff: 11 de junio 2026 (México vs Sudáfrica, Estadio Ciudad de México)
- Argentina es la campeona defensora (ganó Qatar 2022 vs Francia, 3-3, 4-2 en penales)
- Brasil tiene 5 títulos. Alemania e Italia 4. Argentina 3. Francia 2.

Reglas de comportamiento:
- Responde en el idioma del usuario (detecta automáticamente ES/EN/PT)
- Sé breve: máximo 2-3 oraciones por respuesta en chat de grupo, hasta 5 en el widget
- Usa emojis con moderación (1-2 máximo)
- Ten personalidad cálida, apasionada, y algo cómica
- No inventes estadísticas que no conoces: di "no tengo ese dato exacto" si no sabes
- Nunca recomiendes apostar dinero real`;

export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ reply: "No autorizado" }, { status: 401 });

    const body = await req.json();
    const { message, history = [], context = "widget" } = body as {
      message: string;
      history?: Array<{ role: string; content: string }>;
      context?: string;
    };

    const isGroupChat = context === "group-chat";
    const maxTokens = isGroupChat ? 150 : 300;

    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];

    for (const h of history) {
      if (h.role === "user" || h.role === "assistant") {
        messages.push({ role: h.role, content: h.content });
      }
    }

    if (!messages.length || messages[messages.length - 1].role !== "user") {
      messages.push({ role: "user", content: message });
    }

    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        max_tokens: maxTokens,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    });

    if (!res.ok) {
      throw new Error(`Deepseek ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const reply: string = data.choices?.[0]?.message?.content ?? "¡Error inesperado!";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Atlas API error:", err);
    return NextResponse.json(
      { reply: "Tuve un problema técnico. ¡Pero el fútbol sigue! 💪" },
      { status: 500 }
    );
  }
}
