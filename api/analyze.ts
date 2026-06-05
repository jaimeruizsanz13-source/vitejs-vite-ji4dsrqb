export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { home, away, league, sport } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_ANTHROPIC_KEY || "",
        "anthropic-version": "2023-06-01",
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

Responde SOLO en este formato JSON sin nada más:
{"analysis": "texto", "pick": "1", "confidence": 75}`
          }
        ]
      })
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || "";
    const parsed = JSON.parse(text);
    res.status(200).json(parsed);
  } catch {
    res.status(200).json({
      analysis: `${home} se enfrenta a ${away} en ${league}. Partido con opciones para ambos equipos.`,
      pick: "1",
      confidence: 65
    });
  }
}
