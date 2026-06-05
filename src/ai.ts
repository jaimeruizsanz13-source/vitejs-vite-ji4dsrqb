export async function analizarPartido(
  home: string,
  away: string,
  league: string,
  sport: string
): Promise<string> {
  const url = "https://betmind-server-production.up.railway.app/analyze";
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ home, away, league, sport })
    });
    const d = await r.json();
    return JSON.stringify(d);
  } catch {
    return JSON.stringify({
      analysis: `Error conectando al servidor. ${home} vs ${away}.`,
      pick: "1",
      confidence: 65
    });
  }
}
