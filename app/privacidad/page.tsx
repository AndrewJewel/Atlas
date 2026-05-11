export const metadata = {
  title: "Política de Privacidad — Atlas Mundialista",
};

export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-atlas-bg text-atlas-text px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Política de Privacidad</h1>
      <p className="text-sm text-atlas-muted mb-8">Última actualización: 10 de mayo de 2026</p>

      <section className="space-y-6 text-sm leading-relaxed text-atlas-text/80">
        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">1. Qué información recopilamos</h2>
          <p>Cuando usas Atlas Mundialista recopilamos:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Tu nombre y correo electrónico, obtenidos a través de Google OAuth o registro con email.</li>
            <li>El avatar y nombre de usuario que eliges dentro de la app.</li>
            <li>Tus predicciones de partidos y apuestas de grupo.</li>
            <li>Los mensajes que envías en los chats de grupo.</li>
            <li>Tu suscripción a notificaciones push (endpoint y claves de cifrado).</li>
            <li>Tu álbum Panini virtual y las transacciones de intercambio de láminas.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">2. Cómo usamos tu información</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Para identificarte dentro de la app y en los grupos que integras.</li>
            <li>Para mostrar tus predicciones, puntos y posición en los rankings.</li>
            <li>Para enviarte notificaciones push de mensajes en tus grupos (solo si las activaste).</li>
            <li>Para permitir que Atlas IA responda tus preguntas sobre el Mundial 2026.</li>
            <li>No vendemos ni compartimos tu información con terceros con fines publicitarios.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">3. Almacenamiento de datos</h2>
          <p>
            Tus datos se almacenan en servidores de <strong>Supabase</strong> (supabase.com), ubicados en la región de AWS us-east-1.
            La comunicación está cifrada con TLS. Las contraseñas nunca se almacenan en texto plano.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">4. Acceso de terceros</h2>
          <p>Utilizamos los siguientes servicios de terceros:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong>Google OAuth</strong> — autenticación con tu cuenta de Google.</li>
            <li><strong>Supabase</strong> — base de datos, autenticación y almacenamiento.</li>
            <li><strong>Vercel</strong> — alojamiento de la aplicación.</li>
            <li><strong>DeepSeek AI</strong> — modelo de lenguaje que impulsa Atlas IA.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">5. Retención de datos</h2>
          <p>
            Conservamos tus datos mientras tu cuenta esté activa. Puedes solicitar la eliminación de tu cuenta y datos en cualquier momento escribiéndonos a{" "}
            <a href="mailto:andres.chaves.joya@gmail.com" className="underline">andres.chaves.joya@gmail.com</a>.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">6. Tus derechos</h2>
          <p>Tienes derecho a acceder, corregir o eliminar tus datos personales. Contáctanos en el correo indicado arriba para ejercer cualquiera de estos derechos.</p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">7. Cambios a esta política</h2>
          <p>Podemos actualizar esta política ocasionalmente. Te notificaremos dentro de la app si hay cambios significativos.</p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">8. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta política escríbenos a{" "}
            <a href="mailto:andres.chaves.joya@gmail.com" className="underline">andres.chaves.joya@gmail.com</a>.
          </p>
        </div>
      </section>

      <div className="mt-10 pt-6 border-t border-white/10">
        <a href="/" className="text-sm text-atlas-muted hover:text-atlas-text transition-colors">← Volver a Atlas Mundialista</a>
      </div>
    </main>
  );
}
