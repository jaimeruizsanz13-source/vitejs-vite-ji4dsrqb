export async function analizarPartido(
  home: string,
  away: string,
  league: string,
  sport: string
): Promise<string> {
  const key = import.meta.env.VITE_ANTHROPIC_KEY ?? "";
  
  if (!key) {
    return JSON.stringify({
      analysis: `Sin clave API configurada.`,
      pick: "1",
      confidence: 65
    });
  }

  try {
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
          content: `Eres un analista deportivo experto. Analiza este partido en 2-3 frases en español considerando estadísticas recientes y forma del equipo.

Partido: ${home} vs ${away}
Competición: ${league}
Deporte: ${sport}

Responde SOLO con este JSON:
{"analysis": "análisis aquí", "pick": "1", "confidence": 75}`
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return JSON.stringify(parsed);
  } catch (err) {
    return JSON.stringify({
      analysis: `Error: ${err}. ${home} vs ${away} en ${league}.`,
      pick: "1",
      confidence: 65
    });
  }
}
