export async function analizarPartido(
  home: string,
  away: string,
  league: string,
  sport: string
): Promise<string> {
  try {
    const response = await fetch("https://betmind-server-production.up.railway.app/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home, away, league, sport, v: 2 })
    });
    const data = await response.json();
    return JSON.stringify(data);
  } catch (err) {
    return JSON.stringify({
      analysis: `${home} se enfrenta a ${away} en ${league}. Partido interesante con opciones para ambos equipos.`,
      pick: "1",
      confidence: 65
    });
  }
}
