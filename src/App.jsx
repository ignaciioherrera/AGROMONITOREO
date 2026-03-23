import { useState, useRef, useEffect } from "react";

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

const LOTES = [
  "Lote Norte A — Maíz",
  "Lote Sur B — Soja",
  "Lote Este C — Trigo",
  "Planta Semillas",
  "Silo Bolsa 1",
  "Silo Bolsa 2",
];

const CULTIVOS = ["Maíz", "Soja", "Trigo", "Girasol", "Sorgo", "Maní", "Otro"];
const ENFERMEDADES = ["Roya", "Mancha marrón", "Tizón", "Podredumbre", "Fusarium", "Esclerotinia", "Carbón", "Otra"];
const ENFERMEDADES_RAIZ = ["Podredumbre radicular", "Pythium", "Rhizoctonia", "Fusarium raíz", "Otra"];
const MALEZAS = ["Sorgo de alepo", "Gramón", "Ciperácea", "Verdolaga", "Yuyo colorado", "Rama negra", "Capín", "Otra"];
const HUMEDAD_SUELO = ["Muy seco", "Seco", "Normal", "Húmedo", "Muy húmedo"];

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

const ChipSelect = ({ options, value, onChange }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
    {options.map(opt => {
      const active = value === opt;
      return (
        <div key={opt} onClick={() => onChange(active ? "" : opt)}
          style={{ padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${active ? C.accent : C.border}`, background: active ? C.accentLight : C.inputBg, fontFamily: SANS, fontSize: 13, color: active ? C.accentDark : C.textDim, cursor: "pointer", fontWeight: active ? 600 : 400, transition: "all 0.15s" }}>
          {opt}
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

export default function App() {
  const [step, setStep] = useState("form");
  const [photos, setPhotos] = useState([]);
  const [gps, setGps] = useState(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [firma, setFirma] = useState("");
  const [firmaActiva, setFirmaActiva] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const fileRef = useRef();
  const canvasRef = useRef();
  const drawing = useRef(false);

  // Sync on mount and when online
  useEffect(() => {
    setPendingCount(getQueue().length);
    const trySync = async () => {
      if (!navigator.onLine) return;
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
    lote: "", cultivo: "",
    fecha: new Date().toISOString().split("T")[0],
    hora: new Date().toTimeString().slice(0, 5),
    estacionMuestreo: "",
    plantasPorMetro: "", distanciaEntresurco: "", estadioFenologico: "",
    alturaPlanta: "", cobertura: "",
    vuelco: false, acame: false,
    isocas: "", isocasDano: "",
    chinches: "", chinchesDano: "",
    pulgones: "", pulgonesDano: "",
    trips: "", tripsDano: "",
    tripsFlor: "", tripsFlorDano: "",
    aranhuelas: "", aranhuelasDano: "",
    chicharrita: "", chicharritaDano: "",
    barrenador: "", barrenadorDano: "",
    cogollero: "", cogolleroDano: "",
    moscaBlanca: "", moscaBlancaDano: "",
    otraPlaga: "", otraPlagaCantidad: "",
    enfermedades: [], enfermedadIntensidad: 0, enfermedadNota: "",
    enfermedadesRaiz: [], enfermedadRaizIntensidad: 0, enfermedadRaizNota: "",
    malezas: [], malezaCobertura: "", malezaNota: "",
    estresHidrico: 0,
    danoHerbicida: false, danoHerbicidaNota: "",
    danoGranizo: false, danoGranizoNota: "",
    humedadSuelo: "",
    observaciones: "", recomendaciones: "",
  });

  const set = (key, val) => setData(p => ({ ...p, [key]: val }));

  const getGPS = () => {
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => { setGps({ lat: pos.coords.latitude.toFixed(6), lng: pos.coords.longitude.toFixed(6), acc: Math.round(pos.coords.accuracy) }); setGpsLoading(false); },
      () => { setGps({ error: true }); setGpsLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handlePhotos = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos(p => [...p, { name: file.name, url: ev.target.result }]);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (!firmaActiva || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const getPos = (e) => { const r = canvas.getBoundingClientRect(); const src = e.touches ? e.touches[0] : e; return { x: src.clientX - r.left, y: src.clientY - r.top }; };
    const start = (e) => { e.preventDefault(); drawing.current = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    const move = (e) => { e.preventDefault(); if (!drawing.current) return; const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    const end = () => { drawing.current = false; setFirma(canvas.toDataURL()); };
    canvas.addEventListener("mousedown", start); canvas.addEventListener("mousemove", move); canvas.addEventListener("mouseup", end);
    canvas.addEventListener("touchstart", start, { passive: false }); canvas.addEventListener("touchmove", move, { passive: false }); canvas.addEventListener("touchend", end);
    return () => {
      canvas.removeEventListener("mousedown", start); canvas.removeEventListener("mousemove", move); canvas.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start); canvas.removeEventListener("touchmove", move); canvas.removeEventListener("touchend", end);
    };
  }, [firmaActiva]);

  const clearFirma = () => { if (canvasRef.current) { canvasRef.current.getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); } setFirma(""); };

  const canSubmit = data.lote && data.cultivo;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setStep("confirm");
    try {
      const payload = {
        lote: data.lote,
        cultivo: data.cultivo,
        fecha: data.fecha,
        hora: data.hora,
        estacion_muestreo: data.estacionMuestreo || null,
        gps_lat: gps && !gps.error ? parseFloat(gps.lat) : null,
        gps_lng: gps && !gps.error ? parseFloat(gps.lng) : null,
        gps_precision: gps && !gps.error ? gps.acc : null,
        plantas_por_metro: data.plantasPorMetro ? parseFloat(data.plantasPorMetro) : null,
        distancia_entresurco: data.distanciaEntresurco ? parseFloat(data.distanciaEntresurco) : null,
        estadio_fenologico: data.estadioFenologico || null,
        altura_planta: data.alturaPlanta ? parseFloat(data.alturaPlanta) : null,
        cobertura: data.cobertura ? parseFloat(data.cobertura) : null,
        vuelco: data.vuelco,
        acame: data.acame,
        isocas: data.isocas ? parseFloat(data.isocas) : null,
        isocas_dano: data.isocasDano ? parseFloat(data.isocasDano) : null,
        chinches: data.chinches ? parseFloat(data.chinches) : null,
        chinches_dano: data.chinchesDano ? parseFloat(data.chinchesDano) : null,
        pulgones: data.pulgones ? parseFloat(data.pulgones) : null,
        pulgones_dano: data.pulgonesDano ? parseFloat(data.pulgonesDano) : null,
        trips: data.trips ? parseFloat(data.trips) : null,
        trips_dano: data.tripsDano ? parseFloat(data.tripsDano) : null,
        trips_flor: data.tripsFlor ? parseFloat(data.tripsFlor) : null,
        trips_flor_dano: data.tripsFlorDano ? parseFloat(data.tripsFlorDano) : null,
        aranhuelas: data.aranhuelas ? parseFloat(data.aranhuelas) : null,
        aranhuelas_dano: data.aranhuelasDano ? parseFloat(data.aranhuelasDano) : null,
        chicharrita: data.chicharrita ? parseFloat(data.chicharrita) : null,
        chicharrita_dano: data.chicharritaDano ? parseFloat(data.chicharritaDano) : null,
        barrenador: data.barrenador ? parseFloat(data.barrenador) : null,
        barrenador_dano: data.barrenadorDano ? parseFloat(data.barrenadorDano) : null,
        cogollero: data.cogollero ? parseFloat(data.cogollero) : null,
        cogollero_dano: data.cogolleroDano ? parseFloat(data.cogolleroDano) : null,
        mosca_blanca: data.moscaBlanca ? parseFloat(data.moscaBlanca) : null,
        mosca_blanca_dano: data.moscaBlancaDano ? parseFloat(data.moscaBlancaDano) : null,
        otra_plaga: data.otraPlaga || null,
        otra_plaga_cantidad: data.otraPlagaCantidad ? parseFloat(data.otraPlagaCantidad) : null,
        enfermedades: data.enfermedades.length > 0 ? data.enfermedades : null,
        enfermedad_intensidad: data.enfermedadIntensidad || null,
        enfermedad_nota: data.enfermedadNota || null,
        enfermedades_raiz: data.enfermedadesRaiz.length > 0 ? data.enfermedadesRaiz : null,
        enfermedad_raiz_intensidad: data.enfermedadRaizIntensidad || null,
        enfermedad_raiz_nota: data.enfermedadRaizNota || null,
        malezas: data.malezas.length > 0 ? data.malezas : null,
        maleza_cobertura: data.malezaCobertura ? parseFloat(data.malezaCobertura) : null,
        maleza_nota: data.malezaNota || null,
        estres_hidrico: data.estresHidrico || null,
        dano_herbicida: data.danoHerbicida,
        dano_herbicida_nota: data.danoHerbicidaNota || null,
        dano_granizo: data.danoGranizo,
        dano_granizo_nota: data.danoGranizoNota || null,
        humedad_suelo: data.humedadSuelo || null,
        observaciones: data.observaciones || null,
        recomendaciones: data.recomendaciones || null,
        firma_digital: !!firma,
        fotos_count: photos.length,
      };
      if (navigator.onLine) {
        try {
          await supabaseInsert(payload);
          // Also try to flush the queue while we're online
          await syncQueue();
          setPendingCount(getQueue().length);
        } catch {
          // No connection despite onLine flag, queue it
          addToQueue(payload);
          setPendingCount(getQueue().length);
        }
      } else {
        addToQueue(payload);
        setPendingCount(getQueue().length);
      }
      setStep("success");
    } catch (err) {
      console.error(err);
      setStep("form");
      alert("Error inesperado. Intentá de nuevo.");
    }
  };

  const reset = () => {
    setStep("form"); setPhotos([]); setGps(null); setFirma(""); setFirmaActiva(false);
    setData(p => ({ ...p, lote: "", cultivo: "", estacionMuestreo: "", plantasPorMetro: "", alturaPlanta: "", cobertura: "", vuelco: false, acame: false, isocas: "", chinches: "", pulgones: "", trips: "", tripsFlor: "", aranhuelas: "", chicharrita: "", barrenador: "", cogollero: "", moscaBlanca: "", otraPlaga: "", otraPlagaCantidad: "", enfermedades: [], enfermedadesRaiz: [], malezas: [], estresHidrico: 0, danoHerbicida: false, danoGranizo: false, humedadSuelo: "", observaciones: "", recomendaciones: "" }));
  };

  if (step === "success") return (
    <div style={{ maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: C.bg, fontFamily: SANS, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: C.accentLight, border: `3px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 20 }}>✓</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 8 }}>Monitoreo enviado</div>
      <div style={{ fontSize: 14, color: C.textDim, marginBottom: 4 }}>{data.lote}</div>
      <div style={{ fontSize: 13, color: C.textFaint, marginBottom: 4 }}>{data.cultivo}{data.estacionMuestreo ? ` · Estación ${data.estacionMuestreo}` : ""}</div>
      <div style={{ fontSize: 13, color: C.textFaint, marginBottom: 4 }}>{data.fecha} · {data.hora}</div>
      {gps && !gps.error && <div style={{ fontSize: 12, color: C.textFaint, marginBottom: 4 }}>📍 {gps.lat}, {gps.lng}</div>}
      <div style={{ fontSize: 13, color: C.textFaint, marginBottom: 12 }}>{photos.length} foto{photos.length !== 1 ? "s" : ""}{firma ? " · Firmado ✓" : ""}</div>
      {pendingCount > 0
        ? <div style={{ background: C.warnLight, border: `1px solid ${C.warn}40`, borderRadius: 10, padding: "10px 18px", marginBottom: 24, fontSize: 13, color: C.warn, textAlign: "center" }}>📡 Sin señal — guardado en el dispositivo<br /><span style={{ fontSize: 12 }}>{pendingCount} monitoreo{pendingCount > 1 ? "s" : ""} pendiente{pendingCount > 1 ? "s" : ""} de envío</span></div>
        : <div style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: "10px 18px", marginBottom: 24, fontSize: 13, color: C.accentDark, textAlign: "center" }}>✓ Enviado a Supabase</div>
      }
      <button onClick={reset} style={{ background: C.accent, border: "none", borderRadius: 14, padding: "14px 36px", color: "#fff", fontFamily: FONT, fontSize: 14, fontWeight: 700, cursor: "pointer", letterSpacing: 1 }}>NUEVO MONITOREO</button>
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
            <div style={{ fontFamily: FONT, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{data.fecha} · {data.hora}</div>
            {pendingCount > 0 && (
              <button
                onClick={async () => { setSyncing(true); await syncQueue(); setPendingCount(getQueue().length); setSyncing(false); }}
                disabled={syncing}
                style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.4)", borderRadius: 20, padding: "4px 12px", color: "#fff", fontFamily: FONT, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#f5c542", display: "inline-block", flexShrink: 0 }} />
                {syncing ? "Enviando..." : `${pendingCount} pendiente${pendingCount > 1 ? "s" : ""} · Sincronizar`}
              </button>
            )}
            {pendingCount === 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: navigator.onLine ? "rgba(255,255,255,0.8)" : "#f5c542", display: "inline-block" }} />
                <span style={{ fontFamily: FONT, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>{navigator.onLine ? "en línea" : "sin señal"}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 14px 120px" }}>

        <SECTION title="IDENTIFICACIÓN" icon="📍" accent>
          <div style={{ marginBottom: 12 }}>
            <Label>Lote *</Label>
            <select value={data.lote} onChange={e => set("lote", e.target.value)} style={{ ...inputBase, border: `1.5px solid ${data.lote ? C.accent : C.border}`, color: data.lote ? C.text : C.textFaint }}>
              <option value="">Seleccionar lote...</option>
              {LOTES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Cultivo que está monitoreando *</Label>
            <select value={data.cultivo} onChange={e => set("cultivo", e.target.value)} style={{ ...inputBase, border: `1.5px solid ${data.cultivo ? C.accent : C.border}`, color: data.cultivo ? C.text : C.textFaint }}>
              <option value="">Seleccionar cultivo...</option>
              {CULTIVOS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1 }}><Label>Fecha</Label><input type="date" value={data.fecha} onChange={e => set("fecha", e.target.value)} style={{ ...inputBase, fontFamily: FONT, fontSize: 13 }} /></div>
            <div style={{ flex: 1 }}><Label>Hora</Label><input type="time" value={data.hora} onChange={e => set("hora", e.target.value)} style={{ ...inputBase, fontFamily: FONT, fontSize: 13 }} /></div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>N° de estación de muestreo</Label>
            <input type="number" inputMode="numeric" placeholder="Ej: 1, 2, 3..." value={data.estacionMuestreo} onChange={e => set("estacionMuestreo", e.target.value)} style={{ ...inputBase, fontFamily: FONT }} />
          </div>
          <div>
            <Label>Punto GPS</Label>
            <button onClick={getGPS} disabled={gpsLoading} style={{ width: "100%", background: gps && !gps.error ? C.accentLight : C.inputBg, border: `1.5px solid ${gps && !gps.error ? C.accent : C.border}`, borderRadius: 10, padding: "11px 14px", fontFamily: SANS, fontSize: 13, color: gps && !gps.error ? C.accentDark : C.textDim, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, textAlign: "left" }}>
              <span style={{ fontSize: 16 }}>{gpsLoading ? "⏳" : gps && !gps.error ? "📍" : "🌐"}</span>
              <span>{gpsLoading ? "Obteniendo ubicación..." : gps && !gps.error ? `${gps.lat}, ${gps.lng} (±${gps.acc}m)` : gps?.error ? "No se pudo obtener GPS" : "Capturar punto GPS"}</span>
            </button>
          </div>
        </SECTION>

        <SECTION title="STANDEO Y CULTIVO" icon="🌱">
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <NumInput label="Plantas / metro" unit="pl/m" value={data.plantasPorMetro} onChange={v => set("plantasPorMetro", v)} />
            <NumInput label="Entresurco" unit="cm" value={data.distanciaEntresurco} onChange={v => set("distanciaEntresurco", v)} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            <NumInput label="Altura de planta" unit="cm" value={data.alturaPlanta} onChange={v => set("alturaPlanta", v)} />
            <NumInput label="Cobertura canopeo" unit="%" value={data.cobertura} onChange={v => set("cobertura", v)} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <Label>Estadio fenológico</Label>
            <input type="text" placeholder="Ej: V6, R1, espigazón..." value={data.estadioFenologico} onChange={e => set("estadioFenologico", e.target.value)} style={inputBase} />
          </div>
          <Toggle label="Presencia de vuelco" value={data.vuelco} onChange={v => set("vuelco", v)} />
          <Toggle label="Presencia de acame" value={data.acame} onChange={v => set("acame", v)} noBorder />
        </SECTION>

        <SECTION title="PLAGAS" icon="🦗">
          <PlagaRow title="Isocas / Orugas">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Cantidad / metro" unit="/m" value={data.isocas} onChange={v => set("isocas", v)} /><NumInput label="% defoliación" unit="%" value={data.isocasDano} onChange={v => set("isocasDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Chinches">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Adultos / metro" unit="/m" value={data.chinches} onChange={v => set("chinches", v)} /><NumInput label="Ninfas / metro" unit="/m" value={data.chinchesDano} onChange={v => set("chinchesDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Pulgones">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Colonias / planta" unit="/pl" value={data.pulgones} onChange={v => set("pulgones", v)} /><NumInput label="% plantas afect." unit="%" value={data.pulgonesDano} onChange={v => set("pulgonesDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Trips">
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}><NumInput label="Cantidad / hoja" unit="/hoja" value={data.trips} onChange={v => set("trips", v)} /><NumInput label="% plantas afect." unit="%" value={data.tripsDano} onChange={v => set("tripsDano", v)} /></div>
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Trips en flor" unit="/flor" value={data.tripsFlor} onChange={v => set("tripsFlor", v)} /><NumInput label="% flores afect." unit="%" value={data.tripsFlorDano} onChange={v => set("tripsFlorDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Arañuelas / Ácaros">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Focos detectados" value={data.aranhuelas} onChange={v => set("aranhuelas", v)} /><NumInput label="% hoja afectada" unit="%" value={data.aranhuelasDano} onChange={v => set("aranhuelasDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Chicharrita del maíz" scientific="Dalbulus maidis">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Adultos / planta" unit="/pl" value={data.chicharrita} onChange={v => set("chicharrita", v)} /><NumInput label="% plantas afect." unit="%" value={data.chicharritaDano} onChange={v => set("chicharritaDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Barrenador del tallo">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Plantas afect. / m" unit="/m" value={data.barrenador} onChange={v => set("barrenador", v)} /><NumInput label="% daño tallo" unit="%" value={data.barrenadorDano} onChange={v => set("barrenadorDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Cogollero">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Larvas / planta" unit="/pl" value={data.cogollero} onChange={v => set("cogollero", v)} /><NumInput label="% plantas afect." unit="%" value={data.cogolleroDano} onChange={v => set("cogolleroDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Mosca blanca">
            <div style={{ display: "flex", gap: 10 }}><NumInput label="Adultos / hoja" unit="/hoja" value={data.moscaBlanca} onChange={v => set("moscaBlanca", v)} /><NumInput label="% plantas afect." unit="%" value={data.moscaBlancaDano} onChange={v => set("moscaBlancaDano", v)} /></div>
          </PlagaRow>
          <PlagaRow title="Otra plaga" last>
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 2 }}><Label>Nombre</Label><input type="text" placeholder="Describir..." value={data.otraPlaga} onChange={e => set("otraPlaga", e.target.value)} style={inputBase} /></div>
              <NumInput label="Cantidad" value={data.otraPlagaCantidad} onChange={v => set("otraPlagaCantidad", v)} />
            </div>
          </PlagaRow>
        </SECTION>

        <SECTION title="ENFERMEDADES FOLIARES" icon="🦠">
          <div style={{ marginBottom: 14 }}><Label>Enfermedades detectadas</Label><CheckGrid items={ENFERMEDADES} selected={data.enfermedades} onChange={v => set("enfermedades", v)} /></div>
          {data.enfermedades.length > 0 && <div style={{ marginBottom: 12 }}><StarRating label="Intensidad / severidad" value={data.enfermedadIntensidad} onChange={v => set("enfermedadIntensidad", v)} /></div>}
          <TextArea label="Observaciones" value={data.enfermedadNota} onChange={v => set("enfermedadNota", v)} placeholder="Zona afectada, síntomas, avance..." />
        </SECTION>

        <SECTION title="ENFERMEDADES DE RAÍZ Y TALLO" icon="🌿">
          <div style={{ marginBottom: 14 }}><Label>Patógenos detectados</Label><CheckGrid items={ENFERMEDADES_RAIZ} selected={data.enfermedadesRaiz} onChange={v => set("enfermedadesRaiz", v)} /></div>
          {data.enfermedadesRaiz.length > 0 && <div style={{ marginBottom: 12 }}><StarRating label="Intensidad" value={data.enfermedadRaizIntensidad} onChange={v => set("enfermedadRaizIntensidad", v)} /></div>}
          <TextArea label="Observaciones" value={data.enfermedadRaizNota} onChange={v => set("enfermedadRaizNota", v)} placeholder="Síntomas, profundidad, distribución..." />
        </SECTION>

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

        <SECTION title="SUELO" icon="🟫">
          <Label>Humedad visual del suelo</Label>
          <ChipSelect options={HUMEDAD_SUELO} value={data.humedadSuelo} onChange={v => set("humedadSuelo", v)} />
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
                <div key={i} style={{ position: "relative", aspectRatio: "1", borderRadius: 10, overflow: "hidden", border: `1.5px solid ${C.border}` }}>
                  <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button onClick={() => setPhotos(prev => prev.filter((_, idx) => idx !== i))} style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", color: "#fff", fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                </div>
              ))}
            </div>
          )}
        </SECTION>

        <SECTION title="OBSERVACIONES Y RECOMENDACIONES" icon="📝">
          <div style={{ marginBottom: 12 }}><TextArea label="Observaciones generales" value={data.observaciones} onChange={v => set("observaciones", v)} placeholder="Todo lo que consideres importante para el administrador..." /></div>
          <TextArea label="Recomendaciones de manejo" value={data.recomendaciones} onChange={v => set("recomendaciones", v)} placeholder="Ej: Aplicar fungicida, repetir monitoreo en 7 días..." />
        </SECTION>

        <SECTION title="FIRMA DIGITAL" icon="✍️">
          {!firmaActiva && !firma && (
            <button onClick={() => setFirmaActiva(true)} style={{ width: "100%", border: `2px dashed ${C.borderStrong}`, borderRadius: 12, background: C.inputBg, padding: "18px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 28 }}>✍️</span>
              <span style={{ fontFamily: SANS, fontSize: 13, color: C.textDim }}>Tocar para firmar</span>
            </button>
          )}
          {firmaActiva && (
            <div>
              <div style={{ fontSize: 12, color: C.textDim, fontFamily: SANS, marginBottom: 8 }}>Firmá con el dedo en el recuadro</div>
              <canvas ref={canvasRef} width={370} height={120} style={{ width: "100%", height: 120, border: `1.5px solid ${C.accent}`, borderRadius: 10, background: "#fff", touchAction: "none", display: "block" }} />
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <button onClick={clearFirma} style={{ flex: 1, background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 10, fontFamily: SANS, fontSize: 13, color: C.textDim, cursor: "pointer" }}>Borrar</button>
                <button onClick={() => setFirmaActiva(false)} style={{ flex: 1, background: C.accentLight, border: `1.5px solid ${C.accent}`, borderRadius: 8, padding: 10, fontFamily: SANS, fontSize: 13, color: C.accentDark, fontWeight: 600, cursor: "pointer" }}>Confirmar firma</button>
              </div>
            </div>
          )}
          {!firmaActiva && firma && (
            <div>
              <img src={firma} alt="Firma" style={{ width: "100%", height: 80, objectFit: "contain", border: `1.5px solid ${C.accent}`, borderRadius: 10, background: "#fff" }} />
              <button onClick={() => { clearFirma(); setFirmaActiva(true); }} style={{ marginTop: 8, width: "100%", background: C.inputBg, border: `1.5px solid ${C.border}`, borderRadius: 8, padding: 9, fontFamily: SANS, fontSize: 13, color: C.textDim, cursor: "pointer" }}>Volver a firmar</button>
            </div>
          )}
        </SECTION>

      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: C.surface, borderTop: `1px solid ${C.border}`, padding: "14px 16px 24px", zIndex: 200 }}>
        {!canSubmit && <div style={{ fontFamily: SANS, fontSize: 12, color: C.warn, textAlign: "center", marginBottom: 10 }}>⚠ Completá Lote y Cultivo para enviar</div>}
        <button onClick={handleSubmit} disabled={!canSubmit}
          style={{ width: "100%", border: "none", borderRadius: 14, padding: "16px", fontFamily: FONT, fontSize: 14, fontWeight: 700, letterSpacing: 2, cursor: canSubmit ? "pointer" : "not-allowed", background: canSubmit ? C.accent : C.border, color: canSubmit ? "#fff" : C.textFaint, transition: "all 0.2s" }}>
          {`ENVIAR MONITOREO${photos.length > 0 ? ` · ${photos.length} FOTO${photos.length > 1 ? "S" : ""}` : ""}${firma ? " · FIRMADO ✓" : ""}`}
        </button>
      </div>
    </div>
  );
}
