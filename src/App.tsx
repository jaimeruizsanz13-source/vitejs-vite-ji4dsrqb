import { useState, useEffect, useCallback } from "react";
import { getMatchesHoy, getMatchesProximos } from "./api";
import { analizarPartido } from "./ai.ts";
import type { Match } from "./api";

type Tab = "inicio" | "picks" | "partidos" | "stats" | "perfil";
type Sport = "all" | "football" | "basketball" | "tennis";

const spinStyle = `@keyframes spin { to { transform: rotate(360deg); } }`;

const COMBOS = [
  { id:"c1", title:"Combo Seguro Mundial", odds:3.10, risk:"Bajo", picks:["España gana · 1.55","Argentina gana · 1.20","Francia gana · 1.40"] },
  { id:"c2", title:"Combo Valor", odds:7.20, risk:"Medio", picks:["Japón no pierde · 2.10","EE.UU. gana · 2.20","Marruecos empate o gana · 2.40"] },
];

const sportColor = (sport: string) => ({
  football: { bg:"#EDE9FE", color:"#5B21B6", bar:"linear-gradient(90deg,#7C3AED,#3B82F6)" },
  basketball: { bg:"#FEF3C7", color:"#92400E", bar:"linear-gradient(90deg,#F59E0B,#EF4444)" },
  tennis: { bg:"#D1FAE5", color:"#065F46", bar:"linear-gradient(90deg,#10B981,#3B82F6)" },
}[sport] || { bg:"#EDE9FE", color:"#5B21B6", bar:"linear-gradient(90deg,#7C3AED,#3B82F6)" });

const sportIcon = (s: string) => s === "football" ? "⚽" : s === "basketball" ? "🏀" : "🎾";

export default function App() {
  const [tab, setTab] = useState<Tab>("inicio");
  const [sport, setSport] = useState<Sport>("all");
  const [saved, setSaved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Match | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  useEffect(() => {
  console.log("API KEY:", import.meta.env.VITE_ANTHROPIC_KEY ? "EXISTE" : "VACÍA");
}, []);

  useEffect(() => {
    const s = localStorage.getItem("bm_saved");
    if (s) setSaved(JSON.parse(s));
    const hoy = getMatchesHoy();
    setMatches(hoy.length > 0 ? hoy : getMatchesProximos());
  }, []);

  const toggleSave = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = saved.includes(id) ? saved.filter(x => x !== id) : [...saved, id];
    setSaved(updated);
    localStorage.setItem("bm_saved", JSON.stringify(updated));
  };

  const getAIAnalysis = useCallback(async (m: Match) => {
    if (loadingAI) return;
    setSelected(m);
    setLoadingAI(m.id);
    try {
      const result = await analizarPartido(m.home, m.away, m.league, m.sport);
      const parsed = JSON.parse(result);
      setSelected(prev => prev ? {
        ...prev,
        analysis: parsed.analysis,
        pick: parsed.pick,
        confidence: parsed.confidence
      } : null);
    } catch {
    } finally {
      setLoadingAI(null);
    }
  }, [loadingAI]);

  const filtered = sport === "all" ? matches : matches.filter(m => m.sport === sport);
  const topPicks = matches.filter(m => m.confidence >= 70);
  const today = new Date().toLocaleDateString("es-ES", { weekday:"long", day:"numeric", month:"short" });

  const styles = {
    app: { maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: "#F0F4FF", display: "flex" as const, flexDirection: "column" as const, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" },
    header: { background: "linear-gradient(135deg,#7C3AED,#3B82F6)", padding: "24px 16px 16px", color: "#fff" },
    sectionTitle: { fontSize: 14, fontWeight: 800, color: "#3B1F6E", marginBottom: 12, display: "flex" as const, alignItems: "center" as const, gap: 6 },
    nav: { position: "fixed" as const, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "#fff", borderTop: "1px solid #DDD6FE", display: "flex" as const, paddingBottom: "env(safe-area-inset-bottom)" },
  };

  const MatchCard = ({ m }: { m: Match }) => {
    const sc = sportColor(m.sport);
    return (
      <div onClick={() => getAIAnalysis(m)} style={{
        background: "#fff", borderRadius: 16, padding: 14, marginBottom: 10,
        border: `1px solid ${saved.includes(m.id) ? "#7C3AED" : "#DDD6FE"}`,
        cursor: "pointer", position: "relative", overflow: "hidden",
        boxShadow: saved.includes(m.id) ? "0 0 0 2px #7C3AED" : "0 2px 8px rgba(124,58,237,0.08)"
      }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: sc.bar }} />
        <div style={{ paddingLeft: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, background: sc.bg, color: sc.color }}>
              {sportIcon(m.sport)} {m.league}
            </span>
            <span style={{ fontSize: 11, color: "#9CA3AF" }}>{m.date} · {m.time}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
            <div style={{ flex: 1, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>{m.home}</div>
            <div style={{ background: "#F0F4FF", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#7C3AED", margin: "0 8px" }}>VS</div>
            <div style={{ flex: 1, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#1e1b4b" }}>{m.away}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 5 }}>
              {([["1", m.odds.h], ["X", m.odds.d], ["2", m.odds.a]] as [string, number|null][])
                .filter(([, v]) => v !== null)
                .map(([label, val]) => {
                  const active = m.pick === label || (m.pick === "1X" && (label === "1" || label === "X")) || (m.pick === "X2" && (label === "X" || label === "2"));
                  return (
                    <span key={label} style={{
                      padding: "5px 8px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                      background: active ? "linear-gradient(135deg,#7C3AED,#3B82F6)" : "#F0F4FF",
                      color: active ? "#fff" : "#374151"
                    }}>{label} {val}</span>
                  );
                })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
              <span style={{
                fontSize: 11, fontWeight: 800, padding: "3px 8px", borderRadius: 20,
                background: m.confidence >= 75 ? "#D1FAE5" : "#FEF3C7",
                color: m.confidence >= 75 ? "#065F46" : "#92400E"
              }}>{m.confidence}%</span>
              <button onClick={(e) => toggleSave(m.id, e)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: saved.includes(m.id) ? "#F59E0B" : "#DDD6FE" }}>
                {saved.includes(m.id) ? "★" : "☆"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NavBtn = ({ id, icon, label }: { id: Tab; icon: string; label: string }) => (
    <button onClick={() => setTab(id)} style={{
      flex: 1, background: "none", border: "none", cursor: "pointer",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 4px"
    }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: tab === id ? "#7C3AED" : "#9CA3AF" }}>{label}</span>
      {tab === id && <div style={{ width: 20, height: 3, borderRadius: 2, background: "linear-gradient(90deg,#7C3AED,#3B82F6)" }} />}
    </button>
  );

  return (
    <div style={styles.app}>
      <style>{spinStyle}</style>

      <div style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", padding: "24px 16px 16px", color: "#fff" }}>
        <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: -0.5 }}>
          Bet<span style={{ color: "#A5F3A0" }}>Mind</span>
        </div>
        <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
          {today.charAt(0).toUpperCase() + today.slice(1)} · Tu asistente deportivo
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginTop: 14 }}>
          {[["7","Racha 🔥"],["69%","Precisión"],["142","Picks"],[`${matches.length}`,"Hoy"]].map(([v,l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.18)", borderRadius: 12, padding: "10px 4px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 9, opacity: 0.8, marginTop: 1, color: "#fff" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: 14, overflowY: "auto", paddingBottom: 90 }}>

        {tab === "inicio" && (
          <div>
            <div style={styles.sectionTitle}>🔥 Top Picks del día</div>
            {topPicks.slice(0,3).map(m => <MatchCard key={m.id} m={m} />)}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, marginBottom: 12 }}>
              <div style={styles.sectionTitle}>📅 Próximos partidos</div>
              <button onClick={() => setTab("partidos")} style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", padding: "5px 12px", borderRadius: 20, fontWeight: 700 }}>
                Ver todos →
              </button>
            </div>
            {matches.slice(0,3).map(m => <MatchCard key={m.id} m={m} />)}
          </div>
        )}

        {tab === "picks" && (
          <div>
            <div style={styles.sectionTitle}>🤖 IA Picks</div>
            {topPicks.map(m => (
              <div key={m.id} onClick={() => getAIAnalysis(m)} style={{ background: "linear-gradient(135deg,#EDE9FE,#DBEAFE)", borderRadius: 16, padding: 14, marginBottom: 12, border: "1px solid #C4B5FD", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", color: "#fff", fontSize: 10, padding: "3px 10px", borderRadius: 20, fontWeight: 800 }}>🤖 IA Pick</span>
                  <span style={{ fontSize: 11, color: "#6D28D9" }}>{sportIcon(m.sport)} {m.league}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1e1b4b", marginBottom: 6 }}>{m.home} vs {m.away}</div>
                <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.5, marginBottom: 10 }}>{m.analysis}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ background: "#D1FAE5", color: "#065F46", fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 800 }}>Pick: {m.pick}</span>
                  <span style={{ background: "#EDE9FE", color: "#5B21B6", fontSize: 12, padding: "4px 12px", borderRadius: 20, fontWeight: 700 }}>{m.confidence}% confianza</span>
                </div>
              </div>
            ))}
            <div style={{ ...styles.sectionTitle, marginTop: 16 }}>🃏 Combos recomendados</div>
            {COMBOS.map(c => (
              <div key={c.id} style={{ background: "linear-gradient(135deg,#FFFBEB,#FEF3C7)", borderRadius: 16, padding: 14, marginBottom: 12, border: "1px solid #FCD34D" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#78350F" }}>{c.title}</div>
                    <div style={{ fontSize: 11, color: "#B45309", marginTop: 2 }}>Riesgo {c.risk}</div>
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#D97706" }}>x{c.odds}</div>
                </div>
                {c.picks.map((p, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#78350F", marginBottom: 5 }}>
                    <span style={{ color: "#059669", fontWeight: 900 }}>✓</span> {p}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {tab === "partidos" && (
          <div>
            <div style={styles.sectionTitle}>📅 Todos los partidos</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto", paddingBottom: 4 }}>
              {(["all","football","basketball","tennis"] as Sport[]).map(s => (
                <button key={s} onClick={() => setSport(s)} style={{
                  background: sport === s ? "linear-gradient(135deg,#7C3AED,#3B82F6)" : "#fff",
                  border: `1px solid ${sport === s ? "#7C3AED" : "#DDD6FE"}`,
                  color: sport === s ? "#fff" : "#6B7280",
                  borderRadius: 20, padding: "6px 14px", fontSize: 12, cursor: "pointer",
                  whiteSpace: "nowrap", fontWeight: 700
                }}>
                  {s === "all" ? "Todos" : s === "football" ? "⚽ Fútbol" : s === "basketball" ? "🏀 Basket" : "🎾 Tenis"}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 10 }}>{filtered.length} partidos encontrados</div>
            {filtered.map(m => <MatchCard key={m.id} m={m} />)}
          </div>
        )}

        {tab === "stats" && (
          <div>
            <div style={styles.sectionTitle}>📊 Estadísticas</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                ["142","Predicciones","linear-gradient(135deg,#EDE9FE,#DBEAFE)","#5B21B6","#C4B5FD"],
                ["98","Acertadas","linear-gradient(135deg,#D1FAE5,#A7F3D0)","#065F46","#6EE7B7"],
                ["🔥 7","Racha","linear-gradient(135deg,#FEF3C7,#FDE68A)","#92400E","#FCD34D"],
                ["69%","Precisión","linear-gradient(135deg,#FCE7F3,#FBCFE8)","#9D174D","#F9A8D4"],
              ].map(([v,l,bg,color,border]) => (
                <div key={l} style={{ background: bg, borderRadius: 14, padding: 14, textAlign: "center", border: `1px solid ${border}` }}>
                  <div style={{ fontSize: 26, fontWeight: 900, color }}>{v}</div>
                  <div style={{ fontSize: 11, color, opacity: 0.8, marginTop: 4 }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 14, border: "1px solid #DDD6FE" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#3B1F6E", marginBottom: 12 }}>Precisión por deporte</div>
              {[["⚽ Fútbol","72","linear-gradient(90deg,#7C3AED,#3B82F6)","#EDE9FE","#5B21B6"],
                ["🏀 Basket","65","linear-gradient(90deg,#F59E0B,#EF4444)","#FEF3C7","#92400E"],
                ["🎾 Tenis","61","linear-gradient(90deg,#10B981,#3B82F6)","#D1FAE5","#065F46"]
              ].map(([label,pct,bar,bg,color]) => (
                <div key={label as string} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 5 }}>
                    <span style={{ color: "#374151" }}>{label}</span>
                    <span style={{ color: color as string }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: bg as string, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: bar as string, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "perfil" && (
          <div>
            <div style={styles.sectionTitle}>👤 Perfil</div>
            <div style={{ background: "linear-gradient(135deg,#7C3AED,#3B82F6)", borderRadius: 20, padding: 24, marginBottom: 16, textAlign: "center", color: "#fff" }}>
              <div style={{ width: 70, height: 70, borderRadius: "50%", background: "rgba(255,255,255,0.2)", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>👤</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>Usuario BetMind</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Miembro desde junio 2026</div>
              <div style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 12, padding: "4px 14px", borderRadius: 20, marginTop: 10, fontWeight: 700 }}>⚡ FREE</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid #DDD6FE" }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#3B1F6E", marginBottom: 12 }}>Mis estadísticas</div>
              {[["Predicciones totales","142"],["Acertadas","98 ✓"],["Racha actual","🔥 7 días"],["Mejor racha","12 días"]].map(([l,v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F3F4F6", fontSize: 13 }}>
                  <span style={{ color: "#6B7280" }}>{l}</span>
                  <span style={{ fontWeight: 800, color: "#1e1b4b" }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "linear-gradient(135deg,#D1FAE5,#DBEAFE)", borderRadius: 16, padding: 16, border: "1px solid #6EE7B7" }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#065F46", marginBottom: 6 }}>⚡ Hazte PRO</div>
              <div style={{ fontSize: 13, color: "#374151", marginBottom: 14, lineHeight: 1.5 }}>Desbloquea análisis ilimitados, alertas en tiempo real y estadísticas avanzadas</div>
              <button style={{ width: "100%", padding: 14, background: "linear-gradient(135deg,#7C3AED,#3B82F6)", border: "none", borderRadius: 12, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
                Upgrade a PRO →
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={styles.nav}>
        <NavBtn id="inicio" icon="🏠" label="Inicio" />
        <NavBtn id="picks" icon="🤖" label="IA Picks" />
        <NavBtn id="partidos" icon="📅" label="Partidos" />
        <NavBtn id="stats" icon="📊" label="Stats" />
        <NavBtn id="perfil" icon="👤" label="Perfil" />
      </div>

      {selected && (
        <div onClick={() => setSelected(null)} style={{ position: "fixed", inset: 0, background: "rgba(59,27,110,0.7)", display: "flex", alignItems: "flex-end", zIndex: 100 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: 24, width: "100%", maxWidth: 430, margin: "0 auto" }}>
            <div style={{ width: 40, height: 4, background: "linear-gradient(90deg,#7C3AED,#3B82F6)", borderRadius: 2, margin: "0 auto 20px" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ background: sportColor(selected.sport).bg, color: sportColor(selected.sport).color, fontSize: 11, padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>
                {sportIcon(selected.sport)} {selected.league}
              </span>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#9CA3AF", fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 19, fontWeight: 900, color: "#1e1b4b", marginBottom: 18 }}>
              <span style={{ flex: 1, textAlign: "center" }}>{selected.home}</span>
              <span style={{ color: "#9CA3AF", fontSize: 13, padding: "0 10px" }}>vs</span>
              <span style={{ flex: 1, textAlign: "center" }}>{selected.away}</span>
            </div>
            <div style={{ background: "linear-gradient(135deg,#EDE9FE,#DBEAFE)", borderRadius: 14, padding: 14, marginBottom: 16, border: "1px solid #C4B5FD" }}>
              <div style={{ fontSize: 10, color: "#6D28D9", fontWeight: 800, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>🤖 Análisis IA</div>
              {loadingAI === selected.id ? (
                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", color: "#7C3AED", fontWeight: 700, fontSize: 14 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #DDD6FE", borderTopColor: "#7C3AED", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                  Analizando con IA...
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{selected.analysis}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    <span style={{ background: "#D1FAE5", color: "#065F46", fontSize: 13, padding: "5px 14px", borderRadius: 20, fontWeight: 800 }}>Pick: {selected.pick}</span>
                    <span style={{ background: "#EDE9FE", color: "#5B21B6", fontSize: 13, padding: "5px 14px", borderRadius: 20 }}>{selected.confidence}% confianza</span>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => { toggleSave(selected.id); setSelected(null); }} style={{
              width: "100%", padding: 15, background: "linear-gradient(135deg,#7C3AED,#3B82F6)",
              border: "none", borderRadius: 14, color: "#fff", fontSize: 15, fontWeight: 900, cursor: "pointer"
            }}>
              {saved.includes(selected.id) ? "✓ Guardado" : "⚡ Guardar este pick"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
