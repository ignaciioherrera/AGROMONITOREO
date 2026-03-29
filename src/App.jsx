// AGRO·MONITOR Admin v2.1
import React, { useState, useEffect, useCallback, useRef } from "react";

const SUPABASE_URL = "https://izijmjntrpksmzuwvtle.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aWptam50cnBrc216dXd2dGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MTQyNjAsImV4cCI6MjA4OTE5MDI2MH0.hsG0v5xmM81lCMU1VvwHETFp8C9Al4OPxoSyuyfY_ks";

const sb = async (path, token) => {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token || SUPABASE_KEY}` }
  });
  return r.json();
};

// ── AUTH ──────────────────────────────────────────────────────
const authSignIn = async (email, password) => {
  const r = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify({ email, password })
  });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error_description || data.message || "Error al iniciar sesión");
  return data;
};

const authSignOut = async (token) => {
  await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
  });
};

const getStoredSession = () => {
  try { return JSON.parse(localStorage.getItem("agro_admin_session") || "null"); } catch { return null; }
};
const storeSession = (s) => localStorage.setItem("agro_admin_session", JSON.stringify(s));
const clearSession = () => localStorage.removeItem("agro_admin_session");

// ── LOGIN SCREEN ──────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e && e.preventDefault();
    if (!email || !password) return;
    setLoading(true); setError(null);
    try {
      const session = await authSignIn(email, password);
      storeSession(session);
      onLogin(session);
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f3", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#1e3a23", borderRadius: 14, padding: "14px 24px" }}>
            <span style={{ fontSize: 22, color: "#4ae87a", fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: 2 }}>◈ AGRO·MONITOR</span>
          </div>
          <div style={{ color: "#5a7a5e", fontSize: 13, marginTop: 12 }}>Panel Administrador</div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #dde5d8", padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#1a2e1d", marginBottom: 6 }}>Iniciar sesión</div>
          <div style={{ fontSize: 13, color: "#94b09a", marginBottom: 24 }}>Ingresá con tu cuenta de administrador</div>

          {error && (
            <div style={{ background: "#fdecea", border: "1px solid #c0392b30", borderRadius: 8, padding: "10px 14px", color: "#c0392b", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: "#5a7a5e", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="admin@ejemplo.com" autoFocus
              style={{ width: "100%", background: "#f4f6f3", border: "1px solid #dde5d8", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "#1a2e1d", outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: "#5a7a5e", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5, display: "block", marginBottom: 6 }}>CONTRASEÑA</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={{ width: "100%", background: "#f4f6f3", border: "1px solid #dde5d8", borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "#1a2e1d", outline: "none" }} />
          </div>
          <button onClick={handleLogin} disabled={loading || !email || !password}
            style={{ width: "100%", background: loading ? "#94b09a" : "#2d7a3a", border: "none", borderRadius: 10, padding: "13px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#94b09a" }}>
          AGRO·MONITOR · Panel Administrador
        </div>
      </div>
    </div>
  );
}

// ── NUEVA PALETA ──────────────────────────────────────────────
const C = {
  bg: "#f4f6f3",           // fondo general verde muy suave
  surface: "#ffffff",       // cards y superficies blancas
  card: "#ffffff",
  border: "#dde5d8",        // bordes verdes suaves
  borderStrong: "#b5c9ac",

  accent: "#2d7a3a",        // verde agrícola profundo
  accentLight: "#eaf4ec",   // verde muy suave para fondos de accent
  accentMid: "#4a9e5c",     // verde medio para hover

  warn: "#c97a1a",          // ámbar cálido
  warnLight: "#fef3e0",
  danger: "#c0392b",        // rojo claro
  dangerLight: "#fdecea",

  text: "#1a2e1d",          // texto principal oscuro
  textDim: "#5a7a5e",       // texto secundario verde grisáceo
  muted: "#94b09a",         // texto apagado
  mutedBg: "#f0f4ef",       // fondo apagado

  headerBg: "#1e3a23",      // header oscuro elegante
  headerText: "#e8f5eb",
  headerDim: "#7ab585",

  navBg: "#ffffff",
  navActive: "#2d7a3a",
  navActiveBg: "#eaf4ec",
};

const F = `'DM Mono', monospace`;
const SANS = `'DM Sans', sans-serif`;

const UMBRALES = {
  isocas: 2, chinches: 1, pulgones: 3, chicharrita: 1,
  trips: 5, aranhuelas: 2, cogollero: 1,
};

// ── GLOBAL CSS ────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes fadeIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin { to { transform:rotate(360deg) } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${C.bg}; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.borderStrong}; border-radius: 3px; }
  select option { background: ${C.surface}; color: ${C.text}; }
  tbody tr:hover td { background: ${C.accentLight}; cursor: pointer; transition: background 0.15s; }
  input:focus, select:focus { outline: none !important; border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentLight} !important; }
  button { transition: all 0.15s ease; }
`;

// ── COMPONENTS ────────────────────────────────────────────────

function Badge({ type }) {
  const map = {
    ok:     { bg: C.accentLight, color: C.accent, border: C.accent + "40", label: "OK" },
    warn:   { bg: C.warnLight,   color: C.warn,   border: C.warn + "50",   label: "⚠ ALERTA" },
    danger: { bg: C.dangerLight, color: C.danger, border: C.danger + "50", label: "✕ CRÍTICO" },
  };
  const s = map[type] || { bg: C.mutedBg, color: C.muted, border: C.border, label: "INFO" };
  return (
    <span style={{
      fontSize: 10, fontFamily: F, color: s.color,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 4, padding: "2px 8px", letterSpacing: 0.5, fontWeight: 600
    }}>{s.label}</span>
  );
}

function Stat({ label, value, color, sub }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "18px 20px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    }}>
      <div style={{ color: C.muted, fontSize: 10, letterSpacing: 1.5, marginBottom: 8, fontFamily: F, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: color || C.accent, fontFamily: F, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 11, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function MiniBar({ data, color }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data.map(d => d.v), 1);
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 44 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, flex: 1 }}>
          <div style={{
            width: "100%", background: color || C.accent,
            borderRadius: 3, height: Math.max(3, (d.v / max) * 36),
            opacity: d.v > 0 ? 0.85 : 0.2
          }} />
          <span style={{ fontSize: 9, color: C.muted, fontFamily: F }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function MapaMonitoreos({ monitoreos }) {
  const conGps = monitoreos.filter(m => m.gps_lat && m.gps_lng);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const loadLeaflet = () => {
      if (window.L) { initMap(); return; }
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    };
    const initMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;
      const defaultLat = conGps.length > 0 ? parseFloat(conGps[0].gps_lat) : -34.6;
      const defaultLng = conGps.length > 0 ? parseFloat(conGps[0].gps_lng) : -58.4;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([defaultLat, defaultLng], 13);
      mapInstanceRef.current = map;
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri', maxZoom: 19
      }).addTo(map);
      conGps.forEach(m => {
        const plagaCount = Object.keys(UMBRALES).filter(p => parseFloat(m[p]) >= UMBRALES[p]).length;
        const color = plagaCount > 0 ? '#c0392b' : m.enfermedades?.length > 0 ? '#c97a1a' : '#2d7a3a';
        const icon = L.divIcon({
          className: '',
          html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
          iconSize: [14, 14], iconAnchor: [7, 7],
        });
        const marker = L.marker([parseFloat(m.gps_lat), parseFloat(m.gps_lng)], { icon })
          .bindPopup(`
            <div style="font-family:monospace;font-size:12px;min-width:160px">
              <b style="color:${color}">${m.lote}</b><br/>
              <span style="color:#666">${m.empresa || ''}</span><br/>
              <span style="color:#666">${m.cultivo || ''} · ${m.fecha || ''}</span><br/>
              ${plagaCount > 0 ? `<span style="color:#c0392b">⚠ ${plagaCount} plaga(s) sobre umbral</span>` : ''}
              ${m.enfermedades?.length > 0 ? `<span style="color:#c97a1a">🦠 ${m.enfermedades[0]}</span>` : ''}
            </div>
          `).addTo(map);
        markersRef.current.push(marker);
      });
      if (conGps.length > 1) {
        const bounds = L.latLngBounds(conGps.map(m => [parseFloat(m.gps_lat), parseFloat(m.gps_lng)]));
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    };
    loadLeaflet();
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    conGps.forEach(m => {
      const plagaCount = Object.keys(UMBRALES).filter(p => parseFloat(m[p]) >= UMBRALES[p]).length;
      const color = plagaCount > 0 ? '#c0392b' : m.enfermedades?.length > 0 ? '#c97a1a' : '#2d7a3a';
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></div>`,
        iconSize: [14, 14], iconAnchor: [7, 7],
      });
      const marker = L.marker([parseFloat(m.gps_lat), parseFloat(m.gps_lng)], { icon })
        .bindPopup(`<div style="font-family:monospace;font-size:12px"><b style="color:${color}">${m.lote}</b><br/><span style="color:#666">${m.empresa || ''} · ${m.fecha || ''}</span></div>`)
        .addTo(mapInstanceRef.current);
      markersRef.current.push(marker);
    });
  }, [monitoreos]);

  if (conGps.length === 0) return (
    <div style={{ textAlign: "center", padding: 48, color: C.muted }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>📍</div>
      <div style={{ fontSize: 14 }}>No hay monitoreos con GPS aún</div>
      <div style={{ fontSize: 12, marginTop: 8 }}>Los puntos aparecen cuando los monitoreadores capturan GPS en el campo</div>
    </div>
  );

  return (
    <div>
      <div ref={mapRef} style={{ height: 500, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }} />
      <div style={{ display: "flex", gap: 18, marginTop: 12, flexWrap: "wrap" }}>
        {[[C.accent, "Sin alertas"], [C.warn, "Enfermedad"], [C.danger, "Plaga crítica"]].map(([col, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: col }} />
            <span style={{ fontSize: 12, color: C.textDim }}>{label}</span>
          </div>
        ))}
        <span style={{ fontSize: 11, color: C.muted, marginLeft: "auto" }}>{conGps.length} punto{conGps.length !== 1 ? "s" : ""} en el mapa</span>
      </div>
    </div>
  );
}

function GraficoEvolucion({ monitoreos }) {
  const [plaga, setPlaga] = useState("isocas");
  const [lote, setLote] = useState("todos");
  const plagas = [["isocas", "Isocas"], ["chinches", "Chinches"], ["pulgones", "Pulgones"], ["chicharrita", "Chicharrita"], ["trips", "Trips"], ["aranhuelas", "Arañuelas"], ["cogollero", "Cogollero"]];
  const lotes = ["todos", ...new Set(monitoreos.map(m => m.lote).filter(Boolean))];
  const filtered = monitoreos.filter(m => (lote === "todos" || m.lote === lote) && m[plaga] != null && m[plaga] !== "").sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).slice(-20);
  const max = Math.max(...filtered.map(m => parseFloat(m[plaga]) || 0), 1);
  const umbral = UMBRALES[plaga] || 1;
  // Aplicaciones para el lote/campo seleccionado, convertidas a día-de-campaña
  const appsEnGrafico = aplicaciones.filter(a =>
    (!lote || a.lote_nombre === lote) &&
    (!campo || a.campo_nombre === campo) &&
    a.fecha
  ).map(a => ({
    fecha: a.fecha,
    dia: getDiaCampana(a.fecha),
    campana: getCampana(a.fecha),
    tipo: a.tipo_aplicacion || "Aplicación",
    lote: a.lote_nombre,
    productos: (a.productos || []).map(p => p.producto_nombre).join(", ")
  }));

  const sel = {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "8px 12px", color: C.text, fontFamily: SANS, fontSize: 13, outline: "none", cursor: "pointer"
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <select style={sel} value={plaga} onChange={e => setPlaga(e.target.value)}>{plagas.map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <select style={sel} value={lote} onChange={e => setLote(e.target.value)}>{lotes.slice(0, 50).map(l => <option key={l} value={l}>{l === "todos" ? "Todos los lotes" : l}</option>)}</select>
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 30, color: C.muted, fontSize: 13 }}>Sin datos disponibles</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <svg width={Math.max(400, filtered.length * 44)} height="160" viewBox={`0 0 ${Math.max(400, filtered.length * 44)} 160`}>
            <line x1="0" y1={120 - (umbral / max) * 110} x2={filtered.length * 44} y2={120 - (umbral / max) * 110} stroke={C.warn} strokeWidth="1.5" strokeDasharray="5,4" />
            <text x="4" y={115 - (umbral / max) * 110} fill={C.warn} fontSize="9" fontFamily="monospace">umbral {umbral}</text>
            {filtered.map((m, i) => {
              const val = parseFloat(m[plaga]) || 0;
              const h = (val / max) * 110;
              const col = val >= umbral ? C.danger : C.accent;
              return (
                <g key={i}>
                  <rect x={i * 44 + 6} y={120 - h} width={30} height={h} rx="4" fill={col} opacity={0.75} />
                  <text x={i * 44 + 21} y={138} textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="monospace">{m.fecha?.slice(5)}</text>
                  {val > 0 && <text x={i * 44 + 21} y={120 - h - 5} textAnchor="middle" fill={col} fontSize="9" fontFamily="monospace" fontWeight="bold">{val}</text>}
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

function generarAlertas(monitoreos, umbralesOverride) {
  const U = umbralesOverride || UMBRALES;
  const alertas = [];
  monitoreos.forEach(m => {
    Object.entries(U).forEach(([plaga, umbral]) => {
      const val = parseFloat(m[plaga]);
      if (!isNaN(val) && val >= umbral) {
        alertas.push({ id: `${m.id}-${plaga}`, empresa: m.empresa, campo: m.campo, lote: m.lote, tipo: val >= umbral * 2 ? "danger" : "warn", msg: `${plaga.charAt(0).toUpperCase() + plaga.slice(1)}: ${val} (umbral: ${umbral})`, fecha: m.fecha, monitoreoId: m.id });
      }
    });
    if (m.enfermedades?.length > 0 && m.enfermedad_intensidad >= 3) alertas.push({ id: `${m.id}-enf`, empresa: m.empresa, campo: m.campo, lote: m.lote, tipo: m.enfermedad_intensidad >= 4 ? "danger" : "warn", msg: `Enfermedad: ${m.enfermedades[0]}${m.enfermedades.length > 1 ? ` +${m.enfermedades.length - 1}` : ""} (intensidad: ${m.enfermedad_intensidad}/5)`, fecha: m.fecha, monitoreoId: m.id });
    if (m.dano_granizo) alertas.push({ id: `${m.id}-granizo`, empresa: m.empresa, campo: m.campo, lote: m.lote, tipo: "danger", msg: "Daño por granizo reportado", fecha: m.fecha, monitoreoId: m.id });
    if (m.estres_hidrico >= 4) alertas.push({ id: `${m.id}-estres`, empresa: m.empresa, campo: m.campo, lote: m.lote, tipo: "warn", msg: `Estrés hídrico severo (${m.estres_hidrico}/5)`, fecha: m.fecha, monitoreoId: m.id });
  });
  return alertas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// ── EDITAR MONITOREO ─────────────────────────────────────────
function EditarMonitoreo({ m, onBack, onSaved }) {
  const [form, setForm] = useState({ ...m });
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    try {
      // Campos que Supabase maneja solo — nunca los enviamos en PATCH
      const reservados = new Set(["id", "created_at", "updated_at"]);
      const fields = Object.fromEntries(
        Object.entries(form).filter(([k, v]) => {
          if (reservados.has(k)) return false;
          // Convertir strings vacíos de campos numéricos a null
          return true;
        }).map(([k, v]) => {
          // Si era número y quedó string vacío, mandar null
          if (v === "" || v === undefined) return [k, null];
          return [k, v];
        })
      );
      const res = await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${m.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(fields)
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }
      setOk(true);
      setTimeout(() => { onSaved({ ...m, ...form }); }, 900);
    } catch (e) {
      console.error("Error al guardar:", e);
      alert("Error al guardar: " + e.message);
    }
    setSaving(false);
  };

  const inp = (label, key, type = "text", opts = {}) => (
    <div key={key}>
      <label style={labelSt}>{label}</label>
      {opts.textarea ? (
        <textarea value={form[key] ?? ""} onChange={e => set(key, e.target.value)} rows={3}
          style={{ ...inputSt, resize: "vertical" }} />
      ) : (
        <input type={type} value={form[key] ?? ""} onChange={e => set(key, type === "number" ? parseFloat(e.target.value) || "" : e.target.value)} style={inputSt} />
      )}
    </div>
  );

  const card = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 22px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" };

  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={onBack} style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 8, color: C.accent, fontSize: 13, cursor: "pointer", padding: "7px 14px", fontFamily: SANS, fontWeight: 600 }}>‹ Cancelar</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 700, fontFamily: SANS, color: C.text }}>Editando: {m.lote}</div>
          <div style={{ color: C.textDim, fontSize: 12 }}>{m.empresa} · {m.campo} · {m.fecha}</div>
        </div>
        {ok ? (
          <div style={{ background: C.accentLight, border: `1px solid ${C.accent}40`, borderRadius: 8, padding: "8px 16px", color: C.accent, fontWeight: 700, fontSize: 13 }}>✓ Guardado</div>
        ) : (
          <button onClick={save} disabled={saving} style={{ background: C.accent, border: "none", borderRadius: 8, padding: "9px 22px", color: "#fff", fontFamily: SANS, fontSize: 13, cursor: "pointer", fontWeight: 700, opacity: saving ? 0.7 : 1 }}>
            {saving ? "Guardando..." : "💾 Guardar cambios"}
          </button>
        )}
      </div>

      {/* Datos generales */}
      <div style={card}>
        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, marginBottom: 14, fontFamily: F, fontWeight: 600, textTransform: "uppercase" }}>Datos generales</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {inp("Empresa", "empresa")} {inp("Campo", "campo")} {inp("Lote", "lote")} {inp("Cultivo", "cultivo")}
          {inp("Fecha", "fecha", "date")} {inp("Hora", "hora", "time")} {inp("Estadio fenológico", "estadio_fenologico")} {inp("Plantas/m", "plantas_por_metro", "number")}
          {inp("Canopeo %", "cobertura", "number")} {inp("Estrés hídrico (1-5)", "estres_hidrico", "number")}
        </div>
      </div>

      {/* Plagas */}
      <div style={card}>
        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, marginBottom: 14, fontFamily: F, fontWeight: 600, textTransform: "uppercase" }}>Plagas</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[["Isocas", "isocas"], ["Isocas daño %", "isocas_dano"], ["Chinches", "chinches"], ["Chinches daño", "chinches_dano"],
            ["Pulgones", "pulgones"], ["Pulgones daño %", "pulgones_dano"], ["Chicharrita", "chicharrita"], ["Chicharrita daño %", "chicharrita_dano"],
            ["Trips", "trips"], ["Trips daño %", "trips_dano"], ["Arañuelas", "aranhuelas"], ["Arañuelas daño %", "aranhuelas_dano"],
            ["Cogollero", "cogollero"], ["Cogollero daño %", "cogollero_dano"]
          ].map(([l, k]) => inp(l, k, "number"))}
        </div>
      </div>

      {/* Observaciones */}
      <div style={card}>
        <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, marginBottom: 14, fontFamily: F, fontWeight: 600, textTransform: "uppercase" }}>Observaciones y Recomendaciones</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {inp("Observaciones", "observaciones", "text", { textarea: true })}
          {inp("Recomendaciones", "recomendaciones", "text", { textarea: true })}
        </div>
      </div>
    </div>
  );
}

// ── RECOMENDACION IA ─────────────────────────────────────────
function RecomendacionIA({ monitoreo, productos }) {
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [abierto, setAbierto] = useState(false);

  const pedir = async () => {
    setCargando(true);
    setAbierto(true);
    try {
      const res = await fetch("/api/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monitoreo, productos })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResultado(data.data);
      } else {
        setResultado({ error: data.error || "No se pudo generar la recomendación" });
      }
    } catch (e) { setResultado({ error: e.message }); }
    setCargando(false);
  };

  const alertaColor = { verde: C.accent, amarillo: C.warn, rojo: C.danger };
  const alertaBg = { verde: C.accentLight, amarillo: C.warnLight, rojo: C.dangerLight };
  const urgenciaColor = { inmediata: C.danger, proximos_dias: C.warn, opcional: C.muted };
  const tipoIcon = { aplicacion: "💊", monitoreo: "🔍", espera: "⏳", ninguna: "✓" };

  return (
    <div style={{ marginTop: 14 }}>
      {!abierto ? (
        <button onClick={pedir} style={{
          width: "100%", background: "linear-gradient(135deg, #1e3a23, #2d7a3a)",
          border: "none", borderRadius: 10, padding: "14px 20px", color: "#fff",
          fontFamily: SANS, fontSize: 14, cursor: "pointer", fontWeight: 700,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          boxShadow: "0 4px 14px rgba(45,122,58,0.3)"
        }}>
          <span style={{ fontSize: 18 }}>🤖</span>
          Generar Recomendación con IA
          <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>Claude Sonnet</span>
        </button>
      ) : (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          {/* Header IA */}
          <div style={{ background: "linear-gradient(135deg, #1e3a23, #2d7a3a)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>🤖</span>
              <div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>Recomendación Agronómica IA</div>
                <div style={{ color: "#7ab585", fontSize: 11 }}>Generado por Claude Sonnet · AGRO·MONITOR</div>
              </div>
            </div>
            <button onClick={() => { setAbierto(false); setResultado(null); }} style={{ background: "none", border: "none", color: "#7ab585", cursor: "pointer", fontSize: 18, padding: "4px 8px" }}>✕</button>
          </div>

          <div style={{ padding: 20 }}>
            {cargando ? (
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "24px 0" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.accent, animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>Analizando el monitoreo...</div>
                  <div style={{ fontSize: 12, color: C.textDim, marginTop: 3 }}>Claude está evaluando plagas, umbrales y condiciones del cultivo</div>
                </div>
              </div>
            ) : resultado?.error ? (
              <div style={{ background: C.dangerLight, borderRadius: 8, padding: "14px 16px", color: C.danger, fontSize: 13 }}>
                Error al generar recomendación: {resultado.error}
                <button onClick={pedir} style={{ marginLeft: 12, background: "none", border: `1px solid ${C.danger}`, borderRadius: 6, padding: "4px 10px", color: C.danger, cursor: "pointer", fontSize: 12 }}>Reintentar</button>
              </div>
            ) : resultado ? (
              <div>
                {/* Nivel de alerta */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px 16px", background: alertaBg[resultado.nivel_alerta] || C.accentLight, borderRadius: 10, border: `1px solid ${alertaColor[resultado.nivel_alerta] || C.accent}30` }}>
                  <div style={{ width: 14, height: 14, borderRadius: "50%", background: alertaColor[resultado.nivel_alerta] || C.accent, flexShrink: 0 }} />
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 600, lineHeight: 1.5 }}>{resultado.resumen}</div>
                  {resultado.proxima_visita_dias && (
                    <div style={{ marginLeft: "auto", textAlign: "center", flexShrink: 0 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: alertaColor[resultado.nivel_alerta] || C.accent, fontFamily: F }}>{resultado.proxima_visita_dias}</div>
                      <div style={{ fontSize: 10, color: C.muted }}>días para próxima visita</div>
                    </div>
                  )}
                </div>

                {/* Acciones recomendadas */}
                {resultado.acciones?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Acciones Recomendadas</div>
                    {resultado.acciones.map((a, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: C.mutedBg, borderRadius: 8, marginBottom: 8, borderLeft: `3px solid ${urgenciaColor[a.urgencia] || C.muted}` }}>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{tipoIcon[a.tipo] || "•"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{a.descripcion}</div>
                          <div style={{ fontSize: 11, color: urgenciaColor[a.urgencia] || C.muted, marginTop: 3, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>{a.urgencia?.replace(/_/g, " ")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Productos recomendados */}
                {resultado.productos_recomendados?.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Productos Sugeridos</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px,1fr))", gap: 10 }}>
                      {resultado.productos_recomendados.map((p, i) => (
                        <div key={i} style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 8, padding: "12px 14px" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>💊 {p.nombre}</div>
                          <div style={{ fontSize: 12, color: C.accent, fontFamily: F, marginBottom: 6 }}>Dosis: {p.dosis}</div>
                          <div style={{ fontSize: 11, color: C.textDim, lineHeight: 1.5 }}>{p.motivo}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Advertencias */}
                {resultado.advertencias?.length > 0 && (
                  <div style={{ background: C.warnLight, border: `1px solid ${C.warn}30`, borderRadius: 8, padding: "12px 14px" }}>
                    <div style={{ fontSize: 11, color: C.warn, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>⚠ Advertencias</div>
                    {resultado.advertencias.map((a, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.text, marginBottom: 4 }}>• {a}</div>
                    ))}
                  </div>
                )}

                {/* Footer */}
                <div style={{ fontSize: 10, color: C.muted, marginTop: 14, padding: "8px 0", borderTop: `1px solid ${C.border}` }}>
                  ⚠ Esta recomendación es orientativa. Validar con el criterio profesional del ingeniero agrónomo responsable antes de aplicar.
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function DetalleMonitoreo({ m, onBack, onDelete, onEdit }) {
  const [confirmando, setConfirmando] = useState(false);
  const plagas = [["Isocas", m.isocas, m.isocas_dano, "% defol.", "isocas"], ["Chinches", m.chinches, m.chinches_dano, "ninfas/m", "chinches"], ["Pulgones", m.pulgones, m.pulgones_dano, "% afect.", "pulgones"], ["Trips", m.trips, m.trips_dano, "% afect.", "trips"], ["Arañuelas", m.aranhuelas, m.aranhuelas_dano, "% hoja", "aranhuelas"], ["Chicharrita", m.chicharrita, m.chicharrita_dano, "% afect.", "chicharrita"], ["Cogollero", m.cogollero, m.cogollero_dano, "% afect.", "cogollero"]].filter(([, v]) => v != null && v !== "");
  const card = {
    background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
    padding: "16px 20px", marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
  };
  return (
    <div style={{ animation: "fadeIn 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" }}>
        <button onClick={onBack} style={{
          background: C.accentLight, border: `1px solid ${C.accent}30`,
          borderRadius: 8, color: C.accent, fontSize: 13, cursor: "pointer",
          padding: "7px 14px", fontFamily: SANS, fontWeight: 600
        }}>‹ Volver</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700, fontFamily: SANS, color: C.text }}>{m.lote}</div>
          <div style={{ color: C.textDim, fontSize: 13 }}>{m.empresa} · {m.campo} · {m.cultivo} · {m.fecha} {m.hora?.slice(0, 5)}</div>
        </div>
        {/* Botón editar */}
        <button onClick={onEdit} style={{
          background: C.accentLight, border: `1px solid ${C.accent}40`,
          borderRadius: 8, color: C.accent, fontSize: 13, cursor: "pointer",
          padding: "7px 14px", fontFamily: SANS, fontWeight: 600, display: "flex", alignItems: "center", gap: 6
        }}>✏️ Editar</button>
        {/* Botón eliminar con confirmación inline */}
        {!confirmando ? (
          <button onClick={() => setConfirmando(true)} style={{
            background: C.dangerLight, border: `1px solid ${C.danger}30`,
            borderRadius: 8, color: C.danger, fontSize: 13, cursor: "pointer",
            padding: "7px 14px", fontFamily: SANS, fontWeight: 600, display: "flex", alignItems: "center", gap: 6
          }}>🗑 Eliminar</button>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: 10, background: C.dangerLight,
            border: `1px solid ${C.danger}40`, borderRadius: 10, padding: "10px 16px"
          }}>
            <span style={{ fontSize: 13, color: C.danger, fontWeight: 600 }}>¿Confirmar?</span>
            <button onClick={() => onDelete(m.id)} style={{
              background: C.danger, border: "none", borderRadius: 7,
              color: "#fff", fontSize: 13, cursor: "pointer", padding: "6px 14px", fontWeight: 700, fontFamily: SANS
            }}>Sí</button>
            <button onClick={() => setConfirmando(false)} style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 7,
              color: C.textDim, fontSize: 13, cursor: "pointer", padding: "6px 12px", fontFamily: SANS
            }}>No</button>
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        {m.plantas_por_metro && <Stat label="PLANTAS/M" value={m.plantas_por_metro} />}
        {m.cobertura && <Stat label="CANOPEO" value={`${m.cobertura}%`} />}
        {m.estadio_fenologico && <Stat label="ESTADIO" value={m.estadio_fenologico} />}
        {m.estres_hidrico > 0 && <Stat label="ESTRÉS HÍDR." value={`${m.estres_hidrico}/5`} color={m.estres_hidrico >= 4 ? C.danger : m.estres_hidrico >= 3 ? C.warn : C.accent} />}
      </div>
      {plagas.length > 0 && (
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "12px 20px", fontSize: 11, color: C.textDim, letterSpacing: 1.5, borderBottom: `1px solid ${C.border}`, fontFamily: F, textTransform: "uppercase" }}>Plagas Detectadas</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["PLAGA", "CANTIDAD", "DAÑO", "ESTADO"].map(h => <th key={h} style={{ textAlign: "left", padding: "9px 18px", fontSize: 10, color: C.muted, letterSpacing: 1.5, fontFamily: F }}>{h}</th>)}</tr></thead>
            <tbody>
              {plagas.map(([name, qty, dano, unit, key]) => {
                const sup = parseFloat(qty) >= (UMBRALES[key] || 999);
                return (
                  <tr key={name} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "11px 18px", color: C.text, fontSize: 13, fontWeight: 500 }}>{name}</td>
                    <td style={{ padding: "11px 18px", fontFamily: F, color: sup ? C.danger : C.accent, fontSize: 13, fontWeight: 700 }}>{qty}</td>
                    <td style={{ padding: "11px 18px", color: C.textDim, fontSize: 13 }}>{dano ? `${dano} ${unit}` : "—"}</td>
                    <td style={{ padding: "11px 18px" }}><Badge type={sup ? "danger" : "ok"} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {m.enfermedades?.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1.5, marginBottom: 12, fontFamily: F, textTransform: "uppercase" }}>Enfermedades Foliares</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>{m.enfermedades.map(e => <span key={e} style={{ padding: "4px 14px", borderRadius: 20, background: C.dangerLight, border: `1px solid ${C.danger}30`, color: C.danger, fontSize: 12, fontWeight: 500 }}>{e}</span>)}</div>
          {m.enfermedad_intensidad > 0 && <div style={{ color: C.textDim, fontSize: 13, marginBottom: 6 }}>Intensidad: <span style={{ color: C.warn, fontWeight: 600 }}>{m.enfermedad_intensidad}/5</span></div>}
          {m.enfermedad_nota && <div style={{ color: C.textDim, fontSize: 13, lineHeight: 1.6 }}>{m.enfermedad_nota}</div>}
        </div>
      )}
      {m.malezas?.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1.5, marginBottom: 12, fontFamily: F, textTransform: "uppercase" }}>Malezas</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>{m.malezas.map(e => <span key={e} style={{ padding: "4px 14px", borderRadius: 20, background: C.accentLight, border: `1px solid ${C.accent}30`, color: C.accent, fontSize: 12 }}>{e}</span>)}</div>
          {m.maleza_cobertura && <div style={{ color: C.textDim, fontSize: 12 }}>Cobertura: <span style={{ color: C.warn, fontWeight: 600 }}>{m.maleza_cobertura}%</span></div>}
          {m.maleza_nota && <div style={{ color: C.textDim, fontSize: 13, marginTop: 6 }}>{m.maleza_nota}</div>}
        </div>
      )}
      {(m.dano_herbicida || m.dano_granizo) && (
        <div style={{ ...card, border: `1px solid ${C.danger}30`, background: C.dangerLight }}>
          <div style={{ fontSize: 11, color: C.danger, letterSpacing: 1.5, marginBottom: 10, fontFamily: F, textTransform: "uppercase" }}>Daños</div>
          {m.dano_herbicida && <div style={{ color: C.warn, marginBottom: 6, fontWeight: 500 }}>⚠ Herbicida{m.dano_herbicida_nota ? `: ${m.dano_herbicida_nota}` : ""}</div>}
          {m.dano_granizo && <div style={{ color: C.danger, fontWeight: 500 }}>⚠ Granizo{m.dano_granizo_nota ? `: ${m.dano_granizo_nota}` : ""}</div>}
        </div>
      )}
      {(m.observaciones || m.recomendaciones) && (
        <div style={card}>
          {m.observaciones && <><div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1.5, marginBottom: 6, fontFamily: F, textTransform: "uppercase" }}>Observaciones</div><div style={{ color: C.textDim, fontSize: 13, marginBottom: 16, lineHeight: 1.7 }}>{m.observaciones}</div></>}
          {m.recomendaciones && <><div style={{ fontSize: 11, color: C.accent, letterSpacing: 1.5, marginBottom: 6, fontFamily: F, textTransform: "uppercase" }}>Recomendaciones del monitoreador</div><div style={{ color: C.text, fontSize: 13, lineHeight: 1.7, background: C.accentLight, padding: "10px 14px", borderRadius: 8, borderLeft: `3px solid ${C.accent}` }}>{m.recomendaciones}</div></>}
        </div>
      )}
      {m.gps_lat && (
        <div style={card}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1.5, marginBottom: 8, fontFamily: F, textTransform: "uppercase" }}>Punto GPS</div>
          <div style={{ fontFamily: F, color: C.accent, fontSize: 13 }}>📍 {m.gps_lat}, {m.gps_lng}{m.gps_precision ? ` (±${m.gps_precision}m)` : ""}</div>
        </div>
      )}

      {/* ── FOTOS ── */}
      {m.fotos_urls?.length > 0 && (
        <div style={card}>
          <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1.5, marginBottom: 12, fontFamily: F, textTransform: "uppercase" }}>
            📷 Fotografías ({m.fotos_urls.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
            {m.fotos_urls.map((url, i) => (
              <a key={i} href={url} target="_blank" rel="noreferrer"
                style={{ display: "block", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}`, aspectRatio: "1", background: C.mutedBg }}>
                <img src={url} alt={`Foto ${i+1}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  onError={e => { e.target.style.display = "none"; }}
                />
              </a>
            ))}
          </div>
        </div>
      )}
      {m.fotos_count > 0 && !m.fotos_urls?.length && (
        <div style={{ ...card, color: C.muted, fontSize: 12, textAlign: "center" }}>
          📷 {m.fotos_count} foto{m.fotos_count > 1 ? "s" : ""} — subidas con versión anterior de la app (sin URL)
        </div>
      )}
    </div>
  );
}

// ── INPUTS HELPERS ────────────────────────────────────────────
const inputSt = {
  width: "100%", background: C.bg, border: `1px solid ${C.border}`,
  borderRadius: 8, padding: "9px 12px", color: C.text,
  fontFamily: SANS, fontSize: 13, outline: "none", boxSizing: "border-box"
};
const labelSt = { fontSize: 11, color: C.textDim, marginBottom: 5, fontFamily: F, letterSpacing: 0.5, display: "block" };


// ── COMPARATIVA ENTRE CAMPAÑAS ────────────────────────────────
function ComparativaCampanias({ monitoreos, aplicaciones = [] }) {
  const plagas = ["isocas","chinches","pulgones","chicharrita","trips","aranhuelas","cogollero"];
  const plagaLabels = { isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero" };
  const COLORES_CAMPANA = ["#2d7a3a","#c0392b","#2980b9","#8e44ad","#c97a1a","#16a085","#d35400","#2c3e50"];

  const [plaga, setPlaga] = useState("isocas");
  const [lote, setLote] = useState("");
  const [campo, setCampo] = useState("");

  // Extraer opciones únicas
  const lotes = [...new Set(monitoreos.map(m => m.lote).filter(Boolean))].sort();
  const campos = [...new Set(monitoreos.map(m => m.campo).filter(Boolean))].sort();

  // Filtrar por lote/campo seleccionado
  const mFiltrados = monitoreos.filter(m =>
    (!lote || m.lote === lote) &&
    (!campo || m.campo === campo) &&
    m.fecha && m[plaga] != null && m[plaga] !== ""
  );

  // Agrupar por año-campaña
  // Campaña: jul-año a jun-año+1 (ej: campaña "2024/25" = jul-2024 a jun-2025)
  const getCampana = (fecha) => {
    const d = new Date(fecha);
    const mes = d.getMonth() + 1; // 1-12
    const anio = d.getFullYear();
    return mes >= 7 ? `${anio}/${String(anio+1).slice(2)}` : `${anio-1}/${String(anio).slice(2)}`;
  };

  const getDiaCampana = (fecha) => {
    const d = new Date(fecha);
    const mes = d.getMonth() + 1;
    const anio = d.getFullYear();
    const inicioJul = mes >= 7 ? new Date(anio, 6, 1) : new Date(anio-1, 6, 1);
    return Math.floor((d - inicioJul) / 86400000);
  };

  const campanias = [...new Set(mFiltrados.map(m => getCampana(m.fecha)))].sort();

  // Por cada campaña, agrupar datos por día-de-campaña y promediar
  const seriesPorCampana = campanias.map((camp, ci) => {
    const datos = mFiltrados
      .filter(m => getCampana(m.fecha) === camp)
      .map(m => ({ dia: getDiaCampana(m.fecha), val: parseFloat(m[plaga]) || 0, fecha: m.fecha }))
      .sort((a, b) => a.dia - b.dia);

    // Agrupar por fecha (promedio del día)
    const porFecha = {};
    datos.forEach(d => {
      if (!porFecha[d.fecha]) porFecha[d.fecha] = { dia: d.dia, vals: [] };
      porFecha[d.fecha].vals.push(d.val);
    });
    const puntos = Object.values(porFecha).map(p => ({
      dia: p.dia,
      val: p.vals.reduce((s,v) => s+v, 0) / p.vals.length
    })).sort((a,b) => a.dia - b.dia);

    return { campana: camp, color: COLORES_CAMPANA[ci % COLORES_CAMPANA.length], puntos };
  });

  // SVG dimensions
  const svgW = 680;
  const svgH = 240;
  const padL = 44, padR = 20, padT = 16, padB = 32;
  const gW = svgW - padL - padR;
  const gH = svgH - padT - padB;

  const maxDia = Math.max(...seriesPorCampana.flatMap(s => s.puntos.map(p => p.dia)), 365);
  const maxVal = Math.max(...seriesPorCampana.flatMap(s => s.puntos.map(p => p.val)), 1);

  const xPos = (dia) => padL + (dia / maxDia) * gW;
  const yPos = (val) => padT + gH - (val / maxVal) * gH;

  // Meses labels (eje X — meses de campaña Jul=0)
  const mesesLabel = ["Jul","Ago","Sep","Oct","Nov","Dic","Ene","Feb","Mar","Abr","May","Jun"];
  const mesesDias  = [0, 31, 62, 92, 123, 153, 184, 215, 244, 275, 305, 336];

  // Estadísticas comparativas
  const statsData = seriesPorCampana.map(s => {
    const vals = s.puntos.map(p => p.val);
    const max = vals.length > 0 ? Math.max(...vals) : 0;
    const prom = vals.length > 0 ? (vals.reduce((a,b) => a+b, 0) / vals.length) : 0;
    const superan = s.puntos.filter(p => p.val >= (UMBRALES[plaga] || 1)).length;
    return { campana: s.campana, color: s.color, max, prom, superan, n: vals.length };
  });

  const sel = {
    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "7px 12px", color: C.text, fontFamily: SANS, fontSize: 12, outline: "none", cursor: "pointer"
  };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: SANS, color: C.text }}>📊 Comparativa entre Campañas</h2>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Evolución de la misma plaga año a año en el mismo lote</div>
        </div>
        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select style={sel} value={plaga} onChange={e => setPlaga(e.target.value)}>
            {plagas.map(p => <option key={p} value={p}>{plagaLabels[p]}</option>)}
          </select>
          <select style={sel} value={campo} onChange={e => { setCampo(e.target.value); setLote(""); }}>
            <option value="">Todos los campos</option>
            {campos.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select style={sel} value={lote} onChange={e => setLote(e.target.value)}>
            <option value="">Todos los lotes</option>
            {lotes.filter(l => !campo || monitoreos.some(m => m.lote === l && m.campo === campo)).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {seriesPorCampana.length === 0 ? (
        <div style={{ ...{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 48, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }, textAlign: "center", color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📊</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Sin datos suficientes</div>
          <div style={{ fontSize: 12 }}>Seleccioná una plaga y un lote con registros en múltiples campañas</div>
        </div>
      ) : (
        <>
          {/* Gráfico principal */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 12, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 14, fontWeight: 600 }}>
              {plagaLabels[plaga]} — {lote || campo || "Todos los lotes"} · {seriesPorCampana.length} campaña{seriesPorCampana.length > 1 ? "s" : ""}
            </div>
            <div style={{ overflowX: "auto" }}>
              <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block", minWidth: 400 }}>
                {/* Grid horizontal */}
                {[0, 0.25, 0.5, 0.75, 1].map(t => (
                  <g key={t}>
                    <line x1={padL} y1={padT + gH*(1-t)} x2={svgW-padR} y2={padT + gH*(1-t)} stroke={C.border} strokeWidth="1" strokeDasharray="3,4"/>
                    <text x={padL-5} y={padT + gH*(1-t)+4} textAnchor="end" fill={C.muted} fontSize="9" fontFamily="monospace">{(maxVal*t).toFixed(1)}</text>
                  </g>
                ))}
                {/* Línea de umbral */}
                {(() => { const u = UMBRALES[plaga]||1; const uy = yPos(u); return uy >= padT && uy <= padT+gH ? <line x1={padL} y1={uy} x2={svgW-padR} y2={uy} stroke={C.warn} strokeWidth="1.5" strokeDasharray="5,4" opacity="0.7"/> : null; })()}
                <text x={svgW-padR-2} y={yPos(UMBRALES[plaga]||1)-3} textAnchor="end" fill={C.warn} fontSize="9" fontFamily="monospace">umbral {UMBRALES[plaga]}</text>
                {/* Ejes */}
                <line x1={padL} y1={padT} x2={padL} y2={padT+gH} stroke={C.borderStrong} strokeWidth="1.5"/>
                <line x1={padL} y1={padT+gH} x2={svgW-padR} y2={padT+gH} stroke={C.borderStrong} strokeWidth="1.5"/>
                {/* Labels eje X — meses */}
                {mesesLabel.map((m, i) => (
                  <text key={m} x={xPos(mesesDias[i])} y={svgH-6} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">{m}</text>
                ))}
                {/* Líneas verticales de aplicaciones */}
                {appsEnGrafico.map((ap, i) => {
                  const x = xPos(ap.dia);
                  return (
                    <g key={"app-" + i}>
                      <line x1={x} y1={padT} x2={x} y2={padT+gH} stroke="#e67e22" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8"/>
                      <polygon points={x+","+padT+" "+(x-5)+","+(padT-8)+" "+(x+5)+","+(padT-8)} fill="#e67e22" opacity="0.9"/>
                      <title>{"💊 " + ap.tipo + " — " + ap.fecha + (ap.productos ? ": " + ap.productos : "")}</title>
                    </g>
                  );
                })}
                {/* Líneas por campaña */}
                {seriesPorCampana.map(s => {
                  if (s.puntos.length < 1) return null;
                  let path = "";
                  s.puntos.forEach((p, i) => {
                    const x = xPos(p.dia), y = yPos(p.val);
                    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
                  });
                  return (
                    <g key={s.campana}>
                      <path d={path} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
                      {s.puntos.map((p, i) => (
                        <circle key={i} cx={xPos(p.dia)} cy={yPos(p.val)} r="4" fill={s.color} stroke="white" strokeWidth="1.5">
                          <title>{s.campana}: {p.val.toFixed(1)}</title>
                        </circle>
                      ))}
                    </g>
                  );
                })}
              </svg>
            </div>
            {/* Leyenda */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 14 }}>
              {seriesPorCampana.map(s => (
                <div key={s.campana} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <div style={{ width: 24, height: 3, background: s.color, borderRadius: 2 }}/>
                  <span style={{ fontSize: 12, color: C.textDim, fontWeight: 600 }}>Campaña {s.campana}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla comparativa */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "12px 18px", fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, borderBottom: `1px solid ${C.border}`, background: C.mutedBg }}>
              Resumen por campaña
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["CAMPAÑA","MUESTRAS","MÁXIMO","PROMEDIO","FOCOS S/UMBRAL","TENDENCIA"].map(h => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 10, color: C.muted, letterSpacing: 1.5, fontFamily: F, borderBottom: `1px solid ${C.border}`, background: C.mutedBg }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statsData.map((s, i) => {
                  const prev = statsData[i-1];
                  const tendencia = prev
                    ? s.prom > prev.prom * 1.1 ? { icon: "↑", color: C.danger, label: "Subiendo" }
                    : s.prom < prev.prom * 0.9 ? { icon: "↓", color: C.accent, label: "Bajando" }
                    : { icon: "→", color: C.muted, label: "Estable" }
                    : { icon: "—", color: C.muted, label: "Base" };
                  return (
                    <tr key={s.campana} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 12, height: 12, borderRadius: "50%", background: s.color, flexShrink: 0 }}/>
                          <span style={{ fontWeight: 700, color: C.text, fontFamily: F }}>Campaña {s.campana}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: C.textDim, fontFamily: F, fontSize: 13 }}>{s.n}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: s.max >= (UMBRALES[plaga]||1) ? C.danger : C.accent, fontFamily: F, fontWeight: 700 }}>{s.max.toFixed(1)}</span>
                      </td>
                      <td style={{ padding: "12px 16px", color: C.textDim, fontFamily: F, fontSize: 13 }}>{s.prom.toFixed(2)}</td>
                      <td style={{ padding: "12px 16px" }}>
                        {s.superan > 0
                          ? <span style={{ background: C.warnLight, color: C.warn, padding: "2px 9px", borderRadius: 5, fontSize: 12, fontWeight: 700, fontFamily: F }}>{s.superan}</span>
                          : <span style={{ color: C.muted }}>—</span>}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ color: tendencia.color, fontWeight: 700, fontSize: 16 }}>{tendencia.icon}</span>
                        <span style={{ color: tendencia.color, fontSize: 11, marginLeft: 4 }}>{tendencia.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}


// ── SEGUIMIENTO POST-APLICACION ───────────────────────────────
function SeguimientoAplicacion({ aplicacion, monitoreos }) {
  const plagas = ["isocas","chinches","pulgones","chicharrita","trips","aranhuelas","cogollero"];
  const plagaLabels = { isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero" };

  // Monitoreos del mismo lote
  const mLote = monitoreos
    .filter(m => m.lote === aplicacion.lote_nombre && m.fecha)
    .sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

  const fechaApp = new Date(aplicacion.fecha);

  // Monitoreos antes (hasta 30 días antes) y después (hasta 60 días después)
  const mAntes   = mLote.filter(m => { const d = new Date(m.fecha); return d < fechaApp && d >= new Date(fechaApp - 30*86400000); });
  const mDespues = mLote.filter(m => { const d = new Date(m.fecha); return d > fechaApp && d <= new Date(fechaApp.getTime() + 60*86400000); });

  if (mLote.length === 0) return (
    <div style={{ padding: "14px 0", color: "#94b09a", fontSize: 12, textAlign: "center" }}>
      Sin monitoreos registrados para el lote <b>{aplicacion.lote_nombre}</b>
    </div>
  );

  // Determinar qué plagas tienen datos
  const plagasConDatos = plagas.filter(p =>
    [...mAntes, ...mDespues].some(m => m[p] != null && m[p] !== "")
  );

  if (plagasConDatos.length === 0) return (
    <div style={{ padding: "14px 0", color: "#94b09a", fontSize: 12, textAlign: "center" }}>
      Hay {mLote.length} monitoreo{mLote.length > 1 ? "s" : ""} del lote pero sin datos de plagas en el período ±60 días
    </div>
  );

  // Calcular promedio por plaga antes/después
  const avg = (arr, plaga) => {
    const vals = arr.map(m => parseFloat(m[plaga])).filter(v => !isNaN(v) && v >= 0);
    return vals.length > 0 ? vals.reduce((s,v) => s+v, 0) / vals.length : null;
  };

  // SVG mini gráfico por plaga
  const MiniLinea = ({ plaga, color }) => {
    const todos = [...mAntes, ...mDespues].sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
    const puntos = todos.map(m => ({ fecha: m.fecha, val: parseFloat(m[plaga]) || 0, esAntes: new Date(m.fecha) < fechaApp }));
    if (puntos.length === 0) return null;
    const maxV = Math.max(...puntos.map(p => p.val), 1);
    const W = 200, H = 50, pL = 4, pR = 4, pT = 6, pB = 4;
    const gW = W - pL - pR, gH = H - pT - pB;
    const xP = (i) => pL + (puntos.length <= 1 ? gW/2 : (i / (puntos.length-1)) * gW);
    const yP = (v) => pT + gH - (v / maxV) * gH;
    const umbral = UMBRALES[plaga] || 1;
    return (
      <svg width={W} height={H} style={{ display: "block" }}>
        <line x1={pL} y1={yP(umbral)} x2={W-pR} y2={yP(umbral)} stroke={C.warn} strokeWidth="1" strokeDasharray="3,3" opacity="0.6"/>
        {puntos.map((p,i) => i > 0 && (
          <line key={i} x1={xP(i-1)} y1={yP(puntos[i-1].val)} x2={xP(i)} y2={yP(p.val)} stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
        ))}
        {puntos.map((p,i) => (
          <circle key={i} cx={xP(i)} cy={yP(p.val)} r="3" fill={p.esAntes ? "#94b09a" : color} stroke="white" strokeWidth="1.2"/>
        ))}
      </svg>
    );
  };

  return (
    <div>
      {/* Línea de tiempo */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
        {mAntes.length > 0 && (
          <div style={{ textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: F, marginBottom: 4 }}>ANTES</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim }}>{mAntes.length} muestra{mAntes.length > 1 ? "s" : ""}</div>
          </div>
        )}
        <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, ${C.border}, ${C.accent}, ${C.border})`, minWidth: 40 }}/>
        <div style={{ textAlign: "center", minWidth: 90 }}>
          <div style={{ fontSize: 10, color: "#fff", background: C.accent, borderRadius: 20, padding: "2px 10px", fontFamily: F, fontWeight: 700, marginBottom: 4, whiteSpace: "nowrap" }}>💊 APLICACIÓN</div>
          <div style={{ fontSize: 11, color: C.textDim, fontFamily: F }}>{aplicacion.fecha}</div>
        </div>
        <div style={{ flex: 1, height: 2, background: `linear-gradient(to right, ${C.accent}, ${C.border})`, minWidth: 40 }}/>
        {mDespues.length > 0 && (
          <div style={{ textAlign: "center", minWidth: 80 }}>
            <div style={{ fontSize: 10, color: C.muted, fontFamily: F, marginBottom: 4 }}>DESPUÉS</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textDim }}>{mDespues.length} muestra{mDespues.length > 1 ? "s" : ""}</div>
          </div>
        )}
      </div>

      {/* Tabla comparativa por plaga */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.mutedBg }}>
              <th style={{ textAlign: "left", padding: "8px 12px", fontSize: 10, color: C.muted, fontFamily: F, letterSpacing: 1 }}>PLAGA</th>
              <th style={{ padding: "8px 12px", fontSize: 10, color: C.muted, fontFamily: F, letterSpacing: 1, textAlign: "center" }}>ANTES (prom)</th>
              <th style={{ padding: "8px 12px", fontSize: 10, color: C.muted, fontFamily: F, letterSpacing: 1, textAlign: "center" }}>DESPUÉS (prom)</th>
              <th style={{ padding: "8px 12px", fontSize: 10, color: C.muted, fontFamily: F, letterSpacing: 1, textAlign: "center" }}>EFECTO</th>
              <th style={{ padding: "8px 12px", fontSize: 10, color: C.muted, fontFamily: F, letterSpacing: 1, textAlign: "center" }}>EVOLUCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {plagasConDatos.map(p => {
              const antes   = avg(mAntes, p);
              const despues = avg(mDespues, p);
              const umbral  = UMBRALES[p] || 1;
              const color   = "#2980b9";

              let efecto = null;
              if (antes !== null && despues !== null) {
                const reduccion = ((antes - despues) / Math.max(antes, 0.01)) * 100;
                if (reduccion > 20)       efecto = { icon: "↓", label: `${reduccion.toFixed(0)}% baja`, color: C.accent, bg: C.accentLight };
                else if (reduccion < -20) efecto = { icon: "↑", label: `${Math.abs(reduccion).toFixed(0)}% sube`, color: C.danger, bg: C.dangerLight };
                else                      efecto = { icon: "→", label: "Sin cambio", color: C.muted, bg: C.mutedBg };
              } else if (despues !== null && antes === null) {
                efecto = { icon: "📊", label: "Solo post-app", color: C.textDim, bg: C.mutedBg };
              }

              return (
                <tr key={p} style={{ borderBottom: `1px solid ${C.border}` }}>
                  <td style={{ padding: "10px 12px", fontWeight: 600, color: C.text }}>{plagaLabels[p]}</td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {antes !== null
                      ? <span style={{ fontFamily: F, fontWeight: 700, color: antes >= umbral ? C.warn : C.textDim }}>{antes.toFixed(1)}</span>
                      : <span style={{ color: C.muted }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {despues !== null
                      ? <span style={{ fontFamily: F, fontWeight: 700, color: despues >= umbral ? C.danger : C.accent }}>{despues.toFixed(1)}</span>
                      : <span style={{ color: C.muted }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    {efecto
                      ? <span style={{ background: efecto.bg, color: efecto.color, padding: "3px 10px", borderRadius: 5, fontWeight: 700, fontSize: 11 }}>{efecto.icon} {efecto.label}</span>
                      : <span style={{ color: C.muted }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 12px", textAlign: "center" }}>
                    <MiniLinea plaga={p} color={color}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {(mAntes.length === 0 || mDespues.length === 0) && (
        <div style={{ fontSize: 11, color: C.muted, marginTop: 10, padding: "8px 12px", background: C.mutedBg, borderRadius: 7 }}>
          {mAntes.length === 0 && "⚠ Sin monitoreos previos a la aplicación en los últimos 30 días. "}
          {mDespues.length === 0 && "⚠ Sin monitoreos posteriores a la aplicación en los próximos 60 días."}
        </div>
      )}
    </div>
  );
}

// ── EXPORTAR ──────────────────────────────────────────────────
const exportCSV = (rows, columns, filename) => {
  const BOM = "\uFEFF"; // UTF-8 BOM para que Excel lo abra bien
  const header = columns.map(c => `"${c.label}"`).join(";");
  const body = rows.map(row =>
    columns.map(c => {
      const val = c.get(row);
      const str = val === null || val === undefined ? "" : String(val).replace(/"/g, '""');
      return `"${str}"`;
    }).join(";")
  ).join("\n");
  const csv = BOM + header + "\n" + body;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

const printTable = (title, html) => {
  const win = window.open("", "_blank");
  win.document.write(`
    <!DOCTYPE html><html><head>
    <meta charset="utf-8"/>
    <title>${title}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { font-family: 'DM Sans', sans-serif; font-size: 11px; color: #1a2e1d; padding: 24px; }
      h1 { font-size: 16px; font-weight: 700; margin-bottom: 4px; color: #1e3a23; }
      .meta { font-size: 10px; color: #5a7a5e; margin-bottom: 16px; }
      table { width: 100%; border-collapse: collapse; font-size: 10px; }
      th { background: #f0f4ef; color: #5a7a5e; text-align: left; padding: 7px 10px; border-bottom: 2px solid #dde5d8; font-weight: 600; letter-spacing: 0.5px; white-space: nowrap; }
      td { padding: 6px 10px; border-bottom: 1px solid #dde5d8; }
      tr:nth-child(even) td { background: #f9fbf9; }
      .badge-warn { background: #fef3e0; color: #c97a1a; padding: 1px 6px; border-radius: 4px; font-weight: 600; }
      .badge-danger { background: #fdecea; color: #c0392b; padding: 1px 6px; border-radius: 4px; font-weight: 600; }
      .badge-ok { background: #eaf4ec; color: #2d7a3a; padding: 1px 6px; border-radius: 4px; font-weight: 600; }
      .num { font-family: monospace; }
      @media print { body { padding: 0; } }
    </style>
    </head><body>
    <h1>🌱 AGRO·MONITOR — ${title}</h1>
    <div class="meta">Generado el ${new Date().toLocaleString("es-AR")} · agromonitoreo-admin.vercel.app</div>
    ${html}
    </body></html>
  `);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
};

// Botón reutilizable de exportación
const generarInformePDF = ({ monitoreos, aplicaciones, alertas, empresa, periodo }) => {
  const UMBRALES_DEF = { isocas: 2, chinches: 1, pulgones: 3, chicharrita: 1, trips: 5, aranhuelas: 2, cogollero: 1 };
  const plagaLabels = { isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero" };
  const hoy = new Date().toLocaleDateString("es-AR", { year:"numeric", month:"long", day:"numeric" });

  // Stats generales
  const totalM = monitoreos.length;
  const conPlagas = monitoreos.filter(m => Object.keys(UMBRALES_DEF).some(p => (parseFloat(m[p])||0) >= UMBRALES_DEF[p])).length;
  const conEnf = monitoreos.filter(m => m.enfermedades?.length > 0).length;
  const alertasCrit = alertas.filter(a => a.tipo === "danger").length;
  const appEmpresa = aplicaciones.filter(a => !empresa || a.empresa_nombre === empresa);
  const costoTotal = appEmpresa.reduce((s,a) => s + (parseFloat(a.costo_total_usd)||0), 0);

  // Top plagas
  const plagaStats = Object.keys(UMBRALES_DEF).map(p => {
    const superan = monitoreos.filter(m => (parseFloat(m[p])||0) >= UMBRALES_DEF[p]).length;
    const vals = monitoreos.map(m => parseFloat(m[p])).filter(v => !isNaN(v) && v > 0);
    const prom = vals.length > 0 ? (vals.reduce((s,v)=>s+v,0)/vals.length).toFixed(2) : "—";
    return { plaga: p, label: plagaLabels[p], superan, prom };
  }).sort((a,b) => b.superan - a.superan);

  // Últimos monitoreos
  const ultimos = [...monitoreos].sort((a,b) => new Date(b.fecha)-new Date(a.fecha)).slice(0,15);

  // Alertas críticas
  const alertasCriticas = alertas.filter(a => a.tipo === "danger").slice(0,10);

  const html = `
<!DOCTYPE html><html><head>
<meta charset="utf-8"/>
<title>Informe AGRO·MONITOR — ${empresa || "Todas las empresas"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&family=DM+Mono:wght@400;700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; font-size: 11px; color: #1a2e1d; background: #fff; padding: 0; }
  @page { margin: 18mm 16mm; size: A4; }
  @media print { .no-break { break-inside: avoid; } }

  /* Header */
  .header { background: #1e3a23; color: #fff; padding: 18px 24px; display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px; border-radius: 0 0 8px 8px; }
  .header-logo { font-family: 'DM Mono', monospace; font-size: 20px; color: #4ae87a; font-weight: 700; letter-spacing: 2px; }
  .header-sub { font-size: 11px; color: rgba(255,255,255,0.6); margin-top: 3px; }
  .header-right { text-align: right; font-size: 10px; color: rgba(255,255,255,0.7); line-height: 1.8; }

  /* Sections */
  h2 { font-size: 13px; font-weight: 700; color: #1e3a23; margin-bottom: 10px; padding-bottom: 6px; border-bottom: 2px solid #2d7a3a; display: flex; align-items: center; gap: 6px; }
  .section { margin-bottom: 22px; break-inside: avoid; }

  /* Stats grid */
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px; }
  .stat { background: #f4f6f3; border: 1px solid #dde5d8; border-radius: 8px; padding: 12px 14px; text-align: center; border-top: 3px solid #2d7a3a; }
  .stat.warn { border-top-color: #c97a1a; }
  .stat.danger { border-top-color: #c0392b; }
  .stat-val { font-family: 'DM Mono', monospace; font-size: 26px; font-weight: 700; color: #2d7a3a; line-height: 1; }
  .stat.warn .stat-val { color: #c97a1a; }
  .stat.danger .stat-val { color: #c0392b; }
  .stat-label { font-size: 9px; color: #94b09a; letter-spacing: 1px; text-transform: uppercase; margin-top: 5px; }

  /* Tables */
  table { width: 100%; border-collapse: collapse; font-size: 10px; }
  th { background: #f0f4ef; color: #5a7a5e; text-align: left; padding: 7px 10px; border-bottom: 2px solid #dde5d8; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; font-size: 9px; }
  td { padding: 7px 10px; border-bottom: 1px solid #f0f4ef; vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  .badge { display: inline-block; padding: 2px 7px; border-radius: 4px; font-size: 9px; font-weight: 700; }
  .badge-warn { background: #fef3e0; color: #c97a1a; }
  .badge-danger { background: #fdecea; color: #c0392b; }
  .badge-ok { background: #eaf4ec; color: #2d7a3a; }
  .num { font-family: 'DM Mono', monospace; }
  .muted { color: #94b09a; }
  .bold { font-weight: 700; }

  /* Plagas bar */
  .plaga-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
  .plaga-fill { height: 10px; border-radius: 3px; background: #2d7a3a; }
  .plaga-fill.warn { background: #c97a1a; }
  .plaga-fill.danger { background: #c0392b; }

  /* Footer */
  .footer { margin-top: 28px; padding-top: 12px; border-top: 1px solid #dde5d8; display: flex; justify-content: space-between; font-size: 9px; color: #94b09a; }
</style>
</head><body>

<!-- HEADER -->
<div class="header">
  <div>
    <div class="header-logo">◈ AGRO·MONITOR</div>
    <div class="header-sub">Informe de Monitoreo Agronómico</div>
    <div style="font-size:13px;color:#fff;font-weight:700;margin-top:6px">${empresa || "Todas las empresas"}</div>
  </div>
  <div class="header-right">
    <div>Generado: ${hoy}</div>
    <div>Período: ${periodo || "Completo"}</div>
    <div>agromonitoreo-admin.vercel.app</div>
  </div>
</div>

<!-- STATS -->
<div class="stats">
  <div class="stat"><div class="stat-val">${totalM}</div><div class="stat-label">Total monitoreos</div></div>
  <div class="stat warn"><div class="stat-val">${conPlagas}</div><div class="stat-label">Con plagas s/umbral</div></div>
  <div class="stat danger"><div class="stat-val">${alertasCrit}</div><div class="stat-label">Alertas críticas</div></div>
  <div class="stat"><div class="stat-val">${appEmpresa.length}</div><div class="stat-label">Aplicaciones</div></div>
</div>

<!-- PRESION DE PLAGAS -->
<div class="section no-break">
  <h2>🦗 Presión de Plagas</h2>
  <table>
    <thead><tr><th>Plaga</th><th>Muestras s/umbral</th><th>% del total</th><th>Promedio detectado</th><th>Estado</th></tr></thead>
    <tbody>
      ${plagaStats.map(ps => {
        const pct = totalM > 0 ? ((ps.superan/totalM)*100).toFixed(1) : 0;
        const estado = ps.superan === 0 ? '<span class="badge badge-ok">Sin alerta</span>'
          : ps.superan <= 2 ? '<span class="badge badge-warn">Moderado</span>'
          : '<span class="badge badge-danger">Atención</span>';
        const barW = totalM > 0 ? Math.min((ps.superan/totalM)*100*3, 100) : 0;
        const barClass = ps.superan === 0 ? '' : ps.superan <= 2 ? 'warn' : 'danger';
        return `<tr>
          <td class="bold">${ps.label}</td>
          <td class="num">${ps.superan}</td>
          <td>
            <div style="display:flex;align-items:center;gap:6px">
              <div style="width:60px;background:#f0f4ef;border-radius:3px;height:10px">
                <div class="plaga-fill ${barClass}" style="width:${barW}%;height:100%"></div>
              </div>
              <span class="num">${pct}%</span>
            </div>
          </td>
          <td class="num">${ps.prom}</td>
          <td>${estado}</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>
</div>

${alertasCriticas.length > 0 ? `
<!-- ALERTAS CRITICAS -->
<div class="section no-break">
  <h2>🚨 Alertas Críticas</h2>
  <table>
    <thead><tr><th>Fecha</th><th>Empresa</th><th>Lote</th><th>Alerta</th><th>Nivel</th></tr></thead>
    <tbody>
      ${alertasCriticas.map(a => `<tr>
        <td class="num muted">${a.fecha}</td>
        <td>${a.empresa || "—"}</td>
        <td class="bold">${a.lote}</td>
        <td>${a.msg}</td>
        <td><span class="badge badge-danger">CRÍTICO</span></td>
      </tr>`).join("")}
    </tbody>
  </table>
</div>` : ""}

<!-- ULTIMOS MONITOREOS -->
<div class="section">
  <h2>📋 Detalle de Monitoreos</h2>
  <table>
    <thead><tr><th>Fecha</th><th>Empresa</th><th>Campo</th><th>Lote</th><th>Cultivo</th><th>Estadio</th><th>Plagas s/u</th><th>Observaciones</th></tr></thead>
    <tbody>
      ${ultimos.map(m => {
        const pc = Object.keys(UMBRALES_DEF).filter(p => (parseFloat(m[p])||0) >= UMBRALES_DEF[p]).length;
        return `<tr>
          <td class="num muted">${m.fecha}</td>
          <td>${m.empresa || "—"}</td>
          <td>${m.campo || "—"}</td>
          <td class="bold">${m.lote || "—"}</td>
          <td>${m.cultivo || "—"}</td>
          <td>${m.estadio_fenologico || "—"}</td>
          <td>${pc > 0 ? `<span class="badge badge-warn">${pc}</span>` : '<span class="muted">—</span>'}</td>
          <td style="max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="${(m.observaciones||"").replace(/"/g,"'")} ">${m.observaciones?.slice(0,40) || "—"}</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>
  ${totalM > 15 ? `<div style="font-size:9px;color:#94b09a;margin-top:6px">Mostrando los últimos 15 de ${totalM} monitoreos. Ver listado completo en la plataforma.</div>` : ""}
</div>

${appEmpresa.length > 0 ? `
<!-- APLICACIONES -->
<div class="section no-break">
  <h2>💊 Órdenes de Aplicación</h2>
  <table>
    <thead><tr><th>Fecha</th><th>Lote</th><th>Cultivo</th><th>Tipo</th><th>Superficie</th><th>Productos</th><th>Costo USD</th></tr></thead>
    <tbody>
      ${appEmpresa.map(a => `<tr>
        <td class="num muted">${a.fecha}</td>
        <td class="bold">${a.lote_nombre}</td>
        <td>${a.cultivo || "—"}</td>
        <td>${a.tipo_aplicacion || "—"}</td>
        <td class="num">${a.superficie_ha ? a.superficie_ha + " ha" : "—"}</td>
        <td>${a.productos?.map(p => p.producto_nombre).join(", ") || "—"}</td>
        <td class="num bold" style="color:#2d7a3a">${a.costo_total_usd ? "USD " + parseFloat(a.costo_total_usd).toFixed(2) : "—"}</td>
      </tr>`).join("")}
      <tr style="background:#f4f6f3;font-weight:700">
        <td colspan="6" style="text-align:right;padding:8px 10px;font-size:10px;color:#5a7a5e">COSTO TOTAL DEL PERÍODO</td>
        <td class="num bold" style="color:#2d7a3a">USD ${costoTotal.toFixed(2)}</td>
      </tr>
    </tbody>
  </table>
</div>` : ""}

<!-- FOOTER -->
<div class="footer">
  <span>AGRO·MONITOR · Panel Administrador · agromonitoreo-admin.vercel.app</span>
  <span>Generado el ${hoy} · Informe automático</span>
</div>

</body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
};

function ExportButtons({ onExcel, onPDF }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={onExcel} style={{
        background: "#fff", border: `1px solid #1d6f42`, borderRadius: 7,
        padding: "7px 14px", color: "#1d6f42", fontFamily: SANS, fontSize: 12,
        cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6
      }}>📊 Excel</button>
      <button onClick={onPDF} style={{
        background: "#fff", border: `1px solid #c0392b`, borderRadius: 7,
        padding: "7px 14px", color: "#c0392b", fontFamily: SANS, fontSize: 12,
        cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6
      }}>🖨 PDF</button>
    </div>
  );
}

// ── HELPERS ──────────────────────────────────────────────────
function Accordion({ title, icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, marginBottom: 16, boxShadow: "0 1px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left"
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.text, fontFamily: SANS }}>
          <span>{icon}</span>{title}
        </span>
        <span style={{ color: C.muted, fontSize: 16, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
      </button>
      {open && <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${C.border}` }}>{children}</div>}
    </div>
  );
}

// ── TABLERO DE CIERRES ───────────────────────────────────────
function TableroCierres({ monitoreos }) {
  const plagas = ["isocas", "chinches", "pulgones", "chicharrita", "trips", "aranhuelas", "cogollero"];
  const plagaLabels = { isocas: "Isocas", chinches: "Chinches", pulgones: "Pulgones", chicharrita: "Chicharrita", trips: "Trips", aranhuelas: "Arañuelas", cogollero: "Cogollero" };
  const plagaColors = {
    isocas: "#2d7a3a", chinches: "#c0392b", pulgones: "#c97a1a",
    chicharrita: "#8e44ad", trips: "#2980b9", aranhuelas: "#d35400", cogollero: "#16a085"
  };

  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatLayerRef = useRef(null);
  const conGpsRef = useRef([]);
  const plagaHeatRef = useRef("todas");

  const [plagaHeat, setPlagaHeat] = useState("todas");
  const [fechaDesde, setFechaDesde] = useState(() => { const d = new Date(); d.setMonth(d.getMonth() - 2); return d.toISOString().split("T")[0]; });
  const [fechaHasta, setFechaHasta] = useState(() => new Date().toISOString().split("T")[0]);
  const [matrizTab, setMatrizTab] = useState("acumulado"); // "acumulado" | "actual"
  const [matrizMetrica, setMatrizMetrica] = useState("frecuencia"); // "frecuencia" | "incidencia" | "severidad"

  const mFiltrados = monitoreos.filter(m => { const f = m.fecha || ""; return f >= fechaDesde && f <= fechaHasta; });
  const conGps = mFiltrados.filter(m => m.gps_lat && m.gps_lng);
  conGpsRef.current = conGps;
  plagaHeatRef.current = plagaHeat;

  // ── Intensidad y color del punto ──
  const getIntensity = (m, plaga) => {
    if (plaga === "todas") { const t = plagas.reduce((s, p) => s + (parseFloat(m[p]) || 0), 0); return Math.min(t / 10, 1); }
    const val = parseFloat(m[plaga]) || 0; return Math.min(val / (UMBRALES[plaga] * 3 || 3), 1);
  };
  const intensityColor = (norm) => {
    if (norm <= 0)   return { fill: "#3498db", label: "No Detectada" };
    if (norm < 0.3)  return { fill: "#2ecc71", label: "Baja / Leve" };
    if (norm < 0.65) return { fill: "#f39c12", label: "Media" };
    return { fill: "#e74c3c", label: "Alta" };
  };

  // ── Dibuja círculos ──
  const doUpdateHeat = (mapObj) => {
    const L = window.L;
    if (!L || !mapObj) return;
    if (heatLayerRef.current) { try { mapObj.removeLayer(heatLayerRef.current); } catch(e) {} heatLayerRef.current = null; }
    const gpsData = conGpsRef.current;
    const plaga = plagaHeatRef.current;
    if (gpsData.length === 0) return;
    const group = L.layerGroup();
    gpsData.forEach(m => {
      const lat = parseFloat(m.gps_lat), lng = parseFloat(m.gps_lng);
      if (isNaN(lat) || isNaN(lng)) return;
      const norm = getIntensity(m, plaga);
      const { fill } = intensityColor(norm);
      const r = 250 + norm * 1200;
      L.circle([lat, lng], { radius: r * 2, fillColor: fill, fillOpacity: 0.12, stroke: false }).addTo(group);
      L.circle([lat, lng], { radius: r, fillColor: fill, fillOpacity: 0.28, stroke: false }).addTo(group);
      const plagaVal = plaga === "todas"
        ? `Presión: ${plagas.reduce((s, p) => s + (parseFloat(m[p]) || 0), 0).toFixed(1)}`
        : `${plagaLabels[plaga]}: ${parseFloat(m[plaga]) || 0} (umbral: ${UMBRALES[plaga]})`;
      L.circleMarker([lat, lng], { radius: 6, fillColor: fill, fillOpacity: 1, stroke: true, color: "#fff", weight: 2 })
        .bindTooltip(`<b>${m.lote || ""}</b><br/>${m.empresa || ""}<br/>${m.fecha || ""}<br/>${plagaVal}`, { sticky: true })
        .addTo(group);
    });
    group.addTo(mapObj);
    heatLayerRef.current = group;
  };

  const loadLeaflet = (cb) => {
    if (window.L) { cb(); return; }
    if (!document.getElementById("leaflet-css")) {
      const lc = document.createElement("link"); lc.id = "leaflet-css"; lc.rel = "stylesheet";
      lc.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"; document.head.appendChild(lc);
    }
    if (document.querySelector('script[src*="leaflet@1.9.4/dist/leaflet.js"]')) {
      const w = setInterval(() => { if (window.L) { clearInterval(w); cb(); } }, 80); return;
    }
    const sl = document.createElement("script");
    sl.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"; sl.onload = cb; document.head.appendChild(sl);
  };

  useEffect(() => {
    loadLeaflet(() => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const L = window.L;
      const gps = conGpsRef.current;
      const lat = gps.length > 0 ? parseFloat(gps[0].gps_lat) : -34.6;
      const lng = gps.length > 0 ? parseFloat(gps[0].gps_lng) : -58.4;
      const map = L.map(mapRef.current, { zoomControl: true }).setView([lat, lng], 12);
      mapInstanceRef.current = map;
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { attribution: "Tiles © Esri", maxZoom: 19 }).addTo(map);
      doUpdateHeat(map);
      if (gps.length > 1) { try { map.fitBounds(L.latLngBounds(gps.map(m => [parseFloat(m.gps_lat), parseFloat(m.gps_lng)])), { padding: [50, 50] }); } catch(e) {} }
    });
    return () => { if (mapInstanceRef.current) { try { mapInstanceRef.current.remove(); } catch(e) {} mapInstanceRef.current = null; heatLayerRef.current = null; } };
  }, []);

  useEffect(() => { if (mapInstanceRef.current && window.L) doUpdateHeat(mapInstanceRef.current); }, [plagaHeat, conGps.length, fechaDesde, fechaHasta]);

  // ── Cálculos dinámica de plagas ──
  const diasUnicos = [...new Set(mFiltrados.map(m => m.fecha).filter(Boolean))].sort();
  const diasGrafico = diasUnicos.slice(-20);
  const svgW = Math.max(500, diasGrafico.length * 44);
  const svgH = 200; const padL = 38; const padB = 28; const padT = 14; const padR = 16;
  const gW = svgW - padL - padR; const gH = svgH - padB - padT;
  const seriesData = plagas.map(p => ({
    key: p, label: plagaLabels[p], color: plagaColors[p],
    vals: diasGrafico.map(d => {
      const ms = mFiltrados.filter(m => m.fecha === d && m[p] != null && m[p] !== "");
      if (ms.length === 0) return null;
      return ms.reduce((s, m) => s + (parseFloat(m[p]) || 0), 0) / ms.length;
    })
  }));
  const allVals = seriesData.flatMap(s => s.vals.filter(v => v !== null));
  const maxVal = Math.max(...allVals, 1);
  const getX = (i) => padL + (diasGrafico.length <= 1 ? gW / 2 : (i / (diasGrafico.length - 1)) * gW);
  const getY = (v) => padT + gH - (v / maxVal) * gH;
  const pathFor = (vals) => { let d = ""; vals.forEach((v, i) => { if (v === null) return; const prev = vals.slice(0, i).reverse().find(x => x !== null); d += prev === undefined ? `M ${getX(i)} ${getY(v)}` : ` L ${getX(i)} ${getY(v)}`; }); return d; };

  // ── Cálculos Matriz ──
  const cultivosUnicos = [...new Set(mFiltrados.map(m => m.cultivo).filter(Boolean))];
  // Últimos 14 días para "Situación Actual"
  const hoy14 = new Date(Date.now() - 14 * 86400000).toISOString().split("T")[0];
  const mActual = mFiltrados.filter(m => m.fecha >= hoy14);

  const calcMatriz = (datos) => cultivosUnicos.map(cult => {
    const ms = datos.filter(m => m.cultivo === cult);
    const row = { cultivo: cult, total: ms.length };
    plagas.forEach(p => {
      const conPlaga = ms.filter(m => (parseFloat(m[p]) || 0) > 0);
      const superan = ms.filter(m => (parseFloat(m[p]) || 0) >= UMBRALES[p]);
      const vals = ms.map(m => parseFloat(m[p])).filter(v => !isNaN(v) && v > 0);
      const promedio = vals.length > 0 ? vals.reduce((s, v) => s + v, 0) / vals.length : 0;
      row[`${p}_frecuencia`]  = ms.length > 0 ? (conPlaga.length / ms.length * 100) : 0;
      row[`${p}_incidencia`]  = ms.length > 0 ? (superan.length / ms.length * 100) : 0;
      row[`${p}_severidad`]   = promedio;
    });
    return row;
  });

  const matrizDatos = calcMatriz(matrizTab === "acumulado" ? mFiltrados : mActual);
  const metricaKey = (p) => `${p}_${matrizMetrica}`;
  const maxMatriz = Math.max(...matrizDatos.flatMap(r => plagas.map(p => r[metricaKey(p)])), 1);

  const cellColor = (val, max, color) => {
    if (val <= 0) return { bg: C.mutedBg, text: C.muted };
    const norm = val / max;
    const hex = Math.round(norm * 200).toString(16).padStart(2, "0");
    return { bg: `${color}${hex}`, text: norm > 0.55 ? "#fff" : C.text };
  };

  const metricaLabel = { frecuencia: "Frecuencia (%)", incidencia: "Incidencia (%)", severidad: "Severidad (prom)" };
  const sel = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", color: C.text, fontFamily: SANS, fontSize: 12, outline: "none", cursor: "pointer" };

  return (
    <div style={{ animation: "fadeIn 0.3s ease" }}>

      {/* HEADER con filtros de fecha */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, fontFamily: SANS, color: C.text, flex: 1 }}>🗺️ Tablero de Cierres</h2>
        <label style={{ fontSize: 11, color: C.muted, fontFamily: F }}>DESDE</label>
        <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)} style={{ ...sel, padding: "6px 10px" }} />
        <label style={{ fontSize: 11, color: C.muted, fontFamily: F }}>HASTA</label>
        <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)} style={{ ...sel, padding: "6px 10px" }} />
        <span style={{ fontSize: 12, color: C.muted, background: C.mutedBg, borderRadius: 6, padding: "4px 10px", fontFamily: F }}>{mFiltrados.length} monitoreos</span>
      </div>

      {/* ── 1. MAPA DE CALOR ── */}
      <Accordion title="Mapa de Calor" icon="🌡️">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0" }}>
          <span style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1 }}>CAPA DE PLAGAS</span>
          <select style={sel} value={plagaHeat} onChange={e => setPlagaHeat(e.target.value)}>
            <option value="todas">Todas</option>
            {plagas.map(p => <option key={p} value={p}>{plagaLabels[p]}</option>)}
          </select>
        </div>

        {conGps.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: C.muted, background: C.mutedBg, borderRadius: 8 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📍</div>Sin monitoreos con GPS en el período
          </div>
        ) : (
          <>
            <div style={{ position: "relative" }}>
              <div ref={mapRef} style={{ height: 400, borderRadius: 8, overflow: "hidden", border: `1px solid ${C.border}` }} />
              {/* Leyenda flotante */}
              <div style={{
                position: "absolute", bottom: 28, left: 12, zIndex: 1000,
                background: "rgba(255,255,255,0.95)", borderRadius: 8, padding: "10px 14px",
                boxShadow: "0 2px 12px rgba(0,0,0,0.15)", border: `1px solid ${C.border}`, minWidth: 140
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text, letterSpacing: 1, marginBottom: 8, fontFamily: F }}>LEYENDA</div>
                <div style={{ fontSize: 10, color: C.muted, marginBottom: 6, fontFamily: F }}>{plagaHeat === "todas" ? "TODAS" : plagaLabels[plagaHeat].toUpperCase()}</div>
                {[["#e74c3c", "Alta"], ["#f39c12", "Media"], ["#2ecc71", "Baja / Leve"], ["#3498db", "No Detectada"]].map(([col, label]) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 5 }}>
                    <div style={{ width: 12, height: 12, borderRadius: "50%", background: col, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: C.text }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "right", fontFamily: F }}>{conGps.length} puntos GPS</div>
          </>
        )}
      </Accordion>

      {/* ── 2. PRESIÓN DE PLAGAS ── */}
      <Accordion title="Presión de Plagas" icon="🐛">
        <div style={{ marginTop: 12 }}>
          {/* Cards resumen por plaga */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px,1fr))", gap: 10, marginBottom: 20 }}>
            {plagas.map(p => {
              const vals = mFiltrados.map(m => parseFloat(m[p])).filter(v => !isNaN(v) && v > 0);
              const superan = mFiltrados.filter(m => (parseFloat(m[p]) || 0) >= UMBRALES[p]).length;
              const total = mFiltrados.filter(m => m[p] != null && m[p] !== "").length;
              const frecuencia = total > 0 ? (vals.length / total * 100).toFixed(0) : 0;
              const promedio = vals.length > 0 ? (vals.reduce((s, v) => s + v, 0) / vals.length).toFixed(1) : "—";
              const col = superan > 0 ? plagaColors[p] : C.muted;
              return (
                <div key={p} style={{
                  background: C.surface, border: `1px solid ${superan > 0 ? col + "50" : C.border}`,
                  borderRadius: 10, padding: "12px 14px", borderTop: `3px solid ${superan > 0 ? col : C.border}`
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 6 }}>{plagaLabels[p]}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: col, fontFamily: F }}>{superan}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>focos / umbral {UMBRALES[p]}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <div style={{ flex: 1, background: C.mutedBg, borderRadius: 5, padding: "4px 6px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: C.muted, fontFamily: F }}>FREC.</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim }}>{frecuencia}%</div>
                    </div>
                    <div style={{ flex: 1, background: C.mutedBg, borderRadius: 5, padding: "4px 6px", textAlign: "center" }}>
                      <div style={{ fontSize: 9, color: C.muted, fontFamily: F }}>PROM.</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim }}>{promedio}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Gráfico dinámica */}
          {diasGrafico.length < 2 ? (
            <div style={{ textAlign: "center", padding: 28, color: C.muted, background: C.mutedBg, borderRadius: 8, fontSize: 13 }}>Sin suficientes fechas para graficar la dinámica</div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Evolución Temporal (promedio por fecha)</div>
              <div style={{ overflowX: "auto", background: C.mutedBg, borderRadius: 8, padding: "12px 8px" }}>
                <svg width={svgW} height={svgH} style={{ display: "block" }}>
                  {[0, 0.25, 0.5, 0.75, 1].map(t => (
                    <g key={t}>
                      <line x1={padL} y1={padT + gH * (1 - t)} x2={svgW - padR} y2={padT + gH * (1 - t)} stroke={C.border} strokeWidth="1" strokeDasharray="3,3" />
                      <text x={padL - 4} y={padT + gH * (1 - t) + 4} textAnchor="end" fill={C.muted} fontSize="9" fontFamily="monospace">{(maxVal * t).toFixed(1)}</text>
                    </g>
                  ))}
                  <line x1={padL} y1={padT} x2={padL} y2={padT + gH} stroke={C.borderStrong} strokeWidth="1.5" />
                  <line x1={padL} y1={padT + gH} x2={svgW - padR} y2={padT + gH} stroke={C.borderStrong} strokeWidth="1.5" />
                  {/* Líneas de umbral */}
                  {seriesData.map(s => {
                    const uy = getY(UMBRALES[s.key] || 0);
                    if (uy < padT || uy > padT + gH) return null;
                    return <line key={s.key} x1={padL} y1={uy} x2={svgW - padR} y2={uy} stroke={s.color} strokeWidth="0.8" strokeDasharray="3,5" opacity="0.45" />;
                  })}
                  {diasGrafico.map((d, i) => (
                    <text key={d} x={getX(i)} y={svgH - 6} textAnchor="middle" fill={C.muted} fontSize="8" fontFamily="monospace">{d.slice(5)}</text>
                  ))}
                  {seriesData.map(s => {
                    const path = pathFor(s.vals);
                    if (!path) return null;
                    return (
                      <g key={s.key}>
                        <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                        {s.vals.map((v, i) => v !== null && (
                          <circle key={i} cx={getX(i)} cy={getY(v)} r="3.5" fill={s.color} stroke="white" strokeWidth="1.5" />
                        ))}
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                {seriesData.filter(s => s.vals.some(v => v !== null && v > 0)).map(s => (
                  <div key={s.key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 22, height: 3, background: s.color, borderRadius: 2 }} />
                    <span style={{ fontSize: 11, color: C.textDim }}>{s.label}</span>
                    <span style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", background: C.mutedBg, borderRadius: 4, padding: "1px 5px" }}>u:{UMBRALES[s.key]}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </Accordion>

      {/* ── 3. MATRIZ DE FOCOS ── */}
      <Accordion title="Matriz de Focos (Cultivo × Plaga)" icon="🔢">
        <div style={{ marginTop: 12 }}>
          {/* Tabs Acumulado / Situación Actual */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
            <div style={{ display: "flex", background: C.mutedBg, borderRadius: 8, padding: 3, gap: 2 }}>
              {[["acumulado", "Acumulado"], ["actual", "Situación Actual"]].map(([k, l]) => (
                <button key={k} onClick={() => setMatrizTab(k)} style={{
                  padding: "6px 16px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, fontFamily: SANS, fontWeight: 600,
                  background: matrizTab === k ? C.surface : "transparent",
                  color: matrizTab === k ? C.accent : C.textDim,
                  boxShadow: matrizTab === k ? "0 1px 4px rgba(0,0,0,0.1)" : "none"
                }}>{l}</button>
              ))}
            </div>
            {/* Selector métrica */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>MÉTRICA</span>
              {[["frecuencia", "📊 Frecuencia"], ["incidencia", "% Incidencia"], ["severidad", "⚡ Severidad"]].map(([k, l]) => (
                <button key={k} onClick={() => setMatrizMetrica(k)} style={{
                  padding: "5px 12px", borderRadius: 6, border: `1px solid ${matrizMetrica === k ? C.accent : C.border}`,
                  background: matrizMetrica === k ? C.accentLight : "none",
                  color: matrizMetrica === k ? C.accent : C.textDim,
                  cursor: "pointer", fontSize: 11, fontFamily: SANS, fontWeight: matrizMetrica === k ? 600 : 400
                }}>{l}</button>
              ))}
            </div>
          </div>

          {matrizTab === "actual" && <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>Últimos 14 días · {mActual.length} monitoreos</div>}

          {matrizDatos.length === 0 ? (
            <div style={{ textAlign: "center", padding: 32, color: C.muted, background: C.mutedBg, borderRadius: 8 }}>Sin datos en el período</div>
          ) : (
            <>
              {/* Descripción de métrica */}
              <div style={{ fontSize: 11, color: C.textDim, marginBottom: 12, background: C.accentLight, padding: "8px 12px", borderRadius: 7, borderLeft: `3px solid ${C.accent}` }}>
                <b>{metricaLabel[matrizMetrica]}</b>
                {matrizMetrica === "frecuencia" && " — % de muestras donde se detectó la plaga (≥ 1 individuo)"}
                {matrizMetrica === "incidencia" && " — % de muestras donde se superó el umbral de daño económico"}
                {matrizMetrica === "severidad" && " — Promedio ponderado (1=Baja, 2=Media, 3=Grave) de las muestras con presencia"}
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", padding: "10px 14px", fontSize: 10, color: C.muted, letterSpacing: 1.5, fontFamily: F, background: C.mutedBg, borderBottom: `1px solid ${C.border}` }}>CULTIVO</th>
                      <th style={{ padding: "10px 10px", fontSize: 10, color: C.muted, fontFamily: F, background: C.mutedBg, borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>n</th>
                      {plagas.map(p => (
                        <th key={p} style={{ padding: "10px 10px", fontSize: 10, color: plagaColors[p], letterSpacing: 1, fontFamily: F, background: C.mutedBg, borderBottom: `1px solid ${C.border}`, textAlign: "center", whiteSpace: "nowrap", fontWeight: 700 }}>
                          {plagaLabels[p].toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matrizDatos.map((row, ri) => (
                      <tr key={row.cultivo} style={{ borderBottom: `1px solid ${C.border}`, background: ri % 2 === 0 ? "transparent" : "#fafcfa" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: C.text, fontSize: 13 }}>{row.cultivo}</td>
                        <td style={{ padding: "12px 10px", textAlign: "center" }}>
                          <span style={{ background: C.accentLight, color: C.accent, padding: "2px 9px", borderRadius: 12, fontSize: 12, fontWeight: 700, fontFamily: F }}>{row.total}</span>
                        </td>
                        {plagas.map(p => {
                          const val = row[metricaKey(p)];
                          const { bg, text } = cellColor(val, maxMatriz, plagaColors[p]);
                          const display = matrizMetrica === "severidad" ? (val > 0 ? val.toFixed(1) : "—") : (val > 0 ? `${val.toFixed(0)}%` : "—");
                          return (
                            <td key={p} style={{ padding: "12px 10px", textAlign: "center" }}>
                              <div style={{
                                display: "inline-flex", alignItems: "center", justifyContent: "center",
                                minWidth: 46, height: 30, borderRadius: 7,
                                background: bg, color: text,
                                fontSize: 12, fontWeight: val > 0 ? 700 : 400, fontFamily: F,
                              }}>{display}</div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 10, color: C.muted, marginTop: 10 }}>
                * Promedio ponderado (1=Leve, 2=Media, 3=Grave) · Hacé clic en una celda para ver el detalle de lotes afectados
              </div>
            </>
          )}
        </div>
      </Accordion>

      {/* ── 4. RESUMEN EJECUTIVO ── */}
      <Accordion title="Resumen Ejecutivo del Período" icon="📋" defaultOpen={false}>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {/* Top plagas */}
          <div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Ranking de Presión</div>
            {[...plagas].sort((a, b) => {
              const sa = mFiltrados.filter(m => (parseFloat(m[a]) || 0) >= UMBRALES[a]).length;
              const sb2 = mFiltrados.filter(m => (parseFloat(m[b]) || 0) >= UMBRALES[b]).length;
              return sb2 - sa;
            }).map((p, i) => {
              const focos = mFiltrados.filter(m => (parseFloat(m[p]) || 0) >= UMBRALES[p]).length;
              const pct = mFiltrados.length > 0 ? focos / mFiltrados.length * 100 : 0;
              return (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 11, color: C.muted, fontFamily: F, width: 16 }}>{i + 1}</span>
                  <span style={{ fontSize: 12, color: C.text, width: 80, fontWeight: focos > 0 ? 600 : 400 }}>{plagaLabels[p]}</span>
                  <div style={{ flex: 1, background: C.mutedBg, borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: plagaColors[p], borderRadius: 4, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: focos > 0 ? plagaColors[p] : C.muted, fontFamily: F, width: 36, textAlign: "right", fontWeight: 700 }}>{focos}</span>
                </div>
              );
            })}
          </div>
          {/* Stats generales */}
          <div>
            <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Estadísticas del Período</div>
            {[
              ["Total monitoreos", mFiltrados.length, C.accent],
              ["Con GPS", conGps.length, C.accent],
              ["Con alguna plaga", mFiltrados.filter(m => plagas.some(p => (parseFloat(m[p]) || 0) > 0)).length, C.warn],
              ["Sobre umbral", mFiltrados.filter(m => plagas.some(p => (parseFloat(m[p]) || 0) >= UMBRALES[p])).length, C.danger],
              ["Con enfermedades", mFiltrados.filter(m => m.enfermedades?.length > 0).length, C.danger],
              ["Cultivos distintos", cultivosUnicos.length, C.accent],
            ].map(([label, val, col]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 12px", borderRadius: 7, marginBottom: 4, background: C.mutedBg }}>
                <span style={{ fontSize: 12, color: C.textDim }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col, fontFamily: F }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </Accordion>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => getStoredSession());

  const handleLogin = (s) => setSession(s);
  const handleLogout = async () => {
    if (session?.access_token) await authSignOut(session.access_token).catch(() => {});
    clearSession();
    setSession(null);
  };

  if (!session) return <LoginScreen onLogin={handleLogin} />;
  return <AdminApp session={session} onLogout={handleLogout} />;
}

function AdminApp({ session, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [monitoreos, setMonitoreos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(false);
  const [filtroEmpresa, setFiltroEmpresa] = useState("todas");
  const [filtroCampo, setFiltroCampo] = useState("todos");
  const [filtroLote, setFiltroLote] = useState("todos");
  const [filtroCultivo, setFiltroCultivo] = useState("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todo");
  const [time, setTime] = useState(new Date());
  const [productos, setProductos] = useState([]);
  const [aplicaciones, setAplicaciones] = useState([]);
  const [margenes, setMargenes] = useState([]);
  const [showFormApp, setShowFormApp] = useState(false);
  const [expandedApp, setExpandedApp] = useState(null); // id of expanded aplicacion
  const [showFormProd, setShowFormProd] = useState(false);
  const [showFormMargen, setShowFormMargen] = useState(false);
  const [procesandoIA, setProcesandoIA] = useState(false);
  const [newApp, setNewApp] = useState({ lote_nombre: "", empresa_nombre: "", campo_nombre: "", cultivo: "", fecha: new Date().toISOString().split("T")[0], tipo_aplicacion: "", superficie_ha: "", observaciones: "", productos: [] });
  const [newProd, setNewProd] = useState({ nombre: "", tipo: "", unidad: "l", precio_usd: "" });
  const [newMargen, setNewMargen] = useState({ lote_nombre: "", empresa_nombre: "", campo_nombre: "", cultivo: "", campana: "", hectareas: "", rendimiento_qq: "", precio_grano_usd: "", costo_semilla_usd: "", costo_labores_usd: "", costo_agroquimicos_usd: "", costo_arrendamiento_usd: "", costo_flete_usd: "", costo_otros_usd: "" });
  const fileAppRef = useRef();

  const fetchData = useCallback(async () => {
    try { setLoading(true); const d = await sb("monitoreos?order=created_at.desc&limit=500"); setMonitoreos(Array.isArray(d) ? d : []); setError(null); }
    catch { setError("No se pudo conectar"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  const fetchProductos = useCallback(async () => { try { const d = await sb("productos_catalogo?order=nombre"); setProductos(Array.isArray(d) ? d : []); } catch { } }, []);
  const fetchAplicaciones = useCallback(async () => { try { const d = await sb("aplicaciones?order=created_at.desc&limit=200"); setAplicaciones(Array.isArray(d) ? d.map(a => ({ ...a, productos: typeof a.productos === "string" ? JSON.parse(a.productos) : (a.productos || []) })) : []); } catch { } }, []);
  const fetchMargenes = useCallback(async () => { try { const d = await sb("margen_bruto?order=created_at.desc&limit=200"); setMargenes(Array.isArray(d) ? d : []); } catch { } }, []);

  // Umbrales desde Supabase (con fallback a valores default)
  const [umbralesConfig, setUmbralesConfig] = useState(UMBRALES);
  const [savingUmbrales, setSavingUmbrales] = useState(false);
  const [umbralesSaved, setUmbralesSaved] = useState(false);

  const fetchUmbrales = useCallback(async () => {
    try {
      const d = await sb("umbrales?limit=20");
      if (Array.isArray(d) && d.length > 0) {
        const map = {};
        d.forEach(u => { map[u.plaga] = parseFloat(u.umbral); });
        setUmbralesConfig(prev => ({ ...prev, ...map }));
      }
    } catch { }
  }, []);

  const saveUmbral = async (plaga, valor) => {
    setSavingUmbrales(true);
    try {
      // Upsert: insert or update by plaga
      await fetch(`${SUPABASE_URL}/rest/v1/umbrales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify({ plaga, umbral: parseFloat(valor) })
      });
      setUmbralesConfig(prev => ({ ...prev, [plaga]: parseFloat(valor) }));
      setUmbralesSaved(true);
      setTimeout(() => setUmbralesSaved(false), 2000);
    } catch { alert("Error al guardar"); }
    setSavingUmbrales(false);
  };

  useEffect(() => { fetchProductos(); fetchAplicaciones(); fetchMargenes(); fetchUmbrales(); }, [fetchProductos, fetchAplicaciones, fetchMargenes, fetchUmbrales]);
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(t); }, []);

  const deleteMonitoreo = async (id) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: "return=minimal" }
      });
      setSelected(null);
      setMonitoreos(prev => prev.filter(m => m.id !== id));
    } catch(e) { alert("Error al eliminar el monitoreo"); }
  };

  const hoy = new Date().toISOString().split("T")[0];
  const semana = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const empresas = ["todas", ...new Set([...monitoreos.map(m => m.empresa), ...aplicaciones.map(a => a.empresa_nombre)].filter(Boolean))];
  const campos = ["todos", ...new Set(monitoreos.filter(m => filtroEmpresa === "todas" || m.empresa === filtroEmpresa).map(m => m.campo).filter(Boolean))];
  const lotes = ["todos", ...new Set(monitoreos.filter(m => (filtroEmpresa === "todas" || m.empresa === filtroEmpresa) && (filtroCampo === "todos" || m.campo === filtroCampo)).map(m => m.lote).filter(Boolean))];
  const cultivos = ["todos", ...new Set(monitoreos.map(m => m.cultivo).filter(Boolean))];
  const appCampos = ["todos", ...new Set(aplicaciones.filter(a => filtroEmpresa === "todas" || a.empresa_nombre === filtroEmpresa).map(a => a.campo_nombre).filter(Boolean))];
  const appLotes = ["todos", ...new Set(aplicaciones.filter(a => (filtroEmpresa === "todas" || a.empresa_nombre === filtroEmpresa) && (filtroCampo === "todos" || a.campo_nombre === filtroCampo)).map(a => a.lote_nombre).filter(Boolean))];
  const filtered = monitoreos.filter(m =>
    (filtroEmpresa === "todas" || m.empresa === filtroEmpresa) &&
    (filtroCampo === "todos" || m.campo === filtroCampo) &&
    (filtroLote === "todos" || m.lote === filtroLote) &&
    (filtroCultivo === "todos" || m.cultivo === filtroCultivo) &&
    (filtroPeriodo === "todo" || (filtroPeriodo === "hoy" && m.fecha === hoy) || (filtroPeriodo === "semana" && m.fecha >= semana))
  );
  const alertas = generarAlertas(filtered, umbralesConfig);
  const hoyCount = monitoreos.filter(m => m.fecha === hoy).length;
  const semanaCount = monitoreos.filter(m => m.fecha >= semana).length;
  const conPlagas = filtered.filter(m => Object.keys(umbralesConfig).some(p => parseFloat(m[p]) >= umbralesConfig[p])).length;
  const conEnf = filtered.filter(m => m.enfermedades?.length > 0).length;
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000);
    const fecha = d.toISOString().split("T")[0];
    return { label: `${d.getDate()}/${d.getMonth() + 1}`, v: monitoreos.filter(m => m.fecha === fecha).length };
  });

  // ── STYLES ─────────────────────────────────────────────────
  const st = {
    app: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: SANS, fontSize: 14 },

    header: {
      background: C.headerBg, padding: "0 28px", display: "flex",
      alignItems: "center", justifyContent: "space-between",
      height: 58, position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 2px 12px rgba(0,0,0,0.15)"
    },

    nav: {
      background: C.navBg, borderBottom: `1px solid ${C.border}`,
      padding: "0 24px", display: "flex", gap: 2, flexWrap: "wrap",
      boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
    },

    navBtn: (active) => ({
      padding: "13px 18px", border: "none", background: active ? C.navActiveBg : "transparent",
      color: active ? C.navActive : C.textDim,
      borderBottom: active ? `2px solid ${C.navActive}` : "2px solid transparent",
      borderRadius: active ? "4px 4px 0 0" : 0,
      cursor: "pointer", fontFamily: SANS, fontSize: 13, fontWeight: active ? 600 : 400,
      letterSpacing: 0, transition: "all 0.15s"
    }),

    filters: {
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      padding: "10px 28px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center"
    },

    main: { padding: "28px", maxWidth: 1400, margin: "0 auto" },

    card: {
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 10, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)"
    },

    th: {
      textAlign: "left", padding: "11px 16px", color: C.muted,
      fontSize: 10, letterSpacing: 1.5, borderBottom: `1px solid ${C.border}`,
      fontFamily: F, textTransform: "uppercase", background: C.mutedBg, fontWeight: 500
    },

    td: { padding: "12px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 13 },

    sel: {
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
      padding: "7px 12px", color: C.text, fontFamily: SANS, fontSize: 12,
      outline: "none", cursor: "pointer"
    },

    btnPrimary: {
      background: C.accent, border: "none", borderRadius: 8,
      padding: "9px 18px", color: "#fff", fontFamily: SANS,
      fontSize: 13, cursor: "pointer", fontWeight: 600,
      boxShadow: `0 2px 8px ${C.accent}40`
    },

    btnSecondary: {
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
      padding: "9px 18px", color: C.textDim, fontFamily: SANS, fontSize: 13, cursor: "pointer"
    },

    sectionTitle: {
      color: C.text, fontSize: 15, fontWeight: 700,
      fontFamily: SANS, letterSpacing: 0
    },
  };

  // ── ACTIONS ────────────────────────────────────────────────
  const saveProducto = async () => {
    if (!newProd.nombre) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo`, {
        method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: "return=minimal" },
        body: JSON.stringify({ nombre: newProd.nombre, tipo: newProd.tipo, unidad: newProd.unidad, precio_usd: parseFloat(newProd.precio_usd) || null })
      });
      setNewProd({ nombre: "", tipo: "", unidad: "l", precio_usd: "" });
      setShowFormProd(false);
      fetchProductos();
    } catch (e) { alert("Error al guardar"); }
  };

  const saveAplicacion = async () => {
    if (!newApp.lote_nombre || !newApp.fecha) return;
    const costoTotal = newApp.productos.reduce((s, p) => s + (parseFloat(p.costo_total) || 0), 0);
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones`, {
        method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: "return=minimal" },
        body: JSON.stringify({ ...newApp, superficie_ha: parseFloat(newApp.superficie_ha) || null, costo_total_usd: costoTotal, productos: newApp.productos })
      });
      setNewApp({ lote_nombre: "", empresa_nombre: "", campo_nombre: "", cultivo: "", fecha: new Date().toISOString().split("T")[0], tipo_aplicacion: "", superficie_ha: "", observaciones: "", productos: [] });
      setShowFormApp(false);
      fetchAplicaciones();
    } catch (e) { alert("Error al guardar"); }
  };

  const saveMargen = async () => {
    if (!newMargen.lote_nombre) return;
    const ing = (parseFloat(newMargen.rendimiento_qq) || 0) * (parseFloat(newMargen.precio_grano_usd) || 0) * (parseFloat(newMargen.hectareas) || 1) / 100;
    const costos = ['costo_semilla_usd', 'costo_labores_usd', 'costo_agroquimicos_usd', 'costo_arrendamiento_usd', 'costo_flete_usd', 'costo_otros_usd'].reduce((s, k) => s + (parseFloat(newMargen[k]) || 0), 0);
    const mb = ing - costos;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/margen_bruto`, {
        method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, Prefer: "return=minimal" },
        body: JSON.stringify({ ...newMargen, hectareas: parseFloat(newMargen.hectareas) || null, rendimiento_qq: parseFloat(newMargen.rendimiento_qq) || null, precio_grano_usd: parseFloat(newMargen.precio_grano_usd) || null, ingreso_bruto_usd: ing, costo_semilla_usd: parseFloat(newMargen.costo_semilla_usd) || null, costo_labores_usd: parseFloat(newMargen.costo_labores_usd) || null, costo_agroquimicos_usd: parseFloat(newMargen.costo_agroquimicos_usd) || null, costo_arrendamiento_usd: parseFloat(newMargen.costo_arrendamiento_usd) || null, costo_flete_usd: parseFloat(newMargen.costo_flete_usd) || null, costo_otros_usd: parseFloat(newMargen.costo_otros_usd) || null, margen_bruto_usd: mb, margen_bruto_pct: ing > 0 ? (mb / ing * 100) : null })
      });
      setNewMargen({ lote_nombre: "", empresa_nombre: "", campo_nombre: "", cultivo: "", campana: "", hectareas: "", rendimiento_qq: "", precio_grano_usd: "", costo_semilla_usd: "", costo_labores_usd: "", costo_agroquimicos_usd: "", costo_arrendamiento_usd: "", costo_flete_usd: "", costo_otros_usd: "" });
      setShowFormMargen(false);
      fetchMargenes();
    } catch (e) { alert("Error al guardar"); }
  };

  const procesarFotoIA = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result.split(",")[1];
        const mediaType = file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
        try {
          const res = await fetch("/api/extraer-receta", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ base64, mediaType })
          });
          const result = await res.json();
          resolve(result);
        } catch (e) { resolve({ success: false }); }
      };
      reader.readAsDataURL(file);
    });
  };

  const procesarVariosArchivos = async (files) => {
    if (!files || files.length === 0) return;
    setProcesandoIA(true);
    const fileArray = Array.from(files);

    if (fileArray.length === 1) {
      // Un solo archivo — comportamiento original: cargar en el formulario
      const result = await procesarFotoIA(fileArray[0]);
      if (result.success && result.data) {
        const extracted = result.data;
        const loteNombre = extracted.lotes?.length > 0 ? extracted.lotes.map(l => l.nombre).join(", ") : "";
        const superficieTotal = extracted.superficie_total_ha || (extracted.lotes?.reduce((s, l) => s + (parseFloat(l.superficie_ha) || 0), 0)) || "";
        setNewApp(prev => ({
          ...prev,
          empresa_nombre: extracted.empresa || prev.empresa_nombre,
          campo_nombre: extracted.campo || prev.campo_nombre,
          lote_nombre: loteNombre || prev.lote_nombre,
          fecha: extracted.fecha || prev.fecha,
          tipo_aplicacion: extracted.tipo_aplicacion || prev.tipo_aplicacion,
          cultivo: extracted.cultivo || prev.cultivo,
          superficie_ha: superficieTotal || prev.superficie_ha,
          productos: (extracted.productos || []).map(p => {
            const prodEnCatalogo = productos.find(prod => prod.nombre.toLowerCase().includes(p.nombre.toLowerCase().split(' ')[0]));
            return {
              producto_nombre: p.nombre, dosis: p.dosis, unidad: p.unidad || "cc/ha",
              precio_usd: prodEnCatalogo?.precio_usd || "",
              costo_total: prodEnCatalogo?.precio_usd ? ((parseFloat(p.dosis) || 0) * (parseFloat(superficieTotal) || 1) * (parseFloat(prodEnCatalogo.precio_usd) || 0) / 1000).toFixed(2) : ""
            };
          })
        }));
      } else { alert("No se pudo extraer la información. Completá manualmente."); }
    } else {
      // Múltiples archivos — procesar y guardar cada uno automáticamente
      let exitosos = 0;
      let fallidos = 0;
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const result = await procesarFotoIA(file);
        if (result.success && result.data) {
          const extracted = result.data;
          const loteNombre = extracted.lotes?.length > 0 ? extracted.lotes.map(l => l.nombre).join(", ") : "";
          const superficieTotal = extracted.superficie_total_ha || (extracted.lotes?.reduce((s, l) => s + (parseFloat(l.superficie_ha) || 0), 0)) || "";
          const nuevaApp = {
            lote_nombre: loteNombre,
            empresa_nombre: extracted.empresa || "",
            campo_nombre: extracted.campo || "",
            cultivo: extracted.cultivo || "",
            fecha: extracted.fecha || new Date().toISOString().split("T")[0],
            tipo_aplicacion: extracted.tipo_aplicacion || "",
            superficie_ha: superficieTotal || "",
            observaciones: `Importado desde ${file.name}`,
            productos: (extracted.productos || []).map(p => {
              const prodEnCatalogo = productos.find(prod => prod.nombre.toLowerCase().includes(p.nombre.toLowerCase().split(' ')[0]));
              return {
                producto_nombre: p.nombre, dosis: p.dosis, unidad: p.unidad || "cc/ha",
                precio_usd: prodEnCatalogo?.precio_usd || "",
                costo_total: prodEnCatalogo?.precio_usd ? ((parseFloat(p.dosis) || 0) * (parseFloat(superficieTotal) || 1) * (parseFloat(prodEnCatalogo.precio_usd) || 0) / 1000).toFixed(2) : ""
              };
            })
          };
          // Guardar automáticamente en Supabase
          try {
            const costoTotal = nuevaApp.productos.reduce((s, p) => s + (parseFloat(p.costo_total) || 0), 0);
            const storedSession = JSON.parse(localStorage.getItem("agro_admin_session") || "null");
            const authToken = storedSession?.access_token || session?.access_token || SUPABASE_KEY;
            await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${authToken}`, Prefer: "return=minimal" },
              body: JSON.stringify({ ...nuevaApp, productos: JSON.stringify(nuevaApp.productos), costo_total_usd: costoTotal })
            });
            exitosos++;
          } catch { fallidos++; }
        } else { fallidos++; }
      }
      await fetchAplicaciones();
      alert(`✅ ${exitosos} orden${exitosos !== 1 ? 'es' : ''} importada${exitosos !== 1 ? 's' : ''} correctamente.${fallidos > 0 ? `\n⚠ ${fallidos} archivo${fallidos !== 1 ? 's' : ''} no se pudo procesar.` : ''}`);
    }
    setProcesandoIA(false);
  };

  // ── DETAIL / EDIT VIEW ────────────────────────────────────────────
  if (selected) return (
    <div style={st.app}>
      <style>{GLOBAL_CSS}</style>
      <header style={st.header}>
        <span style={{ fontSize: 17, color: "#4ae87a", letterSpacing: 2, fontWeight: 700, fontFamily: F }}>◈ AGRO·MONITOR</span>
        <span style={{ color: C.headerDim, fontSize: 12, fontFamily: F }}>{time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
      </header>
      <main style={st.main}>
        {editing ? (
          <EditarMonitoreo
            m={selected}
            onBack={() => setEditing(false)}
            onSaved={(updated) => {
              setMonitoreos(prev => prev.map(m => m.id === updated.id ? updated : m));
              setSelected(updated);
              setEditing(false);
            }}
          />
        ) : (
          <>
            <DetalleMonitoreo
              m={selected}
              onBack={() => setSelected(null)}
              onDelete={deleteMonitoreo}
              onEdit={() => setEditing(true)}
            />
            <RecomendacionIA monitoreo={selected} productos={productos} />
          </>
        )}
      </main>
    </div>
  );

  // ── MAIN VIEW ──────────────────────────────────────────────
  const hasFilters = filtroEmpresa !== "todas" || filtroCampo !== "todos" || filtroLote !== "todos" || filtroCultivo !== "todos" || filtroPeriodo !== "todo";
  const navItems = [
    ["dashboard", "◉ Dashboard"],
    ["tablero", "🗺️ Tablero"],
    ["graficos", "📈 Gráficos"],
    ["comparativa", "📊 Comparativa"],
    ["alertas", `⚠ Alertas${alertas.length > 0 ? ` (${alertas.length})` : ""}`],
    ["registros", `⊞ Registros (${filtered.length})`],
    ["aplicaciones", "💊 Aplicaciones"],
    ["productos", "📦 Productos"],
    ["margen", "💰 Margen Bruto"],
    ["umbrales", "⚙ Umbrales"],
  ];

  return (
    <div style={st.app}>
      <style>{GLOBAL_CSS}</style>

      {/* HEADER */}
      <header style={st.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 17, color: "#4ae87a", letterSpacing: 2, fontWeight: 700, fontFamily: F }}>◈ AGRO·MONITOR</span>
          <span style={{ color: "#3a5240", fontSize: 13 }}>|</span>
          <span style={{ color: C.headerDim, fontSize: 13 }}>Panel Administrador</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={fetchData} style={{
            background: "none", border: `1px solid #3a5240`, borderRadius: 7,
            padding: "5px 13px", color: C.headerDim, fontFamily: F, fontSize: 11,
            cursor: "pointer", letterSpacing: 1
          }}>↻ ACTUALIZAR</button>
          <button onClick={onLogout} style={{
            background: "none", border: `1px solid #3a5240`, borderRadius: 7,
            padding: "5px 13px", color: C.headerDim, fontFamily: F, fontSize: 11,
            cursor: "pointer", letterSpacing: 1
          }}>⎋ Salir</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: error ? C.danger : "#4ae87a", display: "inline-block" }} />
            <span style={{ fontSize: 11, color: C.headerDim, fontFamily: F }}>{error ? "ERROR" : "CONECTADO"}</span>
          </div>
          <span style={{ color: C.headerDim, fontSize: 11, fontFamily: F, opacity: 0.7 }}>
            {session?.user?.email}
          </span>
          <span style={{ color: C.headerDim, fontSize: 12, fontFamily: F }}>
            {time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} · {time.toLocaleDateString("es-AR")}
          </span>
        </div>
      </header>

      {/* NAV */}
      <nav style={st.nav}>
        {navItems.map(([k, l]) => (
          <button key={k} style={st.navBtn(tab === k)} onClick={() => setTab(k)}>{l}</button>
        ))}
      </nav>

      {/* FILTERS */}
      <div style={st.filters}>
        <span style={{ fontSize: 11, color: C.muted, fontFamily: F, letterSpacing: 1, textTransform: "uppercase" }}>Filtros</span>
        <select style={st.sel} value={filtroEmpresa} onChange={e => { setFiltroEmpresa(e.target.value); setFiltroCampo("todos"); setFiltroLote("todos"); }}>
          {empresas.map(e => <option key={e} value={e}>{e === "todas" ? "Todas las empresas" : e}</option>)}
        </select>
        <select style={st.sel} value={filtroCampo} onChange={e => { setFiltroCampo(e.target.value); setFiltroLote("todos"); }}>
          {(tab === "aplicaciones" ? appCampos : campos).map(c => <option key={c} value={c}>{c === "todos" ? "Todos los campos" : c}</option>)}
        </select>
        <select style={st.sel} value={filtroLote} onChange={e => setFiltroLote(e.target.value)}>
          {(tab === "aplicaciones" ? appLotes : lotes).map(l => <option key={l} value={l}>{l === "todos" ? "Todos los lotes" : l}</option>)}
        </select>
        <select style={st.sel} value={filtroCultivo} onChange={e => setFiltroCultivo(e.target.value)}>
          {cultivos.map(c => <option key={c} value={c}>{c === "todos" ? "Todos los cultivos" : c}</option>)}
        </select>
        <select style={st.sel} value={filtroPeriodo} onChange={e => setFiltroPeriodo(e.target.value)}>
          <option value="todo">Todo el período</option>
          <option value="hoy">Hoy</option>
          <option value="semana">Últimos 7 días</option>
        </select>
        {hasFilters && (
          <button onClick={() => { setFiltroEmpresa("todas"); setFiltroCampo("todos"); setFiltroLote("todos"); setFiltroCultivo("todos"); setFiltroPeriodo("todo"); }}
            style={{ background: C.dangerLight, border: `1px solid ${C.danger}30`, borderRadius: 7, padding: "6px 12px", color: C.danger, fontFamily: SANS, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* MAIN */}
      <main style={st.main}>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 72, gap: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", border: `3px solid ${C.border}`, borderTopColor: C.accent, animation: "spin 0.8s linear infinite" }} />
            <span style={{ color: C.textDim, fontFamily: SANS }}>Cargando datos...</span>
          </div>
        )}
        {error && !loading && (
          <div style={{ ...st.card, textAlign: "center", color: C.danger, border: `1px solid ${C.danger}30`, background: C.dangerLight }}>
            ✕ {error} — <button onClick={fetchData} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontFamily: SANS, fontWeight: 600 }}>Reintentar</button>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* ── DASHBOARD ── */}
            {tab === "dashboard" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 14, marginBottom: 24 }}>
                  <Stat label="TOTAL MONITOREOS" value={monitoreos.length} sub="en base de datos" />
                  <Stat label="HOY" value={hoyCount} color={hoyCount > 0 ? C.accent : C.muted} sub="monitoreos del día" />
                  <Stat label="ESTA SEMANA" value={semanaCount} sub="últimos 7 días" />
                  <Stat label="CON PLAGAS" value={conPlagas} color={conPlagas > 0 ? C.warn : C.accent} sub="sobre umbral" />
                  <Stat label="CON ENFERMEDADES" value={conEnf} color={conEnf > 0 ? C.danger : C.accent} sub="en el período" />
                  <Stat label="ALERTAS" value={alertas.length} color={alertas.length > 0 ? C.warn : C.accent} sub="generadas auto" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={st.card}>
                    <div style={{ fontSize: 12, color: C.textDim, letterSpacing: 1, marginBottom: 16, fontFamily: F, textTransform: "uppercase" }}>Monitoreos últimos 7 días</div>
                    <MiniBar data={chartData} color={C.accent} />
                  </div>
                  <div style={st.card}>
                    <div style={{ fontSize: 12, color: C.textDim, letterSpacing: 1, marginBottom: 14, fontFamily: F, textTransform: "uppercase" }}>Últimas alertas</div>
                    {alertas.length === 0 ? (
                      <div style={{ color: C.muted, fontSize: 13, textAlign: "center", padding: 18, background: C.accentLight, borderRadius: 8 }}>✓ Sin alertas activas</div>
                    ) : alertas.slice(0, 5).map(a => (
                      <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: `1px solid ${C.border}` }}>
                        <span style={{ color: a.tipo === "danger" ? C.danger : C.warn, fontSize: 16, flexShrink: 0, marginTop: 1 }}>{a.tipo === "danger" ? "✕" : "⚠"}</span>
                        <div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.lote}</div><div style={{ fontSize: 12, color: C.textDim, marginTop: 2 }}>{a.msg}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                {monitoreos.length > 0 ? (
                  <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                    <div style={{ padding: "13px 18px", fontSize: 12, color: C.textDim, letterSpacing: 1, borderBottom: `1px solid ${C.border}`, fontFamily: F, background: C.mutedBg }}>ÚLTIMOS MONITOREOS</div>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr>{["FECHA", "EMPRESA", "CAMPO", "LOTE", "CULTIVO", "PLAGAS", "ENF.", ""].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {monitoreos.slice(0, 8).map((m, i) => {
                          const pc = Object.keys(UMBRALES).filter(p => parseFloat(m[p]) >= UMBRALES[p]).length;
                          const ec = m.enfermedades?.length || 0;
                          return (
                            <tr key={m.id} onClick={() => setSelected(m)}>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12, color: C.textDim }}>{m.fecha}</span></td>
                              <td style={st.td}><span style={{ fontSize: 13, color: C.textDim }}>{m.empresa}</span></td>
                              <td style={st.td}><span style={{ fontSize: 13, color: C.textDim }}>{m.campo}</span></td>
                              <td style={st.td}><b style={{ color: C.text }}>{m.lote}</b></td>
                              <td style={st.td}><span style={{ color: C.textDim }}>{m.cultivo}</span></td>
                              <td style={st.td}>{pc > 0 ? <span style={{ background: C.warnLight, color: C.warn, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{pc} tipo{pc > 1 ? "s" : ""}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}>{ec > 0 ? <span style={{ background: C.dangerLight, color: C.danger, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{ec}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}><span style={{ color: C.accent, fontSize: 16 }}>›</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ ...st.card, textAlign: "center", padding: 56 }}>
                    <div style={{ fontSize: 40, marginBottom: 16 }}>🌱</div>
                    <div style={{ color: C.textDim, fontSize: 16, marginBottom: 8, fontWeight: 600 }}>Aún no hay monitoreos</div>
                    <div style={{ color: C.muted, fontSize: 13 }}>Los datos aparecerán cuando los monitoreadores envíen planillas</div>
                  </div>
                )}
              </div>
            )}

            {/* ── TABLERO ── */}
            {tab === "tablero" && <TableroCierres monitoreos={filtered} />}

            {/* ── GRAFICOS ── */}
            {tab === "graficos" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 18 }}><h2 style={st.sectionTitle}>📈 Evolución de Plagas</h2></div>
                <div style={st.card}><GraficoEvolucion monitoreos={filtered} /></div>
              </div>
            )}

            {/* ── ALERTAS ── */}
            {tab === "alertas" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 18 }}>
                  <h2 style={st.sectionTitle}>⚠ Alertas Automáticas</h2>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Umbrales: isocas ≥{UMBRALES.isocas}/m · chinches ≥{UMBRALES.chinches}/m · chicharrita ≥{UMBRALES.chicharrita}/pl · pulgones ≥{UMBRALES.pulgones}/pl</div>
                </div>
                {alertas.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 56, background: C.accentLight, border: `1px solid ${C.accent}20` }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                    <div style={{ color: C.accent, fontWeight: 600, marginBottom: 6, fontSize: 15 }}>Sin alertas activas</div>
                    <div style={{ color: C.textDim, fontSize: 13 }}>Todo dentro de los umbrales normales</div>
                  </div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                    {alertas.map(a => {
                      const col = a.tipo === "danger" ? C.danger : C.warn;
                      const bg = a.tipo === "danger" ? C.dangerLight : C.warnLight;
                      return (
                        <div key={a.id} onClick={() => { const m = monitoreos.find(x => x.id === a.monitoreoId); if (m) setSelected(m); }}
                          style={{ display: "flex", gap: 14, padding: "15px 20px", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: bg, border: `1px solid ${col}30`, display: "flex", alignItems: "center", justifyContent: "center", color: col, flexShrink: 0, fontWeight: 700, fontSize: 14 }}>{a.tipo === "danger" ? "✕" : "⚠"}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                              <span style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{a.lote}</span>
                              <span style={{ color: C.textDim, fontSize: 12 }}>{a.empresa}{a.campo ? ` · ${a.campo}` : ""}</span>
                              <Badge type={a.tipo} />
                            </div>
                            <div style={{ color: C.textDim, fontSize: 13 }}>{a.msg}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{a.fecha}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ── REGISTROS ── */}
            {tab === "registros" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={st.sectionTitle}>⊞ Todos los Registros</h2>
                    <span style={{ color: C.muted, fontSize: 12, fontFamily: F }}>{filtered.length} resultado{filtered.length !== 1 ? "s" : ""}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      onClick={() => generarInformePDF({
                        monitoreos: filtered,
                        aplicaciones,
                        alertas,
                        empresa: filtroEmpresa !== "todas" ? filtroEmpresa : null,
                        periodo: filtroPeriodo !== "todo"
                          ? filtroPeriodo === "hoy" ? "Hoy" : "Últimos 7 días"
                          : filtroEmpresa !== "todas" ? filtroEmpresa : "Completo"
                      })}
                      style={{
                        background: "#1e3a23", border: "none", borderRadius: 7,
                        padding: "7px 14px", color: "#fff", fontFamily: SANS, fontSize: 12,
                        cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6
                      }}>
                      📄 Informe PDF
                    </button>
                    <ExportButtons
                    onExcel={() => exportCSV(filtered, [
                      { label: "Fecha",      get: m => m.fecha },
                      { label: "Hora",       get: m => m.hora?.slice(0,5) || "" },
                      { label: "Empresa",    get: m => m.empresa },
                      { label: "Campo",      get: m => m.campo },
                      { label: "Lote",       get: m => m.lote },
                      { label: "Cultivo",    get: m => m.cultivo },
                      { label: "Estadio",    get: m => m.estadio_fenologico },
                      { label: "Plantas/m",  get: m => m.plantas_por_metro },
                      { label: "Canopeo %",  get: m => m.cobertura },
                      { label: "Isocas",     get: m => m.isocas },
                      { label: "Chinches",   get: m => m.chinches },
                      { label: "Pulgones",   get: m => m.pulgones },
                      { label: "Chicharrita",get: m => m.chicharrita },
                      { label: "Trips",      get: m => m.trips },
                      { label: "Arañuelas",  get: m => m.aranhuelas },
                      { label: "Cogollero",  get: m => m.cogollero },
                      { label: "Enfermedades",get: m => m.enfermedades?.join(", ") || "" },
                      { label: "Intensidad enf.", get: m => m.enfermedad_intensidad },
                      { label: "Estrés hídrico",  get: m => m.estres_hidrico },
                      { label: "Daño granizo",    get: m => m.dano_granizo ? "Sí" : "No" },
                      { label: "Malezas",         get: m => m.malezas?.join(", ") || "" },
                      { label: "GPS Lat",          get: m => m.gps_lat },
                      { label: "GPS Lng",          get: m => m.gps_lng },
                      { label: "Observaciones",    get: m => m.observaciones },
                      { label: "Recomendaciones",  get: m => m.recomendaciones },
                    ], `monitoreos_${new Date().toISOString().split("T")[0]}.csv`)}
                    onPDF={() => printTable("Registros de Monitoreo", `
                      <table>
                        <thead><tr><th>Fecha</th><th>Empresa</th><th>Campo</th><th>Lote</th><th>Cultivo</th><th>Estadio</th><th>Isocas</th><th>Chinches</th><th>Pulgones</th><th>Chicharrita</th><th>Trips</th><th>Enfermedades</th><th>Estrés</th><th>Observaciones</th></tr></thead>
                        <tbody>${filtered.map(m => {
                          const pc = Object.keys(UMBRALES).filter(p => parseFloat(m[p]) >= UMBRALES[p]).length;
                          return `<tr>
                            <td class="num">${m.fecha || ""}</td>
                            <td>${m.empresa || ""}</td><td>${m.campo || ""}</td>
                            <td><b>${m.lote || ""}</b></td><td>${m.cultivo || ""}</td>
                            <td>${m.estadio_fenologico || "—"}</td>
                            <td class="num">${m.isocas ?? "—"}</td><td class="num">${m.chinches ?? "—"}</td>
                            <td class="num">${m.pulgones ?? "—"}</td><td class="num">${m.chicharrita ?? "—"}</td>
                            <td class="num">${m.trips ?? "—"}</td>
                            <td>${m.enfermedades?.join(", ") || "—"}</td>
                            <td>${m.estres_hidrico ? `${m.estres_hidrico}/5` : "—"}</td>
                            <td>${m.observaciones || ""}</td>
                          </tr>`;
                        }).join("")}</tbody>
                      </table>
                    `)}
                  />
                  </div>
                </div>
                {filtered.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 40, color: C.muted }}>Sin registros con los filtros seleccionados</div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                      <thead><tr>{["FECHA", "EMPRESA", "CAMPO", "LOTE", "CULTIVO", "ESTADIO", "PLAGAS", "ENF.", "ESTRÉS", "GPS", "", ""].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {filtered.map((m) => {
                          const pc = Object.keys(UMBRALES).filter(p => parseFloat(m[p]) >= UMBRALES[p]).length;
                          const ec = m.enfermedades?.length || 0;
                          return (
                            <tr key={m.id} onClick={() => setSelected(m)}>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 11, color: C.textDim }}>{m.fecha}<br /><span style={{ color: C.muted }}>{m.hora?.slice(0, 5)}</span></span></td>
                              <td style={st.td}><span style={{ fontSize: 12, color: C.textDim }}>{m.empresa}</span></td>
                              <td style={st.td}><span style={{ fontSize: 12, color: C.textDim }}>{m.campo}</span></td>
                              <td style={st.td}><b style={{ color: C.text }}>{m.lote}</b></td>
                              <td style={st.td}><span style={{ color: C.textDim }}>{m.cultivo}</span></td>
                              <td style={st.td}><span style={{ fontSize: 12, background: C.mutedBg, padding: "3px 8px", borderRadius: 5, color: C.textDim }}>{m.estadio_fenologico || "—"}</span></td>
                              <td style={st.td}>{pc > 0 ? <span style={{ background: C.warnLight, color: C.warn, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{pc}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}>{ec > 0 ? <span style={{ background: C.dangerLight, color: C.danger, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{ec}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}><span style={{ color: m.estres_hidrico >= 4 ? C.danger : m.estres_hidrico >= 2 ? C.warn : C.muted, fontSize: 12 }}>{m.estres_hidrico ? `${m.estres_hidrico}/5` : "—"}</span></td>
                              <td style={st.td}>{m.gps_lat ? <span style={{ color: C.accent }}>📍</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}><span style={{ color: C.accent, fontSize: 16 }}>›</span></td>
                              <td style={st.td} onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={e => { e.stopPropagation(); if (window.confirm(`¿Eliminar el monitoreo de ${m.lote} del ${m.fecha}?`)) deleteMonitoreo(m.id); }}
                                  title="Eliminar monitoreo"
                                  style={{
                                    background: "none", border: `1px solid ${C.danger}30`, borderRadius: 6,
                                    color: C.danger, cursor: "pointer", padding: "4px 9px", fontSize: 13,
                                    lineHeight: 1
                                  }}>🗑</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── PRODUCTOS ── */}
            {tab === "productos" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={st.sectionTitle}>📦 Catálogo de Productos</h2>
                  <button onClick={() => setShowFormProd(!showFormProd)} style={st.btnPrimary}>+ Nuevo Producto</button>
                </div>
                {showFormProd && (
                  <div style={{ ...st.card, marginBottom: 20, border: `1px solid ${C.accent}30`, animation: "slideDown 0.2s ease" }}>
                    <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 16, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Nuevo Producto</div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                      {[["Nombre del producto", "nombre", "text", "Ej: Roundup, Karate..."], ["Tipo", "tipo", "text", "herbicida, insecticida..."], ["Unidad", "unidad", "text", "l, kg, cc"], ["Precio (USD/unidad)", "precio_usd", "number", "0.00"]].map(([label, key, type, ph]) => (
                        <div key={key}>
                          <label style={labelSt}>{label}</label>
                          <input type={type} placeholder={ph} value={newProd[key]} onChange={e => setNewProd(p => ({ ...p, [key]: e.target.value }))} style={inputSt} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={saveProducto} style={st.btnPrimary}>Guardar</button>
                      <button onClick={() => setShowFormProd(false)} style={st.btnSecondary}>Cancelar</button>
                    </div>
                  </div>
                )}
                {productos.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 48, color: C.muted }}>Sin productos cargados. Agregá el primero.</div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr>{["PRODUCTO", "TIPO", "UNIDAD", "PRECIO USD/UNIDAD"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {productos.map((p) => (
                          <tr key={p.id}>
                            <td style={st.td}><b style={{ color: C.text }}>{p.nombre}</b></td>
                            <td style={st.td}><span style={{ color: C.textDim }}>{p.tipo || "—"}</span></td>
                            <td style={st.td}><span style={{ color: C.textDim }}>{p.unidad}</span></td>
                            <td style={st.td}><span style={{ color: C.accent, fontFamily: F, fontWeight: 700 }}>{p.precio_usd ? `USD ${p.precio_usd}` : "—"}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── APLICACIONES ── */}
            {tab === "aplicaciones" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <h2 style={st.sectionTitle}>💊 Órdenes de Aplicación</h2>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <ExportButtons
                      onExcel={() => exportCSV(aplicaciones, [
                        { label: "Fecha",        get: a => a.fecha },
                        { label: "Empresa",      get: a => a.empresa_nombre },
                        { label: "Campo",        get: a => a.campo_nombre },
                        { label: "Lote",         get: a => a.lote_nombre },
                        { label: "Cultivo",      get: a => a.cultivo },
                        { label: "Tipo",         get: a => a.tipo_aplicacion },
                        { label: "Superficie ha",get: a => a.superficie_ha },
                        { label: "Cant. productos", get: a => a.productos?.length || 0 },
                        { label: "Productos",    get: a => a.productos?.map(p => `${p.producto_nombre} ${p.dosis}${p.unidad}`).join(" | ") || "" },
                        { label: "Costo total USD", get: a => a.costo_total_usd ? parseFloat(a.costo_total_usd).toFixed(2) : "" },
                        { label: "Observaciones", get: a => a.observaciones },
                      ], `aplicaciones_${new Date().toISOString().split("T")[0]}.csv`)}
                      onPDF={() => printTable("Órdenes de Aplicación", `
                        <table>
                          <thead><tr><th>Fecha</th><th>Empresa</th><th>Campo</th><th>Lote</th><th>Cultivo</th><th>Tipo</th><th>Superficie</th><th>Productos</th><th>Costo USD</th></tr></thead>
                          <tbody>${aplicaciones.map(a => `<tr>
                            <td class="num">${a.fecha || ""}</td>
                            <td>${a.empresa_nombre || ""}</td><td>${a.campo_nombre || ""}</td>
                            <td><b>${a.lote_nombre || ""}</b></td><td>${a.cultivo || ""}</td>
                            <td>${a.tipo_aplicacion || "—"}</td>
                            <td class="num">${a.superficie_ha ? `${a.superficie_ha} ha` : "—"}</td>
                            <td>${a.productos?.map(p => `${p.producto_nombre} (${p.dosis} ${p.unidad})`).join("<br/>") || "—"}</td>
                            <td class="num"><b>${a.costo_total_usd ? `USD ${parseFloat(a.costo_total_usd).toFixed(2)}` : "—"}</b></td>
                          </tr>`).join("")}</tbody>
                        </table>
                      `)}
                    />
                    <button onClick={() => setShowFormApp(!showFormApp)} style={st.btnPrimary}>+ Nueva Aplicación</button>
                  </div>
                </div>

                {showFormApp && (
                  <div style={{ ...st.card, marginBottom: 20, border: `1px solid ${C.accent}30`, animation: "slideDown 0.2s ease" }}>
                    <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 18, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Nueva Orden de Aplicación</div>

                    {/* IA Upload */}
                    <div style={{ marginBottom: 20, padding: "14px 16px", background: C.accentLight, borderRadius: 10, border: `1px dashed ${C.accent}50`, display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: C.text, fontWeight: 500, marginBottom: 3 }}>📷 Subí una foto de la orden</div>
                        <div style={{ fontSize: 12, color: C.textDim }}>La IA extrae los datos automáticamente</div>
                      </div>
                      <input ref={fileAppRef} type="file" accept="image/*,application/pdf" multiple onChange={e => e.target.files.length > 0 && procesarVariosArchivos(e.target.files)} style={{ display: "none" }} />
                      <button onClick={() => fileAppRef.current.click()} disabled={procesandoIA}
                        style={{ ...st.btnPrimary, opacity: procesandoIA ? 0.6 : 1, minWidth: 180 }}>
                        {procesandoIA ? "⏳ Procesando con IA..." : "📄 Subir PDF(s)"}
                      </button>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
                      {[["Empresa", "empresa_nombre"], ["Campo", "campo_nombre"], ["Lote", "lote_nombre"], ["Cultivo", "cultivo"], ["Fecha", "fecha"], ["Tipo aplicación", "tipo_aplicacion"], ["Superficie (ha)", "superficie_ha"], ["Observaciones", "observaciones"]].map(([label, key]) => (
                        <div key={key}>
                          <label style={labelSt}>{label}</label>
                          <input type={key === "fecha" ? "date" : key === "superficie_ha" ? "number" : "text"} value={newApp[key]}
                            onChange={e => setNewApp(p => ({ ...p, [key]: e.target.value }))} style={inputSt} />
                        </div>
                      ))}
                    </div>

                    {/* Productos */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 12, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Productos Aplicados</div>
                      {newApp.productos.map((p, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 10, marginBottom: 10, alignItems: "flex-end" }}>
                          <div>
                            <label style={labelSt}>Producto</label>
                            <input value={p.producto_nombre} onChange={e => { const ps = [...newApp.productos]; ps[i].producto_nombre = e.target.value; setNewApp(prev => ({ ...prev, productos: ps })); }} style={inputSt} />
                          </div>
                          <div>
                            <label style={labelSt}>Dosis</label>
                            <input type="number" value={p.dosis} onChange={e => { const ps = [...newApp.productos]; ps[i].dosis = e.target.value; ps[i].costo_total = ((parseFloat(e.target.value) || 0) * (parseFloat(newApp.superficie_ha) || 1) * (parseFloat(ps[i].precio_usd) || 0)).toFixed(2); setNewApp(prev => ({ ...prev, productos: ps })); }} style={inputSt} />
                          </div>
                          <div>
                            <label style={labelSt}>Precio USD/u</label>
                            <input type="number" value={p.precio_usd} onChange={e => { const ps = [...newApp.productos]; ps[i].precio_usd = e.target.value; ps[i].costo_total = ((parseFloat(ps[i].dosis) || 0) * (parseFloat(newApp.superficie_ha) || 1) * (parseFloat(e.target.value) || 0)).toFixed(2); setNewApp(prev => ({ ...prev, productos: ps })); }} style={inputSt} />
                          </div>
                          <div>
                            <label style={labelSt}>Costo total USD</label>
                            <div style={{ padding: "9px 12px", color: C.accent, fontFamily: F, fontSize: 13, background: C.accentLight, border: `1px solid ${C.accent}20`, borderRadius: 8, fontWeight: 700 }}>{p.costo_total || "—"}</div>
                          </div>
                          <button onClick={() => setNewApp(prev => ({ ...prev, productos: prev.productos.filter((_, idx) => idx !== i) }))}
                            style={{ background: C.dangerLight, border: `1px solid ${C.danger}20`, color: C.danger, cursor: "pointer", fontSize: 14, borderRadius: 8, padding: "9px 12px", marginBottom: 0 }}>✕</button>
                        </div>
                      ))}
                      <button onClick={() => setNewApp(prev => ({ ...prev, productos: [...prev.productos, { producto_nombre: "", dosis: "", unidad: "l", precio_usd: "", costo_total: "" }] }))}
                        style={{ background: "none", border: `1px dashed ${C.border}`, borderRadius: 8, padding: "8px 16px", color: C.textDim, fontFamily: SANS, fontSize: 13, cursor: "pointer" }}>+ Agregar producto</button>
                    </div>

                    <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      <button onClick={saveAplicacion} style={st.btnPrimary}>Guardar</button>
                      <button onClick={() => setShowFormApp(false)} style={st.btnSecondary}>Cancelar</button>
                      <span style={{ color: C.accent, fontFamily: F, fontSize: 14, marginLeft: "auto", fontWeight: 700 }}>
                        Costo total: USD {newApp.productos.reduce((s, p) => s + (parseFloat(p.costo_total) || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {aplicaciones.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 48, color: C.muted }}>Sin aplicaciones registradas.</div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr>{["FECHA", "EMPRESA", "CAMPO", "LOTE", "CULTIVO", "TIPO", "SUPERFICIE", "PRODUCTOS", "COSTO TOTAL", ""].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {aplicaciones.filter(a => (filtroEmpresa === "todas" || a.empresa_nombre === filtroEmpresa) && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote))).map((a) => (
                          <React.Fragment key={a.id}>
                            <tr
                              onClick={() => setExpandedApp(expandedApp === a.id ? null : a.id)}
                              style={{ cursor: "pointer" }}
                            >
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12, color: C.textDim }}>{a.fecha}</span></td>
                              <td style={st.td}><span style={{ color: C.textDim, fontSize: 12 }}>{a.empresa_nombre}</span></td>
                              <td style={st.td}><span style={{ color: C.textDim, fontSize: 12 }}>{a.campo_nombre}</span></td>
                              <td style={st.td}><b style={{ color: C.text }}>{a.lote_nombre}</b></td>
                              <td style={st.td}><span style={{ color: C.textDim }}>{a.cultivo}</span></td>
                              <td style={st.td}><span style={{ fontSize: 12, background: C.mutedBg, padding: "3px 8px", borderRadius: 5, color: C.textDim }}>{a.tipo_aplicacion || "—"}</span></td>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12, color: C.textDim }}>{a.superficie_ha ? `${a.superficie_ha} ha` : "—"}</span></td>
                              <td style={st.td}><span style={{ color: C.textDim, fontSize: 12 }}>{a.productos?.length || 0} prod.</span></td>
                              <td style={st.td}><span style={{ color: C.accent, fontFamily: F, fontWeight: 700, fontSize: 13 }}>{(() => { const costoHa = (a.productos||[]).reduce((s,p) => s + ((parseFloat(p.dosis)||0) * (parseFloat(p.precio_usd)||0) / 1000), 0); return costoHa > 0 ? `USD ${costoHa.toFixed(2)}/ha` : "—"; })()}</span></td>
                              <td style={st.td}>
                                <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>
                                  {expandedApp === a.id ? "▲" : "▼"}
                                </span>
                              </td>
                            </tr>
                            {expandedApp === a.id && (
                              <tr>
                                <td colSpan={10} style={{ padding: 0, background: C.accentLight, borderBottom: `2px solid ${C.accent}30` }}>
                                  <div style={{ padding: "16px 20px" }}>
                                    {a.productos?.length > 0 && (
                                      <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontSize: 11, color: C.accent, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>🧪 Productos aplicados</div>
                                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                                          {(a.productos || []).map((p, i) => {
                                            const costoHa = p.dosis && p.precio_usd ? ((parseFloat(p.dosis) * parseFloat(p.precio_usd)) / 1000).toFixed(2) : null;
                                            return (
                                              <div key={i} style={{ background: C.surface, border: "1px solid " + C.border, borderRadius: 10, padding: "10px 14px" }}>
                                                <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{p.producto_nombre}</div>
                                                <div style={{ fontFamily: F, fontSize: 12, color: C.textDim }}>
                                                  {p.dosis} {p.unidad}
                                                  {p.precio_usd ? " · USD " + p.precio_usd + "/L" : ""}
                                                  {costoHa ? " = USD " + costoHa + "/ha" : ""}
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                    <div style={{ fontSize: 11, color: C.accent, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>🔍 Seguimiento Post-Aplicación — {a.lote_nombre}</div>
                                    <SeguimientoAplicacion aplicacion={a} monitoreos={monitoreos} />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── MARGEN BRUTO ── */}
            {tab === "margen" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <h2 style={st.sectionTitle}>💰 Margen Bruto por Lote</h2>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <ExportButtons
                      onExcel={() => exportCSV(margenes, [
                        { label: "Campaña",        get: m => m.campana },
                        { label: "Empresa",        get: m => m.empresa_nombre },
                        { label: "Campo",          get: m => m.campo_nombre },
                        { label: "Lote",           get: m => m.lote_nombre },
                        { label: "Cultivo",        get: m => m.cultivo },
                        { label: "Hectáreas",      get: m => m.hectareas },
                        { label: "Rendimiento qq/ha", get: m => m.rendimiento_qq },
                        { label: "Precio grano USD/qq", get: m => m.precio_grano_usd },
                        { label: "Ingreso bruto USD",  get: m => parseFloat(m.ingreso_bruto_usd || 0).toFixed(2) },
                        { label: "Semilla USD",        get: m => m.costo_semilla_usd },
                        { label: "Labores USD",        get: m => m.costo_labores_usd },
                        { label: "Agroquímicos USD",   get: m => m.costo_agroquimicos_usd },
                        { label: "Arrendamiento USD",  get: m => m.costo_arrendamiento_usd },
                        { label: "Flete USD",          get: m => m.costo_flete_usd },
                        { label: "Otros USD",          get: m => m.costo_otros_usd },
                        { label: "Margen bruto USD",   get: m => parseFloat(m.margen_bruto_usd || 0).toFixed(2) },
                        { label: "MB/ha USD",          get: m => m.hectareas > 0 ? (parseFloat(m.margen_bruto_usd || 0) / parseFloat(m.hectareas)).toFixed(2) : "" },
                        { label: "MB %",               get: m => m.margen_bruto_pct ? parseFloat(m.margen_bruto_pct).toFixed(1) : "" },
                      ], `margen_bruto_${new Date().toISOString().split("T")[0]}.csv`)}
                      onPDF={() => printTable("Margen Bruto por Lote", `
                        <table>
                          <thead><tr><th>Campaña</th><th>Empresa</th><th>Lote</th><th>Cultivo</th><th>Ha</th><th>qq/ha</th><th>Ingreso Bruto</th><th>Costos Totales</th><th>Margen Bruto</th><th>MB/ha</th><th>MB%</th></tr></thead>
                          <tbody>${margenes.map(m => {
                            const costos = ['costo_semilla_usd','costo_labores_usd','costo_agroquimicos_usd','costo_arrendamiento_usd','costo_flete_usd','costo_otros_usd'].reduce((s,k) => s+(parseFloat(m[k])||0),0);
                            const pos = (m.margen_bruto_usd||0) >= 0;
                            return `<tr>
                              <td>${m.campana||"—"}</td><td>${m.empresa_nombre||""}</td>
                              <td><b>${m.lote_nombre||""}</b></td><td>${m.cultivo||""}</td>
                              <td class="num">${m.hectareas||""}</td><td class="num">${m.rendimiento_qq||""}</td>
                              <td class="num">USD ${parseFloat(m.ingreso_bruto_usd||0).toFixed(0)}</td>
                              <td class="num">USD ${costos.toFixed(0)}</td>
                              <td class="num"><span class="${pos?"badge-ok":"badge-danger"}">USD ${parseFloat(m.margen_bruto_usd||0).toFixed(0)}</span></td>
                              <td class="num">USD ${m.hectareas > 0 ? (parseFloat(m.margen_bruto_usd||0)/parseFloat(m.hectareas)).toFixed(0) : "—"}</td>
                              <td class="num">${m.margen_bruto_pct ? `${parseFloat(m.margen_bruto_pct).toFixed(1)}%` : "—"}</td>
                            </tr>`;
                          }).join("")}</tbody>
                        </table>
                      `)}
                    />
                    <button onClick={() => setShowFormMargen(!showFormMargen)} style={st.btnPrimary}>+ Nuevo Cálculo</button>
                  </div>
                </div>

                {showFormMargen && (() => {
                  const ha = parseFloat(newMargen.hectareas) || 0;
                  const qq = parseFloat(newMargen.rendimiento_qq) || 0;
                  const pgrano = parseFloat(newMargen.precio_grano_usd) || 0;
                  const ing = qq * pgrano * ha / 100;
                  const costoAgro = aplicaciones.filter(a => a.lote_nombre === newMargen.lote_nombre).reduce((s, a) => s + (parseFloat(a.costo_total_usd) || 0), 0);
                  const costos = ['costo_semilla_usd', 'costo_labores_usd', 'costo_agroquimicos_usd', 'costo_arrendamiento_usd', 'costo_flete_usd', 'costo_otros_usd'].reduce((s, k) => s + (parseFloat(newMargen[k]) || 0), 0);
                  const mb = ing - costos;
                  const mbHa = ha > 0 ? mb / ha : 0;
                  return (
                    <div style={{ ...st.card, marginBottom: 20, border: `1px solid ${C.accent}30`, animation: "slideDown 0.2s ease" }}>
                      <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 18, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Nuevo Cálculo de Margen Bruto</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
                        {[["Empresa", "empresa_nombre"], ["Campo", "campo_nombre"], ["Lote", "lote_nombre"], ["Cultivo", "cultivo"], ["Campaña", "campana"], ["Hectáreas", "hectareas"], ["Rendimiento (qq/ha)", "rendimiento_qq"], ["Precio grano (USD/qq)", "precio_grano_usd"]].map(([label, key]) => (
                          <div key={key}>
                            <label style={labelSt}>{label}</label>
                            <input type={["hectareas", "rendimiento_qq", "precio_grano_usd"].includes(key) ? "number" : "text"} value={newMargen[key]}
                              onChange={e => setNewMargen(p => ({ ...p, [key]: e.target.value }))} style={inputSt} />
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 12, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Costos (USD)</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
                        {[["Semilla", "costo_semilla_usd"], ["Labores (siembra/cosecha)", "costo_labores_usd"], ["Agroquímicos", "costo_agroquimicos_usd"], ["Arrendamiento", "costo_arrendamiento_usd"], ["Flete y comercialización", "costo_flete_usd"], ["Otros", "costo_otros_usd"]].map(([label, key]) => (
                          <div key={key}>
                            <label style={labelSt}>
                              {label} {key === "costo_agroquimicos_usd" && costoAgro > 0 && <span style={{ color: C.accent, fontSize: 10 }}>(aplicaciones: USD {costoAgro.toFixed(0)})</span>}
                            </label>
                            <input type="number" value={newMargen[key]} onChange={e => setNewMargen(p => ({ ...p, [key]: e.target.value }))} style={inputSt} />
                          </div>
                        ))}
                      </div>
                      {/* Preview */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 18, padding: 16, background: C.mutedBg, borderRadius: 10 }}>
                        <div><div style={{ fontSize: 10, color: C.muted, marginBottom: 6, fontFamily: F, textTransform: "uppercase" }}>Ingreso bruto</div><div style={{ fontSize: 22, color: C.accent, fontFamily: F, fontWeight: 700 }}>USD {ing.toFixed(0)}</div></div>
                        <div><div style={{ fontSize: 10, color: C.muted, marginBottom: 6, fontFamily: F, textTransform: "uppercase" }}>Costos totales</div><div style={{ fontSize: 22, color: C.warn, fontFamily: F, fontWeight: 700 }}>USD {costos.toFixed(0)}</div></div>
                        <div><div style={{ fontSize: 10, color: C.muted, marginBottom: 6, fontFamily: F, textTransform: "uppercase" }}>Margen bruto</div><div style={{ fontSize: 22, color: mb >= 0 ? C.accent : C.danger, fontFamily: F, fontWeight: 700 }}>USD {mb.toFixed(0)}</div></div>
                        <div><div style={{ fontSize: 10, color: C.muted, marginBottom: 6, fontFamily: F, textTransform: "uppercase" }}>MB/HA</div><div style={{ fontSize: 22, color: mb >= 0 ? C.accent : C.danger, fontFamily: F, fontWeight: 700 }}>USD {mbHa.toFixed(0)}</div></div>
                      </div>
                      <div style={{ display: "flex", gap: 10 }}>
                        <button onClick={saveMargen} style={st.btnPrimary}>Guardar</button>
                        <button onClick={() => setShowFormMargen(false)} style={st.btnSecondary}>Cancelar</button>
                      </div>
                    </div>
                  );
                })()}

                {margenes.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 48, color: C.muted }}>Sin cálculos de margen bruto. Agregá el primero.</div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflow: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                      <thead><tr>{["CAMPAÑA", "EMPRESA", "LOTE", "CULTIVO", "HA", "REND qq/ha", "INGRESO BRUTO", "COSTOS", "MARGEN BRUTO", "MB/HA", "MB%"].map(h => <th key={h} style={st.th}>{h}</th>)}</tr></thead>
                      <tbody>
                        {margenes.map((m) => {
                          const positivo = (m.margen_bruto_usd || 0) >= 0;
                          return (
                            <tr key={m.id}>
                              <td style={st.td}><span style={{ fontSize: 12, color: C.textDim }}>{m.campana || "—"}</span></td>
                              <td style={st.td}><span style={{ fontSize: 12, color: C.textDim }}>{m.empresa_nombre}</span></td>
                              <td style={st.td}><b style={{ color: C.text }}>{m.lote_nombre}</b></td>
                              <td style={st.td}><span style={{ color: C.textDim }}>{m.cultivo}</span></td>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12 }}>{m.hectareas}</span></td>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12 }}>{m.rendimiento_qq}</span></td>
                              <td style={st.td}><span style={{ color: C.accent, fontFamily: F, fontWeight: 700 }}>USD {parseFloat(m.ingreso_bruto_usd || 0).toFixed(0)}</span></td>
                              <td style={st.td}><span style={{ color: C.warn, fontFamily: F }}>USD {(['costo_semilla_usd', 'costo_labores_usd', 'costo_agroquimicos_usd', 'costo_arrendamiento_usd', 'costo_flete_usd', 'costo_otros_usd'].reduce((s, k) => s + (parseFloat(m[k]) || 0), 0)).toFixed(0)}</span></td>
                              <td style={st.td}><span style={{ color: positivo ? C.accent : C.danger, fontFamily: F, fontWeight: 700 }}>USD {parseFloat(m.margen_bruto_usd || 0).toFixed(0)}</span></td>
                              <td style={st.td}><span style={{ color: positivo ? C.accent : C.danger, fontFamily: F }}>USD {parseFloat(m.margen_bruto_usd || 0) / parseFloat(m.hectareas || 1) > 0 ? (parseFloat(m.margen_bruto_usd || 0) / parseFloat(m.hectareas || 1)).toFixed(0) : "—"}</span></td>
                              <td style={st.td}><span style={{ color: positivo ? C.accent : C.danger, fontFamily: F }}>{m.margen_bruto_pct ? `${parseFloat(m.margen_bruto_pct).toFixed(1)}%` : "—"}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {/* ── COMPARATIVA ── */}
            {tab === "comparativa" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <ComparativaCampanias monitoreos={filtered} aplicaciones={aplicaciones} />
              </div>
            )}

            {/* ── UMBRALES ── */}
            {tab === "umbrales" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={st.sectionTitle}>⚙ Configuración de Umbrales</h2>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>Definí los umbrales de daño económico por plaga. Se usan en alertas, tablero y recomendaciones IA.</div>
                  </div>
                  {umbralesSaved && (
                    <div style={{ background: C.accentLight, border: `1px solid ${C.accent}40`, borderRadius: 8, padding: "8px 16px", color: C.accent, fontWeight: 700, fontSize: 13 }}>✓ Guardado</div>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))", gap: 16 }}>
                  {[
                    ["isocas", "Isocas", "larvas/m lineal", "Número de larvas por metro lineal que justifica una aplicación"],
                    ["chinches", "Chinches", "ninfas/m lineal", "Ninfas grandes + adultos por metro de surco"],
                    ["pulgones", "Pulgones", "% plantas afectadas", "Porcentaje de plantas con colonias de pulgones"],
                    ["chicharrita", "Chicharrita (Dalbulus)", "insectos/planta", "Insectos adultos por planta"],
                    ["trips", "Trips", "% plantas afectadas", "Porcentaje de plantas con daño visible"],
                    ["aranhuelas", "Arañuelas", "% hoja afectada", "Porcentaje de superficie foliar con presencia"],
                    ["cogollero", "Cogollero", "% plantas con daño", "Porcentaje de plantas con daño en el cogollo"],
                  ].map(([key, label, unidad, desc]) => {
                    const valorActual = umbralesConfig[key] ?? UMBRALES[key];
                    const valorDefault = UMBRALES[key];
                    const cambiado = valorActual !== valorDefault;
                    return (
                      <div key={key} style={{
                        background: C.surface, border: `1px solid ${cambiado ? C.accent + "50" : C.border}`,
                        borderRadius: 10, padding: "18px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                        borderTop: `3px solid ${cambiado ? C.accent : C.border}`
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{label}</div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{unidad}</div>
                          </div>
                          {cambiado && (
                            <span style={{ fontSize: 10, background: C.accentLight, color: C.accent, padding: "2px 8px", borderRadius: 4, fontWeight: 600 }}>MODIFICADO</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: C.textDim, marginBottom: 14, lineHeight: 1.5 }}>{desc}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ fontSize: 10, color: C.muted, fontFamily: "monospace", letterSpacing: 0.5, display: "block", marginBottom: 5 }}>UMBRAL ACTUAL</label>
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              defaultValue={valorActual}
                              key={valorActual}
                              onBlur={e => {
                                const v = parseFloat(e.target.value);
                                if (!isNaN(v) && v > 0 && v !== valorActual) saveUmbral(key, v);
                              }}
                              style={{
                                width: "100%", background: C.bg, border: `1px solid ${C.border}`,
                                borderRadius: 8, padding: "10px 14px", color: C.text,
                                fontFamily: "monospace", fontSize: 16, fontWeight: 700,
                                outline: "none", boxSizing: "border-box"
                              }}
                            />
                          </div>
                          <div style={{ textAlign: "center", flexShrink: 0 }}>
                            <div style={{ fontSize: 10, color: C.muted, marginBottom: 5 }}>DEFAULT</div>
                            <div style={{ fontSize: 16, fontWeight: 700, color: C.muted, fontFamily: "monospace" }}>{valorDefault}</div>
                          </div>
                        </div>
                        {cambiado && (
                          <button
                            onClick={() => saveUmbral(key, valorDefault)}
                            style={{ marginTop: 10, background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "5px 12px", color: C.muted, fontSize: 11, cursor: "pointer", fontFamily: "sans-serif" }}
                          >↩ Restaurar default ({valorDefault})</button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ ...st.card, marginTop: 20, background: C.mutedBg, border: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 12, color: C.textDim, fontWeight: 600, marginBottom: 8 }}>💡 Cómo usar los umbrales</div>
                  <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.7 }}>
                    Los valores se guardan en Supabase y se aplican globalmente a todas las alertas automáticas, el tablero de cierres y las recomendaciones de IA.
                    Editá el valor y hacé clic fuera del campo para guardar. El cambio se refleja de inmediato en toda la app.
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 8 }}>
                    ⚠ Nota: para que los umbrales persistan en Supabase, asegurate de tener la tabla <code style={{ background: C.surface, padding: "1px 5px", borderRadius: 3 }}>umbrales</code> con columnas <code style={{ background: C.surface, padding: "1px 5px", borderRadius: 3 }}>plaga (text, unique)</code> y <code style={{ background: C.surface, padding: "1px 5px", borderRadius: 3 }}>umbral (numeric)</code>.
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}