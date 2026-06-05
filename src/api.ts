// v3
export type Match = {
  id: string;
  sport: string;
  league: string;
  home: string;
  away: string;
  time: string;
  date: string;
  odds: { h: number | null; d: number | null; a: number | null };
  confidence: number;
  pick: string;
  analysis: string;
};

const ALL_MATCHES: Match[] = [
  { id:"wc1", sport:"football", league:"Mundial 2026 · Grupo A", home:"México", away:"Sudáfrica", time:"20:00", date:"2026-06-11", odds:{h:1.70,d:3.50,a:5.00}, confidence:72, pick:"1", analysis:"México arranca el Mundial en casa ante Sudáfrica. Local favorito con el apoyo de su afición." },
  { id:"wc2", sport:"football", league:"Mundial 2026 · Grupo A", home:"Corea del Sur", away:"Rep. Checa", time:"20:00", date:"2026-06-11", odds:{h:2.10,d:3.20,a:3.60}, confidence:58, pick:"X", analysis:"Partido muy igualado entre dos selecciones de nivel similar." },
  { id:"wc3", sport:"football", league:"Mundial 2026 · Grupo B", home:"España", away:"Marruecos", time:"23:00", date:"2026-06-12", odds:{h:1.55,d:3.80,a:6.00}, confidence:78, pick:"1", analysis:"España es clara favorita. Marruecos peligroso pero España tiene demasiada calidad." },
  { id:"wc4", sport:"football", league:"Mundial 2026 · Grupo B", home:"Brasil", away:"Croacia", time:"20:00", date:"2026-06-12", odds:{h:1.65,d:3.60,a:5.50}, confidence:74, pick:"1", analysis:"Brasil con todo su potencial ofensivo. Croacia experimentada pero inferior." },
  { id:"wc5", sport:"football", league:"Mundial 2026 · Grupo C", home:"Argentina", away:"Albania", time:"02:00", date:"2026-06-13", odds:{h:1.20,d:7.00,a:14.0}, confidence:91, pick:"1", analysis:"Argentina campeona vigente. Messi lidera al equipo en busca del bicampeonato." },
  { id:"wc6", sport:"football", league:"Mundial 2026 · Grupo C", home:"EE.UU.", away:"Uruguay", time:"23:00", date:"2026-06-13", odds:{h:2.20,d:3.10,a:3.40}, confidence:55, pick:"X2", analysis:"Uruguay con más experiencia mundialista. EE.UU. juega en casa." },
  { id:"wc7", sport:"football", league:"Mundial 2026 · Grupo D", home:"Francia", away:"Nigeria", time:"20:00", date:"2026-06-14", odds:{h:1.40,d:4.50,a:8.00}, confidence:82, pick:"1", analysis:"Francia favorita al título, no debería tener problemas ante Nigeria." },
  { id:"wc8", sport:"football", league:"Mundial 2026 · Grupo D", home:"Alemania", away:"Japón", time:"23:00", date:"2026-06-14", odds:{h:1.75,d:3.60,a:4.80}, confidence:68, pick:"1", analysis:"Alemania quiere reivindicarse. Japón es un rival peligroso que puede sorprender." },
  { id:"wc9", sport:"football", league:"Mundial 2026 · Grupo E", home:"Portugal", away:"Arabia Saudí", time:"20:00", date:"2026-06-15", odds:{h:1.35,d:5.00,a:9.00}, confidence:85, pick:"1", analysis:"Portugal con Ronaldo quiere brillar en su último Mundial." },
  { id:"wc10", sport:"football", league:"Mundial 2026 · Grupo E", home:"Inglaterra", away:"Senegal", time:"23:00", date:"2026-06-15", odds:{h:1.60,d:3.70,a:5.50}, confidence:75, pick:"1", analysis:"Inglaterra favorita clara. Senegal tiene jugadores de Premier pero Inglaterra es superior." },
  { id:"wc11", sport:"football", league:"Mundial 2026 · Grupo F", home:"Holanda", away:"Chile", time:"20:00", date:"2026-06-16", odds:{h:1.65,d:3.60,a:5.20}, confidence:71, pick:"1", analysis:"Holanda con un equipo muy competitivo. Chile en reconstrucción pero siempre peleadora." },
  { id:"wc12", sport:"football", league:"Mundial 2026 · Grupo F", home:"Bélgica", away:"Canadá", time:"23:00", date:"2026-06-16", odds:{h:1.55,d:3.80,a:5.80}, confidence:73, pick:"1", analysis:"Bélgica con su generación dorada busca el título. Canadá juega en casa y puede sorprender." },
  { id:"nba1", sport:"basketball", league:"NBA Finals 2026 · Juego 1", home:"San Antonio Spurs", away:"New York Knicks", time:"02:00", date:"2026-06-05", odds:{h:1.90,d:null,a:2.00}, confidence:65, pick:"1", analysis:"San Antonio en casa en el Juego 1. Los Spurs con Wembanyama quieren aprovechar la ventaja de campo." },
  { id:"nba2", sport:"basketball", league:"NBA Finals 2026 · Juego 2", home:"San Antonio Spurs", away:"New York Knicks", time:"02:00", date:"2026-06-08", odds:{h:1.90,d:null,a:2.00}, confidence:63, pick:"1", analysis:"Segundo partido en San Antonio. Los Spurs quieren irse 2-0 antes de ir al Madison Square Garden." },
  { id:"nba3", sport:"basketball", league:"NBA Finals 2026 · Juego 3", home:"New York Knicks", away:"San Antonio Spurs", time:"02:00", date:"2026-06-11", odds:{h:2.05,d:null,a:1.85}, confidence:67, pick:"2", analysis:"Los Knicks juegan en el Madison Square Garden por primera vez en las Finals." },
  { id:"nba4", sport:"basketball", league:"NBA Finals 2026 · Juego 4", home:"New York Knicks", away:"San Antonio Spurs", time:"02:00", date:"2026-06-13", odds:{h:2.00,d:null,a:1.90}, confidence:60, pick:"1", analysis:"Nueva York quiere empatar la serie. El Garden será un volcán esta noche." },
  { id:"nba5", sport:"basketball", league:"NBA Finals 2026 · Juego 5", home:"San Antonio Spurs", away:"New York Knicks", time:"02:00", date:"2026-06-16", odds:{h:1.85,d:null,a:2.05}, confidence:68, pick:"1", analysis:"De vuelta a San Antonio. Partido decisivo para coger ventaja en la serie." },
  { id:"nba6", sport:"basketball", league:"NBA Finals 2026 · Juego 6", home:"New York Knicks", away:"San Antonio Spurs", time:"02:00", date:"2026-06-18", odds:{h:1.95,d:null,a:1.95}, confidence:57, pick:"1", analysis:"Nueva York intenta forzar el Juego 7 ante su afición." },
  { id:"nba7", sport:"basketball", league:"NBA Finals 2026 · Juego 7", home:"San Antonio Spurs", away:"New York Knicks", time:"02:00", date:"2026-06-20", odds:{h:1.80,d:null,a:2.10}, confidence:62, pick:"1", analysis:"El Juego 7 definitivo en San Antonio. Wembanyama vs New York. Todo se decide esta noche." },
];

export function getMatchesHoy(): Match[] {
  const hoy = new Date().toISOString().split("T")[0];
  return ALL_MATCHES.filter((m) => m.date >= hoy);
}

export function getMatchesProximos(): Match[] {
  const hoy = new Date().toISOString().split("T")[0];
  return ALL_MATCHES.filter((m) => m.date >= hoy);
}
