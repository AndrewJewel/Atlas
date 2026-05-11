export const metadata = {
  title: "Términos de Servicio — Atlas Mundialista",
};

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-atlas-bg text-atlas-text px-6 py-12 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Términos de Servicio</h1>
      <p className="text-sm text-atlas-muted mb-8">Última actualización: 10 de mayo de 2026</p>

      <section className="space-y-6 text-sm leading-relaxed text-atlas-text/80">
        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">1. Descripción del servicio</h2>
          <p>
            Atlas Mundialista es una plataforma social gratuita para seguir el Mundial de Fútbol 2026. Permite a los usuarios crear grupos, chatear, hacer predicciones de partidos y coleccionar un álbum Panini virtual. Las predicciones son únicamente por diversión y no involucran dinero real.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">2. Uso aceptable</h2>
          <p>Al usar Atlas Mundialista te comprometes a:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>No publicar contenido ofensivo, violento, discriminatorio o ilegal en los chats de grupo.</li>
            <li>No intentar acceder a cuentas o datos de otros usuarios.</li>
            <li>No usar la app para fines comerciales sin autorización.</li>
            <li>No manipular las predicciones o rankings de forma fraudulenta.</li>
            <li>No abusar de Atlas IA para generar contenido inapropiado.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">3. Predicciones y puntos</h2>
          <p>
            Las predicciones y puntos dentro de Atlas Mundialista son únicamente para entretenimiento. No representan dinero real, apuestas deportivas con valor económico, ni ningún tipo de recompensa tangible. Nos reservamos el derecho de corregir errores en el cálculo de puntos.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">4. Contenido del usuario</h2>
          <p>
            Eres responsable del contenido que publicas en los chats de grupo. Nos reservamos el derecho de eliminar contenido que viole estos términos y de suspender cuentas que incumplan las normas de uso.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">5. Atlas IA</h2>
          <p>
            Atlas IA es un asistente de inteligencia artificial orientado al fútbol y el Mundial 2026. Sus respuestas son generadas automáticamente y pueden contener errores. No deben tomarse como información oficial ni asesoramiento profesional.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">6. Disponibilidad del servicio</h2>
          <p>
            Ofrecemos Atlas Mundialista de forma gratuita y haremos nuestro mejor esfuerzo para mantenerlo disponible. Sin embargo, no garantizamos disponibilidad ininterrumpida y no somos responsables por interrupciones del servicio.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">7. Modificaciones</h2>
          <p>
            Podemos actualizar estos términos en cualquier momento. El uso continuado de la app después de los cambios implica tu aceptación de los nuevos términos.
          </p>
        </div>

        <div>
          <h2 className="text-base font-semibold text-atlas-text mb-2">8. Contacto</h2>
          <p>
            Para cualquier consulta sobre estos términos escríbenos a{" "}
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
