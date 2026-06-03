export async function analizarPartido(
  home: string,
  away: string,
  league: string,
  sport: string
): Promise<string> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "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",
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 200,
        messages: [
          {
            role: "user",
            content: `Eres un analista deportivo experto. Analiza este partido en 2-3 frases cortas en español. Da un pick (1, X, 2, 1X o X2) y confianza del 50-95%.

Partido: ${home} vs ${away}
Competición: ${league}
Deporte: ${sport}

Responde SOLO en este formato JSON:
{"analysis": "texto", "pick": "1", "confidence": 75}`
          }
        ]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const parsed = JSON.parse(text);
    return JSON.stringify(parsed);
  } catch {
    return JSON.stringify({
      analysis: `${home} se enfrenta a ${away} en ${league}. Partido con opciones para ambos equipos.`,
      pick: "1",
      confidence: 65
    });
  }
}
