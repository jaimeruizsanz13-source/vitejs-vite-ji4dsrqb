export async function analizarPartido(
  home: string,
  away: string,
  league: string,
  sport: string
): Promise<string> {
  try {
    const key = import.meta.env.VITE_ANTHROPIC_KEY;
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 250,
        messages: [{
          role: "user",
          content: `Eres un analista deportivo experto. Analiza este partido en 2-3 frases en español considerando estadísticas recientes, forma del equipo y contexto de la competición. Sé específico y útil.

Partido: ${home} vs ${away}
Competición: ${league}
Deporte: ${sport}

Responde SOLO con este JSON sin texto extra:
{"analysis": "tu análisis aquí", "pick": "1", "confidence": 75}`
        }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return JSON.stringify(parsed);
  } catch {
    return JSON.stringify({
      analysis: `${home} se enfrenta a ${away} en ${league}. Partido interesante con opciones para ambos equipos.`,
      pick: "1",
      confidence: 65
    });
  }
}
