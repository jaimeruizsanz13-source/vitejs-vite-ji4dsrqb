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
      body: JSON.stringify({ home, away, league, sport })
    });
    const data = await response.json();
    return JSON.stringify(data);
  } catch {
    return JSON.stringify({
      analysis: `${home} vs ${away} — Error de conexión`,
      pick: "1",
      confidence: 65
    });
  }
}
