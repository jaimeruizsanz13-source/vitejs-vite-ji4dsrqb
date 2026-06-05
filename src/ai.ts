export async function analizarPartido(
  home: string,
  away: string,
  league: string,
  sport: string
): Promise<string> {
  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home, away, league, sport })
    });
    const data = await response.json();
    return JSON.stringify(data);
  } catch {
    return JSON.stringify({
      analysis: `${home} se enfrenta a ${away} en ${league}. Partido con opciones para ambos equipos.`,
      pick: "1",
      confidence: 65
    });
  }
}
