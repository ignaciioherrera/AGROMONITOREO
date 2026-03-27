import React, { useState, useRef, useEffect } from "react";

const SUPABASE_URL = "https://izijmjntrpksmzuwvtle.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aWptam50cnBrc216dXd2dGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MTQyNjAsImV4cCI6MjA4OTE5MDI2MH0.hsG0v5xmM81lCMU1VvwHETFp8C9Al4OPxoSyuyfY_ks";

const supabaseInsert = async (payload) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/monitoreos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(await res.text());
};

// ── ESTACION DE MUESTREO ─────────────────────────────────────
// Clave: empresa + campo + fecha → contador correlativo por jornada
const getEstacionKey = (empresa, campo, fecha) =>
  `agro_estacion_${empresa}_${campo}_${fecha}`.replace(/\s+/g, "_");

const getEstacionActual = (empresa, campo, fecha) => {
  try { return parseInt(localStorage.getItem(getEstacionKey(empresa, campo, fecha)) || "0"); }
  catch { return 0; }
};

const incrementarEstacion = (empresa, campo, fecha) => {
  const key = getEstacionKey(empresa, campo, fecha);
  const actual = getEstacionActual(empresa, campo, fecha);
  const siguiente = actual + 1;
  localStorage.setItem(key, String(siguiente));
  return siguiente;
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
  try { return JSON.parse(localStorage.getItem("agro_monitor_session") || "null"); } catch { return null; }
};
const storeSession = (s) => localStorage.setItem("agro_monitor_session", JSON.stringify(s));
const clearSession = () => localStorage.removeItem("agro_monitor_session");

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
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
    <div style={{ minHeight: "100vh", background: "#f5f7f4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ width: "100%", maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: "#2d7a47", fontWeight: 700, letterSpacing: 2 }}>◈ MONITOREO</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#94b09a", letterSpacing: 3 }}>PLANILLA DE CAMPO</div>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #dde8df", padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1a2e1e", marginBottom: 4 }}>Hola, monitoreador 👋</div>
          <div style={{ fontSize: 13, color: "#94b09a", marginBottom: 24 }}>Ingresá para acceder a tu planilla</div>

          {error && (
            <div style={{ background: "#fee2e2", border: "1px solid #dc262630", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, color: "#5a7a60", fontFamily: "'DM Mono', monospace", marginBottom: 6, fontWeight: 600 }}>EMAIL</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="tu@email.com" autoFocus
              style={{ width: "100%", background: "#f8faf8", border: "1.5px solid #dde8df", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#1a2e1e", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
          </div>
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11, color: "#5a7a60", fontFamily: "'DM Mono', monospace", marginBottom: 6, fontWeight: 600 }}>CONTRASEÑA</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="••••••••"
              style={{ width: "100%", background: "#f8faf8", border: "1.5px solid #dde8df", borderRadius: 10, padding: "12px 14px", fontSize: 14, color: "#1a2e1e", outline: "none", fontFamily: "'DM Sans', sans-serif" }} />
          </div>
          <button onClick={handleLogin} disabled={loading || !email || !password}
            style={{ width: "100%", background: loading || !email || !password ? "#b8cebc" : "#2d7a47", border: "none", borderRadius: 14, padding: "15px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
            {loading ? "INGRESANDO..." : "INGRESAR"}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "#94b09a", fontFamily: "'DM Mono', monospace" }}>
          AGRO·MONITOR · v1.2
        </div>
      </div>
    </div>
  );
}

// ── OFFLINE QUEUE ─────────────────────────────
const QUEUE_KEY = "agro_monitor_queue";

const getQueue = () => {
  try { return JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); }
  catch { return []; }
};

const saveQueue = (q) => localStorage.setItem(QUEUE_KEY, JSON.stringify(q));

const addToQueue = (payload) => {
  const q = getQueue();
  q.push({ ...payload, _queued_at: new Date().toISOString(), _id: Date.now() });
  saveQueue(q);
};

const syncQueue = async () => {
  const q = getQueue();
  if (q.length === 0) return 0;
  const pending = [...q];
  const sent = [];
  for (const item of pending) {
    try {
      const { _queued_at, _id, ...payload } = item;
      await supabaseInsert(payload);
      sent.push(_id);
    } catch { break; }
  }
  if (sent.length > 0) {
    saveQueue(q.filter(i => !sent.includes(i._id)));
  }
  return sent.length;
};

const C = {
  bg: "#f5f7f4",
  surface: "#ffffff",
  card: "#ffffff",
  border: "#dde8df",
  borderStrong: "#b8cebc",
  accent: "#2d7a47",
  accentLight: "#e8f5ed",
  accentDark: "#1a5c32",
  warn: "#d97706",
  warnLight: "#fef3c7",
  danger: "#dc2626",
  dangerLight: "#fee2e2",
  text: "#1a2e1e",
  textDim: "#5a7a60",
  textFaint: "#94b09a",
  inputBg: "#f8faf8",
  sectionBg: "#eef4ef",
};

const FONT = `'DM Mono', 'Courier New', monospace`;
const SANS = `'DM Sans', 'Segoe UI', sans-serif`;

const EMPRESAS = [
  { empresa: "IGNACIO HERRERA", campos: [
    { campo: "LASTRA", lotes: ["LASTRA 1","LASTRA 2","ZULEMA LASTRA"] },
  ]},
  { empresa: "AGROCORSI", campos: [
    { campo: "AGROCORSI", lotes: ["ANTONELLA","MARTINEZ"] },
    { campo: "EL PAMPA", lotes: ["EL PAMPA LOTE V1A","EL PAMPA LOTE V1B","EL PAMPA LOTE V2","EL PAMPA LOTE V3","EL PAMPA LOTE V4","EL PAMPA LOTE V5","EL PAMPA LOTE V6","EL PAMPA LOTE V7","EL PAMPA LOTE V8","EL PAMPA LOTE V9","EL PAMPA LOTE V10A","EL PAMPA LOTE V10B","EL PAMPA LOTE V11"] },
    { campo: "SAN PEDRO", lotes: ["SAN PEDRO LOTE 1","SAN PEDRO LOTE 2","SAN PEDRO LOTE 3","SAN PEDRO LOTE 4","SAN PEDRO LOTE 5","SAN PEDRO LOTE 6","SAN PEDRO LOTE 7","SAN PEDRO LOTE 8","SAN PEDRO LOTE 9","SAN PEDRO LOTE 10","SAN PEDRO LOTE 11A","SAN PEDRO LOTE 11B","SAN PEDRO LOTE 11C","SAN PEDRO LOTE 12"] },
    { campo: "LAS MARIAS", lotes: ["LAS MARIAS"] },
  ]},
  { empresa: "GREGORET HNOS", campos: [
    { campo: "BANDERA", lotes: ["SAN PABLO","LA PAMPITA","FIORI","FIORI 1","FIORI RICARDO","ANAYA","ROMAN","LA PERSEVERANCIA","EL SUIZO","LA CUÑA","ESTANCIA GREGORET","NORMA QUIROZ"] },
  ]},
  { empresa: "PIGHIN", campos: [
    { campo: "LA LUNA", lotes: ["FERNANDO 1","FERNANDO 2","FERNANDO 3","FERNANDO 4","FERNANDO 5","FERNANDO 6","FERNANDO 7","FERNANDO 8"] },
    { campo: "EL PROGRESO", lotes: ["EL PROGRESO LOTE 1","EL PROGRESO LOTE 2A","EL PROGRESO LOTE 2B","EL PROGRESO LOTE 3","EL PROGRESO 4A","EL PROGRESO LOTE 4B","EL PROGRESO LOTE 5"] },
  ]},
  { empresa: "BERTOLI VARRONE", campos: [
    { campo: "TIERRAS DEL OESTE", lotes: ["TIERRAS DEL OESTE 1","TIERRAS DEL OESTE 3-5","TIERRAS DEL OESTE 4-6","TIERRAS DEL OESTE 7","TIERRAS DEL OESTE 8-11-12","TIERRAS DEL OESTE 9","TIERRAS DEL OESTE 10","TIERRAS DEL OESTE 13","TIERRAS DEL OESTE 14","TIERRAS DEL OESTE 15","EL QUEBRACHO"] },
    { campo: "LA GRATITUD", lotes: ["LA GRATITUD"] },
    { campo: "LA PIAMONTESA", lotes: ["PIAMONTESA LP1","LA PIAMONTESA LP2"] },
    { campo: "LA JUANITA", lotes: ["LA JUANITA LJ1","LA JUANITA LJ2","LA JUANITA LJ3"] },
    { campo: "CARDOZO", lotes: ["BERTOLI CARDOZO"] },
    { campo: "FIORI", lotes: ["BERTOLI FIORI"] },
    { campo: "EL SIN QUERER", lotes: ["EL SIN QUERER"] },
    { campo: "URUNDAY", lotes: ["URUNDAY 1","URUNDAY 2","URUNDAY 3","URUNDAY 4","URUNDAY 5","URUNDAY 6","URUNDAY 7"] },
    { campo: "SANTA MARIA", lotes: ["SANTA MARIA 1","SANTA MARIA 2","SANTA MARIA 3","SANTA MARIA 4","SANTA MARIA 5"] },
    { campo: "PERALTA", lotes: ["PERALTA"] },
    { campo: "GOROSITO", lotes: ["GOROSITO"] },
    { campo: "LOS CORDOBESES", lotes: ["LOS CORDOBESES 1","LOS CORDOBESES 2","LOS CORDOBESES 3","LOS CORDOBESES 4","LOS CORDOBESES 5","LOS CORDOBESES 13","LOS CORDOBESES 15"] },
    { campo: "JUVENCIO", lotes: ["JUVENCIO"] },
    { campo: "LEGUIZAMON", lotes: ["LEGUIZAMON"] },
    { campo: "ETHEL VARGAS", lotes: ["ETEL VARGAS 1","ETEL VARGAS 2","ETHEL VARGAS 3"] },
    { campo: "ABRAHAM", lotes: ["ABRAHAM"] },
    { campo: "GAUTO", lotes: ["GAUTO"] },
    { campo: "DOMINGO LOPEZ", lotes: ["DOMINGO LOPEZ"] },
    { campo: "KAKUY", lotes: ["KAKUY"] },
    { campo: "PANAMBI", lotes: ["PANAMBI PA1","PANAMBI PA2"] },
    { campo: "LOS QUIMILES", lotes: ["CORDERO A","QUIMIL"] },
  ]},
  { empresa: "GOROSITO/SIGOTO/BERTOLI", campos: [
    { campo: "EL OCASO", lotes: ["OCASO LOTE 1 ESTE","OCASO LOTE 2 OESTE"] },
  ]},
  { empresa: "GIANFRANCO BERTOLI", campos: [
    { campo: "TIERRAS DEL OESTE PUPI", lotes: ["LINARES GIANFRANCO BERTOLI"] },
  ]},
  { empresa: "VACHETTA", campos: [
    { campo: "DON ALBINO", lotes: ["VACHETTA LOTE 1","VACHETTA LOTE 2"] },
  ]},
];
const CAMPOS = EMPRESAS.flatMap(e => e.campos.map(c => ({ ...c, empresa: e.empresa })));
const LOTES = CAMPOS.flatMap(c => c.lotes);

const CULTIVOS = ["Maíz", "Soja", "Trigo", "Girasol", "Sorgo", "Otro"];
const ENFERMEDADES = ["Roya", "Mancha marrón", "Tizón", "Podredumbre", "Fusarium", "Esclerotinia", "Carbón", "Otra"];
const MALEZAS = ["Sorgo de alepo", "Gramón", "Ciperácea", "Verdolaga", "Yuyo colorado", "Rama negra", "Capín", "Otra"];

// Plantillas por cultivo — estadios y plagas relevantes
const PLANTILLAS_CULTIVO = {
  "Maíz": {
    estadios: ["V1","V2","V3","V4","V5","V6","V7","V8","V9","V10","V12","VT","R1","R2","R3","R4","R5","R6"],
    plagasRelevantes: ["cogollero","chicharrita","chinches","aranhuelas"],
    enfermedadesRelevantes: ["Roya","Tizón","Carbón","Fusarium","Otra"],
  },
  "Soja": {
    estadios: ["V1","V2","V3","V4","V5","V6","R1","R2","R3","R4","R5","R6","R7","R8"],
    plagasRelevantes: ["isocas","chinches","pulgones","trips","aranhuelas","caracol"],
    enfermedadesRelevantes: ["Roya","Septoria","Cercospora Kukichi","Muerte súbita","Otra"],
  },
  "Trigo": {
    estadios: ["Macollaje","Encañazón","Espigazón","Antesis","Grano lechoso","Grano pastoso","Madurez"],
    plagasRelevantes: ["pulgones","trips","aranhuelas"],
    enfermedadesRelevantes: ["Roya","Tizón","Fusarium","Otra"],
  },
  "Girasol": {
    estadios: ["V2","V4","V6","V8","R1","R3","R5","R7","R9"],
    plagasRelevantes: ["isocas","chinches","aranhuelas"],
    enfermedadesRelevantes: ["Roya","Otra"],
  },
  "Sorgo": {
    estadios: ["V3","V6","V9","Panojamiento","Floración","Grano lechoso","Madurez"],
    plagasRelevantes: ["cogollero","pulgones"],
    enfermedadesRelevantes: [],
  },
};

// Plantillas editables guardadas en localStorage por usuario
const getPlantillasGuardadas = () => {
  try { return JSON.parse(localStorage.getItem("agro_plantillas") || "{}"); }
  catch { return {}; }
};
const savePlantillas = (p) => localStorage.setItem("agro_plantillas", JSON.stringify(p));

const getPlantilla = (cultivo) => {
  const guardadas = getPlantillasGuardadas();
  return guardadas[cultivo] || PLANTILLAS_CULTIVO[cultivo] || null;
};

const inputBase = {
  width: "100%", background: C.inputBg, border: `1.5px solid ${C.border}`,
  borderRadius: 10, padding: "11px 12px", fontFamily: SANS, fontSize: 14,
  color: C.text, outline: "none", boxSizing: "border-box",
};

const SECTION = ({ title, icon, children, accent }) => (
  <div style={{ background: C.card, border: `1.5px solid ${accent ? C.accent + "40" : C.border}`, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
    <div style={{ background: accent ? C.accentLight : C.sectionBg, padding: "12px 16px", borderBottom: `1px solid ${accent ? C.accent + "30" : C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: accent ? C.accentDark : C.textDim, letterSpacing: 2 }}>{title}</span>
    </div>
    <div style={{ padding: "14px 16px" }}>{children}</div>
  </div>
);

const Label = ({ children }) => (
  <div style={{ fontFamily: SANS, fontSize: 12, color: C.textDim, fontWeight: 600, marginBottom: 5, marginTop: 2, letterSpacing: 0.3 }}>{children}</div>
);

const CustomSelect = ({ label, value, onChange, options, disabled, placeholder }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 12 }}>
      <Label>{label}</Label>
      <div
        onClick={() => !disabled && setOpen(!open)}
        style={{
          ...inputBase, display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          border: `1.5px solid ${value ? C.accent : C.border}`,
          color: value ? C.text : C.textFaint,
        }}
      >
        <span>{value || placeholder}</span>
        <span style={{ fontSize: 12, color: C.textFaint }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{
          background: C.surface, border: `1.5px solid ${C.accent}`,
          borderRadius: 10, marginTop: 4, maxHeight: 220, overflowY: "auto",
          zIndex: 999, position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: "13px 16px", fontFamily: SANS, fontSize: 14,
                color: opt === value ? C.accent : C.text,
                background: opt === value ? C.accentLight : "transparent",
                borderBottom: `1px solid ${C.border}40`,
                fontWeight: opt === value ? 700 : 400,
              }}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const NumInput = ({ label, unit, value, onChange, placeholder = "0" }) => (
  <div style={{ flex: 1 }}>
    <Label>{label}</Label>
    <div style={{ position: "relative" }}>
      <input type="number" inputMode="decimal" placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "11px 12px", fontFamily: FONT, fontSize: 15, color: C.text, outline: "none", boxSizing: "border-box", paddingRight: unit ? 44 : 12 }} />
      {unit && <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: C.textFaint, fontFamily: FONT }}>{unit}</span>}
    </div>
  </div>
);

const TextArea = ({ label, value, onChange, placeholder }) => (
  <div>
    <Label>{label}</Label>
    <textarea rows={3} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "11px 12px", fontFamily: SANS, fontSize: 14, color: C.text, outline: "none", boxSizing: "border-box", resize: "none", lineHeight: 1.5 }} />
  </div>
);

const Toggle = ({ label, value, onChange, noBorder }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: noBorder ? "none" : `1px solid ${C.border}` }}>
    <span style={{ fontFamily: SANS, fontSize: 14, color: C.text }}>{label}</span>
    <div onClick={() => onChange(!value)} style={{ width: 48, height: 26, borderRadius: 13, background: value ? C.accent : C.border, position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: value ? 25 : 3, width: 20, height: 20, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  </div>
);

const CheckGrid = ({ items, selected, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {items.map(item => {
      const active = selected.includes(item);
      return (
        <div key={item} onClick={() => onChange(active ? selected.filter(x => x !== item) : [...selected, item])}
          style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? C.accent : C.border}`, background: active ? C.accentLight : C.inputBg, fontFamily: SANS, fontSize: 13, color: active ? C.accentDark : C.textDim, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "all 0.15s" }}>
          {item}
        </div>
      );
    })}
  </div>
);


const PlagaRow = ({ title, scientific, children, last }) => (
  <div style={{ paddingBottom: 14, marginBottom: last ? 0 : 14, borderBottom: last ? "none" : `1px solid ${C.border}` }}>
    <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: C.text, marginBottom: scientific ? 2 : 8 }}>{title}</div>
    {scientific && <div style={{ fontFamily: SANS, fontSize: 11, color: C.textFaint, marginBottom: 8, fontStyle: "italic" }}>{scientific}</div>}
    {children}
  </div>
);

const StarRating = ({ value, onChange, label }) => (
  <div>
    <Label>{label}</Label>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {[1, 2, 3, 4, 5].map(n => (
        <div key={n} onClick={() => onChange(n)} style={{ width: 40, height: 40, borderRadius: 10, background: n <= value ? C.accent : C.inputBg, border: `1.5px solid ${n <= value ? C.accent : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 14, fontWeight: 700, color: n <= value ? "#fff" : C.textFaint, cursor: "pointer", transition: "all 0.15s" }}>{n}</div>
      ))}
      <span style={{ fontFamily: SANS, fontSize: 12, color: C.textFaint, alignSelf: "center", marginLeft: 4 }}>
        {["", "Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"][value] || ""}
      </span>
    </div>
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e.message }; }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 20, background: "#fff", color: "#c00", fontFamily: "monospace", fontSize: 12 }}>
        <b>Error:</b> {this.state.error}
      </div>
    );
    return this.props.children;
  }
}


// ── PLANTILLA EDITOR ─────────────────────────────────────────
function PlantillaEditor({ cultivo, plantilla, onSave, onCancel }) {
  const [estadios, setEstadios] = useState((plantilla?.estadios || []).join(", "));

  const handleSave = () => {
    const nuevosEstadios = estadios.split(",").map(s => s.trim()).filter(Boolean);
    onSave({ ...plantilla, estadios: nuevosEstadios });
  };

  return (
    <div style={{ marginTop: 12, background: C.sectionBg, border: `1.5px solid ${C.accent}40`, borderRadius: 12, padding: 14 }}>
      <div style={{ fontFamily: FONT, fontSize: 11, color: C.accentDark, fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
        EDITANDO PLANTILLA — {cultivo.toUpperCase()}
      </div>
      <div style={{ marginBottom: 10 }}>
        <Label>Estadios (separados por coma)</Label>
        <textarea
          value={estadios}
          onChange={e => setEstadios(e.target.value)}
          rows={3}
          placeholder="V1, V2, V3, R1, R2..."
          style={{ width: "100%", background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", fontFamily: FONT, fontSize: 13, color: C.text, outline: "none", boxSizing: "border-box", resize: "none" }}
        />
        <div style={{ fontSize: 10, color: C.textFaint, marginTop: 4 }}>Estos estadios se guardan en tu dispositivo y se usan como chips de selección rápida</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={handleSave}
          style={{ flex: 1, background: C.accent, border: "none", borderRadius: 10, padding: "10px", color: "#fff", fontFamily: FONT, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
          Guardar plantilla
        </button>
        <button onClick={onCancel}
          style={{ flex: 1, background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px", color: C.textDim, fontFamily: SANS, fontSize: 12, cursor: "pointer" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function AppInner({ session, onLogout }) {
  const [step, setStep] = useState("form");
  const [photos, setPhotos] = useState([]);
  const [gps, setGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    setPendingCount(getQueue().length);
    const trySync = async () => {
      setSyncing(true);
      const sent = await syncQueue();
      setPendingCount(getQueue().length);
      setSyncing(false);
    };
    trySync();
    window.addEventListener("online", trySync);
    return () => window.removeEventListener("online", trySync);
  }, []);

  const [data, setData] = useState({
    empresa: "", campo: "", lote: "", cultivo: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    estacionMuestreo: "",
    plantasPorMetro: "", distanciaEntresurco: "", estadioFenologico: "",
    cobertura: "",
    vuelco: false,
    isocas: "", isocasDano: "",
    chinches: "", chinchesDano: "",
    pulgones: "", pulgonesDano: "",
    trips: "", tripsDano: "",
    aranhuelas: "", aranhuelasDano: "",
    chicharrita: "", chicharritaDano: "",
    cogollero: "", cogolleroDano: "",
    otraPlaga: "", otraPlagaCantidad: "",
    caracol: "", caracolDano: "",
    enfermedades: [], enfermedadIntensidad: 0, enfermedadNota: "",
    malezas: [], malezaCobertura: "", malezaNota: "",
    estresHidrico: 0,
    danoHerbicida: false, danoHerbicidaNota: "",
    danoGranizo: false, danoGranizoNota: "",
    observaciones: "", recomendaciones: "",
  });

  const set = (key, val) => setData(p => ({ ...p, [key]: val }));

  // ── Plantilla por cultivo ─────────────────────────────────────
  const [editandoPlantilla, setEditandoPlantilla] = useState(false);
  const [plantillasLocales, setPlantillasLocales] = useState(() => getPlantillasGuardadas());

  const aplicarPlantilla = (cultivo) => {
    const p = getPlantilla(cultivo);
    if (!p) return;
    // Pre-completar estadio si está vacío
    if (!data.estadioFenologico && p.estadios?.length > 0) {
      set("estadioFenologico", p.estadios[0]);
    }
  };

  const guardarPlantilla = (cultivo, nuevaPlantilla) => {
    const actualizadas = { ...plantillasLocales, [cultivo]: nuevaPlantilla };
    setPlantillasLocales(actualizadas);
    savePlantillas(actualizadas);
    setEditandoPlantilla(false);
  };

  // ── Estacion automática ───────────────────────────────────────
  const [estacionActual, setEstacionActual] = useState(0);

  // Cuando cambia campo → resetear contador visual al valor del nuevo campo
  useEffect(() => {
    if (data.empresa && data.campo && data.fecha) {
      const actual = getEstacionActual(data.empresa, data.campo, data.fecha);
      setEstacionActual(actual + 1);
    } else {
      setEstacionActual(0);
    }
  }, [data.empresa, data.campo, data.fecha]);

  // ── Historial del lote ────────────────────────────────────────
  const [historial, setHistorial] = useState([]);
  const [historialLoading, setHistorialLoading] = useState(false);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const fetchHistorial = async (lote) => {
    if (!lote || !navigator.onLine) return;
    setHistorialLoading(true);
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/monitoreos?lote=eq.${encodeURIComponent(lote)}&order=fecha.desc,hora.desc&limit=3`,
        { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
      );
      const d = await r.json();
      setHistorial(Array.isArray(d) ? d : []);
      if (Array.isArray(d) && d.length > 0) setMostrarHistorial(true);
    } catch { setHistorial([]); }
    setHistorialLoading(false);
  };

  const getGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setGps({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6), acc: Math.round(pos.coords.accuracy) }); setGpsLoading(false); },
      () => { setGps({ error: true }); setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotos = (e) => {
    // Capturar GPS en el momento de sacar la foto
    let photoGps = null;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => { photoGps = { lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6), acc: Math.round(pos.coords.accuracy) }; },
        () => {},
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 10000 }
      );
    }
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        // Pequeño delay para dar chance al GPS de responder
        setTimeout(() => {
          setPhotos(p => [...p, { name: file.name, url: ev.target.result, gps: photoGps, hora: new Date().toTimeString().slice(0,5) }]);
        }, 300);
      };
      reader.readAsDataURL(file);
    });
  };

  const canSubmit = data.empresa && data.campo && data.lote && data.cultivo;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStep("confirm");
    try {
      const payload = {
        empresa: data.empresa,
        campo: data.campo,
        lote: data.lote,
        cultivo: data.cultivo,
        fecha: data.fecha,
        hora: data.hora,
        estacion_muestreo: data.lote ? estacionActual : null,
        gps_lat: gps && !gps.error ? parseFloat(gps.lat) : null,
        gps_lng: gps && !gps.error ? parseFloat(gps.lng) : null,
        gps_precision: gps && !gps.error ? gps.acc : null,
        plantas_por_metro: data.plantasPorMetro ? parseFloat(data.plantasPorMetro) : null,
        distancia_entresurco: data.distanciaEntresurco ? parseFloat(data.distanciaEntresurco) : null,
        estadio_fenologico: data.estadioFenologico || null,
        cobertura: data.cobertura ? parseFloat(data.cobertura) : null,
        vuelco: data.vuelco,
        isocas: data.isocas ? parseFloat(data.isocas) : null,
        isocas_dano: data.isocasDano ? parseFloat(data.isocasDano) : null,
        chinches: data.chinches ? parseFloat(data.chinches) : null,
        chinches_dano: data.chinchesDano ? parseFloat(data.chinchesDano) : null,
        pulgones: data.pulgones ? parseFloat(data.pulgones) : null,
        pulgones_dano: data.pulgonesDano ? parseFloat(data.pulgonesDano) : null,
        trips: data.trips ? parseFloat(data.trips) : null,
        trips_dano: data.tripsDano ? parseFloat(data.tripsDano) : null,
        aranhuelas: data.aranhuelas ? parseFloat(data.aranhuelas) : null,
        aranhuelas_dano: data.aranhuelasDano ? parseFloat(data.aranhuelasDano) : null,
        chicharrita: data.chicharrita ? parseFloat(data.chicharrita) : null,
        chicharrita_dano: data.chicharritaDano ? parseFloat(data.chicharritaDano) : null,
        cogollero: data.cogollero ? parseFloat(data.cogollero) : null,
        cogollero_dano: data.cogolleroDano ? parseFloat(data.cogolleroDano) : null,
        otra_plaga: data.otraPlaga || null,
        otra_plaga_cantidad: data.otraPlagaCantidad ? parseFloat(data.otraPlagaCantidad) : null,
        caracol: data.caracol ? parseFloat(data.caracol) : null,
        caracol_dano: data.caracolDano ? parseFloat(data.caracolDano) : null,
        enfermedades: data.enfermedades.length > 0 ? data.enfermedades : null,
        enfermedad_intensidad: data.enfermedadIntensidad || null,
        enfermedad_nota: data.enfermedadNota || null,
        malezas: data.malezas.length > 0 ? data.malezas : null,
        maleza_cobertura: data.malezaCobertura ? parseFloat(data.malezaCobertura) : null,
        maleza_nota: data.malezaNota || null,
        estres_hidrico: data.estresHidrico || null,
        dano_herbicida: data.danoHerbicida,
        dano_herbicida_nota: data.danoHerbicidaNota || null,
        dano_granizo: data.danoGranizo,
        dano_granizo_nota: data.danoGranizoNota || null,
        observaciones: data.observaciones || null,
        recomendaciones: data.recomendaciones || null,
        fotos_count: photos.length,
        fotos_gps: photos.filter(p => p.gps).map(p => ({ gps: p.gps, hora: p.hora })).length > 0
          ? photos.filter(p => p.gps).map(p => ({ lat: p.gps.lat, lng: p.gps.lng, hora: p.hora }))
          : null,
        monitoreador_email: session?.user?.email || null,
        monitoreador_nombre: session?.user?.user_metadata?.nombre || session?.user?.email?.split("@")[0] || null,
      };
      try {
        await supabaseInsert(payload);
        await syncQueue();
        setPendingCount(getQueue().length);
      } catch {
        addToQueue(payload);
        setPendingCount(getQueue().length);
      }
      // Incrementar estacion para la próxima parada del mismo campo
      if (data.empresa && data.campo && data.fecha) {
        const siguiente = incrementarEstacion(data.empresa, data.campo, data.fecha);
        setEstacionActual(siguiente);
      }
      setStep("success");
    } catch (err) {
      console.error(err);
      setStep("form");
      alert("Error inesperado. Intentá de nuevo.");
    }
  };

  const reset = () => {
    setStep("form"); setPhotos([]); setGps(null);
    // Mantiene empresa, campo y fecha para seguir la jornada — solo limpia lote y datos
    setData(p => ({ ...p, lote: "", cultivo: "", estacionMuestreo: "", plantasPorMetro: "", distanciaEntresurco: "", estadioFenologico: "", cobertura: "", vuelco: false, isocas: "", isocasDano: "", chinches: "", chinchesDano: "", pulgones: "", pulgonesDano: "", trips: "", tripsDano: "", aranhuelas: "", aranhuelasDano: "", chicharrita: "", chicharritaDano: "", cogollero: "", cogolleroDano: "", caracol: "", caracolDano: "", otraPlaga: "", otraPlagaCantidad: "", enfermedades: [], enfermedadIntensidad: 0, enfermedadNota: "", malezas: [], malezaCobertura: "", malezaNota: "", estresHidrico: 0, danoHerbicida: false, danoHerbicidaNota: "", danoGranizo: false, danoGranizoNota: "", observaciones: "", recomendaciones: "" }));
    setHistorial([]); setMostrarHistorial(false);
  };

  if (step === "success") return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: SANS, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.accentLight, border: `3px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 20 }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>Monitoreo enviado</div>
      <div style={{ fontSize: 12, color: C.accent, marginBottom: 1 }}>{data.empresa}</div>
      <div style={{ fontSize: 13, color: C.textDim, marginBottom: 2 }}>{data.campo}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>{data.lote}</div>
      <div style={{ fontSize: 13, color: C.textFaint, marginBottom: 4 }}>{data.cultivo}{data.lote ? ` · Estación ${estacionActual - 1}` : ""}</div>
      <div style={{ fontSize: 13, color: C.textFaint, marginBottom: 4 }}>{data.fecha} · {data.hora}</div>
      {gps && !gps.error && <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 4 }}>📍 {gps.lat}, {gps.lng}</div>}
      <div style={{ fontSize: 13, color: C.textFaint, marginBottom: 12 }}>{photos.length} foto{photos.length !== 1 ? "s" : ""}</div>
      <div style={{ background: pendingCount > 0 ? C.warnLight : C.accentLight, border: `1.5px solid ${pendingCount > 0 ? C.warn + "60" : C.accent + "40"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 24, textAlign: "center" }}>
        {pendingCount > 0 ? (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.warn, marginBottom: 4 }}>⚠ Guardado sin conexión</div>
            <div style={{ fontSize: 12, color: C.warn }}>{pendingCount} monitoreo{pendingCount > 1 ? "s" : ""} pendiente{pendingCount > 1 ? "s" : ""} de envío</div>
            <div style={{ fontSize: 11, color: C.textFaint, marginTop: 4 }}>Se enviará automáticamente cuando recuperes señal</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.accentDark, marginBottom: 2 }}>✓ Enviado correctamente</div>
            <div style={{ fontSize: 12, color: C.textDim }}>Los datos ya están disponibles en el panel admin</div>
          </div>
        )}
      </div>
      {/* Info próxima estación */}
      {data.empresa && data.campo && (
        <div style={{ background: C.sectionBg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 18px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontSize: 11, color: C.textFaint, fontFamily: FONT, letterSpacing: 1 }}>PRÓXIMA PARADA</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 2 }}>Estación {estacionActual} · {data.empresa}</div>
          <div style={{ fontSize: 12, color: C.textDim }}>{data.campo}</div>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        <button onClick={reset} style={{ background: C.accent, border: "none", borderRadius: 14, padding: "14px 36px", color: "#fff", fontFamily: FONT, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>
          ▶ SIGUIENTE LOTE
        </button>
        <button
          onClick={() => { setStep("form"); setPhotos([]); setGps(null); setData(p => ({ ...p, empresa: "", campo: "", lote: "", cultivo: "" })); setHistorial([]); }}
          style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "12px 36px", color: C.textDim, fontFamily: FONT, fontSize: 13, cursor: "pointer" }}>
          Nueva jornada
        </button>
      </div>
    </div>
  );

  if (step === "confirm") return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;600;700&display=swap'); * { box-sizing: border-box; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: 48, height: 48, borderRadius: "50%", border: `4px solid ${C.border}`, borderTopColor: C.accent, animation: "spin 0.8s linear infinite", marginBottom: 20 }} />
      <div style={{ fontSize: 16, color: C.textDim, fontFamily: FONT }}>Enviando al servidor...</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: SANS }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        input, textarea, select { -webkit-appearance: none; appearance: none; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
        input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; }
        ::-webkit-scrollbar { display: none; }
        input::placeholder, textarea::placeholder { color: ${C.textFaint}; }
      `}</style>

      <div style={{ background: C.accent, padding: "16px 18px 14px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 3, marginBottom: 4 }}>PLANILLA DE CAMPO</div>
            <div style={{ fontFamily: FONT, fontSize: 18, color: "#fff", fontWeight: 700, letterSpacing: 1 }}>◈ MONITOREO</div>
          </div>
          <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{session?.user?.user_metadata?.nombre || session?.user?.email?.split("@")[0]}</span>
              <button onClick={onLogout} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "3px 10px", color: "rgba(255,255,255,0.8)", fontFamily: FONT, fontSize: 10, cursor: "pointer" }}>Salir</button>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{data.fecha} · {data.hora}</div>
            {pendingCount > 0 && (
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={async () => { setSyncing(true); await syncQueue(); setPendingCount(getQueue().length); setSyncing(false); }}
                  disabled={syncing}
                  style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 20, padding: "4px 12px", color: "#fff", fontFamily: FONT, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
                >
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5c542", display: "inline-block", flexShrink: 0 }} />
                  {syncing ? "Enviando..." : `${pendingCount} pendiente${pendingCount > 1 ? "s" : ""} · Sincronizar`}
                </button>
                <button
                  onClick={() => { saveQueue([]); setPendingCount(0); }}
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "4px 10px", color: "#fff", fontFamily: FONT, fontSize: 10, cursor: "pointer" }}
                >
                  ✕ Limpiar
                </button>
              </div>
            )}
            {pendingCount === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: navigator.onLine ? "rgba(255,255,255,0.8)" : "#f5c542", display: "inline-block", animation: navigator.onLine ? "none" : "pulse 1.5s infinite" }} />
                <span style={{ fontFamily: FONT, fontSize: 11, color: navigator.onLine ? "rgba(255,255,255,0.7)" : "#f5c542", fontWeight: navigator.onLine ? 400 : 700 }}>
                  {navigator.onLine ? "en línea" : "⚠ SIN SEÑAL"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 14px 120px" }}>

        <SECTION title="IDENTIFICACIÓN" icon="📍" accent>
          <CustomSelect
            label="Empresa *"
            value={data.empresa}
            onChange={v => { set("empresa", v); set("campo", ""); set("lote", ""); }}
            options={EMPRESAS.map(e => e.empresa)}
            placeholder="Seleccionar empresa..."
          />
          {data.empresa && (
            <CustomSelect
              label="Campo *"
              value={data.campo}
              onChange={v => { set("campo", v); set("lote", ""); }}
              options={EMPRESAS.find(e => e.empresa === data.empresa)?.campos.map(c => c.campo) || []}
              placeholder="Seleccionar campo..."
            />
          )}
          {data.campo && (
            <CustomSelect
              label="Lote *"
              value={data.lote}
              onChange={v => {
                set("lote", v);
                setHistorial([]); setMostrarHistorial(false); fetchHistorial(v);
                // GPS automático al seleccionar lote
                if (navigator.geolocation) {
                  setGpsLoading(true);
                  navigator.geolocation.getCurrentPosition(
                    pos => { setGps({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6), acc: Math.round(pos.coords.accuracy) }); setGpsLoading(false); },
                    () => { setGpsLoading(false); },
                    { enableHighAccuracy: true, timeout: 8000 }
                  );
                }
              }}
              options={EMPRESAS.find(e => e.empresa === data.empresa)?.campos.find(c => c.campo === data.campo)?.lotes || []}
              placeholder="Seleccionar lote..."
            />
          )}
          <CustomSelect
            label="Cultivo que está monitoreando *"
            value={data.cultivo}
            onChange={v => { set("cultivo", v); set("estadioFenologico", ""); setTimeout(() => aplicarPlantilla(v), 0); }}
            options={CULTIVOS}
            placeholder="Seleccionar cultivo..."
          />
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}><Label>Fecha</Label><input type="date" value={data.fecha} onChange={e => set("fecha", e.target.value)} style={{ ...inputBase, fontFamily: FONT, fontSize: 13 }} /></div>
            <div style={{ flex: 1 }}><Label>Hora</Label><input type="time" value={data.hora} onChange={e => set("hora", e.target.value)} style={{ ...inputBase, fontFamily: FONT, fontSize: 13 }} /></div>
          </div>
          {/* Estación automática — solo visible cuando hay lote seleccionado */}
          {data.lote && (
            <div style={{ marginBottom: 12 }}>
              <Label>Estación de muestreo</Label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.accentLight, border: `1.5px solid ${C.accent}`, borderRadius: 10, padding: "11px 14px" }}>
                <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, color: C.accentDark, minWidth: 32 }}>
                  {estacionActual}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.accentDark }}>
                    Estación {estacionActual} — {data.lote}
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginTop: 1 }}>
                    {data.empresa} · {data.campo} · {data.fecha}
                  </div>
                </div>
                <span style={{ fontSize: 18 }}>📍</span>
              </div>
            </div>
          )}
          <div>
            <Label>Punto GPS</Label>
            <button onClick={getGPS} disabled={gpsLoading} style={{ width: "100%", background: gps && !gps.error ? C.accentLight : C.inputBg, border: `1.5px solid ${gps && !gps.error ? C.accent : C.border}`, borderRadius: 10, padding: "11px 14px", fontFamily: SANS, fontSize: 13, color: gps && !gps.error ? C.accentDark : C.textDim, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
              <span style={{ fontSize: 16 }}>{gpsLoading ? "⏳" : gps && !gps.error ? "📍" : "🌐"}</span>
              <span>{gpsLoading ? "Obteniendo ubicación..." : gps && !gps.error ? `${gps.lat}, ${gps.lng} (±${gps.acc}m)` : gps?.error ? "No se pudo obtener GPS" : "Capturar punto GPS"}</span>
            </button>
          </div>
        </SECTION>

        {/* ── HISTORIAL DEL LOTE ── */}
        {data.lote && (historialLoading || historial.length > 0) && (
          <div style={{ background: C.card, border: `1.5px solid ${C.accent}40`, borderRadius: 16, overflow: "hidden", marginBottom: 14 }}>
            {/* Header del historial */}
            <div
              onClick={() => setMostrarHistorial(p => !p)}
              style={{ background: C.accentLight, padding: "12px 16px", borderBottom: mostrarHistorial ? `1px solid ${C.accent}30` : "none", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>🕐</span>
                <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: C.accentDark, letterSpacing: 2 }}>
                  HISTORIAL — {data.lote}
                </span>
                {historialLoading && <span style={{ fontSize: 11, color: C.textFaint }}>cargando...</span>}
                {!historialLoading && historial.length > 0 && (
                  <span style={{ background: C.accent, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 10, padding: "1px 7px", fontFamily: FONT }}>
                    {historial.length}
                  </span>
                )}
              </div>
              <span style={{ fontSize: 12, color: C.textFaint }}>{mostrarHistorial ? "▲" : "▼"}</span>
            </div>

            {mostrarHistorial && !historialLoading && (
              <div style={{ padding: "12px 16px" }}>
                {historial.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "16px 0", color: C.textFaint, fontSize: 13 }}>
                    Sin monitoreos previos para este lote
                  </div>
                ) : historial.map((m, i) => {
                  const UMBS = { isocas:2, chinches:1, pulgones:3, chicharrita:1, trips:5, aranhuelas:2, cogollero:1 };
                  const plagas = Object.keys(UMBS);
                  const alertas = plagas.filter(p => (parseFloat(m[p])||0) >= UMBS[p]);
                  const plagaLabels = { isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero" };

                  return (
                    <div key={m.id} style={{ paddingBottom: i < historial.length - 1 ? 12 : 0, marginBottom: i < historial.length - 1 ? 12 : 0, borderBottom: i < historial.length - 1 ? `1px solid ${C.border}` : "none" }}>
                      {/* Header monitoreo */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: alertas.length > 0 ? C.danger : C.accent, flexShrink: 0 }} />
                          <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: C.text }}>{m.fecha}</span>
                          {m.hora && <span style={{ fontSize: 11, color: C.textFaint }}>{m.hora.slice(0,5)}</span>}
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          {m.estadio_fenologico && (
                            <span style={{ background: C.sectionBg, color: C.textDim, fontSize: 10, padding: "2px 8px", borderRadius: 10, fontFamily: FONT }}>{m.estadio_fenologico}</span>
                          )}
                          {m.monitoreador_nombre && (
                            <span style={{ background: C.sectionBg, color: C.textFaint, fontSize: 10, padding: "2px 8px", borderRadius: 10 }}>{m.monitoreador_nombre}</span>
                          )}
                        </div>
                      </div>

                      {/* Plagas sobre umbral */}
                      {alertas.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                          {alertas.map(p => (
                            <div key={p} style={{ background: C.dangerLight, border: `1px solid ${C.danger}30`, borderRadius: 8, padding: "4px 10px", fontSize: 11 }}>
                              <span style={{ fontWeight: 700, color: C.danger }}>{plagaLabels[p]}: </span>
                              <span style={{ fontFamily: FONT, color: C.danger, fontWeight: 700 }}>{m[p]}</span>
                              <span style={{ color: C.textFaint }}> (u:{UMBS[p]})</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Plagas sin alerta con valores */}
                      {(() => {
                        const conValor = plagas.filter(p => (parseFloat(m[p])||0) > 0 && !alertas.includes(p));
                        if (conValor.length === 0) return null;
                        return (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
                            {conValor.map(p => (
                              <span key={p} style={{ background: C.sectionBg, color: C.textDim, fontSize: 10, padding: "2px 8px", borderRadius: 8, fontFamily: FONT }}>
                                {plagaLabels[p]}: {m[p]}
                              </span>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Enfermedades */}
                      {m.enfermedades?.length > 0 && (
                        <div style={{ fontSize: 11, color: C.warn, marginBottom: 4 }}>
                          🦠 {m.enfermedades.join(", ")} {m.enfermedad_intensidad ? `(int: ${m.enfermedad_intensidad}/5)` : ""}
                        </div>
                      )}

                      {/* Stats rápidos */}
                      <div style={{ display: "flex", gap: 12, fontSize: 10, color: C.textFaint }}>
                        {m.cobertura && <span>Canopeo: {m.cobertura}%</span>}
                        {m.estres_hidrico > 0 && <span style={{ color: m.estres_hidrico >= 4 ? C.danger : C.warn }}>Estrés: {m.estres_hidrico}/5</span>}
                        {m.plantas_por_metro && <span>Plantas: {m.plantas_por_metro}/m</span>}
                        {alertas.length === 0 && <span style={{ color: C.accent, fontWeight: 600 }}>✓ Sin alertas</span>}
                      </div>

                      {/* Recomendaciones previas */}
                      {m.recomendaciones && (
                        <div style={{ marginTop: 6, background: C.accentLight, borderRadius: 8, padding: "6px 10px", fontSize: 11, color: C.accentDark, borderLeft: `3px solid ${C.accent}` }}>
                          💡 {m.recomendaciones}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <SECTION title="STANDEO Y CULTIVO" icon="🌱">
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <NumInput label="Plantas / metro" unit="pl/m" value={data.plantasPorMetro} onChange={v => set("plantasPorMetro", v)} />
            <NumInput label="Entresurco" unit="cm" value={data.distanciaEntresurco} onChange={v => set("distanciaEntresurco", v)} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <NumInput label="Cobertura canopeo" unit="%" value={data.cobertura} onChange={v => set("cobertura", v)} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <Label>Estadio fenológico</Label>
              {data.cultivo && getPlantilla(data.cultivo) && (
                <button
                  onClick={() => setEditandoPlantilla(v => !v)}
                  style={{ background: "none", border: "none", fontSize: 11, color: C.accent, cursor: "pointer", fontFamily: SANS, padding: 0, fontWeight: 600 }}>
                  {editandoPlantilla ? "✕ Cerrar" : "✏️ Editar plantilla"}
                </button>
              )}
            </div>
            {data.cultivo && getPlantilla(data.cultivo) ? (
              <div>
                {/* Chips de estadios */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 8 }}>
                  {(plantillasLocales[data.cultivo]?.estadios || PLANTILLAS_CULTIVO[data.cultivo]?.estadios || []).map(e => (
                    <div key={e} onClick={() => set("estadioFenologico", e)}
                      style={{ padding: "6px 13px", borderRadius: 20, border: `1.5px solid ${data.estadioFenologico === e ? C.accent : C.border}`, background: data.estadioFenologico === e ? C.accentLight : C.inputBg, fontFamily: FONT, fontSize: 12, color: data.estadioFenologico === e ? C.accentDark : C.textDim, cursor: "pointer", fontWeight: data.estadioFenologico === e ? 700 : 400 }}>
                      {e}
                    </div>
                  ))}
                </div>
                {/* Input libre por si no está en la lista */}
                <input type="text" placeholder="O escribí otro estadio..." value={data.estadioFenologico}
                  onChange={e => set("estadioFenologico", e.target.value)}
                  style={{ ...inputBase, fontSize: 13 }} />

                {/* Editor de plantilla */}
                {editandoPlantilla && (
                  <PlantillaEditor
                    cultivo={data.cultivo}
                    plantilla={plantillasLocales[data.cultivo] || PLANTILLAS_CULTIVO[data.cultivo]}
                    onSave={(nueva) => guardarPlantilla(data.cultivo, nueva)}
                    onCancel={() => setEditandoPlantilla(false)}
                  />
                )}
              </div>
            ) : (
              <input type="text" placeholder="Ej: V6, R1, espigazón..." value={data.estadioFenologico}
                onChange={e => set("estadioFenologico", e.target.value)} style={inputBase} />
            )}
          </div>
          <Toggle label="Presencia de vuelco" value={data.vuelco} onChange={v => set("vuelco", v)} />
        </SECTION>

        {(() => {
          const plantilla = getPlantilla(data.cultivo);
          const relevantes = plantilla?.plagasRelevantes || ["isocas","chinches","pulgones","chicharrita","trips","aranhuelas","cogollero"];
          const mostrar = (key) => !data.cultivo || relevantes.includes(key);
          const enfermedadesRelevantes = plantilla?.enfermedadesRelevantes || ENFERMEDADES;

          return (
            <>
              <SECTION title="PLAGAS" icon="🦗">
                {/* Indicador de cultivo filtrado */}
                {data.cultivo && plantilla && (
                  <div style={{ fontSize: 11, color: C.accent, fontFamily: FONT, marginBottom: 12, background: C.accentLight, borderRadius: 8, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                    <span>🌱</span>
                    <span>Plagas relevantes para <b>{data.cultivo}</b> · {relevantes.length} de 7</span>
                  </div>
                )}
                {mostrar("isocas") && (
                  <PlagaRow title="Isocas / Orugas">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Cantidad / metro" unit="/m" value={data.isocas} onChange={v => set("isocas", v)} /><NumInput label="% defoliación" unit="%" value={data.isocasDano} onChange={v => set("isocasDano", v)} /></div>
                  </PlagaRow>
                )}
                {mostrar("chinches") && (
                  <PlagaRow title="Chinches">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Adultos / metro" unit="/m" value={data.chinches} onChange={v => set("chinches", v)} /><NumInput label="Ninfas / metro" unit="/m" value={data.chinchesDano} onChange={v => set("chinchesDano", v)} /></div>
                  </PlagaRow>
                )}
                {mostrar("pulgones") && (
                  <PlagaRow title="Pulgones">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Colonias / planta" unit="/pl" value={data.pulgones} onChange={v => set("pulgones", v)} /><NumInput label="% plantas afect." unit="%" value={data.pulgonesDano} onChange={v => set("pulgonesDano", v)} /></div>
                  </PlagaRow>
                )}
                {mostrar("trips") && (
                  <PlagaRow title="Trips">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Cantidad / hoja" unit="/hoja" value={data.trips} onChange={v => set("trips", v)} /><NumInput label="% plantas afect." unit="%" value={data.tripsDano} onChange={v => set("tripsDano", v)} /></div>
                  </PlagaRow>
                )}
                {mostrar("aranhuelas") && (
                  <PlagaRow title="Arañuelas / Ácaros">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Focos detectados" value={data.aranhuelas} onChange={v => set("aranhuelas", v)} /><NumInput label="% hoja afectada" unit="%" value={data.aranhuelasDano} onChange={v => set("aranhuelasDano", v)} /></div>
                  </PlagaRow>
                )}
                {mostrar("caracol") && (
                  <PlagaRow title="Caracol / Babosa">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Individuos / m²" unit="/m²" value={data.caracol} onChange={v => set("caracol", v)} /><NumInput label="% plantas afect." unit="%" value={data.caracolDano} onChange={v => set("caracolDano", v)} /></div>
                  </PlagaRow>
                )}
                {mostrar("chicharrita") && (
                  <PlagaRow title="Chicharrita del maíz" scientific="Dalbulus maidis">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Adultos / planta" unit="/pl" value={data.chicharrita} onChange={v => set("chicharrita", v)} /><NumInput label="% plantas afect." unit="%" value={data.chicharritaDano} onChange={v => set("chicharritaDano", v)} /></div>
                  </PlagaRow>
                )}
                {mostrar("cogollero") && (
                  <PlagaRow title="Cogollero">
                    <div style={{ display: "flex", gap: 10 }}><NumInput label="Larvas / planta" unit="/pl" value={data.cogollero} onChange={v => set("cogollero", v)} /><NumInput label="% plantas afect." unit="%" value={data.cogolleroDano} onChange={v => set("cogolleroDano", v)} /></div>
                  </PlagaRow>
                )}
                <PlagaRow title="Otra plaga" last>
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ flex: 2 }}><Label>Nombre</Label><input type="text" placeholder="Describir..." value={data.otraPlaga} onChange={e => set("otraPlaga", e.target.value)} style={inputBase} /></div>
                    <NumInput label="Cantidad" value={data.otraPlagaCantidad} onChange={v => set("otraPlagaCantidad", v)} />
                  </div>
                </PlagaRow>
              </SECTION>

              <SECTION title="ENFERMEDADES FOLIARES" icon="🦠">
                <div style={{ marginBottom: 14 }}>
                  <Label>Enfermedades detectadas</Label>
                  <CheckGrid items={enfermedadesRelevantes} selected={data.enfermedades} onChange={v => set("enfermedades", v)} />
                </div>
                {data.enfermedades.length > 0 && <div style={{ marginBottom: 12 }}><StarRating label="Intensidad / severidad" value={data.enfermedadIntensidad} onChange={v => set("enfermedadIntensidad", v)} /></div>}
                <TextArea label="Observaciones" value={data.enfermedadNota} onChange={v => set("enfermedadNota", v)} placeholder="Zona afectada, síntomas, avance..." />
              </SECTION>
            </>
          );
        })()}

        <SECTION title="MALEZAS" icon="🌾">
          <div style={{ marginBottom: 14 }}><Label>Malezas presentes</Label><CheckGrid items={MALEZAS} selected={data.malezas} onChange={v => set("malezas", v)} /></div>
          {data.malezas.length > 0 && <div style={{ marginBottom: 12 }}><NumInput label="Cobertura estimada" unit="%" value={data.malezaCobertura} onChange={v => set("malezaCobertura", v)} /></div>}
          <TextArea label="Observaciones" value={data.malezaNota} onChange={v => set("malezaNota", v)} placeholder="Estadio, distribución, predominancia..." />
        </SECTION>

        <SECTION title="ESTADO SANITARIO GENERAL" icon="🩺">
          <div style={{ marginBottom: 14 }}><StarRating label="Estrés hídrico visual (1 = sin estrés · 5 = severo)" value={data.estresHidrico} onChange={v => set("estresHidrico", v)} /></div>
          <Toggle label="Daño por herbicida" value={data.danoHerbicida} onChange={v => set("danoHerbicida", v)} />
          {data.danoHerbicida && <div style={{ marginTop: 10, marginBottom: 10 }}><TextArea label="Descripción del daño" value={data.danoHerbicidaNota} onChange={v => set("danoHerbicidaNota", v)} placeholder="Tipo de síntoma, zona afectada, % plantas..." /></div>}
          <Toggle label="Daño por granizo" value={data.danoGranizo} onChange={v => set("danoGranizo", v)} noBorder={!data.danoGranizo} />
          {data.danoGranizo && <div style={{ marginTop: 10 }}><TextArea label="Descripción del daño" value={data.danoGranizoNota} onChange={v => set("danoGranizoNota", v)} placeholder="% daño estimado, órganos afectados..." /></div>}
        </SECTION>

        <SECTION title="FOTOGRAFÍAS" icon="📷">
          <input ref={fileRef} type="file" accept="image/*" multiple capture="environment" onChange={handlePhotos} style={{ display: "none" }} />
          <button onClick={() => fileRef.current.click()} style={{ width: "100%", border: `2px dashed ${C.borderStrong}`, borderRadius: 12, background: C.inputBg, padding: "18px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, marginBottom: photos.length > 0 ? 14 : 0 }}>
            <span style={{ fontSize: 28 }}>📷</span>
            <span style={{ fontFamily: SANS, fontSize: 13, color: C.textDim }}>Tomar foto o seleccionar galería</span>
          </button>
          {photos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: "relative", borderRadius: 10, overflow: "hidden", border: `1.5px solid ${C.border}` }}>
                  <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                    <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                  {/* GPS badge */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", padding: "3px 5px" }}>
                    {p.gps ? (
                      <div style={{ fontSize: 9, color: "#4ae87a", fontFamily: "monospace", lineHeight: 1.3 }}>
                        📍 {p.gps.lat}, {p.gps.lng}
                      </div>
                    ) : (
                      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: "monospace" }}>sin GPS</div>
                    )}
                    {p.hora && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)", fontFamily: "monospace" }}>{p.hora}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SECTION>

        <SECTION title="OBSERVACIONES Y RECOMENDACIONES" icon="📝">
          <div style={{ marginBottom: 12 }}><TextArea label="Observaciones generales" value={data.observaciones} onChange={v => set("observaciones", v)} placeholder="Todo lo que consideres importante para el administrador..." /></div>
          <TextArea label="Recomendaciones de manejo" value={data.recomendaciones} onChange={v => set("recomendaciones", v)} placeholder="Ej: Aplicar fungicida, repetir monitoreo en 7 días..." />
        </SECTION>

      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: C.surface, borderTop: `1px solid ${C.border}`, padding: "14px 16px 24px", zIndex: 200 }}>
        {!canSubmit && <div style={{ fontFamily: SANS, fontSize: 12, color: C.warn, textAlign: "center", marginBottom: 10 }}>⚠ Completá Empresa, Campo, Lote y Cultivo para enviar</div>}
        <button onClick={handleSubmit} disabled={!canSubmit}
          style={{ width: "100%", border: "none", borderRadius: 14, padding: "16px", fontFamily: FONT, fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: canSubmit ? "pointer" : "not-allowed", background: canSubmit ? C.accent : C.border, color: canSubmit ? "#fff" : C.textFaint, transition: "all 0.2s" }}>
          {`ENVIAR MONITOREO${photos.length > 0 ? ` · ${photos.length} FOTO${photos.length > 1 ? "S" : ""}` : ""}`}
        </button>
      </div>
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

  if (!session) return <ErrorBoundary><LoginScreen onLogin={handleLogin} /></ErrorBoundary>;
  return <ErrorBoundary><AppInner session={session} onLogout={handleLogout} /></ErrorBoundary>;
}