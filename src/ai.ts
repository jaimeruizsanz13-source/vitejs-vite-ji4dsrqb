const API_KEY = "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";

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
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 250,
        messages: [{
          role: "user",
          content: `Eres un analista deportivo experto. Analiza este partido en 2-3 frases en español.

Partido: ${home} vs ${away}
Competición: ${league}
Deporte: ${sport}

Responde SOLO con este JSON sin nada más:
{"analysis": "análisis aquí", "pick": "1", "confidence": 75}`
        }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return JSON.stringify(parsed);
  } catch (err) {
    return JSON.stringify({
      analysis: `${home} vs ${away} — ${league}. Error: ${String(err)}`,
      pick: "1",
      confidence: 65
    });
  }
}
