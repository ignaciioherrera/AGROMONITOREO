// Ing. Agr. Ignacio Herrera Admin v2.1
import React, { useState, useEffect, useCallback, useRef } from "react";

const SUPABASE_URL = "https://izijmjntrpksmzuwvtle.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6aWptam50cnBrc216dXd2dGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2MTQyNjAsImV4cCI6MjA4OTE5MDI2MH0.hsG0v5xmM81lCMU1VvwHETFp8C9Al4OPxoSyuyfY_ks";

// ── LISTA MAESTRA DE EMPRESAS/CAMPOS/LOTES (estructura real de producción) ──
const EMPRESAS_MOV = [
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

// Obtiene un token válido, renovándolo si está por vencer
const getValidToken = async () => {
  const s = getStoredSession();
  if (!s?.access_token) return SUPABASE_KEY;
  // Si vence en menos de 2 minutos, refrescar antes de usar
  const expiresAt = s.expires_at ? s.expires_at * 1000 : 0;
  const minutosRestantes = (expiresAt - Date.now()) / 60000;
  if (minutosRestantes < 2 && s.refresh_token) {
    try {
      const r = await fetch(SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
        body: JSON.stringify({ refresh_token: s.refresh_token })
      });
      if (r.ok) {
        const newSession = await r.json();
        storeSession(newSession);
        return newSession.access_token;
      }
    } catch {}
  }
  return s.access_token || SUPABASE_KEY;
};

// ── LOGIN SCREEN ──────────────────────────────────────────────

// ── TAB ESTRUCTURA ────────────────────────────────────────────

// ── SIMULADOR DE RINDE ─────────────────────────────────────────
function SimuladorRinde({ planCultivos, filas, mbTotal, haTotalEmp, C, F, filtroCampana, campanaEmpresa, qqBaseOverride }) {
  const [open, setOpen] = React.useState(false);
  const [simVals, setSimVals] = React.useState({});
  const [simPrecios, setSimPrecios] = React.useState({}); // precio Rosario simulado por cultivo

  // Cultivos únicos con plantilla
  const cultivosUnicos = [...new Set(
    filas.map(f => f.guardado?.cultivo || f.cultivo).filter(Boolean)
  )].map(cultivo => {
    const plantilla = planCultivos.find(c =>
      c.cultivo === cultivo && (filtroCampana === "todas" || c.campana === campanaEmpresa || c.campana === filtroCampana)
    );
    const qqBasePlan = parseFloat(plantilla?.rendimiento_obj_qq) || 0;
    const qqBase = (qqBaseOverride && qqBaseOverride[cultivo]) ? parseFloat(qqBaseOverride[cultivo]) : qqBasePlan;
    // Ha de este cultivo específico
    const haCultivo = filas.reduce((s, f) => {
      const g = f.guardado || f;
      return (g?.cultivo === cultivo) ? s + (parseFloat(g.hectareas) || 0) : s;
    }, 0);
    const precioBase = parseFloat(plantilla?.precio_grano_usd) || 0;
    return { cultivo, qqBase, plantilla, qqBasePlan, haCultivo, precioBase };
  }).filter(c => c.qqBase > 0);

  if (cultivosUnicos.length === 0) return null;

  const simMap = Object.fromEntries(cultivosUnicos.map(c => [c.cultivo, simVals[c.cultivo] !== undefined ? simVals[c.cultivo] : c.qqBase]));

  // Calcular MB simulado total
  const calcMBSim = (p, simMap, planCultivos, filtroCampana, campanaEmpresa, simPrecios) => {
    const cultivoBuscar = p.cultivo || p.guardado?.cultivo || "";
    const plantilla = planCultivos.find(c => c.cultivo === cultivoBuscar && (filtroCampana === "todas" || c.campana === campanaEmpresa));
    const src = plantilla || p;
    const qqSim = simMap[cultivoBuscar] !== undefined ? simMap[cultivoBuscar] : (parseFloat(src.rendimiento_obj_qq) || 0);
    const precio = (simPrecios && simPrecios[cultivoBuscar] !== undefined) ? simPrecios[cultivoBuscar] : (parseFloat(src.precio_grano_usd) || 0);
    const flete = parseFloat(src.flete_usd) || 0;
    const pct = parseFloat(src.pct_comercializacion) || 2;
    const precioNeto = (precio - flete) * (1 - pct / 100);
    const ingresoHa = qqSim * precioNeto / 10;
    const costos = (parseFloat(src.costo_semilla_ha) || 0) + (parseFloat(src.costo_labores_ha) || 0) + (parseFloat(src.costo_agroquimicos_ha) || 0) + (parseFloat(src.costo_fertilizantes_ha) || 0) + (parseFloat(src.costo_cosecha_ha) || 0) + (parseFloat(src.costo_otros_ha) || 0);
    const plantillaSoja = planCultivos.find(c => c.cultivo?.toLowerCase().includes("soja 1") || c.cultivo?.toLowerCase() === "soja");
    const precioSoja = parseFloat(plantillaSoja?.precio_grano_usd) || 330;
    const tipoAlq = p.alquiler_tipo || (parseFloat(p.alquiler_pct) > 0 ? "pct" : "qq");
    let alquilerUsd = 0;
    if (tipoAlq === "pct") { alquilerUsd = qqSim * (parseFloat(p.alquiler_pct) || 0) / 100 * precio / 10; }
    else { alquilerUsd = (parseFloat(p.alquiler_qq_ha) || 0) * precioSoja / 10; }
    return { ingresoHa, costos, alquilerUsd, mbHa: ingresoHa - costos - alquilerUsd, precioNeto };
  };

  const mbSimTotal = filas.reduce((s, f) => {
    const g = f.guardado || f;
    if (!g?.cultivo) return s;
    const ha = parseFloat(g.hectareas) || 0;
    const r = calcMBSim(g, simMap, planCultivos, filtroCampana, campanaEmpresa, simPrecios);
    return s + r.mbHa * ha;
  }, 0);
  const mbSimDiff = mbSimTotal - mbTotal;
  const hasSim = Object.keys(simVals).length > 0;

  const COLORES = { "Soja 1ra": "#27ae60", "Soja 2da": "#2ecc71", "Soja 3ra": "#82e0aa", "Maíz": "#f39c12", "Trigo": "#e67e22", "Girasol": "#f1c40f", "Cebada": "#d4ac0d", "Sorgo": "#c0392b", "Algodón": "#85c1e9" };

  return (
    <div style={{ background: "#f0faf3", border: "1px solid #1f6b3530", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#1f6b35" }}>📈 Simulador de Rinde</span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>Variá el rinde y mirá cómo cambia el MB</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {hasSim && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontFamily: "'DM Mono',monospace", fontWeight: 700, color: mbSimTotal >= 0 ? "#1f6b35" : "#dc2626" }}>
                {mbSimTotal >= 0 ? "+" : ""}USD {Math.round(mbSimTotal).toLocaleString("es-AR")}
              </span>
              <span style={{ fontSize: 11, fontFamily: "'DM Mono',monospace", color: mbSimDiff >= 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                ({mbSimDiff >= 0 ? "+" : ""}{Math.round(mbSimDiff).toLocaleString("es-AR")})
              </span>
              <button onClick={() => { setSimVals({}); }} style={{ fontSize: 10, background: "none", border: "1px solid #e8eaed", borderRadius: 5, padding: "2px 8px", cursor: "pointer", color: "#9ca3af" }}>Reset</button>
            </div>
          )}
          <button onClick={() => setOpen(o => !o)}
            style={{ background: "#1f6b35", color: "#fff", border: "none", borderRadius: 7, padding: "5px 13px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            {open ? "▲ Cerrar" : "▼ Abrir"}
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12, marginBottom: 14 }}>
            {cultivosUnicos.map(({ cultivo, qqBase, plantilla, qqBasePlan, haCultivo, precioBase }) => {
              const sim = simVals[cultivo] !== undefined ? simVals[cultivo] : qqBase;
              const col = COLORES[cultivo] || "#1f6b35";
              const precio = (simPrecios[cultivo] !== undefined) ? simPrecios[cultivo] : (parseFloat(plantilla?.precio_grano_usd) || 0);
              const flete = parseFloat(plantilla?.flete_usd) || 0;
              const pct = parseFloat(plantilla?.pct_comercializacion) || 2;
              const precioNeto = (precio - flete) * (1 - pct / 100);
              const diffIngreso = (sim - qqBase) * precioNeto / 10;
              const qqMin = Math.max(0, Math.round(qqBase * 0.4));
              const qqMax = Math.round(qqBase * 1.8);
              const pctChange = qqBase > 0 ? ((sim - qqBase) / qqBase * 100).toFixed(0) : 0;
              return (
                <div key={cultivo} style={{ background: "#fff", borderRadius: 10, padding: "12px 14px", border: `1.5px solid ${col}30` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ background: col + "20", color: col, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{cultivo}</span>
                    <div style={{ textAlign: "right" }}><span style={{ fontSize: 11, color: "#9ca3af" }}>Base: {qqBase} qq/ha</span>{(qqBasePlan && qqBasePlan !== qqBase) ? <div style={{ fontSize: 10, color: "#9ca3af" }}>Obj: {qqBasePlan} qq/ha</div> : null}</div>
                  </div>
                  <input type="range" min={qqMin} max={qqMax} step={0.5} value={sim}
                    onChange={e => setSimVals(prev => ({ ...prev, [cultivo]: parseFloat(e.target.value) }))}
                    style={{ width: "100%", accentColor: col, cursor: "pointer", marginBottom: 4 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9ca3af", marginBottom: 8 }}>
                    <span>{qqMin} qq</span><span>{qqMax} qq</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: 20, fontWeight: 800, color: col, fontFamily: "'DM Mono',monospace" }}>{sim.toFixed(1)}</span>
                      <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 4 }}>qq/ha</span>
                      <span style={{ fontSize: 11, marginLeft: 8, color: sim > qqBase ? "#16a34a" : sim < qqBase ? "#dc2626" : "#9ca3af", fontWeight: 600 }}>
                        {sim > qqBase ? "+" : ""}{pctChange}%
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", fontWeight: 700, color: diffIngreso >= 0 ? "#16a34a" : "#dc2626" }}>
                        {diffIngreso >= 0 ? "+" : ""}{diffIngreso.toFixed(0)} USD/ha
                      </div>
                      <div style={{ fontSize: 10, color: "#9ca3af" }}>× {Math.round(haCultivo || haTotalEmp)} ha = {diffIngreso >= 0 ? "+" : ""}{Math.round(diffIngreso * (haCultivo || haTotalEmp)).toLocaleString("es-AR")} USD total</div>
                      <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:2 }}>
                        <span style={{ fontSize:10, color:"#9ca3af" }}>Rosario USD</span>
                        <input type="number"
                          value={simPrecios[cultivo] !== undefined ? simPrecios[cultivo] : precioBase}
                          onChange={e => setSimPrecios(prev => ({...prev, [cultivo]: parseFloat(e.target.value)||0}))}
                          style={{ width:60, fontSize:11, padding:"1px 4px", border:"1px solid #e8eaed", borderRadius:4, fontFamily:"'DM Mono',monospace", fontWeight:600 }}
                        />
                        <span style={{ fontSize:10, color:"#9ca3af" }}>/tn · neto: {precioNeto.toFixed(0)}</span>
                        {simPrecios[cultivo] !== undefined && simPrecios[cultivo] !== precioBase &&
                          <button onClick={()=>setSimPrecios(p=>{const n={...p};delete n[cultivo];return n;})}
                            style={{fontSize:9,background:"none",border:"none",cursor:"pointer",color:"#9ca3af"}}>↺</button>
                        }
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, height: 5, borderRadius: 3, background: "#f3f4f6", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 3, background: col, width: `${Math.min(100, (sim / qqMax) * 100)}%`, transition: "width 0.15s" }} />
                  </div>
                </div>
              );
            })}
          </div>
          {/* Resumen */}
          <div style={{ background: "#fff", borderRadius: 10, padding: "12px 16px", border: "1px solid #e8eaed", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>MB Real</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 15, color: mbTotal >= 0 ? "#1f6b35" : "#dc2626" }}>{mbTotal >= 0 ? "+" : ""}USD {Math.round(mbTotal).toLocaleString("es-AR")}</div>
            </div>
            <div style={{ fontSize: 20, color: "#9ca3af" }}>→</div>
            <div>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>MB Simulado</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 18, color: mbSimTotal >= 0 ? "#16a34a" : "#dc2626" }}>{mbSimTotal >= 0 ? "+" : ""}USD {Math.round(mbSimTotal).toLocaleString("es-AR")}</div>
            </div>
            <div style={{ borderLeft: "1px solid #e8eaed", paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Diferencia</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 15, color: mbSimDiff >= 0 ? "#16a34a" : "#dc2626" }}>{mbSimDiff >= 0 ? "+" : ""}USD {Math.round(mbSimDiff).toLocaleString("es-AR")}</div>
            </div>
            <div style={{ borderLeft: "1px solid #e8eaed", paddingLeft: 24 }}>
              <div style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>Por Ha afectada</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontWeight: 700, fontSize: 15, color: mbSimDiff >= 0 ? "#16a34a" : "#dc2626" }}>{mbSimDiff >= 0 ? "+" : ""}{haTotalEmp > 0 ? (mbSimDiff / haTotalEmp).toFixed(0) : 0} USD/ha</div>
              <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 2 }}>sobre {Math.round(haTotalEmp)} ha totales</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ── TOOLTIP ──────────────────────────────────────────────────
function Tip({ text, children, style }) {
  const [show, setShow] = React.useState(false);
  const [pos, setPos] = React.useState({ x: 0, y: 0 });
  const timer = React.useRef(null);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", ...style }}
      onMouseEnter={e => { const r = e.currentTarget.getBoundingClientRect(); setPos({ x: r.left, y: r.top }); timer.current = setTimeout(() => setShow(true), 600); }}
      onMouseLeave={() => { clearTimeout(timer.current); setShow(false); }}>
      {children}
      {show && (
        <span style={{
          position: "fixed", left: Math.min(pos.x, window.innerWidth - 300), top: pos.y + 20, zIndex: 9999,
          background: "#111827", color: "#f9fafb", fontSize: 11, fontWeight: 500,
          padding: "7px 12px", borderRadius: 7, whiteSpace: "normal",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)", pointerEvents: "none",
          fontFamily: "'DM Sans', sans-serif", maxWidth: 280, lineHeight: 1.5,
        }}>{text}</span>
      )}
    </span>
  );
}

function TabEstructura({ estructuraLotes, fetchEstructura, session, aplicaciones, st, inputSt, labelSt, C, F, SANS, SUPABASE_URL, SUPABASE_KEY }) {
  const tok = session?.access_token || SUPABASE_KEY;
  const EMPRESAS_EST = ["HERRERA IGNACIO","AGROCORSI","BERTOLI VARRONE","FERNANDO PIGHIN 2","GIANFRANCO BERTOLI","GREGORET HNOS","SIGOTO/GOROSITO/BERTOLI","VACHETTA JORGE"];
  const [estEmpresa, setEstEmpresa] = React.useState(EMPRESAS_EST[0]);
  const [estSaving, setEstSaving] = React.useState(false);
  const [estMsg, setEstMsg] = React.useState("");
  const [newEstLote, setNewEstLote] = React.useState({ campo_nombre:"", lote_nombre:"", hectareas:"", tenencia:"PROPIO", alquiler_tipo:"qq_soja", alquiler_qq_ha:"", alquiler_pct:"" });
  const fileEstrRef = React.useRef(null);
  const [estTab, setEstTab] = React.useState("lotes");
  // costos
  const [costosData, setCostosData] = React.useState([]);
  const [costosCargando, setCostosCargando] = React.useState(false);
  const [costosMsg, setCostosMsg] = React.useState("");
  const [newCosto, setNewCosto] = React.useState({ cultivo:"", campana:"2024/25", labor_siembra_ha:"", curasemilla_ha:"", labor_cosecha_ha:"", notas:"" });
  const [editandoCosto, setEditandoCosto] = React.useState(null);
  const CULTIVOS_OP = ["Soja","Maíz","Girasol","Sorgo","Trigo","Cebada","Garbanzo","Maní"];
  const CAMPANAS_OP = ["2024/25","2025/26","2026/27","2023/24"];
  const fetchCostos = React.useCallback(async () => {
    setCostosCargando(true);
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/costos_produccion?empresa_nombre=eq.${encodeURIComponent(estEmpresa)}&order=cultivo.asc,campana.desc`,
        { headers:{ apikey:SUPABASE_KEY, Authorization:`Bearer ${tok}` }});
      const d = await r.json(); setCostosData(Array.isArray(d)?d:[]);
    } catch { setCostosData([]); }
    setCostosCargando(false);
  }, [estEmpresa,tok]);
  React.useEffect(()=>{ if(estTab==="costos") fetchCostos(); },[estTab,estEmpresa,fetchCostos]);
  const saveCosto = async (data, existingId) => {
    if(!data.cultivo?.trim()||!data.campana?.trim()){ setCostosMsg("⚠ Completá cultivo y campaña"); setTimeout(()=>setCostosMsg(""),2500); return; }
    const body={ empresa_nombre:estEmpresa, cultivo:data.cultivo.trim(), campana:data.campana.trim(),
      labor_siembra_ha:parseFloat(data.labor_siembra_ha)||0, curasemilla_ha:parseFloat(data.curasemilla_ha)||0,
      labor_cosecha_ha:parseFloat(data.labor_cosecha_ha)||0, notas:data.notas||"" };
    try {
      if(existingId){ await fetch(`${SUPABASE_URL}/rest/v1/costos_produccion?id=eq.${existingId}`,{method:"PATCH",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},body:JSON.stringify(body)}); }
      else { await fetch(`${SUPABASE_URL}/rest/v1/costos_produccion`,{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"resolution=merge-duplicates,return=minimal"},body:JSON.stringify(body)}); }
      await fetchCostos(); setCostosMsg("✓ Guardado"); setTimeout(()=>setCostosMsg(""),2000);
    } catch { setCostosMsg("⚠ Error"); setTimeout(()=>setCostosMsg(""),2500); }
  };
  const deleteCosto = async(id)=>{ if(!window.confirm("¿Eliminar?")) return; await fetch(`${SUPABASE_URL}/rest/v1/costos_produccion?id=eq.${id}`,{method:"DELETE",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`}}); fetchCostos(); };
  // semillas
  const [semillasData, setSemillasData] = React.useState([]);
  const [semillasCargando, setSemillasCargando] = React.useState(false);
  const [semillasMsg, setSemillasMsg] = React.useState("");
  const [semillasCampana, setSemillasCampana] = React.useState("2024/25");
  const [newSemilla, setNewSemilla] = React.useState({ campo_nombre:"", lote_nombre:"", campana:"2024/25", hibrido_variedad:"", semilla_ha:"", pct_lote:"100" });
  const [editandoSemilla, setEditandoSemilla] = React.useState(null);
  const [semModoMasivo, setSemModoMasivo] = React.useState(false);
  const [semLotesSeleccionados, setSemLotesSeleccionados] = React.useState([]);
  const fetchSemillas = React.useCallback(async()=>{
    setSemillasCargando(true);
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/lotes_semillas?empresa_nombre=eq.${encodeURIComponent(estEmpresa)}&order=campo_nombre.asc,lote_nombre.asc,campana.desc`,
        {headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`}});
      const d = await r.json(); setSemillasData(Array.isArray(d)?d:[]);
    } catch { setSemillasData([]); }
    setSemillasCargando(false);
  },[estEmpresa,tok]);
  React.useEffect(()=>{ if(estTab==="semillas") fetchSemillas(); },[estTab,estEmpresa,fetchSemillas]);
  const saveSemilla = async(data, existingId)=>{
    if(!data.campo_nombre?.trim()||!data.lote_nombre?.trim()||!data.campana?.trim()){ setSemillasMsg("⚠ Completá campo, lote y campaña"); setTimeout(()=>setSemillasMsg(""),2500); return; }
    const body={empresa_nombre:estEmpresa,campo_nombre:data.campo_nombre.trim(),lote_nombre:data.lote_nombre.trim(),campana:data.campana.trim(),hibrido_variedad:data.hibrido_variedad?.trim()||"",semilla_ha:parseFloat(data.semilla_ha)||0,pct_lote:parseFloat(data.pct_lote)||100};
    try {
      if(existingId){ await fetch(`${SUPABASE_URL}/rest/v1/lotes_semillas?id=eq.${existingId}`,{method:"PATCH",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},body:JSON.stringify(body)}); }
      else { await fetch(`${SUPABASE_URL}/rest/v1/lotes_semillas`,{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},body:JSON.stringify(body)}); }
      await fetchSemillas(); setSemillasMsg("✓ Guardado"); setTimeout(()=>setSemillasMsg(""),2000);
    } catch { setSemillasMsg("⚠ Error"); setTimeout(()=>setSemillasMsg(""),2500); }
  };
  const deleteSemilla = async(id)=>{ if(!window.confirm("¿Eliminar?")) return; await fetch(`${SUPABASE_URL}/rest/v1/lotes_semillas?id=eq.${id}`,{method:"DELETE",headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`}}); fetchSemillas(); };

  const lotesEmpresa = estructuraLotes.filter(e => e.empresa_nombre === estEmpresa);
  const camposEmpresa = [...new Set(lotesEmpresa.map(e => e.campo_nombre))].sort();
  const haTotal = lotesEmpresa.reduce((s,e) => s+(parseFloat(e.hectareas)||0), 0);

  const saveEstrLote = async (data) => {
    if (!data.campo_nombre?.trim() || !data.lote_nombre?.trim()) { setEstMsg("⚠ Completá campo y lote"); setTimeout(()=>setEstMsg(""),2500); return; }
    setEstSaving(true);
    try {
      const body = {
        empresa_nombre: estEmpresa,
        campo_nombre: data.campo_nombre.trim(),
        lote_nombre: data.lote_nombre.trim(),
        hectareas: parseFloat(data.hectareas)||null,
        tenencia: data.tenencia||"PROPIO",
        alquiler_tipo: data.alquiler_tipo||"qq_soja",
        alquiler_qq_ha: data.alquiler_tipo==="qq_soja" ? parseFloat(data.alquiler_qq_ha)||0 : 0,
        alquiler_pct: data.alquiler_tipo==="pct_cultivo" ? parseFloat(data.alquiler_pct)||0 : 0,
      };
      const existing = estructuraLotes.find(e => e.empresa_nombre===estEmpresa && e.campo_nombre===body.campo_nombre && String(e.lote_nombre)===String(body.lote_nombre));
      if (existing) {
        await fetch(`${SUPABASE_URL}/rest/v1/estructura_lotes?id=eq.${existing.id}`, {
          method:"PATCH", headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},
          body: JSON.stringify(body)
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/estructura_lotes`, {
          method:"POST", headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},
          body: JSON.stringify(body)
        });
      }
      await fetchEstructura();
      setEstMsg("✓ Guardado"); setTimeout(()=>setEstMsg(""),2000);
    } finally { setEstSaving(false); }
  };

  const deleteEstrLote = async (id) => {
    if (!window.confirm("¿Eliminar este lote de la estructura?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/estructura_lotes?id=eq.${id}`, {
      method:"DELETE", headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`}
    });
    fetchEstructura();
  };

  const patchLote = async (id, patch) => {
    await fetch(`${SUPABASE_URL}/rest/v1/estructura_lotes?id=eq.${id}`, {
      method:"PATCH", headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},
      body: JSON.stringify(patch)
    });
    fetchEstructura();
  };

  const importarEstrExcel = async (file) => {
    const XLSX = await new Promise((res,rej)=>{ if(window.XLSX){res(window.XLSX);return;} const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; s.onload=()=>res(window.XLSX); s.onerror=rej; document.head.appendChild(s); });
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, {type:"array"});
    let ok=0, err=0, errores=[];
    for (const sheetName of wb.SheetNames) {
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, {header:1, defval:null});
      if (!rows || rows.length<2) continue;
      const headers = (rows[0]||[]).map(h=>String(h||"").trim().toLowerCase());
      const ci = n => headers.findIndex(h=>h.includes(n));
      const iEmp=ci("empresa"), iCamp=ci("campo"), iLote=ci("lote"), iHa=ci("ha"), iTen=ci("tenencia"), iAlqT=ci("tipo"), iQq=ci("qq"), iPct=ci("pct");
      for (let i=1; i<rows.length; i++) {
        const r=rows[i]; if(!r) continue;
        const d = {
          empresa_nombre: iEmp>=0&&r[iEmp] ? String(r[iEmp]).trim() : estEmpresa,
          campo_nombre:   iCamp>=0&&r[iCamp] ? String(r[iCamp]).trim() : "",
          lote_nombre:    iLote>=0&&r[iLote]!=null ? String(r[iLote]).trim() : "",
          hectareas:      iHa>=0 ? parseFloat(r[iHa])||null : null,
          tenencia:       iTen>=0&&r[iTen] ? String(r[iTen]).trim().toUpperCase() : "PROPIO",
          alquiler_tipo:  iAlqT>=0&&r[iAlqT] ? (String(r[iAlqT]).toLowerCase().includes("pct")||String(r[iAlqT]).includes("%") ? "pct_cultivo" : "qq_soja") : "qq_soja",
          alquiler_qq_ha: iQq>=0 ? parseFloat(r[iQq])||0 : 0,
          alquiler_pct:   iPct>=0 ? parseFloat(r[iPct])||0 : 0,
        };
        if (!d.campo_nombre||!d.lote_nombre) { errores.push(`Fila ${i+1}: falta campo o lote`); err++; continue; }
        const existing = estructuraLotes.find(e=>e.empresa_nombre===d.empresa_nombre&&e.campo_nombre===d.campo_nombre&&String(e.lote_nombre)===String(d.lote_nombre));
        let res;
        if (existing) {
          res = await fetch(`${SUPABASE_URL}/rest/v1/estructura_lotes?id=eq.${existing.id}`,{method:"PATCH",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},body:JSON.stringify(d)});
        } else {
          res = await fetch(`${SUPABASE_URL}/rest/v1/estructura_lotes`,{method:"POST",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},body:JSON.stringify(d)});
        }
        if(res.ok) ok++;
        else {
          const errTxt = await res.text();
          let errMsg = errTxt;
          try { const j=JSON.parse(errTxt); errMsg=j.message||j.hint||j.details||errTxt; } catch {}
          errores.push(`Fila ${i+1} — ${d.empresa_nombre} · ${d.campo_nombre} · ${d.lote_nombre}: ${errMsg}`);
          err++;
        }
      }
    }
    await fetchEstructura();
    const msgBase = `✅ ${ok} lotes importados`;
    const msgErr = err>0 ? `\n⚠ ${err} errores:\n${errores.join("\n")}` : "";
    alert(msgBase + msgErr);
  };

  const descargarPlantilla = async () => {
    const XLSX = await new Promise((res,rej)=>{ if(window.XLSX){res(window.XLSX);return;} const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; s.onload=()=>res(window.XLSX); s.onerror=rej; document.head.appendChild(s); });
    const ws = XLSX.utils.aoa_to_sheet([
      ["EMPRESA","CAMPO","LOTE","HA","TENENCIA","TIPO ALQUILER","QQ SOJA/HA","% APARCERIA"],
      ["HERRERA IGNACIO","LASTRA","1",120,"PROPIO","qq_soja",0,0],
      ["HERRERA IGNACIO","LASTRA","2",85,"ALQUILADO","qq_soja",8,0],
      ["FERNANDO PIGHIN 2","EST. EL PROGRESO","LOTE 1",222,"ALQUILADO","pct_cultivo",0,33],
    ]);
    ws["!cols"]=[{wch:22},{wch:18},{wch:14},{wch:8},{wch:12},{wch:14},{wch:12},{wch:12}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Estructura");
    XLSX.writeFile(wb,"plantilla_estructura.xlsx");
  };

  const fldNum=(label,key,obj,setObj,w=90)=>(<div><label style={labelSt}>{label}</label><input type="number" value={obj[key]} onChange={e=>setObj(p=>({...p,[key]:e.target.value}))} placeholder="0" style={{...inputSt,margin:0,width:w}}/></div>);
  return (
    <div style={{animation:"fadeIn 0.3s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16,flexWrap:"wrap",gap:12}}>
        <div><h2 style={st.sectionTitle}>🏗 Estructura de Empresas</h2></div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <input type="file" accept=".xlsx,.xls" ref={fileEstrRef} style={{display:"none"}}
            onChange={e=>{if(e.target.files[0]){importarEstrExcel(e.target.files[0]);e.target.value="";}}} />
          {estTab==="lotes" && <><button onClick={()=>fileEstrRef.current?.click()} style={{...st.btnPrimary,background:"#2980b9",fontSize:12}}>📥 Importar Excel</button><button onClick={descargarPlantilla} style={{...st.btnSecondary,fontSize:12}}>📋 Plantilla</button></>}
        </div>
      </div>
      <div style={{display:"flex",gap:2,marginBottom:18,borderBottom:`2px solid ${C.border}`}}>
        {[["lotes","📋 Lotes / Ha / Alquiler"],["costos","💰 Costos de Producción"],["semillas","🌱 Semillas por Lote"]].map(([key,label])=>(
          <button key={key} onClick={()=>setEstTab(key)} style={{background:"none",border:"none",borderBottom:estTab===key?`2px solid ${C.accent}`:"2px solid transparent",marginBottom:-2,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:estTab===key?700:400,color:estTab===key?C.accent:C.textDim,transition:"all 0.15s"}}>{label}</button>
        ))}
      </div>

      {estTab==="lotes" && (
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
        {/* Sidebar */}
        <div style={{...st.card,padding:0,overflow:"hidden",alignSelf:"start"}}>
          <div style={{padding:"10px 14px",fontSize:11,fontFamily:F,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1,background:C.mutedBg,borderBottom:`1px solid ${C.border}`}}>Empresas</div>
          {EMPRESAS_EST.map(emp => {
            const cnt = estructuraLotes.filter(e=>e.empresa_nombre===emp).length;
            const haEmp = estructuraLotes.filter(e=>e.empresa_nombre===emp).reduce((s,e)=>s+(parseFloat(e.hectareas)||0),0);
            return (
              <button key={emp} onClick={()=>setEstEmpresa(emp)}
                style={{width:"100%",textAlign:"left",padding:"10px 14px",border:"none",borderBottom:`1px solid ${C.border}`,
                  background:estEmpresa===emp?C.accentLight:"transparent",
                  color:estEmpresa===emp?C.accent:C.text,
                  fontWeight:estEmpresa===emp?700:400,cursor:"pointer",fontSize:12}}>
                <div>{emp}</div>
                <div style={{fontSize:10,color:estEmpresa===emp?C.accent:C.muted,marginTop:2}}>
                  {cnt>0 ? `${cnt} lotes · ${Math.round(haEmp).toLocaleString("es-AR")} ha` : "Sin datos"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Panel derecho */}
        <div>
          {lotesEmpresa.length > 0 && (
            <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
              {[["Lotes",lotesEmpresa.length,C.text],["Hectáreas",Math.round(haTotal).toLocaleString("es-AR")+" ha",C.accent],["Campos",camposEmpresa.length,C.textDim],["Alquilados",lotesEmpresa.filter(e=>e.tenencia==="ALQUILADO").length,C.warn]].map(([label,val,color])=>(
                <div key={label} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"10px 16px",minWidth:100}}>
                  <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:0.5}}>{label}</div>
                  <div style={{fontSize:18,fontWeight:700,color,fontFamily:F}}>{val}</div>
                </div>
              ))}
            </div>
          )}

          {camposEmpresa.map(campo => {
            const lotesC = lotesEmpresa.filter(e=>e.campo_nombre===campo);
            const haC = lotesC.reduce((s,e)=>s+(parseFloat(e.hectareas)||0),0);
            return (
              <div key={campo} style={{...st.card,padding:0,overflow:"hidden",marginBottom:14}}>
                <div style={{padding:"10px 16px",background:C.mutedBg,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:13,fontWeight:700,color:C.text}}>{campo}</span>
                  <span style={{fontSize:11,color:C.muted}}>{lotesC.length} lotes · {Math.round(haC).toLocaleString("es-AR")} ha</span>
                </div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:C.mutedBg}}>
                      {["LOTE","HA","TENENCIA","TIPO ALQUILER","VALOR",""].map(h=><th key={h} style={st.th}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {lotesC.map((e,i)=>(
                      <tr key={e.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.mutedBg+"40"}}>
                        <td style={st.td}>
                          <input type="text" defaultValue={e.lote_nombre}
                            onBlur={ev=>{const v=ev.target.value.trim(); if(v&&v!==e.lote_nombre) patchLote(e.id,{lote_nombre:v});}}
                            style={{...inputSt,margin:0,padding:"2px 6px",width:120,fontSize:12,fontWeight:700}} />
                        </td>
                        <td style={st.td}>
                          <input type="number" defaultValue={e.hectareas||""}
                            onBlur={ev=>{const v=parseFloat(ev.target.value)||null; patchLote(e.id,{hectareas:v});}}
                            style={{...inputSt,margin:0,padding:"2px 6px",width:70,fontSize:12}} />
                        </td>
                        <td style={st.td}>
                          <select defaultValue={e.tenencia||"PROPIO"}
                            onChange={ev=>patchLote(e.id,{tenencia:ev.target.value})}
                            style={{...inputSt,margin:0,padding:"2px 6px",width:100,fontSize:11,cursor:"pointer"}}>
                            <option value="PROPIO">Propio</option>
                            <option value="ALQUILADO">Alquilado</option>
                          </select>
                        </td>
                        <td style={st.td}>
                          <select defaultValue={e.alquiler_tipo||"qq_soja"}
                            onChange={ev=>patchLote(e.id,{alquiler_tipo:ev.target.value})}
                            style={{...inputSt,margin:0,padding:"2px 6px",width:130,fontSize:11,cursor:"pointer"}}>
                            <option value="qq_soja">Arrend. qq soja/ha</option>
                            <option value="pct_cultivo">Aparcería %</option>
                          </select>
                        </td>
                        <td style={st.td}>
                          <input type="number"
                            defaultValue={e.alquiler_tipo==="pct_cultivo"?(e.alquiler_pct||""):(e.alquiler_qq_ha||"")}
                            placeholder={e.alquiler_tipo==="pct_cultivo"?"%":"qq"}
                            onBlur={ev=>{const v=parseFloat(ev.target.value)||0; const patch=e.alquiler_tipo==="pct_cultivo"?{alquiler_pct:v,alquiler_qq_ha:0}:{alquiler_qq_ha:v,alquiler_pct:0}; patchLote(e.id,patch);}}
                            style={{...inputSt,margin:0,padding:"2px 6px",width:70,fontSize:12}} />
                        </td>
                        <td style={{...st.td,textAlign:"center"}}>
                          <button onClick={()=>deleteEstrLote(e.id)}
                            style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:14,opacity:0.6,padding:"2px 6px"}}
                            onMouseEnter={ev=>ev.currentTarget.style.opacity="1"}
                            onMouseLeave={ev=>ev.currentTarget.style.opacity="0.6"}>🗑</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}

          {/* Form agregar lote */}
          <div style={{...st.card,border:`1px dashed ${C.accent}50`,background:C.accentLight+"60"}}>
            <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:14,fontFamily:F,textTransform:"uppercase",letterSpacing:1}}>+ Agregar Lote — {estEmpresa}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10}}>
              <div>
                <label style={labelSt}>Campo</label>
                <input type="text" list="campos-est-list" value={newEstLote.campo_nombre}
                  onChange={e=>setNewEstLote(p=>({...p,campo_nombre:e.target.value}))}
                  placeholder="Nombre del campo" style={{...inputSt,margin:0}} />
                <datalist id="campos-est-list">{camposEmpresa.map(c=><option key={c} value={c}/>)}</datalist>
              </div>
              <div>
                <label style={labelSt}>Lote</label>
                <input type="text" value={newEstLote.lote_nombre}
                  onChange={e=>setNewEstLote(p=>({...p,lote_nombre:e.target.value}))}
                  placeholder="Nombre del lote" style={{...inputSt,margin:0}} />
              </div>
              <div>
                <label style={labelSt}>Hectáreas</label>
                <input type="number" value={newEstLote.hectareas}
                  onChange={e=>setNewEstLote(p=>({...p,hectareas:e.target.value}))}
                  placeholder="ha" style={{...inputSt,margin:0}} />
              </div>
              <div>
                <label style={labelSt}>Tenencia</label>
                <select value={newEstLote.tenencia} onChange={e=>setNewEstLote(p=>({...p,tenencia:e.target.value}))}
                  style={{...inputSt,margin:0,cursor:"pointer"}}>
                  <option value="PROPIO">Propio</option>
                  <option value="ALQUILADO">Alquilado</option>
                </select>
              </div>
              <div>
                <label style={labelSt}>Tipo alquiler</label>
                <select value={newEstLote.alquiler_tipo} onChange={e=>setNewEstLote(p=>({...p,alquiler_tipo:e.target.value}))}
                  style={{...inputSt,margin:0,cursor:"pointer"}}>
                  <option value="qq_soja">Arrend. qq soja/ha</option>
                  <option value="pct_cultivo">Aparcería %</option>
                </select>
              </div>
              <div>
                <label style={labelSt}>{newEstLote.alquiler_tipo==="pct_cultivo"?"% Aparcería":"QQ soja/ha"}</label>
                <input type="number"
                  value={newEstLote.alquiler_tipo==="pct_cultivo"?newEstLote.alquiler_pct:newEstLote.alquiler_qq_ha}
                  onChange={e=>setNewEstLote(p=>newEstLote.alquiler_tipo==="pct_cultivo"?{...p,alquiler_pct:e.target.value}:{...p,alquiler_qq_ha:e.target.value})}
                  placeholder={newEstLote.alquiler_tipo==="pct_cultivo"?"%":"qq"} style={{...inputSt,margin:0}} />
              </div>
            </div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button onClick={async()=>{ await saveEstrLote(newEstLote); setNewEstLote({campo_nombre:"",lote_nombre:"",hectareas:"",tenencia:"PROPIO",alquiler_tipo:"qq_soja",alquiler_qq_ha:"",alquiler_pct:""}); }}
                disabled={estSaving}
                style={{...st.btnPrimary,opacity:estSaving?0.6:1}}>
                {estSaving?"⏳ Guardando...":"💾 Agregar lote"}
              </button>
              {estMsg && <span style={{fontSize:13,color:estMsg.startsWith("✓")?C.accent:C.warn,fontWeight:600}}>{estMsg}</span>}
            </div>
          </div>
        </div>
      </div>
      )}

      {estTab==="costos" && (
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
        <div style={{...st.card,padding:0,overflow:"hidden",alignSelf:"start"}}>
          <div style={{padding:"10px 14px",fontSize:11,fontFamily:F,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1,background:C.mutedBg,borderBottom:`1px solid ${C.border}`}}>Empresas</div>
          {EMPRESAS_EST.map(emp=>{const cnt=costosData.filter(c=>c.empresa_nombre===emp).length; return(<button key={emp} onClick={()=>setEstEmpresa(emp)} style={{width:"100%",textAlign:"left",padding:"10px 14px",border:"none",borderBottom:`1px solid ${C.border}`,background:estEmpresa===emp?C.accentLight:"transparent",color:estEmpresa===emp?C.accent:C.text,fontWeight:estEmpresa===emp?700:400,cursor:"pointer",fontSize:12}}><div>{emp}</div><div style={{fontSize:10,color:estEmpresa===emp?C.accent:C.muted,marginTop:2}}>{cnt>0?`${cnt} registros`:"Sin datos"}</div></button>);})}
        </div>
        <div>
          {costosCargando?<div style={{color:C.muted,padding:20}}>⏳ Cargando...</div>:(<>
            {costosData.length>0&&(<div style={{...st.card,padding:0,overflow:"hidden",marginBottom:16}}>
              <div style={{padding:"10px 16px",background:C.mutedBg,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:700,color:C.text}}>Costos — {estEmpresa}</span><span style={{fontSize:11,color:C.muted}}>{costosData.length} registros</span></div>
              <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                <thead><tr style={{background:C.mutedBg}}>{["CULTIVO","CAMPAÑA","LAB.SIEMBRA","CURA","LAB.COSECHA","TOTAL",""].map(h=><th key={h} style={st.th}>{h}</th>)}</tr></thead>
                <tbody>{costosData.map((c,i)=>{
                  const tot=(parseFloat(c.labor_siembra_ha)||0)+(parseFloat(c.curasemilla_ha)||0)+(parseFloat(c.labor_cosecha_ha)||0);
                  const isEdit=editandoCosto?.id===c.id;
                  return(<tr key={c.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.mutedBg+"40"}}>
                    {isEdit?(<>
                      <td style={st.td}><select value={editandoCosto.cultivo} onChange={e=>setEditandoCosto(p=>({...p,cultivo:e.target.value}))} style={{...inputSt,margin:0,padding:"2px 4px",width:90,fontSize:11}}>{CULTIVOS_OP.map(x=><option key={x}>{x}</option>)}</select></td>
                      <td style={st.td}><select value={editandoCosto.campana} onChange={e=>setEditandoCosto(p=>({...p,campana:e.target.value}))} style={{...inputSt,margin:0,padding:"2px 4px",width:80,fontSize:11}}>{CAMPANAS_OP.map(x=><option key={x}>{x}</option>)}</select></td>
                      {["labor_siembra_ha","curasemilla_ha","labor_cosecha_ha"].map(k=>(<td key={k} style={st.td}><input type="number" value={editandoCosto[k]} onChange={e=>setEditandoCosto(p=>({...p,[k]:e.target.value}))} style={{...inputSt,margin:0,padding:"2px 4px",width:72,fontSize:12}}/></td>))}
                      <td style={{...st.td,fontFamily:F,fontWeight:700,color:C.accent}}>${tot.toFixed(0)}</td>
                      <td style={{...st.td,display:"flex",gap:4}}>
                        <button onClick={async()=>{await saveCosto(editandoCosto,editandoCosto.id);setEditandoCosto(null);}} style={{...st.btnPrimary,padding:"2px 8px",fontSize:11}}>✓</button>
                        <button onClick={()=>setEditandoCosto(null)} style={{...st.btnSecondary,padding:"2px 8px",fontSize:11}}>✕</button>
                      </td>
                    </>):(<>
                      <td style={{...st.td,fontWeight:600}}>{c.cultivo}</td>
                      <td style={{...st.td,color:C.muted}}>{c.campana}</td>
                      <td style={{...st.td,fontFamily:F}}>${parseFloat(c.labor_siembra_ha||0).toFixed(0)}</td>
                      <td style={{...st.td,fontFamily:F}}>${parseFloat(c.curasemilla_ha||0).toFixed(0)}</td>
                      <td style={{...st.td,fontFamily:F}}>${parseFloat(c.labor_cosecha_ha||0).toFixed(0)}</td>
                      <td style={{...st.td,fontFamily:F,fontWeight:700,color:C.accent}}>${tot.toFixed(0)}</td>
                      <td style={{...st.td,display:"flex",gap:4}}>
                        <button onClick={()=>setEditandoCosto({...c})} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:11,color:C.textDim}}>✏</button>
                        <button onClick={()=>deleteCosto(c.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:14,opacity:0.6}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.6"}>🗑</button>
                      </td>
                    </>)}
                  </tr>);
                })}</tbody>
              </table></div>
            </div>)}
            <div style={{...st.card,border:`1px dashed ${C.accent}50`,background:C.accentLight+"60"}}>
              <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:14,fontFamily:F,textTransform:"uppercase",letterSpacing:1}}>+ Agregar Costos — {estEmpresa}</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:10,marginBottom:12}}>
                <div><label style={labelSt}>Cultivo</label><select value={newCosto.cultivo} onChange={e=>setNewCosto(p=>({...p,cultivo:e.target.value}))} style={{...inputSt,margin:0,cursor:"pointer"}}><option value="">— Seleccioná —</option>{CULTIVOS_OP.map(c=><option key={c}>{c}</option>)}</select></div>
                <div><label style={labelSt}>Campaña</label><select value={newCosto.campana} onChange={e=>setNewCosto(p=>({...p,campana:e.target.value}))} style={{...inputSt,margin:0,cursor:"pointer"}}>{CAMPANAS_OP.map(c=><option key={c}>{c}</option>)}</select></div>
                {fldNum("Labor Siembra (USD/ha)","labor_siembra_ha",newCosto,setNewCosto)}
                {fldNum("Curasemilla (USD/ha)","curasemilla_ha",newCosto,setNewCosto)}
                {fldNum("Labor Cosecha (USD/ha)","labor_cosecha_ha",newCosto,setNewCosto)}
                <div><label style={labelSt}>Notas</label><input type="text" value={newCosto.notas} onChange={e=>setNewCosto(p=>({...p,notas:e.target.value}))} placeholder="Opcional" style={{...inputSt,margin:0}}/></div>
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <button onClick={async()=>{await saveCosto(newCosto,null);setNewCosto({cultivo:"",campana:"2024/25",labor_siembra_ha:"",curasemilla_ha:"",labor_cosecha_ha:"",notas:""});}} style={st.btnPrimary}>💾 Guardar costos</button>
                {costosMsg&&<span style={{fontSize:13,color:costosMsg.startsWith("✓")?C.accent:C.warn,fontWeight:600}}>{costosMsg}</span>}
              </div>
            </div>
          </>)}
        </div>
      </div>
      )}

      {estTab==="semillas" && (
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
        <div style={{...st.card,padding:0,overflow:"hidden",alignSelf:"start"}}>
          <div style={{padding:"10px 14px",fontSize:11,fontFamily:F,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:1,background:C.mutedBg,borderBottom:`1px solid ${C.border}`}}>Empresas</div>
          {EMPRESAS_EST.map(emp=>{const cnt=semillasData.filter(s=>s.empresa_nombre===emp).length; return(<button key={emp} onClick={()=>setEstEmpresa(emp)} style={{width:"100%",textAlign:"left",padding:"10px 14px",border:"none",borderBottom:`1px solid ${C.border}`,background:estEmpresa===emp?C.accentLight:"transparent",color:estEmpresa===emp?C.accent:C.text,fontWeight:estEmpresa===emp?700:400,cursor:"pointer",fontSize:12}}><div>{emp}</div><div style={{fontSize:10,color:estEmpresa===emp?C.accent:C.muted,marginTop:2}}>{cnt>0?`${cnt} lotes`:"Sin datos"}</div></button>);})}
        </div>
        <div>
          {semillasCargando?<div style={{color:C.muted,padding:20}}>⏳ Cargando...</div>:(<>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{fontSize:12,color:C.muted}}>Campaña:</span>
              {CAMPANAS_OP.map(c=>(<button key={c} onClick={()=>setSemillasCampana(c)} style={{padding:"3px 12px",borderRadius:20,border:`1px solid ${semillasCampana===c?C.accent:C.border}`,background:semillasCampana===c?C.accentLight:"transparent",color:semillasCampana===c?C.accent:C.textDim,fontSize:12,cursor:"pointer"}}>{c}</button>))}
            </div>
            {(()=>{
              const filtradas=semillasData.filter(s=>s.campana===semillasCampana);
              const campos=[...new Set(filtradas.map(s=>s.campo_nombre))].sort();
              if(filtradas.length===0) return(<div style={{...st.card,color:C.muted,textAlign:"center",padding:24,fontSize:13}}>Sin datos para campaña {semillasCampana}.</div>);
              return campos.map(campo=>{
                const lotsC=filtradas.filter(s=>s.campo_nombre===campo);
                return(<div key={campo} style={{...st.card,padding:0,overflow:"hidden",marginBottom:14}}>
                  <div style={{padding:"10px 16px",background:C.mutedBg,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:700,color:C.text}}>{campo}</span><span style={{fontSize:11,color:C.muted}}>{lotsC.length} lotes</span></div>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                    <thead><tr style={{background:C.mutedBg}}>{["LOTE","HÍBRIDO / VARIEDAD","SEMILLA (USD/ha)","% LOTE","COSTO POND.",""].map(h=><th key={h} style={st.th}>{h}</th>)}</tr></thead>
                    <tbody>{lotsC.map((s,i)=>{
                      const isEdit=editandoSemilla?.id===s.id;
                      const pond=((parseFloat(s.semilla_ha)||0)*(parseFloat(s.pct_lote)||100)/100);
                      return(<tr key={s.id} style={{borderBottom:`1px solid ${C.border}`,background:i%2===0?"transparent":C.mutedBg+"40"}}>
                        {isEdit?(<>
                          <td style={st.td}><input type="text" value={editandoSemilla.lote_nombre} onChange={e=>setEditandoSemilla(p=>({...p,lote_nombre:e.target.value}))} style={{...inputSt,margin:0,padding:"2px 6px",width:100,fontSize:12,fontWeight:700}}/></td>
                          <td style={st.td}><input type="text" value={editandoSemilla.hibrido_variedad} onChange={e=>setEditandoSemilla(p=>({...p,hibrido_variedad:e.target.value}))} style={{...inputSt,margin:0,padding:"2px 6px",width:180,fontSize:12}}/></td>
                          <td style={st.td}><input type="number" value={editandoSemilla.semilla_ha} onChange={e=>setEditandoSemilla(p=>({...p,semilla_ha:e.target.value}))} style={{...inputSt,margin:0,padding:"2px 6px",width:80,fontSize:12}}/></td>
                          <td style={st.td}><input type="number" value={editandoSemilla.pct_lote} onChange={e=>setEditandoSemilla(p=>({...p,pct_lote:e.target.value}))} style={{...inputSt,margin:0,padding:"2px 6px",width:60,fontSize:12}}/></td>
                          <td style={{...st.td,fontFamily:F,color:C.accent,fontWeight:600}}>${((parseFloat(editandoSemilla.semilla_ha)||0)*(parseFloat(editandoSemilla.pct_lote)||100)/100).toFixed(0)}</td>
                          <td style={{...st.td,display:"flex",gap:4}}>
                            <button onClick={async()=>{await saveSemilla(editandoSemilla,editandoSemilla.id);setEditandoSemilla(null);}} style={{...st.btnPrimary,padding:"2px 8px",fontSize:11}}>✓</button>
                            <button onClick={()=>setEditandoSemilla(null)} style={{...st.btnSecondary,padding:"2px 8px",fontSize:11}}>✕</button>
                          </td>
                        </>):(<>
                          <td style={{...st.td,fontWeight:700}}>{s.lote_nombre}</td>
                          <td style={st.td}>{s.hibrido_variedad||<span style={{color:C.muted,fontStyle:"italic"}}>Sin especificar</span>}</td>
                          <td style={{...st.td,fontFamily:F,color:C.accent,fontWeight:600}}>${parseFloat(s.semilla_ha||0).toFixed(0)}</td>
                          <td style={{...st.td,color:C.muted,fontFamily:F}}>{parseFloat(s.pct_lote||100).toFixed(0)}%</td>
                          <td style={{...st.td,fontFamily:F,fontWeight:700,color:C.accent}}>${pond.toFixed(0)}</td>
                          <td style={{...st.td,display:"flex",gap:4}}>
                            <button onClick={()=>setEditandoSemilla({...s})} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:5,padding:"2px 7px",cursor:"pointer",fontSize:11,color:C.textDim}}>✏</button>
                            <button onClick={()=>deleteSemilla(s.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.danger,fontSize:14,opacity:0.6}} onMouseEnter={e=>e.currentTarget.style.opacity="1"} onMouseLeave={e=>e.currentTarget.style.opacity="0.6"}>🗑</button>
                          </td>
                        </>)}
                      </tr>);
                    })}</tbody>
                  </table>
                </div>);
              });
            })()}
            <div style={{...st.card,border:`1px dashed ${C.accent}50`,background:C.accentLight+"60"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={{fontSize:12,fontWeight:700,color:C.accent,fontFamily:F,textTransform:"uppercase",letterSpacing:1}}>+ Cargar Semilla — {estEmpresa}</div>
                <div style={{display:"flex",gap:6}}>
                  {[["individual","Lote individual"],["masivo","Carga masiva"]].map(([m,label])=>(<button key={m} onClick={()=>{setSemModoMasivo(m==="masivo");setSemLotesSeleccionados([]);}} style={{padding:"3px 12px",borderRadius:20,fontSize:11,cursor:"pointer",border:`1px solid ${(semModoMasivo?m==="masivo":m==="individual")?C.accent:C.border}`,background:(semModoMasivo?m==="masivo":m==="individual")?C.accentLight:"transparent",color:(semModoMasivo?m==="masivo":m==="individual")?C.accent:C.textDim}}>{label}</button>))}
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:10,marginBottom:14}}>
                <div><label style={labelSt}>Campaña</label><select value={newSemilla.campana} onChange={e=>setNewSemilla(p=>({...p,campana:e.target.value}))} style={{...inputSt,margin:0,cursor:"pointer"}}>{CAMPANAS_OP.map(c=><option key={c}>{c}</option>)}</select></div>
                <div style={{gridColumn:"span 2"}}><label style={labelSt}>Híbrido / Variedad</label><input type="text" value={newSemilla.hibrido_variedad} onChange={e=>setNewSemilla(p=>({...p,hibrido_variedad:e.target.value}))} placeholder="Ej: AX7761 VT3PRO..." style={{...inputSt,margin:0}}/></div>
                <div><label style={labelSt}>Semilla (USD/ha)</label><input type="number" value={newSemilla.semilla_ha} onChange={e=>setNewSemilla(p=>({...p,semilla_ha:e.target.value}))} placeholder="0" style={{...inputSt,margin:0}}/></div>
                <div><label style={labelSt}>% del lote</label><input type="number" value={newSemilla.pct_lote} onChange={e=>setNewSemilla(p=>({...p,pct_lote:e.target.value}))} placeholder="100" style={{...inputSt,margin:0}}/></div>
              </div>
              {!semModoMasivo&&(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div><label style={labelSt}>Campo</label><input type="text" list="sem-c-l" value={newSemilla.campo_nombre} onChange={e=>setNewSemilla(p=>({...p,campo_nombre:e.target.value,lote_nombre:""}))} placeholder="Campo" style={{...inputSt,margin:0}}/><datalist id="sem-c-l">{camposEmpresa.map(c=><option key={c} value={c}/>)}</datalist></div>
                <div><label style={labelSt}>Lote</label><input type="text" list="sem-l-l" value={newSemilla.lote_nombre} onChange={e=>setNewSemilla(p=>({...p,lote_nombre:e.target.value}))} placeholder="Lote" style={{...inputSt,margin:0}}/><datalist id="sem-l-l">{[...new Set(lotesEmpresa.filter(l=>!newSemilla.campo_nombre||l.campo_nombre===newSemilla.campo_nombre).map(l=>l.lote_nombre))].map(l=><option key={l} value={l}/>)}</datalist></div>
              </div>)}
              {semModoMasivo&&(<div style={{marginBottom:12}}>
                <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Seleccioná los lotes donde va este híbrido:</div>
                {camposEmpresa.map(campo=>{
                  const lotesC=lotesEmpresa.filter(l=>l.campo_nombre===campo);
                  const todosOk=lotesC.every(l=>semLotesSeleccionados.some(s=>s.campo===campo&&s.lote===l.lote_nombre));
                  return(<div key={campo} style={{marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><input type="checkbox" checked={todosOk} onChange={()=>{ if(todosOk) setSemLotesSeleccionados(p=>p.filter(s=>s.campo!==campo)); else setSemLotesSeleccionados(p=>[...p.filter(s=>s.campo!==campo),...lotesC.map(l=>({campo,lote:l.lote_nombre}))]);}} style={{cursor:"pointer",width:14,height:14}}/><span style={{fontSize:12,fontWeight:700,color:C.text}}>{campo}</span><span style={{fontSize:10,color:C.muted}}>({lotesC.length})</span></div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:6,paddingLeft:22}}>{lotesC.map(l=>{const sel=semLotesSeleccionados.some(s=>s.campo===campo&&s.lote===l.lote_nombre);return(<label key={l.lote_nombre} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",padding:"3px 8px",borderRadius:6,fontSize:11,background:sel?C.accentLight:"transparent",border:`1px solid ${sel?C.accent:C.border}`,color:sel?C.accent:C.text}}><input type="checkbox" checked={sel} onChange={()=>setSemLotesSeleccionados(p=>sel?p.filter(s=>!(s.campo===campo&&s.lote===l.lote_nombre)):[...p,{campo,lote:l.lote_nombre}])} style={{cursor:"pointer"}}/>{l.lote_nombre}</label>);})}</div>
                  </div>);
                })}
                {semLotesSeleccionados.length>0&&<div style={{fontSize:11,color:C.accent,marginTop:6,fontWeight:600}}>✓ {semLotesSeleccionados.length} lotes seleccionados</div>}
              </div>)}
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <button onClick={async()=>{ if(semModoMasivo){ if(semLotesSeleccionados.length===0){setSemillasMsg("⚠ Seleccioná al menos un lote");setTimeout(()=>setSemillasMsg(""),2500);return;} for(const {campo,lote} of semLotesSeleccionados) await saveSemilla({...newSemilla,campo_nombre:campo,lote_nombre:lote},null); setSemLotesSeleccionados([]); } else { await saveSemilla(newSemilla,null); } setNewSemilla(p=>({...p,campo_nombre:"",lote_nombre:"",hibrido_variedad:"",semilla_ha:"",pct_lote:"100"}));}} style={st.btnPrimary}>
                  💾 {semModoMasivo?`Guardar en ${semLotesSeleccionados.length||"..."} lotes`:"Guardar"}
                </button>
                {semillasMsg&&<span style={{fontSize:13,color:semillasMsg.startsWith("✓")?C.accent:C.warn,fontWeight:600}}>{semillasMsg}</span>}
              </div>
              <div style={{marginTop:10,fontSize:11,color:C.muted}}>ℹ Costo MB Real = Σ (USD/ha × % del lote) por lote.</div>
            </div>
          </>)}
        </div>
      </div>
      )}
    </div>
  );
}


function MBReal({ aplicaciones, estructuraLotes, planCultivos, session, getCampanaFecha, calcularCostoHa, st, inputSt, labelSt, C, F, SUPABASE_URL, SUPABASE_KEY }) {
  const tok = session?.access_token || SUPABASE_KEY;

  // ─── CONSTANTES ────────────────────────────────────────────
  const EMPRESAS  = ["HERRERA IGNACIO","AGROCORSI","BERTOLI VARRONE","FERNANDO PIGHIN 2","GIANFRANCO BERTOLI","GREGORET HNOS","SIGOTO/GOROSITO/BERTOLI","VACHETTA JORGE"];
  const TIPOS_PULV = ["Pulverización Terrestre","Terrestre","TERRESTRE","Pulverización Aérea","Aérea","AEREA","Pulverización Drone","Drone","DRONE","Labor - Pulverización Terrestre","Labor - Pulverización Aérea"];
  const TIPOS_FERT = ["Fertilización","Fertilización Incorporada","Fertilización Líquida","Labor - Fertilización Incorporada","Labor - Fertilización Liquida"];
  const TIPOS_COS  = ["Cosecha","COSECHA","Labor - Cosecha Soja","Labor - Cosecha Maíz","Labor - Cosecha Girasol","Labor - Cosecha Sorgo","Labor - Cosecha Trigo","Labor - Cosecha Cebada"];
  const PCT_COS    = {"Labor - Cosecha Soja":8,"Labor - Cosecha Maíz":6,"Labor - Cosecha Girasol":6,"Labor - Cosecha Trigo":11,"Labor - Cosecha Cebada":8,"Labor - Cosecha Sorgo":8,"Cosecha":8};
  const EXCLUIR    = ["Barbecho Químico","BARBECHO QUÍMICO","Barbecho quimico","Cultivo de Servicio","CULTIVO DE SERVICIO","Cultivo de servicio","Vicia","VICIA","Cobertura","COBERTURA"];
  const ORDEN      = ["Trigo","Cebada","Ce-Soja","Colza","Garbanzo","Soja 1ra","Maíz","Me-Maíz","Girasol","Sorgo","Soja 2da","Maíz 2da","Algodón"];

  // n(): convierte cualquier valor a número seguro (nunca NaN)
  const n = v => { const x = Number(v); return isFinite(x) ? x : 0; };

  // ─── ESTADO ────────────────────────────────────────────────
  const campanas = [...new Set([
    ...(aplicaciones||[]).map(a => getCampanaFecha(a.fecha)),
    ...(planCultivos||[]).map(p => p.campana)
  ].filter(Boolean))].sort().reverse();

  const [emp,  setEmp]  = React.useState(EMPRESAS[0]);
  const [camp, setCamp] = React.useState(campanas[0] || "2025/26");
  const [pSoja, setPSoja] = React.useState("");          // precio soja USD/tn (para alquiler)

  // preciosBase / rindesBase: configuración por cultivo antes de calcular
  const [preciosBase, setPreciosBase] = React.useState({});  // { "Soja 1ra": "300" }
  const [rindesBase,  setRindesBase]  = React.useState({});  // { "Soja 1ra": "30" }

  // precios / rindes: edición por lote en la tabla  { "LASTRA||1||Soja 1ra": "28" }
  const [precios, setPrecios] = React.useState({});
  const [rindes,  setRindes]  = React.useState({});

  // datos de Supabase — null = no calculado todavía
  const [datos,     setDatos]     = React.useState(null);
  const [cargando,  setCargando]  = React.useState(false);
  const [guardando, setGuardando] = React.useState(false);
  const [msg,       setMsg]       = React.useState("");

  // Reset al cambiar empresa/campaña
  React.useEffect(() => { setDatos(null); setPrecios({}); setRindes({}); }, [emp, camp]);

  // ─── DATOS DERIVADOS ───────────────────────────────────────
  const lotes   = (estructuraLotes||[]).filter(l => l.empresa_nombre === emp);
  const apps    = (aplicaciones||[]).filter(a => a.empresa_nombre?.trim() === emp.trim() && getCampanaFecha(a.fecha) === camp);
  const cultivos = [...new Set(apps.map(a => a.cultivo).filter(c => c && !EXCLUIR.includes(c)))];

  // ─── FETCH ─────────────────────────────────────────────────
  const calcular = async () => {
    setCargando(true);
    try {
      const e = encodeURIComponent(emp), c = encodeURIComponent(camp);
      const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` };
      const [cosR, semR] = await Promise.all([
        fetch(`${SUPABASE_URL}/rest/v1/costos_produccion?empresa_nombre=eq.${e}&campana=eq.${c}`, { headers: H }).then(r => r.json()),
        fetch(`${SUPABASE_URL}/rest/v1/lotes_semillas?empresa_nombre=eq.${e}&campana=eq.${c}`,    { headers: H }).then(r => r.json()),
      ]);
      setDatos({ cos: Array.isArray(cosR) ? cosR : [], sem: Array.isArray(semR) ? semR : [] });
    } catch(e) { alert("Error: " + e.message); }
    setCargando(false);
  };

  // ─── CÁLCULO ───────────────────────────────────────────────
  // Busca costos_produccion para un cultivo con fallback: exacto → sin variante → raíz
  const buscarCP = (cultivo) => {
    if (!datos?.cos?.length) return null;
    const cos = datos.cos;
    let r = cos.find(x => x.cultivo === cultivo);
    if (r) return r;
    const norm = s => s.replace(/\s+(1ra|2da|3ra|Hab)/i, "").trim();
    r = cos.find(x => norm(x.cultivo) === norm(cultivo));
    if (r) return r;
    r = cos.find(x => x.cultivo.split(" ")[0] === cultivo.split(" ")[0]);
    return r || null;
  };

  const calcularLote = (lote) => {
    const ha    = n(lote.hectareas);
    const appsL = apps.filter(a => a.campo_nombre === lote.campo_nombre && String(a.lote_nombre) === String(lote.lote_nombre));
    const semL  = (datos?.sem||[]).filter(s => s.campo_nombre === lote.campo_nombre && String(s.lote_nombre) === String(lote.lote_nombre));

    const cultsLote = [...new Set(appsL.map(a => a.cultivo).filter(c => c && !EXCLUIR.includes(c)))]
      .sort((a, b) => { const ia = ORDEN.indexOf(a), ib = ORDEN.indexOf(b); return (ia<0?99:ia)-(ib<0?99:ib); });

    if (!cultsLote.length) return null;

    const rows = cultsLote.map((cult, idx) => {
      const lk = `${lote.campo_nombre}||${lote.lote_nombre}||${cult}`;
      const pg    = n(precios[lk]) || n(preciosBase[cult]);    // USD/tn
      const rinde = n(rindes[lk])  || n(rindesBase[cult]);     // qq/ha

      const ing_bruto = n(rinde * pg * 0.1);  // USD/ha

      // Flete y comercialización desde plan_cultivos
      const pc = (planCultivos||[]).find(p => p.cultivo === cult && p.campana === camp);
      const flete  = ing_bruto > 0 ? n(pc?.flete_usd) : 0;
      const pctCom = n(pc?.pct_comercializacion) / 100;
      const com    = ing_bruto > 0 ? n(ing_bruto * pctCom) : 0;
      const ing_neto = n(ing_bruto - flete - com);

      // Apps de este cultivo
      const esPrimero = idx === 0;
      const appsC = esPrimero
        ? appsL.filter(a => a.cultivo === cult || EXCLUIR.includes(a.cultivo))
        : appsL.filter(a => a.cultivo === cult);
      const appsSolo = appsL.filter(a => a.cultivo === cult);

      // Agroquímicos
      const agro = n(appsC.filter(a => TIPOS_PULV.includes(a.tipo_aplicacion)).reduce((s, a) => {
        const prods = (a.productos||[]).filter(p => p.tipo_mb !== "fertilizante")
          .reduce((ps, p) => ps + n(calcularCostoHa(n(p.dosis), p.unidad, p.precio_usd)), 0);
        return s + prods + n(a.costo_labor_ha);
      }, 0));

      // Fertilizantes
      const fert = n(appsSolo.filter(a => TIPOS_FERT.includes(a.tipo_aplicacion) || (a.productos||[]).some(p => p.tipo_mb==="fertilizante")).reduce((s, a) => {
        const prods = (a.productos||[]).filter(p => p.tipo_mb==="fertilizante")
          .reduce((ps, p) => ps + n(calcularCostoHa(n(p.dosis), p.unidad, p.precio_usd)), 0);
        return s + prods + n(a.costo_labor_ha);
      }, 0));

      // Cosecha
      const appsCos = appsSolo.filter(a => TIPOS_COS.includes(a.tipo_aplicacion));
      const cp = buscarCP(cult);
      const cosecha = appsCos.length > 0
        ? n(appsCos.reduce((s, a) => s + ing_neto * n(PCT_COS[a.tipo_aplicacion] || 8) / 100, 0))
        : n(cp?.labor_cosecha_ha);

      // Semilla, cura, labor siembra — solo al primer cultivo
      const semilla = esPrimero ? n(semL.reduce((s, x) => s + n(x.semilla_ha) * n(x.pct_lote||100) / 100, 0)) : 0;
      const cura    = esPrimero ? n(cp?.curasemilla_ha)  : 0;
      const lsiem   = n(cp?.labor_siembra_ha);

      const costos = agro + fert + cosecha + semilla + cura + lsiem;
      const mb_ha  = n(ing_neto - costos);

      return { cult, lk, rinde, pg, ing_bruto, flete, com, ing_neto, agro, fert, cosecha, semilla, cura, lsiem, costos, mb_ha };
    });

    // Alquiler — UNA sola vez a nivel lote
    let alq_ha = 0;
    if (lote.tenencia === "ALQUILADO") {
      const ps = n(pSoja) || 330;
      if (lote.alquiler_tipo === "qq_soja") {
        alq_ha = n(lote.alquiler_qq_ha) * ps * 0.1;
      } else if (lote.alquiler_tipo === "pct_cultivo") {
        const ing_bruto_total = rows.reduce((s, r) => s + r.ing_bruto, 0);
        alq_ha = ing_bruto_total * n(lote.alquiler_pct) / 100;
      } else {
        alq_ha = n(lote.alquiler_qq_ha) * ps * 0.1;
      }
      alq_ha = n(alq_ha);
    }

    const ing_tot  = n(rows.reduce((s, r) => s + r.ing_neto  * ha, 0));
    const cos_tot  = n(rows.reduce((s, r) => s + r.costos    * ha, 0)) + n(alq_ha * ha);
    const mb_tot   = n(ing_tot - cos_tot);

    return { rows, ha, alq_ha, ing_tot, cos_tot, mb_tot };
  };

  // filas: se recalculan reactivamente cuando cambia cualquier input
  const filas = React.useMemo(() => {
    if (!datos) return [];
    return lotes.map(l => ({ l, c: calcularLote(l) })).filter(x => x.c);
  }, [datos, precios, rindes, preciosBase, rindesBase, pSoja]);

  const campos = [...new Set(filas.map(f => f.l.campo_nombre))].sort();
  const tot = filas.reduce((s, f) => ({
    ha:  s.ha  + n(f.c.ha),
    ing: s.ing + n(f.c.ing_tot),
    cos: s.cos + n(f.c.cos_tot),
    mb:  s.mb  + n(f.c.mb_tot),
  }), { ha: 0, ing: 0, cos: 0, mb: 0 });

  // ─── GUARDAR ───────────────────────────────────────────────
  const guardar = async () => {
    if (!filas.length) return;
    setGuardando(true);
    let ok = 0, err = 0;
    try {
      for (const { l, c } of filas) {
        for (const r of c.rows) {
          const _res = await fetch(`${SUPABASE_URL}/rest/v1/margen_bruto`, {
            method: "POST",
            headers: { "Content-Type":"application/json", apikey:SUPABASE_KEY, Authorization:`Bearer ${tok}`, Prefer:"return=minimal" },
            body: JSON.stringify({
              empresa_nombre: emp, campo_nombre: l.campo_nombre, lote_nombre: l.lote_nombre,
              cultivo: r.cult, campana: camp, hectareas: c.ha,
              rendimiento_qq: r.rinde || null, precio_grano_usd: r.pg || null,
              ingreso_bruto_usd:      n(r.ing_bruto  * c.ha),
              costo_flete_usd:        n(r.flete       * c.ha),
              costo_otros_usd:        n(r.com         * c.ha),
              costo_agroquimicos_usd: n(r.agro        * c.ha),
              costo_fertilizantes_usd:n(r.fert        * c.ha),
              costo_cosecha_usd:      n(r.cosecha     * c.ha),
              costo_semilla_usd:      n(r.semilla     * c.ha),
              costo_labores_usd:      n((r.cura+r.lsiem)*c.ha),
              costo_arrendamiento_usd:n(c.alq_ha      * c.ha / (c.rows.length||1)),
              margen_bruto_usd:       n(c.mb_tot / (c.rows.length||1)),
              margen_bruto_ha_usd:    n(c.mb_tot / c.ha / (c.rows.length||1)),
              margen_bruto_pct:       c.ing_tot > 0 ? n(c.mb_tot / c.ing_tot * 100) : null,
              tipo: "real",
            })
          });
          _res.ok ? ok++ : err++;
        }
      }
      setMsg(`✓ ${ok} registros guardados${err > 0 ? ` · ⚠ ${err} errores` : ""}`);
    } catch(e) { setMsg("⚠ Error: " + e.message); }
    setTimeout(() => setMsg(""), 3000);
    setGuardando(false);
  };

  // ─── UI HELPERS ────────────────────────────────────────────
  const f$  = v => `$${Math.round(Math.abs(n(v))).toLocaleString("es-AR")}`;
  const fMB = v => { const x = n(v); return x === 0 ? "—" : `${x>=0?"+":"−"}$${Math.round(Math.abs(x)).toLocaleString("es-AR")}`; };
  const col = v => n(v) >= 0 ? C.accent : C.danger;

  // ─── RENDER ────────────────────────────────────────────────
  return (
    <div>
      {/* CONFIG */}
      <div style={{...st.card, marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:C.accent,fontFamily:F,textTransform:"uppercase",letterSpacing:1,marginBottom:14}}>⚙ Configuración MB Real</div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:14}}>
          <div>
            <label style={labelSt}>Empresa</label>
            <select value={emp} onChange={e=>{setEmp(e.target.value);}} style={{...inputSt,margin:0,cursor:"pointer"}}>
              {EMPRESAS.map(e=><option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSt}>Campaña</label>
            <select value={camp} onChange={e=>{setCamp(e.target.value);}} style={{...inputSt,margin:0,cursor:"pointer"}}>
              {(campanas.length?campanas:["2024/25","2025/26"]).map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSt}>Precio soja (USD/tn)</label>
            <input type="number" value={pSoja} onChange={e=>setPSoja(e.target.value)} placeholder="330" style={{...inputSt,margin:0}}/>
          </div>
        </div>

        {/* Precio y rinde base por cultivo */}
        {cultivos.length > 0 && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,color:C.muted,marginBottom:6,fontFamily:F,textTransform:"uppercase",letterSpacing:0.5}}>
              Precio y rinde base por cultivo
            </div>
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {cultivos.map(cult => (
                <div key={cult} style={{background:C.mutedBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",minWidth:220}}>
                  <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:8}}>{cult}</div>
                  <div style={{display:"flex",gap:8}}>
                    <div>
                      <label style={{...labelSt,fontSize:10}}>Precio (USD/tn)</label>
                      <input type="number" value={preciosBase[cult]||""} placeholder="USD/tn"
                        onChange={e=>setPreciosBase(p=>({...p,[cult]:e.target.value}))}
                        style={{...inputSt,margin:0,width:90}}/>
                    </div>
                    <div>
                      <label style={{...labelSt,fontSize:10}}>Rinde (qq/ha)</label>
                      <input type="number" value={rindesBase[cult]||""} placeholder="qq/ha"
                        onChange={e=>setRindesBase(p=>({...p,[cult]:e.target.value}))}
                        style={{...inputSt,margin:0,width:90}}/>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <button onClick={calcular} disabled={cargando} style={{...st.btnPrimary,opacity:cargando?0.6:1}}>
            {cargando?"⏳ Calculando...":"🧮 Calcular MB Real"}
          </button>
          {datos && filas.length>0 && (
            <button onClick={guardar} disabled={guardando} style={{...st.btnPrimary,background:"#27ae60",opacity:guardando?0.6:1}}>
              {guardando?"⏳ Guardando...":"💾 Guardar MB Real"}
            </button>
          )}
          {msg && <span style={{fontSize:13,fontWeight:600,color:msg.startsWith("✓")?C.accent:C.warn}}>{msg}</span>}
        </div>
      </div>

      {/* SIN RESULTADOS */}
      {datos && filas.length===0 && (
        <div style={{...st.card,color:C.muted,textAlign:"center",padding:24}}>Sin lotes con datos para {emp} — {camp}.</div>
      )}

      {/* RESULTADOS */}
      {datos && filas.length>0 && (<>

        {/* Tarjetas */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:12,marginBottom:16}}>
          {[
            {label:"MB TOTAL",      val:fMB(tot.mb), color:col(tot.mb), sub:`${Math.round(tot.ha)} ha`},
            {label:"MB/ha PROM.",   val:fMB(tot.ha>0?tot.mb/tot.ha:0), color:col(tot.mb), sub:"USD/ha"},
            {label:"MB %",         val:tot.ing>0?`${(tot.mb/tot.ing*100).toFixed(1)}%`:"—", color:col(tot.mb), sub:"sobre ingreso"},
            {label:"INGRESO BRUTO",val:f$(tot.ing), color:C.text, sub:"USD total"},
            {label:"COSTOS TOTALES",val:f$(tot.cos), color:C.warn, sub:"USD total"},
          ].map(({label,val,color,sub})=>(
            <div key={label} style={{background:C.surface,border:`1px solid ${C.border}`,borderTop:`3px solid ${color}`,borderRadius:10,padding:"12px 16px"}}>
              <div style={{fontSize:10,color:C.muted,fontFamily:F,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>{label}</div>
              <div style={{fontSize:20,fontWeight:700,color,fontFamily:F}}>{val}</div>
              <div style={{fontSize:11,color:C.muted}}>{sub}</div>
            </div>
          ))}
        </div>

        {/* Tabla por campo */}
        {campos.map(campo=>{
          const fc   = filas.filter(f=>f.l.campo_nombre===campo);
          const haC  = fc.reduce((s,f)=>s+n(f.c.ha),0);
          const mbC  = fc.reduce((s,f)=>s+n(f.c.mb_tot),0);
          const ingC = fc.reduce((s,f)=>s+n(f.c.ing_tot),0);
          return(
            <div key={campo} style={{...st.card,padding:0,overflow:"hidden",marginBottom:16}}>
              <div style={{padding:"10px 16px",background:C.mutedBg,borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontSize:13,fontWeight:700,color:C.text}}>{campo}</span>
                <div style={{display:"flex",gap:16,fontSize:12}}>
                  <span style={{color:C.muted}}>{Math.round(haC)} ha</span>
                  <span style={{color:C.muted}}>Ing: {f$(ingC)}</span>
                  <span style={{fontWeight:700,color:col(mbC),fontFamily:F}}>MB: {fMB(mbC)}</span>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{background:C.mutedBg}}>
                    {["LOTE","CULTIVO","HA","RINDE","PRECIO","ING.BRUTO/ha","FLETE","COM.","ING.NETO/ha","AGROQUÍM.","FERT.","COSECHA","SEMILLA","CURA","L.SIEM.","ALQUILER","COSTOS/ha","MB/ha","MB TOTAL","%"].map(h=>(
                      <th key={h} style={{...st.th,whiteSpace:"nowrap",fontSize:10,padding:"6px 8px"}}>{h}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    {fc.flatMap(({l,c},fi)=>{
                      const doble = c.rows.length>1;
                      const rows  = c.rows.map((r,ri)=>{
                        const pos = r.mb_ha>=0;
                        return(
                          <tr key={`${l.lote_nombre}-${r.cult}`} style={{borderBottom:`1px solid ${C.border}`,background:doble?(ri===0?C.accentLight+"20":"transparent"):fi%2===0?"transparent":C.mutedBg+"40"}}>
                            <td style={{...st.td,fontWeight:700,whiteSpace:"nowrap"}}>{ri===0?l.lote_nombre:<span style={{color:C.muted,fontSize:10,paddingLeft:12}}>↳</span>}</td>
                            <td style={{...st.td,whiteSpace:"nowrap"}}>{r.cult}</td>
                            <td style={{...st.td,fontFamily:F}}>{ri===0?c.ha:"—"}</td>
                            <td style={st.td}>
                              <input type="number" value={rindes[r.lk]!==undefined?rindes[r.lk]:(rindesBase[r.cult]||"")}
                                onChange={e=>setRindes(p=>({...p,[r.lk]:e.target.value}))}
                                placeholder={rindesBase[r.cult]||"qq"}
                                style={{...inputSt,margin:0,padding:"2px 4px",width:58,fontSize:11}}/>
                            </td>
                            <td style={st.td}>
                              <input type="number" value={precios[r.lk]!==undefined?precios[r.lk]:(preciosBase[r.cult]||"")}
                                onChange={e=>setPrecios(p=>({...p,[r.lk]:e.target.value}))}
                                placeholder={preciosBase[r.cult]||"USD"}
                                style={{...inputSt,margin:0,padding:"2px 4px",width:58,fontSize:11}}/>
                            </td>
                            <td style={{...st.td,fontFamily:F,color:C.muted}}>{r.ing_bruto>0?f$(r.ing_bruto):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:"#c0392b",fontSize:10}}>{r.flete>0?"-"+f$(r.flete):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:"#c0392b",fontSize:10}}>{r.com>0?"-"+f$(r.com):"—"}</td>
                            <td style={{...st.td,fontFamily:F,fontWeight:600}}>{r.ing_neto>0?f$(r.ing_neto):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:"#e67e22"}}>{r.agro>0?f$(r.agro):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:"#8e44ad"}}>{r.fert>0?f$(r.fert):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:"#c0392b"}}>{r.cosecha>0?f$(r.cosecha):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:"#2980b9"}}>{r.semilla>0?f$(r.semilla):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:C.muted}}>{r.cura>0?f$(r.cura):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:C.muted}}>{r.lsiem>0?f$(r.lsiem):"—"}</td>
                            <td style={{...st.td,fontFamily:F,color:C.warn}}>{ri===0&&c.alq_ha>0?f$(c.alq_ha):"—"}</td>
                            <td style={{...st.td,fontFamily:F,fontWeight:600,color:C.warn}}>{f$(r.costos+(ri===0?c.alq_ha:0))}</td>
                            <td style={{...st.td,fontFamily:F,fontWeight:700,fontSize:12,color:col(r.mb_ha)}}>{fMB(r.mb_ha)}</td>
                            <td style={{...st.td,fontFamily:F,fontWeight:700,color:col(c.mb_tot),background:pos?C.accentLight+"60":"#fdecea60",whiteSpace:"nowrap"}}>
                              {ri===0?fMB(c.mb_tot):"—"}
                            </td>
                            <td style={st.td}>
                              <span style={{fontSize:10,padding:"2px 6px",borderRadius:10,background:pos?C.accentLight:"#fdecea",color:col(r.mb_ha),fontWeight:600}}>
                                {r.ing_neto>0?(r.mb_ha/r.ing_neto*100).toFixed(0)+"%":"—"}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                      if(doble){
                        const pos=c.mb_tot>=0;
                        rows.push(
                          <tr key={`${l.lote_nombre}-tot`} style={{borderBottom:`2px solid ${C.border}`,background:pos?C.accentLight+"40":"#fdecea30"}}>
                            <td style={{...st.td,fontWeight:700}}>{l.lote_nombre}</td>
                            <td style={{...st.td,fontWeight:700,color:C.accent}}>TOTAL LOTE</td>
                            <td style={{...st.td,fontFamily:F,fontWeight:700}}>{c.ha}</td>
                            <td colSpan={14} style={st.td}/>
                            <td style={{...st.td,fontFamily:F,fontWeight:700,color:col(c.mb_tot)}}>{fMB(c.ha>0?c.mb_tot/c.ha:0)}</td>
                            <td style={{...st.td,fontFamily:F,fontWeight:700,color:col(c.mb_tot),background:pos?C.accentLight+"80":"#fdecea80"}}>{fMB(c.mb_tot)}</td>
                            <td style={st.td}><span style={{fontSize:10,padding:"2px 6px",borderRadius:10,background:pos?C.accentLight:"#fdecea",color:col(c.mb_tot),fontWeight:700}}>{c.ing_tot>0?(c.mb_tot/c.ing_tot*100).toFixed(0)+"%":"—"}</span></td>
                          </tr>
                        );
                      }
                      return rows;
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </>)}
    </div>
  );
}

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
    <div style={{ minHeight: "100vh", background: "#f7f8f9", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ width: "100%", maxWidth: 400, padding: 24 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "#111827", borderRadius: 14, padding: "14px 24px" }}>
            <span style={{ fontSize: 22, color: "#4ae87a", fontFamily: "'DM Mono', monospace", fontWeight: 700, letterSpacing: 2 }}>🌱 Ing. Agr. Ignacio Herrera</span>
          </div>
          <div style={{ color: "#5a7a5e", fontSize: 13, marginTop: 12 }}>Panel Administrador</div>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e8eaed", padding: 32, boxShadow: "0 4px 32px rgba(0,0,0,0.08)" }}>
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
          Ing. Agr. Ignacio Herrera · Panel Administrador
        </div>
      </div>
    </div>
  );
}

// ── NUEVA PALETA ──────────────────────────────────────────────
const C = {
  bg: "#f7f8f9",            // fondo gris muy suave / casi blanco
  surface: "#ffffff",
  card: "#ffffff",
  border: "#e8eaed",        // bordes grises muy suaves
  borderStrong: "#d0d5db",

  accent: "#1f6b35",        // verde agrícola profundo
  accentLight: "#f0faf3",   // verde muy suave
  accentMid: "#2d8a47",

  warn: "#b45309",
  warnLight: "#fffbeb",
  danger: "#dc2626",
  dangerLight: "#fef2f2",

  text: "#111827",          // casi negro — máximo contraste
  textDim: "#4b5563",       // gris medio
  muted: "#9ca3af",         // gris apagado
  mutedBg: "#f3f4f6",

  headerBg: "#111827",      // header negro profundo
  headerText: "#f9fafb",
  headerDim: "#6b7280",

  navBg: "#ffffff",
  navActive: "#1f6b35",
  navActiveBg: "#f0faf3",
};

const F = `'DM Mono', monospace`;
const SANS = `'DM Sans', sans-serif`;

const UMBRALES = {
  isocas: 5,        // 5/m lineal
  chinches: 1,      // 1/m lineal
  chicharrita: 1,   // 1% plantas afectadas
  cogollero: 5,     // 5% daño
  gusano_espiga: 20,// 20/100 plantas
  // pulgones, trips, aranhuelas son nivel texto (BAJO/MEDIO/ALTO)
  // alerta desde MEDIO — se manejan en generarAlertas via PLAGAS_NIVEL
  pulgones: 2, trips: 2, aranhuelas: 2,
};

// ── GLOBAL CSS ────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');
  @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
  @keyframes spin { to { transform:rotate(360deg) } }
  @keyframes slideDown { from { opacity:0; transform:translateY(-6px) } to { opacity:1; transform:translateY(0) } }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  body { background: ${C.bg}; color: ${C.text}; font-family: 'DM Sans', sans-serif; }
  @media (max-width: 768px) {
    #root > div > main, #root > div > [data-main] { padding-bottom: 80px !important; }
  }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
  ::-webkit-scrollbar-thumb:hover { background: ${C.borderStrong}; }
  select option { background: ${C.surface}; color: ${C.text}; }
  /* Tablas modernas */
  tbody tr { transition: background 0.12s; }
  tbody tr:hover td { background: ${C.accentLight}; cursor: pointer; }
  thead th { background: ${C.bg} !important; border-bottom: 2px solid ${C.border} !important; }
  /* Inputs */
  input, select, textarea {
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  input:focus, select:focus, textarea:focus {
    outline: none !important;
    border-color: ${C.accent} !important;
    box-shadow: 0 0 0 3px ${C.accentLight} !important;
  }
  input::placeholder { color: ${C.muted}; }
  button { transition: all 0.16s cubic-bezier(.4,0,.2,1); font-family: 'DM Sans', sans-serif; }
  button:active { transform: scale(0.97); }
  /* Badges */
  .chip {
    display: inline-flex; align-items: center; gap: 4px;
    font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 20px;
    font-family: 'DM Sans', sans-serif; letter-spacing: 0.1px;
  }
  .chip-green  { background: ${C.accentLight}; color: ${C.accent}; }
  .chip-amber  { background: ${C.warnLight};   color: ${C.warn}; }
  .chip-red    { background: ${C.dangerLight}; color: ${C.danger}; }
  .chip-gray   { background: ${C.mutedBg};     color: ${C.muted}; }
  /* Cards */
  .card {
    background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 16px; padding: 20px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03);
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  /* Stat card accent line */
  .stat-card {
    background: ${C.surface}; border: 1px solid ${C.border};
    border-radius: 16px; padding: 20px 22px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, ${C.accent}, ${C.accentMid});
    border-radius: 16px 16px 0 0;
  }
  /* Section title */
  .section-title {
    font-size: 13px; font-weight: 700; color: ${C.muted};
    text-transform: uppercase; letter-spacing: 1px;
    font-family: 'DM Mono', monospace;
  }
  /* ── SIDEBAR LAYOUT ── */
  .app-layout {
    display: flex; min-height: 100vh;
  }
  .sidebar {
    width: 240px; flex-shrink: 0;
    background: #111827;
    border-right: none;
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0;
    z-index: 100; overflow-y: auto;
  }
  .sidebar-logo {
    padding: 18px 14px 14px;
    border-bottom: 1px solid #1f2937;
    display: flex; align-items: center; gap: 10px;
  }
  .sidebar-logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: #1f6b35;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }
  .sidebar-section-label {
    font-size: 9px; font-weight: 700; color: #4b5563;
    padding: 10px 10px 4px; letter-spacing: 1px; text-transform: uppercase;
  }
  .sidebar-search {
    margin: 10px 8px 4px;
    position: relative;
  }
  .sidebar-search input {
    width: 100%; background: #1f2937; border: 1px solid #374151;
    border-radius: 8px; padding: 7px 10px 7px 30px;
    color: #e5e7eb; font-size: 12px; font-family: 'DM Sans', sans-serif;
    outline: none; transition: border-color 0.15s;
  }
  .sidebar-search input::placeholder { color: #6b7280; }
  .sidebar-search input:focus { border-color: #4ade80; }
  .sidebar-search-icon {
    position: absolute; left: 9px; top: 50%; transform: translateY(-50%);
    font-size: 12px; color: #6b7280; pointer-events: none;
  }
  .search-results {
    position: fixed; left: 228px; top: 60px; width: 340px;
    background: #ffffff; border: 1px solid #e8eaed; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 300;
    overflow: hidden; max-height: 480px; overflow-y: auto;
  }
  .search-result-group { padding: 8px 0 4px; }
  .search-result-group-label {
    font-size: 9px; font-weight: 700; color: #9ca3af;
    padding: 4px 14px; text-transform: uppercase; letter-spacing: 0.8px;
  }
  .search-result-item {
    padding: 8px 14px; cursor: pointer; display: flex; align-items: center; gap: 10px;
    font-size: 13px; color: #111827; transition: background 0.1s;
  }
  .search-result-item:hover { background: #f0faf3; }
  .search-result-item-sub { font-size: 11px; color: #9ca3af; margin-top: 1px; }
  .sidebar-nav { padding: 8px 8px; flex: 1; }
  .sidebar-nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 12px; border-radius: 10px; width: 100%;
    border: none; background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 400;
    color: #9ca3af; text-align: left; min-height: 46px;
    transition: all 0.14s cubic-bezier(.4,0,.2,1);
    white-space: nowrap; overflow: hidden;
  }
  .sidebar-nav-item:hover { background: #1f2937; color: #e5e7eb; }
  .sidebar-nav-item.active {
    background: #1f6b3530;
    color: #4ade80;
    font-weight: 600;
  }
  .sidebar-nav-item .nav-icon { font-size: 18px; flex-shrink: 0; width: 22px; text-align: center; }
  .sidebar-campaign-card {
    margin: 8px; background: #1f2937; border-radius: 10px; padding: 10px 12px;
  }
  .sidebar-footer {
    padding: 12px 12px;
    border-top: 1px solid #1f2937;
    display: flex; align-items: center; justify-content: space-between;
  }
  .sidebar-badge {
    background: #dc2626; color: #fff;
    font-size: 9px; font-weight: 700; padding: 1px 6px;
    border-radius: 10px; margin-left: auto;
  }
  .sidebar-badge-warn {
    background: #b45309; color: #fff;
    font-size: 9px; font-weight: 700; padding: 1px 6px;
    border-radius: 10px; margin-left: auto;
  }
  .content-area {
    margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh;
  }
  .content-topbar {
    background: ${C.surface}; border-bottom: 1px solid ${C.border};
    padding: 0 24px; height: 50px;
    display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 50;
  }
  /* Bottom nav mobile */
  .bottom-nav { display: none; }
  /* Tablet (769px - 1200px): sidebar más compacto */
  @media (min-width: 769px) and (max-width: 1200px) {
    .sidebar { width: 200px; }
    .content-area { margin-left: 200px; }
    .sidebar-nav-item { padding: 10px 10px; font-size: 13px; min-height: 44px; }
    .main-content { padding: 16px 18px !important; }
  }
  @media (max-width: 768px) {
    .sidebar { display: none; }
    .content-area { margin-left: 0; }
    .bottom-nav {
      display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
      background: ${C.surface}; border-top: 1px solid ${C.border};
      padding: 8px 0 env(safe-area-inset-bottom);
      overflow-x: auto; -webkit-overflow-scrolling: touch;
    }
    .main-content { padding: 16px !important; padding-bottom: 100px !important; }
  }
  .bottom-nav-inner { display: flex; min-width: max-content; padding: 0 4px; }
  .bottom-nav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 6px 14px; border: none; background: transparent; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 500;
    color: ${C.muted}; border-radius: 12px; min-width: 58px; min-height: 56px;
    transition: all 0.16s; justify-content: center;
  }
  .bottom-nav-btn.active { color: ${C.accent}; background: ${C.accentLight}; }
  .bottom-nav-btn .bn-icon { font-size: 22px; line-height: 1; }
`;

// ── COMPONENTS ────────────────────────────────────────────────

function Badge({ type }) {
  const map = {
    ok:     { cls: "chip chip-green", label: "OK" },
    warn:   { cls: "chip chip-amber", label: "⚠ ALERTA" },
    danger: { cls: "chip chip-red",   label: "✕ CRÍTICO" },
  };
  const s = map[type] || { cls: "chip chip-gray", label: "INFO" };
  return <span className={s.cls}>{s.label}</span>;
}

function Stat({ label, value, color, sub, icon }) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: 0.5, fontFamily: SANS, textTransform: "uppercase" }}>{label}</div>
        {icon && <span style={{ fontSize: 18, opacity: 0.7 }}>{icon}</span>}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, color: color || C.accent, fontFamily: SANS, lineHeight: 1, letterSpacing: -0.5 }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 12, marginTop: 8, fontWeight: 400 }}>{sub}</div>}
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
  const plagas = [["isocas", "Isocas"], ["chinches", "Chinches"], ["pulgones", "Pulgones"], ["chicharrita", "Chicharrita"], ["trips", "Trips"], ["aranhuelas", "Arañuelas"], ["cogollero", "Cogollero"], ["gusano_espiga", "Gusano Espiga"]];
  const lotes = ["todos", ...new Set(monitoreos.map(m => m.lote).filter(Boolean))];
  const filtered = monitoreos.filter(m => (lote === "todos" || m.lote === lote) && m[plaga] != null && m[plaga] !== "").sort((a, b) => new Date(a.fecha) - new Date(b.fecha)).slice(-20);
  const max = Math.max(...filtered.map(m => parseFloat(m[plaga]) || 0), 1);
  const umbral = UMBRALES[plaga] || 1;
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

// ── GRAFICO EVOLUCION POR LOTE ───────────────────────────────
const COLORES_LOTES = ["#2d7a3a","#c0392b","#2980b9","#8e44ad","#c97a1a","#16a085","#d35400","#2c3e50","#27ae60","#e74c3c","#3498db","#9b59b6"];
const PLAGAS_NIVEL_SET = new Set(["pulgones","trips","aranhuelas","caracol"]);

function GraficoEvolucionPorLote({ monitoreos }) {
  const [plaga, setPlaga] = useState("isocas");
  const plagas = [["isocas","Isocas"],["chinches","Chinches"],["pulgones","Pulgones"],["chicharrita","Chicharrita"],
    ["trips","Trips"],["aranhuelas","Arañuelas"],["cogollero","Cogollero"],["gusano_espiga","Gusano Espiga"]];

  const esNivel = PLAGAS_NIVEL_SET.has(plaga);

  // Filtrar monitoreos con dato para la plaga seleccionada
  const conDato = monitoreos.filter(m => m[plaga] != null && m[plaga] !== "").sort((a,b) => a.fecha?.localeCompare(b.fecha));

  // Lotes únicos con al menos 2 datos (para que tenga sentido graficar línea)
  const lotesConDatos = [...new Set(conDato.map(m => m.lote).filter(Boolean))].filter(l => conDato.filter(m => m.lote === l).length >= 1).slice(0, 12);

  // Fechas únicas ordenadas
  const fechas = [...new Set(conDato.map(m => m.fecha))].sort();

  // Espaciado mínimo de 70px por fecha para que no se amontonen
  const svgW = Math.max(600, fechas.length * 70);
  const svgH = 300;
  const padL = 44, padR = 16, padT = 20, padB = 55;
  const gW = svgW - padL - padR;
  const gH = svgH - padT - padB;

  const xPos = (i) => padL + (fechas.length <= 1 ? gW/2 : (i / (fechas.length - 1)) * gW);

  let maxVal = 1;
  if (!esNivel) {
    maxVal = Math.max(...conDato.map(m => parseFloat(m[plaga]) || 0), 1);
  }
  const yPos = (v) => padT + gH - (v / maxVal) * gH;

  const nivelNum = { "BAJO": 1, "BAJA": 1, "MEDIA": 2, "MEDIO": 2, "ALTA": 3, "ALTO": 3 };

  const sel = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", color: C.text, fontFamily: SANS, fontSize: 12, outline: "none", cursor: "pointer" };

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: SANS }}>📊 Evolución por Lote</h3>
        <select style={sel} value={plaga} onChange={e => setPlaga(e.target.value)}>
          {plagas.map(([k,v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      {/* Leyenda */}
      {lotesConDatos.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          {lotesConDatos.map((l, i) => (
            <span key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.textDim }}>
              <span style={{ width: 24, height: 3, background: COLORES_LOTES[i % COLORES_LOTES.length], display: "inline-block", borderRadius: 2 }}></span>
              {l}
            </span>
          ))}
        </div>
      )}
      {conDato.length === 0 ? (
        <div style={{ textAlign: "center", padding: 30, color: C.muted, fontSize: 13 }}>Sin datos disponibles para esta plaga</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }}>
            {/* Grid horizontal */}
            {(esNivel ? [0,1,2,3] : [0,0.25,0.5,0.75,1]).map((t,ti) => {
              const y = esNivel ? padT + gH - (t/3)*gH : padT + gH*(1-t);
              const label = esNivel ? (["—","BAJO","MEDIA","ALTA"][t]) : (maxVal*t).toFixed(maxVal<2?1:0);
              return (
                <g key={ti}>
                  <line x1={padL} y1={y} x2={svgW-padR} y2={y} stroke={C.border} strokeWidth="1" strokeDasharray="3,4"/>
                  <text x={padL-5} y={y+4} textAnchor="end" fill={C.muted} fontSize="11" fontFamily="monospace">{label}</text>
                </g>
              );
            })}
            {/* Ejes */}
            <line x1={padL} y1={padT} x2={padL} y2={padT+gH} stroke={C.borderStrong} strokeWidth="1.5"/>
            <line x1={padL} y1={padT+gH} x2={svgW-padR} y2={padT+gH} stroke={C.borderStrong} strokeWidth="1.5"/>
            {/* Labels eje X */}
            {fechas.map((f, i) => (
              <text key={f} x={xPos(i)} y={svgH-8} textAnchor="end" fill={C.muted} fontSize="11" fontFamily="monospace"
                transform={`rotate(-45, ${xPos(i)}, ${svgH-8})`}>{f?.slice(5)}</text>
            ))}
            {/* Línea por lote */}
            {lotesConDatos.map((lote, li) => {
              const color = COLORES_LOTES[li % COLORES_LOTES.length];
              const ptsLote = fechas.map((f, fi) => {
                const m = conDato.find(m => m.lote === lote && m.fecha === f);
                if (!m) return null;
                const raw = m[plaga];
                const v = esNivel ? (nivelNum[String(raw).toUpperCase()] || 0) : (parseFloat(raw) || 0);
                return { fi, v };
              }).filter(Boolean);
              if (ptsLote.length === 0) return null;
              const pathD = ptsLote.map((p, i) => `${i===0?'M':'L'}${xPos(p.fi)},${esNivel ? padT+gH-(p.v/3)*gH : yPos(p.v)}`).join(' ');
              return (
                <g key={lote}>
                  <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                  {ptsLote.map((p,i) => (
                    <g key={i}>
                      <circle cx={xPos(p.fi)} cy={esNivel ? padT+gH-(p.v/3)*gH : yPos(p.v)} r="4" fill={color} stroke="white" strokeWidth="1.5"/>
                      <text x={xPos(p.fi)} y={(esNivel ? padT+gH-(p.v/3)*gH : yPos(p.v))-9} textAnchor="middle" fill={color} fontSize="11" fontFamily="monospace" fontWeight="bold">
                        {esNivel ? String(monitoreos.find(m=>m.lote===lote&&m.fecha===fechas[p.fi])?.[plaga]||"").substring(0,1) : p.v}
                      </text>
                    </g>
                  ))}
                </g>
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

// ── GRAFICO ESPECIES ──────────────────────────────────────────
const COLORES_ESPECIES = ["#2d7a3a","#c0392b","#2980b9","#8e44ad","#c97a1a","#16a085","#d35400","#2c3e50"];

function GraficoEspecies({ monitoreos }) {
  const [plaga, setPlaga] = useState("chinches");
  const [lote, setLote] = useState("todos");

  const detalleKey = plaga === "chinches" ? "chinches_detalle" : "isocas_detalle";
  const lotes = ["todos", ...new Set(monitoreos.map(m => m.lote).filter(Boolean))];

  // Filtrar monitoreos que tienen detalle para esta plaga
  const conDetalle = monitoreos
    .filter(m => (lote === "todos" || m.lote === lote) && m[detalleKey] && typeof m[detalleKey] === "object" && Object.keys(m[detalleKey]).length > 0)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // Obtener todas las especies únicas
  const todasEspecies = [...new Set(conDetalle.flatMap(m => Object.keys(m[detalleKey] || {})))];

  // Calcular totales por especie
  const totalesPorEspecie = todasEspecies.map(esp => ({
    esp,
    total: conDetalle.reduce((s, m) => s + (m[detalleKey]?.[esp] || 0), 0),
    color: COLORES_ESPECIES[todasEspecies.indexOf(esp) % COLORES_ESPECIES.length]
  })).sort((a, b) => b.total - a.total);

  // SVG para líneas por especie en el tiempo
  const svgW = Math.max(500, conDetalle.length * 60);
  const svgH = 200;
  const padL = 40, padR = 20, padT = 16, padB = 36;
  const gW = svgW - padL - padR;
  const gH = svgH - padT - padB;
  const maxVal = Math.max(...conDetalle.flatMap(m => Object.values(m[detalleKey] || {})), 1);
  const xPos = (i) => padL + (i / Math.max(conDetalle.length - 1, 1)) * gW;
  const yPos = (v) => padT + gH - (v / maxVal) * gH;

  const sel = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", color: C.text, fontFamily: SANS, fontSize: 12, outline: "none", cursor: "pointer" };

  return (
    <div style={{ marginTop: 24 }}>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: SANS }}>🔬 Evolución por Especie</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <select style={sel} value={plaga} onChange={e => setPlaga(e.target.value)}>
            <option value="chinches">Chinches</option>
            <option value="isocas">Isocas</option>
          </select>
          <select style={sel} value={lote} onChange={e => setLote(e.target.value)}>
            {lotes.slice(0, 50).map(l => <option key={l} value={l}>{l === "todos" ? "Todos los lotes" : l}</option>)}
          </select>
        </div>
      </div>

      {conDetalle.length === 0 ? (
        <div style={{ textAlign: "center", padding: 30, color: C.muted, fontSize: 13 }}>Sin datos de especies para este filtro</div>
      ) : (
        <>
          {/* Gráfico de líneas por especie */}
          <div style={{ overflowX: "auto", marginBottom: 20 }}>
            <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ display: "block" }}>
              {/* Grid */}
              {[0, 0.25, 0.5, 0.75, 1].map(t => (
                <g key={t}>
                  <line x1={padL} y1={padT + gH*(1-t)} x2={svgW-padR} y2={padT + gH*(1-t)} stroke={C.border} strokeWidth="1" strokeDasharray="3,4"/>
                  <text x={padL-5} y={padT + gH*(1-t)+4} textAnchor="end" fill={C.muted} fontSize="9" fontFamily="monospace">{(maxVal*t).toFixed(1)}</text>
                </g>
              ))}
              {/* Ejes */}
              <line x1={padL} y1={padT} x2={padL} y2={padT+gH} stroke={C.borderStrong} strokeWidth="1.5"/>
              <line x1={padL} y1={padT+gH} x2={svgW-padR} y2={padT+gH} stroke={C.borderStrong} strokeWidth="1.5"/>
              {/* Labels eje X */}
              {conDetalle.map((m, i) => (
                <text key={i} x={xPos(i)} y={svgH-8} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">{m.fecha?.slice(5)}</text>
              ))}
              {/* Líneas por especie */}
              {todasEspecies.map((esp, ei) => {
                const color = COLORES_ESPECIES[ei % COLORES_ESPECIES.length];
                let path = "";
                conDetalle.forEach((m, i) => {
                  const v = m[detalleKey]?.[esp] || 0;
                  const x = xPos(i), y = yPos(v);
                  path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
                });
                return (
                  <g key={esp}>
                    <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={ei > 3 ? "5,3" : "none"}/>
                    {conDetalle.map((m, i) => {
                      const v = m[detalleKey]?.[esp] || 0;
                      if (v === 0) return null;
                      return <circle key={i} cx={xPos(i)} cy={yPos(v)} r="4" fill={color} stroke="white" strokeWidth="1.5"><title>{esp}: {v}</title></circle>;
                    })}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Leyenda */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 20 }}>
            {todasEspecies.map((esp, ei) => (
              <div key={esp} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: COLORES_ESPECIES[ei % COLORES_ESPECIES.length], flexShrink: 0 }}/>
                <span style={{ fontSize: 12, color: C.textDim, fontFamily: SANS }}>{esp}</span>
              </div>
            ))}
          </div>

          {/* Tabla resumen */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", fontSize: 11, color: C.textDim, letterSpacing: 1.5, borderBottom: `1px solid ${C.border}`, fontFamily: F, textTransform: "uppercase" }}>Resumen por Especie</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>{["ESPECIE", "TOTAL CONTADO", "MONITOREOS", "PROMEDIO"].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 16px", fontSize: 10, color: C.muted, letterSpacing: 1.2, fontFamily: F }}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {totalesPorEspecie.map(({ esp, total, color }) => {
                  const apariciones = conDetalle.filter(m => (m[detalleKey]?.[esp] || 0) > 0).length;
                  const prom = apariciones > 0 ? (total / apariciones).toFixed(1) : "—";
                  return (
                    <tr key={esp} style={{ borderTop: `1px solid ${C.border}` }}>
                      <td style={{ padding: "10px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }}/>
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{esp}</span>
                        </div>
                      </td>
                      <td style={{ padding: "10px 16px", fontFamily: F, fontSize: 13, fontWeight: 700, color: C.accent }}>{total}</td>
                      <td style={{ padding: "10px 16px", fontSize: 13, color: C.textDim }}>{apariciones}</td>
                      <td style={{ padding: "10px 16px", fontFamily: F, fontSize: 13, color: C.textDim }}>{prom}</td>
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


// Plagas que usan nivel textual BAJA/MEDIA/ALTA
const PLAGAS_NIVEL = ["pulgones", "trips", "aranhuelas", "caracol"];

function generarAlertas(monitoreos, umbralesOverride) {
  const U = umbralesOverride || UMBRALES;
  const alertas = [];
  monitoreos.forEach(m => {
    Object.entries(U).forEach(([plaga, umbral]) => {
      if (PLAGAS_NIVEL.includes(plaga)) {
        // Alerta cuando nivel es MEDIA (warn) o ALTA (danger)
        const nivel = (m[plaga] || "").toString().toUpperCase();
        if (nivel === "MEDIA") {
          alertas.push({ id: `${m.id}-${plaga}`, empresa: m.empresa, campo: m.campo, lote: m.lote, tipo: "warn", msg: `${plaga.charAt(0).toUpperCase() + plaga.slice(1)}: nivel MEDIO`, fecha: m.fecha, monitoreoId: m.id });
        } else if (nivel === "ALTA") {
          alertas.push({ id: `${m.id}-${plaga}`, empresa: m.empresa, campo: m.campo, lote: m.lote, tipo: "danger", msg: `${plaga.charAt(0).toUpperCase() + plaga.slice(1)}: nivel ALTO`, fecha: m.fecha, monitoreoId: m.id });
        }
        return;
      }
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
function EditarMonitoreo({ m, onBack, onSaved, session }) {
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
          Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`,
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
            ["Chicharrita", "chicharrita"], ["Chicharrita daño %", "chicharrita_dano"],
            ["Cogollero", "cogollero"], ["Cogollero daño %", "cogollero_dano"]
          ].map(([l, k]) => inp(l, k, "number"))}
          {[["Pulgones", "pulgones"], ["Trips", "trips"], ["Arañuelas", "aranhuelas"]].map(([l, k]) => (
            <div key={k}>
              <label style={labelSt}>{l}</label>
              <select value={form[k] ?? ""} onChange={e => set(k, e.target.value || null)}
                style={{ ...inputSt, cursor: "pointer" }}>
                <option value="">—</option>
                <option value="BAJO">BAJO</option>
                <option value="MEDIA">MEDIA</option>
                <option value="ALTA">ALTA</option>
              </select>
            </div>
          ))}
          {inp("Pulgones daño %", "pulgones_dano", "number")}
          {inp("Trips daño %", "trips_dano", "number")}
          {inp("Arañuelas daño %", "aranhuelas_dano", "number")}
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
                <div style={{ color: "#7ab585", fontSize: 11 }}>Generado por Claude Sonnet · Ing. Agr. Ignacio Herrera</div>
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
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 600, lineHeight: 1.5 }}>{resultado.resumen || resultado.summary}</div>
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
  const plagas = [
    ["Isocas", m.isocas, m.isocas_dano, "% defol.", "isocas"],
    ["Chinches", m.chinches, m.chinches_dano, "ninfas/m", "chinches"],
    ["Pulgones", m.pulgones, null, null, "pulgones"],
    ["Trips", m.trips, null, null, "trips"],
    ["Arañuelas", m.aranhuelas, m.aranhuelas_dano ? `Ubicación: ${m.aranhuelas_dano}` : null, null, "aranhuelas"],
    ["Chicharrita", m.chicharrita, m.chicharrita_dano, "% afect.", "chicharrita"],
    ["Cogollero", m.cogollero, m.cogollero_dano, "% afect.", "cogollero"],
    ["Gusano espiga", m.gusano_espiga != null ? m.gusano_espiga + "/100" : null, null, null, "gusano_espiga"],
    ["Caracol", m.caracol, null, null, "caracol"],
  ].filter(([, v]) => v != null && v !== "");
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
                const isNivel = PLAGAS_NIVEL.includes(key);
                const sup = isNivel ? qty === "ALTA" : parseFloat(qty) >= (UMBRALES[key] || 999);
                const warn = isNivel && qty === "MEDIA";
                const detalle = key === "chinches" ? m.chinches_detalle : key === "isocas" ? m.isocas_detalle : null;
                const detalleEntries = detalle && typeof detalle === "object" ? Object.entries(detalle) : [];
                return (
                  <tr key={name} style={{ borderTop: `1px solid ${C.border}` }}>
                    <td style={{ padding: "11px 18px", color: C.text, fontSize: 13, fontWeight: 500 }}>
                      <div>{name}</div>
                      {detalleEntries.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
                          {detalleEntries.map(([esp, cnt]) => (
                            <span key={esp} style={{ background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 5, padding: "2px 8px", fontSize: 10, color: C.accent, fontFamily: F }}>
                              {esp}: {cnt}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "11px 18px", fontFamily: F, color: sup ? C.danger : C.accent, fontSize: 13, fontWeight: 700 }}>{qty}</td>
                    <td style={{ padding: "11px 18px", color: C.textDim, fontSize: 13 }}>{dano ? `${dano} ${unit}` : "—"}</td>
                    <td style={{ padding: "11px 18px" }}><Badge type={sup ? "danger" : warn ? "warn" : "ok"} /></td>
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
  borderRadius: 10, padding: "11px 14px", color: C.text,
  fontFamily: SANS, fontSize: 14, outline: "none", boxSizing: "border-box",
  minHeight: 44
};
const labelSt = { fontSize: 12, color: C.textDim, marginBottom: 6, fontFamily: F, letterSpacing: 0.5, display: "block", fontWeight: 600 };


// ── COMPARATIVA ENTRE CAMPAÑAS ────────────────────────────────
function ComparativaCampanias({ monitoreos, setMonitoreos, aplicaciones = [], session }) {
  const plagas = ["isocas","chinches","pulgones","chicharrita","trips","aranhuelas","cogollero","gusano_espiga"];
  const plagaLabels = { isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero", gusano_espiga:"Gusano Espiga" };
  const COLORES_CAMPANA = ["#2d7a3a","#c0392b","#2980b9","#8e44ad","#c97a1a","#16a085","#d35400","#2c3e50"];

  const [plaga, setPlaga] = useState("isocas");
  const [lote, setLote] = useState("");
  const [campo, setCampo] = useState("");
  const [cultivoComp, setCultivoComp] = useState("");
  const [lotesSeleccionados, setLotesSeleccionados] = useState([]);
  const [fechaDesde, setFechaDesde] = useState(() => { const d = new Date(); const y = d.getMonth() < 11 ? d.getFullYear() - 1 : d.getFullYear(); return `${y}-12-10`; });
  const [fechaHasta, setFechaHasta] = useState("");
  const [tooltipApp, setTooltipApp] = useState(null);
  const [editPunto, setEditPunto] = useState(null); // { ids, fecha, lote, val, plaga, monitoreos }
  const [editVal, setEditVal] = useState("");
  const [editFecha, setEditFecha] = useState("");
  const [editMonId, setEditMonId] = useState(null); // id del monitoreo individual seleccionado
  const [savingPunto, setSavingPunto] = useState(false);

  const toggleLoteComp = (l) => setLotesSeleccionados(prev =>
    prev.includes(l) ? prev.filter(x => x !== l) : prev.length >= 4 ? prev : [...prev, l]
  );

  // Extraer opciones únicas
  const lotes = [...new Set(monitoreos.map(m => m.lote).filter(Boolean))].sort();
  const campos = [...new Set(monitoreos.map(m => m.campo).filter(Boolean))].sort();
  // Normalizar cultivos: "SOJA" → "Soja 1ra", "MAIZ" → "Maíz", etc.
  const CULT_NORM = {
    "SOJA":"Soja 1ra","SOJA 1RA":"Soja 1ra","SOJA1RA":"Soja 1ra","SOJA1":"Soja 1ra",
    "SOJA 1":"Soja 1ra","SOJA 2DA":"Soja 2da","SOJA2DA":"Soja 2da","SOJA 2":"Soja 2da",
    "SOJA 3RA":"Soja 3ra","MAIZ":"Maíz","MAÍZ":"Maíz","MAIZ 2DA":"Maíz 2da",
    "MAÍZ 2DA":"Maíz 2da","TRIGO":"Trigo","GIRASOL":"Girasol","SORGO":"Sorgo",
    "CEBADA":"Cebada","ALGODON":"Algodón","ALGODÓN":"Algodón",
  };
  const normCultivo = c => CULT_NORM[(c||"").toUpperCase().trim()] || c;
  const cultivosComp = [...new Set(monitoreos.filter(m => !campo || m.campo === campo).map(m => normCultivo(m.cultivo)).filter(Boolean))].sort();

  // Filtrar por lote/campo/cultivo seleccionado
  const mFiltrados = monitoreos.filter(m =>
    (!lote || m.lote === lote) &&
    (!campo || m.campo === campo) &&
    (!cultivoComp || normCultivo(m.cultivo) === cultivoComp) &&
    m.fecha && m[plaga] != null && m[plaga] !== "" &&
    (!fechaDesde || m.fecha >= fechaDesde) &&
    (!fechaHasta || m.fecha <= fechaHasta)
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

  // Por cada campaña, agrupar datos por día-de-campaña y promediar (línea promedio)
  const seriesPorCampana = campanias.map((camp, ci) => {
    const datos = mFiltrados
      .filter(m => getCampana(m.fecha) === camp)
      .map(m => ({ dia: getDiaCampana(m.fecha), val: parseFloat(m[plaga]) || 0, fecha: m.fecha, id: m.id, lote: m.lote }))
      .sort((a, b) => a.dia - b.dia);

    const porFecha = {};
    datos.forEach(d => {
      if (!porFecha[d.fecha]) porFecha[d.fecha] = { dia: d.dia, vals: [], monitoreos: [] };
      porFecha[d.fecha].vals.push(d.val);
      porFecha[d.fecha].monitoreos.push({ id: d.id, lote: d.lote, val: d.val });
    });
    const umbralPlaga = UMBRALES[plaga] || 1;
    // Promedio entre lotes por fecha (representa el campo), máximo guardado para tooltip
    const puntos = Object.entries(porFecha).map(([fecha, p]) => {
      const prom = p.vals.reduce((s,v) => s+v, 0) / p.vals.length;
      const maximo = Math.max(...p.vals);
      const superan = p.vals.filter(v => v >= umbralPlaga).length;
      return {
        dia: p.dia, fecha: fecha,
        val: prom,
        prom: prom,
        maximo: maximo,
        n: p.vals.length,
        superan: superan,
        ids: p.monitoreos.map(m => m.id),
        monitoreos: p.monitoreos
      };
    }).sort((a,b) => a.dia - b.dia);

    return { campana: camp, color: COLORES_CAMPANA[ci % COLORES_CAMPANA.length], puntos };
  });

  // Lotes disponibles para elegir (filtrados por campo y cultivo)
  const lotesDisponibles = !lote
    ? [...new Set(mFiltrados.map(m => m.lote).filter(Boolean))].sort()
    : [];
  const COLORES_LOTES_COMP = ["#2980b9","#8e44ad","#c97a1a","#16a085","#d35400","#e74c3c","#1abc9c","#e67e22"];

  // Líneas por lote — solo los seleccionados (máx 4)
  const seriesPorLote = (lote ? [] : lotesSeleccionados).map((lt, li) => {
    const campActiva = campanias[campanias.length - 1];
    const datos = monitoreos
      .filter(m => m.lote === lt && getCampana(m.fecha) === campActiva && m[plaga] != null && m[plaga] !== "" &&
        (!fechaDesde || m.fecha >= fechaDesde) && (!fechaHasta || m.fecha <= fechaHasta))
      .map(m => ({ dia: getDiaCampana(m.fecha), val: parseFloat(m[plaga]) || 0, fecha: m.fecha, id: m.id, lote: m.lote }))
      .sort((a,b) => a.dia - b.dia);
    const porFecha = {};
    datos.forEach(d => {
      if (!porFecha[d.fecha]) porFecha[d.fecha] = { dia: d.dia, vals: [], ids: [], lote: d.lote };
      porFecha[d.fecha].vals.push(d.val);
      porFecha[d.fecha].ids.push(d.id);
    });
    const umbralPlaga2 = UMBRALES[plaga] || 1;
    const puntos = Object.entries(porFecha).map(([fecha, p]) => {
      const prom = p.vals.reduce((s,v) => s+v, 0) / p.vals.length;
      const maximo = Math.max(...p.vals);
      const superan = p.vals.filter(v => v >= umbralPlaga2).length;
      return {
        dia: p.dia, fecha: fecha,
        val: maximo,
        prom: prom,
        maximo: maximo,
        n: p.vals.length,
        superan: superan,
        ids: p.ids, lote: p.lote
      };
    }).sort((a,b) => a.dia - b.dia);
    const colorIdx = lotesSeleccionados.indexOf(lt);
    return { lote: lt, color: COLORES_LOTES_COMP[colorIdx % COLORES_LOTES_COMP.length], puntos };
  }).filter(s => s.puntos.length > 0);

  // SVG dimensions
  const svgW = 960;
  const svgH = 320;
  const padL = 44, padR = 160, padT = 20, padB = 32;
  const gW = svgW - padL - padR;
  const gH = svgH - padT - padB;

  const todosLosDias = seriesPorCampana.flatMap(s => s.puntos.map(p => p.dia));
  const hayFiltroFecha = fechaDesde || fechaHasta;
  const minDia = hayFiltroFecha && todosLosDias.length > 0 ? Math.max(0, Math.min(...todosLosDias) - 10) : 0;
  const maxDia = hayFiltroFecha && todosLosDias.length > 0 ? Math.min(365, Math.max(...todosLosDias) + 10) : Math.max(...todosLosDias, 365);
  const maxVal = Math.max(...seriesPorCampana.flatMap(s => s.puntos.map(p => p.val)), ...seriesPorLote.flatMap(s => s.puntos.map(p => p.val)), 1);

  const xPos = (dia) => padL + ((dia - minDia) / (maxDia - minDia)) * gW;
  const yPos = (val) => padT + gH - (val / maxVal) * gH;

  // Meses labels (eje X — meses de campaña Jul=0)
  const mesesLabel = ["Jul","Ago","Sep","Oct","Nov","Dic","Ene","Feb","Mar","Abr","May","Jun"];
  const mesesDias  = [0, 31, 62, 92, 123, 153, 184, 215, 244, 275, 305, 336];
  // Filtrar solo los meses visibles en el rango actual
  const mesesVisibles = mesesLabel.map((m, i) => ({ label: m, dia: mesesDias[i] }))
    .filter(m => m.dia >= minDia - 15 && m.dia <= maxDia + 15);

  // Estadísticas comparativas
  const statsData = seriesPorCampana.map(s => {
    const vals = s.puntos.map(p => p.val);
    const max = vals.length > 0 ? Math.max(...vals) : 0;
    const prom = vals.length > 0 ? (vals.reduce((a,b) => a+b, 0) / vals.length) : 0;
    const superan = s.puntos.filter(p => p.val >= (UMBRALES[plaga] || 1)).length;
    return { campana: s.campana, color: s.color, max, prom, superan, n: vals.length };
  });

  // Aplicaciones para el lote/campo seleccionado, convertidas a día-de-campaña
  // Lotes activos en el gráfico (lote específico, o los seleccionados, o todos los del cultivo filtrado)
  const lotesActivos = lote
    ? [lote]
    : lotesSeleccionados.length > 0
      ? lotesSeleccionados
      : null; // null = todos (cuando hay cultivo, el campo ya filtra)

  const appsEnGrafico = aplicaciones.filter(a =>
    (!campo || a.campo_nombre === campo) &&
    (lotesActivos === null || lotesActivos.some(l => a.lote_nombre === l || (a.lote_nombre||"").includes(l) || l.includes(a.lote_nombre||""))) &&
    a.fecha &&
    (a.es_insecticida === true || a.es_insecticida === "true" || a.es_insecticida === 1 || (a.tipo_aplicacion||"").toLowerCase().includes("insect") || (a.diagnostico||"").toLowerCase().includes("insect") || (a.plaga_objetivo||"").toLowerCase().includes("insect") || (a.productos||[]).some(p => (p.producto_nombre||"").toLowerCase().includes("insect")) || ["PIRATE","BIFENTRIN","CORAGEN","ABAMECTINA","CIPERMETRINA","LAMBDACIALOTRINA","CLORPIRIFOS","DIMETOATO","IMIDACLOPRID","ACETAMIPRID","SPINOSAD","EMAMECTINA"].some(i => (a.productos||[]).some(p => (p.producto_nombre||"").toUpperCase().includes(i))))
  ).map(a => ({
    fecha: a.fecha,
    dia: getDiaCampana(a.fecha),
    campana: getCampana(a.fecha),
    tipo: a.tipo_aplicacion || "Insecticida",
    lote: a.lote_nombre,
    plaga: a.plaga_objetivo || "",
    productos: (a.productos || []).map(p => p.producto_nombre).join(", ")
  }));

  const sel = {
    background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8,
    padding: "7px 12px", color: C.text, fontFamily: SANS, fontSize: 12, outline: "none", cursor: "pointer"
  };

  return (
    <>
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
          <select style={sel} value={campo} onChange={e => { setCampo(e.target.value); setLote(""); setCultivoComp(""); setLotesSeleccionados([]); }}>
            <option value="">Todos los campos</option>
            {campos.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {cultivosComp.length > 1 && (
            <select style={sel} value={cultivoComp} onChange={e => { setCultivoComp(e.target.value); setLotesSeleccionados([]); }}>
              <option value="">Todos los cultivos</option>
              {cultivosComp.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
          <select style={sel} value={lote} onChange={e => { setLote(e.target.value); setLotesSeleccionados([]); }}>
            <option value="">Todos los lotes</option>
            {lotes.filter(l => !campo || monitoreos.some(m => m.lote === l && m.campo === campo)).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "4px 10px" }}>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: F, whiteSpace: "nowrap" }}>Desde</span>
            <input type="date" value={fechaDesde} onChange={e => setFechaDesde(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", fontFamily: "monospace", fontSize: 13, color: C.text, cursor: "pointer", padding: "4px 0" }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface, border: "1px solid " + C.border, borderRadius: 8, padding: "4px 10px" }}>
            <span style={{ fontSize: 11, color: C.textDim, fontFamily: F, whiteSpace: "nowrap" }}>Hasta</span>
            <input type="date" value={fechaHasta} onChange={e => setFechaHasta(e.target.value)}
              style={{ background: "none", border: "none", outline: "none", fontFamily: "monospace", fontSize: 13, color: C.text, cursor: "pointer", padding: "4px 0" }}
            />
          </div>
          {(fechaDesde || fechaHasta) && (
            <button onClick={() => { setFechaDesde(""); setFechaHasta(""); }}
              style={{ background: "none", border: "1px solid " + C.border, borderRadius: 8, padding: "7px 14px", color: C.textDim, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
              ✕ Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Selector de lotes para comparar — solo cuando no hay lote específico */}
      {!lote && lotesDisponibles.length > 0 && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.muted, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
            Seleccioná lotes para comparar (máx. 4) {lotesSeleccionados.length > 0 && <span style={{ color: C.accent }}>— {lotesSeleccionados.length} seleccionado{lotesSeleccionados.length > 1 ? "s" : ""}</span>}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {lotesDisponibles.map((l) => {
              const isSel = lotesSeleccionados.includes(l);
              const colorIdx = lotesSeleccionados.indexOf(l);
              const color = isSel ? COLORES_LOTES_COMP[colorIdx % COLORES_LOTES_COMP.length] : C.border;
              return (
                <button key={l} onClick={() => toggleLoteComp(l)}
                  disabled={!isSel && lotesSeleccionados.length >= 4}
                  style={{ padding: "5px 12px", borderRadius: 20, border: `2px solid ${color}`,
                    background: isSel ? color + "18" : C.bg,
                    color: isSel ? color : C.textDim,
                    fontSize: 11, fontWeight: isSel ? 700 : 400,
                    cursor: (!isSel && lotesSeleccionados.length >= 4) ? "not-allowed" : "pointer",
                    opacity: (!isSel && lotesSeleccionados.length >= 4) ? 0.4 : 1,
                    display: "flex", alignItems: "center", gap: 5 }}>
                  {isSel && <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }}/>}
                  {l}
                </button>
              );
            })}
            {lotesSeleccionados.length > 0 && (
              <button onClick={() => setLotesSeleccionados([])}
                style={{ padding: "5px 12px", borderRadius: 20, border: `1px solid ${C.border}`, background: C.bg, color: C.muted, fontSize: 11, cursor: "pointer" }}>
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>
      )}

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
                {mesesVisibles.map(({ label, dia }) => (
                  <text key={label} x={xPos(dia)} y={svgH-6} textAnchor="middle" fill={C.muted} fontSize="9" fontFamily="monospace">{label}</text>
                ))}
                {/* Líneas verticales de aplicaciones */}
                {appsEnGrafico.map((ap, i) => {
                  const x = xPos(ap.dia);
                  const isActive = tooltipApp && tooltipApp.ap === ap;
                  return (
                    <g key={"app-" + i}
                      onClick={e => { e.stopPropagation(); setTooltipApp(isActive ? null : { x, ap }); }}
                      onMouseEnter={() => setTooltipApp({ x, ap })}
                      onMouseLeave={() => setTooltipApp(null)}
                      style={{ cursor: "pointer" }}
                    >
                      <line x1={x} y1={padT} x2={x} y2={padT+gH} stroke="#e67e22" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.8"/>
                      {/* Triángulo más grande y visible */}
                      <polygon points={`${x},${padT} ${x-8},${padT-14} ${x+8},${padT-14}`} fill="#e67e22" opacity={isActive ? 1 : 0.85} stroke="white" strokeWidth="1"/>
                      {/* Zona invisible amplia para facilitar el click */}
                      <rect x={x-16} y={padT-18} width={32} height={gH+18} fill="transparent"/>
                    </g>
                  );
                })}
                {/* Tooltip de aplicación */}
                {tooltipApp && (() => {
                  const { x, ap } = tooltipApp;
                  const lines = [
                    "💊 " + (ap.tipo || "Insecticida") + (ap.plaga ? " — " + ap.plaga : ""),
                    ap.fecha,
                    ...(ap.productos ? ap.productos.split(", ") : [])
                  ];
                  const tw = Math.max(180, Math.max(...lines.map(l => l.length)) * 7 + 24);
                  const th = lines.length * 18 + 16;
                  // Posicionar a la derecha del triángulo si hay espacio, sino a la izquierda
                  const tx = x + 14 + tw > svgW - padR ? x - tw - 14 : x + 14;
                  const ty = padT;
                  return (
                    <g style={{ pointerEvents: "none" }}>
                      <rect x={tx} y={ty} width={tw} height={th} rx="6" fill="#1e3a23" stroke="#4ae87a" strokeWidth="1" opacity="0.97"/>
                      {lines.map((line, i) => (
                        <text key={i} x={tx + 10} y={ty + 15 + i * 18}
                          fill={i === 0 ? "#f0c040" : i === 1 ? "#94b09a" : "#e8f5eb"}
                          fontSize={i === 0 ? "11" : "10"}
                          fontFamily="monospace"
                          fontWeight={i === 0 ? "700" : "400"}
                        >{line}</text>
                      ))}
                    </g>
                  );
                })()}
                {/* Líneas por lote (cuando todos los lotes) */}
                {seriesPorLote.map(s => {
                  if (s.puntos.length < 1) return null;
                  let path = "";
                  s.puntos.forEach((p, i) => {
                    const x = xPos(p.dia), y = yPos(p.val);
                    path += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
                  });
                  const ultimo = s.puntos[s.puntos.length - 1];
                  const lx = xPos(ultimo.dia);
                  const ly = yPos(ultimo.val);
                  return (
                    <g key={"lote-"+s.lote}>
                      <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
                      {s.puntos.map((p, i) => (
                        <circle key={i} cx={xPos(p.dia)} cy={yPos(p.val)} r="5" fill={s.color} stroke="white" strokeWidth="1.5"
                          style={{ cursor: "pointer" }}
                          onClick={() => { setEditPunto({ ids: p.ids, fecha: p.fecha, lote: s.lote, val: p.val, plaga }); setEditVal(String(p.val.toFixed(1))); setEditFecha(p.fecha); }}>
                          <title>Click para editar · {s.lote} · {p.fecha}&#10;Máx: {p.val.toFixed(1)} · Prom: {p.prom?.toFixed(1)} · {p.n} estaciones{p.superan > 0 ? ` · ${p.superan} sobre umbral` : ""}</title>
                        </circle>
                      ))}
                      <rect x={lx+6} y={ly-9} width={s.lote.length*5.5+8} height={14} rx="3" fill={s.color} opacity="0.9"/>
                      <text x={lx+10} y={ly+2} fill="white" fontSize="8" fontFamily="monospace" fontWeight="bold">{s.lote}</text>
                    </g>
                  );
                })}
                {/* Líneas por campaña (promedio — más gruesas) */}
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
                        <circle key={i} cx={xPos(p.dia)} cy={yPos(p.val)} r="5" fill={s.color} stroke="white" strokeWidth="1.5"
                          style={{ cursor: "pointer" }}
                          onClick={() => { const mon = p.monitoreos || []; const soloUno = mon.length === 1; setEditPunto({ ids: p.ids, fecha: p.fecha, lote: s.campana, val: p.val, plaga, monitoreos: mon }); setEditVal(soloUno ? String(mon[0].val.toFixed(1)) : String(p.val.toFixed(1))); setEditFecha(p.fecha); setEditMonId(soloUno ? mon[0].id : null); }}>
                          <title>Click para editar · {p.fecha}&#10;Máx: {p.val.toFixed(1)} · Prom: {p.prom?.toFixed(1)} · {p.n} estaciones{p.superan > 0 ? ` · ${p.superan} sobre umbral` : ""}</title>
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
                  <span style={{ fontSize: 12, color: C.textDim, fontWeight: 600 }}>Promedio campo {s.campana}</span>
                </div>
              ))}
              {seriesPorLote.map(s => (
                <div key={"leg-"+s.lote} style={{ display: "flex", alignItems: "center", gap: 6, background: s.color+"15", border: `1.5px solid ${s.color}`, borderRadius: 20, padding: "3px 10px" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.color, display: "inline-block", flexShrink: 0 }}/>
                  <span style={{ fontSize: 11, color: s.color, fontWeight: 700 }}>{s.lote}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabla eficacia aplicaciones antes/después */}
          {appsEnGrafico.length > 0 && (() => {
            // Monitoreo más próximo antes y después de la aplicación
            const filas = appsEnGrafico.map(ap => {
              const fechaAp = new Date(ap.fecha);
              const mLote = monitoreos
                .filter(m => m.lote === ap.lote && m[plaga] != null && m[plaga] !== "")
                .sort((a,b) => new Date(a.fecha)-new Date(b.fecha));

              // Más cercano ANTES (sin límite de días, el último antes de la aplicación)
              const mAntes = mLote.filter(m => new Date(m.fecha) < fechaAp);
              const monAntes = mAntes.length > 0 ? mAntes[mAntes.length - 1] : null;

              // Más cercano DESPUÉS (sin límite de días, el primero después de la aplicación)
              const mDespues = mLote.filter(m => new Date(m.fecha) > fechaAp);
              const monDespues = mDespues.length > 0 ? mDespues[0] : null;

              const valAntes = monAntes ? parseFloat(monAntes[plaga]) || null : null;
              const valDespues = monDespues ? parseFloat(monDespues[plaga]) || null : null;
              const diasAntes = monAntes ? Math.round((fechaAp - new Date(monAntes.fecha)) / 86400000) : null;
              const diasDespues = monDespues ? Math.round((new Date(monDespues.fecha) - fechaAp) / 86400000) : null;

              const reduccion = valAntes != null && valDespues != null && valAntes > 0
                ? ((valAntes - valDespues) / valAntes * 100)
                : null;

              return { ap, valAntes, valDespues, reduccion, diasAntes, diasDespues, fechaAntes: monAntes?.fecha, fechaDespues: monDespues?.fecha };
            }).filter(f => f.valAntes != null || f.valDespues != null);

            if (filas.length === 0) return null;
            return (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)", marginBottom: 16 }}>
                <div style={{ padding: "12px 18px", fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600, borderBottom: `1px solid ${C.border}`, background: C.mutedBg, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#e67e22" }}>▼</span> Eficacia de Aplicaciones — {plagaLabels[plaga]}
                  <span style={{ color: C.muted, fontWeight: 400, fontSize: 10 }}>(monitoreo más próximo antes / después)</span>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>{["LOTE","FECHA APLIC.","PRODUCTOS","ANTES","DESPUÉS","REDUCCIÓN"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: 10, color: C.muted, letterSpacing: 1.2, fontFamily: F, borderBottom: `1px solid ${C.border}`, background: C.mutedBg }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {filas.map(({ ap, valAntes, valDespues, reduccion, diasAntes, diasDespues, fechaAntes, fechaDespues }, i) => {
                      const eficaz = reduccion != null && reduccion > 0;
                      const redColor = reduccion == null ? C.muted : reduccion >= 50 ? C.accent : reduccion > 0 ? C.warn : C.danger;
                      return (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: C.text, fontSize: 12 }}>{ap.lote}</td>
                          <td style={{ padding: "10px 14px", fontFamily: F, fontSize: 11, color: C.textDim }}>{ap.fecha}</td>
                          <td style={{ padding: "10px 14px", fontSize: 11, color: C.textDim, maxWidth: 180 }}>{ap.productos || ap.tipo}</td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            {valAntes != null
                              ? <div>
                                  <span style={{ fontFamily: F, fontWeight: 700, color: valAntes >= (UMBRALES[plaga]||1) ? C.danger : C.textDim }}>{valAntes.toFixed(1)}</span>
                                  <div style={{ fontSize: 9, color: C.muted }}>{fechaAntes} <span style={{ color: C.accent }}>({diasAntes}d antes)</span></div>
                                </div>
                              : <span style={{ color: C.muted }}>—</span>}
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            {valDespues != null
                              ? <div>
                                  <span style={{ fontFamily: F, fontWeight: 700, color: valDespues >= (UMBRALES[plaga]||1) ? C.danger : C.accent }}>{valDespues.toFixed(1)}</span>
                                  <div style={{ fontSize: 9, color: C.muted }}>{fechaDespues} <span style={{ color: C.accent }}>({diasDespues}d después)</span></div>
                                </div>
                              : <span style={{ color: C.muted }}>—</span>}
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "center" }}>
                            {reduccion != null
                              ? <span style={{ fontFamily: F, fontWeight: 700, color: redColor, background: redColor+"18", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                                  {reduccion > 0 ? "↓" : "↑"} {Math.abs(reduccion).toFixed(0)}%
                                </span>
                              : <span style={{ color: C.muted, fontSize: 11 }}>Sin datos</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          })()}

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

    {/* Modal edición de punto */}
    {editPunto && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
        onClick={e => { if (e.target === e.currentTarget) setEditPunto(null); }}>
        <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 360, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 4 }}>✏️ Editar valor</div>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: editPunto.monitoreos?.length > 1 ? 10 : 20 }}>
            {editPunto.lote} · {editPunto.fecha} · {plagaLabels[editPunto.plaga]}
          </div>
          {editPunto.monitoreos?.length > 1 && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Editá cada lote</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 220, overflowY: "auto" }}>
                {editPunto.monitoreos.map(m => {
                  const isActive = editMonId === m.id;
                  return (
                    <div key={m.id} onClick={() => { setEditMonId(m.id); setEditVal(String(m.val.toFixed(1))); }}
                      style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 8,
                        border: `2px solid ${isActive ? C.accent : C.border}`,
                        background: isActive ? C.accentLight : C.bg,
                        cursor: "pointer" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flex: 1 }}>{m.lote}</span>
                      {isActive ? (
                        <input
                          type="number" step="0.1" min="0"
                          value={editVal}
                          onChange={e => setEditVal(e.target.value)}
                          onClick={e => e.stopPropagation()}
                          autoFocus
                          style={{ width: 80, background: C.surface, border: `1px solid ${C.accent}`, borderRadius: 6,
                            padding: "4px 8px", fontSize: 15, fontWeight: 700, color: C.accent, outline: "none", textAlign: "center" }}
                        />
                      ) : (
                        <span style={{ fontSize: 13, fontFamily: F, color: C.textDim, minWidth: 40, textAlign: "right" }}>{m.val.toFixed(1)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* Fecha solo si hay 1 monitoreo o está seleccionado */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Fecha</label>
            <input type="date" value={editFecha} onChange={e => setEditFecha(e.target.value)}
              style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 13, color: C.text, outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setEditPunto(null)}
              style={{ flex: 1, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px", color: C.textDim, fontSize: 13, cursor: "pointer" }}>
              Cancelar
            </button>
            <button disabled={savingPunto} onClick={async () => {
              setSavingPunto(true);
              const tok = await getValidToken();
              const val = parseFloat(editVal);
              if (isNaN(val)) { setSavingPunto(false); return; }
              const ids = editMonId
                ? [editMonId]
                : (editPunto.monitoreos||[]).length === 1
                  ? [(editPunto.monitoreos[0].id)].filter(Boolean)
                  : (editPunto.ids || []).filter(Boolean);
              if (ids.length === 0) { alert("Seleccioná un lote para editar."); setSavingPunto(false); return; }
              const body = { [editPunto.plaga]: val };
              if (editFecha && editFecha !== editPunto.fecha) body.fecha = editFecha;
              try {
                for (const id of ids) {
                  const res = await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                    body: JSON.stringify(body)
                  });
                  if (!res.ok) { const err = await res.text(); throw new Error(err); }
                }
                setMonitoreos(prev => prev.map(m => ids.includes(m.id) ? { ...m, ...body } : m));
                // Actualizar el valor en los monitoreos del modal para reflejar el cambio
                setEditPunto(prev => prev ? ({
                  ...prev,
                  monitoreos: (prev.monitoreos||[]).map(m => ids.includes(m.id) ? { ...m, val: parseFloat(editVal)||m.val } : m)
                }) : null);
                // Si hay 1 solo monitoreo, mantener seleccionado para re-editar
                if ((editPunto.monitoreos||[]).length > 1) { setEditMonId(null); setEditVal(""); }
                // Si hay 1 monitoreo, mantener el valor para referencia
              } catch(e) { alert("Error al guardar: " + e.message); }
              finally { setSavingPunto(false); }
            }}
              style={{ flex: 1, background: C.accent, border: "none", borderRadius: 8, padding: "10px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: savingPunto ? "wait" : "pointer", opacity: savingPunto ? 0.7 : 1 }}>
              {savingPunto ? "Guardando..." : "💾 Guardar"}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}


// ── SEGUIMIENTO POST-APLICACION ───────────────────────────────
function SeguimientoAplicacion({ aplicacion, monitoreos }) {
  const plagas = ["isocas","chinches","pulgones","chicharrita","trips","aranhuelas","cogollero","gusano_espiga"];
  const plagaLabels = { isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero", gusano_espiga:"Gusano Espiga" };

  // Solo mostrar evolución de plagas para insecticidas
  const esInsecticida = aplicacion.productos?.some(p =>
    (p.producto_nombre || "").toLowerCase().startsWith("insecticida")
  ) || (aplicacion.tipo_aplicacion || "").toLowerCase().includes("insecticida");

  // Monitoreos del mismo lote
  const mLote = monitoreos
    .filter(m => m.lote === aplicacion.lote_nombre && m.fecha)
    .sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

  const fechaApp = new Date(aplicacion.fecha);

  // Monitoreos antes (hasta 30 días antes) y después (hasta 60 días después)
  const mAntes   = mLote.filter(m => { const d = new Date(m.fecha); return d < fechaApp && d >= new Date(fechaApp - 30*86400000); });
  const mDespues = mLote.filter(m => { const d = new Date(m.fecha); return d > fechaApp && d <= new Date(fechaApp.getTime() + 60*86400000); });

  if (!esInsecticida) return null;

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
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    </style>
    </head><body>
    <h1>🌱 Ing. Agr. Ignacio Herrera — ${title}</h1>
    <div class="meta">Generado el ${new Date().toLocaleString("es-AR")} · agromonitoreo-admin.vercel.app</div>
    ${html}
    </body></html>
  `);
  win.document.close();
  win.onload = () => { win.focus(); };
};

// Botón reutilizable de exportación
const generarInformePDF = ({ monitoreos, aplicaciones, alertas, empresa, campo, periodo }) => {
  const UMBRALES_DEF = { isocas: 4, chinches: 1, pulgones: 3, chicharrita: 1, trips: 5, aranhuelas: 2, cogollero: 10 };
  const plagaLabels = { isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero" };
  const hoy = new Date().toLocaleDateString("es-AR", { year:"numeric", month:"long", day:"numeric" });
  const tituloReporte = [empresa, campo, periodo].filter(Boolean).join(" · ");

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
<title>Informe Ing. Agr. Ignacio Herrera — ${empresa || "Todas las empresas"}</title>
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
    <div class="header-logo">🌱 Ing. Agr. Ignacio Herrera</div>
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
  <span>Ing. Agr. Ignacio Herrera · Panel Administrador · agromonitoreo-admin.vercel.app</span>
  <span>Generado el ${hoy} · Informe automático</span>
</div>

</body></html>`;

  const btnHtml = `<style>
  #btn-descargar {
    position: fixed; top: 16px; right: 16px; z-index: 9999;
    background: #1a2e1d; color: #4ae87a; border: 1.5px solid #4ae87a;
    border-radius: 8px; padding: 10px 22px; font-size: 14px;
    font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 700;
    cursor: pointer; box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  }
  #btn-descargar:hover { background: #4ae87a; color: #1a2e1d; }
  @media print { #btn-descargar { display: none !important; } }
</style>
<button id="btn-descargar" onclick="window.print()">⬇ Descargar / Imprimir</button>`;
  const htmlFinal = html.replace("</body>", btnHtml + "</body>");
  const win = window.open("", "_blank");
  win.document.write(htmlFinal);
  win.document.close();
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
  const plagas = ["isocas", "chinches", "pulgones", "chicharrita", "trips", "aranhuelas", "cogollero", "gusano_espiga"];
  const plagaLabels = { isocas: "Isocas", chinches: "Chinches", pulgones: "Pulgones", chicharrita: "Chicharrita", trips: "Trips", aranhuelas: "Arañuelas", cogollero: "Cogollero", gusano_espiga: "Gusano Espiga" };
  const plagaColors = {
    isocas: "#2d7a3a", chinches: "#c0392b", pulgones: "#c97a1a",
    chicharrita: "#8e44ad", trips: "#2980b9", aranhuelas: "#d35400", cogollero: "#16a085", gusano_espiga: "#7b3f00"
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
    if (plaga === "todas") {
      // Normalizar cada plaga contra su umbral y sumar
      const t = plagas.reduce((s, p) => s + Math.min((parseFloat(m[p]) || 0) / (UMBRALES[p] || 1), 1), 0);
      return Math.min(t / plagas.length, 1);
    }
    const val = parseFloat(m[plaga]) || 0;
    return Math.min(val / (UMBRALES[plaga] || 1), 1);
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
              const esNivel = ["pulgones","trips","aranhuelas","caracol"].includes(p);
              const total = mFiltrados.filter(m => m[p] != null && m[p] !== "").length;

              if (esNivel) {
                // Plagas con nivel BAJA/MEDIA/ALTA
                const alta = mFiltrados.filter(m => (m[p]||"").toString().toUpperCase() === "ALTA").length;
                const media = mFiltrados.filter(m => (m[p]||"").toString().toUpperCase() === "MEDIA").length;
                const baja = mFiltrados.filter(m => (m[p]||"").toString().toUpperCase() === "BAJA").length;
                const col = alta > 0 ? C.danger : media > 0 ? C.warn : C.muted;
                return (
                  <div key={p} style={{
                    background: C.surface, border: `1px solid ${alta > 0 ? C.danger+"50" : media > 0 ? C.warn+"50" : C.border}`,
                    borderRadius: 10, padding: "12px 14px", borderTop: `3px solid ${alta > 0 ? C.danger : media > 0 ? C.warn : C.border}`
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 8 }}>{plagaLabels[p]}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {alta > 0 && <div style={{ display: "flex", justifyContent: "space-between", background: C.dangerLight, borderRadius: 5, padding: "3px 8px" }}>
                        <span style={{ fontSize: 11, color: C.danger, fontWeight: 700 }}>ALTA</span>
                        <span style={{ fontSize: 11, color: C.danger, fontWeight: 700, fontFamily: F }}>{alta}</span>
                      </div>}
                      {media > 0 && <div style={{ display: "flex", justifyContent: "space-between", background: C.warnLight, borderRadius: 5, padding: "3px 8px" }}>
                        <span style={{ fontSize: 11, color: C.warn, fontWeight: 700 }}>MEDIA</span>
                        <span style={{ fontSize: 11, color: C.warn, fontWeight: 700, fontFamily: F }}>{media}</span>
                      </div>}
                      {baja > 0 && <div style={{ display: "flex", justifyContent: "space-between", background: C.accentLight, borderRadius: 5, padding: "3px 8px" }}>
                        <span style={{ fontSize: 11, color: C.accent, fontWeight: 700 }}>BAJA</span>
                        <span style={{ fontSize: 11, color: C.accent, fontWeight: 700, fontFamily: F }}>{baja}</span>
                      </div>}
                      {total === 0 && <div style={{ fontSize: 10, color: C.muted, textAlign: "center" }}>Sin datos</div>}
                    </div>
                  </div>
                );
              }

              // Plagas numéricas
              const vals = mFiltrados.map(m => parseFloat(m[p])).filter(v => !isNaN(v) && v > 0);
              const superan = mFiltrados.filter(m => (parseFloat(m[p]) || 0) >= UMBRALES[p]).length;
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


      {/* ── 5. LOTES CRÍTICOS ── */}
      <Accordion title="Lotes Críticos" icon="🚨" defaultOpen={true}>
        <div style={{ marginTop: 12 }}>
          {(() => {
            // Calcular score de criticidad por lote (último monitoreo)
            const porLote = {};
            mFiltrados.forEach(m => {
              if (!m.lote) return;
              const key = `${m.empresa}||${m.lote}`;
              if (!porLote[key] || m.fecha > porLote[key].fecha) porLote[key] = m;
            });
            const lotesCriticos = Object.values(porLote).map(m => {
              const focosSupraUmbral = plagas.filter(p => (parseFloat(m[p]) || 0) >= UMBRALES[p]);
              const scoreTotal = plagas.reduce((s, p) => s + Math.min((parseFloat(m[p]) || 0) / (UMBRALES[p] || 1), 2), 0);
              const diasDesde = Math.floor((new Date() - new Date(m.fecha)) / 86400000);
              return { ...m, focosSupraUmbral, scoreTotal, diasDesde };
            }).filter(m => m.focosSupraUmbral.length > 0 || m.scoreTotal > 0.5)
              .sort((a, b) => b.scoreTotal - a.scoreTotal)
              .slice(0, 10);

            if (lotesCriticos.length === 0) return (
              <div style={{ textAlign: "center", padding: 28, color: C.accent, background: C.accentLight, borderRadius: 8, fontSize: 13 }}>
                ✓ Sin lotes críticos en el período
              </div>
            );
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {lotesCriticos.map((m, i) => {
                  const nivel = m.focosSupraUmbral.length >= 2 ? "danger" : m.focosSupraUmbral.length === 1 ? "warn" : "ok";
                  const colNivel = nivel === "danger" ? C.danger : nivel === "warn" ? C.warn : C.accent;
                  const bgNivel = nivel === "danger" ? C.dangerLight : nivel === "warn" ? C.warnLight : C.accentLight;
                  return (
                    <div key={i} style={{ background: bgNivel, border: `1px solid ${colNivel}30`, borderRadius: 10, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div style={{ fontFamily: F, fontSize: 13, fontWeight: 700, color: colNivel, width: 20, textAlign: "center" }}>{i+1}</div>
                      <div style={{ flex: 1, minWidth: 120 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{m.lote}</div>
                        <div style={{ fontSize: 11, color: C.textDim }}>{m.empresa} · {m.campo}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {m.focosSupraUmbral.map(p => (
                          <span key={p} style={{ background: plagaColors[p] + "20", border: `1px solid ${plagaColors[p]}50`, borderRadius: 5, padding: "2px 8px", fontSize: 11, color: plagaColors[p], fontWeight: 600 }}>
                            {plagaLabels[p]}: {parseFloat(m[p]).toFixed(1)}
                          </span>
                        ))}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: F, whiteSpace: "nowrap" }}>hace {m.diasDesde}d</div>
                      <div style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{m.fecha}</div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </Accordion>

      {/* ── 6. DÍAS SIN MONITOREO + TENDENCIA ── */}
      <Accordion title="Estado de Cobertura por Lote" icon="📅" defaultOpen={false}>
        <div style={{ marginTop: 12 }}>
          {(() => {
            const hoyDate = new Date();
            // Último monitoreo por lote
            const ultimoPorLote = {};
            monitoreos.forEach(m => {
              if (!m.lote) return;
              const key = `${m.empresa}||${m.lote}`;
              if (!ultimoPorLote[key] || m.fecha > ultimoPorLote[key].fecha) ultimoPorLote[key] = m;
            });
            const cobertura = Object.values(ultimoPorLote).map(m => {
              const dias = Math.floor((hoyDate - new Date(m.fecha)) / 86400000);
              // Tendencia: comparar último vs penúltimo monitoreo
              const historial = monitoreos.filter(x => x.lote === m.lote && x.empresa === m.empresa).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
              const scoreActual = plagas.reduce((s, p) => s + (parseFloat(historial[0]?.[p]) || 0), 0);
              const scoreAnterior = plagas.reduce((s, p) => s + (parseFloat(historial[1]?.[p]) || 0), 0);
              const tendencia = historial.length < 2 ? "—" : scoreActual > scoreAnterior * 1.2 ? "↑" : scoreActual < scoreAnterior * 0.8 ? "↓" : "→";
              const tendColor = tendencia === "↑" ? C.danger : tendencia === "↓" ? C.accent : C.warn;
              return { ...m, dias, tendencia, tendColor };
            }).sort((a, b) => b.dias - a.dias);

            const sinMonitoreo = cobertura.filter(m => m.dias > 14);
            const reciente = cobertura.filter(m => m.dias <= 14);

            return (
              <div>
                {sinMonitoreo.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: C.danger, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                      ⚠ Sin monitoreo reciente (+14 días) — {sinMonitoreo.length} lote{sinMonitoreo.length > 1 ? "s" : ""}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
                      {sinMonitoreo.map((m, i) => (
                        <div key={i} style={{ background: C.dangerLight, border: `1px solid ${C.danger}30`, borderRadius: 8, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 12, color: C.text }}>{m.lote}</div>
                            <div style={{ fontSize: 11, color: C.textDim }}>{m.empresa}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: C.danger, fontFamily: F }}>{m.dias}d</div>
                            <div style={{ fontSize: 10, color: C.muted }}>{m.fecha}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 8 }}>
                  Monitoreos recientes — Tendencia
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 500 }}>
                    <thead>
                      <tr>{["LOTE", "EMPRESA", "ÚLTIMO", "DÍAS", "TENDENCIA"].map(h => <th key={h} style={{ textAlign: "left", padding: "7px 12px", fontSize: 10, color: C.muted, letterSpacing: 1.2, fontFamily: F, borderBottom: `1px solid ${C.border}` }}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {reciente.map((m, i) => (
                        <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                          <td style={{ padding: "9px 12px", fontWeight: 700, fontSize: 12, color: C.text }}>{m.lote}</td>
                          <td style={{ padding: "9px 12px", fontSize: 11, color: C.textDim }}>{m.empresa}</td>
                          <td style={{ padding: "9px 12px", fontSize: 11, color: C.textDim, fontFamily: F }}>{m.fecha}</td>
                          <td style={{ padding: "9px 12px", fontSize: 12, fontWeight: 700, color: m.dias > 7 ? C.warn : C.accent, fontFamily: F }}>{m.dias}d</td>
                          <td style={{ padding: "9px 12px", fontSize: 18, fontWeight: 700, color: m.tendColor }}>{m.tendencia}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}
        </div>
      </Accordion>

      {/* ── 7. COMPARATIVA POR EMPRESA ── */}
      <Accordion title="Comparativa por Empresa" icon="🏢" defaultOpen={false}>
        <div style={{ marginTop: 12 }}>
          {(() => {
            const empresasUnicas = [...new Set(mFiltrados.map(m => m.empresa).filter(Boolean))];
            if (empresasUnicas.length === 0) return <div style={{ textAlign: "center", padding: 28, color: C.muted }}>Sin datos en el período</div>;
            const datos = empresasUnicas.map(emp => {
              const ms = mFiltrados.filter(m => m.empresa === emp);
              const focos = ms.filter(m => plagas.some(p => (parseFloat(m[p]) || 0) >= UMBRALES[p])).length;
              const pctFocos = ms.length > 0 ? (focos / ms.length * 100).toFixed(0) : 0;
              const plagaMayor = plagas.reduce((max, p) => {
                const v = ms.filter(m => (parseFloat(m[p]) || 0) >= UMBRALES[p]).length;
                return v > (ms.filter(m => (parseFloat(m[max]) || 0) >= UMBRALES[max]).length) ? p : max;
              }, plagas[0]);
              const focosMax = ms.filter(m => (parseFloat(m[plagaMayor]) || 0) >= UMBRALES[plagaMayor]).length;
              return { emp, total: ms.length, focos, pctFocos, plagaMayor, focosMax };
            }).sort((a, b) => b.focos - a.focos);
            const maxFocos = Math.max(...datos.map(d => d.focos), 1);
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {datos.map((d, i) => (
                  <div key={d.emp} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 18px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: C.muted, fontFamily: F, width: 18 }}>{i+1}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.text, flex: 1 }}>{d.emp}</span>
                      <span style={{ background: C.accentLight, color: C.accent, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontFamily: F, fontWeight: 700 }}>{d.total} monitoreos</span>
                      <span style={{ background: d.focos > 0 ? C.dangerLight : C.accentLight, color: d.focos > 0 ? C.danger : C.accent, borderRadius: 6, padding: "3px 10px", fontSize: 11, fontFamily: F, fontWeight: 700 }}>
                        {d.focos} focos ({d.pctFocos}%)
                      </span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1, background: C.mutedBg, borderRadius: 5, height: 10, overflow: "hidden" }}>
                        <div style={{ width: `${(d.focos / maxFocos) * 100}%`, height: "100%", background: d.focos > 0 ? C.danger : C.accent, borderRadius: 5, transition: "width 0.5s" }} />
                      </div>
                      {d.focosMax > 0 && <span style={{ fontSize: 11, color: C.textDim }}>Mayor presión: <b style={{ color: plagaColors[d.plagaMayor] }}>{plagaLabels[d.plagaMayor]}</b></span>}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
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

  const handleLogin = (s) => { storeSession(s); setSession(s); };
  const handleLogout = async () => {
    if (session?.access_token) await authSignOut(session.access_token).catch(() => {});
    clearSession();
    setSession(null);
  };

  // Auto-refresh del token — agresivo: cada 10 minutos y si está por vencer
  useEffect(() => {
    if (!session?.refresh_token) return;
    const doRefresh = async () => {
      try {
        const r = await fetch(SUPABASE_URL + "/auth/v1/token?grant_type=refresh_token", {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
          body: JSON.stringify({ refresh_token: session.refresh_token })
        });
        if (r.ok) { const s = await r.json(); storeSession(s); setSession(s); return true; }
        else { clearSession(); setSession(null); return false; }
      } catch { return false; }
    };
    // Verificar si el token está por vencer (expires_at en segundos)
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    const ahora = Date.now();
    const minutosRestantes = (expiresAt - ahora) / 60000;
    // Si queda menos de 15 minutos o ya venció, refrescar inmediatamente
    if (minutosRestantes < 15) { doRefresh(); }
    // Refrescar cada 10 minutos sin importar nada (token Supabase dura 1h)
    const interval = setInterval(doRefresh, 10 * 60 * 1000);
    return () => { clearInterval(interval); };
  }, [session?.refresh_token]);

  if (!session) return <LoginScreen onLogin={handleLogin} />;
  return <AdminApp session={session} onLogout={handleLogout} />;
}

function AdminApp({ session, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [mbTab, setMbTab] = useState("plan");
  const [mbSemillas, setMbSemillas] = useState([]);  // lotes_semillas para el formulario MB
  const [mbCostosProduccion, setMbCostosProduccion] = useState([]);  // costos_produccion para el formulario MB
  const [importandoMonitoreos, setImportandoMonitoreos] = useState(false);
  const [showFormMonitoreo, setShowFormMonitoreo] = useState(false);
  const [newMonitoreo, setNewMonitoreo] = useState({
    fecha: new Date().toISOString().split("T")[0], empresa: "", campo: "", lote: "",
    cultivo: "", estadio_fenologico: "", isocas: "", chinches: "", pulgones: "",
    chicharrita: "", trips: "", aranhuelas: "", cogollero: "", observaciones: ""
  });
  const [savingMonitoreo, setSavingMonitoreo] = useState(false);
  const [sortCol, setSortCol] = useState("fecha");
  const [sortDir, setSortDir] = useState("desc");
  const toggleSort = (col) => { if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortCol(col); setSortDir("desc"); } };
  const [editCultivoId, setEditCultivoId] = useState(null); // id del monitoreo cuyo cultivo se está editando
  const [importResultadoMon, setImportResultadoMon] = useState(null);
  const [showReporteModal, setShowReporteModal] = useState(false);
  const [showMasivoModal, setShowMasivoModal] = useState(false);
  const [masivoField, setMasivoField] = useState("empresa");
  const [masivoDesde, setMasivoDesde] = useState("");
  const [masivoHasta, setMasivoHasta] = useState("");
  const [masivoMsg, setMasivoMsg] = useState("");
  const [masivoLoading, setMasivoLoading] = useState(false);
  const [buscarProd, setBuscarProd] = useState("");
  const [reporteEmpresa, setReporteEmpresa] = useState("todas");
  const [reporteCampo, setReporteCampo] = useState("todos");
  const [reporteDesde, setReporteDesde] = useState("");
  const [reporteHasta, setReporteHasta] = useState("");
  const [loteHistorialEmp, setLoteHistorialEmp] = useState("todas");
  const [loteHistorialCampo, setLoteHistorialCampo] = useState("todos");
  const [loteHistorialNombre, setLoteHistorialNombre] = useState(null);
  const [busquedaGlobal, setBusquedaGlobal] = useState("");
  const [empTab, setEmpTab] = useState("General");
  const [monitoreos, setMonitoreos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [selectedAppIds, setSelectedAppIds] = useState(new Set());
  const [sortAppCol, setSortAppCol] = useState("fecha");
  const [sortAppDir, setSortAppDir] = useState("desc");
  const [deletingBulkApp, setDeletingBulkApp] = useState(false);

  const toggleSelectApp = (id) => setSelectedAppIds(prev => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });
  const toggleSelectAllApps = (ids) => setSelectedAppIds(prev => prev.size === ids.length ? new Set() : new Set(ids));

  const deleteBulkApps = async () => {
    if (selectedAppIds.size === 0) return;
    if (!window.confirm(`¿Eliminar ${selectedAppIds.size} aplicación${selectedAppIds.size > 1 ? "es" : ""}? Esta acción no se puede deshacer.`)) return;
    setDeletingBulkApp(true);
    try {
      const ids = [...selectedAppIds];
      await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=in.(${ids.join(",")})`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`, Prefer: "return=minimal" }
      });
      setAplicaciones(prev => prev.filter(a => !selectedAppIds.has(a.id)));
      setSelectedAppIds(new Set());
    } catch(e) { alert("Error al eliminar las aplicaciones"); }
    setDeletingBulkApp(false);
  };

  const toggleSelect = (id) => setSelectedIds(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const toggleSelectAll = (ids) => setSelectedIds(prev => prev.size === ids.length ? new Set() : new Set(ids));

  const deleteBulk = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`¿Eliminar ${selectedIds.size} registro${selectedIds.size > 1 ? "s" : ""}? Esta acción no se puede deshacer.`)) return;
    setDeletingBulk(true);
    try {
      const ids = [...selectedIds];
      await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=in.(${ids.join(",")})`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`, Prefer: "return=minimal" }
      });
      setMonitoreos(prev => prev.filter(m => !selectedIds.has(m.id)));
      setSelectedIds(new Set());
    } catch(e) { alert("Error al eliminar los registros"); }
    setDeletingBulk(false);
  };
  const [editing, setEditing] = useState(false);
  const [filtroEmpresa, setFiltroEmpresa] = useState("todas");
  const [filtroCampo, setFiltroCampo] = useState("todos");
  const [filtroLote, setFiltroLote] = useState("todos");
  const [filtroCultivo, setFiltroCultivo] = useState("todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState("todo");
  const [filtroCampana, setFiltroCampana] = useState("todas");
  const [time, setTime] = useState(new Date());
  const [productos, setProductos] = useState([]);
  const [aplicaciones, setAplicaciones] = useState([]);
  const [margenes, setMargenes] = useState([]);
  const [planificacion, setPlanificacion] = useState([]);
  const [estructuraLotes, setEstructuraLotes] = useState([]);
  const [showFormPlan, setShowFormPlan] = useState(false);
  const [editandoPlan, setEditandoPlan] = useState(null);
  const [importandoPlan, setImportandoPlan] = useState(false);
  const [planCultivos, setPlanCultivos] = useState([]);
  const [showFormCultivo, setShowFormCultivo] = useState(false);
  const [importandoCultivos, setImportandoCultivos] = useState(false);
  const fileImportCultivosRef = useRef(null);
  const [editandoCultivo, setEditandoCultivo] = useState(null);
  const [newCultivo, setNewCultivo] = useState({
    campana: (() => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; })(),
    cultivo: "", rendimiento_obj_qq: "", precio_grano_usd: "", flete_usd: "", pct_comercializacion: "2",
    costo_semilla_ha: "", costo_labores_ha: "", costo_agroquimicos_ha: "",
    costo_fertilizantes_ha: "", costo_cosecha_ha: "", costo_otros_ha: "", notas: ""
  });
  const [subTabPlan, setSubTabPlan] = useState("lotes"); // "lotes" | "cultivos"
  const [campanaVistaPlan, setCampanaVistaPlan] = useState("actual");
  const [empresaActivaPlan, setEmpresaActivaPlan] = useState(null);
  const [campoPlanMsg, setCampoPlanMsg] = useState(""); // mensaje éxito al guardar campo
  const [campoActivoPlan, setCampoActivoPlan] = useState(null); // campo seleccionado dentro de empresa
  const [cultivoActivoId, setCultivoActivoId] = useState(null);
  const [busquedaLinea, setBusquedaLinea] = useState({}); // {lineaId: texto} // cultivo seleccionado para editar detalle
  const [planDetalle, setPlanDetalle] = useState([]); // líneas del detalle del cultivo seleccionado
  const [empresaCultivo, setEmpresaCultivo] = useState(""); // empresa para filtrar precios en cultivos // empresa seleccionada
  const [newPlan, setNewPlan] = useState({
    campana: (() => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; })(),
    empresa_nombre: "", campo_nombre: "", lote_nombre: "", hectareas: "", tenencia: "PROPIO",
    rotacion: "", cultivo: "", cultivo_humedo: "", variedad: "", fecha_siembra_est: "",
    alquiler_qq_ha: "", notas: ""
  });
  const [showFormApp, setShowFormApp] = useState(false);
  const [editandoProdsApp, setEditandoProdsApp] = useState(null);
  const [editandoApp, setEditandoApp] = useState(null); // aplicación completa en edición
  const [importandoExcel, setImportandoExcel] = useState(false);
  const [importResultado, setImportResultado] = useState(null);
  const fileExcelRef = useRef(null);
  const filePreciosRef = useRef(null);
  const [importandoPrecios, setImportandoPrecios] = useState(false);
  const [importPreciosResultado, setImportPreciosResultado] = useState(null);
  const [filtroPlagaA, setFiltroPlagaA] = useState("todas");
  const [filtroTipoA, setFiltroTipoA] = useState("todos");
  const [diasUmbralSinMon, setDiasUmbralSinMon] = useState(7);
  const [expandedApp, setExpandedApp] = useState(null); // id of expanded aplicacion
  const [showFormProd, setShowFormProd] = useState(false);
  const [showFormMargen, setShowFormMargen] = useState(false);
  const [procesandoIA, setProcesandoIA] = useState(false);
  const [newApp, setNewApp] = useState({
    empresa_nombre: "", campo_nombre: "", lotes: [{ lote_nombre: "", superficie_ha: "" }],
    cultivo: "", fecha: new Date().toISOString().split("T")[0],
    tipo_aplicacion: "", labor_tipo: "", observaciones: "", productos: [], numero_orden: "", agua_volumen: "", momento_aplicacion: ""
  });
  const [newProd, setNewProd] = useState({ nombre: "", tipo: "", unidad: "l", precio_usd: "", empresa_nombre: "" });
  const [editProd, setEditProd] = useState(null);
  const [selectedProdIds, setSelectedProdIds] = useState(new Set());
  const [deletingProds, setDeletingProds] = useState(false);
  const [importandoProductos, setImportandoProductos] = useState(false);
  const [showValorizarLabores, setShowValorizarLabores] = useState(false);
  const [preciosLabores, setPreciosLabores] = useState({});
  const [precioGranoLabor, setPrecioGranoLabor] = useState("330"); // USD/tn para calcular cosechas %
  const [filtroEmpresaProd, setFiltroEmpresaProd] = useState("todas");
  const [historialProd, setHistorialProd] = useState(null); // nombre del producto seleccionado
  const [importResultadoProd, setImportResultadoProd] = useState(null);
  const fileProductosRef = useRef(null);
  const [newMargen, setNewMargen] = useState({
    empresa_nombre: "", campo_nombre: "", lote_nombre: "", cultivo: "", campana: (() => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; })(), hectareas: "",
    // Ingreso
    rendimiento_qq: "", precio_rosario_usd: "", flete_usd: "", pct_comercializacion: "2",
    // Costos USD/ha
    costo_semilla_ha: "", costo_labores_ha: "", costo_fertilizantes_ha: "", costo_cosecha_ha: "",
    costo_otros_ha: "", costo_gerenciamiento_ha: "",
    // Insumos (auto desde aplicaciones)
    costo_agroquimicos_ha: "",
    // Arrendamiento opción 1: qq soja/ha
    arr_qq_soja: "", arr_precio_soja: "330",
    // Arrendamiento opción 2: aparcería %
    apar_pct: "",
    // Selector de modalidad
    modalidad_arr: "arrendamiento", // "arrendamiento" | "aparceria" | "propio"
  });
  const [laboresApp, setLaboresApp] = useState([]);
  const [editandoMargen, setEditandoMargen] = useState(null);
  const [simRindesTabla, setSimRindesTabla] = useState({}); // rinde simulado por id de margen
  const [selectedMargenes, setSelectedMargenes] = useState([]);
  const [cotizaciones, setCotizaciones] = useState(null);
  const [cargandoCot, setCargandoCot] = useState(false);
  const [nivelMB, setNivelMB] = useState("lote"); // "lote" | "campo" | "multi"
  const [selectedLotesMB, setSelectedLotesMB] = useState([]);
  const [selectedCamposMB, setSelectedCamposMB] = useState([]);

  // Auto-completar hectáreas cuando se selecciona campo completo
  useEffect(() => {
    if (nivelMB !== "campo" || !newMargen.campo_nombre) return;
    const appsDelCampo = aplicaciones.filter(a =>
      (!newMargen.empresa_nombre || a.empresa_nombre === newMargen.empresa_nombre) &&
      a.campo_nombre === newMargen.campo_nombre && a.superficie_ha
    );
    // Sumar hectáreas únicas por lote (tomar la mayor superficie registrada por lote)
    const hasPorLote = {};
    for (const a of appsDelCampo) {
      const lote = a.lote_nombre;
      const ha = parseFloat(a.superficie_ha) || 0;
      if (!hasPorLote[lote] || ha > hasPorLote[lote]) hasPorLote[lote] = ha;
    }
    const totalHa = Object.values(hasPorLote).reduce((s, h) => s + h, 0);
    if (totalHa > 0) setNewMargen(p => ({ ...p, hectareas: totalHa.toString() }));
  }, [nivelMB, newMargen.campo_nombre, newMargen.empresa_nombre, aplicaciones]);
  const fileAppRef = useRef();

  const fetchData = useCallback(async (campanaFiltro) => {
    try { setLoading(true);
      const tok = session?.access_token;
      let todos = [], offset = 0, batch;
      // Si hay campaña seleccionada, filtrar por rango de fechas en Supabase
      const camp = campanaFiltro || filtroCampana;
      let filtroFecha = "";
      if (camp && camp !== "todas") {
        const anio = parseInt(camp.split("/")[0]);
        const desde = `${anio}-07-01`;
        const hasta = `${anio + 1}-06-30`;
        filtroFecha = `&fecha=gte.${desde}&fecha=lte.${hasta}`;
      }
      do {
        if (todos.length > 0) setLoadingMsg(`Cargando... ${todos.length} registros`);
        batch = await sb(`monitoreos?order=created_at.desc&limit=1000&offset=${offset}${filtroFecha}`, tok);
        if (!Array.isArray(batch) || batch.length === 0) break;
        todos = [...todos, ...batch];
        offset += 1000;
      } while (batch.length === 1000);
      setLoadingMsg("");
      const d = todos;
      // Normalización por plaga según unidad de muestreo:
      // /3 promedio de 3 estaciones (metros lineales): isocas, chinches, pulgones, trips, aranhuelas
      // /150 * 100 = % de 3 estaciones de 50 plantas: cogollero, chicharrita
      const PLAGAS_POR_METRO = ["isocas","isocas_dano","chinches","chinches_dano"]; // pulgones/trips/aranhuelas son ahora texto BAJA/MEDIA/ALTA
      const PLAGAS_POR_PLANTA = ["chicharrita","chicharrita_dano","cogollero","cogollero_dano"];
      const normalize = m => {
        const n = { ...m };
        PLAGAS_POR_METRO.forEach(k => {
          if (n[k] != null && n[k] !== "") n[k] = Math.round((parseFloat(n[k]) / 3) * 100) / 100;
        });
        PLAGAS_POR_PLANTA.forEach(k => {
          if (n[k] != null && n[k] !== "") n[k] = Math.round((parseFloat(n[k]) / 150) * 100 * 100) / 100; // % sobre 150 plantas
        });
        return n;
      };
      setMonitoreos(Array.isArray(d) ? d.map(normalize) : []); setError(null); }
    catch { setError("No se pudo conectar"); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Cargar semillas y costos de producción cuando cambia empresa/campaña (formulario nuevo o edición)
  useEffect(() => {
    const emp = newMargen?.empresa_nombre || editandoMargen?.empresa_nombre;
    const camp = newMargen?.campana || editandoMargen?.campana;
    if (!emp || !camp) return;
    const tok2 = session?.access_token || SUPABASE_KEY;
    const enc = encodeURIComponent(emp), encC = encodeURIComponent(camp);
    const H = { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok2}` };
    Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/lotes_semillas?empresa_nombre=eq.${enc}&campana=eq.${encC}`, { headers: H }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/costos_produccion?empresa_nombre=eq.${enc}&campana=eq.${encC}`, { headers: H }).then(r => r.json()),
    ]).then(([sem, cos]) => {
      setMbSemillas(Array.isArray(sem) ? sem : []);
      setMbCostosProduccion(Array.isArray(cos) ? cos : []);
    }).catch(() => {});
  }, [newMargen?.empresa_nombre, newMargen?.campana, editandoMargen?.empresa_nombre, editandoMargen?.campana]);
  const fetchProductos = useCallback(async () => { try { const d = await sb("productos_catalogo?order=nombre", session?.access_token); setProductos(Array.isArray(d) ? d : []); } catch { } }, []);
  const fetchAplicaciones = useCallback(async () => { try { const tok = session?.access_token || SUPABASE_KEY; const d = await sb("aplicaciones?order=created_at.desc&limit=200", tok); setAplicaciones(Array.isArray(d) ? d.map(a => ({ ...a, productos: typeof a.productos === "string" ? JSON.parse(a.productos) : (a.productos || []) })) : []); } catch { } }, [session]);
  const fetchMargenes = useCallback(async () => { try { const d = await sb("margen_bruto?order=created_at.desc&limit=200", session?.access_token); setMargenes(Array.isArray(d) ? d : []); } catch { } }, []);
  const fetchPlanDetalle = async (planCultivoId) => {
    try {
      const d = await sb(`plan_cultivo_detalle?plan_cultivo_id=eq.${planCultivoId}&order=orden`, session?.access_token);
      setPlanDetalle(Array.isArray(d) ? d : []);
    } catch { setPlanDetalle([]); }
  };
  const fetchPlanCultivos = useCallback(async () => { try { const d = await sb("plan_cultivos?order=campana.desc,cultivo", session?.access_token); setPlanCultivos(Array.isArray(d) ? d : []); } catch { } }, []);
  const fetchPlanificacion = useCallback(async () => { try { const d = await sb("planificacion?order=campana.desc,empresa_nombre,campo_nombre,lote_nombre", session?.access_token); setPlanificacion(Array.isArray(d) ? d : []); } catch { } }, []);
  const fetchEstructura = useCallback(async () => { try { const d = await sb("estructura_lotes?order=empresa_nombre,campo_nombre,lote_nombre", session?.access_token); setEstructuraLotes(Array.isArray(d) ? d : []); } catch { } }, []);

  // Umbrales desde Supabase (con fallback a valores default)
  const [umbralesConfig, setUmbralesConfig] = useState(UMBRALES);
  const [savingUmbrales, setSavingUmbrales] = useState(false);
  const [umbralesSaved, setUmbralesSaved] = useState(false);

  const fetchUmbrales = useCallback(async () => {
    try {
      const d = await sb("umbrales?limit=20", session?.access_token);
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
          Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`,
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

  useEffect(() => { fetchProductos(); fetchAplicaciones(); fetchMargenes(); fetchUmbrales(); fetchPlanificacion(); fetchPlanCultivos(); fetchEstructura(); }, [fetchProductos, fetchAplicaciones, fetchMargenes, fetchUmbrales, fetchPlanificacion, fetchPlanCultivos, fetchEstructura]);
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(t); }, []);

  // ── NORMALIZAR CULTIVOS AUTOMÁTICAMENTE ─────────────────────
  // Cuando planificacion y aplicaciones están cargados, sincroniza cultivos
  useEffect(() => {
    if (!planificacion.length || !aplicaciones.length || !session?.access_token) return;
    const getCampanaActualAuto = () => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; };
    const campanaActualAuto = getCampanaActualAuto();
    const tok = session.access_token;

    // Para cada aplicación, buscar el cultivo en la planificación actual
    const actualizaciones = aplicaciones
      .filter(a => a.empresa_nombre && a.campo_nombre && a.lote_nombre)
      .map(a => {
        const planMatch = planificacion.find(p =>
          p.empresa_nombre?.trim() === a.empresa_nombre?.trim() &&
          p.campo_nombre === a.campo_nombre &&
          p.lote_nombre === a.lote_nombre &&
          p.campana === campanaActualAuto &&
          p.cultivo
        );
        if (!planMatch) return null;
        // Normalizar: si el cultivo de la app no coincide con el de la planificación
        const cultivoPlan = planMatch.cultivo;
        const cultivoApp = (a.cultivo || "").trim();
        // Considerar coincidencia parcial (ej: "SOJA" vs "Soja 1ra", "Maíz" vs "Maíz 2da")
        const normalizar = s => (s||"").toLowerCase().replace(/[^a-z0-9]/g,"");
        const appNorm = normalizar(cultivoApp);
        const planNorm = normalizar(cultivoPlan);
        if (appNorm === planNorm) return null; // Ya coincide exacto
        // Si es completamente diferente no tocar (ej: soja vs maiz)
        // Solo actualizar si el de la app es un nombre genérico del de la planificación
        const esSubset = planNorm.startsWith(appNorm) || appNorm.startsWith(planNorm.slice(0,4));
        if (!esSubset && appNorm.length > 0) return null;
        return { id: a.id, cultivo: cultivoPlan };
      })
      .filter(Boolean);

    if (actualizaciones.length === 0) return;
    console.log(`[AGRO·MONITOR] Normalizando ${actualizaciones.length} cultivo(s) en aplicaciones...`);

    // Actualizar en Supabase
    actualizaciones.forEach(async ({ id, cultivo }) => {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
          body: JSON.stringify({ cultivo })
        });
        // Actualizar localmente
        setAplicaciones(prev => prev.map(a => a.id === id ? { ...a, cultivo } : a));
      } catch(e) { console.warn("Error normalizando cultivo:", e); }
    });
  }, [planificacion, aplicaciones.length, session]);

  const deleteMonitoreo = async (id) => {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${id}`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`, Prefer: "return=minimal" }
      });
      setSelected(null);
      setMonitoreos(prev => prev.filter(m => m.id !== id));
    } catch(e) { alert("Error al eliminar el monitoreo"); }
  };

  const hoy = new Date().toISOString().split("T")[0];
  const semana = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
  const empresas = ["todas", ...new Set([...monitoreos.map(m => m.empresa?.trim()), ...aplicaciones.map(a => a.empresa_nombre?.trim())].filter(Boolean))];
  const campos = ["todos", ...new Set(monitoreos.filter(m => filtroEmpresa === "todas" || m.empresa === filtroEmpresa).map(m => m.campo).filter(Boolean))];
  const lotes = ["todos", ...new Set(monitoreos.filter(m => (filtroEmpresa === "todas" || m.empresa === filtroEmpresa) && (filtroCampo === "todos" || m.campo === filtroCampo)).map(m => m.lote).filter(Boolean))];
  const cultivos = ["todos", ...new Set(monitoreos.map(m => m.cultivo).filter(Boolean))];
  const getCampanaFecha = (fecha) => { if (!fecha) return ""; const d = new Date(fecha); const mes = d.getMonth()+1; const a = d.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; };
  const appCampos = ["todos", ...new Set(aplicaciones.filter(a => (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)).map(a => a.campo_nombre).filter(Boolean))];
  const appLotes = ["todos", ...new Set(aplicaciones.filter(a => (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)).map(a => a.lote_nombre).filter(Boolean))];

  const campanasDisponibles = ["todas", ...new Set([
    ...(monitoreos||[]).map(m => m.campana).filter(Boolean),
    ...(monitoreos||[]).map(m => getCampanaFecha(m.fecha)).filter(Boolean),
    ...(aplicaciones||[]).map(a => getCampanaFecha(a.fecha)).filter(Boolean),
    ...(margenes||[]).map(m => m.campana).filter(Boolean),
  ].filter(Boolean))].sort().reverse();

  const filtered = monitoreos.filter(m => {
    if (filtroCampana !== "todas") {
      const camp = getCampanaFecha(m.fecha);
      if (camp !== filtroCampana && m.campana !== filtroCampana) return false;
    }
    return (
      (filtroEmpresa === "todas" || m.empresa === filtroEmpresa) &&
      (filtroCampo === "todos" || m.campo === filtroCampo) &&
      (filtroLote === "todos" || m.lote === filtroLote) &&
      (filtroCultivo === "todos" || m.cultivo === filtroCultivo) &&
      (filtroPeriodo === "todo" || (filtroPeriodo === "hoy" && m.fecha === hoy) || (filtroPeriodo === "semana" && m.fecha >= semana))
    );
  });
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
    app: { minHeight: "100vh", background: C.bg, color: C.text, fontFamily: SANS, fontSize: 14, display: "flex" },

    filters: {
      background: C.surface, borderBottom: `1px solid ${C.border}`,
      padding: "10px 20px", display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center"
    },

    main: { padding: "24px 28px", flex: 1 },

    card: {
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: 22,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)",
      transition: "box-shadow 0.2s"
    },

    th: {
      textAlign: "left", padding: "12px 16px", color: C.muted,
      fontSize: 11, letterSpacing: 0.5, borderBottom: `2px solid ${C.border}`,
      fontFamily: SANS, textTransform: "uppercase", background: C.bg, fontWeight: 600
    },

    td: { padding: "14px 16px", borderBottom: `1px solid ${C.border}`, fontSize: 13, color: C.text, verticalAlign: "middle" },

    sel: {
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "10px 14px", color: C.text, fontFamily: SANS, fontSize: 14,
      outline: "none", cursor: "pointer", minHeight: 44
    },

    btnPrimary: {
      background: C.accent, border: "none", borderRadius: 10,
      padding: "11px 22px", color: "#fff", fontFamily: SANS,
      fontSize: 14, cursor: "pointer", fontWeight: 600, letterSpacing: 0.1,
      minHeight: 44, display: "inline-flex", alignItems: "center", gap: 6
    },

    btnSecondary: {
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "11px 18px", color: C.textDim, fontFamily: SANS, fontSize: 14,
      cursor: "pointer", minHeight: 44, display: "inline-flex", alignItems: "center", gap: 6
    },

    sectionTitle: {
      color: C.text, fontSize: 15, fontWeight: 700,
      fontFamily: SANS, letterSpacing: -0.2
    },

    selFilter: {
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "9px 14px", color: C.text, fontFamily: SANS, fontSize: 14,
      outline: "none", cursor: "pointer", appearance: "auto", minHeight: 44
    },
  };

  // ── ACTIONS ────────────────────────────────────────────────
  const descargarProductosExcel = async () => {
    const XLSX = await new Promise((res,rej)=>{ if(window.XLSX){res(window.XLSX);return;} const s=document.createElement('script'); s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'; s.onload=()=>res(window.XLSX); s.onerror=rej; document.head.appendChild(s); });
    // Usar lista filtrada por tab activo
    const lista = productos
      .filter(p => empTab==="General" ? !p.empresa_nombre : p.empresa_nombre===empTab)
      .sort((a,b)=>(a.nombre||"").localeCompare(b.nombre||""));
    const ws = XLSX.utils.aoa_to_sheet([
      [`Lista de productos — ${empTab} — AGRO·MONITOR`],
      ['Completá o editá PRECIO_USD y re-importá con el botón "Importar Excel"'],
      ['NOMBRE','TIPO','UNIDAD','PRECIO_USD'],
      ...lista.map(p=>[p.nombre||'', p.tipo||'', p.unidad||'l', p.precio_usd!=null?p.precio_usd:''])
    ]);
    ws['!cols']=[{wch:40},{wch:18},{wch:10},{wch:14}];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Productos');
    XLSX.writeFile(wb, `productos_${empTab.replace(/[^a-zA-Z0-9]/g,'_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const importarProductosExcel = async (file) => {
    setImportandoProductos(true);
    setImportResultadoProd(null);
    try {
      const XLSX = await new Promise((resolve, reject) => {
        if (window.XLSX) { resolve(window.XLSX); return; }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        s.onload = () => resolve(window.XLSX); s.onerror = reject;
        document.head.appendChild(s);
      });
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const tok = session?.access_token || SUPABASE_KEY;
      let ok = 0, err = 0;
      const empresaImport = null; // siempre General

      // Detectar formato: buscar la hoja con más datos de productos
      // Formato Bertoli: columnas PRODUCTO, MARCA, PRINCIPIO ACTIVO, PRESENTACIÓN, CONTADO/COSTOS
      // Formato estándar: columnas NOMBRE, TIPO, UNIDAD, PRECIO_USD
      const allRows = [];
      for (const sheetName of wb.SheetNames) {
        const ws = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
        if (rows.length === 0) continue;
        const firstRow = rows[0];
        const keys = Object.keys(firstRow).map(k => k.trim().toUpperCase());
        // Detectar formato Bertoli (tiene columna PRODUCTO)
        if (keys.some(k => k.includes('PRODUCTO'))) {
          // Solo usar la última hoja con este formato (la más reciente)
          allRows.length = 0;
          rows.forEach(r => allRows.push({ _formato: 'bertoli', ...r }));
          break; // Usar solo la primer hoja que matchea (la más reciente)
        }
      }
      // Si no encontró formato Bertoli, usar formato estándar de la primera hoja
      if (allRows.length === 0) {
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '', range: 1 });
        rows.forEach(r => allRows.push({ _formato: 'estandar', ...r }));
      }

      const dataRows = allRows.filter(r => {
        if (r._formato === 'bertoli') {
          const n = (Object.fromEntries(Object.entries(r).map(([k,v])=>[k.trim(),v]))['PRODUCTO'] || '').toString().trim();
          return n && n !== 'PRODUCTO';
        }
        const n = (r['NOMBRE'] || r['nombre'] || '').toString().trim();
        return n && n !== 'NOMBRE';
      });

      for (const row of dataRows) {
        let nombre, tipo, unidad, precio, principioActivo;
        if (row._formato === 'bertoli') {
          // Normalizar keys quitando espacios extra
          const rn = Object.fromEntries(Object.entries(row).map(([k,v]) => [k.trim(), v]));
          nombre = (rn['PRODUCTO'] || '').toString().trim();
          principioActivo = (rn['PRINCIPIO ACTIVO'] || '').toString().trim();
          const presentacion = (rn['PRESENTACIÓN'] || rn['PRESENTACION'] || '').toString().trim().toUpperCase();
          unidad = presentacion.includes('KILO') || presentacion.includes('KG') ? 'kg' : 'l';
          // Usar columna CONTADO como precio
          const contado = parseFloat(rn['CONTADO'] || 0);
          const costos = parseFloat(rn['COSTOS'] || 0);
          precio = contado > 0 ? contado : (costos > 0 ? costos : null);
          // Detectar tipo por principio activo o nombre
          const pa = principioActivo.toUpperCase();
          const nm = nombre.toUpperCase();
          if (pa.includes('FUNGIC') || nm.includes('FUNGIC')) tipo = 'fungicida';
          else if (pa.includes('HERBIC') || nm.includes('HERBIC')) tipo = 'herbicida';
          else if (pa.includes('INSECT') || nm.includes('INSECT')) tipo = 'insecticida';
          else if (nm.includes('ACEITE') || nm.includes('COADYUVANTE') || nm.includes('ACTIVATE')) tipo = 'coadyuvante';
          else if (nm.includes('FERTILIZ') || nm.includes('UREA') || nm.includes('MAP ') || nm.includes('DAP') || nm.includes('KCL')) tipo = 'fertilizante';
          else tipo = 'agroquimico';
        } else {
          nombre = (row['NOMBRE'] || row['nombre'] || row['Nombre'] || '').toString().trim();
          tipo = (row['TIPO'] || row['tipo'] || row['Tipo'] || '').toString().trim();
          unidad = (row['UNIDAD'] || row['unidad'] || row['Unidad'] || 'l').toString().trim();
          precio = parseFloat(row['PRECIO_USD'] || row['precio_usd'] || row['Precio USD'] || row['PRECIO'] || 0) || null;
        }
        if (!nombre) continue;

        // Buscar producto existente: primero para esta empresa, luego general
        const existing = empresaImport
          ? productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase() && p.empresa_nombre === empresaImport)
          : productos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase() && !p.empresa_nombre);

        // Upsert por nombre+empresa — on_conflict en URL param
        const res = await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?on_conflict=nombre,empresa_nombre`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json', 
            apikey: SUPABASE_KEY, 
            Authorization: `Bearer ${tok}`, 
            Prefer: 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify({ nombre, tipo, unidad, precio_usd: precio, empresa_nombre: null })
        });
        res.ok ? ok++ : err++;
      }
      await fetchProductos();
      setImportResultadoProd({ ok, err });
    } catch(e) { setImportResultadoProd({ ok: 0, err: 1, msg: e.message }); }
    setImportandoProductos(false);
    if (fileProductosRef.current) fileProductosRef.current.value = '';
  };

  const revalorizarAplicaciones = async () => {
    const empresaActiva = filtroEmpresaProd !== "todas" ? filtroEmpresaProd : null;
    const msg = empresaActiva
      ? `¿Re-valorizar las aplicaciones de ${empresaActiva} con los precios del catálogo?`
      : "¿Re-valorizar TODAS las aplicaciones con los precios del catálogo?";
    if (!window.confirm(msg)) return;
    const tok = session?.access_token || SUPABASE_KEY;
    let actualizadas = 0;
    const appsARevs = empresaActiva
      ? aplicaciones.filter(a => a.empresa_nombre?.trim() === empresaActiva.trim())
      : aplicaciones;
    for (const app of appsARevs) {
      if (!app.productos?.length) continue;
      let cambio = false;
      const nuevosProds = app.productos.map(p => {
        const normalizar = s => (s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
    // Buscar precio específico para la empresa, luego el general
        const enCatalogoEmpresa = productos.find(cat => {
          if (!cat.empresa_nombre || cat.empresa_nombre !== app.empresa_nombre) return false;
          const catN = normalizar(cat.nombre);
          const appN = normalizar(p.producto_nombre);
          return catN === appN || catN.includes(appN) || appN.includes(catN);
        });
        const enCatalogo = enCatalogoEmpresa || productos.find(cat => {
          if (cat.empresa_nombre) return false; // saltar precios específicos de otras empresas
          const catN = normalizar(cat.nombre);
          const appN = normalizar(p.producto_nombre);
          return catN === appN || catN.includes(appN) || appN.includes(catN) ||
        // Match por primeras 6 letras si son suficientemente largas
        (appN.length >= 6 && catN.length >= 6 && catN.slice(0,6) === appN.slice(0,6));
    });
        if (enCatalogo?.precio_usd && app.superficie_ha) {
          const dosisNum = parseFloat(p.dosis) || 0;
          const nuevoCosto = calcularCostoHa(dosisNum, p.unidad, enCatalogo.precio_usd).toFixed(2);
          if (nuevoCosto !== p.costo_total) { cambio = true; }
          return { ...p, precio_usd: enCatalogo.precio_usd, costo_total: nuevoCosto };
        }
        return p;
      });
      if (cambio) {
        const costoTotal = nuevosProds.reduce((s, p) => s + (parseFloat(p.costo_total) || 0), 0);
        await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${app.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
          body: JSON.stringify({ productos: JSON.stringify(nuevosProds), costo_total_usd: costoTotal })
        });
        actualizadas++;
      }
    }
    await fetchAplicaciones();
    alert(`✅ ${actualizadas} aplicaciones re-valorizadas con los precios actuales.`);
  };

  const saveEditApp = async () => {
    if (!editandoApp) return;
    const tok = session?.access_token || SUPABASE_KEY;
    const costoTotal = (editandoApp.productos||[]).reduce((s, p) => s + (parseFloat(p.costo_total)||0), 0);
    await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${editandoApp.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
      body: JSON.stringify({
        empresa_nombre: editandoApp.empresa_nombre,
        campo_nombre: editandoApp.campo_nombre,
        lote_nombre: editandoApp.lote_nombre,
        cultivo: editandoApp.cultivo,
        fecha: editandoApp.fecha,
        tipo_aplicacion: editandoApp.tipo_aplicacion,
        superficie_ha: parseFloat(editandoApp.superficie_ha) || null,
        costo_labor_ha: parseFloat(editandoApp.costo_labor_ha) || null,
        observaciones: editandoApp.observaciones,
        productos: JSON.stringify(editandoApp.productos || []),
        costo_total_usd: costoTotal
      })
    });
    await fetchAplicaciones();
    setEditandoApp(null);
  };

  const deleteBulkProductos = async () => {
    if (selectedProdIds.size === 0) return;
    // Usar solo IDs que existen en el estado actual de productos
    const idsValidos = [...selectedProdIds].filter(id => productos.some(p => p.id === id));
    if (idsValidos.length === 0) {
      // Refrescar y limpiar selección si no hay IDs válidos
      await fetchProductos();
      setSelectedProdIds(new Set());
      return;
    }
    if (!window.confirm(`¿Eliminar ${idsValidos.length} producto${idsValidos.length > 1 ? "s" : ""}? Esta acción no se puede deshacer.`)) return;
    setDeletingProds(true);
    const tok = session?.access_token || SUPABASE_KEY;
    const batchSize = 50;
    for (let i = 0; i < idsValidos.length; i += batchSize) {
      const batch = idsValidos.slice(i, i + batchSize);
      await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?id=in.(${batch.join(",")})`, {
        method: "DELETE",
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` }
      });
    }
    setProductos(prev => prev.filter(p => !selectedProdIds.has(p.id)));
    setSelectedProdIds(new Set());
    setDeletingProds(false);
    await fetchProductos();
  };

  const saveEditProd = async () => {
    if (!editProd) return;
    const tok = session?.access_token || SUPABASE_KEY;
    await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?id=eq.${editProd.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
      body: JSON.stringify({ nombre: editProd.nombre, tipo: editProd.tipo, unidad: editProd.unidad, precio_usd: parseFloat(editProd.precio_usd) || null, empresa_nombre: editProd.empresa_nombre || null })
    });
    await fetchProductos();
    setEditProd(null);
  };

  const deleteProducto = async (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return;
    const tok = session?.access_token || SUPABASE_KEY;
    await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo?id=eq.${id}`, {
      method: 'DELETE',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` }
    });
    await fetchProductos();
  };

  const saveProducto = async () => {
    if (!newProd.nombre) return;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/productos_catalogo`, {
        method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`, Prefer: "return=minimal" },
        body: JSON.stringify({ nombre: newProd.nombre, tipo: newProd.tipo, unidad: newProd.unidad, precio_usd: parseFloat(newProd.precio_usd) || null, empresa_nombre: newProd.empresa_nombre || null })
      });
      setNewProd({ nombre: "", tipo: "", unidad: "l", precio_usd: "", empresa_nombre: "" });
      setShowFormProd(false);
      fetchProductos();
    } catch (e) { alert("Error al guardar"); }
  };

  const descargarExcelPrecios = async () => {
    const XLSX = await new Promise((res,rej)=>{ if(window.XLSX){res(window.XLSX);return;} const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; s.onload=()=>res(window.XLSX); s.onerror=rej; document.head.appendChild(s); });
    const appsEmp=aplicaciones.filter(a=>filtroEmpresa==="todas"||a.empresa_nombre?.trim()===filtroEmpresa.trim());
    const mapa={};
    appsEmp.forEach(a=>{(a.productos||[]).forEach(p=>{const nombre=(p.producto_nombre||"").trim(); if(!nombre)return; if(!mapa[nombre])mapa[nombre]={nombre,precio_usd:p.precio_usd||"",unidad:p.unidad||""}; if(!mapa[nombre].precio_usd&&p.precio_usd)mapa[nombre].precio_usd=p.precio_usd;});});
    const filas=Object.values(mapa).sort((a,b)=>a.nombre.localeCompare(b.nombre));
    const ws=XLSX.utils.aoa_to_sheet([[`Precios para valorizar — ${filtroEmpresa!=="todas"?filtroEmpresa:"Todas las empresas"}`],["Completá PRECIO_USD y re-importá"],["PRODUCTO","UNIDAD_REFERENCIA","PRECIO_USD"],...filas.map(r=>[r.nombre,r.unidad,r.precio_usd||""])]);
    ws["!cols"]=[{wch:40},{wch:16},{wch:14}];
    const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,"Precios");
    XLSX.writeFile(wb,`precios_${(filtroEmpresa==="todas"?"todas":filtroEmpresa).replace(/[^a-zA-Z0-9]/g,"_")}_${new Date().toISOString().split("T")[0]}.xlsx`);
  };
  const importarPrecios = async (file) => {
    setImportandoPrecios(true); setImportPreciosResultado(null);
    try {
      const XLSX=await new Promise((res,rej)=>{ if(window.XLSX){res(window.XLSX);return;} const s=document.createElement("script"); s.src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"; s.onload=()=>res(window.XLSX); s.onerror=rej; document.head.appendChild(s); });
      const buf=await file.arrayBuffer(); const wb=XLSX.read(buf,{type:"array"}); const ws=wb.Sheets[wb.SheetNames[0]];
      const rows=XLSX.utils.sheet_to_json(ws,{defval:"",range:2});
      const mapaPrecios={};
      rows.forEach(r=>{ const nombre=(r["PRODUCTO"]||r["producto"]||"").toString().trim(); const precio=parseFloat(r["PRECIO_USD"]||r["precio_usd"]||""); if(nombre&&!isNaN(precio)&&precio>0)mapaPrecios[nombre]=precio; });
      if(Object.keys(mapaPrecios).length===0){setImportPreciosResultado({ok:0,err:1,errores:["No se encontraron precios válidos."]});setImportandoPrecios(false);return;}
      const appsTarget=aplicaciones.filter(a=>filtroEmpresa==="todas"||a.empresa_nombre?.trim()===filtroEmpresa.trim());
      const tok=session?.access_token||SUPABASE_KEY; let ok=0,sin_cambio=0;
      for(const app of appsTarget){
        const prods=(app.productos||[]); let modificado=false;
        const nuevosProds=prods.map(p=>{const precio=mapaPrecios[(p.producto_nombre||"").trim()]; if(precio!==undefined&&parseFloat(p.precio_usd||0)!==precio){modificado=true;return{...p,precio_usd:precio};} return p;});
        if(!modificado){sin_cambio++;continue;}
        const costoTotal=nuevosProds.reduce((s,p)=>{const u=(p.unidad||"").toLowerCase();const div=(u.includes("cc")||u.includes("ml")||u.startsWith("gr")||u.startsWith("g/"))?1000:1;return s+((parseFloat(p.dosis)||0)/div)*(parseFloat(p.precio_usd)||0)*(parseFloat(app.superficie_ha)||1);},0);
        const res=await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${app.id}`,{method:"PATCH",headers:{"Content-Type":"application/json",apikey:SUPABASE_KEY,Authorization:`Bearer ${tok}`,Prefer:"return=minimal"},body:JSON.stringify({productos:JSON.stringify(nuevosProds),costo_total_usd:costoTotal})});
        if(res.ok)ok++;else sin_cambio++;
      }
      await fetchAplicaciones(); setImportPreciosResultado({ok,sin_cambio,productos:Object.keys(mapaPrecios).length});
    } catch(e){setImportPreciosResultado({ok:0,err:1,errores:[e.message]});}
    setImportandoPrecios(false); if(filePreciosRef.current)filePreciosRef.current.value="";
  };
  const importarExcel = async (file) => {
    setImportandoExcel(true);
    setImportResultado(null);
    try {
      const XLSX = await new Promise((resolve, reject) => {
        if (window.XLSX) { resolve(window.XLSX); return; }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        s.onload = () => resolve(window.XLSX);
        s.onerror = reject;
        document.head.appendChild(s);
      });
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      // Leer con header explícito desde fila 3 (las primeras 2 son título/subtítulo)
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '', range: 2 });
      // Filtrar filas vacías o de leyenda
      const dataRows = rows.filter(row => {
        const fecha = row['FECHA'] || row['fecha'] || '';
        const empresa = row['EMPRESA'] || row['empresa'] || '';
        const lote = row['LOTE'] || row['lote'] || '';
        return fecha && empresa && lote && fecha.toString().trim() !== '' && empresa.toString().trim() !== 'EMPRESA';
      });

      let ok = 0, err = 0, errores = [];
      const tok = session?.access_token || SUPABASE_KEY;

      for (const row of dataRows) {
        const fecha = row['FECHA'] || row['fecha'] || '';
        const empresa = row['EMPRESA'] || row['empresa'] || '';
        const lote = (row['LOTE'] || row['lote'] || '').toString().trim();
        const campo = row['CAMPO'] || row['campo'] || '';
        const cultivo = row['CULTIVO'] || row['cultivo'] || '';
        const tipo = row['TIPO_APLICACION'] || row['tipo_aplicacion'] || '';
        const superficie = parseFloat(row['SUPERFICIE_HA'] || row['superficie_ha']) || null;
        const diagnostico = row['DIAGNOSTICO'] || row['diagnostico'] || '';
        const esInsecticida = (row['ES_INSECTICIDA'] || row['es_insecticida'] || '').toString().toUpperCase() === 'SI';
        const plagaObj = row['PLAGA_OBJETIVO'] || row['plaga_objetivo'] || '';
        const contratista = row['CONTRATISTA'] || row['contratista'] || '';
        const obs = row['OBSERVACIONES'] || row['observaciones'] || '';

        if (!fecha || !empresa || !lote) { errores.push(`Fila sin fecha/empresa/lote`); err++; continue; }

        // Armar productos
        const productos = [];
        for (let i = 1; i <= 5; i++) {
          const nombre = row[`PRODUCTO_${i}`] || row[`producto_${i}`] || '';
          const dosis = row[`DOSIS_${i}`] || row[`dosis_${i}`] || '';
          if (nombre) productos.push({ producto_nombre: nombre, dosis: dosis, unidad: '', precio_usd: '', costo_total: '' });
        }

        // Convertir fecha DD/MM/YYYY o YYYY-MM-DD
        let fechaISO = fecha.toString();
        if (fechaISO.includes('/')) {
          const parts = fechaISO.split('/');
          if (parts.length === 3) fechaISO = `${parts[2].length === 2 ? '20' + parts[2] : parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
        }

        const payload = {
          fecha: fechaISO, empresa_nombre: empresa, campo_nombre: campo,
          lote_nombre: lote, cultivo, tipo_aplicacion: tipo,
          superficie_ha: superficie, diagnostico, es_insecticida: esInsecticida,
          plaga_objetivo: plagaObj, contratista, observaciones: obs,
          productos: JSON.stringify(productos), costo_total_usd: 0
        };

        const res = await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
          body: JSON.stringify(payload)
        });
        if (res.ok) ok++;
        else { const t = await res.text(); errores.push(`${lote}: ${t}`); err++; }
      }

      await fetchAplicaciones();
      setImportResultado({ ok, err, errores });
    } catch(e) {
      setImportResultado({ ok: 0, err: 1, errores: [e.message] });
    }
    setImportandoExcel(false);
    if (fileExcelRef.current) fileExcelRef.current.value = '';
  };

  const TIPOS_LABOR = [
    "Labor - Pulverización Terrestre","Labor - Pulverización Aérea","Labor - Pulverización Selectiva","Labor - Pulverización Dirigida",
    "Labor - Siembra Gruesa","Labor - Siembra Fina","Labor - Siembra Aérea",
    "Labor - Fertilización Incorporada","Labor - Fertilización Liquida",
    "Labor - Disco Liviano","Labor - Disco Pesado","Labor - Disco Cadena","Labor - Cincel","Labor - REJA CARPIDOR","Labor - Rolo Picador","Labor - Rabasto",
    "Labor - Cosecha Soja","Labor - Cosecha Maíz","Labor - Cosecha Girasol","Labor - Cosecha Trigo","Labor - Cosecha Cebada","Labor - Cosecha Sorgo","Labor - Cosecha Algodón Husillo","Labor - Cosecha Algodón Striper",
    "Labor - Otro",
    "Pulverización Terrestre","Pulverización Aérea","Pulverización Drone","Siembra","Fertilización Incorporada","Fertilización Líquida","Cosecha","Otro"
  ];
  // Precio base por tipo (USD/ha). Cosechas con % se calculan aparte.
  const COSTOS_LABOR_DEFAULT = {
    "Labor - Pulverización Terrestre": 6, "Pulverización Terrestre": 6, "TERRESTRE": 6, "Terrestre": 6,
    "Labor - Pulverización Aérea": 12, "Pulverización Aérea": 12, "AEREA": 12, "Aérea": 12,
    "Labor - Pulverización Selectiva": 12, "Labor - Pulverización Dirigida": 12,
    "Labor - Siembra Gruesa": 50, "Labor - Siembra Fina": 45, "Labor - Siembra Aérea": 30, "Siembra": 50,
    "Labor - Fertilización Incorporada": 15, "Fertilización Incorporada": 15,
    "Labor - Fertilización Liquida": 15, "Fertilización Líquida": 15,
    "Labor - Disco Liviano": 60, "Labor - Disco Pesado": 90, "Labor - Disco Cadena": 35,
    "Labor - Cincel": 60, "Labor - REJA CARPIDOR": 40, "Labor - Rolo Picador": 25,
    "Labor - Cosecha Algodón Husillo": 260, "Labor - Cosecha Algodón Striper": 140,
    "Pulverización Drone": 10, "Drone": 10, "DRONE": 10,
  };
  // Cosechas con % del precio del grano
  const COSECHAS_PCT = {
    "Labor - Cosecha Soja": 8, "Labor - Cosecha Maíz": 6, "Labor - Cosecha Girasol": 6,
    "Labor - Cosecha Trigo": 11, "Labor - Cosecha Cebada": 8, "Labor - Cosecha Sorgo": 8,
    "Cosecha": 8,
  };

  // Valorizar labores masivamente o por aplicación
  const valorizarLaboresFn = async (soloApp = null, soloTipo = null) => {
    const tok = session?.access_token || SUPABASE_KEY;
    const appsTarget = soloApp ? [soloApp] : aplicaciones.filter(a =>
      (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
      (filtroCampo === "todos" || a.campo_nombre === filtroCampo) &&
      (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) &&
      (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana) &&
      (!soloTipo || a.tipo_aplicacion === soloTipo)
    );
    let ok = 0;
    for (const app of appsTarget) {
      const tipo = app.tipo_aplicacion || "";
      let nuevoCosto = preciosLabores[tipo] !== undefined ? parseFloat(preciosLabores[tipo]) : COSTOS_LABOR_DEFAULT[tipo];
      // Si es cosecha con %, calcular desde precio de grano
      if (!nuevoCosto && COSECHAS_PCT[tipo]) {
        nuevoCosto = parseFloat(precioGranoLabor) * COSECHAS_PCT[tipo] / 100;
      }
      if (!nuevoCosto) continue;
      const res = await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${app.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
        body: JSON.stringify({ costo_labor_ha: nuevoCosto })
      });
      if (res.ok) ok++;
    }
    await fetchAplicaciones();
    alert(`✅ ${ok} aplicaciones valorizadas.`);
  };

  const saveAplicacion = async () => {
    const lotesValidos = newApp.lotes.filter(l => l.lote_nombre);
    if (!lotesValidos.length || !newApp.fecha) return;
    const tok = session?.access_token || SUPABASE_KEY;
    const costoTotal = newApp.productos.reduce((s, p) => s + (parseFloat(p.costo_total) || 0), 0);
    try {
      // Crear un registro por lote
      for (const lote of lotesValidos) {
        await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones`, {
          method: "POST",
          headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
          body: JSON.stringify({
            empresa_nombre: newApp.empresa_nombre,
            campo_nombre: newApp.campo_nombre,
            lote_nombre: lote.lote_nombre,
            superficie_ha: parseFloat(lote.superficie_ha) || null,
            cultivo: newApp.cultivo,
            fecha: newApp.fecha,
            tipo_aplicacion: newApp.tipo_aplicacion,
            numero_orden: newApp.numero_orden || null,
            costo_labor_ha: parseFloat(newApp.costo_labor_ha) || COSTOS_LABOR_DEFAULT[newApp.tipo_aplicacion] || null,
            observaciones: newApp.observaciones,
            costo_total_usd: costoTotal,
            productos: newApp.productos
          })
        });
      }
      setNewApp({ empresa_nombre: "", campo_nombre: "", lotes: [{ lote_nombre: "", superficie_ha: "" }], cultivo: "", fecha: new Date().toISOString().split("T")[0], tipo_aplicacion: "", labor_tipo: "", observaciones: "", productos: [] });
      setShowFormApp(false);
      fetchAplicaciones();
    } catch (e) { alert("Error al guardar"); }
  };

  const fetchCotizaciones = async () => {
    setCargandoCot(true);
    try {
      const res = await fetch("/api/cotizaciones");
      if (res.ok) { const d = await res.json(); if (d.success) setCotizaciones(d.data); }
    } catch {}
    setCargandoCot(false);
  };

  const calcMargen = (nm, costoAgroHa) => {
    const ha = parseFloat(nm.hectareas) || 0;
    const qq = parseFloat(nm.rendimiento_qq) || 0;
    const precioRosario = parseFloat(nm.precio_rosario_usd) || 0;
    const flete = parseFloat(nm.flete_usd) || 0;
    const pctCom = parseFloat(nm.pct_comercializacion) || 2;
    const precioNeto = precioRosario - flete - (precioRosario * pctCom / 100);
    const ingresoHa = qq * precioNeto / 10; // qq/ha * USD/tn / 10 = USD/ha
    const agroquimicosHa = parseFloat(nm.costo_agroquimicos_ha) || costoAgroHa;
    // labores: si no se ingresó manual, tomar de aplicaciones (costo_labor_ha * superficie)
    const gastosVarHa = (parseFloat(nm.costo_semilla_ha)||0) + (parseFloat(nm.costo_labores_ha)||0) +
      agroquimicosHa + (parseFloat(nm.costo_fertilizantes_ha)||0) + (parseFloat(nm.costo_otros_ha)||0);
    const cosechaHa = parseFloat(nm.costo_cosecha_ha) || 0;
    const contribucionHa = ingresoHa - gastosVarHa - cosechaHa;
    const gerenHa = parseFloat(nm.costo_gerenciamiento_ha) || 0;
    // Arrendamiento
    let arrHa = 0;
    if (nm.modalidad_arr === "arrendamiento") {
      const precioSojaArr = parseFloat(nm.arr_precio_soja) || parseFloat(nm.precio_rosario_usd) || 330;
      arrHa = (parseFloat(nm.arr_qq_soja)||0) * precioSojaArr / 10;
    } else if (nm.modalidad_arr === "aparceria") {
      const ingresoNominal = qq * precioRosario / 10; // rinde × precio Rosario bruto
      arrHa = ingresoNominal * (parseFloat(nm.apar_pct)||0) / 100;
    }
    const mbHa = contribucionHa - gerenHa - arrHa;
    return { ha, ingresoHa, gastosVarHa, cosechaHa, contribucionHa, gerenHa, arrHa, mbHa,
      mbTotal: mbHa * ha, precioNeto, agroquimicosHa };
  };

  const saveMargen = async () => {
    // En modo campo no hay lote, en modo lote es obligatorio
    if (nivelMB === "lote" && !newMargen.lote_nombre) return;
    if (!newMargen.campo_nombre && !newMargen.lote_nombre) return;
    const appsParaSave = aplicaciones.filter(a =>
      (nivelMB === "campo"
        ? (!newMargen.campo_nombre || a.campo_nombre === newMargen.campo_nombre)
        : (a.lote_nombre === newMargen.lote_nombre && (!newMargen.campo_nombre || a.campo_nombre === newMargen.campo_nombre))) &&
      (!newMargen.empresa_nombre || a.empresa_nombre?.trim() === newMargen.empresa_nombre?.trim()) &&
      (!newMargen.campana || getCampanaFecha(a.fecha) === newMargen.campana)
    );
    const haTotalSave = parseFloat(newMargen.hectareas) || 1;
    const costoAgroTotalSave = appsParaSave.reduce((s, a) => {
      const haApp = parseFloat(a.superficie_ha) || 1;
      const costoHaApp = (a.productos||[]).reduce((ps, p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0);
      return s + (costoHaApp * haApp);
    }, 0);
    const costoAgroHa = newMargen.costo_agroquimicos_ha !== ""
      ? parseFloat(newMargen.costo_agroquimicos_ha) || 0
      : (haTotalSave > 0 ? costoAgroTotalSave / haTotalSave : 0);
    const TIPOS_PULV_SAVE = ["Pulverización Terrestre","Terrestre","TERRESTRE","Pulverización Aérea","Aérea","AEREA","Pulverización Drone","Drone","DRONE"];
    const costoLabTotalSave = appsParaSave.filter(a => TIPOS_PULV_SAVE.includes(a.tipo_aplicacion)).reduce((s, a) => {
      const haApp = parseFloat(a.superficie_ha) || 1;
      const costoLab = parseFloat(a.costo_labor_ha) || COSTOS_LABOR_DEFAULT[a.tipo_aplicacion] || 0;
      return s + (costoLab * haApp);
    }, 0);
    const costoLabHaAutoSave = haTotalSave > 0 ? costoLabTotalSave / haTotalSave : 0;
    const TIPOS_SEM_SAVE = ["Siembra","SIEMBRA","Siembra Gruesa","Siembra Fina","Siembra Aérea","SIEMBRA GRUESA","SIEMBRA FINA","Labor - Siembra Gruesa","Labor - Siembra Fina","Labor - Siembra Aérea"];
    const costoSemTotalSave = appsParaSave.filter(a => TIPOS_SEM_SAVE.includes(a.tipo_aplicacion)).reduce((s, a) => {
      const haApp = parseFloat(a.superficie_ha) || 1;
      const laborSiembra = parseFloat(a.costo_labor_ha) || COSTOS_LABOR_DEFAULT[a.tipo_aplicacion] || 0;
      const prodsSiembra = (a.productos||[]).reduce((ps, p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0);
      return s + ((laborSiembra + prodsSiembra) * haApp);
    }, 0);
    const costoSemHaAutoSave = haTotalSave > 0 ? costoSemTotalSave / haTotalSave : 0;
    const TIPOS_COS_SAVE = ["Cosecha","COSECHA","Labor - Cosecha","Trilla"];
    const costoCosTotalSave = appsParaSave.filter(a => TIPOS_COS_SAVE.includes(a.tipo_aplicacion)).reduce((s, a) => {
      const haApp = parseFloat(a.superficie_ha) || 1;
      const costoLab = parseFloat(a.costo_labor_ha) || COSTOS_LABOR_DEFAULT[a.tipo_aplicacion] || 0;
      return s + (costoLab * haApp);
    }, 0);
    const costoCosHaAutoSave = haTotalSave > 0 ? costoCosTotalSave / haTotalSave : 0;
    // Semilla desde lotes_semillas (misma lógica que el formulario visual)
    const semHaSave = (() => {
      if (newMargen.costo_semilla_ha !== "") return parseFloat(newMargen.costo_semilla_ha)||0;
      if (mbSemillas.length > 0) {
        const semLotes = mbSemillas.filter(s =>
          (!newMargen.campo_nombre || s.campo_nombre === newMargen.campo_nombre) &&
          (!newMargen.lote_nombre || String(s.lote_nombre) === String(newMargen.lote_nombre))
        );
        if (semLotes.length > 0) {
          const totalCosto = semLotes.reduce((s,x) => s + (parseFloat(x.semilla_ha)||0)*(parseFloat(x.pct_lote)||100)/100, 0);
          return totalCosto; // ya es por ha ponderado
        }
      }
      return costoSemHaAutoSave;
    })();

    // Curasemilla y labor siembra desde costos_produccion
    const cultSave = newMargen.cultivo || "";
    const normSave = s => s.replace(/\s+(1ra|2da|3ra|Hab)/i,"").trim();
    const cpSave = mbCostosProduccion.find(c => c.cultivo === cultSave) ||
                   mbCostosProduccion.find(c => normSave(c.cultivo) === normSave(cultSave)) ||
                   mbCostosProduccion.find(c => c.cultivo.split(" ")[0] === cultSave.split(" ")[0]) ||
                   null;
    const curaHaSave  = parseFloat(cpSave?.curasemilla_ha)  || 0;
    const lsiemHaSave = parseFloat(cpSave?.labor_siembra_ha) || 0;
    const lcosHaSave  = parseFloat(cpSave?.labor_cosecha_ha) || 0;

    const nmConAuto = {
      ...newMargen,
      costo_labores_ha: newMargen.costo_labores_ha !== "" ? newMargen.costo_labores_ha : String(costoLabHaAutoSave + lsiemHaSave),
      costo_semilla_ha: String(semHaSave + curaHaSave),
      costo_cosecha_ha: newMargen.costo_cosecha_ha !== "" ? newMargen.costo_cosecha_ha : (costoCosHaAutoSave > 0 ? String(costoCosHaAutoSave) : String(lcosHaSave)),
    };
    const r = calcMargen(nmConAuto, costoAgroHa);
    const ing = r.ingresoHa * r.ha;
    const costos = (r.gastosVarHa + r.cosechaHa + r.gerenHa + r.arrHa) * r.ha;
    const mb = ing - costos;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/margen_bruto`, {
        method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`, Prefer: "return=minimal" },
        body: JSON.stringify({
            empresa_nombre: newMargen.empresa_nombre, campo_nombre: newMargen.campo_nombre,
            lote_nombre: nivelMB === 'campo' ? '(Campo completo)' : newMargen.lote_nombre, cultivo: newMargen.cultivo, campana: newMargen.campana || (() => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; })(),
            hectareas: r.ha, rendimiento_qq: parseFloat(newMargen.rendimiento_qq)||null,
            precio_grano_usd: parseFloat(newMargen.precio_rosario_usd)||null,
            ingreso_bruto_usd: ing,
            costo_semilla_usd: (parseFloat(nmConAuto.costo_semilla_ha)||0) * r.ha,
            costo_labores_usd: r.gastosVarHa > 0 ? ((parseFloat(nmConAuto.costo_labores_ha)||0) * r.ha) : 0,
            costo_agroquimicos_usd: r.agroquimicosHa * r.ha,
            costo_fertilizantes_usd: (parseFloat(newMargen.costo_fertilizantes_ha)||0) * r.ha,
            costo_cosecha_usd: (parseFloat(nmConAuto.costo_cosecha_ha)||0) * r.ha,
            costo_gerenciamiento_usd: r.gerenHa * r.ha,
            costo_arrendamiento_usd: r.arrHa * r.ha,
            costo_otros_usd: (parseFloat(newMargen.costo_otros_ha)||0) * r.ha,
            modalidad_arr: newMargen.modalidad_arr,
            margen_bruto_usd: r.mbTotal,
            margen_bruto_ha_usd: r.mbHa,
            margen_bruto_pct: ing > 0 ? (r.mbTotal / ing * 100) : null
          })
      });
      setNewMargen({ lote_nombre: "", empresa_nombre: "", campo_nombre: "", cultivo: "", campana: "", hectareas: "", rendimiento_qq: "", precio_grano_usd: "", costo_semilla_usd: "", costo_labores_usd: "", costo_agroquimicos_usd: "", costo_arrendamiento_usd: "", costo_flete_usd: "", costo_otros_usd: "" });
      setShowFormMargen(false);
      fetchMargenes();
    } catch (e) { alert("Error al guardar"); }
  };

  const saveMargenPorLotes = async () => {
    // Guarda un registro de MB por cada lote del campo
    // El cultivo se toma de la planificación por lote (si no hay cultivo seleccionado manualmente)
    const { empresa_nombre, campo_nombre, cultivo, campana } = newMargen;
    const campoValido = nivelMB === "multi" ? selectedCamposMB.length > 0 : !!campo_nombre;
    if (!empresa_nombre || !campoValido) {
      alert("Seleccioná empresa y campo primero");
      return;
    }
    // En modo multi usar los lotes seleccionados con checkboxes
    const lotesConCultivo = nivelMB === "multi"
      ? selectedLotesMB
      : [...new Set(aplicaciones.filter(a =>
          a.empresa_nombre?.trim() === empresa_nombre?.trim() &&
          (selectedCamposMB.length > 0 ? selectedCamposMB.includes(a.campo_nombre) : a.campo_nombre === campo_nombre) &&
          (!campana || getCampanaFecha(a.fecha) === campana)
        ).map(a => a.lote_nombre).filter(Boolean))];

    if (lotesConCultivo.length === 0) {
      alert(nivelMB === "multi" ? "Seleccioná al menos un lote." : `No hay lotes en ${campo_nombre}.`);
      return;
    }
    if (!window.confirm(`¿Guardar MB para ${lotesConCultivo.length} lote${lotesConCultivo.length!==1?"s":""}?\n${lotesConCultivo.join(", ")}`)) return;
    const tok = session?.access_token || SUPABASE_KEY;
    let ok = 0, err = 0;
    for (const lote of lotesConCultivo) {
      // Apps del lote: todas las de la campaña (en cualquier campo seleccionado)
      const appsLote = aplicaciones.filter(a =>
        a.empresa_nombre?.trim() === empresa_nombre?.trim() &&
        a.lote_nombre === lote &&
        (!campana || getCampanaFecha(a.fecha) === campana)
      );
      // Ha del lote: 1) manual, 2) aplicaciones, 3) planificación
      const haMap = {};
      appsLote.forEach(a => { if (a.lote_nombre && a.superficie_ha) { const h = parseFloat(a.superficie_ha)||0; if (h > (haMap[a.lote_nombre]||0)) haMap[a.lote_nombre] = h; } });
      const haDePlan = planificacion.find(p => p.empresa_nombre?.trim() === empresa_nombre?.trim() && p.campo_nombre === campo_nombre && p.lote_nombre === lote)?.hectareas;
      const haLote = parseFloat(newMargen.hectareas) || haMap[lote] || parseFloat(haDePlan) || 1;
      // Costos auto
      const TIPOS_PULV = ["Pulverización Terrestre","Terrestre","TERRESTRE","Pulverización Aérea","Aérea","AEREA","Pulverización Drone","Drone","DRONE"];
      const TIPOS_SEM = ["Siembra","SIEMBRA","Siembra Gruesa","Siembra Fina","Siembra Aérea","SIEMBRA GRUESA","SIEMBRA FINA","Labor - Siembra Gruesa","Labor - Siembra Fina","Labor - Siembra Aérea"];
      const TIPOS_COS = ["Cosecha","COSECHA","Labor - Cosecha","Trilla"];
      const costoAgroTotal = appsLote.reduce((s, a) => {
        const haApp = parseFloat(a.superficie_ha) || 1;
        const costoHaApp = (a.productos||[]).reduce((ps, p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0);
        return s + (costoHaApp * haApp);
      }, 0);
      const costoAgroHa = haLote > 0 ? costoAgroTotal / haLote : 0;
      const costoLabTotal = appsLote.filter(a => TIPOS_PULV.includes(a.tipo_aplicacion)).reduce((s, a) => {
        const haApp = parseFloat(a.superficie_ha) || 1;
        const costoLab = parseFloat(a.costo_labor_ha) || COSTOS_LABOR_DEFAULT[a.tipo_aplicacion] || 0;
        return s + (costoLab * haApp);
      }, 0);
      const costoLabHa = haLote > 0 ? costoLabTotal / haLote : 0;
      // Semilla desde lotes_semillas por lote
      const semLote = mbSemillas.filter(s =>
        (!newMargen.campo_nombre || s.campo_nombre === newMargen.campo_nombre) &&
        String(s.lote_nombre) === String(lote)
      );
      const costoSemDesdeEst = semLote.length > 0
        ? semLote.reduce((s,x) => s+(parseFloat(x.semilla_ha)||0)*(parseFloat(x.pct_lote)||100)/100, 0)
        : 0;

      // Curasemilla, labor siembra y labor cosecha desde costos_produccion
      const cultivoLoteCP = newMargen.cultivo || "";
      const normCP = s => s.replace(/\s+(1ra|2da|3ra|Hab)/i,"").trim();
      const cpLote = mbCostosProduccion.find(c => c.cultivo === cultivoLoteCP) ||
                     mbCostosProduccion.find(c => normCP(c.cultivo) === normCP(cultivoLoteCP)) ||
                     mbCostosProduccion.find(c => cultivoLoteCP && c.cultivo.split(" ")[0] === cultivoLoteCP.split(" ")[0]) ||
                     null;
      const curaLote  = parseFloat(cpLote?.curasemilla_ha)  || 0;
      const lsiemLote = parseFloat(cpLote?.labor_siembra_ha) || 0;
      const lcosLote  = parseFloat(cpLote?.labor_cosecha_ha) || 0;

      const costoSemHa = costoSemDesdeEst > 0 ? costoSemDesdeEst + curaLote : (() => {
        const costoSemTotal = appsLote.filter(a => TIPOS_SEM.includes(a.tipo_aplicacion)).reduce((s, a) => {
          const haApp = parseFloat(a.superficie_ha) || 1;
          const prodsSiembra = (a.productos||[]).reduce((ps, p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0);
          return s + (prodsSiembra * haApp);
        }, 0);
        return (haLote > 0 ? costoSemTotal / haLote : 0) + curaLote;
      })();

      const costoCosTotal = appsLote.filter(a => TIPOS_COS.includes(a.tipo_aplicacion)).reduce((s, a) => {
        const haApp = parseFloat(a.superficie_ha) || 1;
        const costoLab = parseFloat(a.costo_labor_ha) || COSTOS_LABOR_DEFAULT[a.tipo_aplicacion] || 0;
        return s + (costoLab * haApp);
      }, 0);
      const costoCosHaApps = haLote > 0 ? costoCosTotal / haLote : 0;
      const costoCosHa = costoCosHaApps > 0 ? costoCosHaApps : lcosLote;

      const nmLote = {
        ...newMargen,
        lote_nombre: lote,
        hectareas: haLote,
        costo_labores_ha: newMargen.costo_labores_ha !== "" ? newMargen.costo_labores_ha : String(costoLabHa + lsiemLote),
        costo_semilla_ha: newMargen.costo_semilla_ha !== "" ? newMargen.costo_semilla_ha : String(costoSemHa),
        costo_cosecha_ha: newMargen.costo_cosecha_ha !== "" ? newMargen.costo_cosecha_ha : String(costoCosHa),
      };
      const r = calcMargen(nmLote, costoAgroHa);
      const ing = r.ingresoHa * r.ha;
      const costos = (r.gastosVarHa + r.cosechaHa + r.gerenHa + r.arrHa) * r.ha;
      // Cultivo: 1) manual si se seleccionó 2) de planificacion por lote
      const norm = s => String(s||"").trim().toLowerCase();
                            const normLote = (a, b) => { if (norm(a)===norm(b)) return true; const nA=(norm(a).match(/\d+$/)||[])[0]; const nB=(norm(b).match(/\d+$/)||[])[0]; return nA&&nB&&nA===nB; };
      const cultivoLote = cultivo || planificacion.find(p =>
        norm(p.empresa_nombre) === norm(empresa_nombre) &&
        norm(p.campo_nombre) === norm(campo_nombre) &&
        norm(p.lote_nombre) === norm(lote) &&
        (!campana || p.campana === campana)
      )?.cultivo || "";
      const body = {
        empresa_nombre, campo_nombre, lote_nombre: lote, cultivo: cultivoLote,
        campana: campana || (() => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; })(),
        hectareas: r.ha,
        rendimiento_qq: parseFloat(newMargen.rendimiento_qq)||null,
        precio_grano_usd: parseFloat(newMargen.precio_rosario_usd)||null,
        ingreso_bruto_usd: ing,
        costo_semilla_usd: (parseFloat(nmLote.costo_semilla_ha)||0)*r.ha,
        costo_labores_usd: (parseFloat(nmLote.costo_labores_ha)||0)*r.ha,
        costo_agroquimicos_usd: costoAgroHa*r.ha,
        costo_fertilizantes_usd: (parseFloat(nmLote.costo_fertilizantes_ha)||0)*r.ha,
        costo_cosecha_usd: r.cosechaHa*r.ha,
        costo_gerenciamiento_usd: r.gerenHa*r.ha,
        costo_arrendamiento_usd: r.arrHa*r.ha,
        costo_otros_usd: (parseFloat(nmLote.costo_otros_ha)||0)*r.ha,
        modalidad_arr: newMargen.modalidad_arr,
        margen_bruto_usd: r.mbTotal,
        margen_bruto_ha_usd: r.mbHa,
        margen_bruto_pct: ing > 0 ? (r.mbTotal/ing*100) : null,
      };
      const existing = margenes.find(m => m.empresa_nombre === empresa_nombre && m.campo_nombre === campo_nombre && m.lote_nombre === lote && m.campana === body.campana && m.cultivo === cultivoLote);
      const res = existing
        ? await fetch(`${SUPABASE_URL}/rest/v1/margen_bruto?id=eq.${existing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" }, body: JSON.stringify(body) })
        : await fetch(`${SUPABASE_URL}/rest/v1/margen_bruto`, { method: "POST", headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" }, body: JSON.stringify(body) });
      res.ok ? ok++ : err++;
    }
    await fetchMargenes();
    alert(`✅ ${ok} lote${ok!==1?"s":""} guardado${ok!==1?"s":""}${err>0?` (${err} errores)`:""}`);
    setShowFormMargen(false);
  };

  const saveEditMargen = async () => {
    if (!editandoMargen) return;
    const ha = parseFloat(editandoMargen.hectareas) || 1;
    const qq = parseFloat(editandoMargen.rendimiento_qq) || 0;
    const precioRosario = parseFloat(editandoMargen.precio_grano_usd) || 0;
    const flete = parseFloat(editandoMargen.flete_usd) || 0;
    const pctCom = parseFloat(editandoMargen.pct_comercializacion) || 2;
    const precioNeto = precioRosario - flete - (precioRosario * pctCom / 100);
    const ingresoHa = qq * precioNeto / 10;
    const ing = ingresoHa * ha;
    const costoSemHa = parseFloat(editandoMargen.costo_semilla_ha) || 0;
    const costoLabHa = parseFloat(editandoMargen.costo_labores_ha) || 0;
    const costoAgroHa = parseFloat(editandoMargen.costo_agroquimicos_ha) || 0;
    const costoFertHa = parseFloat(editandoMargen.costo_fertilizantes_ha) || 0;
    const costoCosHa = parseFloat(editandoMargen.costo_cosecha_ha) || 0;
    const costoGerHa = parseFloat(editandoMargen.costo_gerenciamiento_ha) || 0;
    const costoArrHa = parseFloat(editandoMargen.costo_arrendamiento_ha) || 0;
    const costoOtrosHa = parseFloat(editandoMargen.costo_otros_ha) || 0;
    const gastosVarHa = costoSemHa + costoLabHa + costoAgroHa + costoFertHa + costoOtrosHa;
    const contribucionHa = ingresoHa - gastosVarHa - costoCosHa;
    const mbHa = contribucionHa - costoGerHa - costoArrHa;
    const mbTotal = mbHa * ha;
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/margen_bruto?id=eq.${editandoMargen.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}`, Prefer: "return=minimal" },
        body: JSON.stringify({
          empresa_nombre: editandoMargen.empresa_nombre,
          campo_nombre: editandoMargen.campo_nombre,
          lote_nombre: editandoMargen.lote_nombre,
          cultivo: editandoMargen.cultivo,
          campana: editandoMargen.campana,
          hectareas: ha,
          rendimiento_qq: qq || null,
          precio_grano_usd: precioRosario || null,
          flete_usd: flete || null,
          pct_comercializacion: pctCom,
          ingreso_bruto_usd: ing,
          costo_semilla_usd: costoSemHa * ha,
          costo_labores_usd: costoLabHa * ha,
          costo_agroquimicos_usd: costoAgroHa * ha,
          costo_fertilizantes_usd: costoFertHa * ha,
          costo_cosecha_usd: costoCosHa * ha,
          costo_gerenciamiento_usd: costoGerHa * ha,
          costo_arrendamiento_usd: costoArrHa * ha,
          costo_otros_usd: costoOtrosHa * ha,
          margen_bruto_usd: mbTotal,
          margen_bruto_ha_usd: mbHa,
          margen_bruto_pct: ing > 0 ? (mbTotal / ing * 100) : null,
        })
      });
      setEditandoMargen(null);
      fetchMargenes();
    } catch (e) { alert("Error al guardar"); }
  };

  const deleteMargen = async (id) => {
    if (!window.confirm("Eliminar este calculo de margen bruto?")) return;
    await fetch(`${SUPABASE_URL}/rest/v1/margen_bruto?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${session?.access_token || SUPABASE_KEY}` }
    });
    fetchMargenes();
  };

  const deleteSelectedMargenes = async () => {
    if (selectedMargenes.length === 0) return;
    if (!window.confirm(`¿Eliminar ${selectedMargenes.length} registro${selectedMargenes.length > 1 ? "s" : ""} de margen bruto? Esta acción no se puede deshacer.`)) return;
    const tok = session?.access_token || SUPABASE_KEY;
    try {
      await Promise.all(
        selectedMargenes.map(id =>
          fetch(`${SUPABASE_URL}/rest/v1/margen_bruto?id=eq.${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              apikey: SUPABASE_KEY,
              Authorization: `Bearer ${tok}`,
              Prefer: "return=minimal"
            }
          })
        )
      );
      setSelectedMargenes([]);
      fetchMargenes();
    } catch(e) {
      alert("Error al eliminar: " + e.message);
    }
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

  // Calcula costo/ha según unidad: cc/ha divide por 1000, lts/ha y kg/ha no
  const calcularCostoHa = (dosisNum, unidad, precioUsd) => {
    const u = (unidad || '').toString().toLowerCase().trim();
    // cc/ha y ml/ha → precio en USD/litro → dividir por 1000
    // gr/ha y g/ha → precio en USD/kg → dividir por 1000
    const divisor = (u.includes('cc') || u.includes('ml') || u.startsWith('gr') || u.startsWith('g/')) ? 1000 : 1;
    return (dosisNum / divisor) * parseFloat(precioUsd || 0);
  };

  const parsearDosis = (dosisStr) => {
    if (!dosisStr) return { valor: "", unidad: "cc/ha" };
    const str = dosisStr.toString().trim();
    const match = str.match(/^([\d.,]+)\s*(.*)$/);
    if (match) return { valor: match[1].replace(",", "."), unidad: match[2].trim() || "cc/ha" };
    return { valor: str, unidad: "cc/ha" };
  };

  const procesarVariosArchivos = async (files) => {
    if (!files || files.length === 0) return;
    setProcesandoIA(true);
    const fileArray = Array.from(files);
    let exitosos = 0, fallidos = 0, errores = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      const result = await procesarFotoIA(file);
      if (result.success && result.data) {
        const extracted = result.data;
        const lotes = extracted.lotes?.length > 0 ? extracted.lotes : [{ nombre: "", sup_a_aplicar_ha: extracted.sup_a_aplicar_total_ha || "" }];

        for (const lote of lotes) {
          const superficieHa = parseFloat(lote.sup_a_aplicar_ha) || parseFloat(extracted.sup_a_aplicar_total_ha) || "";
          const nuevaApp = {
            lote_nombre: lote.nombre || "",
            empresa_nombre: extracted.empresa || "",
            campo_nombre: extracted.campo || "",
            cultivo: extracted.cultivo || "",
            fecha: extracted.fecha || new Date().toISOString().split("T")[0],
            tipo_aplicacion: extracted.tipo_aplicacion || "",
            superficie_ha: superficieHa,
            diagnostico: extracted.diagnostico || "",
            es_insecticida: extracted.es_insecticida || false,
            plaga_objetivo: extracted.plaga_objetivo || "",
            contratista: extracted.contratista || "",
            numero_orden: extracted.numero_orden || "",
            observaciones: extracted.observaciones || "",
            agua_volumen: extracted.agua_volumen || "",
            momento_aplicacion: extracted.momento_aplicacion || "",
            observaciones: `PDF: ${file.name}`,
            productos: (extracted.productos || []).map(p => {
              const { valor, unidad } = parsearDosis(p.dosis);
              const _norm = s => (s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
              const prodEnCatalogo = (() => {
                const appN = _norm(p.nombre);
                // 1. Match exacto
                let m = productos.find(prod => _norm(prod.nombre) === appN);
                if (m) return m;
                // 2. PDF contiene al catálogo pero diferencia mínima (≤2 chars extra)
                m = productos.find(prod => { const catN = _norm(prod.nombre); return appN.includes(catN) && appN.length - catN.length <= 2; });
                if (m) return m;
                // 3. Catálogo contiene al PDF pero diferencia mínima (≤2 chars extra)
                m = productos.find(prod => { const catN = _norm(prod.nombre); return catN.includes(appN) && catN.length - appN.length <= 2; });
                return m || null;
              })();
              const dosisNum = parseFloat(valor) || 0;
              return {
                producto_nombre: p.nombre,
                dosis: valor,
                unidad: p.unidad || unidad,
                precio_usd: prodEnCatalogo?.precio_usd || "",
                costo_total: prodEnCatalogo?.precio_usd
                  ? calcularCostoHa(dosisNum, p.unidad || unidad, prodEnCatalogo.precio_usd).toFixed(2)
                  : ""
              };
            })
          };

          try {
            const costoTotal = nuevaApp.productos.reduce((s, p) => s + (parseFloat(p.costo_total) || 0), 0);
            const authToken = session?.access_token || SUPABASE_KEY;
            const res = await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones`, {
              method: "POST",
              headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${authToken}`, Prefer: "return=minimal" },
              body: JSON.stringify({ ...nuevaApp, productos: JSON.stringify(nuevaApp.productos), costo_total_usd: costoTotal })
            });
            if (res.ok) exitosos++;
            else { errores.push(`${lote.nombre || file.name}: HTTP ${res.status}`); fallidos++; }
          } catch(e) { errores.push(`${lote.nombre || file.name}: ${e.message}`); fallidos++; }
        }
      } else {
        errores.push(`${file.name}: no se pudo extraer`);
        fallidos++;
      }
    }
    await fetchAplicaciones();
    const msg = `✅ ${exitosos} orden${exitosos !== 1 ? 'es' : ''} importada${exitosos !== 1 ? 's' : ''} correctamente.${fallidos > 0 ? '\n⚠ ' + fallidos + ' con error:\n' + errores.slice(0,3).join('\n') : ''}`;
    alert(msg);
    setProcesandoIA(false);
  };

  // ── DETAIL / EDIT VIEW ────────────────────────────────────────────
  if (selected) return (
    <div style={st.app}>
      <style>{GLOBAL_CSS}</style>
      <header style={st.header}>
        <span style={{ fontSize: 17, color: "#4ae87a", letterSpacing: 2, fontWeight: 700, fontFamily: F }}>🌱 Ing. Agr. Ignacio Herrera</span>
        <span style={{ color: C.headerDim, fontSize: 12, fontFamily: F }}>{time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
      </header>
      <main style={st.main}>
        {editing ? (
          <EditarMonitoreo
            m={selected}
            session={session}
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
  const hasFilters = filtroEmpresa !== "todas" || filtroCampo !== "todos" || filtroLote !== "todos" || filtroCultivo !== "todos" || filtroPeriodo !== "todo" || filtroCampana !== "todas";
  const navItems = [
    ["dashboard",    "◉ Dashboard",                    "◉",  "Dashboard"],
    ["tablero",      "🗺️ Tablero",                     "🗺️", "Tablero"],
    ["graficos",     "📈 Gráficos",                    "📈", "Gráficos"],
    ["comparativa",  "📊 Comparativa",                 "📊", "Comparativa"],
    ["alertas",      `⚠ Alertas${alertas.length > 0 ? ` (${alertas.length})` : ""}`, "⚠", `Alertas${alertas.length > 0 ? ` (${alertas.length})` : ""}`],
    ["registros",    `⊞ Registros (${filtered.length})`, "⊞", "Registros"],
    ["aplicaciones", "💊 Aplicaciones",                "💊", "Aplicaciones"],
    ["productos",    "📦 Productos",                   "📦", "Productos"],
    ["margen",       "💰 Margen Bruto",                "💰", "Margen"],
    ["umbrales",     "⚙ Umbrales",                    "⚙",  "Umbrales"],
    ["historial",    "📋 Por Lote",                    "📋", "Por Lote"],
    ["planificacion","🌱 Planificación",               "🌱", "Plan"],
  ];

  // ── IMPORTAR MONITOREOS DESDE EXCEL ─────────────────────────
  const descargarPlantillaMonitoreos = async () => {
    const XLSX = await new Promise((resolve, reject) => {
      if (window.XLSX) { resolve(window.XLSX); return; }
      const s = document.createElement("script");
      s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      s.onload = () => resolve(window.XLSX); s.onerror = reject;
      document.head.appendChild(s);
    });
    const cols = ["FECHA","EMPRESA","CAMPO","LOTE","CULTIVO","ESTADIO","ISOCAS","CHINCHES","PULGONES","CHICHARRITA","TRIPS","ARAÑUELAS","COGOLLERO","GUSANO_ESPIGA","ENFERMEDADES","OBSERVACIONES"];
    const ejemplos = [
      ["2026-03-15","BERTOLI VARRONE","BERTOLI VARRONE","URUNDAY 2 (U2)","Soja 1ra","R3",2,1,"BAJO","","MEDIO","","","","","Presión alta de isocas"],
      ["2026-03-15","AGROCORSI","EL PAMPA","V5","Soja 1ra","R3",0,"","","","","","","","","Sin daños"],
      ["2026-03-15","VACHETTA JORGE","DON ALBINO","LOTE 1","Soja 1ra","R4",1,"","BAJO","","","","","","",""],
    ];
    const wb = XLSX.utils.book_new();
    // Hoja Monitoreos
    const wsData = [cols, ...ejemplos];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    // Anchos de columna
    ws["!cols"] = [
      {wch:12},{wch:22},{wch:22},{wch:24},{wch:12},{wch:8},
      {wch:8},{wch:8},{wch:10},{wch:12},{wch:8},{wch:10},{wch:10},{wch:14},{wch:24},{wch:32}
    ];
    XLSX.utils.book_append_sheet(wb, ws, "Monitoreos");
    // Hoja Referencia
    const ref = [
      ["COLUMNA","TIPO","VALORES VÁLIDOS / FORMATO"],
      ["FECHA","Texto","YYYY-MM-DD  (ej: 2026-03-15)"],
      ["EMPRESA","Texto","Ver hoja Empresas"],
      ["CAMPO","Texto","Nombre del campo"],
      ["LOTE","Texto","Nombre del lote"],
      ["CULTIVO","Texto","Soja 1ra | Soja 2da | Maíz | Girasol | Sorgo"],
      ["ESTADIO","Texto","V1, V2 ... R1, R2 ... R6, etc."],
      ["ISOCAS","Número","Cantidad por paño (ej: 2.5)"],
      ["CHINCHES","Número","Cantidad por paño"],
      ["PULGONES","Texto","BAJO | MEDIO | ALTO"],
      ["CHICHARRITA","Número","Cantidad por paño"],
      ["TRIPS","Texto","BAJO | MEDIO | ALTO"],
      ["ARAÑUELAS","Texto","BAJO | MEDIO | ALTO"],
      ["COGOLLERO","Número","% daño (ej: 15)"],
      ["GUSANO_ESPIGA","Número","% daño (ej: 20)"],
      ["ENFERMEDADES","Texto","Nombre, separado por coma"],
      ["OBSERVACIONES","Texto","Texto libre"],
    ];
    const wsRef = XLSX.utils.aoa_to_sheet(ref);
    wsRef["!cols"] = [{wch:16},{wch:10},{wch:40}];
    XLSX.utils.book_append_sheet(wb, wsRef, "Referencia");
    // Hoja Empresas
    const empresasData = [
      ["EMPRESA","CAMPO","LOTES (ejemplos)"],
      ["HERRERA IGNACIO","LASTRA","1 | 2 | LASTRA ZULEMA"],
      ["AGROCORSI","EL PAMPA","V1A | V1B | V2 | V3 | V4 | V5 | V6 | V7 | V8 | V9 | V10A | V10B | V11"],
      ["AGROCORSI","SAN PEDRO","1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11A | 11B | 12"],
      ["BERTOLI VARRONE","BERTOLI VARRONE","URUNDAY 1 (U1) | URUNDAY 2 (U2) | URUNDAY 3 (U3) | ... | SANTA MARIA 1 (SM1) | ..."],
      ["BERTOLI VARRONE","BERTOLI VARRONE","LOS CORDOBESES 1 (LC1) | ... | VARGAS ETEL 1 (EV1) | ABRAHAM (A1) | KAKUY (K1)"],
      ["FERNANDO PIGHIN 2","EST. EL PROGRESO","LOTE 1 | LOTE 3 | LOTE 5 | 2A | 2B | LOTE 4A | LOTE 4B"],
      ["FERNANDO PIGHIN 2","EST. LA LUNA","FERNANDO 1 | FERNANDO 2 | ... | FERNANDO 7 | FERNANDO 8"],
      ["GREGORET HNOS","GREGORET HNOS","LA CUÑA | FIORI | ROMAN | LA PAMPITA | LA PERSEVERANCIA | NORA ANAYA"],
      ["GIANFRANCO BERTOLI","TIERRAS DEL OESTE","LOTE 1 | LOTE 2"],
      ["SIGOTO/GOROSITO/BERTOLI","EL OCASO","1 ESTE | 2 OESTE"],
      ["VACHETTA JORGE","DON ALBINO","LOTE 1 | LOTE 2"],
    ];
    const wsEmp = XLSX.utils.aoa_to_sheet(empresasData);
    wsEmp["!cols"] = [{wch:26},{wch:22},{wch:60}];
    XLSX.utils.book_append_sheet(wb, wsEmp, "Empresas");
    XLSX.writeFile(wb, "plantilla_monitoreos.xlsx");
  };

    const importarMonitoreosExcel = async (file) => {
    setImportandoMonitoreos(true);
    setImportResultadoMon(null);
    try {
      const XLSX = await new Promise((resolve, reject) => {
        if (window.XLSX) { resolve(window.XLSX); return; }
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        s.onload = () => resolve(window.XLSX); s.onerror = reject;
        document.head.appendChild(s);
      });
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      const tok = session?.access_token || SUPABASE_KEY;
      let ok = 0, err = 0, errores = [];

      for (const row of rows) {
        // Mapear columnas
        const get = (...keys) => { for (const k of keys) { const v = row[k] || row[k.toLowerCase()] || row[k.toUpperCase()]; if (v !== undefined && v !== '') return String(v).trim(); } return ''; };
        const fecha = get('FECHA', 'fecha', 'Fecha');
        const empresa = get('EMPRESA', 'empresa', 'Empresa');
        const campo = get('CAMPO', 'campo', 'Campo');
        const lote = get('LOTE', 'lote', 'Lote');
        if (!fecha || !empresa || !lote) { err++; errores.push(`Fila sin fecha/empresa/lote`); continue; }

        // Formatear fecha (soporta serial Excel, DD/MM/AAAA, AAAA-MM-DD)
        let fechaISO = fecha;
        if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
          // Ya es formato ISO YYYY-MM-DD, no tocar
          fechaISO = fecha;
        } else {
        const serialNum = parseFloat(fecha);
        if (!isNaN(serialNum) && serialNum > 1000) {
          // Serial numérico de Excel: días desde 1899-12-30
          const d = new Date(Date.UTC(1899, 11, 30) + serialNum * 86400000);
          fechaISO = d.toISOString().split('T')[0];
        } else if (fecha.includes('/')) {
          const parts = fecha.split('/');
          if (parts.length === 3) {
            fechaISO = parts[2].length === 4
              ? `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`
              : `20${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
          }
        }
        } // cierre else ISO

        const enfermedadesRaw = get('ENFERMEDADES', 'enfermedades');
        const enfermedades = enfermedadesRaw ? enfermedadesRaw.split(',').map(e => e.trim()).filter(Boolean) : [];

        const body = {
          fecha: fechaISO,
          empresa: empresa,
          campo: campo || '',
          lote: lote,
          cultivo: get('CULTIVO', 'cultivo', 'Cultivo') || '',
          estadio_fenologico: get('ESTADIO', 'estadio', 'Estadio') || '',
          isocas: parseFloat(get('ISOCAS', 'isocas')) || null,
          chinches: parseFloat(get('CHINCHES', 'chinches')) || null,
          pulgones: get('PULGONES', 'pulgones') || null,
          chicharrita: parseFloat(get('CHICHARRITA', 'chicharrita')) || null,
          trips: get('TRIPS', 'trips') || null,
          aranhuelas: get('ARAÑUELAS', 'aranhuelas', 'ARANHUELAS') || null,
          cogollero: parseFloat(get('COGOLLERO', 'cogollero')) || null,
          gusano_espiga: (() => { const v = parseFloat(get('GUSANO_ESPIGA', 'gusano_espiga', 'GUSANO ESPIGA')); return !isNaN(v) && v > 0 ? Math.round(v * 2) : null; })(),
          enfermedades: enfermedades.length > 0 ? enfermedades : null,
          observaciones: get('OBSERVACIONES', 'observaciones', 'Observaciones') || '',
        };

        try {
          console.log("IMPORT body:", JSON.stringify(body));
          const res = await fetch(`${SUPABASE_URL}/rest/v1/monitoreos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
            body: JSON.stringify(body)
          });
          if (res.ok) ok++; else { const errTxt = await res.text(); let errMsg = errTxt; try { const j = JSON.parse(errTxt); errMsg = j.message || j.hint || j.details || errTxt; } catch {} console.error("IMPORT error:", errMsg, "body:", body); err++; errores.push(`${empresa} - ${lote}: ${errMsg}`); }
        } catch(e) { err++; errores.push(e.message); }
      }

      setImportResultadoMon({ ok, err, errores });
      if (ok > 0) { setTimeout(() => fetchData(), 1000); }
      alert(`✅ ${ok} monitoreo${ok!==1?"s":""} importado${ok!==1?"s":""}${err > 0 ? `\n⚠ ${err} errores:\n${errores.slice(0,5).join("\n")}` : ""}`);
    } catch(e) {
      setImportResultadoMon({ ok: 0, err: 1, errores: [e.message] });
      alert("Error al importar: " + e.message);
    }
    setImportandoMonitoreos(false);
  };

  // ── EXPORTAR PDF DASHBOARD ────────────────────────────────
  const exportarDashboardPDF = ({ monHoy, mon7, mon30, lotesSinMon14, appsSinValorizar, alertas, aplicaciones, margenesFiltradosDash, mbTotal, mbHaProm, empresasActivas, monitoreos, margenes }) => {
    const fecha = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
    const campana = campanasDisponibles.find(c => c !== "todas") || "—";
    const html = `<!DOCTYPE html><html lang="es"><head><meta charset="utf-8"/>
    <title>Resumen Campaña ${campana}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; }
      body { font-family: 'Helvetica Neue', Arial, sans-serif; background:#fff; color:#111827; font-size:13px; }
      .header { background:#111827; color:#fff; padding:24px 32px; display:flex; justify-content:space-between; align-items:flex-end; }
      .header-logo { font-size:20px; font-weight:700; letter-spacing:1px; color:#4ade80; }
      .header-sub { font-size:12px; color:#9ca3af; margin-top:3px; }
      .header-right { text-align:right; font-size:11px; color:#6b7280; line-height:1.8; }
      .body { padding:28px 32px; }
      .section-title { font-size:10px; font-weight:700; color:#9ca3af; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px; padding-bottom:6px; border-bottom:1px solid #e8eaed; }
      .kpi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
      .kpi { border:1px solid #e8eaed; border-radius:10px; padding:14px 16px; }
      .kpi-label { font-size:10px; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px; }
      .kpi-val { font-size:26px; font-weight:700; }
      .kpi-sub { font-size:11px; color:#9ca3af; margin-top:4px; }
      .kpi.verde .kpi-val { color:#1f6b35; }
      .kpi.rojo .kpi-val { color:#dc2626; }
      .kpi.ambar .kpi-val { color:#b45309; }
      .kpi.gris .kpi-val { color:#6b7280; }
      .two-col { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
      .card { border:1px solid #e8eaed; border-radius:10px; padding:16px; }
      table { width:100%; border-collapse:collapse; }
      th { text-align:left; font-size:10px; font-weight:600; color:#9ca3af; text-transform:uppercase; letter-spacing:0.5px; padding:6px 8px; border-bottom:2px solid #e8eaed; background:#f7f8f9; }
      td { padding:8px 8px; border-bottom:1px solid #f3f4f6; font-size:12px; }
      .verde { color:#1f6b35; font-weight:700; }
      .rojo { color:#dc2626; font-weight:700; }
      .ambar { color:#b45309; font-weight:700; }
      .footer { margin-top:32px; padding-top:12px; border-top:1px solid #e8eaed; font-size:10px; color:#9ca3af; text-align:center; }
      @media print { body { -webkit-print-color-adjust:exact; } }
    </style></head><body>
    <div class="header">
      <div>
        <div class="header-logo">🌱 AGRO·MONITOR</div>
        <div class="header-sub">Ing. Agr. Ignacio Herrera · Panel Administrador</div>
      </div>
      <div class="header-right">
        <div><b>Resumen de Campaña</b></div>
        <div>Campaña ${campana}</div>
        <div>${fecha}</div>
      </div>
    </div>
    <div class="body">
      <div class="section-title">KPIs principales</div>
      <div class="kpi-grid">
        <div class="kpi ${monHoy > 0 ? "verde" : "gris"}"><div class="kpi-label">Monitoreos hoy</div><div class="kpi-val">${monHoy}</div><div class="kpi-sub">${mon7} esta semana · ${mon30} este mes</div></div>
        <div class="kpi ${alertas.length > 0 ? "ambar" : "verde"}"><div class="kpi-label">Alertas activas</div><div class="kpi-val">${alertas.length}</div><div class="kpi-sub">sobre umbral</div></div>
        <div class="kpi ${lotesSinMon14 > 0 ? "rojo" : "verde"}"><div class="kpi-label">Sin monitoreo +7d</div><div class="kpi-val">${lotesSinMon14}</div><div class="kpi-sub">lotes atrasados</div></div>
        <div class="kpi verde"><div class="kpi-label">Aplicaciones (30d)</div><div class="kpi-val">${aplicaciones.filter(a => a.fecha >= new Date(Date.now()-30*86400000).toISOString().split("T")[0]).length}</div><div class="kpi-sub">últimos 30 días</div></div>
        <div class="kpi ${appsSinValorizar > 0 ? "ambar" : "verde"}"><div class="kpi-label">Sin valorizar</div><div class="kpi-val">${appsSinValorizar}</div><div class="kpi-sub">órdenes incompletas</div></div>
        <div class="kpi ${mbHaProm >= 0 ? "verde" : "rojo"}"><div class="kpi-label">MB promedio/ha</div><div class="kpi-val">USD ${mbHaProm.toFixed(0)}</div><div class="kpi-sub">MB total: USD ${Math.round(mbTotal).toLocaleString("es-AR")}</div></div>
      </div>
      <div class="two-col">
        <div class="card">
          <div class="section-title">Estado por empresa</div>
          <table><thead><tr><th>Empresa</th><th>Monitoreos</th><th>Aplicaciones</th><th>Alertas</th><th>MB USD</th></tr></thead><tbody>
          ${empresasActivas.map(emp => {
            const monEmp = monitoreos.filter(m => m.empresa?.trim() === emp?.trim()).length;
            const appsEmp = aplicaciones.filter(a => a.empresa_nombre?.trim() === emp?.trim()).length;
            const mbEmp = margenes.filter(m => m.empresa_nombre?.trim() === emp?.trim()).reduce((s,m) => s+parseFloat(m.margen_bruto_usd||0),0);
            const alertasEmp = alertas.filter(a => a.empresa?.trim() === emp?.trim()).length;
            return `<tr><td><b>${emp}</b></td><td>${monEmp}</td><td>${appsEmp}</td><td class="${alertasEmp > 0 ? "ambar" : ""}">${alertasEmp || "—"}</td><td class="${mbEmp >= 0 ? "verde" : "rojo"}">${mbEmp !== 0 ? "USD "+Math.round(mbEmp).toLocaleString("es-AR") : "—"}</td></tr>`;
          }).join("")}
          </tbody></table>
        </div>
        <div class="card">
          <div class="section-title">Últimas alertas</div>
          ${alertas.length === 0
            ? '<p style="color:#1f6b35;font-weight:600;padding:12px 0;">✓ Sin alertas activas</p>'
            : '<table><thead><tr><th>Lote</th><th>Empresa</th><th>Detalle</th><th>Fecha</th></tr></thead><tbody>' +
              alertas.slice(0,8).map(a => `<tr><td><b>${a.lote}</b></td><td style="font-size:11px;color:#6b7280;">${a.empresa}</td><td style="font-size:11px;">${a.msg}</td><td style="font-size:10px;color:#9ca3af;">${a.fecha}</td></tr>`).join("") +
              '</tbody></table>'
          }
        </div>
      </div>
      <div class="footer">AGRO·MONITOR · Ing. Agr. Ignacio Herrera · Generado el ${fecha}</div>
    </div>
    </body></html>`;
    const btnHtml2 = `<style>
  #btn-descargar {
    position: fixed; top: 16px; right: 16px; z-index: 9999;
    background: #1a2e1d; color: #4ae87a; border: 1.5px solid #4ae87a;
    border-radius: 8px; padding: 10px 22px; font-size: 14px;
    font-family: 'Helvetica Neue', Arial, sans-serif; font-weight: 700;
    cursor: pointer; box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  }
  #btn-descargar:hover { background: #4ae87a; color: #1a2e1d; }
  @media print { #btn-descargar { display: none !important; } }
</style>
<button id="btn-descargar" onclick="window.print()">⬇ Descargar / Imprimir</button>`;
    const htmlFinal2 = html.replace("</body>", btnHtml2 + "</body>");
    const win = window.open("", "_blank");
    win.document.write(htmlFinal2);
    win.document.close();
  };

  // Íconos por tab
  const tabIcons = { dashboard:"◉", tablero:"🗺️", graficos:"📈", comparativa:"📊", alertas:"⚠", registros:"⊞", aplicaciones:"💊", productos:"📦", margen:"💰", umbrales:"⚙", planificacion:"🌱" };
  const tabLabels = { dashboard:"Dashboard", tablero:"Tablero", graficos:"Gráficos", comparativa:"Comparativa", alertas:"Alertas", registros:"Registros", aplicaciones:"Aplicaciones", productos:"Productos", margen:"Margen Bruto", umbrales:"Umbrales", planificacion:"Planificación", estructura:"Estructura", historial:"Historial por Lote" };

  return (
    <div style={{ ...st.app, display: "flex" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── SIDEBAR OSCURO ── */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌱</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f9fafb", letterSpacing: 0.3 }}>AGRO·MONITOR</div>
            <div style={{ fontSize: 10, color: "#6b7280" }}>Ing. Agr. I. Herrera</div>
          </div>
        </div>
        {/* Búsqueda global */}
        <div className="sidebar-search">
          <span className="sidebar-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar lote, empresa..."
            value={busquedaGlobal}
            onChange={e => setBusquedaGlobal(e.target.value)}
          />
        </div>
        {/* Resultados de búsqueda */}
        {busquedaGlobal.trim().length >= 2 && (() => {
          const q = busquedaGlobal.toLowerCase();
          const resMonitoreos = monitoreos.filter(m =>
            (m.lote||"").toLowerCase().includes(q) ||
            (m.empresa||"").toLowerCase().includes(q) ||
            (m.campo||"").toLowerCase().includes(q) ||
            (m.cultivo||"").toLowerCase().includes(q)
          ).slice(0, 5);
          const resApps = aplicaciones.filter(a =>
            (a.lote_nombre||"").toLowerCase().includes(q) ||
            (a.empresa_nombre||"").toLowerCase().includes(q) ||
            (a.campo_nombre||"").toLowerCase().includes(q)
          ).slice(0, 5);
          const resProd = productos.filter(p =>
            (p.nombre||"").toLowerCase().includes(q)
          ).slice(0, 5);
          const total = resMonitoreos.length + resApps.length + resProd.length;
          return (
            <div className="search-results">
              {total === 0 && (
                <div style={{ padding: "20px 14px", textAlign: "center", color: "#9ca3af", fontSize: 13 }}>Sin resultados para "{busquedaGlobal}"</div>
              )}
              {resMonitoreos.length > 0 && (
                <div className="search-result-group">
                  <div className="search-result-group-label">Monitoreos</div>
                  {resMonitoreos.map(m => (
                    <div key={m.id} className="search-result-item" onClick={() => { setTab("registros"); setFiltroEmpresa(m.empresa||"todas"); setFiltroCampo(m.campo||"todos"); setFiltroLote(m.lote||"todos"); setBusquedaGlobal(""); }}>
                      <span style={{ fontSize: 14 }}>🔍</span>
                      <div>
                        <div style={{ fontWeight: 500 }}>{m.lote} — {m.empresa}</div>
                        <div className="search-result-item-sub">{m.fecha} · {m.cultivo}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {resApps.length > 0 && (
                <div className="search-result-group">
                  <div className="search-result-group-label">Aplicaciones</div>
                  {resApps.map(a => (
                    <div key={a.id} className="search-result-item" onClick={() => { setTab("aplicaciones"); setFiltroEmpresa(a.empresa_nombre||"todas"); setFiltroCampo(a.campo_nombre||"todos"); setFiltroLote(a.lote_nombre||"todos"); setBusquedaGlobal(""); }}>
                      <span style={{ fontSize: 14 }}>💊</span>
                      <div>
                        <div style={{ fontWeight: 500 }}>{a.lote_nombre} — {a.empresa_nombre}</div>
                        <div className="search-result-item-sub">{a.fecha} · {a.tipo_aplicacion}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {resProd.length > 0 && (
                <div className="search-result-group">
                  <div className="search-result-group-label">Productos</div>
                  {resProd.map(p => (
                    <div key={p.id} className="search-result-item" onClick={() => { setTab("productos"); setEmpTab(p.empresa_nombre||"General"); setBusquedaGlobal(""); }}>
                      <span style={{ fontSize: 14 }}>📦</span>
                      <div>
                        <div style={{ fontWeight: 500 }}>{p.nombre}</div>
                        <div className="search-result-item-sub">{p.empresa_nombre || "General"} · {p.precio_usd ? `USD ${parseFloat(p.precio_usd).toFixed(2)}` : "Sin precio"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Monitoreo</div>
          {[["dashboard","◉","Dashboard"],["tablero","🗺️","Tablero"],["graficos","📈","Gráficos"],["comparativa","📊","Comparativa"],["alertas","⚠","Alertas"],["registros","⊞","Registros"]].map(([k, icon, label]) => (
            <button key={k} className={`sidebar-nav-item${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>
              <span className="nav-icon">{icon}</span>
              <span>{label}{k === "registros" ? ` (${filtered.length})` : ""}</span>
              {k === "alertas" && alertas.length > 0 && <span className="sidebar-badge">{alertas.length}</span>}
            </button>
          ))}
          <div className="sidebar-section-label">Gestión</div>
          {[["aplicaciones","💊","Aplicaciones"],["productos","📦","Productos"],["margen","💰","Margen Bruto"],["planificacion","🌱","Planificación"],["estructura","🏗","Estructura"],["umbrales","⚙","Umbrales"],["historial","📋","Por Lote"]].map(([k, icon, label]) => (
            <button key={k} className={`sidebar-nav-item${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>
              <span className="nav-icon">{icon}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-campaign-card">
          <div style={{ fontSize: 9, color: "#6b7280", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 2 }}>Campaña activa</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#f9fafb", marginBottom: 10 }}>
            {campanasDisponibles.find(c => c !== "todas") || "—"}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 8 }}>
            <div style={{ flex: 1, textAlign: "center", background: "#1a2e1d", borderRadius: 8, padding: "8px 4px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#4ade80", lineHeight: 1 }}>{monitoreos.length * 3}</div>
              <div style={{ fontSize: 9, color: "#6b7280", marginTop: 3 }}>datos campo</div>
              <div style={{ fontSize: 9, color: "#374151", marginTop: 1 }}>{monitoreos.length} lotes</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", background: "#1a2e1d", borderRadius: 8, padding: "8px 4px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: alertas.length > 0 ? "#f87171" : "#4ade80", lineHeight: 1 }}>{alertas.length}</div>
              <div style={{ fontSize: 9, color: "#6b7280", marginTop: 3 }}>alertas</div>
            </div>
            <div style={{ flex: 1, textAlign: "center", background: "#1a2e1d", borderRadius: 8, padding: "8px 4px" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#60a5fa", lineHeight: 1 }}>{aplicaciones.length}</div>
              <div style={{ fontSize: 9, color: "#6b7280", marginTop: 3 }}>aplic.</div>
            </div>
          </div>
        </div>
        <div className="sidebar-footer">
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 11, color: "#e5e7eb", fontWeight: 500 }}>{time.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
            <span style={{ fontSize: 10, color: "#6b7280" }}>{time.toLocaleDateString("es-AR")}</span>
          </div>
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: error ? "#f87171" : "#4ade80", display: "inline-block" }} />
            <button onClick={fetchData} title="Actualizar datos" style={{ background: "none", border: "1px solid #374151", borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 14, cursor: "pointer" }}>↻</button>
            <button title="Actualizar app" onClick={async () => {
              try {
                if ('serviceWorker' in navigator) {
                  const regs = await navigator.serviceWorker.getRegistrations();
                  await Promise.all(regs.map(r => r.unregister()));
                }
                const cacheKeys = await caches.keys();
                await Promise.all(cacheKeys.map(k => caches.delete(k)));
                window.location.reload(true);
              } catch(e) {
                window.location.reload(true);
              }
            }} style={{ background: "none", border: "1px solid #374151", borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#4ade80", fontSize: 14, cursor: "pointer" }} title="Actualizar app (borra caché)">⬆</button>
            <button onClick={onLogout} title="Salir" style={{ background: "none", border: "1px solid #374151", borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 14, cursor: "pointer" }}>⎋</button>
          </div>
        </div>
      </aside>

      {/* ── ÁREA DE CONTENIDO ── */}
      <div className="content-area">
        {/* Topbar con título y email */}
        <div className="content-topbar">
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
            {tabLabels[tab] || tab}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button title="Actualizar app" onClick={async () => {
              try {
                if ('serviceWorker' in navigator) {
                  const regs = await navigator.serviceWorker.getRegistrations();
                  await Promise.all(regs.map(r => r.unregister()));
                }
                const cacheKeys = await caches.keys();
                await Promise.all(cacheKeys.map(k => caches.delete(k)));
                window.location.reload(true);
              } catch(e) { window.location.reload(true); }
            }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 12, color: C.accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
              ⬆ Actualizar app
            </button>
            <span style={{ fontSize: 11, color: C.muted }}>{session?.user?.email}</span>
          </div>
        </div>

        {/* NAV MOBILE — bottom nav */}
        <nav className="bottom-nav">
          <div className="bottom-nav-inner">
            {navItems.map(([k,, icon, label]) => (
              <button key={k} className={`bottom-nav-btn${tab === k ? " active" : ""}`} onClick={() => setTab(k)}>
                <span className="bn-icon">{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* FILTERS — oculto en Comparativa que tiene sus propios filtros */}
        {tab !== "comparativa" && tab !== "productos" && tab !== "historial" && (
        <div style={st.filters}>
          <span style={{ fontSize: 11, color: C.muted, fontFamily: SANS, letterSpacing: 0.5, fontWeight: 600, textTransform: "uppercase" }}>Filtros</span>
        <select style={{ ...st.sel, fontWeight: filtroCampana !== "todas" ? 700 : 400, color: filtroCampana !== "todas" ? C.accent : undefined }}
          value={filtroCampana} onChange={e => { const v = e.target.value; setFiltroCampana(v); setFiltroEmpresa("todas"); setFiltroCampo("todos"); setFiltroLote("todos"); fetchData(v); }}>
          {campanasDisponibles.map(c => {
            const getCampAct = () => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; };
            const esActual = c === getCampAct();
            return <option key={c} value={c}>{c === "todas" ? "Todas las campañas" : `🌾 ${c}${esActual ? " (actual)" : ""}`}</option>;
          })}
        </select>
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
          <button onClick={() => { setFiltroEmpresa("todas"); setFiltroCampo("todos"); setFiltroLote("todos"); setFiltroCultivo("todos"); setFiltroPeriodo("todo"); setFiltroCampana("todas"); }}
            style={{ background: C.dangerLight, border: `1px solid ${C.danger}30`, borderRadius: 7, padding: "6px 14px", color: C.danger, fontFamily: SANS, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
            ✕ Limpiar
          </button>
        )}
      </div>
      )}

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
            {tab === "dashboard" && (() => {
              // ── Datos cruzados para el dashboard ──
              const hoyISO = new Date().toISOString().split("T")[0];
              const hace7 = new Date(Date.now() - 7*86400000).toISOString().split("T")[0];
              const hace30 = new Date(Date.now() - 30*86400000).toISOString().split("T")[0];

              // Filtros base por empresa y campaña
              const monBase = monitoreos.filter(m =>
                (filtroEmpresa === "todas" || m.empresa === filtroEmpresa) &&
                (filtroCampana === "todas" || getCampanaFecha(m.fecha) === filtroCampana)
              );
              const appsBase = aplicaciones.filter(a =>
                (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)
              );

              // Monitoreos
              const monHoy = monBase.filter(m => m.fecha === hoyISO).length;
              const mon7 = monBase.filter(m => m.fecha >= hace7).length;
              const mon30 = monBase.filter(m => m.fecha >= hace30).length;
              const conPlagasD = filtered.filter(m => Object.keys(umbralesConfig).some(p => parseFloat(m[p]) >= umbralesConfig[p])).length;

              // Aplicaciones
              const apps30 = appsBase.filter(a => a.fecha >= hace30);
              const costoApps30 = apps30.reduce((s,a) => s + (a.productos||[]).reduce((ps,p) => ps + (parseFloat(p.costo_total)||0)*(parseFloat(a.superficie_ha)||0), 0), 0);
              const haAplicadas30 = [...new Set(apps30.map(a => a.lote_nombre))].length;

              // MB
              const margenesFiltradosDash = margenes.filter(m =>
                (filtroEmpresa === "todas" || m.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                (filtroCampana === "todas" || (m.campana||"").trim() === filtroCampana.trim())
              );
              const mbTotal = margenesFiltradosDash.reduce((s,m) => s + parseFloat(m.margen_bruto_usd||0), 0);
              const mbHaProm = margenesFiltradosDash.length > 0 ? mbTotal / margenesFiltradosDash.reduce((s,m) => s + parseFloat(m.hectareas||0), 0) : 0;

              // Lotes sin monitoreo (>14 días)
              const hoyDate = new Date(); hoyDate.setHours(0,0,0,0);
              const ultimoMon = {};
              monBase.forEach(m => { const k = `${m.empresa}||${m.lote}`; if (!ultimoMon[k] || m.fecha > ultimoMon[k]) ultimoMon[k] = m.fecha; });
              const lotesSinMon14 = Object.values(ultimoMon).filter(f => Math.floor((hoyDate - new Date(f))/86400000) >= 7).length;

              // Aplicaciones sin valorizar
              const appsSinValorizar = appsBase.filter(a => (a.productos||[]).some(p => p.dosis && (!p.precio_usd || parseFloat(p.precio_usd)===0))).length;

              // Gráfico barras monitoreos últimos 14 días
              const chartData14 = Array.from({length: 14}, (_, i) => {
                const d = new Date(Date.now() - (13-i)*86400000);
                const fecha = d.toISOString().split("T")[0];
                return { label: `${d.getDate()}/${d.getMonth()+1}`, v: monBase.filter(m => m.fecha === fecha).length };
              });
              const maxBar = Math.max(...chartData14.map(d => d.v), 1);

              // Empresas activas
              const empresasActivas = [...new Set(appsBase.map(a => a.empresa_nombre).filter(Boolean))];

              return (
              <div style={{ animation: "fadeIn 0.3s ease" }}>

                {/* Header dashboard con botón PDF */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>Resumen de campaña</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{campanasDisponibles.find(c => c !== "todas") || "Todas las campañas"} · {new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" })}</div>
                  </div>
                  <button onClick={() => exportarDashboardPDF({ monHoy, mon7, mon30, lotesSinMon14, appsSinValorizar, alertas, aplicaciones, margenesFiltradosDash, mbTotal, mbHaProm, empresasActivas, monitoreos, margenes })}
                    style={{ ...st.btnPrimary, display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }}>
                    📄 Exportar PDF
                  </button>
                </div>

                {/* Fila 1 — KPIs principales */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px,1fr))", gap: 12, marginBottom: 20 }}>
                  {[
                    { icon: "📊", label: "Datos de campo", val: monBase.length * 3, sub: `${monBase.length} lotes · x3 estaciones`, color: C.accent, tab: "registros" },
                    { icon: "🔍", label: "Monitoreos hoy", val: monHoy, sub: `${mon7} esta semana`, color: monHoy > 0 ? C.accent : C.muted, tab: "registros" },
                    { icon: "⚠", label: "Alertas activas", val: alertas.length, sub: `${conPlagasD} sobre umbral`, color: alertas.length > 0 ? C.warn : C.accent, tab: "alertas" },
                    { icon: "🕐", label: "Sin monitoreo +7d", val: lotesSinMon14, sub: "lotes atrasados", color: lotesSinMon14 > 0 ? C.danger : C.accent, tab: "alertas" },
                    { icon: "💊", label: "Aplicaciones", val: apps30.length, sub: "últimos 30 días", color: C.accent, tab: "aplicaciones" },
                    { icon: "⚡", label: "Sin valorizar", val: appsSinValorizar, sub: "órdenes incompletas", color: appsSinValorizar > 0 ? C.warn : C.accent, tab: "aplicaciones" },
                    { icon: "💰", label: "MB promedio", val: mbHaProm > 0 ? `USD ${mbHaProm.toFixed(0)}` : "—", sub: "por hectárea", color: mbHaProm >= 0 ? C.accent : C.danger, tab: "margen" },
                  ].map(({ icon, label, val, sub, color, tab: t }) => (
                    <div key={label} onClick={() => setTab(t)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: `3px solid ${color}`, borderRadius: 10, padding: "14px 16px", cursor: "pointer", transition: "box-shadow 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)"}
                      onMouseLeave={e => e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)"}>
                      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{icon} {label}</div>
                      <div style={{ fontSize: 26, fontWeight: 700, color, fontFamily: F, marginBottom: 4 }}>{val}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Fila 2 — Gráfico actividad + Estado por empresa */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {/* Actividad de monitoreos */}
                  <div style={{ ...st.card }}>
                    <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1, marginBottom: 14, fontFamily: F, textTransform: "uppercase", fontWeight: 700 }}>📈 Actividad — últimos 14 días</div>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 70 }}>
                      {chartData14.map((d, i) => (
                        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                          <div style={{ width: "100%", background: d.v > 0 ? C.accent : C.mutedBg, borderRadius: "3px 3px 0 0", height: `${(d.v/maxBar)*60+4}px`, minHeight: 4, transition: "height 0.3s" }} title={`${d.label}: ${d.v} monitoreos`} />
                          {i % 2 === 0 && <span style={{ fontSize: 8, color: C.muted, whiteSpace: "nowrap" }}>{d.label}</span>}
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 16, marginTop: 12, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                      <div><span style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: F }}>{mon7}</span><span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>esta semana</span></div>
                      <div><span style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: F }}>{mon30}</span><span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>este mes</span></div>
                      <div><span style={{ fontSize: 18, fontWeight: 700, color: C.text, fontFamily: F }}>{monitoreos.length}</span><span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>total</span></div>
                    </div>
                  </div>

                  {/* Estado por empresa */}
                  <div style={{ ...st.card }}>
                    <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1, marginBottom: 14, fontFamily: F, textTransform: "uppercase", fontWeight: 700 }}>🏢 Estado por empresa</div>
                    {empresasActivas.slice(0,5).map(emp => {
                      const monEmp = monitoreos.filter(m => m.empresa === emp || m.empresa?.trim() === emp?.trim()).length;
                      const appsEmp = aplicaciones.filter(a => a.empresa_nombre?.trim() === emp?.trim()).length;
                      const mbEmp = margenes.filter(m => m.empresa_nombre?.trim() === emp?.trim());
                      const mbEmpTotal = mbEmp.reduce((s,m) => s + parseFloat(m.margen_bruto_usd||0), 0);
                      const alertasEmp = alertas.filter(a => a.empresa?.trim() === emp?.trim()).length;
                      return (
                        <div key={emp} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, flex: 1 }}>{emp}</div>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <span title="Monitoreos" style={{ fontSize: 11, color: C.muted }}>🔍 {monEmp}</span>
                            <span title="Aplicaciones" style={{ fontSize: 11, color: C.muted }}>💊 {appsEmp}</span>
                            {alertasEmp > 0 && <span title="Alertas" style={{ fontSize: 11, color: C.warn, fontWeight: 700 }}>⚠ {alertasEmp}</span>}
                            {mbEmpTotal !== 0 && <span style={{ fontSize: 11, fontFamily: F, fontWeight: 700, color: mbEmpTotal >= 0 ? C.accent : C.danger }}>USD {Math.round(mbEmpTotal).toLocaleString("es-AR")}</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fila 3 — Últimas alertas + últimas aplicaciones */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  {/* Últimas alertas */}
                  <div style={{ ...st.card }}>
                    <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1, marginBottom: 12, fontFamily: F, textTransform: "uppercase", fontWeight: 700 }}>⚠ Últimas alertas</div>
                    {alertas.length === 0 ? (
                      <div style={{ color: C.accent, fontSize: 13, textAlign: "center", padding: 18, background: C.accentLight, borderRadius: 8, fontWeight: 600 }}>✓ Sin alertas activas</div>
                    ) : alertas.slice(0, 5).map(a => (
                      <div key={a.id} onClick={() => { const m = monitoreos.find(x => x.id === a.monitoreoId); if(m) setSelected(m); }}
                        style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                        <span style={{ color: a.tipo === "danger" ? C.danger : C.warn, fontSize: 15, flexShrink: 0 }}>{a.tipo === "danger" ? "✕" : "⚠"}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{a.lote} <span style={{ color: C.muted, fontWeight: 400 }}>{a.empresa}</span></div>
                          <div style={{ fontSize: 11, color: C.textDim }}>{a.msg}</div>
                        </div>
                        <div style={{ fontSize: 10, color: C.muted, flexShrink: 0 }}>{a.fecha}</div>
                      </div>
                    ))}
                  </div>

                  {/* Últimas aplicaciones */}
                  <div style={{ ...st.card }}>
                    <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1, marginBottom: 12, fontFamily: F, textTransform: "uppercase", fontWeight: 700 }}>💊 Últimas aplicaciones</div>
                    {aplicaciones.slice(0, 5).map(a => {
                      const costoHa = (a.productos||[]).reduce((s,p) => s + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0);
                      const sinPrecio = (a.productos||[]).some(p => p.dosis && (!p.precio_usd || parseFloat(p.precio_usd)===0));
                      return (
                        <div key={a.id} onClick={() => setTab("aplicaciones")}
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{a.lote_nombre} <span style={{ color: C.muted, fontWeight: 400, fontSize: 11 }}>{a.empresa_nombre}</span></div>
                            <div style={{ fontSize: 11, color: C.textDim }}>{a.fecha} · {a.tipo_aplicacion} · {a.superficie_ha} ha</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            {sinPrecio
                              ? <span style={{ fontSize: 11, color: C.danger, fontWeight: 700 }}>⚠ sin precio</span>
                              : <span style={{ fontSize: 12, fontFamily: F, fontWeight: 700, color: C.accent }}>USD {costoHa.toFixed(1)}/ha</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fila 4 — MB resumen */}
                {margenesFiltradosDash.length > 0 && (
                  <div style={{ ...st.card }}>
                    <div style={{ fontSize: 11, color: C.textDim, letterSpacing: 1, marginBottom: 14, fontFamily: F, textTransform: "uppercase", fontWeight: 700 }}>💰 Resumen Margen Bruto</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px,1fr))", gap: 12 }}>
                      {[
                        { label: "MB Total", val: `${mbTotal >= 0 ? "+" : ""}USD ${Math.round(mbTotal).toLocaleString("es-AR")}`, color: mbTotal >= 0 ? C.accent : C.danger },
                        { label: "MB Promedio/ha", val: `USD ${mbHaProm.toFixed(0)}/ha`, color: mbHaProm >= 0 ? C.accent : C.danger },
                        { label: "Registros", val: margenesFiltradosDash.length, color: C.text },
                        { label: "Ha totales", val: `${Math.round(margenesFiltradosDash.reduce((s,m) => s+parseFloat(m.hectareas||0),0)).toLocaleString("es-AR")} ha`, color: C.text },
                      ].map(({label, val, color}) => (
                        <div key={label} onClick={() => setTab("margen")} style={{ background: C.accentLight, border: `1px solid ${C.accent}20`, borderRadius: 8, padding: "12px 14px", cursor: "pointer" }}>
                          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                          <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: F }}>{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })()}

            {/* ── TABLERO ── */}
            {tab === "tablero" && <TableroCierres monitoreos={filtered} />}

            {/* ── GRAFICOS ── */}
            {tab === "graficos" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 18 }}><h2 style={st.sectionTitle}>📈 Evolución de Plagas</h2></div>
                <div style={st.card}>
                  <GraficoEvolucion monitoreos={filtered} />
                  <GraficoEvolucionPorLote monitoreos={filtered} />
                  <GraficoEspecies monitoreos={filtered} />
                </div>
              </div>
            )}

            {/* ── ALERTAS ── */}
            {tab === "alertas" && (() => {
              const plagasAlertas = ["todas","isocas","chinches","pulgones","chicharrita","trips","aranhuelas","cogollero","enfermedad","granizo","estres"];
              const plagaLabelsA = { todas:"Todas", isocas:"Isocas", chinches:"Chinches", pulgones:"Pulgones", chicharrita:"Chicharrita", trips:"Trips", aranhuelas:"Arañuelas", cogollero:"Cogollero", enfermedad:"Enfermedades", granizo:"Granizo", estres:"Estrés hídrico" };
              const alertasFiltradas = alertas.filter(a => {
                if (filtroTipoA !== "todos" && a.tipo !== filtroTipoA) return false;
                if (filtroPlagaA === "todas") return true;
                return a.msg.toLowerCase().includes(filtroPlagaA === "estres" ? "estrés" : filtroPlagaA === "enfermedad" ? "enfermedad" : filtroPlagaA === "granizo" ? "granizo" : filtroPlagaA);
              });
              const sel = { background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: "7px 12px", color: C.text, fontFamily: SANS, fontSize: 12, outline: "none", cursor: "pointer" };
              // ── Lotes sin monitoreo ──
              const diasSinMonitoreo = diasUmbralSinMon;
              const hoyDate = new Date();
              hoyDate.setHours(0,0,0,0);
              // Todos los lotes conocidos: de aplicaciones (filtrados por empresa/campo/lote activos)
              const todosLotesKnown = {};
              aplicaciones.filter(a =>
                (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                (filtroCampo === "todos" || a.campo_nombre === filtroCampo) &&
                (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote))
              ).forEach(a => {
                if (!a.lote_nombre) return;
                const key = `${a.empresa_nombre}||${a.campo_nombre}||${a.lote_nombre}`;
                if (!todosLotesKnown[key]) todosLotesKnown[key] = { empresa: a.empresa_nombre, campo: a.campo_nombre, lote: a.lote_nombre, cultivo: a.cultivo || "" };
              });
              // También de monitoreos (todos, no solo filtered)
              monitoreos.filter(m =>
                (filtroEmpresa === "todas" || m.empresa === filtroEmpresa) &&
                (filtroCampo === "todos" || m.campo === filtroCampo) &&
                (filtroLote === "todos" || m.lote === filtroLote)
              ).forEach(m => {
                if (!m.lote) return;
                const key = `${m.empresa}||${m.campo}||${m.lote}`;
                if (!todosLotesKnown[key]) todosLotesKnown[key] = { empresa: m.empresa, campo: m.campo, lote: m.lote, cultivo: m.cultivo || "" };
              });
              // Último monitoreo por lote (de TODOS los monitoreos, sin filtro de fecha)
              const ultimoMonPorLote = {};
              monitoreos.forEach(m => {
                if (!m.lote) return;
                const key = `${m.empresa}||${m.campo}||${m.lote}`;
                if (!ultimoMonPorLote[key] || m.fecha > ultimoMonPorLote[key]) ultimoMonPorLote[key] = m.fecha;
              });
              // Calcular días desde último monitoreo para cada lote conocido
              const lotesSinMon = Object.entries(todosLotesKnown).map(([key, l]) => {
                const ultimaFecha = ultimoMonPorLote[key];
                if (!ultimaFecha) return { ...l, dias: 9999, sinDatos: true };
                const d = new Date(ultimaFecha); d.setHours(0,0,0,0);
                const dias = Math.floor((hoyDate - d) / 86400000);
                return { ...l, dias, ultimaFecha };
              }).filter(l => l.dias >= diasSinMonitoreo).sort((a,b) => b.dias - a.dias);

              return (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                {/* Panel lotes sin monitoreo */}
                {(
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                      <div style={{ fontSize: 12, color: C.warn, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, fontFamily: F }}>
                        🕐 Lotes sin monitoreo hace +{diasSinMonitoreo} días ({lotesSinMon.length})
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: C.muted }}>Umbral:</span>
                        {[7, 14, 21, 30].map(d => (
                          <button key={d} onClick={() => setDiasUmbralSinMon(d)}
                            style={{ padding: "3px 10px", borderRadius: 6, border: `1px solid ${diasUmbralSinMon === d ? C.warn : C.border}`,
                              background: diasUmbralSinMon === d ? C.warnLight : C.surface,
                              color: diasUmbralSinMon === d ? C.warn : C.textDim,
                              cursor: "pointer", fontSize: 11, fontWeight: diasUmbralSinMon === d ? 700 : 400 }}>
                            {d}d
                          </button>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))", gap: 10 }}>
                      {lotesSinMon.map((l,i) => {
                        const nivel = l.dias >= 30 ? "danger" : l.dias >= 21 ? "warn" : "ok";
                        const col = nivel === "danger" ? C.danger : nivel === "warn" ? C.warn : C.accent;
                        const bg = nivel === "danger" ? C.dangerLight : nivel === "warn" ? C.warnLight : C.accentLight;
                        return (
                          <div key={i} style={{ background: bg, border: `1px solid ${col}40`, borderLeft: `4px solid ${col}`, borderRadius: 10, padding: "12px 14px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{l.lote}</div>
                                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>{l.empresa}{l.campo ? ` · ${l.campo}` : ""}</div>
                                {l.cultivo && <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{l.cultivo}</div>}
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 20, fontWeight: 700, color: col, fontFamily: F }}>{l.sinDatos ? "—" : l.dias}</div>
                                <div style={{ fontSize: 10, color: col, fontWeight: 600 }}>{l.sinDatos ? "sin datos" : "días"}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 11, color: C.muted, marginTop: 6 }}>
                              {l.sinDatos ? "⚠ Sin monitoreos registrados" : `Último: ${l.ultimaFecha}`}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {lotesSinMon.length === 0 && (
                      <div style={{ background: C.accentLight, border: `1px solid ${C.accent}20`, borderRadius: 10, padding: "14px 20px", color: C.accent, fontSize: 13, fontWeight: 600 }}>
                        ✓ Todos los lotes monitoreados en los últimos {diasSinMonitoreo} días
                      </div>
                    )}
                  </div>
                )}
                <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <h2 style={st.sectionTitle}>⚠ Alertas Automáticas</h2>
                    <div style={{ color: C.muted, fontSize: 12, marginTop: 6 }}>Umbrales: isocas ≥{UMBRALES.isocas}/m · chinches ≥{UMBRALES.chinches}/m · chicharrita ≥{UMBRALES.chicharrita}/pl · pulgones ≥{UMBRALES.pulgones}/pl</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <select style={sel} value={filtroPlagaA} onChange={e => setFiltroPlagaA(e.target.value)}>
                      {plagasAlertas.map(p => <option key={p} value={p}>{plagaLabelsA[p]}</option>)}
                    </select>
                    <select style={sel} value={filtroTipoA} onChange={e => setFiltroTipoA(e.target.value)}>
                      <option value="todos">Todos</option>
                      <option value="danger">✕ Crítico</option>
                      <option value="warn">⚠ Alerta</option>
                    </select>
                    <span style={{ fontSize: 12, color: C.muted, fontFamily: F }}>{alertasFiltradas.length} resultado{alertasFiltradas.length !== 1 ? "s" : ""}</span>
                  </div>
                </div>
                {alertasFiltradas.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 56, background: C.accentLight, border: `1px solid ${C.accent}20` }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
                    <div style={{ color: C.accent, fontWeight: 600, marginBottom: 6, fontSize: 15 }}>Sin alertas para este filtro</div>
                    <div style={{ color: C.textDim, fontSize: 13 }}>Probá cambiando la plaga o el tipo</div>
                  </div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                    {alertasFiltradas.map(a => {
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
              );
            })()}

            {/* ── REGISTROS ── */}
            {tab === "registros" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div style={{ marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <h2 style={st.sectionTitle}>⊞ Todos los Registros</h2>
                    <span style={{ color: C.muted, fontSize: 12, fontFamily: F }}>{loadingMsg || `${filtered.length} resultado${filtered.length !== 1 ? "s" : ""} (${monitoreos.length} totales)`}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {/* Importar monitoreos Excel */}
                    <input id="inputMonitoreosExcel" type="file" accept=".xlsx,.xls" style={{ display: "none" }}
                      onChange={e => { if(e.target.files[0]) { importarMonitoreosExcel(e.target.files[0]); e.target.value=""; }}} />
                    <button onClick={() => document.getElementById('inputMonitoreosExcel').click()}
                      disabled={importandoMonitoreos}
                      style={{ ...st.btnSecondary, fontSize: 12, padding: "7px 14px", opacity: importandoMonitoreos ? 0.7 : 1 }}>
                      {importandoMonitoreos ? "⏳ Importando..." : "📥 Importar Excel"}
                    </button>
                    <button onClick={descargarPlantillaMonitoreos}
                      style={{ ...st.btnSecondary, fontSize: 12, padding: "7px 14px" }}>
                      📋 Plantilla
                    </button>
                    {importResultadoMon && (
                      <span style={{ fontSize: 12, color: importResultadoMon.err > 0 ? C.danger : C.accent, fontWeight: 600, cursor: "pointer" }}
                        onClick={() => setImportResultadoMon(null)}>
                        {importResultadoMon.ok > 0 ? `✅ ${importResultadoMon.ok} importados` : ""}
                        {importResultadoMon.err > 0 ? ` ⚠ ${importResultadoMon.err} errores` : ""} ×
                      </span>
                    )}
                    <button onClick={() => setShowFormMonitoreo(v => !v)} style={{ ...st.btnPrimary, fontSize: 12, padding: "7px 16px" }}>
                      + Nuevo Monitoreo
                    </button>
                    <button
                      onClick={() => {
                        setReporteEmpresa(filtroEmpresa !== "todas" ? filtroEmpresa : "todas");
                        setReporteCampo(filtroCampo !== "todos" ? filtroCampo : "todos");
                        setReporteDesde("");
                        setReporteHasta("");
                        setShowReporteModal(true);
                      }}
                      style={{
                        background: "#1e3a23", border: "none", borderRadius: 7,
                        padding: "7px 14px", color: "#fff", fontFamily: SANS, fontSize: 12,
                        cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6
                      }}>
                      📄 Reporte PDF
                    </button>
                    <button
                      onClick={() => { setMasivoDesde(""); setMasivoHasta(""); setMasivoMsg(""); setShowMasivoModal(true); }}
                      style={{ background: "#7c3aed", border: "none", borderRadius: 7, padding: "7px 14px", color: "#fff", fontFamily: SANS, fontSize: 12, cursor: "pointer", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                      ✏️ Edición masiva
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
                      { label: "Gusano espiga /100", get: m => m.gusano_espiga },
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

                {/* Barra de selección masiva */}
                {selectedIds.size > 0 && (
                  <div style={{
                    background: C.dangerLight, border: `1px solid ${C.danger}40`,
                    borderRadius: 10, padding: "10px 16px", marginBottom: 12,
                    display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap"
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.danger, fontFamily: SANS }}>
                      {selectedIds.size} registro{selectedIds.size > 1 ? "s" : ""} seleccionado{selectedIds.size > 1 ? "s" : ""}
                    </span>
                    <button onClick={deleteBulk} disabled={deletingBulk}
                      style={{ background: C.danger, border: "none", borderRadius: 7, padding: "7px 16px", color: "#fff", fontFamily: SANS, fontSize: 13, cursor: "pointer", fontWeight: 700, opacity: deletingBulk ? 0.7 : 1 }}>
                      {deletingBulk ? "Eliminando..." : "🗑 Eliminar seleccionados"}
                    </button>
                    <button onClick={() => setSelectedIds(new Set())}
                      style={{ background: "none", border: `1px solid ${C.danger}40`, borderRadius: 7, padding: "7px 14px", color: C.danger, fontFamily: SANS, fontSize: 13, cursor: "pointer" }}>
                      Cancelar
                    </button>
                  </div>
                )}

                {/* ── FORM NUEVO MONITOREO ── */}
                {showFormMonitoreo && (() => {
                  const EMPRESAS_OPT = ["HERRERA IGNACIO","BERTOLI VARRONE","GREGORET HNOS","AGROCORSI","GOROSITO/SIGOTO/BERTOLI","VACHETTA","FERNANDO PIGHIN 2","GIANFRANCO BERTOLI"];
                  const camposDisp = [...new Set(monitoreos.filter(m => m.empresa === newMonitoreo.empresa).map(m => m.campo).filter(Boolean))].sort();
                  const lotesDisp  = [...new Set(monitoreos.filter(m => m.empresa === newMonitoreo.empresa && m.campo === newMonitoreo.campo).map(m => m.lote).filter(Boolean))].sort();
                  const inp = (label, key, type = "text") => (
                    <div>
                      <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: F }}>{label}</label>
                      <input type={type} value={newMonitoreo[key] ?? ""} onChange={e => setNewMonitoreo(p => ({ ...p, [key]: e.target.value }))}
                        style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, color: C.text, outline: "none", fontFamily: SANS }} />
                    </div>
                  );
                  const sel = (label, key, opts) => (
                    <div>
                      <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: F }}>{label}</label>
                      <select value={newMonitoreo[key] ?? ""} onChange={e => setNewMonitoreo(p => ({ ...p, [key]: e.target.value }))}
                        style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, color: C.text, outline: "none", fontFamily: SANS, cursor: "pointer" }}>
                        <option value="">—</option>
                        {opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  );
                  return (
                    <div style={{ ...st.card, marginBottom: 16, border: `1.5px solid ${C.accent}40`, background: C.accentLight }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: SANS }}>📋 Nuevo Monitoreo</div>
                        <button onClick={() => setShowFormMonitoreo(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>×</button>
                      </div>
                      {/* Datos generales */}
                      <div style={{ fontSize: 11, color: C.accent, fontFamily: F, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Datos generales</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10, marginBottom: 14 }}>
                        {inp("Fecha", "fecha", "date")}
                        {sel("Empresa", "empresa", EMPRESAS_OPT)}
                        <div>
                          <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: F }}>Campo</label>
                          <input list="campos-list-nm" value={newMonitoreo.campo ?? ""} onChange={e => setNewMonitoreo(p => ({ ...p, campo: e.target.value }))}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, color: C.text, outline: "none", fontFamily: SANS }} />
                          <datalist id="campos-list-nm">{camposDisp.map(c => <option key={c} value={c}/>)}</datalist>
                        </div>
                        <div>
                          <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: F }}>Lote</label>
                          <input list="lotes-list-nm" value={newMonitoreo.lote ?? ""} onChange={e => setNewMonitoreo(p => ({ ...p, lote: e.target.value }))}
                            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, color: C.text, outline: "none", fontFamily: SANS }} />
                          <datalist id="lotes-list-nm">{lotesDisp.map(l => <option key={l} value={l}/>)}</datalist>
                        </div>
                        {inp("Cultivo", "cultivo")}
                        {inp("Estadio fenológico", "estadio_fenologico")}
                      </div>
                      {/* Plagas numéricas */}
                      <div style={{ fontSize: 11, color: C.accent, fontFamily: F, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Plagas</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, marginBottom: 14 }}>
                        {inp("Isocas", "isocas", "number")}
                        {inp("Chinches", "chinches", "number")}
                        {inp("Chicharrita", "chicharrita", "number")}
                        {inp("Cogollero", "cogollero", "number")}
                        {inp("Gusano espiga", "gusano_espiga", "number")}
                        {sel("Pulgones", "pulgones", ["BAJO","MEDIA","ALTA"])}
                        {sel("Trips", "trips", ["BAJO","MEDIA","ALTA"])}
                        {sel("Arañuelas", "aranhuelas", ["BAJO","MEDIA","ALTA"])}
                      </div>
                      {/* Observaciones */}
                      <div style={{ marginBottom: 14 }}>
                        <label style={{ fontSize: 11, color: C.muted, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5, fontFamily: F }}>Observaciones</label>
                        <textarea value={newMonitoreo.observaciones ?? ""} onChange={e => setNewMonitoreo(p => ({ ...p, observaciones: e.target.value }))} rows={2}
                          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 7, padding: "8px 10px", fontSize: 13, color: C.text, outline: "none", fontFamily: SANS, resize: "vertical" }} />
                      </div>
                      {/* Botones */}
                      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                        <button onClick={() => setShowFormMonitoreo(false)}
                          style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 8, padding: "9px 20px", color: C.textDim, fontSize: 13, cursor: "pointer", fontFamily: SANS }}>
                          Cancelar
                        </button>
                        <button disabled={savingMonitoreo} onClick={async () => {
                          if (!newMonitoreo.fecha || !newMonitoreo.empresa || !newMonitoreo.lote) {
                            alert("Completá fecha, empresa y lote como mínimo.");
                            return;
                          }
                          setSavingMonitoreo(true);
                          const tok = await getValidToken();
                          const body = {
                            fecha: newMonitoreo.fecha,
                            empresa: newMonitoreo.empresa,
                            campo: newMonitoreo.campo || "",
                            lote: newMonitoreo.lote,
                            cultivo: newMonitoreo.cultivo || "",
                            estadio_fenologico: newMonitoreo.estadio_fenologico || "",
                            isocas: parseFloat(newMonitoreo.isocas) || null,
                            chinches: parseFloat(newMonitoreo.chinches) || null,
                            chicharrita: parseFloat(newMonitoreo.chicharrita) || null,
                            cogollero: parseFloat(newMonitoreo.cogollero) || null,
                            gusano_espiga: parseFloat(newMonitoreo.gusano_espiga) || null,
                            pulgones: newMonitoreo.pulgones || null,
                            trips: newMonitoreo.trips || null,
                            aranhuelas: newMonitoreo.aranhuelas || null,
                            observaciones: newMonitoreo.observaciones || "",
                          };
                          try {
                            const res = await fetch(`${SUPABASE_URL}/rest/v1/monitoreos`, {
                              method: "POST",
                              headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                              body: JSON.stringify(body)
                            });
                            if (!res.ok) { const err = await res.text(); throw new Error(err); }
                            setNewMonitoreo({ fecha: new Date().toISOString().split("T")[0], empresa: newMonitoreo.empresa, campo: newMonitoreo.campo, lote: "", cultivo: "", estadio_fenologico: "", isocas: "", chinches: "", pulgones: "", chicharrita: "", trips: "", aranhuelas: "", cogollero: "", gusano_espiga: "", observaciones: "" });
                            setShowFormMonitoreo(false);
                            await fetchData();
                          } catch(e) { alert("Error al guardar: " + e.message); }
                          setSavingMonitoreo(false);
                        }}
                          style={{ background: C.accent, border: "none", borderRadius: 8, padding: "9px 24px", color: "#fff", fontSize: 13, cursor: "pointer", fontWeight: 700, fontFamily: SANS, opacity: savingMonitoreo ? 0.7 : 1 }}>
                          {savingMonitoreo ? "Guardando..." : "💾 Guardar"}
                        </button>
                      </div>
                    </div>
                  );
                })()}

                                {filtered.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 40, color: C.muted }}>Sin registros con los filtros seleccionados</div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                      <thead>
                        <tr>
                          <th style={{ ...st.th, width: 36, textAlign: "center" }}>
                            <input type="checkbox"
                              checked={selectedIds.size === filtered.length && filtered.length > 0}
                              ref={el => { if (el) el.indeterminate = selectedIds.size > 0 && selectedIds.size < filtered.length; }}
                              onChange={() => toggleSelectAll(filtered.map(m => m.id))}
                              style={{ cursor: "pointer", width: 15, height: 15, accentColor: C.danger }}
                            />
                          </th>
                          {[["FECHA","fecha"],["EMPRESA","empresa"],["CAMPO","campo"],["LOTE","lote"],["CULTIVO","cultivo"],["ESTADIO","estadio_fenologico"],["PLAGAS","_plagas"],["PULG.","pulgones"],["TRIPS","trips"],["ARAÑA.","aranhuelas"],["GUS.ESP.","gusano_espiga"],["ENF.","_enf"],["ESTRÉS","estres_hidrico"],["GPS","gps_lat"],["",""],["",""]].map(([h,col]) => (
                            <th key={h+col} style={{...st.th, cursor: col ? "pointer":"default", userSelect:"none", whiteSpace:"nowrap"}} onClick={() => col && toggleSort(col)}>
                              {h}{col && sortCol===col ? (sortDir==="asc"?" ↑":" ↓") : ""}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[...filtered].sort((a,b) => {
                            const dir = sortDir==="asc" ? 1 : -1;
                            if (sortCol==="fecha") return dir*(a.fecha||"").localeCompare(b.fecha||"");
                            if (sortCol==="_plagas") { const pa=Object.keys(UMBRALES).filter(p=>parseFloat(a[p])>=(UMBRALES[p]||999)).length; const pb=Object.keys(UMBRALES).filter(p=>parseFloat(b[p])>=(UMBRALES[p]||999)).length; return dir*(pa-pb); }
                            if (sortCol==="_enf") return dir*((a.enfermedades?.length||0)-(b.enfermedades?.length||0));
                            if (["gusano_espiga","estres_hidrico"].includes(sortCol)) return dir*((parseFloat(a[sortCol])||0)-(parseFloat(b[sortCol])||0));
                            if (sortCol==="gps_lat") return dir*((a.gps_lat?1:0)-(b.gps_lat?1:0));
                            return dir*(a[sortCol]||"").toString().toLowerCase().localeCompare((b[sortCol]||"").toString().toLowerCase());
                          }).map((m) => {
                          const pc = Object.keys(UMBRALES).filter(p => parseFloat(m[p]) >= UMBRALES[p]).length;
                          const ec = m.enfermedades?.length || 0;
                          const isChecked = selectedIds.has(m.id);
                          return (
                            <tr key={m.id} onClick={() => { if (selectedIds.size === 0) setSelected(m); }}
                              style={{ background: isChecked ? C.dangerLight : undefined }}>
                              <td style={{ ...st.td, textAlign: "center" }} onClick={e => e.stopPropagation()}>
                                <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(m.id)}
                                  style={{ cursor: "pointer", width: 15, height: 15, accentColor: C.danger }} />
                              </td>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 11, color: C.textDim }}>{m.fecha}<br /><span style={{ color: C.muted }}>{m.hora?.slice(0, 5)}</span></span></td>
                              <td style={st.td}><span style={{ fontSize: 12, color: C.textDim }}>{m.empresa}</span></td>
                              <td style={st.td}><span style={{ fontSize: 12, color: C.textDim }}>{m.campo}</span></td>
                              <td style={st.td}><b style={{ color: C.text }}>{m.lote}</b></td>
                              <td style={{ ...st.td }} onClick={e => { e.stopPropagation(); setEditCultivoId(editCultivoId === m.id ? null : m.id); }}>
                                {editCultivoId === m.id ? (
                                  <select autoFocus
                                    value={m.cultivo || ""}
                                    onChange={async e => {
                                      const nuevoCultivo = e.target.value;
                                      const tok = await getValidToken();
                                      await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${m.id}`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                                        body: JSON.stringify({ cultivo: nuevoCultivo })
                                      });
                                      setMonitoreos(prev => prev.map(x => x.id === m.id ? { ...x, cultivo: nuevoCultivo } : x));
                                      setEditCultivoId(null);
                                    }}
                                    onBlur={() => setEditCultivoId(null)}
                                    onClick={e => e.stopPropagation()}
                                    style={{ fontSize: 12, background: C.surface, border: `1px solid ${C.accent}`, borderRadius: 6, padding: "3px 6px", color: C.text, cursor: "pointer", outline: "none" }}>
                                    <option value="">—</option>
                                    {["Soja","Soja 1ra","Soja 2da","Maíz","Sorgo","Girasol","Trigo","Cebada","Algodón","Cultivo de Servicio"].map(c => <option key={c} value={c}>{c}</option>)}
                                  </select>
                                ) : (
                                  <span style={{ color: C.textDim, cursor: "pointer", borderBottom: `1px dashed ${C.border}` }} title="Click para editar cultivo">{m.cultivo || "—"}</span>
                                )}
                              </td>
                              <td style={st.td}><span style={{ fontSize: 12, background: C.mutedBg, padding: "3px 8px", borderRadius: 5, color: C.textDim }}>{m.estadio_fenologico || "—"}</span></td>
                              <td style={st.td}>{pc > 0 ? <span style={{ background: C.warnLight, color: C.warn, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>{pc}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}>{m.pulgones ? <span style={{ fontSize: 11, fontWeight: 600, color: m.pulgones==="ALTA" ? C.danger : m.pulgones==="MEDIA" ? C.warn : C.accent, background: m.pulgones==="ALTA" ? C.dangerLight : m.pulgones==="MEDIA" ? C.warnLight : C.accentLight, padding: "2px 7px", borderRadius: 4 }}>{m.pulgones}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}>{m.trips ? <span style={{ fontSize: 11, fontWeight: 600, color: m.trips==="ALTA" ? C.danger : m.trips==="MEDIA" ? C.warn : C.accent, background: m.trips==="ALTA" ? C.dangerLight : m.trips==="MEDIA" ? C.warnLight : C.accentLight, padding: "2px 7px", borderRadius: 4 }}>{m.trips}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}>{m.aranhuelas ? <span style={{ fontSize: 11, fontWeight: 600, color: m.aranhuelas==="ALTA" ? C.danger : m.aranhuelas==="MEDIA" ? C.warn : C.accent, background: m.aranhuelas==="ALTA" ? C.dangerLight : m.aranhuelas==="MEDIA" ? C.warnLight : C.accentLight, padding: "2px 7px", borderRadius: 4 }}>{m.aranhuelas}</span> : <span style={{ color: C.muted }}>—</span>}</td>
                              <td style={st.td}>{m.gusano_espiga != null ? <span style={{ fontSize: 11, fontWeight: 600, color: m.gusano_espiga >= 20 ? C.danger : m.gusano_espiga >= 10 ? C.warn : C.textDim, fontFamily: F }}>{m.gusano_espiga}/100</span> : <span style={{ color: C.muted }}>—</span>}</td>
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
            {tab === "productos" && (() => {
              const prodsFiltrados = productos
                .filter(p => !p.empresa_nombre)
                .sort((a,b) => (a.nombre||"").localeCompare(b.nombre||""));
              return (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h2 style={st.sectionTitle}>📦 Productos <span style={{fontSize:13,color:C.muted,fontWeight:400}}>({prodsFiltrados.length})</span></h2>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input ref={fileProductosRef} type="file" accept=".xlsx,.xls" onChange={e => e.target.files[0] && importarProductosExcel(e.target.files[0])} style={{ display: "none" }} />
                    <button onClick={descargarProductosExcel} style={{ ...st.btnSecondary, fontSize: 12, padding: "7px 14px" }}>📋 Descargar lista</button>
                    <button onClick={() => fileProductosRef.current.click()} disabled={importandoProductos}
                      style={{ ...st.btnSecondary, fontSize: 12, padding: "7px 14px" }}>
                      {importandoProductos ? "⏳ Importando..." : "📥 Importar Excel"}
                    </button>
                    <button onClick={revalorizarAplicaciones} style={{ ...st.btnSecondary, fontSize: 12, padding: "7px 14px" }}>💰 Re-valorizar</button>
                    <button onClick={() => setShowFormProd(!showFormProd)} style={{ ...st.btnPrimary, fontSize: 12, padding: "7px 16px" }}>+ Nuevo</button>
                  </div>
                </div>
                {importResultadoProd && (
                  <div style={{ background: importResultadoProd.err === 0 ? C.accentLight : C.warnLight, border: `1px solid ${importResultadoProd.err === 0 ? C.accent : C.warn}40`, borderRadius: 10, padding: "10px 16px", marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: importResultadoProd.err === 0 ? C.accent : C.warn }}>
                      {importResultadoProd.err === 0 ? "✓" : "⚠"} {importResultadoProd.ok} producto{importResultadoProd.ok !== 1 ? "s" : ""} importado{importResultadoProd.ok !== 1 ? "s" : ""}
                      {importResultadoProd.err > 0 ? `, ${importResultadoProd.err} con error` : ""}
                    </span>
                    <button onClick={() => setImportResultadoProd(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", marginLeft: "auto" }}>✕</button>
                  </div>
                )}
                {showFormProd && (
                  <div style={{ ...st.card, marginBottom: 20, border: `1px solid ${C.accent}30`, animation: "slideDown 0.2s ease" }}>
                    <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 16, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Nuevo Producto</div>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                      {[["Nombre", "nombre", "text", "Ej: Roundup..."], ["Tipo", "tipo", "text", "herbicida..."], ["Unidad", "unidad", "text", "l, kg, cc"], ["Precio USD/u", "precio_usd", "number", "0.00"]].map(([label, key, type, ph]) => (
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
                {/* Tabla */}
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginTop: 8 }}>
                  {prodsFiltrados.length === 0 ? (
                    <div style={{ padding: 48, textAlign: "center", color: C.muted, fontSize: 13 }}>
                      Sin productos para esta empresa. Importá un Excel o agregá uno nuevo.
                    </div>
                  ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ ...st.th, width: "42%" }}>Producto</th>
                          <th style={{ ...st.th, width: "16%" }}>Tipo</th>
                          <th style={{ ...st.th, width: "10%" }}>Unidad</th>
                          <th style={{ ...st.th, width: "16%", textAlign: "right" }}>Precio USD/u</th>
                          <th style={{ ...st.th, width: "16%" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {prodsFiltrados.map(p => editProd?.id === p.id ? (
                          <tr key={p.id} style={{ background: C.accentLight }}>
                            <td style={st.td}><input value={editProd.nombre} onChange={e => setEditProd(v => ({...v, nombre: e.target.value}))} style={{ ...inputSt, margin: 0, fontSize: 13, width: "100%" }} /></td>
                            <td style={st.td}><input value={editProd.tipo} onChange={e => setEditProd(v => ({...v, tipo: e.target.value}))} style={{ ...inputSt, margin: 0, fontSize: 13, width: "100%" }} /></td>
                            <td style={st.td}><input value={editProd.unidad} onChange={e => setEditProd(v => ({...v, unidad: e.target.value}))} style={{ ...inputSt, margin: 0, fontSize: 13, width: 60 }} /></td>
                            <td style={{ ...st.td, textAlign: "right" }}><input type="number" value={editProd.precio_usd} onChange={e => setEditProd(v => ({...v, precio_usd: e.target.value}))} style={{ ...inputSt, margin: 0, fontSize: 13, width: 90, textAlign: "right" }} /></td>
                            <td style={st.td}>
                              <div style={{ display: "flex", gap: 6 }}>
                                <button onClick={saveEditProd} style={{ ...st.btnPrimary, padding: "5px 12px", fontSize: 12 }}>✓ Guardar</button>
                                <button onClick={() => setEditProd(null)} style={{ ...st.btnSecondary, padding: "5px 10px", fontSize: 12 }}>✕</button>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          <tr key={p.id} onDoubleClick={() => setEditProd({...p})}
                            onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                            onMouseLeave={e => e.currentTarget.style.background = ""}>
                            <td style={{ ...st.td, fontWeight: 500, color: C.text }}>{p.nombre}</td>
                            <td style={{ ...st.td, color: C.textDim, fontSize: 12 }}>{p.tipo || "—"}</td>
                            <td style={{ ...st.td, color: C.textDim, fontSize: 12 }}>{p.unidad || "—"}</td>
                            <td style={{ ...st.td, textAlign: "right", fontWeight: 700, color: p.precio_usd ? C.accent : C.muted, fontFamily: F }}>
                              {p.precio_usd ? `USD ${parseFloat(p.precio_usd).toFixed(2)}` : "—"}
                            </td>
                            <td style={st.td}>
                              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                                <button onClick={() => setEditProd({...p})} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: C.textDim }}>✏ Editar</button>
                                <button onClick={() => deleteProducto(p.id)} style={{ background: "none", border: `1px solid ${C.danger}30`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12, color: C.danger }}>Eliminar</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div style={{ marginTop: 10, fontSize: 12, color: C.muted, textAlign: "right" }}>
                  {prodsFiltrados.length} producto{prodsFiltrados.length !== 1 ? "s" : ""} · {prodsFiltrados.filter(p => p.precio_usd).length} con precio
                </div>
              </div>
              );
            })()}

            {/* ── APLICACIONES ── */}
            {tab === "aplicaciones" && (() => {
              // Campaña actual calculada automáticamente
              const getCampanaActual = () => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; };
              const campanaActualApps = getCampanaActual();
              // Campaña futura = la siguiente
              const getCampanaFutura = () => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); const base = mes >= 7 ? a+1 : a; return `${base}/${String(base+1).slice(2)}`; };
              const campanaFuturaApps = getCampanaFutura();
              return (
              <div style={{ animation: "fadeIn 0.3s ease" }}>

                {/* ── ANÁLISIS DE COSTOS POR CULTIVO ── */}
                {(() => {
                  const TIPOS_LABOR = ["TERRESTRE","DRONE","AEREA","WEED SEKER","WEED IT","CAIMAN COBERTURA TOTAL","CAIMAN SELECTIVO","DEEP AGRO","MOCHILEO","RASTRA LIVIANA","REJA CERI","SIEMBRA TERRESTRE"];
                  // Agrupar por cultivo
                  // Cultivos que no son de renta — sus costos se suman al primer cultivo de renta del mismo lote
                  const EXCLUIR_COSTO  = ["Barbecho Químico","BARBECHO QUÍMICO","Barbecho quimico"];
                  const CULT_SERVICIO  = ["Cultivo de Servicio","CULTIVO DE SERVICIO","Cultivo de servicio","Vicia","VICIA","Cobertura","COBERTURA"];
                  const CULT_INVIERNO  = ["Trigo","Cebada","Ce-Soja","Colza","Garbanzo"];
                  const CULT_VERANO2   = ["Soja 2da","Maíz 2da","Soja 3ra"];

                  const appsFiltradas = aplicaciones.filter(a =>
                    (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                    (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana) &&
                    a.cultivo
                  );
                  if (appsFiltradas.length === 0) return null;

                  // Detectar rotaciones por lote: invierno + verano 2da → "Trigo/Soja 2da"
                  const cultsPorLote = {};
                  appsFiltradas.filter(a => !EXCLUIR_COSTO.includes(a.cultivo)).forEach(a => {
                    const k = `${a.empresa_nombre}|${a.campo_nombre}|${a.lote_nombre}`;
                    if (!cultsPorLote[k]) cultsPorLote[k] = new Set();
                    cultsPorLote[k].add(a.cultivo);
                  });
                  const rotacionDeLote = k => {
                    const cults = [...(cultsPorLote[k] || [])];
                    const inv   = cults.find(c => CULT_INVIERNO.includes(c));
                    const ver2  = cults.find(c => CULT_VERANO2.includes(c));
                    const cs    = cults.find(c => CULT_SERVICIO.includes(c));
                    const verano1 = cults.find(c => !CULT_INVIERNO.includes(c) && !CULT_VERANO2.includes(c) && !CULT_SERVICIO.includes(c) && !EXCLUIR_COSTO.includes(c));
                    if (inv && ver2)    return `${inv}/${ver2}`;
                    if (cs && verano1)  return `Cs/${verano1}`;
                    return null;
                  };

                  // Reasignar todas las apps al nombre de rotación si aplica
                  const appsReasignadas = appsFiltradas.map(a => {
                    const k = `${a.empresa_nombre}|${a.campo_nombre}|${a.lote_nombre}`;
                    const rot = rotacionDeLote(k);
                    if (EXCLUIR_COSTO.includes(a.cultivo) || CULT_SERVICIO.includes(a.cultivo)) {
                      return rot ? { ...a, cultivo: rot, _esBarbecho: true } : null;
                    }
                    return rot ? { ...a, cultivo: rot } : a;
                  }).filter(Boolean);

                  const cultivos = [...new Set(appsReasignadas.map(a => a.cultivo).filter(c => c && !EXCLUIR_COSTO.includes(c)))].sort();
                  if (cultivos.length === 0) return null;

                  const dataCultivo = cultivos.map(cult => {
                    const apps = appsReasignadas.filter(a => a.cultivo === cult);
                    const haMaxPorLote = {};
                    apps.filter(a => !a._esBarbecho).forEach(a => {
                      const k = `${a.empresa_nombre}|${a.campo_nombre}|${a.lote_nombre}`;
                      const ha = parseFloat(a.superficie_ha)||0;
                      if (ha > (haMaxPorLote[k]||0)) haMaxPorLote[k] = ha;
                    });
                    const haTotal = Object.values(haMaxPorLote).reduce((s,h) => s+h, 0);
                    const costoAgroTotal = apps.reduce((s,a) =>
                      s + (a.productos||[]).reduce((ps,p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd) * (parseFloat(a.superficie_ha)||1), 0), 0);
                    const costoLaborTotal = apps.reduce((s,a) =>
                      s + (parseFloat(a.costo_labor_ha) || COSTOS_LABOR_DEFAULT[a.tipo_aplicacion] || 0) * (parseFloat(a.superficie_ha)||1), 0);
                    const costoTotal    = costoAgroTotal + costoLaborTotal;
                    const costoHa       = haTotal > 0 ? costoTotal    / haTotal : 0;
                    const costoAgroHa   = haTotal > 0 ? costoAgroTotal / haTotal : 0;
                    const costoLaborHa  = haTotal > 0 ? costoLaborTotal / haTotal : 0;
                    const cantApps  = apps.length;
                    const cantLotes = Object.keys(haMaxPorLote).length;
                    return { cult, haTotal, costoTotal, costoHa, costoAgroHa, costoLaborHa, cantApps, cantLotes };
                  }).sort((a,b) => b.costoHa - a.costoHa);

                  const maxCosto = Math.max(...dataCultivo.map(d => d.costoHa), 1);

                  return (
                    <div style={{ ...st.card, marginBottom: 20 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>🌾 Costo por Cultivo</div>
                          <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>
                            Agroquímicos + labores · {filtroCampana !== "todas" ? `Campaña ${filtroCampana}` : "Todas las campañas"}
                            {filtroEmpresa !== "todas" ? ` · ${filtroEmpresa}` : ""}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: C.muted }}>{dataCultivo.reduce((s,d) => s+d.cantApps, 0)} aplicaciones</div>
                      </div>

                      {/* Tabla de cultivos */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {dataCultivo.map(d => (
                          <div key={d.cult}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 5 }}>
                              <div style={{ width: 120, fontSize: 12, fontWeight: 600, color: C.text, flexShrink: 0 }}>{d.cult}</div>
                              <div style={{ flex: 1, background: C.mutedBg, borderRadius: 6, height: 10, overflow: "hidden" }}>
                                <div style={{ width: `${(d.costoHa / maxCosto) * 100}%`, height: "100%", background: C.accent, borderRadius: 6, transition: "width 0.4s" }} />
                              </div>
                              <div style={{ width: 120, textAlign: "right", fontSize: 13, fontWeight: 700, color: C.accent, fontFamily: F, flexShrink: 0 }}>
                                USD {d.costoHa.toFixed(0)}/ha
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 16, paddingLeft: 132, fontSize: 11, color: C.muted }}>
                              <span>🧪 Agro: USD {d.costoAgroHa.toFixed(0)}/ha</span>
                              <span>🚜 Labor: USD {d.costoLaborHa.toFixed(0)}/ha</span>
                              <span>📐 {Math.round(d.haTotal).toLocaleString("es-AR")} ha · {d.cantLotes} lote{d.cantLotes!==1?"s":""}</span>
                              <span>💊 {d.cantApps} aplic.</span>
                              <span style={{ marginLeft: "auto", fontWeight: 600, color: C.text }}>Total: USD {Math.round(d.costoTotal).toLocaleString("es-AR")}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totales */}
                      <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${C.border}`, display: "flex", gap: 24, fontSize: 12 }}>
                        {[
                          { label: "Costo total", val: `USD ${Math.round(dataCultivo.reduce((s,d)=>s+d.costoTotal,0)).toLocaleString("es-AR")}`, color: C.accent },
                          { label: "Ha totales", val: `${Math.round(dataCultivo.reduce((s,d)=>s+d.haTotal,0)).toLocaleString("es-AR")} ha`, color: C.text },
                          { label: "Cultivos", val: dataCultivo.length, color: C.text },
                        ].map(({label, val, color}) => (
                          <div key={label}>
                            <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color }}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* ── BUSCADOR DE PRODUCTOS ── */}
                {(() => {
                  const resultadosProd = buscarProd.trim().length >= 2
                    ? aplicaciones.filter(a =>
                        (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                        (a.productos||[]).some(p => (p.producto_nombre||"").toLowerCase().includes(buscarProd.toLowerCase()))
                      ).map(a => ({
                        ...a,
                        prodMatch: (a.productos||[]).filter(p => (p.producto_nombre||"").toLowerCase().includes(buscarProd.toLowerCase()))
                      })).sort((a,b) => b.fecha?.localeCompare(a.fecha))
                    : [];

                  return (
                    <div style={{ ...st.card, marginBottom: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                        🔍 Buscador de Productos
                        <span style={{ fontSize: 10, color: C.muted, fontWeight: 400 }}>¿En qué lotes se aplicó un producto?</span>
                      </div>
                      <input
                        type="text"
                        value={buscarProd}
                        onChange={e => setBuscarProd(e.target.value)}
                        placeholder="Escribí el nombre del producto (ej: PIRATE, ROUNDUP, CORAGEN...)"
                        style={{ ...inputSt, width: "100%", marginBottom: resultadosProd.length > 0 ? 14 : 0 }}
                      />
                      {buscarProd.trim().length >= 2 && (
                        resultadosProd.length === 0 ? (
                          <div style={{ fontSize: 12, color: C.muted, marginTop: 8 }}>Sin resultados para "{buscarProd}"</div>
                        ) : (
                          <div>
                            <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{resultadosProd.length} aplicación{resultadosProd.length !== 1 ? "es" : ""} encontrada{resultadosProd.length !== 1 ? "s" : ""}</div>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                              <thead>
                                <tr>{["FECHA","EMPRESA","CAMPO","LOTE","CULTIVO","PRODUCTO","DOSIS","SUPERFICIE"].map(h => (
                                  <th key={h} style={{ textAlign: "left", padding: "7px 10px", fontSize: 10, color: C.muted, letterSpacing: 1, fontFamily: F, borderBottom: `1px solid ${C.border}`, background: C.mutedBg }}>{h}</th>
                                ))}</tr>
                              </thead>
                              <tbody>
                                {resultadosProd.slice(0, 50).map((a, i) => a.prodMatch.map((p, pi) => (
                                  <tr key={i+"-"+pi} style={{ borderBottom: `1px solid ${C.border}` }}>
                                    <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, color: C.textDim }}>{a.fecha}</td>
                                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.textDim }}>{a.empresa_nombre}</td>
                                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.textDim }}>{a.campo_nombre}</td>
                                    <td style={{ padding: "8px 10px", fontWeight: 700, color: C.text, fontSize: 12 }}>{a.lote_nombre}</td>
                                    <td style={{ padding: "8px 10px", fontSize: 11, color: C.textDim }}>{a.cultivo}</td>
                                    <td style={{ padding: "8px 10px" }}>
                                      <span style={{ background: C.accentLight, color: C.accent, fontWeight: 700, fontSize: 11, padding: "2px 8px", borderRadius: 5 }}>{p.producto_nombre}</span>
                                    </td>
                                    <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, color: C.textDim }}>{p.dosis ? `${p.dosis} ${p.unidad||""}` : "—"}</td>
                                    <td style={{ padding: "8px 10px", fontFamily: F, fontSize: 11, color: C.textDim }}>{a.superficie_ha ? `${a.superficie_ha} ha` : "—"}</td>
                                  </tr>
                                )))}
                              </tbody>
                            </table>
                            {resultadosProd.length > 50 && <div style={{ fontSize: 11, color: C.muted, marginTop: 8, textAlign: "center" }}>Mostrando 50 de {resultadosProd.length} resultados</div>}
                          </div>
                        )
                      )}
                    </div>
                  );
                })()}

                {/* Selector empresa destacado */}
                <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12, background: C.accentLight, border: `1px solid ${C.accent}30`, borderRadius: 10, padding: "12px 16px" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accent, whiteSpace: "nowrap" }}>🏢 Empresa:</span>
                  <select value={filtroEmpresa} onChange={e => { setFiltroEmpresa(e.target.value); setFiltroCampo("todos"); setFiltroLote("todos"); }}
                    style={{ ...inputSt, margin: 0, fontWeight: filtroEmpresa !== "todas" ? 700 : 400, color: filtroEmpresa !== "todas" ? C.accent : C.textDim, cursor: "pointer", fontSize: 14, flex: 1, maxWidth: 320 }}>
                    <option value="todas">— Seleccioná una empresa —</option>
                    {["HERRERA IGNACIO","AGROCORSI","BERTOLI VARRONE","FERNANDO PIGHIN 2","GIANFRANCO BERTOLI","GREGORET HNOS","SIGOTO/GOROSITO/BERTOLI","VACHETTA JORGE"].map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                  {filtroEmpresa !== "todas" && (
                    <span style={{ fontSize: 12, color: C.muted }}>
                      {aplicaciones.filter(a => a.empresa_nombre?.trim() === filtroEmpresa?.trim()).length} órdenes
                    </span>
                  )}
                </div>
                {filtroEmpresa === "todas" ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 60, color: C.muted }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>🏢</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: C.textDim, marginBottom: 6 }}>Seleccioná una empresa para ver sus órdenes</div>
                    <div style={{ fontSize: 12 }}>Usá el selector de arriba para filtrar por cliente</div>
                  </div>
                ) : (<div>
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <h2 style={st.sectionTitle}>💊 Órdenes — {filtroEmpresa}</h2>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <ExportButtons
                      onExcel={() => exportCSV(aplicaciones.filter(a => a.empresa_nombre?.trim() === filtroEmpresa?.trim() && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)), [
                        { label: "Fecha",        get: a => a.fecha },
                        { label: "Empresa",      get: a => a.empresa_nombre },
                        { label: "Campo",        get: a => a.campo_nombre },
                        { label: "Lote",         get: a => a.lote_nombre },
                        { label: "Cultivo",      get: a => a.cultivo },
                        { label: "Tipo",         get: a => a.tipo_aplicacion },
                        { label: "Superficie ha",get: a => a.superficie_ha },
                        { label: "Cant. productos", get: a => a.productos?.length || 0 },
                        { label: "Productos",    get: a => a.productos?.map(p => `${p.producto_nombre} ${p.dosis}${p.unidad}`).join(" | ") || "" },
                        { label: "Costo USD/ha", get: a => a.costo_total_usd ? parseFloat(a.costo_total_usd).toFixed(2) : "" },
                        { label: "Observaciones", get: a => a.observaciones },
                      ], `aplicaciones_${new Date().toISOString().split("T")[0]}.csv`)}
                      onPDF={() => printTable("Órdenes de Aplicación", `
                        <table>
                          <thead><tr><th>Fecha</th><th>Empresa</th><th>Campo</th><th>Lote</th><th>Cultivo</th><th>Tipo</th><th>Superficie</th><th>Productos</th><th>Costo USD</th></tr></thead>
                          <tbody>${aplicaciones.filter(a => a.empresa_nombre?.trim() === filtroEmpresa?.trim() && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)).map(a => `<tr>
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
                    <input ref={fileExcelRef} type="file" accept=".xlsx,.xls" onChange={e => e.target.files[0] && importarExcel(e.target.files[0])} style={{ display: "none" }} />
                    <input ref={filePreciosRef} type="file" accept=".xlsx,.xls" onChange={e=>e.target.files[0]&&importarPrecios(e.target.files[0])} style={{display:"none"}}/>
                    <button onClick={() => fileExcelRef.current.click()} disabled={importandoExcel}
                      style={{ ...st.btnPrimary, background: importandoExcel ? C.muted : "#2980b9", opacity: importandoExcel ? 0.7 : 1 }}>
                      {importandoExcel ? "⏳ Importando..." : "📥 Importar Excel"}
                    </button>
                    <button onClick={descargarExcelPrecios} style={{...st.btnPrimary,background:"#16a085"}}>💲 Descargar precios</button>
                    <button onClick={()=>filePreciosRef.current.click()} disabled={importandoPrecios} style={{...st.btnPrimary,background:importandoPrecios?C.muted:"#16a085",opacity:importandoPrecios?0.7:1}}>{importandoPrecios?"⏳ Valorizando...":"📥 Importar precios"}</button>
                    {/* Reporte de productos */}
                    <button onClick={() => {
                      // Agrupar todos los productos de todas las aplicaciones filtradas
                      const appsActuales = aplicaciones.filter(a =>
                        (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                        (filtroCampo === "todos" || a.campo_nombre === filtroCampo) &&
                        (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) &&
                        (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)
                      );
                      const normalizarDosis = (dosis, unidad) => {
                        // Tomar solo la parte antes de "/" (ej: "cc/ha" → "cc", "l/ha" → "l")
                        const u = (unidad || "").toLowerCase().trim().split("/")[0].trim();
                        if (u === "cc" || u === "ml") return { valor: dosis / 1000, unidad: "l" };
                        if (u === "g" || u === "gr") return { valor: dosis / 1000, unidad: "kg" };
                        if (u === "l" || u === "lts" || u === "litros" || u === "lt") return { valor: dosis, unidad: "l" };
                        if (u === "kg" || u === "kgs" || u === "kilo" || u === "kilos") return { valor: dosis, unidad: "kg" };
                        return { valor: dosis, unidad: "l" };
                      };
                      const mapa = {};
                      appsActuales.forEach(a => {
                        (a.productos || []).forEach(p => {
                          const nombre = p.producto_nombre || "Sin nombre";
                          const ha = parseFloat(a.superficie_ha) || 0;
                          const dosis = parseFloat(p.dosis) || 0;
                          const norm = normalizarDosis(dosis, p.unidad);
                          if (!mapa[nombre]) mapa[nombre] = { nombre, unidad: norm.unidad, dosis_total: 0, ha_total: 0, costo_total: 0, aplicaciones: 0, lotes: new Set() };
                          mapa[nombre].dosis_total += norm.valor * ha;
                          mapa[nombre].ha_total += ha;
                          mapa[nombre].costo_total += (parseFloat(p.costo_total) || 0) * ha;
                          mapa[nombre].aplicaciones += 1;
                          mapa[nombre].lotes.add(a.lote_nombre);
                        });
                      });
                      const filas = Object.values(mapa).sort((a,b) => a.nombre.localeCompare(b.nombre));
                      exportCSV(filas, [
                        { label: "Producto", get: r => r.nombre },
                        { label: "Unidad", get: r => r.unidad },
                        { label: "Cant. aplicaciones", get: r => r.aplicaciones },
                        { label: "Ha tratadas (total)", get: r => r.ha_total.toFixed(1) },
                        { label: `Cant. total`, get: r => r.dosis_total.toFixed(2) },
                        { label: "Costo total USD", get: r => r.costo_total.toFixed(2) },
                        { label: "Lotes", get: r => [...r.lotes].join(" | ") },
                      ], `reporte_productos_${new Date().toISOString().split("T")[0]}.csv`);
                    }} style={{ ...st.btnPrimary, background: "#27ae60" }}>
                      📊 Excel Productos
                    </button>
                    <button onClick={() => {
                      const appsActuales = aplicaciones.filter(a =>
                        (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                        (filtroCampo === "todos" || a.campo_nombre === filtroCampo) &&
                        (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) &&
                        (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)
                      );
                      const normalizarDosisPDF = (dosis, unidad) => {
                        const u = (unidad || "").toLowerCase().trim().split("/")[0].trim();
                        if (u === "cc" || u === "ml") return { valor: dosis / 1000, unidad: "l" };
                        if (u === "g" || u === "gr") return { valor: dosis / 1000, unidad: "kg" };
                        if (u === "l" || u === "lts" || u === "litros" || u === "lt") return { valor: dosis, unidad: "l" };
                        if (u === "kg" || u === "kgs" || u === "kilo" || u === "kilos") return { valor: dosis, unidad: "kg" };
                        return { valor: dosis, unidad: "l" };
                      };
                      const mapa = {};
                      appsActuales.forEach(a => {
                        (a.productos || []).forEach(p => {
                          const nombre = p.producto_nombre || "Sin nombre";
                          const ha = parseFloat(a.superficie_ha) || 0;
                          const dosis = parseFloat(p.dosis) || 0;
                          const norm = normalizarDosisPDF(dosis, p.unidad);
                          if (!mapa[nombre]) mapa[nombre] = { nombre, unidad: norm.unidad, dosis_total: 0, ha_total: 0, costo_total: 0, aplicaciones: 0, lotes: new Set() };
                          mapa[nombre].dosis_total += norm.valor * ha;
                          mapa[nombre].ha_total += ha;
                          mapa[nombre].costo_total += (parseFloat(p.costo_total) || 0) * ha;
                          mapa[nombre].aplicaciones += 1;
                          mapa[nombre].lotes.add(a.lote_nombre);
                        });
                      });
                      const filas = Object.values(mapa).sort((a,b) => a.nombre.localeCompare(b.nombre));
                      const costoGlobal = filas.reduce((s, r) => s + r.costo_total, 0);
                      printTable("Reporte de Productos por Campaña", `
                        <p style="margin-bottom:12px;font-size:11px;color:#5a7a5e">
                          ${filtroEmpresa !== "todas" ? `Empresa: <b>${filtroEmpresa}</b> · ` : ""}
                          ${filtroCampo !== "todos" ? `Campo: <b>${filtroCampo}</b> · ` : ""}
                          ${filas.length} productos · ${appsActuales.length} aplicaciones
                        </p>
                        <table>
                          <thead><tr>
                            <th>Producto</th><th>Unidad</th><th>Aplicaciones</th>
                            <th>Ha tratadas</th><th>Cantidad total</th>
                            <th>Costo total USD</th><th>Lotes</th>
                          </tr></thead>
                          <tbody>
                            ${filas.map(r => `<tr>
                              <td><b>${r.nombre}</b></td>
                              <td class="num">${r.unidad}</td>
                              <td class="num">${r.aplicaciones}</td>
                              <td class="num">${r.ha_total.toFixed(1)} ha</td>
                              <td class="num">${r.dosis_total.toFixed(2)} ${r.unidad}</td>
                              <td class="num"><b>${r.costo_total > 0 ? `USD ${r.costo_total.toFixed(2)}` : "—"}</b></td>
                              <td style="font-size:9px">${[...r.lotes].join(", ")}</td>
                            </tr>`).join("")}
                          </tbody>
                          <tfoot><tr>
                            <td colspan="5" style="text-align:right;font-weight:700;padding-top:8px">COSTO TOTAL CAMPAÑA</td>
                            <td class="num" style="font-weight:700;font-size:13px">USD ${costoGlobal.toFixed(2)}</td>
                            <td></td>
                          </tr></tfoot>
                        </table>
                      `);
                    }} style={{ ...st.btnPrimary, background: "#c0392b" }}>
                      📄 PDF Productos
                    </button>
                    <button onClick={() => setShowValorizarLabores(v => !v)}
                      style={{ ...st.btnPrimary, background: "#8e44ad" }}>
                      🚜 Valorizar Labores
                    </button>
                    <button onClick={() => setShowFormApp(!showFormApp)} style={st.btnPrimary}>+ Nueva Aplicación</button>
                  </div>
                </div>

                {importPreciosResultado&&(<div style={{...st.card,marginBottom:16,border:`1px solid ${importPreciosResultado.err?C.danger:C.accent}40`,background:importPreciosResultado.err?"#fdecea60":C.accentLight+"60"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div style={{fontSize:13,fontWeight:600,color:importPreciosResultado.err?C.danger:C.accent}}>
                      {importPreciosResultado.err?`⚠ Error: ${importPreciosResultado.errores?.[0]}`:`✓ ${importPreciosResultado.ok} aplicaciones actualizadas · ${importPreciosResultado.productos} productos`}
                    </div>
                    <button onClick={()=>setImportPreciosResultado(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:16,color:C.muted}}>✕</button>
                  </div>
                </div>)}
                {/* ── PANEL VALORIZAR LABORES ── */}
                {showValorizarLabores && (() => {
                  // Tipos de labor que realmente existen en las aplicaciones filtradas
                  const appsActualesLab = aplicaciones.filter(a =>
                    (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                    (filtroCampo === "todos" || a.campo_nombre === filtroCampo) &&
                    (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) &&
                    (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)
                  );
                  const tiposPresentes = [...new Set(appsActualesLab.map(a => a.tipo_aplicacion).filter(Boolean))].sort();
                  return (
                    <div style={{ ...st.card, marginBottom: 20, border: `1px solid #8e44ad40`, background: "#faf8ff" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <div style={{ fontSize: 12, color: "#8e44ad", letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, fontFamily: F }}>
                          🚜 Valorización de Labores
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 11, color: C.muted }}>Precio grano (USD/tn) para cosechas %:</span>
                          <input type="number" value={precioGranoLabor} onChange={e => setPrecioGranoLabor(e.target.value)}
                            style={{ ...inputSt, margin: 0, width: 80, padding: "5px 8px", fontSize: 13 }} />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 10, marginBottom: 16 }}>
                        {tiposPresentes.map(tipo => {
                          const defaultPrecio = COSTOS_LABOR_DEFAULT[tipo];
                          const pctCosecha = COSECHAS_PCT[tipo];
                          const precioPct = pctCosecha ? (parseFloat(precioGranoLabor) * pctCosecha / 100).toFixed(2) : null;
                          const cantApps = appsActualesLab.filter(a => a.tipo_aplicacion === tipo).length;
                          const haTotal = appsActualesLab.filter(a => a.tipo_aplicacion === tipo).reduce((s,a) => s+(parseFloat(a.superficie_ha)||0),0);
                          return (
                            <div key={tipo} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                              <div style={{ fontSize: 12, fontWeight: 700, color: C.text, marginBottom: 2 }}>{tipo}</div>
                              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>{cantApps} aplicaciones · {Math.round(haTotal)} ha</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontSize: 11, color: C.muted }}>USD/ha:</span>
                                <input type="number"
                                  value={preciosLabores[tipo] !== undefined ? preciosLabores[tipo] : (defaultPrecio || precioPct || "")}
                                  placeholder={precioPct ? `${precioPct} (${pctCosecha}%)` : defaultPrecio || ""}
                                  onChange={e => setPreciosLabores(p => ({ ...p, [tipo]: e.target.value }))}
                                  style={{ ...inputSt, margin: 0, width: 90, padding: "5px 8px", fontSize: 13 }} />
                                {pctCosecha && <span style={{ fontSize: 10, color: C.muted }}>{pctCosecha}% → USD {precioPct}/ha</span>}
                                <button onClick={() => valorizarLaboresFn(null, tipo)}
                                  title="Aplicar solo este tipo"
                                  style={{ background: "#8e44ad20", border: "1px solid #8e44ad40", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 11, color: "#8e44ad", fontWeight: 600 }}>
                                  Aplicar
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ display: "flex", gap: 10, borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
                        <button onClick={() => valorizarLaboresFn(null)}
                          style={{ ...st.btnPrimary, background: "#8e44ad" }}>
                          🚜 Valorizar TODAS las labores filtradas
                        </button>
                        <button onClick={() => { setShowValorizarLabores(false); setPreciosLabores({}); }}
                          style={{ ...st.btnSecondary }}>
                          Cerrar
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* ── PANEL ANÁLISIS DE COSTOS ── */}
                {(() => {
                  const appsVis = aplicaciones.filter(a =>
                    (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                    (filtroCampo === "todos" || a.campo_nombre === filtroCampo) &&
                    (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) &&
                    (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)
                  );
                  if (appsVis.length === 0) return null;

                  // Ha reales del campo/lote desde estructura_lotes (fuente de verdad)
                  // Si hay filtro de campo/lote, sumar solo esos; sino sumar todos los de la empresa
                  const haTotalesPanel = (() => {
                    const lotesFiltrados = estructuraLotes.filter(l =>
                      (filtroEmpresa === "todas" || l.empresa_nombre === filtroEmpresa) &&
                      (filtroCampo === "todos" || l.campo_nombre === filtroCampo) &&
                      (filtroLote === "todos" || String(l.lote_nombre).includes(filtroLote))
                    );
                    const haEst = lotesFiltrados.reduce((s, l) => s + (parseFloat(l.hectareas)||0), 0);
                    // Fallback: ha únicas por lote desde las apps si no hay estructura cargada
                    if (haEst > 0) return haEst;
                    const haLotes = {};
                    appsVis.forEach(a => {
                      const k = `${a.empresa_nombre}|${a.campo_nombre}|${a.lote_nombre}`;
                      const ha = parseFloat(a.superficie_ha)||0;
                      if (ha > (haLotes[k]||0)) haLotes[k] = ha;
                    });
                    return Object.values(haLotes).reduce((s,h)=>s+h,0) || 1;
                  })();

                  // Agrupar costos por tipo
                  // costo_total de productos = USD/ha → × ha = total campo
                  // costo_labor_ha × ha = total campo
                  // USD/ha ponderado = totalCampo / ha propias del tipo (no el total general)
                  const porTipo = {};
                  let costoTotal = 0;
                  // Ha únicas por lote por tipo: evitar contar múltiples veces el mismo lote
                  const haLotePorTipo = {}; // tipo -> Set de keys de lote

                  appsVis.forEach(a => {
                    const ha = parseFloat(a.superficie_ha) || 0;
                    const lotKey = `${a.empresa_nombre}|${a.campo_nombre}|${a.lote_nombre}`;

                    (a.productos||[]).forEach(p => {
                      const nombre = (p.producto_nombre||"").toLowerCase();
                      let tipo = "Insumos";
                      if (nombre.startsWith("herbicida")) tipo = "Herbicidas";
                      else if (nombre.startsWith("insecticida")) tipo = "Insecticidas";
                      else if (nombre.startsWith("fungicida")) tipo = "Fungicidas";
                      else if (nombre.startsWith("fertilizante")) tipo = "Fertilizantes";
                      else if (nombre.startsWith("semilla") || nombre.includes("curasemilla") || nombre.includes("tratamiento profesional") || nombre.startsWith("inoc")) tipo = "Semillas";
                      else if (nombre.startsWith("labor")) tipo = "Labores";
                      else if (nombre.startsWith("coadyuvante")) tipo = "Coadyuvantes";
                      else if (nombre.startsWith("regulador")) tipo = "Reguladores";

                      // Costo real con calcularCostoHa (no p.costo_total que puede estar vacío)
                      const costoHaReal = calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd);
                      const costoTotal_ = costoHaReal * ha;

                      if (!porTipo[tipo]) { porTipo[tipo] = { totalCampo: 0, haPropias: 0, prods: [] }; haLotePorTipo[tipo] = {}; }
                      porTipo[tipo].totalCampo += costoTotal_;
                      // Ha únicas por lote: tomar el máximo de superficie_ha visto para ese lote
                      if (!haLotePorTipo[tipo][lotKey] || ha > haLotePorTipo[tipo][lotKey]) {
                        haLotePorTipo[tipo][lotKey] = ha;
                      }
                      if (p.producto_nombre) porTipo[tipo].prods.push(p.producto_nombre);
                      costoTotal += costoTotal_;
                    });

                    // Labor: desglosada por subtipo
                    const costoLabor = (parseFloat(a.costo_labor_ha)||0) * ha;
                    if (costoLabor > 0) {
                      const subtipoLabor = `⤷ ${a.tipo_aplicacion||"Labor"}`;
                      if (!porTipo[subtipoLabor]) { porTipo[subtipoLabor] = { totalCampo: 0, haPropias: 0, prods: [], esLabor: true }; haLotePorTipo[subtipoLabor] = {}; }
                      porTipo[subtipoLabor].totalCampo += costoLabor;
                      if (!haLotePorTipo[subtipoLabor][lotKey] || ha > haLotePorTipo[subtipoLabor][lotKey]) {
                        haLotePorTipo[subtipoLabor][lotKey] = ha;
                      }
                      porTipo[subtipoLabor].prods.push(`${ha} ha × USD ${a.costo_labor_ha}/ha`);
                      costoTotal += costoLabor;
                    }
                  });

                  // USD/ha = costo total del tipo / ha totales del campo (fuente: estructura_lotes)
                  Object.entries(porTipo).forEach(([tipo, v]) => {
                    v.haPropias = Object.values(haLotePorTipo[tipo]||{}).reduce((s,h)=>s+h, 0);
                    v.total = v.totalCampo;
                    // Dividir por ha del campo (haTotalesPanel) para USD/ha real
                    v.haPromedio = haTotalesPanel > 0 ? v.totalCampo / haTotalesPanel : 0;
                  });

                  const COLORES_TIPO = {
                    "Herbicidas": "#27ae60", "Insecticidas": "#e74c3c", "Fungicidas": "#8e44ad",
                    "Fertilizantes": "#f39c12", "Semillas": "#2980b9", "Labores": "#1abc9c",
                    "Coadyuvantes": "#95a5a6", "Reguladores": "#e67e22", "Insumos": "#7f8c8d"
                  };

                  // Calcular total de labores para mostrar encabezado
                  const totalLabores = Object.entries(porTipo).filter(([k,v]) => v.esLabor).reduce((s,[,v]) => s+v.total, 0);
                  const haLabores = Object.entries(porTipo).filter(([k,v]) => v.esLabor).reduce((s,[,v]) => s+v.haPropias, 0);
                  const tiposNoLabor = Object.entries(porTipo).filter(([,v]) => v && !v.esLabor && v.total > 0).sort((a,b) => b[1].total-a[1].total);
                  const tiposLabor = Object.entries(porTipo).filter(([,v]) => v && v.esLabor && v.total > 0).sort((a,b) => b[1].total-a[1].total);
                  // Lista limpia para torta y leyenda (sin headers especiales)
                  const tiposArr = [...tiposNoLabor, ...tiposLabor].filter(([,v]) => v && v.total > 0);
                  // Para la torta: colapsar todos los subtipos de labor en uno solo
                  const tiposArrTorta = [
                    ...tiposNoLabor.filter(([,v]) => v && v.total > 0),
                    ...(totalLabores > 0 ? [["Labores", { total: totalLabores, haPropias: haLabores, haPromedio: haLabores > 0 ? totalLabores/haLabores : 0, prods: [] }]] : [])
                  ];
                  const haTotal = [...new Set(appsVis.map(a => a.lote_nombre))].length;

                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                      {/* Barras por tipo */}
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
                        <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
                          Costos por Tipo · {appsVis.length} aplicaciones · {Math.round(haTotalesPanel)} ha totales
                        </div>
                        {/* No-labores ordenadas por monto */}
                        {tiposNoLabor.map(([tipo, v]) => {
                          const costo = v.total;
                          const pct = costoTotal > 0 ? costo / costoTotal * 100 : 0;
                          const prodsUnicos = [...new Set(v.prods)].slice(0, 10);
                          const tooltipId = `tip-${tipo.replace(/\s/g,'')}`;
                          return (
                            <div key={tipo} style={{ marginBottom: 10 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}
                                  onMouseEnter={e => { const t = document.getElementById(tooltipId); if(t) t.style.display="block"; }}
                                  onMouseLeave={e => { const t = document.getElementById(tooltipId); if(t) t.style.display="none"; }}>
                                  <div style={{ width: 10, height: 10, borderRadius: 3, background: COLORES_TIPO[tipo]||"#bdc3c7", flexShrink: 0 }} />
                                  <span style={{ fontSize: 12, fontWeight: 600, color: C.text, cursor: "help", borderBottom: `1px dashed ${C.border}` }}>{tipo} ℹ</span>
                                  {prodsUnicos.length > 0 && (
                                    <div id={tooltipId} style={{ display: "none", position: "absolute", top: 22, left: 0, zIndex: 100, background: C.text, color: "#fff", borderRadius: 8, padding: "8px 12px", fontSize: 11, minWidth: 200, maxWidth: 300, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", lineHeight: 1.7 }}>
                                      <div style={{ fontWeight: 700, marginBottom: 4, color: "#4ae87a" }}>{tipo}:</div>
                                      {prodsUnicos.map((n,i) => <div key={i}>· {n}</div>)}
                                      {v.prods.length > 10 && <div style={{ color: "#94b09a", marginTop: 2 }}>...y {v.prods.length-10} más</div>}
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                  <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{pct.toFixed(1)}%</span>
                                  <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{Math.round(v.haPropias)} ha</span>
                                  <span style={{ fontSize: 11, color: C.textDim, fontFamily: F, fontWeight: 600 }}>{v.haPromedio?.toFixed(1)} USD/ha</span>
                                  <span style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: F, minWidth: 100, textAlign: "right" }}>USD {Math.round(costo).toLocaleString("es-AR")}</span>
                                </div>
                              </div>
                              <div style={{ height: 8, background: C.mutedBg, borderRadius: 4, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: COLORES_TIPO[tipo]||"#bdc3c7", borderRadius: 4, transition: "width 0.5s ease" }} />
                              </div>
                            </div>
                          );
                        })}
                        {/* Encabezado LABORES + subtipos */}
                        {tiposLabor.length > 0 && (
                          <div style={{ marginBottom: 6, borderTop: `1px dashed ${C.border}`, paddingTop: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 10, height: 10, borderRadius: 3, background: "#1abc9c", flexShrink: 0 }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Labores (total)</span>
                              </div>
                              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{costoTotal > 0 ? (totalLabores/costoTotal*100).toFixed(1) : 0}%</span>
                                <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{Math.round(haLabores)} ha</span>
                                <span style={{ fontSize: 11, color: C.textDim, fontFamily: F, fontWeight: 600 }}>{haLabores > 0 ? (totalLabores/haLabores).toFixed(1) : 0} USD/ha</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: F, minWidth: 100, textAlign: "right" }}>USD {Math.round(totalLabores).toLocaleString("es-AR")}</span>
                              </div>
                            </div>
                            {tiposLabor.map(([tipo, v]) => {
                              const costo = v.total;
                              const pct = costoTotal > 0 ? costo / costoTotal * 100 : 0;
                              const tooltipId = `tip-${tipo.replace(/\s/g,'')}`;
                              return (
                                <div key={tipo} style={{ marginBottom: 6, paddingLeft: 16 }}>
                                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}
                                      onMouseEnter={e => { const t = document.getElementById(tooltipId); if(t) t.style.display="block"; }}
                                      onMouseLeave={e => { const t = document.getElementById(tooltipId); if(t) t.style.display="none"; }}>
                                      <span style={{ fontSize: 11, color: C.textDim }}>{tipo}</span>
                                      {v.prods.length > 0 && (
                                        <div id={tooltipId} style={{ display: "none", position: "absolute", top: 18, left: 0, zIndex: 100, background: C.text, color: "#fff", borderRadius: 8, padding: "8px 12px", fontSize: 11, minWidth: 220, maxWidth: 320, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", lineHeight: 1.7 }}>
                                          <div style={{ fontWeight: 700, marginBottom: 4, color: "#4ae87a" }}>Detalle:</div>
                                          {[...new Set(v.prods)].slice(0,8).map((n,i) => <div key={i}>· {n}</div>)}
                                        </div>
                                      )}
                                    </div>
                                    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                      <span style={{ fontSize: 10, color: C.muted, fontFamily: F }}>{pct.toFixed(1)}%</span>
                                      <span style={{ fontSize: 10, color: C.muted, fontFamily: F }}>{Math.round(v.haPropias)} ha</span>
                                      <span style={{ fontSize: 11, color: C.textDim, fontFamily: F, fontWeight: 600 }}>{v.haPromedio?.toFixed(1)} USD/ha</span>
                                      <span style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: F, minWidth: 100, textAlign: "right" }}>USD {Math.round(costo).toLocaleString("es-AR")}</span>
                                    </div>
                                  </div>
                                  <div style={{ height: 5, background: C.mutedBg, borderRadius: 4, overflow: "hidden" }}>
                                    <div style={{ height: "100%", width: `${pct}%`, background: "#1abc9c", borderRadius: 4, opacity: 0.6 }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: 12, paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 12, color: C.textDim, fontWeight: 600 }}>TOTAL</span>
                          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                            <span style={{ fontSize: 12, color: C.textDim, fontFamily: F }}>{costoTotal.toFixed(0)} USD total · {haTotalesPanel > 0 ? (costoTotal/haTotalesPanel).toFixed(1) : 0} USD/ha s/total ha</span>
                            <span style={{ fontSize: 14, fontWeight: 700, color: C.text, fontFamily: F }}>USD {Math.round(costoTotal).toLocaleString("es-AR")}</span>
                          </div>
                        </div>
                      </div>

                      {/* Torta SVG */}
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px" }}>
                        <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>
                          Distribución de Costos
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                          {/* Torta SVG simple */}
                          <svg width={140} height={140} viewBox="0 0 140 140">
                            {(() => {
                              let startAngle = -Math.PI / 2;
                              return tiposArrTorta.map(([tipo, v]) => {
                                const costo = v.total;
                                const pct = costoTotal > 0 ? costo / costoTotal : 0;
                                const angle = pct * 2 * Math.PI;
                                const x1 = 70 + 60 * Math.cos(startAngle);
                                const y1 = 70 + 60 * Math.sin(startAngle);
                                startAngle += angle;
                                const x2 = 70 + 60 * Math.cos(startAngle);
                                const y2 = 70 + 60 * Math.sin(startAngle);
                                const largeArc = angle > Math.PI ? 1 : 0;
                                if (pct < 0.001) return null;
                                return (
                                  <path key={tipo}
                                    d={`M 70 70 L ${x1} ${y1} A 60 60 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                    fill={COLORES_TIPO[tipo]||"#bdc3c7"}
                                    stroke="#fff" strokeWidth={1.5}
                                  />
                                );
                              });
                            })()}
                            <circle cx={70} cy={70} r={30} fill={C.surface} />
                            <text x={70} y={67} textAnchor="middle" fontSize={9} fill={C.muted}>COSTO</text>
                            <text x={70} y={78} textAnchor="middle" fontSize={9} fill={C.muted}>TOTAL</text>
                          </svg>
                          {/* Leyenda */}
                          <div style={{ flex: 1 }}>
                            {tiposArrTorta.map(([tipo, v]) => (
                              <div key={tipo} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORES_TIPO[tipo]||"#bdc3c7", flexShrink: 0 }} />
                                <span style={{ fontSize: 11, color: C.textDim, flex: 1 }}>{tipo}</span>
                                <span style={{ fontSize: 11, fontFamily: F, color: C.text, fontWeight: 600 }}>{(costoTotal>0?v.total/costoTotal*100:0).toFixed(0)}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {importResultado && (
                  <div style={{
                    background: importResultado.err === 0 ? C.accentLight : C.warnLight,
                    border: `1px solid ${importResultado.err === 0 ? C.accent : C.warn}40`,
                    borderRadius: 10, padding: "12px 16px", marginBottom: 16,
                    display: "flex", alignItems: "flex-start", gap: 12, flexWrap: "wrap"
                  }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: importResultado.err === 0 ? C.accent : C.warn }}>
                        {importResultado.err === 0 ? "✓" : "⚠"} {importResultado.ok} importadas correctamente{importResultado.err > 0 ? `, ${importResultado.err} con error` : ""}
                      </span>
                      {importResultado.errores.length > 0 && (
                        <div style={{ fontSize: 11, color: C.danger, marginTop: 4 }}>
                          {importResultado.errores.slice(0, 3).map((e, i) => <div key={i}>· {e}</div>)}
                        </div>
                      )}
                    </div>
                    <button onClick={() => setImportResultado(null)} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 16 }}>✕</button>
                  </div>
                )}

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

                    {/* Empresa → Campo → Lotes */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 14 }}>
                      <div>
                        <label style={labelSt}>Empresa</label>
                        <select value={newApp.empresa_nombre}
                          onChange={e => setNewApp(p => ({ ...p, empresa_nombre: e.target.value, campo_nombre: "", lotes: [{ lote_nombre: "", superficie_ha: "" }] }))}
                          style={{ ...inputSt, cursor: "pointer" }}>
                          <option value="">Seleccionar...</option>
                          {[...new Set(aplicaciones.map(a => a.empresa_nombre).filter(Boolean))].sort().map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelSt}>Campo</label>
                        <select value={newApp.campo_nombre}
                          onChange={e => {
                            const newCampo = e.target.value;
                            const cultivoDePlan = planificacion.find(p =>
                              p.empresa_nombre?.trim() === newApp.empresa_nombre?.trim() &&
                              p.campo_nombre === newCampo &&
                              p.campana === campanaActualApps
                            )?.cultivo;
                            setNewApp(p => ({ ...p, campo_nombre: newCampo, lotes: [{ lote_nombre: "", superficie_ha: "" }], cultivo: cultivoDePlan || p.cultivo }));
                          }}
                          style={{ ...inputSt, cursor: "pointer" }}>
                          <option value="">Seleccionar...</option>
                          {[...new Set(aplicaciones.filter(a => !newApp.empresa_nombre || a.empresa_nombre === newApp.empresa_nombre).map(a => a.campo_nombre).filter(Boolean))].sort().map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelSt}>
                          Cultivo
                          {(() => {
                            // Buscar cultivo desde planificación actual
                            const cultivosDePlan = newApp.empresa_nombre && newApp.campo_nombre
                              ? [...new Set(planificacion.filter(p =>
                                  p.empresa_nombre?.trim() === newApp.empresa_nombre?.trim() &&
                                  p.campo_nombre === newApp.campo_nombre &&
                                  p.campana === campanaActualApps
                                ).map(p => p.cultivo).filter(Boolean))]
                              : [];
                            return cultivosDePlan.length > 0
                              ? <span style={{ fontSize: 10, color: C.accent, marginLeft: 6, fontWeight: 600 }}>
                                  · {cultivosDePlan.join(", ")} (de planificación)
                                </span>
                              : null;
                          })()}
                        </label>
                        <select value={newApp.cultivo} onChange={e => setNewApp(p => ({ ...p, cultivo: e.target.value }))} style={{ ...inputSt, cursor: "pointer" }}>
                          <option value="">Seleccionar...</option>
                          {(() => {
                            // Opciones de planificación primero
                            const cultivosDePlan = newApp.empresa_nombre && newApp.campo_nombre
                              ? [...new Set(planificacion.filter(p =>
                                  p.empresa_nombre?.trim() === newApp.empresa_nombre?.trim() &&
                                  p.campo_nombre === newApp.campo_nombre &&
                                  p.campana === campanaActualApps
                                ).map(p => p.cultivo).filter(Boolean))]
                              : [];
                            const cultivosResto = ["Soja 1ra","Soja 2da","Soja 3ra","Maíz","Maíz 2da","Vc-Maíz","Cs-Maíz","Trigo","Trigo/Soja 2da","Cebada","Girasol","Sorgo","Algodón","Moha/Soja","Ce-Soja","Maíz HAB","Vicia/Maíz","Barbecho Químico","Cultivo de Servicio","Otro"].filter(c => !cultivosDePlan.includes(c));
                            return (
                              <>
                                {cultivosDePlan.length > 0 && (
                                  <optgroup label="— De planificación —">
                                    {cultivosDePlan.map(c => <option key={c} value={c}>{c}</option>)}
                                  </optgroup>
                                )}
                                <optgroup label="— Otros —">
                                  {cultivosResto.map(c => <option key={c} value={c}>{c}</option>)}
                                </optgroup>
                              </>
                            );
                          })()}
                        </select>
                      </div>
                      <div>
                        <label style={labelSt}>Fecha</label>
                        <input type="date" value={newApp.fecha} onChange={e => setNewApp(p => ({ ...p, fecha: e.target.value }))} style={inputSt} />
                      </div>
                      <div>
                        <label style={labelSt}>Tipo de Labor</label>
                        <select value={newApp.tipo_aplicacion} onChange={e => setNewApp(p => ({ ...p, tipo_aplicacion: e.target.value }))} style={{ ...inputSt, cursor: "pointer" }}>
                          <option value="">Seleccionar...</option>
                          {TIPOS_LABOR.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={labelSt}>Costo Labor (USD/ha)</label>
                        <input type="number" value={newApp.costo_labor_ha || ""}
                          onChange={e => setNewApp(p => ({ ...p, costo_labor_ha: e.target.value }))}
                          placeholder={COSTOS_LABOR_DEFAULT[newApp.tipo_aplicacion] || ""}
                          style={inputSt} />
                      </div>
                      <div>
                        <label style={labelSt}>N° Orden / Receta</label>
                        <input value={newApp.numero_orden||""} onChange={e => setNewApp(p => ({ ...p, numero_orden: e.target.value }))} style={inputSt} placeholder="Ej: 12345" />
                      </div>
                      <div style={{ gridColumn: "2 / 5" }}>
                        <label style={labelSt}>Observaciones</label>
                        <input value={newApp.observaciones} onChange={e => setNewApp(p => ({ ...p, observaciones: e.target.value }))} style={inputSt} />
                      </div>
                    </div>

                    {/* Lotes — checkboxes */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 10, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>
                        Lotes a tratar — {newApp.lotes.filter(l => l.lote_nombre).length} seleccionados
                      </div>
                      {(() => {
                        const lotesDisponibles = [...new Set(
                          aplicaciones.filter(a =>
                            (!newApp.empresa_nombre || a.empresa_nombre === newApp.empresa_nombre) &&
                            (!newApp.campo_nombre || a.campo_nombre === newApp.campo_nombre)
                          ).map(a => a.lote_nombre).filter(Boolean)
                        )].sort();

                        // También incluir lotes hardcodeados si no hay en aplicaciones
                        const EMPRESAS_LOTES = {
                          "HERRERA IGNACIO": { "LASTRA": ["1","2","LASTRA ZULEMA"] },
                          "AGROCORSI": { "ANTONELLA": ["LOTE A1","LOTE A2"], "EL PAMPA": ["LOTE V1A","LOTE V1B","V2","V3","V4","V5","V6","V7","V8","V9","V10A","V10B","V11"], "SAN PEDRO": ["1","2","3","4","5","6","7","8","9","10","11A","11B","11C","12"], "MARTINEZ": ["1"], "INTIGUATANA": ["INTIGUATANA"], "LAS MARIAS": ["LAS MARIA"] },
                          "FERNANDO PIGHIN 2": { "EST. EL PROGRESO": ["LOTE 1","LOTE 3","LOTE 5","2A","2B","LOTE 4A","LOTE 4B"], "EST. LA LUNA": ["FERNANDO 1","FERNANDO 2","FERNANDO 3","FERNANDO 4","FERNANDO 5","FERNANDO 6","FERNANDO 7","FERNANDO 8","LOTE NUEVO"] },
                          "VACHETTA JORGE": { "DON ALBINO": ["LOTE 1","LOTE 2"] },
                          "SIGOTO/GOROSITO/BERTOLI": { "EL OCASO": ["1 ESTE","2 OESTE"] },
                          "GREGORET HNOS": { "GREGORET HNOS": ["LA CUÑA","EL SUIZO","FIORI","ANTONIO FIORI","SAN PABLO","ESTANCIA GREGORET","LA PERSEVERANCIA","NORMA QUIROZ","CASTAÑO","LA PAMPITA","NORA ANAYA","ROMAN"] },
                          "GIANFRANCO BERTOLI": { "TIERRAS DEL OESTE": ["LOTE 1","LOTE 2"] },
                        };
                        const lotesHard = newApp.empresa_nombre && newApp.campo_nombre && EMPRESAS_LOTES[newApp.empresa_nombre]?.[newApp.campo_nombre] || [];
                        const todoLotes = [...new Set([...lotesDisponibles, ...lotesHard])].sort();

                        const selectedNames = new Set(newApp.lotes.filter(l=>l.lote_nombre).map(l=>l.lote_nombre));

                        const toggleLote = (lote_nombre) => {
                          if (selectedNames.has(lote_nombre)) {
                            setNewApp(p => ({ ...p, lotes: p.lotes.filter(l => l.lote_nombre !== lote_nombre).length > 0 ? p.lotes.filter(l => l.lote_nombre !== lote_nombre) : [{ lote_nombre: "", superficie_ha: "" }] }));
                          } else {
                            const appRef = aplicaciones.filter(a => a.lote_nombre === lote_nombre && a.superficie_ha).sort((a,b) => (parseFloat(b.superficie_ha)||0)-(parseFloat(a.superficie_ha)||0))[0];
                            const haPlanCheck = planificacion.find(p => p.lote_nombre === lote_nombre && (!newApp.empresa_nombre || p.empresa_nombre?.trim() === newApp.empresa_nombre?.trim()))?.hectareas;
                            const ha = appRef?.superficie_ha || (haPlanCheck ? String(haPlanCheck) : "");
                            setNewApp(p => ({
                              ...p,
                              lotes: [...p.lotes.filter(l => l.lote_nombre), { lote_nombre, superficie_ha: ha }]
                            }));
                          }
                        };

                        return (
                          <div>
                            {todoLotes.length > 0 ? (
                              <div>
                                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                                  {todoLotes.map(lote => {
                                    const sel = selectedNames.has(lote);
                                    const haVal = newApp.lotes.find(l => l.lote_nombre === lote)?.superficie_ha;
                                    return (
                                      <div key={lote} onClick={() => toggleLote(lote)}
                                        style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8,
                                          border: `1.5px solid ${sel ? C.accent : C.border}`,
                                          background: sel ? C.accentLight : C.surface,
                                          cursor: "pointer", transition: "all 0.15s" }}>
                                        <input type="checkbox" checked={sel} onChange={() => {}} style={{ cursor: "pointer", accentColor: C.accent }} />
                                        <span style={{ fontSize: 13, fontWeight: sel ? 700 : 400, color: sel ? C.accent : C.textDim }}>{lote}</span>
                                        {sel && haVal && <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{haVal} ha</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                                <button onClick={() => {
                                  const todos = todoLotes.map(lote => {
                                    const appRef = aplicaciones.filter(a => a.lote_nombre === lote && a.superficie_ha).sort((a,b) => (parseFloat(b.superficie_ha)||0)-(parseFloat(a.superficie_ha)||0))[0];
                                    const haPlanTodos = planificacion.find(p => p.lote_nombre === lote && (!newApp.empresa_nombre || p.empresa_nombre?.trim() === newApp.empresa_nombre?.trim()))?.hectareas;
                                    return { lote_nombre: lote, superficie_ha: appRef?.superficie_ha || (haPlanTodos ? String(haPlanTodos) : "") };
                                  });
                                  setNewApp(p => ({ ...p, lotes: todos }));
                                }} style={{ ...st.btnSecondary, fontSize: 11, padding: "4px 10px", marginRight: 6 }}>
                                  Todos
                                </button>
                                <button onClick={() => setNewApp(p => ({ ...p, lotes: [{ lote_nombre: "", superficie_ha: "" }] }))}
                                  style={{ ...st.btnSecondary, fontSize: 11, padding: "4px 10px" }}>
                                  Ninguno
                                </button>
                              </div>
                            ) : (
                              <div style={{ color: C.muted, fontSize: 12, fontStyle: "italic" }}>Seleccioná empresa y campo primero</div>
                            )}
                            {/* Editar ha de lotes seleccionados */}
                            {newApp.lotes.filter(l => l.lote_nombre).length > 0 && (
                              <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {newApp.lotes.filter(l => l.lote_nombre).map((lote, i) => (
                                  <div key={lote.lote_nombre} style={{ display: "flex", alignItems: "center", gap: 6, background: C.mutedBg, borderRadius: 8, padding: "4px 10px" }}>
                                    <span style={{ fontSize: 12, color: C.textDim, fontWeight: 600 }}>{lote.lote_nombre}</span>
                                    <input type="number" value={lote.superficie_ha} placeholder="ha"
                                      onChange={e => {
                                        const ls = [...newApp.lotes];
                                        const idx = ls.findIndex(l => l.lote_nombre === lote.lote_nombre);
                                        if (idx >= 0) ls[idx] = { ...ls[idx], superficie_ha: e.target.value };
                                        setNewApp(p => ({ ...p, lotes: ls }));
                                      }}
                                      style={{ ...inputSt, margin: 0, width: 70, padding: "3px 6px", fontSize: 12 }} />
                                    <span style={{ fontSize: 11, color: C.muted }}>ha</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
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
                            <input type="number" value={p.dosis} onChange={e => { const ps = [...newApp.productos]; ps[i].dosis = e.target.value; ps[i].costo_total = calcularCostoHa(parseFloat(e.target.value) || 0, ps[i].unidad, ps[i].precio_usd).toFixed(2); setNewApp(prev => ({ ...prev, productos: ps })); }} style={inputSt} />
                          </div>
                          <div>
                            <label style={labelSt}>Precio USD/u</label>
                            <input type="number" value={p.precio_usd} onChange={e => { const ps = [...newApp.productos]; ps[i].precio_usd = e.target.value; ps[i].costo_total = calcularCostoHa(parseFloat(ps[i].dosis) || 0, ps[i].unidad, e.target.value).toFixed(2); setNewApp(prev => ({ ...prev, productos: ps })); }} style={inputSt} />
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
                        Costo total: USD {newApp.productos.reduce((s, p) => s + (parseFloat(p.costo_total) || 0), 0).toFixed(2)}/ha · {newApp.lotes.filter(l=>l.lote_nombre).length} lote{newApp.lotes.filter(l=>l.lote_nombre).length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                )}

                {/* Barra de seleccion masiva aplicaciones */}
                {selectedAppIds.size > 0 && (
                  <div style={{
                    background: C.dangerLight, border: `1px solid ${C.danger}40`,
                    borderRadius: 10, padding: "10px 16px", marginBottom: 12,
                    display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap"
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.danger, fontFamily: SANS }}>
                      {selectedAppIds.size} aplicaci{selectedAppIds.size > 1 ? "ones" : "on"} seleccionada{selectedAppIds.size > 1 ? "s" : ""}
                    </span>
                    <button onClick={deleteBulkApps} disabled={deletingBulkApp}
                      style={{ background: C.danger, border: "none", borderRadius: 7, padding: "7px 16px", color: "#fff", fontFamily: SANS, fontSize: 13, cursor: "pointer", fontWeight: 700, opacity: deletingBulkApp ? 0.7 : 1 }}>
                      {deletingBulkApp ? "Eliminando..." : "🗑 Eliminar seleccionadas"}
                    </button>
                    <button onClick={() => setSelectedAppIds(new Set())}
                      style={{ background: "none", border: `1px solid ${C.danger}40`, borderRadius: 7, padding: "7px 14px", color: C.danger, fontFamily: SANS, fontSize: 13, cursor: "pointer" }}>
                      Cancelar
                    </button>
                  </div>
                )}

                {/* Modal edición aplicación */}
                {editandoApp && (
                  <div style={{ ...st.card, marginBottom: 20, border: `2px solid ${C.accent}40`, animation: "slideDown 0.2s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Editando: {editandoApp.lote_nombre}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={saveEditApp} style={{ ...st.btnPrimary, fontSize: 12, padding: "6px 16px" }}>✓ Guardar</button>
                        <button onClick={() => setEditandoApp(null)} style={{ ...st.btnSecondary, fontSize: 12, padding: "6px 12px" }}>✕</button>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                      {[["Empresa","empresa_nombre"],["Campo","campo_nombre"],["Lote","lote_nombre"],["Fecha","fecha"],["Tipo","tipo_aplicacion"],["Superficie (ha)","superficie_ha"],["Costo Labor (USD/ha)","costo_labor_ha"]].map(([label, key]) => (
                        <div key={key}>
                          <label style={labelSt}>{label}</label>
                          <input type={["superficie_ha","costo_labor_ha"].includes(key) ? "number" : key === "fecha" ? "date" : "text"}
                            value={editandoApp[key] || ""}
                            onChange={e => setEditandoApp(p => ({ ...p, [key]: e.target.value }))}
                            style={inputSt} />
                        </div>
                      ))}
                      <div>
                        <label style={labelSt}>Cultivo</label>
                        <select value={editandoApp.cultivo || ""} onChange={e => setEditandoApp(p => ({ ...p, cultivo: e.target.value }))} style={{ ...inputSt, cursor: "pointer" }}>
                          <option value="">— Seleccioná —</option>
                          {["Soja 1ra","Soja 2da","Soja 3ra","Maíz","Maíz 2da","Vc-Maíz","Cs-Maíz","Trigo","Trigo/Soja 2da","Cebada","Girasol","Sorgo","Algodón","Moha/Soja","Ce-Soja","Maíz HAB","Vicia/Maíz","Barbecho Químico","Cultivo de Servicio","Otro"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 10, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Productos</div>
                    {(editandoApp.productos||[]).map((p, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 80px 80px 90px 90px auto", gap: 8, marginBottom: 8, alignItems: "flex-end" }}>
                        <input placeholder="Producto" value={p.producto_nombre||""} onChange={e => { const ps=[...editandoApp.productos]; ps[i]={...ps[i],producto_nombre:e.target.value}; setEditandoApp(x=>({...x,productos:ps})); }} style={{...inputSt,margin:0,fontSize:12}} />
                        <input placeholder="Dosis" type="number" value={p.dosis||""} onChange={e => { const ps=[...editandoApp.productos]; ps[i]={...ps[i],dosis:e.target.value,costo_total:calcularCostoHa(parseFloat(e.target.value)||0,ps[i].unidad,ps[i].precio_usd).toFixed(2)}; setEditandoApp(x=>({...x,productos:ps})); }} style={{...inputSt,margin:0,fontSize:12}} />
                        <input placeholder="Unidad" value={p.unidad||""} onChange={e => { const ps=[...editandoApp.productos]; ps[i]={...ps[i],unidad:e.target.value,costo_total:calcularCostoHa(parseFloat(ps[i].dosis)||0,e.target.value,ps[i].precio_usd).toFixed(2)}; setEditandoApp(x=>({...x,productos:ps})); }} style={{...inputSt,margin:0,fontSize:12}} />
                        <input placeholder="USD/u" type="number" value={p.precio_usd||""} onChange={e => { const ps=[...editandoApp.productos]; ps[i]={...ps[i],precio_usd:e.target.value,costo_total:calcularCostoHa(parseFloat(ps[i].dosis)||0,ps[i].unidad,e.target.value).toFixed(2)}; setEditandoApp(x=>({...x,productos:ps})); }} style={{...inputSt,margin:0,fontSize:12}} />
                        <div style={{fontSize:11,color:C.accent,fontFamily:F,fontWeight:700,alignSelf:"center"}}>USD {p.costo_total||"—"}/ha</div>
                        <button onClick={() => setEditandoApp(x=>({...x,productos:x.productos.filter((_,idx)=>idx!==i)}))} style={{background:C.dangerLight,border:`1px solid ${C.danger}20`,color:C.danger,cursor:"pointer",borderRadius:7,padding:"6px 10px"}}>✕</button>
                      </div>
                    ))}
                    <button onClick={() => setEditandoApp(x=>({...x,productos:[...(x.productos||[]),{producto_nombre:"",dosis:"",unidad:"l",precio_usd:"",costo_total:""}]}))}
                      style={{background:"none",border:`1px dashed ${C.border}`,borderRadius:8,padding:"6px 14px",color:C.textDim,fontSize:12,cursor:"pointer",marginTop:4}}>+ Agregar producto</button>
                    <div style={{textAlign:"right",marginTop:10,fontSize:13,color:C.accent,fontFamily:F,fontWeight:700}}>
                      Labor: USD {parseFloat(editandoApp.costo_labor_ha)||0}/ha · Insumos: USD {(editandoApp.productos||[]).reduce((s,p)=>s+calcularCostoHa(parseFloat(p.dosis)||0,p.unidad,p.precio_usd),0).toFixed(2)}/ha
                    </div>
                  </div>
                )}

                {aplicaciones.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 48, color: C.muted }}>Sin aplicaciones registradas.</div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead><tr>
                        <th style={{ ...st.th, width: 36, textAlign: "center" }}>
                          <input type="checkbox"
                            checked={selectedAppIds.size === aplicaciones.filter(a => (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)).length && aplicaciones.length > 0}
                            ref={el => { if (el) { const vis = aplicaciones.filter(a => (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)); el.indeterminate = selectedAppIds.size > 0 && selectedAppIds.size < vis.length; } }}
                            onChange={() => { const vis = aplicaciones.filter(a => (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana)); toggleSelectAllApps(vis.map(a => a.id)); }}
                            style={{ cursor: "pointer", width: 15, height: 15, accentColor: C.danger }}
                          />
                        </th>
                        {[["FECHA","fecha"],["EMPRESA","empresa_nombre"],["CAMPO","campo_nombre"],["LOTE","lote_nombre"],["CULTIVO","cultivo"],["TIPO","tipo_aplicacion"],["SUPERFICIE","superficie_ha"],["PRODUCTOS","_productos"],["COSTO TOTAL","_costo"],["",""]].map(([label, col]) => (
                          <th key={label} style={{ ...st.th, cursor: col ? "pointer" : "default", userSelect: "none" }}
                            onClick={() => { if (!col) return; if (sortAppCol === col) setSortAppDir(d => d === "asc" ? "desc" : "asc"); else { setSortAppCol(col); setSortAppDir("asc"); } }}>
                            {label}{col && sortAppCol === col ? (sortAppDir === "asc" ? " ▲" : " ▼") : ""}
                          </th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {(() => {
                          const getVal = (a, col) => {
                            if (col === "_productos") return a.productos?.length || 0;
                            if (col === "_costo") return a.productos?.reduce((s,p) => s + (parseFloat(p.costo_total)||0), 0) || 0;
                            return a[col] || "";
                          };
                          return aplicaciones
                            .filter(a => (filtroEmpresa === "todas" || a.empresa_nombre?.trim() === filtroEmpresa?.trim()) && (filtroCampo === "todos" || a.campo_nombre === filtroCampo) && (filtroLote === "todos" || a.lote_nombre?.includes(filtroLote)) && (filtroCampana === "todas" || getCampanaFecha(a.fecha) === filtroCampana))
                            .sort((a, b) => {
                              const va = getVal(a, sortAppCol), vb = getVal(b, sortAppCol);
                              const cmp = typeof va === "number" ? va - vb : String(va).localeCompare(String(vb));
                              return sortAppDir === "asc" ? cmp : -cmp;
                            })
                            .map((a) => {
                          const isCheckedApp = selectedAppIds.has(a.id);
                          const tieneSinPrecio = (a.productos||[]).some(p => p.dosis && (!p.precio_usd || parseFloat(p.precio_usd) === 0));
                          return (
                          <React.Fragment key={a.id}>
                            <tr
                              onClick={() => { if (selectedAppIds.size === 0) setExpandedApp(expandedApp === a.id ? null : a.id); }}
                              style={{ cursor: "pointer", background: isCheckedApp ? C.dangerLight : tieneSinPrecio ? "#fff5f5" : undefined }}
                            >
                              <td style={{ ...st.td, textAlign: "center" }} onClick={e => { e.stopPropagation(); toggleSelectApp(a.id); }}>
                                <input type="checkbox" checked={isCheckedApp} onChange={() => {}}
                                  style={{ cursor: "pointer", width: 15, height: 15, accentColor: C.danger }} />
                              </td>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12, color: C.textDim }}>{a.fecha}</span></td>
                              <td style={st.td}><span style={{ color: C.textDim, fontSize: 12 }}>{a.empresa_nombre}</span></td>
                              <td style={st.td}><span style={{ color: C.textDim, fontSize: 12 }}>{a.campo_nombre}</span></td>
                              <td style={st.td}><b style={{ color: C.text }}>{a.lote_nombre}</b></td>
                              <td style={st.td}><span style={{ color: C.textDim }}>{a.cultivo}</span></td>
                              <td style={st.td}>
                                <span style={{ fontSize: 12, background: C.mutedBg, padding: "3px 8px", borderRadius: 5, color: C.textDim }}>{a.tipo_aplicacion || "—"}</span>
                                {a.numero_orden && <div style={{ fontSize: 10, color: C.muted, marginTop: 2, fontFamily: F }}>#{a.numero_orden}</div>}
                              </td>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12, color: C.textDim }}>{a.superficie_ha ? `${a.superficie_ha} ha` : "—"}</span></td>
                              <td style={st.td}><span style={{ color: C.textDim, fontSize: 12 }}>{a.productos?.length || 0} prod.</span></td>
                              <td style={st.td}>{(() => {
                                const prods = a.productos || [];
                                const sinPrecio = prods.filter(p => p.dosis && (!p.precio_usd || parseFloat(p.precio_usd) === 0));
                                const costoHa = prods.reduce((s,p) => s + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0);
                                if (sinPrecio.length > 0) {
                                  return (
                                    <span style={{ color: C.danger, fontFamily: F, fontWeight: 700, fontSize: 13 }}>
                                      ⚠ {sinPrecio.length} sin precio
                                    </span>
                                  );
                                }
                                return <span style={{ color: C.accent, fontFamily: F, fontWeight: 700, fontSize: 13 }}>{costoHa > 0 ? `USD ${costoHa.toFixed(2)}/ha` : "—"}</span>;
                              })()}</td>
                              <td style={{ ...st.td, whiteSpace: "nowrap" }} onClick={e => e.stopPropagation()}>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                  <button onClick={e => { e.stopPropagation(); setEditandoApp({ ...a, productos: a.productos || [], costo_labor_ha: a.costo_labor_ha ?? COSTOS_LABOR_DEFAULT[a.tipo_aplicacion] ?? "" }); setExpandedApp(null); }}
                                    style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11, color: C.textDim }}>✏</button>
                              <button onClick={async e => {
                                e.stopPropagation();
                                const tipo = a.tipo_aplicacion || "";
                                let precio = COSTOS_LABOR_DEFAULT[tipo];
                                if (!precio && COSECHAS_PCT[tipo]) precio = parseFloat(precioGranoLabor) * COSECHAS_PCT[tipo] / 100;
                                const input = window.prompt(`Precio labor para ${tipo} (USD/ha):`, precio || "");
                                if (input === null) return;
                                const tok = session?.access_token || SUPABASE_KEY;
                                await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${a.id}`, {
                                  method: 'PATCH',
                                  headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                                  body: JSON.stringify({ costo_labor_ha: parseFloat(input) || null })
                                });
                                fetchAplicaciones();
                              }} title="Valorizar labor"
                                style={{ background: "none", border: `1px solid #8e44ad40`, borderRadius: 6, padding: "3px 8px", cursor: "pointer", fontSize: 11, color: "#8e44ad" }}>🚜</button>
                                  <span style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>{expandedApp === a.id ? "▲" : "▼"}</span>
                                </div>
                              </td>
                            </tr>
                            {expandedApp === a.id && (
                              <tr>
                                <td colSpan={11} style={{ padding: 0, background: C.accentLight, borderBottom: `2px solid ${C.accent}30` }}>
                                  <div style={{ padding: "16px 20px" }}>
                                    {/* Datos clave de la orden */}
                                    {(a.numero_orden || a.contratista || a.diagnostico || a.observaciones) && (
                                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                                        {a.numero_orden && (
                                          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px" }}>
                                            <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>N° Orden</span>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: F }}>#{a.numero_orden}</div>
                                          </div>
                                        )}
                                        {a.contratista && (
                                          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px" }}>
                                            <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Contratista</span>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.contratista}</div>
                                          </div>
                                        )}
                                        {a.cultivo && (
                                          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px" }}>
                                            <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Cultivo</span>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{a.cultivo}</div>
                                          </div>
                                        )}
                                        {a.diagnostico && (
                                          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", maxWidth: 300 }}>
                                            <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Diagnóstico</span>
                                            <div style={{ fontSize: 12, color: C.textDim }}>{a.diagnostico}</div>
                                          </div>
                                        )}
                                        {a.observaciones && (
                                          <div style={{ background: C.warnLight, border: `1px solid ${C.warn}30`, borderRadius: 8, padding: "6px 12px", maxWidth: 400 }}>
                                            <span style={{ fontSize: 10, color: C.warn, textTransform: "uppercase", letterSpacing: 0.5 }}>Observaciones</span>
                                            <div style={{ fontSize: 12, color: C.text }}>{a.observaciones}</div>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    {a.productos?.length > 0 && (
                                      <div style={{ marginBottom: 16 }}>
                                        <div style={{ fontSize: 11, color: C.accent, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 10 }}>🧪 Productos aplicados</div>
                                        {editandoProdsApp === a.id ? (
                                          <div>
                                            {(a.productos || []).map((p, i) => (
                                              <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 110px 80px 80px 90px 90px auto", gap: 6, marginBottom: 6, alignItems: "center" }}>
                                                <input value={p.producto_nombre} onChange={e => { const ps = [...a.productos]; ps[i] = {...ps[i], producto_nombre: e.target.value}; setAplicaciones(prev => prev.map(x => x.id === a.id ? {...x, productos: ps} : x)); }} style={{ ...inputSt, margin: 0, fontSize: 12 }} />
                                                <select value={p.tipo_mb || ""} onChange={e => { const ps = [...a.productos]; ps[i] = {...ps[i], tipo_mb: e.target.value}; setAplicaciones(prev => prev.map(x => x.id === a.id ? {...x, productos: ps} : x)); }} style={{ ...inputSt, margin: 0, fontSize: 11, cursor: "pointer", padding: "4px 6px" }} title="Clasificación para Margen Bruto">
                                                  <option value="">— MB —</option>
                                                  <option value="semilla">🌱 Semilla</option>
                                                  <option value="fertilizante">🧪 Fertilizante</option>
                                                  <option value="agroquimico">🧴 Agroquímico</option>
                                                </select>
                                                <input placeholder="dosis" value={p.dosis} onChange={e => { const ps = [...a.productos]; const d = e.target.value; ps[i] = {...ps[i], dosis: d, costo_total: calcularCostoHa(parseFloat(d)||0, ps[i].unidad, ps[i].precio_usd).toFixed(2)}; setAplicaciones(prev => prev.map(x => x.id === a.id ? {...x, productos: ps} : x)); }} style={{ ...inputSt, margin: 0, fontSize: 12 }} />
                                                <input placeholder="unidad" value={p.unidad} onChange={e => { const ps = [...a.productos]; ps[i] = {...ps[i], unidad: e.target.value, costo_total: calcularCostoHa(parseFloat(ps[i].dosis)||0, e.target.value, ps[i].precio_usd).toFixed(2)}; setAplicaciones(prev => prev.map(x => x.id === a.id ? {...x, productos: ps} : x)); }} style={{ ...inputSt, margin: 0, fontSize: 12 }} />
                                                <input placeholder="USD/u" type="number" value={p.precio_usd} onChange={e => { const ps = [...a.productos]; ps[i] = {...ps[i], precio_usd: e.target.value, costo_total: calcularCostoHa(parseFloat(ps[i].dosis)||0, ps[i].unidad, e.target.value).toFixed(2)}; setAplicaciones(prev => prev.map(x => x.id === a.id ? {...x, productos: ps} : x)); }} style={{ ...inputSt, margin: 0, fontSize: 12 }} />
                                                <div style={{ fontSize: 11, color: C.accent, fontFamily: F, fontWeight: 700 }}>USD {p.costo_total || "—"}/ha</div>
                                              </div>
                                            ))}
                                            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                                              <button onClick={async () => {
                                                const tok = session?.access_token || SUPABASE_KEY;
                                                const costoTotal = a.productos.reduce((s, p) => s + (parseFloat(p.costo_total)||0), 0);
                                                await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${a.id}`, {
                                                  method: 'PATCH',
                                                  headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                                                  body: JSON.stringify({ productos: JSON.stringify(a.productos), costo_total_usd: costoTotal })
                                                });
                                                await fetchAplicaciones();
                                                setEditandoProdsApp(null);
                                              }} style={{ ...st.btnPrimary, fontSize: 12, padding: "5px 14px" }}>✓ Guardar</button>
                                              <button onClick={() => { fetchAplicaciones(); setEditandoProdsApp(null); }} style={{ ...st.btnSecondary, fontSize: 12, padding: "5px 14px" }}>Cancelar</button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            {/* Panel de valorización rápida si hay productos sin precio */}
                                            {tieneSinPrecio && (
                                              <div style={{ background: "#fff8f8", border: `1px solid ${C.danger}30`, borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
                                                <div style={{ fontSize: 12, color: C.danger, fontWeight: 700, marginBottom: 10 }}>⚠ Productos sin valorizar — ingresá el precio directamente:</div>
                                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                                  {(a.productos || []).filter(p => p.dosis && (!p.precio_usd || parseFloat(p.precio_usd) === 0)).map((p, i) => {
                                                    const idx = a.productos.indexOf(p);
                                                    const catMatch = productos.find(cat => cat.nombre.toLowerCase() === p.producto_nombre.toLowerCase());
                                                    return (
                                                      <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 120px 100px auto", gap: 8, alignItems: "center" }}>
                                                        <div>
                                                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.producto_nombre}</div>
                                                          <div style={{ fontSize: 11, color: C.muted }}>{p.dosis} {p.unidad}</div>
                                                        </div>
                                                        {catMatch && (
                                                          <button onClick={async () => {
                                                            const ps = [...a.productos];
                                                            ps[idx] = { ...ps[idx], precio_usd: catMatch.precio_usd, costo_total: calcularCostoHa(parseFloat(ps[idx].dosis)||0, ps[idx].unidad, catMatch.precio_usd).toFixed(2) };
                                                            setAplicaciones(prev => prev.map(x => x.id === a.id ? {...x, productos: ps} : x));
                                                            // Guardar en Supabase inmediatamente
                                                            const tok = session?.access_token || SUPABASE_KEY;
                                                            const costoTotal = ps.reduce((s, p2) => s + (parseFloat(p2.costo_total)||0), 0);
                                                            await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${a.id}`, {
                                                              method: "PATCH",
                                                              headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                                                              body: JSON.stringify({ productos: JSON.stringify(ps), costo_total_usd: costoTotal })
                                                            });
                                                          }} style={{ background: C.accentLight, border: `1px solid ${C.accent}40`, borderRadius: 6, padding: "5px 10px", cursor: "pointer", fontSize: 11, color: C.accent, fontWeight: 600 }}>
                                                            Usar USD {catMatch.precio_usd} del catálogo
                                                          </button>
                                                        )}
                                                        {!catMatch && <div style={{ fontSize: 11, color: C.muted }}>Sin coincidencia en catálogo</div>}
                                                        <input type="number" placeholder="USD/u" defaultValue={p.precio_usd||""}
                                                          onBlur={async e => {
                                                            const val = e.target.value;
                                                            if (!val) return;
                                                            const ps = [...a.productos];
                                                            ps[idx] = { ...ps[idx], precio_usd: val, costo_total: calcularCostoHa(parseFloat(ps[idx].dosis)||0, ps[idx].unidad, val).toFixed(2) };
                                                            setAplicaciones(prev => prev.map(x => x.id === a.id ? {...x, productos: ps} : x));
                                                            // Guardar en Supabase al salir del campo
                                                            const tok = session?.access_token || SUPABASE_KEY;
                                                            const costoTotal = ps.reduce((s, p2) => s + (parseFloat(p2.costo_total)||0), 0);
                                                            await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${a.id}`, {
                                                              method: "PATCH",
                                                              headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                                                              body: JSON.stringify({ productos: JSON.stringify(ps), costo_total_usd: costoTotal })
                                                            });
                                                          }}
                                                          style={{ ...inputSt, margin: 0, fontSize: 13, padding: "6px 10px" }} />
                                                        <button onClick={async () => {
                                                          const tok = session?.access_token || SUPABASE_KEY;
                                                          const ps = a.productos;
                                                          const costoTotal = ps.reduce((s, p2) => s + (parseFloat(p2.costo_total)||0), 0);
                                                          await fetch(`${SUPABASE_URL}/rest/v1/aplicaciones?id=eq.${a.id}`, {
                                                            method: 'PATCH',
                                                            headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                                                            body: JSON.stringify({ productos: JSON.stringify(ps), costo_total_usd: costoTotal })
                                                          });
                                                          fetchAplicaciones();
                                                        }} style={{ ...st.btnPrimary, padding: "5px 12px", fontSize: 12 }}>💾</button>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
                                              {(a.productos || []).map((p, i) => {
                                                const costoHa = p.dosis && p.precio_usd ? calcularCostoHa(parseFloat(p.dosis), p.unidad, p.precio_usd).toFixed(2) : null;
                                                const sinP = p.dosis && (!p.precio_usd || parseFloat(p.precio_usd) === 0);
                                                return (
                                                  <div key={i} style={{ background: sinP ? "#fff8f8" : C.surface, border: `1px solid ${sinP ? C.danger+"40" : C.border}`, borderRadius: 10, padding: "10px 14px" }}>
                                                    <div style={{ fontFamily: SANS, fontSize: 13, fontWeight: 700, color: sinP ? C.danger : C.text, marginBottom: 4 }}>{p.producto_nombre}{sinP ? " ⚠" : ""}</div>
                                                    {p.principio_activo && <div style={{ fontSize: 10, color: C.muted, marginBottom: 3, fontStyle: "italic" }}>{p.principio_activo}</div>}
                                                    <div style={{ fontFamily: F, fontSize: 12, color: C.textDim }}>
                                                      {p.dosis} {p.unidad}
                                                      {p.precio_usd ? " · USD " + p.precio_usd + "/u" : " · sin precio"}
                                                      {costoHa ? " = USD " + costoHa + "/ha" : ""}
                                                    </div>
                                                  </div>
                                                );
                                              })}
                                            </div>
                                            <button onClick={() => setEditandoProdsApp(a.id)} style={{ ...st.btnSecondary, fontSize: 11, padding: "4px 12px", marginTop: 8 }}>✏ Editar productos</button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                    <div style={{ fontSize: 11, color: C.accent, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>🔍 Seguimiento Post-Aplicación — {a.lote_nombre}</div>
                                    <SeguimientoAplicacion aplicacion={a} monitoreos={monitoreos} />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ); });
                        })()}
                      </tbody>
                    </table>
                  </div>
                )}
                </div>)}
              </div>
              );
            })()}

            {/* ── MARGEN BRUTO ── */}
            {tab === "margen" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div>
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <h2 style={st.sectionTitle}>💰 Margen Bruto</h2>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <ExportButtons
                      onExcel={() => exportCSV(margenes.filter(m => filtroCampana === "todas" || (m.campana||"").trim() === filtroCampana.trim() || (!m.campana && getCampanaFecha(m.created_at) === filtroCampana)), [
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
                        { label: "Insumos USD",   get: m => m.costo_agroquimicos_usd },
                        { label: "Arrendamiento USD",  get: m => m.costo_arrendamiento_usd },
                        { label: "Flete USD",          get: m => m.costo_flete_usd },
                        { label: "Seg./Otros USD",      get: m => m.costo_otros_usd },
                        { label: "Margen bruto USD",   get: m => parseFloat(m.margen_bruto_usd || 0).toFixed(2) },
                        { label: "MB/ha USD",          get: m => m.hectareas > 0 ? (parseFloat(m.margen_bruto_usd || 0) / parseFloat(m.hectareas)).toFixed(2) : "" },
                        { label: "MB %",               get: m => m.margen_bruto_pct ? parseFloat(m.margen_bruto_pct).toFixed(1) : "" },
                      ], `margen_bruto_${new Date().toISOString().split("T")[0]}.csv`)}
                      onPDF={() => printTable("Margen Bruto por Lote", `
                        <table>
                          <thead><tr><th>Campaña</th><th>Empresa</th><th>Lote</th><th>Cultivo</th><th>Ha</th><th>qq/ha</th><th>Ingreso Bruto</th><th>Costos Totales</th><th>Margen Bruto</th><th>MB/ha</th><th>MB%</th></tr></thead>
                          <tbody>${margenes.filter(m => (filtroCampana === "todas" || (m.campana||"").trim() === filtroCampana.trim() || (!m.campana && getCampanaFecha(m.created_at) === filtroCampana)) && (filtroEmpresa === "todas" || m.empresa_nombre === filtroEmpresa) && (filtroCampo === "todos" || m.campo_nombre === filtroCampo) && (filtroLote === "todos" || m.lote_nombre?.includes(filtroLote))).map(m => {
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
                    {selectedMargenes.length > 0 && (
                      <button onClick={deleteSelectedMargenes}
                        style={{ ...st.btnPrimary, background: C.danger }}>
                        🗑 Eliminar {selectedMargenes.length} seleccionado{selectedMargenes.length > 1 ? "s" : ""}
                      </button>
                    )}
                  </div>
                </div>

                {/* ── DASHBOARD MB ── */}
                {(() => {
                  const mFiltrados = margenes.filter(m => (filtroCampana === "todas" || (m.campana||"").trim() === filtroCampana.trim() || (!m.campana && getCampanaFecha(m.created_at) === filtroCampana)) && (filtroEmpresa === "todas" || m.empresa_nombre === filtroEmpresa) && (filtroCampo === "todos" || m.campo_nombre === filtroCampo) && (filtroLote === "todos" || m.lote_nombre?.includes(filtroLote)));
                  if (mFiltrados.length === 0) return null;
                  const mbTotal = mFiltrados.reduce((s,m) => s + parseFloat(m.margen_bruto_usd||0), 0);
                  const ingTotal = mFiltrados.reduce((s,m) => s + parseFloat(m.ingreso_bruto_usd||0), 0);
                  const costosTotal = mFiltrados.reduce((s,m) => s + ['costo_semilla_usd','costo_labores_usd','costo_agroquimicos_usd','costo_fertilizantes_usd','costo_cosecha_usd','costo_gerenciamiento_usd','costo_arrendamiento_usd','costo_otros_usd'].reduce((s2,k) => s2+(parseFloat(m[k])||0),0), 0);
                  const haTotal = mFiltrados.reduce((s,m) => s + parseFloat(m.hectareas||0), 0);
                  const mbHaProm = haTotal > 0 ? mbTotal / haTotal : 0;
                  const mbPct = ingTotal > 0 ? mbTotal / ingTotal * 100 : 0;
                  // Agrupar por empresa
                  const porEmpresa = {};
                  mFiltrados.forEach(m => {
                    const k = m.empresa_nombre || "Sin empresa";
                    if (!porEmpresa[k]) porEmpresa[k] = { mb: 0, ing: 0, costos: 0, ha: 0, lotes: 0 };
                    porEmpresa[k].mb += parseFloat(m.margen_bruto_usd||0);
                    porEmpresa[k].ing += parseFloat(m.ingreso_bruto_usd||0);
                    porEmpresa[k].costos += ['costo_semilla_usd','costo_labores_usd','costo_agroquimicos_usd','costo_fertilizantes_usd','costo_cosecha_usd','costo_gerenciamiento_usd','costo_arrendamiento_usd','costo_otros_usd'].reduce((s2,k2) => s2+(parseFloat(m[k2])||0),0);
                    porEmpresa[k].ha += parseFloat(m.hectareas||0);
                    porEmpresa[k].lotes += 1;
                  });
                  const empresasArr = Object.entries(porEmpresa).sort((a,b) => b[1].mb - a[1].mb);
                  const maxMb = Math.max(...empresasArr.map(([,v]) => Math.abs(v.mb)), 1);
                  return (
                    <div style={{ marginBottom: 20 }}>
                      {/* Tarjetas resumen */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 12, marginBottom: 16 }}>
                        {[
                          { label: "MB TOTAL", val: `USD ${mbTotal >= 0 ? "+" : ""}${Math.round(mbTotal).toLocaleString("es-AR")}`, color: mbTotal >= 0 ? C.accent : C.danger, sub: `${mFiltrados.length} registros` },
                          { label: "MB PROMEDIO/ha", val: `USD ${mbHaProm >= 0 ? "+" : ""}${mbHaProm.toFixed(0)}`, color: mbHaProm >= 0 ? C.accent : C.danger, sub: `${Math.round(haTotal).toLocaleString("es-AR")} ha totales` },
                          { label: "MB %", val: `${mbPct >= 0 ? "+" : ""}${mbPct.toFixed(1)}%`, color: mbPct >= 0 ? C.accent : C.danger, sub: "sobre ingreso bruto" },
                          { label: "INGRESO TOTAL", val: `USD ${Math.round(ingTotal).toLocaleString("es-AR")}`, color: C.accent, sub: `${(ingTotal/haTotal||0).toFixed(0)} USD/ha` },
                          { label: "COSTOS TOTALES", val: `USD ${Math.round(costosTotal).toLocaleString("es-AR")}`, color: C.warn, sub: `${(costosTotal/haTotal||0).toFixed(0)} USD/ha` },
                        ].map(({ label, val, color, sub }) => (
                          <div key={label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderTop: `3px solid ${color}`, borderRadius: 10, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                            <div style={{ fontSize: 10, color: C.muted, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
                            <div style={{ fontSize: 22, fontWeight: 700, color, fontFamily: F, marginBottom: 4 }}>{val}</div>
                            <div style={{ fontSize: 11, color: C.muted }}>{sub}</div>
                          </div>
                        ))}
                      </div>
                      {/* Barras por empresa */}
                      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 20px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
                        <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Margen Bruto por Empresa</div>
                        {empresasArr.map(([empresa, v]) => {
                          const pct = Math.abs(v.mb) / maxMb * 100;
                          const pos = v.mb >= 0;
                          const mbHaEmp = v.ha > 0 ? v.mb / v.ha : 0;
                          const mbPctEmp = v.ing > 0 ? v.mb / v.ing * 100 : 0;
                          return (
                            <div key={empresa} style={{ marginBottom: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{empresa}</span>
                                  <span style={{ fontSize: 11, color: C.muted }}>{v.lotes} registro{v.lotes !== 1 ? "s" : ""} · {Math.round(v.ha).toLocaleString("es-AR")} ha</span>
                                </div>
                                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                                  <span style={{ fontSize: 11, color: C.muted, fontFamily: F }}>{mbHaEmp.toFixed(0)} USD/ha</span>
                                  <span style={{ fontSize: 11, color: pos ? C.accent : C.danger, fontFamily: F }}>{mbPctEmp.toFixed(1)}%</span>
                                  <span style={{ fontSize: 14, fontWeight: 700, color: pos ? C.accent : C.danger, fontFamily: F, minWidth: 100, textAlign: "right" }}>
                                    {pos ? "+" : ""}USD {Math.round(v.mb).toLocaleString("es-AR")}
                                  </span>
                                </div>
                              </div>
                              <div style={{ height: 10, background: C.mutedBg, borderRadius: 5, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${pct}%`, background: pos ? C.accent : C.danger, borderRadius: 5, transition: "width 0.6s ease" }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {showFormMargen && (() => {
                  // ── FUENTE 1: Aplicaciones (agroquímicos, labores, fertilizantes) ──
                  const appsLote = aplicaciones.filter(a =>
                    (nivelMB === "campo"
                      ? (!newMargen.campo_nombre || a.campo_nombre === newMargen.campo_nombre)
                      : nivelMB === "multi"
                      ? (selectedLotesMB.length > 0 ? selectedLotesMB.includes(a.lote_nombre) : false) &&
                        (selectedCamposMB.length > 0 ? selectedCamposMB.includes(a.campo_nombre) : (!newMargen.campo_nombre || a.campo_nombre === newMargen.campo_nombre))
                      : a.lote_nombre === newMargen.lote_nombre) &&
                    (!newMargen.empresa_nombre || a.empresa_nombre?.trim() === newMargen.empresa_nombre?.trim()) &&
                    (!newMargen.campana || getCampanaFecha(a.fecha) === newMargen.campana)
                  );

                  // ── FUENTE 2: Estructura — lotes_semillas ──
                  // Semilla por lote desde estructura_lotes (semillasData no está disponible aquí,
                  // pero podemos estimar desde costos_produccion si está cargado en la sesión)
                  // Usamos el dato que el usuario cargó en TabEstructura → semillas
                  const lotesFiltroEst = nivelMB === "lote" ? [newMargen.lote_nombre] :
                                         nivelMB === "multi" ? selectedLotesMB :
                                         [...new Set(estructuraLotes.filter(l =>
                                           (!newMargen.empresa_nombre || l.empresa_nombre?.trim() === newMargen.empresa_nombre?.trim()) &&
                                           (!newMargen.campo_nombre || l.campo_nombre === newMargen.campo_nombre)
                                         ).map(l => String(l.lote_nombre)))];

                  // ── FUENTE 3: costos_produccion — semilla, curasemilla, labor siembra, labor cosecha ──
                  // Buscar el registro de costos para el cultivo de este lote en esta campaña
                  const cultivoParaCostos = newMargen.cultivo || "";
                  const buscarCP = (cultivo) => {
                    if (!cultivo) return null;
                    const norm = s => s.replace(/\s+(1ra|2da|3ra|Hab)/i,"").trim();
                    // Buscar en aplicaciones: no tenemos costos_produccion aquí directamente
                    // Fallback: usar planCultivos para labor cosecha estimada
                    return null;
                  };

                  // ── FUENTE 4: Planificación — cultivo por lote ──
                  const cultivoDesdeplan = (() => {
                    if (newMargen.cultivo) return newMargen.cultivo;
                    // Buscar en planificacion (tabla planificacion por lote)
                    const planLote = planificacion?.find(p =>
                      (!newMargen.empresa_nombre || p.empresa_nombre?.trim() === newMargen.empresa_nombre?.trim()) &&
                      (!newMargen.campo_nombre || p.campo_nombre === newMargen.campo_nombre) &&
                      (nivelMB !== "lote" || String(p.lote_nombre) === String(newMargen.lote_nombre)) &&
                      (!newMargen.campana || p.campana === newMargen.campana)
                    );
                    if (planLote?.cultivo) return planLote.cultivo;
                    // Fallback: cultivo más frecuente en las apps del lote
                    const freq = {};
                    appsLote.filter(a => a.cultivo && !["Barbecho Químico","BARBECHO QUÍMICO","Cultivo de Servicio"].includes(a.cultivo))
                      .forEach(a => { freq[a.cultivo] = (freq[a.cultivo]||0)+1; });
                    return Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0] || "";
                  })();

                  // Ha: desde estructura_lotes (fuente de verdad) con fallback a aplicaciones
                  const haByLote = {};
                  // Primero desde estructura_lotes
                  estructuraLotes.filter(l =>
                    (!newMargen.empresa_nombre || l.empresa_nombre?.trim() === newMargen.empresa_nombre?.trim()) &&
                    (!newMargen.campo_nombre || l.campo_nombre === newMargen.campo_nombre)
                  ).forEach(l => { haByLote[String(l.lote_nombre)] = parseFloat(l.hectareas)||0; });
                  // Completar con apps si faltan
                  appsLote.filter(a => a.superficie_ha && a.lote_nombre).forEach(a => {
                    const ha = parseFloat(a.superficie_ha)||0;
                    if (!haByLote[a.lote_nombre] || ha > haByLote[a.lote_nombre]) haByLote[a.lote_nombre] = ha;
                  });

                  const haSumaLotes = nivelMB === "lote"
                    ? (haByLote[newMargen.lote_nombre] || 0)
                    : nivelMB === "multi"
                    ? selectedLotesMB.reduce((s,l) => s+(haByLote[l]||0), 0)
                    : Object.values(haByLote).reduce((s,h) => s+h, 0);

                  const haTotal = !newMargen.hectareas ? haSumaLotes : parseFloat(newMargen.hectareas) || 0;
                  const lotesEnApps = [...new Set(appsLote.map(a => a.lote_nombre).filter(Boolean))];
                  const haTotalReal = parseFloat(newMargen.hectareas) || haTotal || 1;

                  const costoAgroTotal = lotesEnApps.length > 0
                    ? lotesEnApps.reduce((s, lote) => {
                        const appsL = appsLote.filter(a => a.lote_nombre === lote);
                        const haL = parseFloat([...appsL].sort((a,b) => (parseFloat(b.superficie_ha)||0)-(parseFloat(a.superficie_ha)||0))[0]?.superficie_ha) || 1;
                        const costoL = appsL.reduce((cs, a) => cs + (a.productos||[]).reduce((ps, p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0), 0);
                        return s + costoL * haL;
                      }, 0)
                    : appsLote.reduce((s, a) => {
                        const haApp = parseFloat(a.superficie_ha) || 1;
                        return s + (a.productos||[]).reduce((ps, p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd), 0) * haApp;
                      }, 0);
                  const costoAgroHaAuto = haTotalReal > 0 ? costoAgroTotal / haTotalReal : 0;
                  const costoAgroHa = newMargen.costo_agroquimicos_ha !== ""
                    ? parseFloat(newMargen.costo_agroquimicos_ha) || 0
                    : costoAgroHaAuto;
                  // Labores: solo pulverizaciones (terrestre, aérea, drone)
                  const TIPOS_PULV = ["Pulverización Terrestre","Terrestre","TERRESTRE","Pulverización Aérea","Aérea","AEREA","Pulverización Drone","Drone","DRONE"];
                  const TIPOS_SIEMBRA = ["Siembra","SIEMBRA","Siembra Gruesa","Siembra Fina","Siembra Aérea","SIEMBRA GRUESA","SIEMBRA FINA","Labor - Siembra Gruesa","Labor - Siembra Fina","Labor - Siembra Aérea"];
                  const TIPOS_COSECHA = ["Cosecha","COSECHA","Labor - Cosecha","Trilla"];
                  // Labores ponderadas por lote
                  const costoLabTotal = lotesEnApps.length > 0
                    ? lotesEnApps.reduce((s, lote) => {
                        const appsL = appsLote.filter(a => a.lote_nombre === lote && TIPOS_PULV.includes(a.tipo_aplicacion));
                        const haL = parseFloat([...appsLote.filter(a=>a.lote_nombre===lote)].sort((a,b)=>(parseFloat(b.superficie_ha)||0)-(parseFloat(a.superficie_ha)||0))[0]?.superficie_ha) || 1;
                        return s + appsL.reduce((cs,a) => cs + (parseFloat(a.costo_labor_ha)||COSTOS_LABOR_DEFAULT[a.tipo_aplicacion]||0)*haL, 0);
                      }, 0)
                    : appsLote.filter(a => TIPOS_PULV.includes(a.tipo_aplicacion)).reduce((s, a) => s + (parseFloat(a.costo_labor_ha)||COSTOS_LABOR_DEFAULT[a.tipo_aplicacion]||0)*(parseFloat(a.superficie_ha)||1), 0);
                  const costoLabHaAuto = haTotalReal > 0 ? costoLabTotal / haTotalReal : 0;
                  const costoLabHa = newMargen.costo_labores_ha !== ""
                    ? parseFloat(newMargen.costo_labores_ha) || 0
                    : costoLabHaAuto;
                  // Semilla desde lotes_semillas (estructura) — fuente de verdad
                  // Filtramos por empresa + campo/lote + campaña
                  const semillasLote = (estructuraLotes.length > 0 || true) ? (() => {
                    // Buscar en semillasData si está cargado, sino usar planCultivos como fallback
                    // Como semillasData solo se carga en TabEstructura, hacemos fetch inline o usamos costos_produccion
                    // Por ahora: buscar en aplicaciones de tipo siembra el costo de semilla (prods sin labor)
                    const lotesFiltro = nivelMB === "lote" ? [newMargen.lote_nombre] :
                                        nivelMB === "multi" ? selectedLotesMB :
                                        lotesEnApps;
                    return lotesFiltro;
                  })() : [];

                  // Semilla: desde apps de siembra (productos sin labor) — más preciso que antes
                  const costoSemTotal = (() => {
                    const lotesFiltro = nivelMB === "lote" ? [newMargen.lote_nombre] :
                                        nivelMB === "multi" ? selectedLotesMB :
                                        lotesEnApps;
                    if (lotesFiltro.length > 0) {
                      return lotesFiltro.reduce((s, lote) => {
                        const appsL = appsLote.filter(a => a.lote_nombre === lote && TIPOS_SIEMBRA.includes(a.tipo_aplicacion));
                        const haL = parseFloat([...appsLote.filter(a=>a.lote_nombre===lote)].sort((a,b)=>(parseFloat(b.superficie_ha)||0)-(parseFloat(a.superficie_ha)||0))[0]?.superficie_ha) || 1;
                        return s + appsL.reduce((cs,a) => {
                          // Solo productos de semilla (excluir fertilizantes y labor)
                          const prods = (a.productos||[]).filter(p => p.tipo_mb !== "fertilizante").reduce((ps,p) => ps+calcularCostoHa(parseFloat(p.dosis)||0,p.unidad,p.precio_usd),0);
                          return cs + prods*haL;
                        }, 0);
                      }, 0);
                    }
                    return appsLote.filter(a => TIPOS_SIEMBRA.includes(a.tipo_aplicacion)).reduce((s, a) => {
                      const haApp = parseFloat(a.superficie_ha) || 1;
                      const prods = (a.productos||[]).filter(p => p.tipo_mb !== "fertilizante").reduce((ps,p) => ps+calcularCostoHa(parseFloat(p.dosis)||0,p.unidad,p.precio_usd),0);
                      return s + prods*haApp;
                    }, 0);
                  })();
                  // Semilla desde lotes_semillas (estructura) — tiene prioridad sobre apps
                  const semHaDesdeEstructura = (() => {
                    const lotes = nivelMB === "lote" ? [newMargen.lote_nombre] :
                                  nivelMB === "multi" ? selectedLotesMB :
                                  lotesFiltroEst;
                    const semLotes = mbSemillas.filter(s =>
                      (!newMargen.campo_nombre || s.campo_nombre === newMargen.campo_nombre) &&
                      (lotes.length === 0 || lotes.includes(String(s.lote_nombre)))
                    );
                    if (semLotes.length === 0) return 0;
                    // Ponderar por ha del lote
                    let totalCosto = 0, totalHa = 0;
                    semLotes.forEach(s => {
                      const ha = haByLote[String(s.lote_nombre)] || parseFloat(s.hectareas_lote)||0;
                      const costo = parseFloat(s.semilla_ha)||0;
                      const pct = parseFloat(s.pct_lote)||100;
                      totalCosto += costo * pct/100 * ha;
                      totalHa += ha;
                    });
                    return totalHa > 0 ? totalCosto / totalHa : 0;
                  })();

                  // Curasemilla y labor siembra desde costos_produccion
                  const cpCultivo = (() => {
                    if (!cultivoDesdeplan && !newMargen.cultivo) return null;
                    const cult = newMargen.cultivo || cultivoDesdeplan;
                    const norm = s => s.replace(/\s+(1ra|2da|3ra|Hab)/i,"").trim();
                    return mbCostosProduccion.find(c => c.cultivo === cult) ||
                           mbCostosProduccion.find(c => norm(c.cultivo) === norm(cult)) ||
                           mbCostosProduccion.find(c => c.cultivo.split(" ")[0] === cult.split(" ")[0]) ||
                           null;
                  })();
                  const curaHaAuto   = parseFloat(cpCultivo?.curasemilla_ha)  || 0;
                  const lsiemHaAuto  = parseFloat(cpCultivo?.labor_siembra_ha) || 0;
                  const lcosHaAuto   = parseFloat(cpCultivo?.labor_cosecha_ha) || 0;

                  const costoSemHaAuto = semHaDesdeEstructura > 0 ? semHaDesdeEstructura : (haTotalReal > 0 ? costoSemTotal / haTotalReal : 0);

                  // Fertilizante auto: productos marcados como tipo_mb = "fertilizante" en cualquier orden
                  const costoFertTotal = lotesEnApps.length > 0
                    ? lotesEnApps.reduce((s, lote) => {
                        const appsL = appsLote.filter(a => a.lote_nombre === lote);
                        const haL = parseFloat([...appsLote.filter(a=>a.lote_nombre===lote)].sort((a,b)=>(parseFloat(b.superficie_ha)||0)-(parseFloat(a.superficie_ha)||0))[0]?.superficie_ha) || 1;
                        return s + appsL.reduce((cs,a) => cs + (a.productos||[]).filter(p => p.tipo_mb === "fertilizante").reduce((ps,p) => ps+calcularCostoHa(parseFloat(p.dosis)||0,p.unidad,p.precio_usd),0)*haL, 0);
                      }, 0)
                    : appsLote.reduce((s, a) => {
                        const haApp = parseFloat(a.superficie_ha) || 1;
                        return s + (a.productos||[]).filter(p => p.tipo_mb === "fertilizante").reduce((ps,p) => ps+calcularCostoHa(parseFloat(p.dosis)||0,p.unidad,p.precio_usd),0)*haApp;
                      }, 0);
                  const costoFertHaAuto = haTotalReal > 0 ? costoFertTotal / haTotalReal : 0;
                  // Cosecha auto: labor de cosecha
                  // Cosecha ponderada por lote
                  const costoCosTotal = lotesEnApps.length > 0
                    ? lotesEnApps.reduce((s, lote) => {
                        const appsL = appsLote.filter(a => a.lote_nombre === lote && TIPOS_COSECHA.includes(a.tipo_aplicacion));
                        const haL = parseFloat([...appsLote.filter(a=>a.lote_nombre===lote)].sort((a,b)=>(parseFloat(b.superficie_ha)||0)-(parseFloat(a.superficie_ha)||0))[0]?.superficie_ha) || 1;
                        return s + appsL.reduce((cs,a) => cs + (parseFloat(a.costo_labor_ha)||COSTOS_LABOR_DEFAULT[a.tipo_aplicacion]||0)*haL, 0);
                      }, 0)
                    : appsLote.filter(a => TIPOS_COSECHA.includes(a.tipo_aplicacion)).reduce((s,a) => s+(parseFloat(a.costo_labor_ha)||COSTOS_LABOR_DEFAULT[a.tipo_aplicacion]||0)*(parseFloat(a.superficie_ha)||1), 0);
                  const costoCosHaAuto = haTotalReal > 0 ? costoCosTotal / haTotalReal : 0;
                  const costoFertHaFinal = newMargen.costo_fertilizantes_ha !== "" ? parseFloat(newMargen.costo_fertilizantes_ha)||0 : costoFertHaAuto;
                  const r = calcMargen({...newMargen,
                    costo_labores_ha: newMargen.costo_labores_ha !== "" ? newMargen.costo_labores_ha : String(costoLabHaAuto + lsiemHaAuto),
                    costo_semilla_ha: newMargen.costo_semilla_ha !== "" ? newMargen.costo_semilla_ha : String(costoSemHaAuto + curaHaAuto),
                    costo_cosecha_ha: newMargen.costo_cosecha_ha !== "" ? newMargen.costo_cosecha_ha : String(costoCosHaAuto || lcosHaAuto),
                    costo_fertilizantes_ha: costoFertHaFinal.toString(),
                  }, costoAgroHa);

                  const secTitle = (t) => (
                    <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, margin: "18px 0 10px", fontFamily: F, textTransform: "uppercase", fontWeight: 600, borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>{t}</div>
                  );
                  const inp = (label, key, opts = {}) => (
                    <div key={key}>
                      <label style={labelSt}>{label}</label>
                      <input type={opts.text ? "text" : "number"} value={newMargen[key]}
                        onChange={e => setNewMargen(p => ({ ...p, [key]: e.target.value }))} style={inputSt} placeholder={opts.ph || ""} />
                    </div>
                  );

                  return (
                    <div style={{ ...st.card, marginBottom: 20, border: `1px solid ${C.accent}30`, animation: "slideDown 0.2s ease" }}>
                      <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: 4, fontFamily: F, textTransform: "uppercase", fontWeight: 600 }}>Nuevo Cálculo de Margen Bruto</div>

                      {/* Identificación */}
                      {secTitle("Identificación")}
                      {/* Nivel de agrupación */}
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 11, color: C.muted, alignSelf: "center" }}>Calcular por:</span>
                        {[["lote","Lote"],["multi","Múltiples lotes"],["campo","Campo completo"]].map(([val,label]) => (
                          <button key={val} onClick={() => { setNivelMB(val); setSelectedLotesMB([]); setSelectedCamposMB([]); setNewMargen(p => ({ ...p, campo_nombre: "", lote_nombre: val === "campo" ? "" : p.lote_nombre })); }}
                            style={{ padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${nivelMB === val ? C.accent : C.border}`,
                              background: nivelMB === val ? C.accentLight : C.surface,
                              color: nivelMB === val ? C.accent : C.textDim, cursor: "pointer", fontSize: 12, fontWeight: nivelMB === val ? 700 : 400 }}>
                            {label}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                        {/* Empresa selector */}
                        <div>
                          <label style={labelSt}>Empresa</label>
                          <select value={newMargen.empresa_nombre}
                            onChange={e => setNewMargen(p => ({ ...p, empresa_nombre: e.target.value, campo_nombre: "", lote_nombre: "" }))}
                            style={{ ...inputSt, cursor: "pointer" }}>
                            <option value="">Seleccionar...</option>
                            {[...new Set(aplicaciones.map(a => a.empresa_nombre).filter(Boolean))].sort().map(e => (
                              <option key={e} value={e}>{e}</option>
                            ))}
                          </select>
                        </div>
                        {/* Campo selector — checkboxes en modo multi, select en otros */}
                        <div>
                          <label style={labelSt}>Campo{nivelMB === "multi" && selectedCamposMB.length > 0 ? ` (${selectedCamposMB.length} seleccionados)` : ""}</label>
                          {nivelMB === "multi" ? (
                            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", background: C.surface, maxHeight: 120, overflowY: "auto" }}>
                              {[...new Set(aplicaciones.filter(a => !newMargen.empresa_nombre || a.empresa_nombre === newMargen.empresa_nombre).map(a => a.campo_nombre).filter(Boolean))].sort().map(c => (
                                <label key={c} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", cursor: "pointer", fontSize: 13 }}>
                                  <input type="checkbox" checked={selectedCamposMB.includes(c)}
                                    onChange={e => {
                                      setSelectedCamposMB(prev => e.target.checked ? [...prev, c] : prev.filter(x => x !== c));
                                      setSelectedLotesMB([]);
                                    }}
                                    style={{ cursor: "pointer", accentColor: C.accent }} />
                                  <span style={{ fontWeight: selectedCamposMB.includes(c) ? 700 : 400, color: selectedCamposMB.includes(c) ? C.accent : C.textDim }}>{c}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <select value={newMargen.campo_nombre}
                              onChange={e => setNewMargen(p => ({ ...p, campo_nombre: e.target.value, lote_nombre: "" }))}
                              style={{ ...inputSt, cursor: "pointer" }}>
                              <option value="">Seleccionar...</option>
                              {[...new Set(aplicaciones.filter(a => !newMargen.empresa_nombre || a.empresa_nombre === newMargen.empresa_nombre).map(a => a.campo_nombre).filter(Boolean))].sort().map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          )}
                        </div>
                        {/* Lote selector */}
                        {nivelMB === "lote" ? (
                          <div>
                            <label style={labelSt}>Lote</label>
                            <select value={newMargen.lote_nombre}
                              onChange={e => {
                                const lote = e.target.value;
                                const appLote = aplicaciones.find(a => a.lote_nombre === lote && a.superficie_ha);
                                const estrLote = estructuraLotes.find(el => String(el.lote_nombre) === String(lote) && (!newMargen.empresa_nombre || el.empresa_nombre?.trim() === newMargen.empresa_nombre?.trim()) && (!newMargen.campo_nombre || el.campo_nombre === newMargen.campo_nombre));
                                const haAuto = estrLote?.hectareas ? String(estrLote.hectareas) : (appLote?.superficie_ha || "");
                                const tenencia = (estrLote?.tenencia || "").toUpperCase();
                                let modalidadAuto = "propio", arrQqAuto = "", aparPctAuto = "";
                                if (tenencia && tenencia !== "PROPIO") {
                                  if (estrLote?.alquiler_tipo === "pct_cultivo") { modalidadAuto = "aparceria"; aparPctAuto = String(estrLote?.alquiler_pct || ""); }
                                  else { modalidadAuto = "arrendamiento"; arrQqAuto = String(estrLote?.alquiler_qq_ha || ""); }
                                }
                                setNewMargen(p => ({ ...p, lote_nombre: lote, hectareas: haAuto || p.hectareas, modalidad_arr: estrLote ? modalidadAuto : p.modalidad_arr, arr_qq_soja: arrQqAuto || p.arr_qq_soja, apar_pct: aparPctAuto || p.apar_pct }));
                              }}
                              style={{ ...inputSt, cursor: "pointer" }}>
                              <option value="">Seleccionar...</option>
                              {[...new Set(aplicaciones.filter(a =>
                                (!newMargen.empresa_nombre || a.empresa_nombre === newMargen.empresa_nombre) &&
                                (!newMargen.campo_nombre || a.campo_nombre === newMargen.campo_nombre)
                              ).map(a => a.lote_nombre).filter(Boolean))].sort().map(l => (
                                <option key={l} value={l}>{l}</option>
                              ))}
                            </select>
                          </div>
                        ) : nivelMB === "campo" ? (
                          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
                            <span style={{ fontSize: 11, color: C.accent }}>Suma todos los lotes del campo</span>
                          </div>
                        ) : (
                          <div style={{ gridColumn: "span 1" }}>
                            <label style={labelSt}>Lotes ({selectedLotesMB.length} seleccionados)</label>
                            <div style={{ border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", maxHeight: 160, overflowY: "auto", background: C.surface }}>
                              {[...new Set(aplicaciones.filter(a =>
                                (!newMargen.empresa_nombre || a.empresa_nombre === newMargen.empresa_nombre) &&
                                (selectedCamposMB.length > 0 ? selectedCamposMB.includes(a.campo_nombre) : (!newMargen.campo_nombre || a.campo_nombre === newMargen.campo_nombre))
                              ).map(a => a.lote_nombre).filter(Boolean))].sort().map(l => (
                                <label key={l} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", cursor: "pointer", fontSize: 13 }}>
                                  <input type="checkbox" checked={selectedLotesMB.includes(l)}
                                    onChange={e => setSelectedLotesMB(prev => e.target.checked ? [...prev, l] : prev.filter(x => x !== l))}
                                    style={{ cursor: "pointer", accentColor: C.accent }} />
                                  {l}
                                </label>
                              ))}
                            </div>
                            <button onClick={() => {
                              const todos = [...new Set(aplicaciones.filter(a =>
                                (!newMargen.empresa_nombre || a.empresa_nombre === newMargen.empresa_nombre) &&
                                (selectedCamposMB.length > 0 ? selectedCamposMB.includes(a.campo_nombre) : (!newMargen.campo_nombre || a.campo_nombre === newMargen.campo_nombre))
                              ).map(a => a.lote_nombre).filter(Boolean))];
                              setSelectedLotesMB(prev => prev.length === todos.length ? [] : todos);
                            }} style={{ ...st.btnSecondary, fontSize: 11, padding: "3px 8px", marginTop: 4 }}>
                              Todos / Ninguno
                            </button>
                          </div>
                        )}
                        <div>
                          <label style={labelSt}>
                            Cultivo
                            {cultivoDesdeplan && !newMargen.cultivo && <span style={{color:C.accent,fontSize:10,marginLeft:6}}>→ {cultivoDesdeplan} (auto)</span>}
                          </label>
                          <select value={newMargen.cultivo || cultivoDesdeplan} onChange={e => setNewMargen(p => ({ ...p, cultivo: e.target.value }))} style={{ ...inputSt, cursor: "pointer" }}>
                            <option value="">— elegir —</option>
                            {(() => {
                              const cultivosPlan = [...new Set((planificacion||[])
                                .filter(p =>
                                  (!newMargen.empresa_nombre || p.empresa_nombre?.trim() === newMargen.empresa_nombre?.trim()) &&
                                  (!newMargen.campana || p.campana === newMargen.campana))
                                .map(p => p.cultivo).filter(Boolean))];
                              const cultivosFijos = ["Soja 1ra","Soja 2da","Soja 3ra","Maíz","Maíz 2da","Vc-Maíz","Cs-Maíz","Trigo","Trigo/Soja 2da","Cebada","Girasol","Sorgo","Algodón","Moha/Soja","Ce-Soja","Maíz HAB","Vicia/Maíz","Otro"];
                              const todos = [...new Set([...cultivosPlan, ...cultivosFijos])];
                              return todos.map(c => <option key={c} value={c}>{c}{cultivosPlan.includes(c) ? " ★" : ""}</option>);
                            })()}
                          </select>
                        </div>
                        {inp("Campaña", "campana", { text: true, ph: "2025/26" })}
                        <div>
                          <label style={labelSt}>Hectáreas {(nivelMB === "multi" || nivelMB === "campo") && haTotal > 0 ? <span style={{color:C.accent,fontWeight:700}}>→ {Math.round(haTotal)} ha auto</span> : ""}</label>
                          <input type="number" value={newMargen.hectareas}
                            onChange={e => setNewMargen(p => ({ ...p, hectareas: e.target.value }))}
                            placeholder={(nivelMB === "multi" || nivelMB === "campo") && haTotal > 0 ? Math.round(haTotal).toString() : "ha"}
                            style={inputSt} />
                        </div>
                      </div>

                      {/* Ingresos */}
                      {secTitle("Ingresos")}
                      {/* Cotizaciones del día */}
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                        <button onClick={fetchCotizaciones} disabled={cargandoCot}
                          style={{ ...st.btnSecondary, fontSize: 11, padding: "4px 12px", opacity: cargandoCot ? 0.6 : 1 }}>
                          {cargandoCot ? "⏳ Cargando..." : "📈 Cotizaciones del día"}
                        </button>
                        {cotizaciones && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {Object.entries(cotizaciones).map(([grano, precio]) => (
                              <button key={grano} onClick={() => setNewMargen(p => ({ ...p, precio_rosario_usd: precio.toString() }))}
                                style={{ background: C.accentLight, border: `1px solid ${C.accent}40`, borderRadius: 6,
                                  padding: "3px 10px", cursor: "pointer", fontSize: 11, color: C.accent, fontWeight: 600 }}>
                                {grano}: USD {precio}/tn
                              </button>
                            ))}
                            <span style={{ fontSize: 10, color: C.muted, alignSelf: "center" }}>· Hacé click para usar</span>
                          </div>
                        )}
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                        {inp("Rinde (qq/ha)", "rendimiento_qq")}
                        {inp("Precio Rosario (USD/tn)", "precio_rosario_usd")}
                        {inp("Flete (USD/tn)", "flete_usd")}
                        {inp("% Comercialización", "pct_comercializacion")}
                      </div>
                      <div style={{ background: C.accentLight, borderRadius: 8, padding: "8px 14px", marginTop: 8, fontSize: 12, color: C.accent }}>
                        Precio neto: <b>USD {r.precioNeto.toFixed(2)}/tn</b> · Ingreso neto: <b>USD {r.ingresoHa.toFixed(2)}/ha</b>
                      </div>

                      {/* Gastos Variables */}
                      {secTitle("Gastos Variables (USD/ha)")}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                        <div>
                          <label style={labelSt}>
                            Semilla{curaHaAuto > 0 ? " + Curasemilla" : ""}
                            {costoSemHaAuto > 0 && (
                              <span style={{ color: C.accent, fontSize: 10, marginLeft: 6 }}>
                                ({semHaDesdeEstructura > 0 ? "estructura" : "siembra"} → USD {(costoSemHaAuto + curaHaAuto).toFixed(0)}/ha auto)
                              </span>
                            )}
                          </label>
                          <input type="number" value={newMargen.costo_semilla_ha}
                            onChange={e => setNewMargen(p => ({ ...p, costo_semilla_ha: e.target.value }))}
                            placeholder={(costoSemHaAuto + curaHaAuto) > 0 ? (costoSemHaAuto + curaHaAuto).toFixed(0) : "0"}
                            style={inputSt} />
                        </div>
                        <div>
                          <label style={labelSt}>
                            Labores (pulv. + siembra)
                            {(costoLabHaAuto + lsiemHaAuto) > 0 && (
                              <span style={{ color: C.accent, fontSize: 10, marginLeft: 6 }}>
                                (→ USD {(costoLabHaAuto + lsiemHaAuto).toFixed(0)}/ha auto)
                              </span>
                            )}
                          </label>
                          <input type="number" value={newMargen.costo_labores_ha}
                            onChange={e => setNewMargen(p => ({ ...p, costo_labores_ha: e.target.value }))}
                            placeholder={(costoLabHaAuto + lsiemHaAuto) > 0 ? (costoLabHaAuto + lsiemHaAuto).toFixed(0) : "0"}
                            style={inputSt} />
                        </div>
                        <div>
                          <label style={labelSt}>
                            Agroquímicos
                            {appsLote.length > 0 && (
                              <span style={{ color: C.accent, fontSize: 10, marginLeft: 6 }}>
                                ({appsLote.length} aplicaciones → USD {(appsLote.reduce((s,a) => s+((a.productos||[]).reduce((ps,p) => ps+calcularCostoHa(parseFloat(p.dosis)||0,p.unidad,p.precio_usd),0))*(parseFloat(a.superficie_ha)||1),0) / (parseFloat(newMargen.hectareas)||haTotal||1)).toFixed(2)}/ha auto)
                              </span>
                            )}
                          </label>
                          <input type="number" value={newMargen.costo_agroquimicos_ha}
                            onChange={e => setNewMargen(p => ({ ...p, costo_agroquimicos_ha: e.target.value }))}
                            placeholder={(appsLote.reduce((s,a) => s+((a.productos||[]).reduce((ps,p) => ps+calcularCostoHa(parseFloat(p.dosis)||0,p.unidad,p.precio_usd),0))*(parseFloat(a.superficie_ha)||1),0) / (parseFloat(newMargen.hectareas)||haTotal||1)).toFixed(2)}
                            style={inputSt} />
                        </div>
                        <div>
                    <label style={labelSt}>Fertilizantes{costoFertHaAuto > 0 ? <span style={{color:C.accent,fontWeight:700}}> → USD {costoFertHaAuto.toFixed(0)}/ha auto</span> : ""}</label>
                    <input type="number" value={newMargen.costo_fertilizantes_ha}
                      onChange={e => setNewMargen(p => ({...p, costo_fertilizantes_ha: e.target.value}))}
                      placeholder={costoFertHaAuto > 0 ? costoFertHaAuto.toFixed(0) : ""}
                      style={inputSt} />
                  </div>
                        <div>
                          <label style={labelSt}>
                            Cosecha (USD/ha)
                            {(costoCosHaAuto > 0 || lcosHaAuto > 0) && (
                              <span style={{ color: C.accent, fontSize: 10, marginLeft: 6 }}>
                                ({costoCosHaAuto > 0 ? "apps" : "estructura"} → USD {(costoCosHaAuto || lcosHaAuto).toFixed(0)}/ha auto)
                              </span>
                            )}
                          </label>
                          <input type="number" value={newMargen.costo_cosecha_ha}
                            onChange={e => setNewMargen(p => ({ ...p, costo_cosecha_ha: e.target.value }))}
                            placeholder={(costoCosHaAuto || lcosHaAuto) > 0 ? (costoCosHaAuto || lcosHaAuto).toFixed(0) : "0"}
                            style={inputSt} />
                        </div>
                        {inp("Seg./Otros", "costo_otros_ha")}
                      </div>

                      {/* Gastos Fijos */}
                      {secTitle("Gastos Fijos (USD/ha)")}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                        {inp("Gerenciamiento", "costo_gerenciamiento_ha")}
                      </div>

                      {/* Arrendamiento / Aparcería */}
                      {secTitle("Tenencia")}
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        {[["propio", "Propio"], ["arrendamiento", "Arrendamiento (qq soja/ha)"], ["aparceria", "Aparcería (% ingreso)"]].map(([val, label]) => (
                          <button key={val} onClick={() => setNewMargen(p => ({ ...p, modalidad_arr: val }))}
                            style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${newMargen.modalidad_arr === val ? C.accent : C.border}`,
                              background: newMargen.modalidad_arr === val ? C.accentLight : C.surface,
                              color: newMargen.modalidad_arr === val ? C.accent : C.textDim,
                              cursor: "pointer", fontSize: 12, fontWeight: newMargen.modalidad_arr === val ? 700 : 400 }}>
                            {label}
                          </button>
                        ))}
                      </div>
                      {newMargen.modalidad_arr === "arrendamiento" && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                          {inp("qq Soja/ha", "arr_qq_soja")}
                          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", paddingBottom: 6 }}><span style={{ fontSize: 10, color: C.muted }}>PRECIO SOJA</span><span style={{ fontSize: 13, color: C.textDim, fontFamily: F, fontWeight: 600 }}>USD {parseFloat(newMargen.precio_rosario_usd) || 330}/tn <span style={{fontSize:10,color:C.muted,fontWeight:400}}>(usa Precio Rosario)</span></span></div>
                          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
                            <span style={{ fontSize: 13, color: C.accent, fontFamily: F, fontWeight: 700 }}>= USD {r.arrHa.toFixed(2)}/ha</span>
                          </div>
                        </div>
                      )}
                      {newMargen.modalidad_arr === "aparceria" && (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                          {inp("% del ingreso bruto (rinde × precio Rosario)", "apar_pct")}
                          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 8 }}>
                            <span style={{ fontSize: 13, color: C.accent, fontFamily: F, fontWeight: 700 }}>= USD {r.arrHa.toFixed(2)}/ha</span>
                          </div>
                        </div>
                      )}

                      {/* Resumen */}
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginTop: 20, padding: 16, background: C.mutedBg, borderRadius: 10 }}>
                        {[
                          ["Ingreso Neto/ha", `USD ${r.ingresoHa.toFixed(0)}`, C.accent],
                          ["Gastos Var./ha", `USD ${(r.gastosVarHa + r.cosechaHa).toFixed(0)}`, C.warn],
                          ["Contrib. Marginal/ha", `USD ${r.contribucionHa.toFixed(0)}`, r.contribucionHa >= 0 ? C.accent : C.danger],
                          ["Arrend./Apar./ha", `USD ${r.arrHa.toFixed(0)}`, C.textDim],
                          ["MARGEN BRUTO/ha", `USD ${r.mbHa.toFixed(0)}`, r.mbHa >= 0 ? C.accent : C.danger],
                        ].map(([label, val, color]) => (
                          <div key={label} style={{ textAlign: "center" }}>
                            <div style={{ fontSize: 9, color: C.muted, fontFamily: F, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color, fontFamily: F }}>{val}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ textAlign: "right", marginTop: 6, fontSize: 12, color: C.textDim, fontFamily: F }}>
                        Total lote ({r.ha} ha): <b style={{ color: r.mbHa >= 0 ? C.accent : C.danger }}>USD {r.mbTotal.toFixed(0)}</b>
                      </div>

                      {/* ── ANÁLISIS ECONÓMICO AVANZADO ── */}
                      {(() => { try { return (<div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, marginTop: 20, marginBottom: 16 }}>
                        {/* Rentabilidad sobre inversión */}
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>💹 Rentabilidad</div>
                          {(() => {
                            const inversion = r.gastosVarHa + r.cosechaHa + r.gerenHa + r.arrHa;
                            const rentPct = inversion > 0 ? (r.mbHa / inversion * 100) : null;
                            const rentColor = rentPct === null ? C.muted : rentPct >= 20 ? C.accent : rentPct >= 0 ? C.warn : C.danger;
                            return (
                              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <div style={{ textAlign: "center" }}>
                                  <div style={{ fontSize: 36, fontWeight: 700, fontFamily: F, color: rentColor }}>{rentPct !== null ? `${rentPct >= 0 ? "+" : ""}${rentPct.toFixed(1)}%` : "—"}</div>
                                  <div style={{ fontSize: 11, color: C.muted }}>MB / Inversión total</div>
                                </div>
                                <div style={{ fontSize: 12, color: C.textDim, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
                                  <div>Inversión total: <b style={{ fontFamily: F }}>USD {inversion.toFixed(0)}/ha</b></div>
                                  <div>MB/ha: <b style={{ fontFamily: F, color: r.mbHa >= 0 ? C.accent : C.danger }}>{r.mbHa >= 0 ? "+" : ""}USD {r.mbHa.toFixed(0)}</b></div>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                        {/* % costos por rubro */}
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>🥧 Distribución de Costos</div>
                          {(() => {
                            // Usar los valores reales del cálculo (r) que incluye los auto-calculados
                            const semilla = r.gastosVarHa > 0 ? (parseFloat(newMargen.costo_semilla_ha) || costoSemHaAuto || 0) : 0;
                            const labores = r.gastosVarHa > 0 ? (parseFloat(newMargen.costo_labores_ha) || costoLabHaAuto || 0) : 0;
                            const agro = r.agroquimicosHa || 0;
                            const fertiliz = parseFloat(newMargen.costo_fertilizantes_ha) || 0;
                            const cosecha = r.cosechaHa || 0;
                            const gerencia = r.gerenHa || 0;
                            const arrend = r.arrHa || 0;
                            const otros = parseFloat(newMargen.costo_otros_ha) || 0;
                            const rubros = [
                              ["Semilla", semilla, "#e67e22"],
                              ["Labores", labores, "#8e44ad"],
                              ["Agroquímicos", agro, "#c0392b"],
                              ["Fertilizantes", fertiliz, "#16a085"],
                              ["Cosecha", cosecha, "#2980b9"],
                              ["Gerenciamiento", gerencia, "#7f8c8d"],
                              ["Arrendamiento", arrend, "#d35400"],
                              ["Seg./Otros", otros, "#95a5a6"],
                            ].filter(([,v]) => v > 0);
                            const total = rubros.reduce((s,[,v]) => s+v, 0);
                            return (
                              <div>
                                <div style={{ display: "flex", height: 18, borderRadius: 4, overflow: "hidden", marginBottom: 10 }}>
                                  {rubros.map(([label, val, color]) => (
                                    <div key={label} style={{ width: `${total > 0 ? val/total*100 : 0}%`, background: color, title: label }} title={`${label}: USD ${val.toFixed(0)}/ha (${total > 0 ? (val/total*100).toFixed(0) : 0}%)`} />
                                  ))}
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                                  {rubros.map(([label, val, color]) => (
                                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                      <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
                                      <div>
                                        <div style={{ fontSize: 9, color: C.muted }}>{label}</div>
                                        <div style={{ fontSize: 11, fontWeight: 700, fontFamily: F }}>{total > 0 ? (val/total*100).toFixed(0) : 0}% <span style={{ color: C.muted, fontWeight: 400 }}>· {val.toFixed(0)}</span></div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div style={{ marginTop: 8, fontSize: 11, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 6 }}>Total costos: <b style={{ fontFamily: F }}>USD {total.toFixed(0)}/ha</b></div>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Fila 1: Sensibilidad precio + equilibrios + historial */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                        {/* Sensibilidad de rinde */}
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>🌾 Sensibilidad de Rinde</div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                              <tr>{["Variación", "qq/ha", "Ingreso/ha", "MB/ha", "MB Total"].map(h => (
                                <th key={h} style={{ textAlign: "right", padding: "4px 8px", fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                              ))}</tr>
                            </thead>
                            <tbody>
                              {[-20, -10, 0, 10, 20].map(pct => {
                                const qqVar = parseFloat(newMargen.rendimiento_qq || 0) * (1 + pct/100);
                                const ingresoVar = qqVar * r.precioNeto / 10;
                                const mbVar = ingresoVar - r.gastosVarHa - r.cosechaHa - r.gerenHa - r.arrHa;
                                const isBase = pct === 0;
                                const color = mbVar >= 0 ? C.accent : C.danger;
                                return (
                                  <tr key={pct} style={{ background: isBase ? C.accentLight : "transparent", fontWeight: isBase ? 700 : 400 }}>
                                    <td style={{ padding: "5px 8px", color: pct < 0 ? C.danger : pct > 0 ? C.accent : C.text, fontWeight: 700 }}>{pct === 0 ? "BASE" : `${pct > 0 ? "+" : ""}${pct}%`}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: C.textDim }}>{qqVar.toFixed(1)}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: C.textDim }}>{ingresoVar.toFixed(0)}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color, fontWeight: 700 }}>{mbVar >= 0 ? "+" : ""}{mbVar.toFixed(0)}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color, fontWeight: isBase ? 700 : 400 }}>{mbVar >= 0 ? "+" : ""}{(mbVar * r.ha).toFixed(0)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                        {/* Sensibilidad de precios */}
                        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                          <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>📊 Sensibilidad de Precio</div>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                            <thead>
                              <tr>
                                {["Variación", "Precio (USD/tn)", "Ingreso/ha", "MB/ha", "MB Total"].map(h => (
                                  <th key={h} style={{ textAlign: "right", padding: "4px 8px", fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {[-20, -10, 0, 10, 20].map(pct => {
                                const precioVar = parseFloat(newMargen.precio_rosario_usd || 0) * (1 + pct/100);
                                const flete = parseFloat(newMargen.flete_usd || 0);
                                const com = parseFloat(newMargen.pct_comercializacion || 2);
                                const precioNetoVar = (precioVar - flete) * (1 - com/100);
                                const ingresoVar = (parseFloat(newMargen.rendimiento_qq || 0) * precioNetoVar / 10);
                                const mbVar = ingresoVar - r.gastosVarHa - r.cosechaHa - r.gerenHa - r.arrHa;
                                const isBase = pct === 0;
                                const color = mbVar >= 0 ? C.accent : C.danger;
                                return (
                                  <tr key={pct} style={{ background: isBase ? C.accentLight : "transparent", fontWeight: isBase ? 700 : 400 }}>
                                    <td style={{ padding: "5px 8px", color: pct < 0 ? C.danger : pct > 0 ? C.accent : C.text, fontWeight: 700 }}>{pct === 0 ? "BASE" : `${pct > 0 ? "+" : ""}${pct}%`}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: C.textDim }}>{precioVar.toFixed(0)}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color: C.textDim }}>{ingresoVar.toFixed(0)}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color, fontWeight: 700 }}>{mbVar >= 0 ? "+" : ""}{mbVar.toFixed(0)}</td>
                                    <td style={{ padding: "5px 8px", textAlign: "right", fontFamily: F, color, fontWeight: isBase ? 700 : 400 }}>{mbVar >= 0 ? "+" : ""}{(mbVar * r.ha).toFixed(0)}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Puntos de equilibrio + Comparativa campañas */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                          {/* Puntos de equilibrio */}
                          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                            <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>⚖️ Puntos de Equilibrio</div>
                            {(() => {
                              const costoTotal = r.gastosVarHa + r.cosechaHa + r.gerenHa + r.arrHa;
                              const flete = parseFloat(newMargen.flete_usd || 0);
                              const com = parseFloat(newMargen.pct_comercializacion || 2);
                              const qq = parseFloat(newMargen.rendimiento_qq || 0);
                              const precioRosario = parseFloat(newMargen.precio_rosario_usd || 0);
                              // Rinde de equilibrio (precio fijo, cuántos qq necesito)
                              const rindeEq = r.precioNeto > 0 ? (costoTotal / (r.precioNeto / 10)) : null;
                              // Precio de equilibrio (rinde fijo, cuánto precio necesito)
                              // MB = qq * precioNeto/10 - costos = 0
                              // precioNeto = costos * 10 / qq
                              // (precio - flete) * (1 - com/100) = costos * 10 / qq
                              // precio = costos * 10 / qq / (1 - com/100) + flete
                              const precioEq = qq > 0 ? ((costoTotal * 10 / qq) / (1 - com/100) + flete) : null;
                              const rindeActual = qq;
                              const precioActual = precioRosario;
                              return (
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                    <div style={{ background: C.mutedBg, borderRadius: 8, padding: "10px 12px" }}>
                                      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Rinde Equilibrio</div>
                                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: F, color: C.text }}>{rindeEq ? rindeEq.toFixed(1) : "—"} <span style={{ fontSize: 11, color: C.muted }}>qq/ha</span></div>
                                      {rindeEq && rindeActual > 0 && (
                                        <div style={{ fontSize: 11, marginTop: 3, color: rindeActual >= rindeEq ? C.accent : C.danger }}>
                                          {rindeActual >= rindeEq ? `✓ ${(rindeActual - rindeEq).toFixed(1)} qq de margen` : `✗ faltan ${(rindeEq - rindeActual).toFixed(1)} qq`}
                                        </div>
                                      )}
                                    </div>
                                    <div style={{ background: C.mutedBg, borderRadius: 8, padding: "10px 12px" }}>
                                      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Precio Equilibrio</div>
                                      <div style={{ fontSize: 20, fontWeight: 700, fontFamily: F, color: C.text }}>{precioEq ? precioEq.toFixed(0) : "—"} <span style={{ fontSize: 11, color: C.muted }}>USD/tn</span></div>
                                      {precioEq && precioActual > 0 && (
                                        <div style={{ fontSize: 11, marginTop: 3, color: precioActual >= precioEq ? C.accent : C.danger }}>
                                          {precioActual >= precioEq ? `✓ ${(precioActual - precioEq).toFixed(0)} USD de margen` : `✗ faltan ${(precioEq - precioActual).toFixed(0)} USD`}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <div style={{ fontSize: 11, color: C.muted, fontStyle: "italic" }}>
                                    Costos totales: USD {costoTotal.toFixed(0)}/ha
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Comparativa entre campañas */}
                          {(() => {
                            const loteActual = newMargen.lote_nombre;
                            const empresaActual = newMargen.empresa_nombre;
                            const campoActual = newMargen.campo_nombre;
                            const cultivoActual = newMargen.cultivo;
                            const historial = margenes.filter(m =>
                              m.lote_nombre === loteActual &&
                              m.empresa_nombre === empresaActual &&
                              m.campo_nombre === campoActual
                            ).sort((a, b) => (b.campana||"").localeCompare(a.campana||""));
                            if (historial.length === 0) return null;
                            return (
                              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "14px 16px" }}>
                                <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>📅 Historial del Lote</div>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                                  <thead>
                                    <tr>
                                      {["Campaña", "Cultivo", "qq/ha", "Precio", "MB/ha"].map(h => (
                                        <th key={h} style={{ textAlign: "right", padding: "3px 6px", fontSize: 9, color: C.muted, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {historial.slice(0, 5).map(m => {
                                      const mbHa = parseFloat(m.margen_bruto_ha_usd || 0) || (m.hectareas > 0 ? parseFloat(m.margen_bruto_usd||0)/parseFloat(m.hectareas) : 0);
                                      const pos = mbHa >= 0;
                                      const esCampanaActual = m.campana === newMargen.campana;
                                      return (
                                        <tr key={m.id} style={{ background: esCampanaActual ? C.accentLight : "transparent", fontWeight: esCampanaActual ? 700 : 400 }}>
                                          <td style={{ padding: "4px 6px", color: C.textDim }}>{m.campana || "—"}</td>
                                          <td style={{ padding: "4px 6px", color: C.textDim, textAlign: "right" }}>{m.cultivo || "—"}</td>
                                          <td style={{ padding: "4px 6px", textAlign: "right", fontFamily: F }}>{m.rendimiento_qq || "—"}</td>
                                          <td style={{ padding: "4px 6px", textAlign: "right", fontFamily: F, color: C.textDim }}>{m.precio_grano_usd ? `${m.precio_grano_usd}` : "—"}</td>
                                          <td style={{ padding: "4px 6px", textAlign: "right", fontFamily: F, fontWeight: 700, color: pos ? C.accent : C.danger }}>{pos?"+":""}{mbHa.toFixed(0)}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                      </div>

                      </div>); } catch(e) { console.error("Análisis MB error:", e); return null; } })()}
                      <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                        <button onClick={saveMargen} style={st.btnPrimary}>💾 Guardar este lote</button>
                        <button onClick={saveMargenPorLotes}
                          style={{ ...st.btnPrimary, background: "#8e44ad" }}
                          title="Genera un registro de MB para cada lote del campo con el cultivo seleccionado (incluyendo barbechos)">
                          🌾 Guardar todos los lotes del campo
                        </button>
                        <button onClick={() => setShowFormMargen(false)} style={st.btnSecondary}>Cancelar</button>
                      </div>
                    </div>
                  );
                })()}
                {margenes.length === 0 ? (
                  <div style={{ ...st.card, textAlign: "center", padding: 48, color: C.muted }}>Sin calculos de margen bruto. Agrega el primero.</div>
                ) : (
                  <div style={{ ...st.card, padding: 0, overflow: "auto" }}>
                    <div style={{ padding: "8px 16px", background: C.mutedBg, borderBottom: `1px solid ${C.border}`, fontSize: 11, color: C.muted }}>
                      Doble click en una fila para editar - Los costos se ingresan por hectarea
                    </div>
                    <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 1050 }}>
                      <thead><tr>
                        <th style={st.th}>
                          <input type="checkbox"
                            checked={margenes.length > 0 && selectedMargenes.length === margenes.length}
                            onChange={e => setSelectedMargenes(e.target.checked ? margenes.map(m => m.id) : [])}
                            style={{ cursor: "pointer", width: 15, height: 15 }}
                          />
                        </th>
                        {[
                          {h:"",tip:""},
                          {h:"CAMPAÑA",tip:""},
                          {h:"EMPRESA",tip:""},
                          {h:"LOTE",tip:""},
                          {h:"CULTIVO",tip:""},
                          {h:"HA",tip:"Hectáreas totales del lote"},
                          {h:"QQ/HA",tip:"Rendimiento estimado en quintales por hectárea"},
                          {h:"INGRESO/HA",tip:"Ingreso neto por ha = Rinde (qq) × Precio neto (USD/tn) ÷ 10"},
                          {h:"AGRO/HA",tip:"Costo de agroquímicos por ha (suma de todos los productos aplicados valorizados)"},
                          {h:"COSTOS/HA",tip:"Costos directos totales por ha = Semilla + Labores + Agroquímicos + Fertilizantes + Cosecha + Otros"},
                          {h:"CONT. MARG/HA",tip:"Contribución Marginal por ha = Ingreso - Costos variables. Muestra cuánto queda antes de descontar gastos fijos y alquiler"},
                          {h:"MB/HA",tip:"Margen Bruto por hectárea = Ingreso - Costos directos - Alquiler. Es la ganancia real por hectárea"},
                          {h:"MB TOTAL",tip:"Margen Bruto total del lote = MB/ha × Hectáreas"},
                          {h:"MB%",tip:"Margen Bruto sobre Ingreso Bruto = MB ÷ Ingreso × 100. Indica qué porcentaje del ingreso queda como ganancia"},
                          {h:"RND. INDIF.",tip:"Rinde de indiferencia (punto de equilibrio) = qq mínimos necesarios para cubrir todos los costos. Si el rinde real supera este valor, hay ganancia"},
                          {h:"RENTAB.",tip:"Rentabilidad sobre inversión = MB ÷ Inversión total (costos + alquiler) × 100. Indica el retorno sobre lo invertido"},
                          {h:"",tip:""},
                        ].map(({h, tip}) => (
                          <th key={h} style={{...st.th, whiteSpace:"nowrap", fontSize:10}}>
                            {tip ? <Tip text={tip}><span style={{borderBottom:"1px dashed #9ca3af",cursor:"help",display:"inline-flex",alignItems:"center",gap:3}}>{h} <span style={{fontSize:9,opacity:0.6}}>ℹ</span></span></Tip> : h}
                          </th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {margenes.filter(m => (filtroCampana === "todas" || (m.campana||"").trim() === filtroCampana.trim() || (!m.campana && getCampanaFecha(m.created_at) === filtroCampana)) && (filtroEmpresa === "todas" || m.empresa_nombre === filtroEmpresa) && (filtroCampo === "todos" || m.campo_nombre === filtroCampo) && (filtroLote === "todos" || m.lote_nombre?.includes(filtroLote))).map((m) => {
                          const isEditing = editandoMargen?.id === m.id;
                          // ── CÁLCULO COMPLETO CON RINDE SIMULADO ──
                          const qqReal = parseFloat(m.rendimiento_qq||0);
                          const qqSim  = simRindesTabla[m.id] !== undefined ? simRindesTabla[m.id] : qqReal;
                          const esSimulado = simRindesTabla[m.id] !== undefined && simRindesTabla[m.id] !== qqReal;

                          const ha_m    = parseFloat(m.hectareas)||1;
                          const pg_m    = parseFloat(m.precio_grano_usd)||0;
                          const flete_m = parseFloat(m.flete_usd)||0;
                          const com_m   = parseFloat(m.pct_comercializacion)||2;
                          // Precio neto USD/tn y USD/qq
                          const precioNetoTn = pg_m > 0 ? (pg_m - flete_m) * (1 - com_m/100) : 0;
                          const precioNetoQq = precioNetoTn / 10;

                          // Ingreso con rinde simulado
                          const ingBrutoHaSim = qqSim * pg_m * 0.1;
                          const ingHa = precioNetoQq > 0 ? qqSim * precioNetoQq : (ha_m > 0 ? parseFloat(m.ingreso_bruto_usd||0)/ha_m : 0);

                          // Costos fijos (no cambian con rinde)
                          const semHa   = (parseFloat(m.costo_semilla_usd)||0)/ha_m;
                          const labHa   = (parseFloat(m.costo_labores_usd)||0)/ha_m;
                          const agroHa  = (parseFloat(m.costo_agroquimicos_usd)||0)/ha_m;
                          const fertHa  = (parseFloat(m.costo_fertilizantes_usd)||0)/ha_m;
                          const gerHa   = (parseFloat(m.costo_gerenciamiento_usd)||0)/ha_m;
                          const arrHa   = (parseFloat(m.costo_arrendamiento_usd)||0)/ha_m;
                          const otrosHa = (parseFloat(m.costo_otros_usd)||0)/ha_m;

                          // Cosecha: siempre fija (USD/ha)
                          const cosHa = (parseFloat(m.costo_cosecha_usd)||0)/ha_m;
                          const ingHaReal = qqReal > 0 && precioNetoQq > 0 ? qqReal * precioNetoQq : (ha_m > 0 ? parseFloat(m.ingreso_bruto_usd||0)/ha_m : 0);

                          const costosHa   = semHa + labHa + agroHa + fertHa + cosHa + gerHa + arrHa + otrosHa;
                          const contribHa  = ingHa - semHa - labHa - agroHa - fertHa - cosHa;
                          const mbHa       = ingHa - costosHa;
                          const pos        = mbHa >= 0;
                          const semaforoColor = mbHa > 0 ? "#27ae60" : mbHa >= -100 ? "#f39c12" : "#c0392b";

                          // Rinde de indiferencia: siempre desde costos GUARDADOS (no simulados)
                          // Es un punto fijo que no cambia al simular rinde
                          const costosHaGuardados = (['costo_semilla_usd','costo_labores_usd','costo_agroquimicos_usd','costo_fertilizantes_usd','costo_cosecha_usd','costo_gerenciamiento_usd','costo_arrendamiento_usd','costo_otros_usd'].reduce((s,k) => s+(parseFloat(m[k])||0),0)) / ha_m;
                          const precioNetoM = precioNetoQq > 0 ? precioNetoQq
                            : (ingHaReal > 0 && qqReal > 0 ? ingHaReal / qqReal : 0);
                          const rindeIndi = precioNetoM > 0 ? costosHaGuardados / precioNetoM : 0;
                          const diffIngreso = ingHa - ingHaReal; // para mostrar variación
                          if (isEditing) {
                            const ei = editandoMargen;
                            const haEd = parseFloat(ei.hectareas)||1;
                            const qqEd = parseFloat(ei.rendimiento_qq)||0;
                            const precioEd = parseFloat(ei.precio_grano_usd)||0;
                            const fleteEd = parseFloat(ei.flete_usd)||0;
                            const pctComEd = parseFloat(ei.pct_comercializacion)||2;
                            const precioNetoEd = precioEd - fleteEd - (precioEd * pctComEd / 100);
                            const ingHaEd = qqEd * precioNetoEd / 10;
                            const semEd=parseFloat(ei.costo_semilla_ha)||0, labEd=parseFloat(ei.costo_labores_ha)||0, agroEd=parseFloat(ei.costo_agroquimicos_ha)||0, fertEd=parseFloat(ei.costo_fertilizantes_ha)||0;
                            const cosEd=parseFloat(ei.costo_cosecha_ha)||0, gerEd=parseFloat(ei.costo_gerenciamiento_ha)||0, arrEd=parseFloat(ei.costo_arrendamiento_ha)||0, otrosEd=parseFloat(ei.costo_otros_ha)||0;
                            const gastosVarEd = semEd+labEd+agroEd+fertEd+otrosEd;
                            const contribEd = ingHaEd - gastosVarEd - cosEd;
                            const mbHaEd = contribEd - gerEd - arrEd;
                            const posEd = mbHaEd >= 0;
                            const lbl = (t) => <div style={{fontSize:12,color:C.textDim,marginBottom:4,fontWeight:600}}>{t}</div>;
                            const finp = (key, label, ph) => (
                              <div>
                                <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:3}}>{label}</label>
                                <input type="number" value={ei[key]||""} placeholder={ph||"0"}
                                  onChange={e=>setEditandoMargen(v=>({...v,[key]:e.target.value}))}
                                  style={{...inputSt,margin:0,fontSize:14,width:"100%",padding:"8px 10px"}} />
                              </div>
                            );
                            const ftxt = (key, label) => (
                              <div>
                                <label style={{fontSize:11,color:C.muted,display:"block",marginBottom:3}}>{label}</label>
                                <input type="text" value={ei[key]||""}
                                  onChange={e=>setEditandoMargen(v=>({...v,[key]:e.target.value}))}
                                  style={{...inputSt,margin:0,fontSize:14,width:"100%",padding:"8px 10px"}} />
                              </div>
                            );
                            return (
                              <tr key={m.id}>
                                <td colSpan={15} style={{padding:0,borderBottom:`2px solid ${C.accent}`}}>
                                  <div style={{background:C.accentLight,padding:"20px 24px",borderLeft:`4px solid ${C.accent}`}}>
                                    {/* Identificación */}
                                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:12,marginBottom:16}}>
                                      {ftxt("campana","Campaña")}
                                      {ftxt("empresa_nombre","Empresa")}
                                      {ftxt("lote_nombre","Lote")}
                                      {ftxt("cultivo","Cultivo")}
                                      {finp("hectareas","Hectáreas")}
                                    </div>
                                    {/* Ingresos */}
                                    <div style={{fontSize:11,color:C.accent,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8,borderBottom:`1px solid ${C.border}`,paddingBottom:4}}>Ingresos</div>
                                    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:16}}>
                                      {finp("rendimiento_qq","Rinde (qq/ha)")}
                                      {finp("precio_grano_usd","Precio Rosario (USD/tn)")}
                                      {finp("flete_usd","Flete (USD/tn)")}
                                      {finp("pct_comercializacion","% Comercialización")}
                                    </div>
                                    <div style={{background:C.surface,borderRadius:8,padding:"8px 14px",marginBottom:16,fontSize:13,color:C.accent,fontWeight:600}}>
                                      Precio neto: <b>USD {precioNetoEd.toFixed(2)}/tn</b> · Ingreso neto: <b>USD {ingHaEd.toFixed(2)}/ha</b>
                                    </div>
                                    {/* Costos */}
                                    <div style={{fontSize:11,color:C.accent,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8,borderBottom:`1px solid ${C.border}`,paddingBottom:4}}>Gastos Variables (USD/ha)</div>
                                    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:16}}>
                                      {finp("costo_semilla_ha","Semilla")}
                                      {finp("costo_labores_ha","Labores")}
                                      {finp("costo_agroquimicos_ha","Insumos")}
                                      {finp("costo_fertilizantes_ha","Fertilizantes")}
                                      {finp("costo_cosecha_ha","Cosecha")}
                                      {finp("costo_otros_ha","Seg./Otros")}
                                    </div>
                                    <div style={{fontSize:11,color:C.accent,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:8,borderBottom:`1px solid ${C.border}`,paddingBottom:4}}>Gastos Fijos (USD/ha)</div>
                                    <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:12,marginBottom:16}}>
                                      {finp("costo_gerenciamiento_ha","Gerenciamiento")}
                                      {finp("costo_arrendamiento_ha","Arrend./Aparcería")}
                                    </div>
                                    {/* Resumen */}
                                    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10,padding:"14px 16px",background:C.surface,borderRadius:10,marginBottom:16}}>
                                      {[
                                        ["Ingreso/ha", `USD ${ingHaEd.toFixed(0)}`, C.accent],
                                        ["Gastos Var./ha", `USD ${(gastosVarEd+cosEd).toFixed(0)}`, C.warn],
                                        ["Contrib. Marg./ha", `USD ${contribEd.toFixed(0)}`, contribEd>=0?C.accent:C.danger],
                                        ["MB/ha", `USD ${mbHaEd.toFixed(0)}`, posEd?C.accent:C.danger],
                                        ["MB Total", `USD ${(mbHaEd*haEd).toFixed(0)}`, posEd?C.accent:C.danger],
                                      ].map(([label,val,color]) => (
                                        <div key={label} style={{textAlign:"center"}}>
                                          <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",marginBottom:4}}>{label}</div>
                                          <div style={{fontSize:20,fontWeight:700,color,fontFamily:F}}>{val}</div>
                                        </div>
                                      ))}
                                    </div>
                                    <div style={{display:"flex",gap:10}}>
                                      <button onClick={saveEditMargen} style={{...st.btnPrimary,padding:"10px 24px",fontSize:14}}>💾 Guardar</button>
                                      <button onClick={()=>setEditandoMargen(null)} style={{...st.btnSecondary,padding:"10px 20px",fontSize:14}}>Cancelar</button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          }
                          return (
                            <tr key={m.id} title="Doble click para editar"
                              style={{ cursor:"pointer", background: selectedMargenes.includes(m.id) ? C.accentLight : undefined }}
                              onDoubleClick={() => {
                                const haM = parseFloat(m.hectareas)||1;
                                // Cultivo: desde registro o inferir desde apps del lote
                                const cultM = m.cultivo || (() => {
                                  const freq = {};
                                  aplicaciones.filter(a =>
                                    a.empresa_nombre?.trim() === m.empresa_nombre?.trim() &&
                                    String(a.lote_nombre) === String(m.lote_nombre) &&
                                    !["Barbecho Químico","BARBECHO QUÍMICO","Cultivo de Servicio","CULTIVO DE SERVICIO"].includes(a.cultivo)
                                  ).forEach(a => { if(a.cultivo) freq[a.cultivo]=(freq[a.cultivo]||0)+1; });
                                  return Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0] || "";
                                })();
                                // Semilla: desde registro guardado, sino desde lotes_semillas
                                const semGuardada = (parseFloat(m.costo_semilla_usd)||0)/haM;
                                const semDesdeEst = (() => {
                                  if (semGuardada > 0) return semGuardada;
                                  const semL = mbSemillas.filter(s =>
                                    (!m.campo_nombre || s.campo_nombre === m.campo_nombre) &&
                                    String(s.lote_nombre) === String(m.lote_nombre)
                                  );
                                  if (semL.length === 0) return 0;
                                  return semL.reduce((s,x) => s+(parseFloat(x.semilla_ha)||0)*(parseFloat(x.pct_lote)||100)/100, 0);
                                })();
                                // costos_produccion: usar mbCostosProduccion o buscar el primer registro disponible
                                const normM = s => s.replace(/\s+(1ra|2da|3ra|Hab)/i,"").trim();
                                const findCP = (arr, cult) => arr.find(c => c.cultivo === cult) ||
                                  arr.find(c => normM(c.cultivo) === normM(cult)) ||
                                  arr.find(c => cult && c.cultivo.split(" ")[0] === cult.split(" ")[0]) ||
                                  arr[0] || null; // fallback: primer registro disponible
                                const cpM = findCP(mbCostosProduccion, cultM);
                                const curaM  = parseFloat(cpM?.curasemilla_ha)  || 0;
                                const lsiemM = parseFloat(cpM?.labor_siembra_ha) || 0;
                                const lcosM  = parseFloat(cpM?.labor_cosecha_ha) || 0;
                                const cosechaGuardada = (parseFloat(m.costo_cosecha_usd)||0)/haM;
                                const labGuardada = (parseFloat(m.costo_labores_usd)||0)/haM;
                                // Fetch inline costos_produccion para tener datos frescos al abrir edición
                                const tok3 = session?.access_token || SUPABASE_KEY;
                                const H3 = { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok3}` };
                                // Fallback a campaña actual si el registro no tiene campana guardada
                                const campMStr = (m.campana||"").trim() || (() => {
                                  const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear();
                                  return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`;
                                })();
                                const encE = encodeURIComponent(m.empresa_nombre||"");
                                const encC2 = encodeURIComponent(campMStr);
                                                                Promise.all([
                                  fetch(`${SUPABASE_URL}/rest/v1/lotes_semillas?empresa_nombre=eq.${encE}&campana=eq.${encC2}`, { headers: H3 }).then(r => r.json()),
                                  fetch(`${SUPABASE_URL}/rest/v1/costos_produccion?empresa_nombre=eq.${encE}&campana=eq.${encC2}`, { headers: H3 }).then(r => r.json()),
                                ]).then(([semF, cosF]) => {
                                  const semillas = Array.isArray(semF) ? semF : [];
                                  const costos  = Array.isArray(cosF) ? cosF : [];
                                  setMbSemillas(semillas);
                                  setMbCostosProduccion(costos);

                                  const normF = s => s.replace(/\s+(1ra|2da|3ra|Hab)/i,"").trim();
                                  const cpF = findCP(costos, cultM) || costos[0] || null;
                                  const curaF  = parseFloat(cpF?.curasemilla_ha)  || 0;
                                  const lsiemF = parseFloat(cpF?.labor_siembra_ha) || 0;
                                  const lcosF  = parseFloat(cpF?.labor_cosecha_ha) || 0;

                                  const semL = semillas.filter(s =>
                                    (!m.campo_nombre || s.campo_nombre === m.campo_nombre) &&
                                    String(s.lote_nombre) === String(m.lote_nombre)
                                  );
                                  const semCalc = semL.length > 0
                                    ? semL.reduce((s,x) => s+(parseFloat(x.semilla_ha)||0)*(parseFloat(x.pct_lote)||100)/100, 0)
                                    : semDesdeEst;

                                  // Recalcular labores = pulverizaciones reales + labor siembra de estructura
                                  const appsLabF = aplicaciones.filter(a =>
                                    a.empresa_nombre?.trim() === m.empresa_nombre?.trim() &&
                                    String(a.lote_nombre) === String(m.lote_nombre) &&
                                    getCampanaFecha(a.fecha) === campMStr &&
                                    ["Pulverización Terrestre","Terrestre","TERRESTRE","Pulverización Aérea","Aérea","AEREA","Pulverización Drone","Drone","DRONE"].includes(a.tipo_aplicacion)
                                  );
                                  const haLoteF = haM;
                                  const labPulvF = appsLabF.length > 0
                                    ? appsLabF.reduce((s,a) => s+(parseFloat(a.costo_labor_ha)||COSTOS_LABOR_DEFAULT[a.tipo_aplicacion]||0)*(parseFloat(a.superficie_ha)||1),0) / haLoteF
                                    : labGuardada;
                                  const labTotalF = labPulvF + lsiemF;

                                  setEditandoMargen(prev => prev ? {
                                    ...prev,
                                    costo_semilla_ha: ((semCalc || semDesdeEst) + curaF).toFixed(2),
                                    costo_labores_ha: labTotalF.toFixed(2),
                                    costo_cosecha_ha: (cosechaGuardada > 0 ? cosechaGuardada : lcosF).toFixed(2),
                                  } : prev);
                                }).catch(() => {});

                                setEditandoMargen({
                                  id: m.id, campana: m.campana||"", empresa_nombre: m.empresa_nombre||"",
                                  campo_nombre: m.campo_nombre||"", lote_nombre: m.lote_nombre||"",
                                  cultivo: m.cultivo||"", hectareas: m.hectareas||"",
                                  rendimiento_qq: m.rendimiento_qq||"", precio_grano_usd: m.precio_grano_usd||"",
                                  flete_usd: (() => {
                                    if (m.flete_usd) return m.flete_usd;
                                    // Buscar flete desde plan_cultivos
                                    const pc = (planCultivos||[]).find(p =>
                                      (p.cultivo === cultM || !cultM) &&
                                      (!m.campana || p.campana === m.campana)
                                    );
                                    return pc?.flete_usd || "";
                                  })(), pct_comercializacion: m.pct_comercializacion||"2",
                                  costo_semilla_ha: (semDesdeEst + curaM).toFixed(2),
                                  costo_labores_ha: labGuardada > 0 ? labGuardada.toFixed(2) : lsiemM.toFixed(2),
                                  costo_agroquimicos_ha: haM>0?((parseFloat(m.costo_agroquimicos_usd)||0)/haM).toFixed(2):"0",
                                  costo_fertilizantes_ha: haM>0?((parseFloat(m.costo_fertilizantes_usd)||0)/haM).toFixed(2):"0",
                                  costo_cosecha_ha: (cosechaGuardada > 0 ? cosechaGuardada : lcosM).toFixed(2),
                                  costo_gerenciamiento_ha: haM>0?((parseFloat(m.costo_gerenciamiento_usd)||0)/haM).toFixed(2):"0",
                                  costo_arrendamiento_ha: haM>0?((parseFloat(m.costo_arrendamiento_usd)||0)/haM).toFixed(2):"0",
                                  costo_otros_ha: haM>0?((parseFloat(m.costo_otros_usd)||0)/haM).toFixed(2):"0",
                                });
                              }}>
                              <td style={{ ...st.td, textAlign: "center", padding: "4px 6px" }}>
                                <span style={{ fontSize: 18, color: semaforoColor }} title={mbHa > 0 ? "Rentable" : mbHa >= -100 ? "En equilibrio" : "P\u00e9rdida"}>●</span>
                              </td>
                              <td style={st.td} onClick={e => e.stopPropagation()}>
                                <input type="checkbox"
                                  checked={selectedMargenes.includes(m.id)}
                                  onChange={e => setSelectedMargenes(prev => e.target.checked ? [...prev, m.id] : prev.filter(x => x !== m.id))}
                                  style={{ cursor: "pointer", width: 15, height: 15 }}
                                />
                              </td>
                              <td style={st.td}><span style={{ fontSize: 11, color: C.textDim }}>{m.campana || getCampanaFecha(m.created_at) || "--"}</span></td>
                              <td style={st.td}><span style={{ fontSize: 11, color: C.textDim }}>{m.empresa_nombre}</span></td>
                              <td style={st.td}><b style={{ color: C.text, fontSize: 13 }}>{m.lote_nombre}</b></td>
                              <td style={st.td}><span style={{ color: C.textDim, fontSize: 12 }}>{m.cultivo}</span></td>
                              <td style={st.td}><span style={{ fontFamily: F, fontSize: 12 }}>{m.hectareas}</span></td>
                              <td style={{...st.td, padding:"4px 6px"}} onClick={e=>e.stopPropagation()} onDoubleClick={e=>e.stopPropagation()}>
                                <div style={{display:"flex",alignItems:"center",gap:4}}>
                                  <button onClick={()=>setSimRindesTabla(p=>({...p,[m.id]:Math.max(0,(simRindesTabla[m.id]??qqReal)-0.5)}))}
                                    style={{background:C.mutedBg,border:`1px solid ${C.border}`,borderRadius:6,width:34,height:34,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim,fontWeight:700,flexShrink:0}}>▼</button>
                                  <div style={{textAlign:"center",minWidth:36}}>
                                    <div style={{fontFamily:F,fontSize:13,fontWeight:700,color:esSimulado?"#7c3aed":C.text}}>{qqSim.toFixed(1)}</div>
                                    {esSimulado && <div style={{fontSize:9,color:"#7c3aed"}}>real:{qqReal}</div>}
                                  </div>
                                  <button onClick={()=>setSimRindesTabla(p=>({...p,[m.id]:(simRindesTabla[m.id]??qqReal)+0.5}))}
                                    style={{background:C.mutedBg,border:`1px solid ${C.border}`,borderRadius:6,width:34,height:34,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",color:C.textDim,fontWeight:700,flexShrink:0}}>▲</button>
                                  {esSimulado && <button onClick={()=>setSimRindesTabla(p=>{const n={...p};delete n[m.id];return n;})}
                                    style={{background:"none",border:"none",cursor:"pointer",fontSize:10,color:C.muted,padding:0}} title="Reset">↺</button>}
                                </div>
                              </td>
                              <td style={st.td}>
                                <span style={{ color: C.accent, fontFamily: F }}>USD {ingHa.toFixed(0)}</span>
                                {esSimulado && diffIngreso !== 0 && <div style={{fontSize:9,color:diffIngreso>=0?"#16a34a":"#dc2626"}}>{diffIngreso>=0?"+":""}{diffIngreso.toFixed(0)}</div>}
                              </td>
                              <td style={st.td}><span style={{ color: C.textDim, fontFamily: F, fontSize: 12 }}>USD {agroHa.toFixed(0)}</span></td>
                              <td style={st.td}><span style={{ color: C.warn, fontFamily: F }}>USD {costosHa.toFixed(0)}</span></td>
                              <td style={st.td}><span style={{ color: contribHa >= 0 ? C.accent : C.danger, fontFamily: F }}>USD {contribHa.toFixed(0)}</span></td>
                              <td style={st.td}>
                                <span style={{ color: pos ? C.accent : C.danger, fontFamily: F, fontWeight: 700, fontSize: 14 }}>USD {mbHa.toFixed(0)}</span>
                                {esSimulado && diffIngreso !== 0 && <div style={{fontSize:9,color:diffIngreso>=0?"#16a34a":"#dc2626",fontWeight:700}}>{diffIngreso>=0?"+":""}{diffIngreso.toFixed(0)}/ha</div>}
                              </td>
                              <td style={st.td}><span style={{ color: pos ? C.accent : C.danger, fontFamily: F, fontWeight: 700 }}>USD {(mbHa * ha_m).toFixed(0)}</span></td>
                              <td style={st.td}><span style={{ color: pos ? C.accent : C.danger, fontFamily: F }}>{ingHa > 0 ? `${(mbHa/ingHa*100).toFixed(1)}%` : "--"}</span></td>
                              <td style={st.td}>
                                <span style={{ fontFamily: F, fontSize: 12, color: rindeIndi > 0 ? (rindeIndi <= parseFloat(m.rendimiento_qq||0) ? C.accent : C.danger) : C.muted }}>
                                  {rindeIndi > 0 ? `${rindeIndi.toFixed(1)} qq` : "--"}
                                </span>
                              </td>
                              <td style={st.td}>
                                {(() => {
                                  // Rentabilidad con rinde simulado: mbHa / costosHa (costos fijos guardados)
                                  const rentab = costosHa > 0 ? (mbHa / costosHa * 100) : 0;
                                  return <span style={{fontFamily:F,fontSize:12,fontWeight:700,color:rentab>=0?C.accent:C.danger}}>{rentab>=0?"+":""}{rentab.toFixed(1)}%</span>;
                                })()}
                              </td>
                              <td style={st.td}><button onClick={e=>{e.stopPropagation();deleteMargen(m.id)}} style={{background:"none",border:`1px solid ${C.danger}30`,borderRadius:6,padding:"3px 8px",cursor:"pointer",fontSize:11,color:C.danger}}>del</button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              {/* ── COMPARATIVA POR CULTIVO ── */}
              {(() => {
                const mFilt = margenes.filter(m =>
                  (filtroCampana === "todas" || (m.campana||"").trim() === filtroCampana.trim()) &&
                  (filtroEmpresa === "todas" || m.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                  (filtroCampo === "todos" || m.campo_nombre === filtroCampo) &&
                  (filtroLote === "todos" || m.lote_nombre?.includes(filtroLote))
                );
                if (mFilt.length < 2) return null;
                const porCultivo = {};
                mFilt.forEach(m => {
                  const c = m.cultivo || "—";
                  if (!porCultivo[c]) porCultivo[c] = { ha: 0, mbTotal: 0, ingresoTotal: 0, costosTotal: 0, n: 0, rindeSuma: 0 };
                  const ha = parseFloat(m.hectareas)||0;
                  const mbHaM = parseFloat(m.margen_bruto_ha_usd||0) || (ha>0 ? parseFloat(m.margen_bruto_usd||0)/ha : 0);
                  const ingHaM = parseFloat(m.ingreso_bruto_usd||0)/Math.max(ha,1);
                  const cosH = (['costo_semilla_usd','costo_labores_usd','costo_agroquimicos_usd','costo_fertilizantes_usd','costo_cosecha_usd','costo_gerenciamiento_usd','costo_arrendamiento_usd','costo_otros_usd'].reduce((s,k)=>s+(parseFloat(m[k])||0),0))/Math.max(ha,1);
                  porCultivo[c].ha += ha;
                  porCultivo[c].mbTotal += mbHaM * ha;
                  porCultivo[c].ingresoTotal += ingHaM * ha;
                  porCultivo[c].costosTotal += cosH * ha;
                  porCultivo[c].rindeSuma += (parseFloat(m.rendimiento_qq)||0) * ha;
                  porCultivo[c].n++;
                });
                const cultivos = Object.entries(porCultivo).sort((a,b) => b[1].ha - a[1].ha);
                if (cultivos.length < 2) return null;
                const COLS = {"Soja 1ra":"#27ae60","Soja 2da":"#2ecc71","Soja 3ra":"#58d68d","Maíz":"#f39c12","Maíz 2da":"#f0b27a","Trigo":"#e67e22","Girasol":"#f1c40f","Cebada":"#d4ac0d"};
                return (
                  <div style={{ ...st.card, marginTop: 20 }}>
                    <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 16 }}>🌿 Comparativa por Cultivo{filtroCampana !== "todas" ? ` — ${filtroCampana}` : ""}</div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: SANS }}>
                        <thead>
                          <tr style={{ background: C.mutedBg }}>
                            <th style={{ ...st.th, textAlign: "left" }}>Cultivo</th>
                            <th style={{ ...st.th, textAlign: "right" }}>Ha</th>
                            <th style={{ ...st.th, textAlign: "right" }}>Lotes</th>
                            <th style={{ ...st.th, textAlign: "right" }}>Rinde prom.</th>
                            <th style={{ ...st.th, textAlign: "right" }}>Ingreso/ha</th>
                            <th style={{ ...st.th, textAlign: "right" }}>Costos/ha</th>
                            <th style={{ ...st.th, textAlign: "right" }}>MB/ha</th>
                            <th style={{ ...st.th, textAlign: "right" }}>MB total</th>
                            <th style={{ ...st.th, textAlign: "right" }}>Rent.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cultivos.map(([cult, v], i) => {
                            const mbHaProm = v.ha > 0 ? v.mbTotal/v.ha : 0;
                            const ingHaProm = v.ha > 0 ? v.ingresoTotal/v.ha : 0;
                            const cosHaProm = v.ha > 0 ? v.costosTotal/v.ha : 0;
                            const rindeProm = v.ha > 0 ? v.rindeSuma/v.ha : 0;
                            const rent = ingHaProm > 0 ? mbHaProm/ingHaProm*100 : 0;
                            const col = COLS[cult] || C.accent;
                            return (
                              <tr key={cult} style={{ borderBottom: `1px solid ${C.border}`, background: i%2===0?"transparent":C.mutedBg+"40" }}>
                                <td style={{ ...st.td, fontWeight: 700 }}>
                                  <span style={{ background: col+"20", color: col, padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{cult}</span>
                                </td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>{Math.round(v.ha).toLocaleString("es-AR")}</td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F, color: C.muted }}>{v.n}</td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>{rindeProm > 0 ? rindeProm.toFixed(1)+" qq/ha" : "—"}</td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>USD {ingHaProm.toFixed(0)}</td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F, color: C.warn }}>USD {cosHaProm.toFixed(0)}</td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F, fontWeight: 700, color: mbHaProm >= 0 ? C.accent : C.danger }}>{mbHaProm >= 0 ? "+" : ""}USD {mbHaProm.toFixed(0)}</td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F, fontWeight: 700, color: mbHaProm >= 0 ? C.accent : C.danger }}>{mbHaProm >= 0 ? "+" : ""}USD {Math.round(v.mbTotal).toLocaleString("es-AR")}</td>
                                <td style={{ ...st.td, textAlign: "right", fontFamily: F, color: rent >= 0 ? C.accent : C.danger }}>{rent.toFixed(1)}%</td>
                              </tr>
                            );
                          })}
                          <tr style={{ background: C.accentLight, fontWeight: 700 }}>
                            <td style={st.td}>TOTAL</td>
                            <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>{Math.round(cultivos.reduce((s,[,v])=>s+v.ha,0)).toLocaleString("es-AR")}</td>
                            <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>{cultivos.reduce((s,[,v])=>s+v.n,0)}</td>
                            <td style={st.td} />
                            <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>USD {cultivos.reduce((s,[,v])=>s+v.ha,0) > 0 ? (cultivos.reduce((s,[,v])=>s+v.ingresoTotal,0)/cultivos.reduce((s,[,v])=>s+v.ha,0)).toFixed(0) : "—"}</td>
                            <td style={{ ...st.td, textAlign: "right", fontFamily: F, color: C.warn }}>USD {cultivos.reduce((s,[,v])=>s+v.ha,0) > 0 ? (cultivos.reduce((s,[,v])=>s+v.costosTotal,0)/cultivos.reduce((s,[,v])=>s+v.ha,0)).toFixed(0) : "—"}</td>
                            <td style={{ ...st.td, textAlign: "right", fontFamily: F, color: C.accent }}>+USD {cultivos.reduce((s,[,v])=>s+v.ha,0) > 0 ? (cultivos.reduce((s,[,v])=>s+v.mbTotal,0)/cultivos.reduce((s,[,v])=>s+v.ha,0)).toFixed(0) : "—"}/ha</td>
                            <td style={{ ...st.td, textAlign: "right", fontFamily: F, fontWeight: 700, color: C.accent }}>+USD {Math.round(cultivos.reduce((s,[,v])=>s+v.mbTotal,0)).toLocaleString("es-AR")}</td>
                            <td style={st.td} />
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* ── SIMULADOR DE RINDE ── */}
              {(() => {
                const empresa = filtroEmpresa !== "todas" ? filtroEmpresa : null;
                const campo = filtroCampo !== "todos" ? filtroCampo : null;
                if (!empresa) return null;
                const margenesFiltrados = margenes.filter(m =>
                  (!empresa || m.empresa_nombre === empresa) &&
                  (!campo || m.campo_nombre === campo)
                );
                const filasSimMB = margenesFiltrados.map(m => ({
                  guardado: { cultivo: m.cultivo, hectareas: m.hectareas, alquiler_tipo: "qq", alquiler_qq_ha: 0, alquiler_pct: 0 },
                  rendimiento_qq: m.rendimiento_qq,
                }));
                const mbTotalMB = margenesFiltrados.reduce((s,m) => s + (m.margen_bruto_usd||0), 0);
                const haTotalMB = margenesFiltrados.reduce((s,m) => s + (parseFloat(m.hectareas)||0), 0);
                // Rinde base por cultivo: promedio ponderado de los registros reales
                const qqBaseOverrideMB = {};
                margenesFiltrados.forEach(m => {
                  if (m.cultivo && m.rendimiento_qq) {
                    if (!qqBaseOverrideMB[m.cultivo]) qqBaseOverrideMB[m.cultivo] = { sum: 0, ha: 0 };
                    const ha = parseFloat(m.hectareas)||1;
                    qqBaseOverrideMB[m.cultivo].sum += parseFloat(m.rendimiento_qq) * ha;
                    qqBaseOverrideMB[m.cultivo].ha += ha;
                  }
                });
                const qqBaseOverrideFinal = Object.fromEntries(
                  Object.entries(qqBaseOverrideMB).map(([c,v]) => [c, v.ha > 0 ? v.sum/v.ha : 0])
                );
                if (filasSimMB.length === 0) return null;
                return (
                  <SimuladorRinde
                    planCultivos={planCultivos}
                    filas={filasSimMB}
                    mbTotal={mbTotalMB}
                    haTotalEmp={haTotalMB}
                    C={C} F={F}
                    filtroCampana={filtroCampana}
                    campanaEmpresa={filtroCampana !== "todas" ? filtroCampana : ""}
                    qqBaseOverride={qqBaseOverrideFinal}
                  />
                );
              })()}

              {/* ── COMPARATIVA DE COSTOS POR LOTE + ANÁLISIS POR CAMPO ── */}
              {(() => {
                const mComp = margenes.filter(m =>
                  (filtroEmpresa === "todas" || m.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                  (filtroCampo === "todos" || m.campo_nombre === filtroCampo) &&
                  (filtroCampana === "todas" || (m.campana||"").trim() === filtroCampana.trim())
                );
                if (mComp.length < 2) return null;
                const rubros = [
                  {k:"costo_agroquimicos_usd", label:"Agro", color:"#c0392b"},
                  {k:"costo_semilla_usd", label:"Semilla", color:"#e67e22"},
                  {k:"costo_labores_usd", label:"Labores", color:"#8e44ad"},
                  {k:"costo_fertilizantes_usd", label:"Fertiliz.", color:"#16a085"},
                  {k:"costo_cosecha_usd", label:"Cosecha", color:"#2980b9"},
                  {k:"costo_arrendamiento_usd", label:"Arrend.", color:"#d35400"},
                  {k:"costo_otros_usd", label:"Seg./Otros", color:"#95a5a6"},
                ];

                // Panel de análisis reutilizable (igual al del formulario)
                const PanelAnalisis = ({ titulo, haTotal, ingHa, costosHa, mbHa, mbTotal, pg, qq, flete, com, rubrosData }) => {
                  const inversion = costosHa;
                  const rentPct = inversion > 0 ? (mbHa / inversion * 100) : null;
                  const rentColor = rentPct === null ? C.muted : rentPct >= 20 ? C.accent : rentPct >= 0 ? C.warn : C.danger;
                  const precioNeto = pg > 0 ? (pg - flete) * (1 - com/100) : 0;
                  const rindeEq = precioNeto > 0 ? (costosHa / (precioNeto / 10)) : null;
                  const precioEq = qq > 0 ? ((costosHa * 10 / qq) / (1 - com/100) + flete) : null;
                  const totalRubros = rubrosData.reduce((s,[,v])=>s+v,0);
                  return (
                    <div style={{ marginTop: 12, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                      <div style={{ padding: "8px 14px", background: C.accentLight, fontSize: 11, fontWeight: 700, color: C.accent, fontFamily: F, letterSpacing: 0.5 }}>
                        📊 {titulo}
                      </div>
                      <div style={{ padding: 14 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 12 }}>
                          {/* Rentabilidad */}
                          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px" }}>
                            <div style={{ fontSize: 10, color: C.textDim, fontFamily: F, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontWeight: 700 }}>💹 Rentabilidad</div>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: 28, fontWeight: 700, fontFamily: F, color: rentColor }}>{rentPct !== null ? `${rentPct >= 0 ? "+" : ""}${rentPct.toFixed(1)}%` : "—"}</div>
                              <div style={{ fontSize: 10, color: C.muted }}>MB / Inversión</div>
                            </div>
                            <div style={{ fontSize: 11, color: C.textDim, borderTop: `1px solid ${C.border}`, paddingTop: 6, marginTop: 6 }}>
                              <div>Inversión: <b style={{ fontFamily: F }}>USD {costosHa.toFixed(0)}/ha</b></div>
                              <div>MB/ha: <b style={{ fontFamily: F, color: mbHa >= 0 ? C.accent : C.danger }}>{mbHa >= 0 ? "+" : ""}USD {mbHa.toFixed(0)}</b></div>
                              <div>MB total: <b style={{ fontFamily: F, color: mbTotal >= 0 ? C.accent : C.danger }}>{mbTotal >= 0 ? "+" : ""}USD {Math.round(mbTotal).toLocaleString("es-AR")}</b></div>
                            </div>
                          </div>
                          {/* Distribución de costos */}
                          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "12px 14px" }}>
                            <div style={{ fontSize: 10, color: C.textDim, fontFamily: F, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8, fontWeight: 700 }}>🥧 Distribución de Costos</div>
                            <div style={{ display: "flex", height: 14, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                              {rubrosData.filter(([,v])=>v>0).map(([label, val, color]) => (
                                <div key={label} style={{ width: `${totalRubros > 0 ? val/totalRubros*100 : 0}%`, background: color }} title={`${label}: USD ${val.toFixed(0)}/ha`} />
                              ))}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 4 }}>
                              {rubrosData.filter(([,v])=>v>0).map(([label, val, color]) => (
                                <div key={label} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                                  <div style={{ width: 7, height: 7, borderRadius: 2, background: color, flexShrink: 0 }} />
                                  <div>
                                    <div style={{ fontSize: 8, color: C.muted }}>{label}</div>
                                    <div style={{ fontSize: 10, fontWeight: 700, fontFamily: F }}>{totalRubros > 0 ? (val/totalRubros*100).toFixed(0) : 0}% <span style={{ color: C.muted, fontWeight: 400 }}>· {val.toFixed(0)}</span></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div style={{ marginTop: 6, fontSize: 10, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 4 }}>Total: <b style={{ fontFamily: F }}>USD {totalRubros.toFixed(0)}/ha</b></div>
                          </div>
                        </div>
                        {/* Puntos de equilibrio */}
                        {(rindeEq || precioEq) && (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            {rindeEq && <div style={{ background: C.mutedBg, borderRadius: 8, padding: "10px 12px" }}>
                              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>⚖️ Rinde Equilibrio</div>
                              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: F, color: qq > rindeEq ? C.accent : C.danger }}>{rindeEq.toFixed(1)} qq/ha</div>
                              <div style={{ fontSize: 10, color: C.muted }}>✓ {Math.max(0, qq - rindeEq).toFixed(1)} qq de margen</div>
                            </div>}
                            {precioEq && <div style={{ background: C.mutedBg, borderRadius: 8, padding: "10px 12px" }}>
                              <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", marginBottom: 4 }}>⚖️ Precio Equilibrio</div>
                              <div style={{ fontSize: 20, fontWeight: 700, fontFamily: F, color: pg > precioEq ? C.accent : C.danger }}>{precioEq.toFixed(0)} USD/tn</div>
                              <div style={{ fontSize: 10, color: C.muted }}>✓ {Math.max(0, pg - precioEq).toFixed(0)} USD de margen</div>
                            </div>}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                };

                const byCultivo = {};
                mComp.forEach(m => { const c = m.cultivo || "—"; if (!byCultivo[c]) byCultivo[c] = []; byCultivo[c].push(m); });
                return (
                  <div style={{ ...st.card, marginTop: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>🔍 Comparativa de Costos por Lote</div>
                      <button onClick={fetchMargenes} style={{ ...st.btnSecondary, fontSize: 11, padding: "4px 12px" }}>↻ Actualizar</button>
                    </div>
                    {Object.entries(byCultivo).filter(([,ls]) => ls.length >= 1).map(([cultivo, lotes]) => {
                      const rows = lotes.map(m => {
                        const ha = parseFloat(m.hectareas) || 1;
                        const costos = {};
                        rubros.forEach(r => { costos[r.k] = (parseFloat(m[r.k])||0)/ha; });
                        const total = Object.values(costos).reduce((s,v)=>s+v,0);
                        const mbHa = parseFloat(m.margen_bruto_ha_usd||0) || parseFloat(m.margen_bruto_usd||0)/ha;
                        return { m, lote: m.lote_nombre, campo: m.campo_nombre, ha, costos, total, mbHa };
                      }).sort((a,b) => b.mbHa - a.mbHa);
                      const prom = {};
                      rubros.forEach(r => { prom[r.k] = rows.reduce((s,x)=>s+x.costos[r.k],0)/rows.length; });
                      const rubrosActivos = rubros.filter(r => rows.some(x => x.costos[r.k] > 0));

                      // Datos agregados del campo para el análisis
                      const haTot = rows.reduce((s,r)=>s+r.ha,0) || 1;
                      const ingTot = rows.reduce((s,row)=>s+(parseFloat(row.m.ingreso_bruto_usd)||0),0);
                      const ingHaProm = ingTot / haTot;
                      const mbTot = rows.reduce((s,row)=>s+(parseFloat(row.m.margen_bruto_usd)||0),0);
                      const mbHaProm = mbTot / haTot;
                      const costosTot = rows.reduce((s,row)=>s+row.total*row.ha,0);
                      const costosHaProm = costosTot / haTot;
                      // Precio y rinde promedio ponderado
                      const pgProm = rows.reduce((s,row)=>s+(parseFloat(row.m.precio_grano_usd)||0)*row.ha,0)/haTot;
                      const qqProm = rows.reduce((s,row)=>s+(parseFloat(row.m.rendimiento_qq)||0)*row.ha,0)/haTot;
                      const fleteProm = rows.reduce((s,row)=>s+(parseFloat(row.m.flete_usd)||0)*row.ha,0)/haTot;
                      const comProm = rows.reduce((s,row)=>s+(parseFloat(row.m.pct_comercializacion)||2)*row.ha,0)/haTot;
                      const rubrosDataCampo = [
                        ["Semilla",   rows.reduce((s,r)=>s+(parseFloat(r.m.costo_semilla_usd)||0),0)/haTot,  "#e67e22"],
                        ["Labores",   rows.reduce((s,r)=>s+(parseFloat(r.m.costo_labores_usd)||0),0)/haTot,  "#8e44ad"],
                        ["Agroquím.", rows.reduce((s,r)=>s+(parseFloat(r.m.costo_agroquimicos_usd)||0),0)/haTot, "#c0392b"],
                        ["Fertiliz.", rows.reduce((s,r)=>s+(parseFloat(r.m.costo_fertilizantes_usd)||0),0)/haTot, "#16a085"],
                        ["Cosecha",   rows.reduce((s,r)=>s+(parseFloat(r.m.costo_cosecha_usd)||0),0)/haTot,  "#2980b9"],
                        ["Arrend.",   rows.reduce((s,r)=>s+(parseFloat(r.m.costo_arrendamiento_usd)||0),0)/haTot, "#d35400"],
                        ["Seg./Otros",rows.reduce((s,r)=>s+(parseFloat(r.m.costo_otros_usd)||0),0)/haTot,    "#95a5a6"],
                      ];

                      return (
                        <div key={cultivo} style={{ marginBottom: 28 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                            🌾 {cultivo} — {lotes.length} lote{lotes.length!==1?"s":""}
                            <span style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>{Math.round(haTot)} ha totales</span>
                          </div>

                          {/* Tabla comparativa por lote */}
                          {lotes.length >= 2 && (
                          <div style={{ overflowX: "auto", marginBottom: 8 }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: SANS }}>
                              <thead>
                                <tr style={{ background: C.mutedBg }}>
                                  <th style={{ ...st.th, textAlign: "left" }}>Lote</th>
                                  <th style={{ ...st.th, textAlign: "right" }}>Ha</th>
                                  {rubrosActivos.map(r => <th key={r.k} style={{ ...st.th, textAlign: "right", color: r.color }}>{r.label}</th>)}
                                  <th style={{ ...st.th, textAlign: "right" }}>Total/ha</th>
                                  <th style={{ ...st.th, textAlign: "right" }}>MB/ha</th>
                                </tr>
                              </thead>
                              <tbody>
                                {rows.map((row, i) => (
                                  <tr key={row.lote} style={{ borderBottom: `1px solid ${C.border}`, background: i%2===0?"transparent":C.mutedBg+"40" }}>
                                    <td style={{ ...st.td, fontWeight: 700 }}>{row.lote}{row.campo ? <span style={{ fontSize: 10, color: C.muted, marginLeft: 4 }}>{row.campo}</span> : null}</td>
                                    <td style={{ ...st.td, textAlign: "right", color: C.muted, fontFamily: F }}>{Math.round(row.ha)}</td>
                                    {rubrosActivos.map(r => {
                                      const v = row.costos[r.k];
                                      const diff = prom[r.k] > 0 ? (v - prom[r.k])/prom[r.k]*100 : 0;
                                      return (
                                        <td key={r.k} style={{ ...st.td, textAlign: "right", fontFamily: F, color: diff > 10 ? C.danger : diff < -10 ? C.accent : C.text, fontWeight: Math.abs(diff) > 10 ? 700 : 400 }}>
                                          {v > 0 ? v.toFixed(0) : "—"}{Math.abs(diff) > 10 && <span style={{ fontSize: 9, marginLeft: 2 }}>{diff > 0 ? "▲" : "▼"}</span>}
                                        </td>
                                      );
                                    })}
                                    <td style={{ ...st.td, textAlign: "right", fontFamily: F, fontWeight: 700, color: C.warn }}>{row.total.toFixed(0)}</td>
                                    <td style={{ ...st.td, textAlign: "right", fontFamily: F, fontWeight: 700, color: row.mbHa >= 0 ? C.accent : C.danger }}>{row.mbHa >= 0 ? "+" : ""}{row.mbHa.toFixed(0)}</td>
                                  </tr>
                                ))}
                                <tr style={{ background: C.accentLight, fontWeight: 700 }}>
                                  <td style={st.td}>PROM.</td>
                                  <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>{Math.round(haTot)} ha</td>
                                  {rubrosActivos.map(r => <td key={r.k} style={{ ...st.td, textAlign: "right", fontFamily: F }}>{prom[r.k].toFixed(0)}</td>)}
                                  <td style={{ ...st.td, textAlign: "right", fontFamily: F }}>{costosHaProm.toFixed(0)}</td>
                                  <td style={{ ...st.td, textAlign: "right", fontFamily: F, color: C.accent }}>{mbHaProm >= 0 ? "+" : ""}{mbHaProm.toFixed(0)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          )}

                          {/* Panel análisis por campo (cultivo agregado) */}
                          <PanelAnalisis
                            titulo={`Análisis ${cultivo} — ${filtroEmpresa !== "todas" ? filtroEmpresa : "todas las empresas"} (${Math.round(haTot)} ha)`}
                            haTotal={haTot}
                            ingHa={ingHaProm}
                            costosHa={costosHaProm}
                            mbHa={mbHaProm}
                            mbTotal={mbTot}
                            pg={pgProm}
                            qq={qqProm}
                            flete={fleteProm}
                            com={comProm}
                            rubrosData={rubrosDataCampo}
                          />
                        </div>
                      );
                    })}
                  </div>
                );
              })()}

                </div>
              </div>
            )}
            {/* ── COMPARATIVA ── */}
            {tab === "comparativa" && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <ComparativaCampanias monitoreos={monitoreos} setMonitoreos={setMonitoreos} aplicaciones={aplicaciones} session={session} />



              </div>
            )}

            {/* ── PLANIFICACIÓN ── */}
            {tab === "planificacion" && (() => {
              // Lista fija de empresas/campos/lotes — idéntica a la app móvil
              const EMPRESAS_MOV = [
                { empresa: "HERRERA IGNACIO", campos: [{ campo: "LASTRA", lotes: ["1","2","LASTRA ZULEMA"] }]},
                { empresa: "AGROCORSI", campos: [{ campo: "ANTONELLA", lotes: ["LOTE A1","LOTE A2"] },{ campo: "EL PAMPA", lotes: ["LOTE V1A","LOTE V1B","V2","V3","V4","V5","V6","V7","V8","V9","V10A","V10B","V11"] },{ campo: "INTIGUATANA", lotes: ["INTIGUATANA"] },{ campo: "LAS MARIAS", lotes: ["LAS MARIA"] },{ campo: "MARTINEZ", lotes: ["1"] },{ campo: "SAN PEDRO", lotes: ["1","2","3","4","5","6","7","8","9","10","11A","11B","11C","12"] }]},
                { empresa: "BERTOLI VARRONE", campos: [{ campo: "BERTOLI VARRONE", lotes: ["PANAMBI 1 (PA1)","PANAMBI 2 (PA2)","QUIMIL","CORDERO A","EL SIN QUERER","CARDOZO (C1)","FIORI (F1)","QUEBRACHO 1 (Q1)","QUEBRACHO 3 (Q3)","QUEBRACHO 4 (Q4)","TIERRAS DEL OESTE 1","TIERRAS DEL OESTE 2","TIERRAS DEL OESTE 3","TIERRAS DEL OESTE 4","TIERRAS DEL OESTE 5","TIERRAS DEL OESTE 6","TIERRAS DEL OESTE 7","TIERRAS DEL OESTE 8","TIERRAS DEL OESTE 9","TIERRAS DEL OESTE 10","TIERRAS DEL OESTE 11","TIERRAS DEL OESTE 12","TIERRAS DEL OESTE 13","TIERRAS DEL OESTE 14","TIERRAS DEL OESTE 15","LA GRATITUD 1 (LG1)","LA GRATITUD 2","LA GRATITUD CAMPO NUEVO","LA JUANITA 1 (LJ1)","LA JUANITA 2 (LJ2)","LA JUANITA 3 (LJ3)","URUNDAY 1 (U1)","URUNDAY 2 (U2)","URUNDAY 3 (U3)","URUNDAY 4 (U4)","URUNDAY 5 (U5)","URUNDAY 6 (U6)","URUNDAY 7 (U7)","SANTA MARIA 1 (SM1)","SANTA MARIA 2 (SM2)","SANTA MARIA 3 (SM3)","SANTA MARIA 4 (SM4)","SANTA MARIA 5 (SM5)","GOROSITO (GO)","LOS CORDOBESES 1 (LC1)","LOS CORDOBESES 2 (LC2)","LOS CORDOBESES 3 (LC3)","LOS CORDOBESES 4 (LC4)","LOS CORDOBESES 5 (LC5)","LOS CORDOBESES 13 (LC13)","LOS CORDOBESES 15 (LC15)","ABRAHAM (A1)","VARGAS ETEL 1 (EV1)","VARGAS ETEL 3 (EV3)","ETEL VARGAS 2 (EV2)","LEGUIZAMON (L1)","LA PIAMONTESA (LP1)","LA PIAMONTESA (LP2)","GAUTO (G1)","DOMINGO LOPEZ (DL)","KAKUY (K1)","JUVENCIO","PERALTA","OLIVER GABRIEL"] }]},
                { empresa: "FERNANDO PIGHIN 2", campos: [{ campo: "EST. EL PROGRESO", lotes: ["LOTE 1","LOTE 3","LOTE 5","2A","2B","LOTE 4A","LOTE 4B","FERNANDO 5"] },{ campo: "EST. LA LUNA", lotes: ["FERNANDO 1","FERNANDO 2","FERNANDO 3","FERNANDO 4","FERNANDO 6","FERNANDO 7","FERNANDO 8","LOTE NUEVO"] }]},
                { empresa: "GIANFRANCO BERTOLI", campos: [{ campo: "TIERRAS DEL OESTE", lotes: ["LOTE 1","LOTE 2"] }]},
                { empresa: "GREGORET HNOS", campos: [{ campo: "GREGORET HNOS", lotes: ["LA CUÑA","EL SUIZO","FIORI","ANTONIO FIORI","SAN PABLO","ESTANCIA GREGORET","LA PERSEVERANCIA","NORMA QUIROZ","CASTAÑO","LA PAMPITA","NORA ANAYA","ROMAN"] }]},
                { empresa: "SIGOTO/GOROSITO/BERTOLI", campos: [{ campo: "EL OCASO", lotes: ["1 ESTE","2 OESTE"] }]},
                { empresa: "VACHETTA JORGE", campos: [{ campo: "DON ALBINO", lotes: ["LOTE 1","LOTE 2"] }]},
              ];
              const getCampanaActualPlan = () => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; };
              const campanaActualPlan = getCampanaActualPlan();
              const campanaFuturaPlan = (() => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); const base = mes >= 7 ? a+1 : a; return `${base}/${String(base+1).slice(2)}`; })();
              const campanaVistaActual = campanaVistaPlan === "actual" ? campanaActualPlan : campanaFuturaPlan;
              const campanaPlan = campanaVistaActual;
              const planFiltrado = planificacion.filter(p =>
                (filtroEmpresa === "todas" || p.empresa_nombre?.trim() === filtroEmpresa?.trim()) &&
                (filtroCampo === "todos" || p.campo_nombre === filtroCampo) &&
                p.campana === campanaVistaActual
              );

              // Calcular MB esperado
              const calcMBPlan = (p) => {
                const cultivoBuscar = p.cultivo || "";
                const plantilla = planCultivos.find(c =>
                  c.cultivo === cultivoBuscar && (filtroCampana === "todas" || c.campana === filtroCampana || c.campana === p.campana)
                );
                const src = plantilla || p;
                const qq = parseFloat(src.rendimiento_obj_qq)||0;
                const precio = parseFloat(src.precio_grano_usd)||0;
                const flete = parseFloat(src.flete_usd)||0;
                const pct = parseFloat(src.pct_comercializacion)||2;
                const precioNeto = (precio - flete) * (1 - pct/100);
                const ingresoHa = qq * precioNeto / 10;
                const costos = (parseFloat(src.costo_semilla_ha)||0) +
                  (parseFloat(src.costo_labores_ha)||0) +
                  (parseFloat(src.costo_agroquimicos_ha)||0) +
                  (parseFloat(src.costo_fertilizantes_ha)||0) +
                  (parseFloat(src.costo_cosecha_ha)||0) +
                  (parseFloat(src.costo_otros_ha)||0);
                // Alquiler según tipo guardado en alquiler_tipo:
                // "pct" → Aparcería: rinde × (% / 100) × precio_cultivo / 10
                // "qq"  → Arrendamiento: qq_fijos × precio_soja / 10
                const plantillaSoja = planCultivos.find(c => c.cultivo?.toLowerCase().includes("soja 1") || c.cultivo?.toLowerCase() === "soja");
                const precioSoja = parseFloat(plantillaSoja?.precio_grano_usd)||330;
                const tipoAlq = p.alquiler_tipo || (parseFloat(p.alquiler_pct) > 0 ? "pct" : "qq");
                let alquilerUsd = 0;
                if (tipoAlq === "pct") {
                  const pctVal = parseFloat(p.alquiler_pct)||0;
                  alquilerUsd = qq * (pctVal / 100) * precio / 10;
                } else {
                  const qqVal = parseFloat(p.alquiler_qq_ha)||0;
                  alquilerUsd = qqVal * precioSoja / 10;
                }
                const tienePlantilla = !!plantilla;
                return { ingresoHa, costos, alquilerUsd, mbHa: ingresoHa - costos - alquilerUsd, precioNeto, tienePlantilla };
              };

              // ── Descarga plantilla Excel planificación ──
              const descargarPlantillaPlan = async () => {
                const XLSX = await new Promise((resolve, reject) => {
                  if (window.XLSX) { resolve(window.XLSX); return; }
                  const s = document.createElement('script');
                  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                  s.onload = () => resolve(window.XLSX); s.onerror = reject;
                  document.head.appendChild(s);
                });
                const ws = XLSX.utils.aoa_to_sheet([
                  ["EMPRESA","CAMPO","LOTE","HA","TENENCIA","CULTIVO","VARIEDAD","ANTECESOR"],
                  ["HERRERA IGNACIO","LASTRA","1","120","PROPIO","Soja 1ra","DM 5.8i","Maíz"],
                  ["HERRERA IGNACIO","LASTRA","2","85","ALQUILADO","Maíz","DK 7210","Soja"],
                  ["FERNANDO PIGHIN 2","EST. EL PROGRESO","LOTE 1","222","PROPIO","Soja 2da","","Trigo"],
                ]);
                ws['!cols'] = [{wch:22},{wch:18},{wch:14},{wch:8},{wch:12},{wch:14},{wch:14},{wch:14}];
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Planificacion");
                XLSX.writeFile(wb, "plantilla_planificacion.xlsx");
              };

              const importarPlanExcel = async (file) => {
                setImportandoPlan(true);
                try {
                  const XLSX = await new Promise((resolve, reject) => {
                    if (window.XLSX) { resolve(window.XLSX); return; }
                    const s = document.createElement('script');
                    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                    s.onload = () => resolve(window.XLSX); s.onerror = reject;
                    document.head.appendChild(s);
                  });
                  const buf = await file.arrayBuffer();
                  const wb = XLSX.read(buf, { type: 'array' });
                  const tok = session?.access_token || SUPABASE_KEY;
                  let ok = 0, err = 0, errores = [];
                  const norm = s => String(s||"").trim().toLowerCase();
                            const normLote = (a, b) => { if (norm(a)===norm(b)) return true; const nA=(norm(a).match(/\d+$/)||[])[0]; const nB=(norm(b).match(/\d+$/)||[])[0]; return nA&&nB&&nA===nB; };
                  const campanaImport = (() => { const now = new Date(); const mes = now.getMonth()+1; const a = now.getFullYear(); return mes >= 7 ? `${a}/${String(a+1).slice(2)}` : `${a-1}/${String(a).slice(2)}`; })();

                  // Leer planificacion actual una sola vez para UPSERT
                  const planActual = [...planificacion];

                  // Procesar cada hoja del Excel
                  for (const sheetName of wb.SheetNames) {
                    const ws = wb.Sheets[sheetName];
                    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
                    if (!rows || rows.length < 2) continue;

                    // Detectar si es formato nuevo (cabecera EMPRESA|CAMPO|LOTE|HA|TENENCIA|CULTIVO...)
                    // o formato viejo (empresa en fila 0 col 1, datos desde fila 4)
                    const primeraFila = (rows[0] || []).map(c => norm(c));
                    const esFormatoNuevo = primeraFila.includes('empresa') || primeraFila.includes('lote') || primeraFila.includes('campo');

                    if (esFormatoNuevo) {
                      // ── FORMATO NUEVO: cabecera en fila 0 ──
                      // Mapear columnas por nombre (flexible, no importa el orden)
                      const headers = rows[0].map(h => norm(h));
                      const col = name => headers.findIndex(h => h && h.includes(name));
                      const iEmpresa  = col('empresa');
                      const iCampo    = col('campo');
                      const iLote     = col('lote');
                      const iHa       = col('ha');
                      const iTenencia = col('tenencia');
                      const iCultivo  = col('cultivo');
                      const iVariedad = col('variedad');
                      const iAntecesor= col('antecesor');

                      for (let i = 1; i < rows.length; i++) {
                        const row = rows[i];
                        if (!row) continue;
                        const empresa  = iEmpresa  >= 0 && row[iEmpresa]  ? String(row[iEmpresa]).trim()  : "";
                        const campo    = iCampo    >= 0 && row[iCampo]    ? String(row[iCampo]).trim()    : "";
                        const lote     = iLote     >= 0 && row[iLote] != null ? String(row[iLote]).trim() : "";
                        const ha       = iHa       >= 0 ? parseFloat(row[iHa]) || null : null;
                        const tenencia = iTenencia >= 0 && row[iTenencia] ? String(row[iTenencia]).trim().toUpperCase() : "PROPIO";
                        const cultivo  = iCultivo  >= 0 && row[iCultivo]  ? String(row[iCultivo]).trim()  : "";
                        const variedad = iVariedad >= 0 && row[iVariedad]  ? String(row[iVariedad]).trim()  : "";
                        const rotacion = iAntecesor>= 0 && row[iAntecesor] ? String(row[iAntecesor]).trim() : "";

                        if (!empresa || !campo || !lote) continue;

                        const body = {
                          campana: campanaImport,
                          empresa_nombre: empresa,
                          campo_nombre: campo,
                          lote_nombre: lote,
                          hectareas: ha,
                          tenencia: tenencia === 'ALQUILADO' ? 'ALQUILADO' : 'PROPIO',
                          cultivo: cultivo || null,
                          variedad: variedad || null,
                          rotacion: rotacion || null,
                        };

                        // UPSERT: si ya existe → PATCH, si no → POST
                        const existente = planActual.find(p =>
                          norm(p.empresa_nombre) === norm(empresa) &&
                          norm(p.campo_nombre) === norm(campo) &&
                          norm(p.lote_nombre) === norm(lote) &&
                          p.campana === campanaImport
                        );

                        let res;
                        if (existente) {
                          res = await fetch(`${SUPABASE_URL}/rest/v1/planificacion?id=eq.${existente.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                            body: JSON.stringify(body)
                          });
                        } else {
                          res = await fetch(`${SUPABASE_URL}/rest/v1/planificacion`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                            body: JSON.stringify(body)
                          });
                        }
                        if (res.ok) ok++; else { err++; errores.push(`${empresa}/${lote}: ${res.status}`); }
                      }

                    } else {
                      // ── FORMATO VIEJO (compatibilidad hacia atrás) ──
                      const empresaHeader = rows[0] && rows[0][1] ? String(rows[0][1]).trim() : "";
                      for (let i = 4; i < rows.length; i++) {
                        const row = rows[i];
                        if (!row) continue;
                        const col0 = row[0] ? String(row[0]).trim() : "";
                        if (col0.toUpperCase().includes('HECTAREAS') || col0.toUpperCase().includes('TOTAL')) break;
                        const campo = row[2] ? String(row[2]).trim() : "";
                        const lote = row[3] != null ? String(row[3]).trim() : "";
                        const tenencia = row[4] ? String(row[4]).trim().toUpperCase() : "PROPIO";
                        const ha = parseFloat(row[5]) || null;
                        const rotacion = row[6] ? String(row[6]).trim() : "";
                        const cultivoNormal = row[7] ? String(row[7]).trim() : "";
                        const cultivoHumedo = row[10] ? String(row[10]).trim() : "";
                        if (!campo || !lote || !ha) continue;
                        if (!cultivoNormal && !cultivoHumedo) continue;
                        const body = {
                          campana: campanaImport, empresa_nombre: empresaHeader,
                          campo_nombre: campo, lote_nombre: lote,
                          tenencia: tenencia === 'ALQUILADO' ? 'ALQUILADO' : 'PROPIO',
                          hectareas: ha, rotacion: rotacion || null,
                          cultivo: cultivoNormal || cultivoHumedo,
                          cultivo_humedo: cultivoHumedo || null,
                        };
                        const existente = planActual.find(p =>
                          norm(p.empresa_nombre) === norm(empresaHeader) &&
                          norm(p.campo_nombre) === norm(campo) &&
                          norm(p.lote_nombre) === norm(lote) &&
                          p.campana === campanaImport
                        );
                        let res;
                        if (existente) {
                          res = await fetch(`${SUPABASE_URL}/rest/v1/planificacion?id=eq.${existente.id}`, {
                            method: 'PATCH', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                            body: JSON.stringify(body)
                          });
                        } else {
                          res = await fetch(`${SUPABASE_URL}/rest/v1/planificacion`, {
                            method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                            body: JSON.stringify(body)
                          });
                        }
                        if (res.ok) ok++; else err++;
                      }
                    }
                  }

                  // Auto-sincronizar cultivos → monitoreos
                  const planActualizado = await sb("planificacion?order=campana.desc,empresa_nombre,campo_nombre,lote_nombre", tok);
                  if (Array.isArray(planActualizado)) {
                    setPlanificacion(planActualizado);
                    let sincronizados = 0;
                    for (const p of planActualizado.filter(p => p.cultivo && p.campana === campanaImport)) {
                      const mLotes = monitoreos.filter(m =>
                        norm(m.empresa) === norm(p.empresa_nombre) &&
                        norm(m.campo) === norm(p.campo_nombre) &&
                        normLote(m.lote, p.lote_nombre)
                      );
                      for (const m of mLotes) {
                        await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${m.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                          body: JSON.stringify({ cultivo: p.cultivo })
                        });
                        sincronizados++;
                      }
                    }
                    if (sincronizados > 0) setMonitoreos(prev => prev.map(m => {
                      const match = planActualizado.find(p =>
                        norm(p.empresa_nombre) === norm(m.empresa) &&
                        norm(p.campo_nombre) === norm(m.campo) &&
                        norm(p.lote_nombre) === norm(m.lote) &&
                        p.cultivo
                      );
                      return match ? { ...m, cultivo: match.cultivo } : m;
                    }));
                    alert(`✅ ${ok} lotes importados${err > 0 ? ` · ⚠ ${err} errores` : ''}${sincronizados > 0 ? ` · 🔄 ${sincronizados} monitoreos sincronizados` : ''}`);
                  } else {
                    alert(`✅ ${ok} lotes importados${err > 0 ? ` · ⚠ ${err} errores` : ''}`);
                  }
                } catch(e) {
                  alert('Error al importar: ' + e.message);
                } finally {
                  setImportandoPlan(false);
                }
              };

              const savePlan = async () => {
                if (!newPlan.lote_nombre || !newPlan.cultivo) return;
                const r = calcMBPlan(newPlan);
                const tok = session?.access_token || SUPABASE_KEY;
                await fetch(`${SUPABASE_URL}/rest/v1/planificacion`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                  body: JSON.stringify({
                    campana: newPlan.campana,
                    empresa_nombre: newPlan.empresa_nombre,
                    campo_nombre: newPlan.campo_nombre,
                    lote_nombre: newPlan.lote_nombre,
                    hectareas: parseFloat(newPlan.hectareas)||null,
                    tenencia: newPlan.tenencia,
                    rotacion: newPlan.rotacion||null,
                    cultivo: newPlan.cultivo||null,
                    cultivo_humedo: newPlan.cultivo_humedo||null,
                    variedad: newPlan.variedad||null,
                    fecha_siembra_est: newPlan.fecha_siembra_est||null,
                    alquiler_qq_ha: parseFloat(newPlan.alquiler_qq_ha)||0,
                    notas: newPlan.notas||null,
                  })
                });
                fetchPlanificacion();
                setShowFormPlan(false);
              };

              const deletePlan = async (id) => {
                if (!window.confirm("¿Eliminar este registro?")) return;
                const tok = session?.access_token || SUPABASE_KEY;
                await fetch(`${SUPABASE_URL}/rest/v1/planificacion?id=eq.${id}`, {
                  method: "DELETE", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` }
                });
                fetchPlanificacion();
              };

              // Resumen por cultivo
              const porCultivo = {};
              planFiltrado.forEach(p => {
                const c = p.cultivo || "Sin cultivo";
                if (!porCultivo[c]) porCultivo[c] = { ha: 0, mbTotal: 0, n: 0 };
                const ha = parseFloat(p.hectareas)||0;
                const mb = calcMBPlan(p);
                porCultivo[c].ha += ha;
                porCultivo[c].mbTotal += mb.mbHa * ha;
                porCultivo[c].n++;
              });
              const cultivosArr = Object.entries(porCultivo).sort((a,b) => b[1].ha-a[1].ha);
              const haTotal = planFiltrado.reduce((s,p) => s+(parseFloat(p.hectareas)||0), 0);
              const mbTotalPlan = planFiltrado.reduce((s,p) => { const r=calcMBPlan(p); return s+r.mbHa*(parseFloat(p.hectareas)||0); }, 0);

              const inp = (label, key, opts={}) => (
                <div key={key}>
                  <label style={labelSt}>{label}</label>
                  <input type={opts.text?"text":"number"} value={newPlan[key]}
                    onChange={e => setNewPlan(p => ({...p, [key]: e.target.value}))}
                    style={inputSt} placeholder={opts.ph||""} />
                </div>
              );

              const CULTIVOS_PLAN = ["Soja 1ra","Soja 2da","Soja 3ra","Maíz","Maíz 2da","Vc-Maíz","Cs-Maíz","Trigo","Cebada","Girasol","Sorgo","Algodón","Moha/Soja","Ce-Soja","Maíz HAB","Vicia/Maíz","Otro"];
              const COLORES_CULTIVO = { "Soja 1ra":"#27ae60","Soja 2da":"#2ecc71","Soja 3ra":"#58d68d","Maíz":"#f39c12","Maíz 2da":"#f8c471","Vc-Maíz":"#e67e22","Trigo":"#d4ac0d","Cebada":"#a9cce3","Girasol":"#f1c40f","Sorgo":"#e74c3c","Algodón":"#85c1e9","Moha/Soja":"#a8d5a2","Ce-Soja":"#1abc9c" };

              // ── Import Excel costos cultivos ──
              const importarCultivosExcel = async (file) => {
                setImportandoCultivos(true);
                try {
                  const XLSX = await import("https://cdn.sheetjs.com/xlsx-0.20.1/package/xlsx.mjs");
                  const data = await file.arrayBuffer();
                  const wb = XLSX.read(data, { type: "array" });
                  const tok = session?.access_token || SUPABASE_KEY;
                  const campana = filtroCampana !== "todas" ? filtroCampana : "2025/26";
                  const CULTIVOS_MAP = {
                    "SOJA 1RA": "Soja 1ra", "SOJA 1": "Soja 1ra", "SOJA1": "Soja 1ra",
                    "SOJA 2DA": "Soja 2da", "SOJA 2": "Soja 2da", "SOJA2": "Soja 2da",
                    "SOJA 3RA": "Soja 3ra", "MAIZ": "Maíz", "MAÍZ": "Maíz",
                    "MAIZ 2DA": "Maíz 2da", "MAÍZ 2DA": "Maíz 2da",
                    "TRIGO": "Trigo", "GIRASOL": "Girasol", "SORGO": "Sorgo",
                    "CEBADA": "Cebada", "ALGODON": "Algodón", "ALGODÓN": "Algodón",
                  };
                  let ok = 0, err = 0;
                  for (const sheetName of wb.SheetNames) {
                    const ws = wb.Sheets[sheetName];
                    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
                    const cultivoRaw = (rows[0] && rows[0][0]) ? String(rows[0][0]).trim() : sheetName.trim();
                    if (!cultivoRaw || cultivoRaw === "LABOR / INSUMO") continue;
                    const cultivo = CULTIVOS_MAP[cultivoRaw.toUpperCase()] || cultivoRaw;

                    const findVal = (label) => {
                      const labelUp = label.toUpperCase();
                      for (const row of rows) {
                        if (row[0] && String(row[0]).toUpperCase().includes(labelUp)) {
                          const v = parseFloat(row[3]);
                          return isNaN(v) ? null : v;
                        }
                      }
                      return null;
                    };

                    // Detectar sección de detalle (filas 8 en adelante, antes de los totales)
                    // Tipo se detecta por prefijo del nombre: "Labor -", "Semilla -", "Herbicida -", etc.
                    const TIPO_MAP = {
                      "LABOR": "Labor", "SEMILLA": "Semilla",
                      "HERBICIDA": "Agroquímico", "INSECTICIDA": "Agroquímico",
                      "FUNGICIDA": "Agroquímico", "ACARICIDA": "Agroquímico",
                      "COADYUVANTE": "Agroquímico", "FERTILIZANTE": "Fertilizante",
                      "SEGURO": "Otro", "OTROS": "Otro",
                    };
                    const TOTALES = ["TOTAL LABORES","TOTAL SEMILLA","TOTAL AGROQUIM","TOTAL FERTILIZ","TOTAL GASTOS","CONTRIBUCION","GERENCIAMIENTO","ARRENDAMIENTO","APARCERIA","MARGEN","RINDE INDIF","INVERSION","RENTABILIDAD","OTROS GASTOS"];
                    const lineas = [];
                    let orden = 0;
                    // Fila 8 en adelante tiene el detalle
                    for (let i = 8; i < rows.length; i++) {
                      const row = rows[i];
                      const nombre = row[0] ? String(row[0]).trim() : null;
                      if (!nombre) continue;
                      const nombreUp = nombre.toUpperCase();
                      // Saltar si es un total o encabezado
                      if (TOTALES.some(t => nombreUp.includes(t))) continue;
                      if (nombreUp === "LABOR / INSUMO") continue;
                      const dosis = parseFloat(row[1]) || null;
                      const precio = parseFloat(row[2]) || null;
                      const costoHa = parseFloat(row[3]) || 0;
                      if (!precio && costoHa === 0) continue; // skip filas vacías
                      // Detectar tipo por prefijo
                      const prefijo = nombreUp.split(" - ")[0].split(" ")[0];
                      const tipo = TIPO_MAP[prefijo] || "Agroquímico";
                      const unidad = tipo === "Labor" ? "ha" : (nombreUp.includes("SEMILLA") ? "kg/ha" : "l/ha");
                      lineas.push({ tipo, nombre, dosis, unidad, precio_usd: precio, costo_ha: costoHa, orden: orden++ });
                    }

                    const body = {
                      campana, cultivo,
                      rendimiento_obj_qq: findVal("RTO (QQ") || findVal("RTO(QQ") || findVal("RENDIMIENTO"),
                      precio_grano_usd: findVal("PRECIO ROSARIO"),
                      flete_usd: findVal("FLETE CORTO"),
                      pct_comercializacion: (() => { const v = findVal("COMERCIALIZ"); return v ? v * 100 : 2; })(),
                      costo_labores_ha: findVal("TOTAL LABORES"),
                      costo_semilla_ha: findVal("TOTAL SEMILLA"),
                      costo_agroquimicos_ha: findVal("TOTAL AGROQUIM"),
                      costo_fertilizantes_ha: findVal("TOTAL FERTILIZ"),
                      costo_cosecha_ha: (() => { for (const row of rows) { if (row[0] && String(row[0]).toUpperCase().includes("COSECHA") && !String(row[0]).toUpperCase().includes("TOTAL")) { const v = parseFloat(row[3]); if (!isNaN(v) && v > 0) return v; } } return null; })(),
                      costo_otros_ha: findVal("OTROS GASTOS"),
                      notas: `Importado de ${file.name}`,
                    };

                    try {
                      let planCultivoId;
                      const existente = planCultivos.find(c => c.campana === campana && c.cultivo === cultivo);
                      if (existente) {
                        await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivos?id=eq.${existente.id}`, {
                          method: "PATCH", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, "Content-Type": "application/json" },
                          body: JSON.stringify(body)
                        });
                        planCultivoId = existente.id;
                        // Borrar detalle previo
                        await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivo_detalle?plan_cultivo_id=eq.${planCultivoId}`, {
                          method: "DELETE", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` }
                        });
                      } else {
                        const res = await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivos`, {
                          method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, "Content-Type": "application/json", Prefer: "return=representation" },
                          body: JSON.stringify(body)
                        });
                        const created = await res.json();
                        planCultivoId = created[0]?.id;
                      }
                      // Insertar líneas de detalle
                      if (planCultivoId && lineas.length > 0) {
                        const detalleBody = lineas.map(l => ({ ...l, plan_cultivo_id: planCultivoId }));
                        await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivo_detalle`, {
                          method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, "Content-Type": "application/json", Prefer: "return=minimal" },
                          body: JSON.stringify(detalleBody)
                        });
                      }
                      ok++;
                    } catch { err++; }
                  }
                  await fetchPlanCultivos();
                  alert(`✅ Importados ${ok} cultivo${ok!==1?"s":""}${err>0?` (${err} errores)`:""} para campaña ${campana}`);
                } catch(e) {
                  alert("Error al importar: " + e.message);
                } finally {
                  setImportandoCultivos(false);
                  if (fileImportCultivosRef.current) fileImportCultivosRef.current.value = "";
                }
              };

              // ── CRUD plan_cultivos ──
              const calcMBCultivo = (c) => {
                const qq = parseFloat(c.rendimiento_obj_qq)||0;
                const precio = parseFloat(c.precio_grano_usd)||0;
                const flete = parseFloat(c.flete_usd)||0;
                const pct = parseFloat(c.pct_comercializacion)||2;
                const precioNeto = (precio - flete) * (1 - pct/100);
                const ingresoHa = qq * precioNeto / 10;
                const costos = (parseFloat(c.costo_semilla_ha)||0)+(parseFloat(c.costo_labores_ha)||0)+(parseFloat(c.costo_agroquimicos_ha)||0)+(parseFloat(c.costo_fertilizantes_ha)||0)+(parseFloat(c.costo_cosecha_ha)||0)+(parseFloat(c.costo_otros_ha)||0);
                return { ingresoHa, costos, mbHa: ingresoHa - costos, precioNeto };
              };
              const saveCultivo = async () => {
                if (!newCultivo.cultivo) return;
                const tok = session?.access_token || SUPABASE_KEY;
                const r = calcMBCultivo(newCultivo);
                const body = { campana: newCultivo.campana, cultivo: newCultivo.cultivo,
                  rendimiento_obj_qq: parseFloat(newCultivo.rendimiento_obj_qq)||null,
                  precio_grano_usd: parseFloat(newCultivo.precio_grano_usd)||null,
                  flete_usd: parseFloat(newCultivo.flete_usd)||null,
                  pct_comercializacion: parseFloat(newCultivo.pct_comercializacion)||2,
                  costo_semilla_ha: parseFloat(newCultivo.costo_semilla_ha)||0,
                  costo_labores_ha: parseFloat(newCultivo.costo_labores_ha)||0,
                  costo_agroquimicos_ha: parseFloat(newCultivo.costo_agroquimicos_ha)||0,
                  costo_fertilizantes_ha: parseFloat(newCultivo.costo_fertilizantes_ha)||0,
                  costo_cosecha_ha: parseFloat(newCultivo.costo_cosecha_ha)||0,
                  costo_otros_ha: parseFloat(newCultivo.costo_otros_ha)||0,
                  notas: newCultivo.notas };
                if (editandoCultivo) {
                  await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivos?id=eq.${editandoCultivo.id}`, {
                    method: 'PATCH', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                    body: JSON.stringify(body)
                  });
                  setEditandoCultivo(null);
                } else {
                  await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivos`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                    body: JSON.stringify(body)
                  });
                }
                fetchPlanCultivos();
                setShowFormCultivo(false);
                setNewCultivo(p => ({ ...p, cultivo: "", rendimiento_obj_qq: "", precio_grano_usd: "", flete_usd: "", costo_semilla_ha: "", costo_labores_ha: "", costo_agroquimicos_ha: "", costo_fertilizantes_ha: "", costo_cosecha_ha: "", costo_otros_ha: "", notas: "" }));
              };
              const deleteCultivo = async (id) => {
                if (!window.confirm("¿Eliminar este cultivo?")) return;
                const tok = session?.access_token || SUPABASE_KEY;
                await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivos?id=eq.${id}`, { method: 'DELETE', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` } });
                fetchPlanCultivos();
              };

              // Cultivos filtrados por campaña
              const cultivosFiltrados = planCultivos.filter(c => filtroCampana === "todas" || c.campana === filtroCampana);

              return (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                {/* Header */}
                <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <h2 style={st.sectionTitle}>🌱 Planificación</h2>
                    {/* Tabs campaña actual / futura */}
                    <div style={{ display: "flex", border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
                      {[["actual", campanaActualPlan], ["futura", campanaFuturaPlan]].map(([k, camp]) => {
                        const cantLotes = planificacion.filter(p => p.campana === camp && (filtroEmpresa === "todas" || p.empresa_nombre?.trim() === filtroEmpresa?.trim())).length;
                        return (
                          <button key={k} onClick={() => setCampanaVistaPlan(k)}
                            style={{ padding: "7px 16px", border: "none", cursor: "pointer", fontSize: 12,
                              fontWeight: campanaVistaPlan===k ? 700 : 400,
                              background: campanaVistaPlan===k ? C.accent : C.surface,
                              color: campanaVistaPlan===k ? "#fff" : C.textDim }}>
                            {k === "actual" ? "📅" : "🔮"} Campaña {camp}
                            <span style={{ marginLeft: 5, fontSize: 10, opacity: 0.8 }}>({cantLotes})</span>
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {[["lotes","📋 Por Empresa"],["cultivos","🌿 Costos por Cultivo"]].map(([k,l]) => (
                        <button key={k} onClick={() => setSubTabPlan(k)}
                          style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${subTabPlan===k?C.accent:C.border}`,
                            background: subTabPlan===k?C.accentLight:C.surface, color: subTabPlan===k?C.accent:C.textDim,
                            cursor: "pointer", fontSize: 12, fontWeight: subTabPlan===k?700:400 }}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    {subTabPlan === "lotes" && (<>
                    <input id="inputPlanExcel" type="file" accept=".xlsx,.xls" style={{ display: "none" }}
                      onChange={e => { if(e.target.files[0]) { importarPlanExcel(e.target.files[0]); e.target.value=""; }}} />
                    <button onClick={() => document.getElementById('inputPlanExcel').click()}
                      disabled={importandoPlan}
                      style={{ ...st.btnPrimary, background: importandoPlan ? C.muted : "#2980b9", opacity: importandoPlan ? 0.7 : 1 }}>
                      {importandoPlan ? "⏳ Importando..." : "📥 Importar Excel"}
                    </button>
                    <button onClick={descargarPlantillaPlan}
                      style={{ ...st.btnSecondary, fontSize: 12 }}>
                      📋 Plantilla Excel
                    </button>
                    </>)}
                    {subTabPlan === "cultivos" && (<>
                      <input ref={fileImportCultivosRef} type="file" accept=".xlsx,.xls" onChange={e => e.target.files[0] && importarCultivosExcel(e.target.files[0])} style={{ display: "none" }} />
                      <button onClick={() => fileImportCultivosRef.current?.click()} disabled={importandoCultivos}
                        style={{ ...st.btnPrimary, background: importandoCultivos ? C.muted : "#2980b9", opacity: importandoCultivos ? 0.7 : 1 }}>
                        {importandoCultivos ? "⏳ Importando..." : "📥 Importar Excel"}
                      </button>
                      <button onClick={() => { setEditandoCultivo(null); setShowFormCultivo(!showFormCultivo); }} style={st.btnPrimary}>
                        + Nuevo Cultivo
                      </button>
                    </>)}
                    <button onClick={() => exportCSV(planFiltrado, [
                      {label:"Campaña",get:p=>p.campana},{label:"Empresa",get:p=>p.empresa_nombre},{label:"Campo",get:p=>p.campo_nombre},
                      {label:"Lote",get:p=>p.lote_nombre},{label:"Ha",get:p=>p.hectareas},{label:"Tenencia",get:p=>p.tenencia},
                      {label:"Rotación",get:p=>p.rotacion},{label:"Cultivo",get:p=>p.cultivo},{label:"Variedad",get:p=>p.variedad},
                      {label:"Rinde obj (qq/ha)",get:p=>p.rendimiento_obj_qq},{label:"Precio USD/tn",get:p=>p.precio_grano_usd},
                      {label:"Costo Semilla",get:p=>p.costo_semilla_ha},{label:"Costo Labores",get:p=>p.costo_labores_ha},
                      {label:"Costo Agroquímicos",get:p=>p.costo_agroquimicos_ha},{label:"Costo Fertilizantes",get:p=>p.costo_fertilizantes_ha},
                      {label:"Costo Cosecha",get:p=>p.costo_cosecha_ha},{label:"Cultivo Húmedo",get:p=>p.cultivo_humedo||""},{label:"MB esperado/ha",get:p=>calcMBPlan(p).mbHa.toFixed(0)},
                    ], `planificacion_${campanaPlan}.csv`)} style={{ ...st.btnPrimary, background: "#27ae60" }}>📊 Excel</button>
                    <button onClick={() => { setShowFormPlan(!showFormPlan); setEmpresaActivaPlan(null); setCampoActivoPlan(null); setNewPlan(p => ({...p, campana: campanaVistaActual})); }} style={st.btnPrimary}>+ Nueva Planificación</button>
                  </div>
                </div>

                {/* ── SUB-TAB: COSTOS POR CULTIVO ── */}
                {subTabPlan === "cultivos" && (() => {
                  // Precios del catálogo filtrados por empresa
                  const preciosCatalogo = productos.filter(p =>
                    !empresaCultivo || !p.empresa_nombre || p.empresa_nombre?.trim() === empresaCultivo?.trim()
                  );
                  const getPrecio = (nombre) => {
                    // Buscar precio de empresa primero, luego general
                    const empMatch = productos.find(p => p.empresa_nombre?.trim() === empresaCultivo?.trim() && p.nombre?.toLowerCase() === nombre?.toLowerCase());
                    const genMatch = productos.find(p => !p.empresa_nombre && p.nombre?.toLowerCase() === nombre?.toLowerCase());
                    return empMatch?.precio_usd || genMatch?.precio_usd || 0;
                  };

                  // Líneas base por tipo de cultivo (plantilla inicial)
                  const PLANTILLA_LABORES = [
                    { tipo: "Labor", nombre: "Labor - Siembra Gruesa", dosis: 1, unidad: "ha" },
                    { tipo: "Labor", nombre: "Labor - Pulverización Terrestre", dosis: 4, unidad: "ha" },
                    { tipo: "Labor", nombre: "Labor - Pulverización Aérea", dosis: 1, unidad: "ha" },
                    { tipo: "Labor", nombre: "Labor - Fertilización Liquida", dosis: 0, unidad: "ha" },
                    { tipo: "Labor", nombre: "Labor - Cosecha Soja", dosis: 1, unidad: "ha" },
                  ];

                  // Guardar línea de detalle
                  const saveLinea = async (linea) => {
                    const tok = session?.access_token || SUPABASE_KEY;
                    const costo = (parseFloat(linea.dosis)||0) * (parseFloat(linea.precio_usd)||0);
                    if (linea.id) {
                      await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivo_detalle?id=eq.${linea.id}`, {
                        method: 'PATCH', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                        body: JSON.stringify({ ...linea, costo_ha: costo })
                      });
                    } else {
                      await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivo_detalle`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                        body: JSON.stringify({ ...linea, costo_ha: costo })
                      });
                    }
                    fetchPlanDetalle(cultivoActivoId);
                  };

                  const deleteLinea = async (id) => {
                    const tok = session?.access_token || SUPABASE_KEY;
                    await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivo_detalle?id=eq.${id}`, {
                      method: 'DELETE', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` }
                    });
                    fetchPlanDetalle(cultivoActivoId);
                  };

                  const agregarLinea = async (plantilla = null) => {
                    if (!cultivoActivoId) return;
                    const base = plantilla || { tipo: "Agroquímico", nombre: "", dosis: 0, unidad: "cc/ha" };
                    const precio = getPrecio(base.nombre);
                    const tok = session?.access_token || SUPABASE_KEY;
                    await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivo_detalle`, {
                      method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                      body: JSON.stringify({ plan_cultivo_id: cultivoActivoId, tipo: base.tipo, nombre: base.nombre, dosis: base.dosis, unidad: base.unidad, precio_usd: precio, costo_ha: (base.dosis||0)*precio, orden: planDetalle.length })
                    });
                    fetchPlanDetalle(cultivoActivoId);
                  };

                  const cargarPlantilla = async () => {
                    if (!cultivoActivoId) return;
                    for (const l of PLANTILLA_LABORES) {
                      const precio = getPrecio(l.nombre);
                      const tok = session?.access_token || SUPABASE_KEY;
                      await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivo_detalle`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                        body: JSON.stringify({ plan_cultivo_id: cultivoActivoId, tipo: l.tipo, nombre: l.nombre, dosis: l.dosis, unidad: l.unidad, precio_usd: precio, costo_ha: l.dosis*precio, orden: planDetalle.length })
                      });
                    }
                    fetchPlanDetalle(cultivoActivoId);
                  };

                  // Cultivo activo seleccionado
                  const cultivoActivo = cultivosFiltrados.find(c => c.id === cultivoActivoId);

                  // Calcular totales del detalle
                  const totalPorTipo = {};
                  let costoTotalDetalle = 0;
                  planDetalle.forEach(l => {
                    const costo = (parseFloat(l.dosis)||0) * (parseFloat(l.precio_usd)||0);
                    if (!totalPorTipo[l.tipo]) totalPorTipo[l.tipo] = 0;
                    totalPorTipo[l.tipo] += costo;
                    costoTotalDetalle += costo;
                  });

                  // MB con costos del detalle
                  const mbDetalleHa = cultivoActivo ? (() => {
                    const qq = parseFloat(cultivoActivo.rendimiento_obj_qq)||0;
                    const precio = parseFloat(cultivoActivo.precio_grano_usd)||0;
                    const flete = parseFloat(cultivoActivo.flete_usd)||0;
                    const pct = parseFloat(cultivoActivo.pct_comercializacion)||2;
                    const ingresoHa = qq * (precio - flete) * (1 - pct/100) / 10;
                    return ingresoHa - costoTotalDetalle;
                  })() : 0;

                  return (
                  <div>
                    {/* Selector empresa + lista de cultivos */}
                    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
                      {/* Panel izquierdo: lista de cultivos */}
                      <div>
                        <div style={{ marginBottom: 10 }}>
                          <label style={labelSt}>Empresa (para precios)</label>
                          <select value={empresaCultivo} onChange={e => setEmpresaCultivo(e.target.value)} style={{ ...inputSt, cursor: "pointer" }}>
                            <option value="">Precio general</option>
                            {[...new Set(aplicaciones.map(a => a.empresa_nombre).filter(Boolean))].sort().map(e => <option key={e} value={e}>{e}</option>)}
                          </select>
                        </div>

                        {/* Lista cultivos */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          {cultivosFiltrados.length === 0 ? (
                            <div style={{ ...st.card, textAlign: "center", padding: 24, color: C.muted, fontSize: 13 }}>Sin cultivos. Agregá uno.</div>
                          ) : cultivosFiltrados.map(c => {
                            const col = COLORES_CULTIVO[c.cultivo]||C.accent;
                            const isActive = c.id === cultivoActivoId;
                            return (
                              <div key={c.id} onClick={() => { setCultivoActivoId(c.id); fetchPlanDetalle(c.id); }}
                                style={{ background: isActive ? C.accentLight : C.surface, border: `1.5px solid ${isActive ? C.accent : C.border}`, borderLeft: `4px solid ${col}`, borderRadius: 8, padding: "10px 12px", cursor: "pointer" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{c.cultivo}</div>
                                    <div style={{ fontSize: 11, color: C.muted }}>{c.campana} · {c.rendimiento_obj_qq||"—"} qq/ha</div>
                                  </div>
                                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <button onClick={e => { e.stopPropagation(); setEditandoCultivo(c); setNewCultivo({campana:c.campana,cultivo:c.cultivo,rendimiento_obj_qq:c.rendimiento_obj_qq||"",precio_grano_usd:c.precio_grano_usd||"",flete_usd:c.flete_usd||"",pct_comercializacion:c.pct_comercializacion||"2",costo_semilla_ha:c.costo_semilla_ha||"",costo_labores_ha:c.costo_labores_ha||"",costo_agroquimicos_ha:c.costo_agroquimicos_ha||"",costo_fertilizantes_ha:c.costo_fertilizantes_ha||"",costo_cosecha_ha:c.costo_cosecha_ha||"",costo_otros_ha:c.costo_otros_ha||"",notas:c.notas||""}); setShowFormCultivo(true); }} style={{ background: "none", border: `1px solid ${C.border}`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontSize: 11, color: C.textDim }}>✏</button>
                                    <button onClick={e => { e.stopPropagation(); deleteCultivo(c.id); }} style={{ background: "none", border: `1px solid ${C.danger}30`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontSize: 11, color: C.danger }}>del</button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Panel derecho: detalle del cultivo seleccionado */}
                      <div>
                        {/* Formulario nuevo/editar cultivo - siempre visible si showFormCultivo */}
                        {showFormCultivo && (
                          <div style={{ ...st.card, marginBottom: 12, border: `1px solid ${C.accent}30` }}>
                            <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12 }}>{editandoCultivo ? "Editar Cultivo" : "Nuevo Cultivo"}</div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 12 }}>
                              <div><label style={labelSt}>Campaña</label><input type="text" value={newCultivo.campana} onChange={e=>setNewCultivo(p=>({...p,campana:e.target.value}))} style={inputSt}/></div>
                              <div><label style={labelSt}>Cultivo</label>
                                <select value={newCultivo.cultivo} onChange={e=>setNewCultivo(p=>({...p,cultivo:e.target.value}))} style={{...inputSt,cursor:"pointer"}}>
                                  <option value="">Seleccionar...</option>
                                  {["Soja 1ra","Soja 2da","Soja 3ra","Maíz","Maíz 2da","Vc-Maíz","Cs-Maíz","Trigo","Trigo/Soja 2da","Cebada","Girasol","Sorgo","Algodón","Moha/Soja","Ce-Soja","Maíz HAB","Vicia/Maíz","Otro"].map(c=><option key={c} value={c}>{c}</option>)}
                                </select>
                              </div>
                              <div><label style={labelSt}>Rinde (qq/ha)</label><input type="number" value={newCultivo.rendimiento_obj_qq} onChange={e=>setNewCultivo(p=>({...p,rendimiento_obj_qq:e.target.value}))} style={inputSt}/></div>
                              <div><label style={labelSt}>Precio (USD/tn)</label><input type="number" value={newCultivo.precio_grano_usd} onChange={e=>setNewCultivo(p=>({...p,precio_grano_usd:e.target.value}))} style={inputSt}/></div>
                              <div><label style={labelSt}>Flete (USD/tn)</label><input type="number" value={newCultivo.flete_usd} onChange={e=>setNewCultivo(p=>({...p,flete_usd:e.target.value}))} style={inputSt}/></div>
                              <div><label style={labelSt}>% Comerc.</label><input type="number" value={newCultivo.pct_comercializacion} onChange={e=>setNewCultivo(p=>({...p,pct_comercializacion:e.target.value}))} style={inputSt}/></div>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={saveCultivo} style={st.btnPrimary}>💾 Guardar</button>
                              <button onClick={() => { setShowFormCultivo(false); setEditandoCultivo(null); }} style={st.btnSecondary}>Cancelar</button>
                            </div>
                          </div>
                        )}
                        {!cultivoActivo ? (
                          <div style={{ ...st.card, textAlign: "center", padding: 56, color: C.muted }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>👈</div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>Seleccioná un cultivo de la lista</div>
                          </div>
                        ) : (
                          <div>
                            {/* Header del cultivo */}
                            <div style={{ ...st.card, marginBottom: 12 }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                                <div>
                                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{cultivoActivo.cultivo}</div>
                                  <div style={{ fontSize: 12, color: C.muted }}>{cultivoActivo.campana}</div>
                                </div>
                                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                                  <button onClick={async () => {
                                    const tok = session?.access_token || SUPABASE_KEY;
                                    const costoLabores = totalPorTipo["Labor"]||0;
                                    const costoAgroquimicos = (totalPorTipo["Agroquímico"]||0);
                                    const costoSemilla = totalPorTipo["Semilla"]||0;
                                    const costoFertilizantes = totalPorTipo["Fertilizante"]||0;
                                    const costoCosecha = totalPorTipo["Cosecha"]||0;
                                    const costoSeguro = totalPorTipo["Seguro"]||0;
                                    const costoOtros = totalPorTipo["Otro"]||0;
                                    await fetch(`${SUPABASE_URL}/rest/v1/plan_cultivos?id=eq.${cultivoActivoId}`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                                      body: JSON.stringify({
                                        costo_labores_ha: costoLabores,
                                        costo_agroquimicos_ha: costoAgroquimicos,
                                        costo_semilla_ha: costoSemilla,
                                        costo_fertilizantes_ha: costoFertilizantes,
                                        costo_cosecha_ha: costoCosecha,
                                        costo_otros_ha: costoSeguro + costoOtros,
                                      })
                                    });
                                    await fetchPlanCultivos();
                                    alert(`✅ Costos sincronizados para ${cultivoActivo.cultivo}`);
                                  }} style={{ ...st.btnPrimary, background: "#27ae60", fontSize: 12, padding: "6px 14px" }}>
                                    🔄 Sincronizar costos
                                  </button>
                                </div>
                                <div style={{ display: "flex", gap: 16 }}>
                                  {[["Rinde", `${cultivoActivo.rendimiento_obj_qq||"—"} qq/ha`, C.text],
                                    ["Precio", `USD ${cultivoActivo.precio_grano_usd||"—"}/tn`, C.textDim],
                                    ["Ingreso/ha", `USD ${(() => { const qq=parseFloat(cultivoActivo.rendimiento_obj_qq)||0; const p=parseFloat(cultivoActivo.precio_grano_usd)||0; const f=parseFloat(cultivoActivo.flete_usd)||0; const pct=parseFloat(cultivoActivo.pct_comercializacion)||2; return (qq*(p-f)*(1-pct/100)/10).toFixed(0); })()}`, C.accent],
                                    ["Costos/ha", `USD ${costoTotalDetalle.toFixed(0)}`, C.warn],
                                    ["MB/ha", `${mbDetalleHa>=0?"+":""}USD ${mbDetalleHa.toFixed(0)}`, mbDetalleHa>=0?C.accent:C.danger],
                                  ].map(([label, val, color]) => (
                                    <div key={label} style={{ textAlign: "center" }}>
                                      <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                                      <div style={{ fontSize: 15, fontWeight: 700, color, fontFamily: F }}>{val}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Tabla de insumos/labores */}
                            <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                              <div style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, background: C.mutedBg }}>
                                <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700 }}>Insumos y Labores</div>
                                <div style={{ display: "flex", gap: 8 }}>
                                  {planDetalle.length === 0 && <button onClick={cargarPlantilla} style={{ ...st.btnSecondary, fontSize: 11, padding: "4px 10px" }}>📋 Cargar plantilla</button>}
                                  {[["Agroquímico","Agroquímico","cc/ha"],["Labor","Labor","ha"],["Semilla","Semilla","kg/ha"],["Fertilizante","Fertilizante","kg/ha"],["Seguro","Seguro","ha"]].map(([label, tipo, unidad]) => (
                                    <button key={tipo} onClick={() => agregarLinea({ tipo, nombre: "", dosis: 0, unidad })}
                                      style={{ ...st.btnSecondary, fontSize: 11, padding: "4px 10px" }}>+ {label}</button>
                                  ))}
                                </div>
                              </div>
                              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                  <tr>{["TIPO","PRODUCTO / LABOR","DOSIS","UNIDAD","PRECIO USD","COSTO/ha",""].map(h=><th key={h} style={st.th}>{h}</th>)}</tr>
                                </thead>
                                <tbody>
                                  {planDetalle.length === 0 ? (
                                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 24, color: C.muted, fontSize: 13 }}>Sin líneas. Usá los botones de arriba para agregar.</td></tr>
                                  ) : planDetalle.map((l, i) => {
                                    const costoHa = (parseFloat(l.dosis)||0) * (parseFloat(l.precio_usd)||0);
                                    // Opciones de nombre según tipo
                                    const opcionesNombre = l.tipo === "Labor"
                                      ? Object.keys(COSTOS_LABOR_DEFAULT).filter(k => k.startsWith("Labor -"))
                                      : l.tipo === "Seguro"
                                      ? ["Seguro Soja","Seguro Maíz","Seguro Trigo","Seguro Girasol","Seguro Cebada","Seguro Sorgo","Seguro Algodón"]
                                      : [...new Set(preciosCatalogo.map(p => p.nombre).filter(Boolean))].sort();
                                    return (
                                      <tr key={l.id} style={{ background: i%2===0 ? "transparent" : C.mutedBg+"50" }}>
                                        <td style={st.td}>
                                          <select value={l.tipo} onChange={async e => { const updated = {...l, tipo: e.target.value}; await saveLinea(updated); }}
                                            style={{ ...inputSt, margin: 0, fontSize: 12, padding: "4px 8px", width: 110 }}>
                                            {["Labor","Agroquímico","Semilla","Fertilizante","Seguro","Otro"].map(t=><option key={t} value={t}>{t}</option>)}
                                          </select>
                                        </td>
                                        <td style={st.td}>
                                          {(() => {
                                            const busq = busquedaLinea[l.id] !== undefined ? busquedaLinea[l.id] : (l.nombre || "");
                                            const filtradas = opcionesNombre.filter(n => n.toLowerCase().includes(busq.toLowerCase()));
                                            const showDrop = busquedaLinea[l.id] !== undefined && filtradas.length > 0;
                                            return (
                                              <div style={{ position: "relative", minWidth: 220 }}>
                                                <input
                                                  value={busq}
                                                  onChange={e => setBusquedaLinea(p => ({...p, [l.id]: e.target.value}))}
                                                  onFocus={() => setBusquedaLinea(p => ({...p, [l.id]: p[l.id] !== undefined ? p[l.id] : (l.nombre||"")}))}
                                                  onBlur={() => setTimeout(() => setBusquedaLinea(p => { const n={...p}; delete n[l.id]; return n; }), 200)}
                                                  placeholder="Buscar..."
                                                  style={{ ...inputSt, margin: 0, fontSize: 12, padding: "4px 8px", width: "100%" }}
                                                />
                                                {showDrop && (
                                                  <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, zIndex: 999, maxHeight: 220, overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.12)" }}>
                                                    {filtradas.map(n => (
                                                      <div key={n} onMouseDown={async () => {
                                                        const precio = l.tipo === "Labor" ? (COSTOS_LABOR_DEFAULT[n]||0) : getPrecio(n);
                                                        const updated = {...l, nombre: n, precio_usd: precio, costo_ha: (parseFloat(l.dosis)||0)*precio};
                                                        setPlanDetalle(prev => prev.map((x,j) => j===i ? {...x,...updated} : x));
                                                        setBusquedaLinea(p => { const nv={...p}; delete nv[l.id]; return nv; });
                                                        await saveLinea(updated);
                                                      }} style={{ padding: "7px 12px", fontSize: 12, cursor: "pointer", color: C.text, borderBottom: `1px solid ${C.border}30` }}
                                                        onMouseEnter={e => e.currentTarget.style.background = C.accentLight}
                                                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                                                        {n}
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                              </div>
                                            );
                                          })()}
                                        </td>
                                        <td style={st.td}>
                                          <input type="number" value={l.dosis||""} onChange={e => setPlanDetalle(prev => prev.map((x,j) => j===i ? {...x, dosis: e.target.value, costo_ha: (parseFloat(e.target.value)||0)*(parseFloat(x.precio_usd)||0)} : x))}
                                            onBlur={async e => { await saveLinea({...l, dosis: e.target.value, costo_ha: (parseFloat(e.target.value)||0)*(parseFloat(l.precio_usd)||0)}); }}
                                            style={{ ...inputSt, margin: 0, fontSize: 12, padding: "4px 8px", width: 70 }} />
                                        </td>
                                        <td style={st.td}>
                                          <input value={l.unidad||""} onChange={e => setPlanDetalle(prev => prev.map((x,j) => j===i ? {...x, unidad: e.target.value} : x))}
                                            onBlur={async e => { await saveLinea({...l, unidad: e.target.value}); }}
                                            style={{ ...inputSt, margin: 0, fontSize: 12, padding: "4px 8px", width: 70 }} />
                                        </td>
                                        <td style={st.td}>
                                          <input type="number" value={l.precio_usd||""} onChange={e => setPlanDetalle(prev => prev.map((x,j) => j===i ? {...x, precio_usd: e.target.value, costo_ha: (parseFloat(l.dosis)||0)*(parseFloat(e.target.value)||0)} : x))}
                                            onBlur={async e => { await saveLinea({...l, precio_usd: e.target.value, costo_ha: (parseFloat(l.dosis)||0)*(parseFloat(e.target.value)||0)}); }}
                                            style={{ ...inputSt, margin: 0, fontSize: 12, padding: "4px 8px", width: 80 }} />
                                        </td>
                                        <td style={{...st.td, fontFamily: F, fontWeight: 700, color: C.text}}>USD {costoHa.toFixed(2)}</td>
                                        <td style={st.td}>
                                          <button onClick={() => deleteLinea(l.id)} style={{ background: "none", border: `1px solid ${C.danger}30`, borderRadius: 5, padding: "2px 7px", cursor: "pointer", fontSize: 11, color: C.danger }}>✕</button>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                                {planDetalle.length > 0 && (
                                  <tfoot>
                                    {Object.entries(totalPorTipo).map(([tipo, total]) => (
                                      <tr key={tipo} style={{ background: C.mutedBg }}>
                                        <td colSpan={5} style={{ ...st.td, textAlign: "right", color: C.textDim, fontSize: 11 }}>Subtotal {tipo}</td>
                                        <td style={{ ...st.td, fontFamily: F, fontWeight: 600, color: C.textDim }}>USD {total.toFixed(2)}</td>
                                        <td style={st.td}></td>
                                      </tr>
                                    ))}
                                    <tr style={{ background: C.accentLight }}>
                                      <td colSpan={5} style={{ ...st.td, textAlign: "right", fontWeight: 700, color: C.text }}>TOTAL COSTOS/ha</td>
                                      <td style={{ ...st.td, fontFamily: F, fontWeight: 700, fontSize: 14, color: C.warn }}>USD {costoTotalDetalle.toFixed(2)}</td>
                                      <td style={st.td}></td>
                                    </tr>
                                    <tr style={{ background: mbDetalleHa>=0 ? C.accentLight : C.dangerLight }}>
                                      <td colSpan={5} style={{ ...st.td, textAlign: "right", fontWeight: 700, color: C.text }}>MB ESPERADO/ha</td>
                                      <td style={{ ...st.td, fontFamily: F, fontWeight: 700, fontSize: 16, color: mbDetalleHa>=0?C.accent:C.danger }}>{mbDetalleHa>=0?"+":""}USD {mbDetalleHa.toFixed(2)}</td>
                                      <td style={st.td}></td>
                                    </tr>
                                  </tfoot>
                                )}
                              </table>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })()}

                {subTabPlan === "lotes" && <>
                {/* Formulario nuevo lote - visible siempre que showFormPlan */}
                {showFormPlan && !empresaActivaPlan && (() => {
                  // Nuevo flujo: empresa → campo → lotes
                  // ── Estructura dinámica desde BD (con fallback hardcodeado si está vacía) ──
                  const EMPRESAS_PLAN = EMPRESAS_MOV;
                  const empresasPlan = EMPRESAS_PLAN.map(e => e.empresa).sort();
                  const empSelVal = newPlan.empresa_nombre;
                  const campoSelVal = newPlan.campo_nombre;
                  const camposEmp = empSelVal
                    ? (EMPRESAS_PLAN.find(e => e.empresa === empSelVal)?.campos.map(c => c.campo) || []).sort()
                    : [];

                  return (
                  <div style={{ ...st.card, marginBottom: 20, border: `1px solid ${C.accent}30` }}>
                    <div style={{ fontSize: 12, color: C.accent, letterSpacing: 1, marginBottom: campoPlanMsg ? 10 : 20, fontFamily: F, textTransform: "uppercase", fontWeight: 700 }}>
                      Nueva Planificación
                    </div>
                    {campoPlanMsg && (
                      <div style={{ padding: "12px 16px", background: "#f0faf3", border: "1px solid #1f6b3540", borderRadius: 10, color: "#1f6b35", fontSize: 13, fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                        {campoPlanMsg}
                      </div>
                    )}

                    {/* Paso 1: Elegir empresa */}
                    <div style={{ marginBottom: 16 }}>
                      <label style={labelSt}>1. Empresa</label>
                      <select value={empSelVal} onChange={e => setNewPlan(p => ({...p, empresa_nombre: e.target.value, campo_nombre: ""}))}
                        style={{ ...inputSt, maxWidth: 340, cursor: "pointer" }}>
                        <option value="">Seleccionar empresa...</option>
                        {empresasPlan.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>

                    {/* Paso 2: Elegir campo */}
                    {empSelVal && (
                      <div style={{ marginBottom: 20 }}>
                        <label style={labelSt}>2. Campo</label>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {camposEmp.map(campo => (
                            <button key={campo} onClick={() => setNewPlan(p => ({...p, campo_nombre: campo}))}
                              style={{ padding: "8px 18px", borderRadius: 8, border: `1.5px solid ${campoSelVal === campo ? C.accent : C.border}`,
                                background: campoSelVal === campo ? C.accentLight : C.surface,
                                color: campoSelVal === campo ? C.accent : C.textDim,
                                cursor: "pointer", fontSize: 13, fontWeight: campoSelVal === campo ? 700 : 400 }}>
                              {campo}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Paso 3: Vista de lotes del campo seleccionado */}
                    {empSelVal && campoSelVal && (() => {
                      // Lotes del campo desde estructura hardcodeada + has promedio de aplicaciones si existen
                      const lotesHardcoded = EMPRESAS_PLAN.find(e => e.empresa === empSelVal)?.campos.find(c => c.campo === campoSelVal)?.lotes || [];
                      const lotesDelCampo = lotesHardcoded.map(lote => {
                        const key = String(lote);
                        // Prioridad: ha de estructura → max de aplicaciones
                        const estrLote = estructuraLotes.find(e =>
                          e.empresa_nombre?.trim() === empSelVal?.trim() &&
                          e.campo_nombre === campoSelVal &&
                          String(e.lote_nombre) === key
                        );
                        const haEstr = estrLote?.hectareas ? parseFloat(estrLote.hectareas) : null;
                        const appsLote = aplicaciones.filter(x => x.empresa_nombre?.trim() === empSelVal?.trim() && x.campo_nombre === campoSelVal && String(x.lote_nombre) === key);
                        const haMax = appsLote.length > 0 ? Math.max(...appsLote.map(x => parseFloat(x.superficie_ha)||0)) : null;
                        return { lote: key, ha: haEstr ? Math.round(haEstr) : (haMax ? Math.round(haMax) : null) };
                      });

                      // Estado local para los datos de cada lote (usamos newPlan como buffer para el lote actual)
                      const campanaActual = newPlan.campana;
                      const CULTIVOS_LIST = ["Soja 1ra","Soja 2da","Soja 3ra","Maíz","Maíz 2da","Vc-Maíz","Cs-Maíz","Trigo","Trigo/Soja 2da","Cebada","Girasol","Sorgo","Algodón","Moha/Soja","Ce-Soja","Maíz HAB","Vicia/Maíz","Otro"];

                      // Estado por lote usando un Map en window (truco para IIFE)
                      if (!window._lotePlanData) window._lotePlanData = {};
                      // Precargar datos ya guardados en Supabase para este campo
                      if (empSelVal && campoSelVal) {
                        planificacion.filter(p =>
                          p.empresa_nombre?.trim() === empSelVal?.trim() &&
                          p.campo_nombre === campoSelVal &&
                          p.campana === campanaActual
                        ).forEach(p => {
                          const key = `${empSelVal}|${campoSelVal}|${p.lote_nombre}`;
                          if (!window._lotePlanData[key]) {
                            const tipoAlq = p.alquiler_tipo || (parseFloat(p.alquiler_pct) > 0 ? "pct_cultivo" : "qq_soja");
                            const valorAlq = tipoAlq === "pct_cultivo"
                              ? String(p.alquiler_pct || "")
                              : String(p.alquiler_qq_ha || "");
                            window._lotePlanData[key] = {
                              tenencia: p.tenencia || "PROPIO",
                              alquiler_tipo: tipoAlq,
                              alquiler_valor: valorAlq,
                              cultivo: p.cultivo || "",
                              rotacion: p.rotacion || "",
                              variedad: p.variedad || "",
                              ha: p.hectareas || null,
                            };
                          }
                        });
                      }
                      const getLoteData = (lote, haDefault) => {
                        const cached = window._lotePlanData[`${empSelVal}|${campoSelVal}|${lote}`];
                        if (cached) return cached;
                        // Precargar desde estructura si existe
                        const estr = estructuraLotes.find(e =>
                          e.empresa_nombre?.trim() === empSelVal?.trim() &&
                          e.campo_nombre === campoSelVal &&
                          String(e.lote_nombre) === String(lote)
                        );
                        return {
                          tenencia: estr?.tenencia || "PROPIO",
                          alquiler_tipo: estr?.alquiler_tipo || "qq_soja",
                          alquiler_valor: estr?.alquiler_tipo === "pct_cultivo"
                            ? String(estr?.alquiler_pct || "")
                            : String(estr?.alquiler_qq_ha || ""),
                          cultivo: "", rotacion: "", variedad: "",
                          ha: estr?.hectareas || haDefault || null,
                        };
                      };
                      const setLoteData = (lote, data) => {
                        window._lotePlanData[`${empSelVal}|${campoSelVal}|${lote}`] = { ...getLoteData(lote), ...data };
                      };

                      const guardarTodosLotes = async () => {
                        const tok = session?.access_token || SUPABASE_KEY;
                        let ok = 0;
                        for (const { lote, ha } of lotesDelCampo) {
                          const d = getLoteData(lote, ha);
                          if (!d.cultivo) continue; // solo guardar lotes con cultivo

                          // Calcular alquiler en USD/ha
                          let alquiler_qq_ha = 0;
                          let alquiler_pct = 0;
                          if (d.alquiler_tipo === "qq_soja") {
                            alquiler_qq_ha = parseFloat(d.alquiler_valor)||0;
                          } else {
                            alquiler_pct = parseFloat(d.alquiler_valor)||0;
                          }

                          // Ver si ya existe
                          const existente = planificacion.find(p =>
                            p.empresa_nombre === empSelVal && p.campo_nombre === campoSelVal &&
                            String(p.lote_nombre) === String(lote) && p.campana === campanaActual
                          );

                          const body = {
                            campana: campanaActual, empresa_nombre: empSelVal, campo_nombre: campoSelVal,
                            lote_nombre: lote, hectareas: ha,
                            tenencia: d.tenencia, rotacion: d.rotacion||null,
                            cultivo: d.cultivo||null, cultivo_humedo: d.cultivo_humedo||null,
                            variedad: d.variedad||null,
                            alquiler_qq_ha: alquiler_qq_ha,
                            alquiler_pct: alquiler_pct,
                          };

                          if (existente) {
                            await fetch(`${SUPABASE_URL}/rest/v1/planificacion?id=eq.${existente.id}`, {
                              method: 'PATCH', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                              body: JSON.stringify(body)
                            });
                          } else {
                            await fetch(`${SUPABASE_URL}/rest/v1/planificacion`, {
                              method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                              body: JSON.stringify(body)
                            });
                          }
                          ok++;
                        }
                        // 1. Recargar planificacion con datos frescos
                        await fetchPlanificacion();
                        // 2. Auto-sincronizar cultivos → monitoreos
                        const norm = s => String(s||"").trim().toLowerCase();
                            const normLote = (a, b) => { if (norm(a)===norm(b)) return true; const nA=(norm(a).match(/\d+$/)||[])[0]; const nB=(norm(b).match(/\d+$/)||[])[0]; return nA&&nB&&nA===nB; };
                        // Usar planificacion ya recargado en estado
                        const planActFresh = planificacion.filter(p =>
                          String(p.empresa_nombre||"").trim() === String(empSelVal||"").trim() &&
                          String(p.campo_nombre||"").trim() === String(campoSelVal||"").trim()
                        );
                        let sincronizados = 0;
                        for (const p of (Array.isArray(planActFresh)?planActFresh:[]).filter(p=>p.cultivo)) {
                          const mLotes = monitoreos.filter(m =>
                            norm(m.empresa) === norm(empSelVal) &&
                            norm(m.campo) === norm(campoSelVal) &&
                            normLote(m.lote, p.lote_nombre)
                          );
                          for (const m of mLotes) {
                            await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${m.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                              body: JSON.stringify({ cultivo: p.cultivo })
                            });
                            sincronizados++;
                          }
                        }
                        // 3. Limpiar cache local y volver al paso 2 (elegir campo)
                        window._lotePlanData = {};
                        setNewPlan(p => ({...p, campo_nombre: ""}));
                        setCampoPlanMsg(`✅ "${campoSelVal}" — ${ok} lote${ok!==1?"s":""} guardado${ok!==1?"s":""}${sincronizados>0?` · 🔄 ${sincronizados} monitoreos`:""}. Elegí el siguiente campo o tocá Terminar.`);
                        setTimeout(() => setCampoPlanMsg(""), 6000);
                      };

                      return (
                        <div>
                          <div style={{ fontSize: 11, color: C.accent, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 12, borderBottom: `1px solid ${C.border}`, paddingBottom: 8 }}>
                            3. Lotes — {campoSelVal}
                            <span style={{ marginLeft: 12, color: C.muted, fontSize: 11 }}>Campaña: {campanaActual}</span>
                          </div>

                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                              <thead>
                                <tr style={{ background: C.mutedBg }}>
                                  {["LOTE","HA","TENENCIA","ALQUILER TIPO","VALOR ALQ.","ANTECESOR","CULTIVO","VARIEDAD"].map(h =>
                                    <th key={h} style={{ ...st.th, fontSize: 10 }}>{h}</th>
                                  )}
                                </tr>
                              </thead>
                              <tbody>
                                {lotesDelCampo.map(({ lote, ha }, idx) => {
                                  const d = getLoteData(lote, ha);
                                  const plantilla = planCultivos.find(c => c.cultivo === d.cultivo);
                                  // Calcular alquiler preview
                                  let alqPreview = "";
                                  if (d.alquiler_valor && plantilla) {
                                    const rinde = parseFloat(plantilla.rendimiento_obj_qq)||0;
                                    const precio = parseFloat(plantilla.precio_grano_usd)||0;
                                    if (d.alquiler_tipo === "qq_soja") {
                                      const precioSoja = planCultivos.find(c => c.cultivo.toLowerCase().includes("soja"))?.precio_grano_usd || precio;
                                      alqPreview = `≈ USD ${(parseFloat(d.alquiler_valor) * precioSoja / 10).toFixed(0)}/ha`;
                                    } else {
                                      const alqQq = rinde * (parseFloat(d.alquiler_valor)||0) / 100;
                                      alqPreview = `≈ ${alqQq.toFixed(1)} qq = USD ${(alqQq * precio / 10).toFixed(0)}/ha`;
                                    }
                                  }
                                  return (
                                    <tr key={lote + "-" + (ha||0)} style={{ borderBottom: `1px solid ${C.border}`, background: idx%2===0?"transparent":C.mutedBg+"40" }}>
                                      <td style={{ ...st.td, fontWeight: 700, color: C.text }}>
                                        <input type="text" defaultValue={lote}
                                          onBlur={async e => {
                                            const nuevoNombre = e.target.value.trim();
                                            if (!nuevoNombre || nuevoNombre === lote) return;
                                            const tok = await getValidToken();
                                            // Actualizar en Supabase si ya existe
                                            const existing = planificacion.find(p => p.empresa_nombre?.trim() === empSelVal?.trim() && p.campo_nombre === campoSelVal && p.lote_nombre === lote);
                                            if (existing) {
                                              await fetch(`${SUPABASE_URL}/rest/v1/planificacion?id=eq.${existing.id}`, {
                                                method: "PATCH",
                                                headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                                                body: JSON.stringify({ lote_nombre: nuevoNombre })
                                              });
                                              await fetchPlanificacion();
                                            }
                                            // Actualizar window._lotePlanData
                                            const oldKey = `${empSelVal}|${campoSelVal}|${lote}`;
                                            const newKey = `${empSelVal}|${campoSelVal}|${nuevoNombre}`;
                                            if (window._lotePlanData[oldKey]) {
                                              window._lotePlanData[newKey] = window._lotePlanData[oldKey];
                                              delete window._lotePlanData[oldKey];
                                            }
                                          }}
                                          style={{ fontWeight: 700, color: C.text, background: "transparent", border: `1px dashed ${C.border}`, borderRadius: 5, padding: "2px 6px", width: 120, fontSize: 12, outline: "none" }}
                                          onFocus={e => e.target.style.border = `1px solid ${C.accent}`}
                                        />
                                      </td>
                                      <td style={{ ...st.td }}>
                                        <input type="number" defaultValue={d.ha||""} placeholder="ha"
                                          onChange={e => setLoteData(lote, { ha: parseFloat(e.target.value)||null })}
                                          style={{ ...inputSt, margin: 0, padding: "3px 6px", width: 60, fontSize: 12 }} />
                                      </td>
                                      <td style={{ ...st.td }}>
                                        <select defaultValue={d.tenencia} onChange={e => setLoteData(lote, { tenencia: e.target.value })}
                                          style={{ ...inputSt, margin: 0, padding: "3px 6px", width: 95, fontSize: 11, cursor: "pointer" }}>
                                          <option value="PROPIO">Propio</option>
                                          <option value="ALQUILADO">Alquilado</option>
                                        </select>
                                      </td>
                                      <td style={{ ...st.td }}>
                                        <select defaultValue={d.alquiler_tipo} onChange={e => setLoteData(lote, { alquiler_tipo: e.target.value })}
                                          style={{ ...inputSt, margin: 0, padding: "3px 6px", width: 140, fontSize: 11, cursor: "pointer" }}>
                                          <option value="qq_soja">Arrend. qq soja/ha</option>
                                          <option value="pct_cultivo">Aparcería % cultivo</option>
                                        </select>
                                      </td>
                                      <td style={{ ...st.td }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                          <input type="number" defaultValue={d.alquiler_valor} placeholder={d.alquiler_tipo === "qq_soja" ? "qq" : "%"}
                                            onChange={e => setLoteData(lote, { alquiler_valor: e.target.value })}
                                            style={{ ...inputSt, margin: 0, padding: "3px 6px", width: 60, fontSize: 12 }} />
                                          {alqPreview && <span style={{ fontSize: 10, color: C.accent }}>{alqPreview}</span>}
                                        </div>
                                      </td>
                                      <td style={{ ...st.td }}>
                                        <input type="text" defaultValue={d.rotacion} placeholder="Antecesor"
                                          onChange={e => setLoteData(lote, { rotacion: e.target.value })}
                                          style={{ ...inputSt, margin: 0, padding: "3px 6px", width: 90, fontSize: 11 }} />
                                      </td>
                                      <td style={{ ...st.td }}>
                                        <select defaultValue={d.cultivo} onChange={e => setLoteData(lote, { cultivo: e.target.value })}
                                          style={{ ...inputSt, margin: 0, padding: "3px 6px", width: 110, fontSize: 11, cursor: "pointer",
                                            background: d.cultivo ? (COLORES_CULTIVO[d.cultivo]||C.accent)+"15" : "",
                                            color: d.cultivo ? (COLORES_CULTIVO[d.cultivo]||C.accent) : C.textDim,
                                            fontWeight: d.cultivo ? 700 : 400 }}>
                                          <option value="">— elegir —</option>
                                          {CULTIVOS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                      </td>

                                      <td style={{ ...st.td }}>
                                        <input type="text" defaultValue={d.variedad} placeholder="Variedad"
                                          onChange={e => setLoteData(lote, { variedad: e.target.value })}
                                          style={{ ...inputSt, margin: 0, padding: "3px 6px", width: 90, fontSize: 11 }} />
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                            <button onClick={guardarTodosLotes} style={st.btnPrimary}>💾 Guardar este campo → continuar</button>

                            <button onClick={async () => {
                              const tok = await getValidToken();
                              const norm = s => String(s||"").trim().toLowerCase();
                            const normLote = (a, b) => { if (norm(a)===norm(b)) return true; const nA=(norm(a).match(/\d+$/)||[])[0]; const nB=(norm(b).match(/\d+$/)||[])[0]; return nA&&nB&&nA===nB; };
                              // Usar planificacion del estado + refresco
                              await fetchPlanificacion();
                              const norm2 = s => String(s||"").trim().toLowerCase();
                              const planCampo = planificacion.filter(p =>
                                norm2(p.empresa_nombre) === norm2(empSelVal) &&
                                norm2(p.campo_nombre) === norm2(campoSelVal) &&
                                p.cultivo
                              );
                              if (planCampo.length === 0) { alert("No hay lotes con cultivo cargado en planificación para este campo.\nGuardá primero la planificación."); return; }
                              let actualizados = 0;
                              for (const p of planCampo) {
                                const mLote = monitoreos.filter(m =>
                                  norm(m.empresa) === norm(empSelVal) &&
                                  norm(m.campo) === norm(campoSelVal) &&
                                  normLote(m.lote, p.lote_nombre)
                                );
                                for (const m of mLote) {
                                  await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${m.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                                    body: JSON.stringify({ cultivo: p.cultivo })
                                  });
                                  actualizados++;
                                }
                              }
                              setMonitoreos(prev => prev.map(m => {
                                const match = planCampo.find(p =>
                                  norm(p.empresa_nombre) === norm(m.empresa) &&
                                  norm(p.campo_nombre) === norm(m.campo) &&
                                  norm(p.lote_nombre) === norm(m.lote)
                                );
                                return match ? { ...m, cultivo: match.cultivo } : m;
                              }));
                              fetchPlanificacion();
                              alert(`✓ ${actualizados} monitoreo${actualizados!==1?"s":""} actualizados con el cultivo de la planificación.`);
                            }} style={{ ...st.btnPrimary, background: "#2980b9" }}>🔄 Sincronizar cultivos → Monitoreos</button>
                            <button onClick={() => { setShowFormPlan(false); window._lotePlanData = {}; setNewPlan(p => ({...p, empresa_nombre: "", campo_nombre: ""})); }} style={st.btnSecondary}>✓ Terminar planificación</button>
                          </div>
                        </div>
                      );
                    })()}

                    {!campoSelVal && empSelVal && (
                      <div style={{ color: C.muted, fontSize: 13, fontStyle: "italic" }}>Seleccioná un campo para ver sus lotes.</div>
                    )}
                    {!empSelVal && (
                      <div style={{ color: C.muted, fontSize: 13, fontStyle: "italic" }}>Seleccioná una empresa para empezar.</div>
                    )}
                  </div>
                  );
                })()}

                {/* ── VISTA EMPRESA ACTIVA ── */}
                {empresaActivaPlan ? (() => {
                  const campanaEmpresa = filtroCampana !== "todas" ? filtroCampana : newPlan.campana;

                  // Lotes YA planificados para esta empresa/campaña
                  const lotesGuardados = planificacion.filter(p =>
                    p.empresa_nombre === empresaActivaPlan && p.campana === campanaEmpresa
                  );

                  // Todos los campos/lotes conocidos de aplicaciones para esta empresa
                  // Fuente de verdad: lista EMPRESAS_PLAN (idéntica a la app móvil)
                  const empPlanData = EMPRESAS_MOV.find(e => e.empresa === empresaActivaPlan);
                  const lotesConocidos = [];
                  if (empPlanData) {
                    empPlanData.campos.forEach(c => {
                      (c.lotes || []).forEach(lote => {
                        lotesConocidos.push({ campo: c.campo, lote });
                      });
                    });
                  }
                  // Agregar también lotes de aplicaciones que no estén en la lista fija
                  const vistos = new Set(lotesConocidos.map(l => `${l.campo}|${l.lote}`));
                  aplicaciones.filter(a => a.empresa_nombre?.trim() === empresaActivaPlan?.trim()).forEach(a => {
                    const key = `${a.campo_nombre}|${a.lote_nombre}`;
                    if (!vistos.has(key) && a.campo_nombre && a.lote_nombre) {
                      vistos.add(key);
                      lotesConocidos.push({ campo: a.campo_nombre, lote: a.lote_nombre });
                    }
                  });
                  lotesConocidos.sort((a,b) => a.campo.localeCompare(b.campo) || String(a.lote).localeCompare(String(b.lote)));

                  // Merge: lotes conocidos + datos guardados
                  const filas = lotesConocidos.map(lc => {
                    const guardado = lotesGuardados.find(p => p.campo_nombre === lc.campo && String(p.lote_nombre) === String(lc.lote));
                    return { campo: lc.campo, lote: lc.lote, guardado };
                  });
                  // Agregar lotes planificados que no están en la lista
                  lotesGuardados.forEach(p => {
                    if (!filas.find(f => f.campo === p.campo_nombre && String(f.lote) === String(p.lote_nombre))) {
                      filas.push({ campo: p.campo_nombre, lote: p.lote_nombre, guardado: p });
                    }
                  });

                  // Guardar/actualizar un lote
                  const saveLotePlan = async (campo, lote, datos) => {
                    const tok = session?.access_token || SUPABASE_KEY;
                    const existente = lotesGuardados.find(p => p.campo_nombre === campo && String(p.lote_nombre) === String(lote));
                    if (existente) {
                      await fetch(`${SUPABASE_URL}/rest/v1/planificacion?id=eq.${existente.id}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                        body: JSON.stringify(datos)
                      });
                    } else {
                      await fetch(`${SUPABASE_URL}/rest/v1/planificacion`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: 'return=minimal' },
                        body: JSON.stringify({ campana: campanaEmpresa, empresa_nombre: empresaActivaPlan, campo_nombre: campo, lote_nombre: lote, ...datos })
                      });
                    }
                    fetchPlanificacion();
                  };

                  // Eliminar planificación completa de la empresa
                  const eliminarEmpresaPlan = async () => {
                    if (!window.confirm(`¿Eliminar TODA la planificación de ${empresaActivaPlan}?`)) return;
                    const tok = session?.access_token || SUPABASE_KEY;
                    for (const p of lotesGuardados) {
                      await fetch(`${SUPABASE_URL}/rest/v1/planificacion?id=eq.${p.id}`, {
                        method: 'DELETE', headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}` }
                      });
                    }
                    fetchPlanificacion();
                  };

                  // Detectar rotaciones en planificación
                  const CINV = ["Trigo","Cebada","Ce-Soja","Colza","Garbanzo"];
                  const CVR2 = ["Soja 2da","Maíz 2da","Soja 3ra"];
                  const CCS  = ["Cultivo de Servicio","CULTIVO DE SERVICIO","Cultivo de servicio","Vicia","VICIA","Cobertura","COBERTURA"];
                  const cultivosPorFilaKey = {};
                  filas.forEach(f => {
                    if (!f.guardado?.cultivo) return;
                    const k = `${f.guardado.campo_nombre}|${f.guardado.lote_nombre}`;
                    if (!cultivosPorFilaKey[k]) cultivosPorFilaKey[k] = [];
                    if (!cultivosPorFilaKey[k].includes(f.guardado.cultivo)) cultivosPorFilaKey[k].push(f.guardado.cultivo);
                  });
                  const etiqRotacion = (f) => {
                    if (!f.guardado) return "Sin cultivo";
                    if (f.guardado.rotacion) return f.guardado.rotacion;
                    const k = `${f.guardado.campo_nombre}|${f.guardado.lote_nombre}`;
                    const cults = cultivosPorFilaKey[k] || [];
                    const inv   = cults.find(c => CINV.includes(c));
                    const ver2  = cults.find(c => CVR2.includes(c));
                    const cs    = cults.find(c => CCS.includes(c));
                    const ver1  = cults.find(c => !CINV.includes(c) && !CVR2.includes(c) && !CCS.includes(c));
                    if (inv && ver2)   return `${inv}/${ver2}`;
                    if (cs && ver1)    return `Cs/${ver1}`;
                    return f.guardado.cultivo || "Sin cultivo";
                  };

                  // Resumen MB por cultivo/rotación
                  const mbPorCultivo = {};
                  filas.forEach(f => {
                    if (!f.guardado) return;
                    const c = etiqRotacion(f);
                    if (!mbPorCultivo[c]) mbPorCultivo[c] = { ha: 0, mbTotal: 0, ingresoTotal: 0, costosTotal: 0, alquilerTotal: 0, precioNetoSum: 0, n: 0 };
                    const r = calcMBPlan(f.guardado);
                    const ha = parseFloat(f.guardado.hectareas)||0;
                    mbPorCultivo[c].ha += ha;
                    mbPorCultivo[c].mbTotal += r.mbHa * ha;
                    mbPorCultivo[c].ingresoTotal += r.ingresoHa * ha;
                    mbPorCultivo[c].costosTotal += r.costos * ha;
                    mbPorCultivo[c].alquilerTotal += r.alquilerUsd * ha;
                    mbPorCultivo[c].precioNetoSum += r.precioNeto * ha;
                    mbPorCultivo[c].n++;
                  });
                  const cultivosEmpArr = Object.entries(mbPorCultivo).sort((a,b) => b[1].ha - a[1].ha);
                  const haTotalEmp = filas.reduce((s,f) => s+(parseFloat(f.guardado?.hectareas)||0), 0);
                  const mbTotalEmp = cultivosEmpArr.reduce((s,[,v]) => s+v.mbTotal, 0);
                  const CULTIVOS_PLAN = ["Soja 1ra","Soja 2da","Soja 3ra","Maíz","Maíz 2da","Vc-Maíz","Cs-Maíz","Trigo","Trigo/Soja 2da","Cebada","Girasol","Sorgo","Algodón","Moha/Soja","Ce-Soja","Maíz HAB","Vicia/Maíz","Otro"];

                  return (
                    <div>
                      {/* Header empresa */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <button onClick={() => setEmpresaActivaPlan(null)}
                            style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12, color: C.textDim }}>
                            ← Volver
                          </button>
                          <div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{empresaActivaPlan}</div>
                            <div style={{ fontSize: 12, color: C.muted }}>{campanaEmpresa} · {filas.length} lotes · {Math.round(haTotalEmp).toLocaleString("es-AR")} ha</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                          <div style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: mbTotalEmp>=0?C.accent:C.danger }}>
                            MB Total: {mbTotalEmp>=0?"+":""}USD {Math.round(mbTotalEmp).toLocaleString("es-AR")}
                          </div>
                          <button onClick={() => {
                            const colores = { "Soja 1ra":"#27ae60","Soja 2da":"#2ecc71","Soja 3ra":"#82e0aa","Maíz":"#f39c12","Maíz 2da":"#f8c471","Trigo":"#e67e22","Girasol":"#f1c40f","Cebada":"#d4ac0d","Sorgo":"#c0392b","Algodón":"#85c1e9","Otro":"#95a5a6" };
                            const fmtUSD = (v) => `${v>=0?"+":""}USD ${Math.round(v).toLocaleString("es-AR")}`;
                            const fmtHa = (v) => `${Math.round(v||0).toLocaleString("es-AR")} ha`;
                            // Tabla de lotes
                            const filasPlan = filas.filter(f => f.guardado);
                            const tablaLotes = filasPlan.map(f => {
                              const g = f.guardado;
                              const alqTipo1 = g?.alquiler_tipo || (g?.alquiler_pct > 0 ? "pct" : "qq");
                              const alqTipo2 = g?.alquiler_tipo_2 || "qq";
                              const r = calcMBPlan(g);
                              const r2 = g?.cultivo_2 ? calcMBPlan({...g,cultivo:g.cultivo_2,alquiler_tipo:alqTipo2,alquiler_qq_ha:g?.alquiler_qq_ha_2||0,alquiler_pct:g?.alquiler_pct_2||0}) : null;
                              const mbComb = (r?.mbHa||0)+(r2?.mbHa||0);
                              const ha = parseFloat(g?.hectareas)||0;
                              const alq1txt = alqTipo1==="pct" ? `${g?.alquiler_pct||0}% aparc.` : `${g?.alquiler_qq_ha||0} qq/ha`;
                              const alq2txt = g?.cultivo_2 ? (alqTipo2==="pct" ? `${g?.alquiler_pct_2||0}% aparc.` : `${g?.alquiler_qq_ha_2||0} qq/ha`) : "—";
                              const col1 = colores[g?.cultivo]||"#27ae60";
                              const col2 = colores[g?.cultivo_2]||"#27ae60";
                              return `<tr>
                                <td>${f.campo}</td>
                                <td><strong>${f.lote}</strong></td>
                                <td class="num">${ha||"—"}</td>
                                <td>${g?.tenencia==="PROPIO"?"Propio":"Alquilado"}</td>
                                <td><span style="color:${col1};font-weight:700">${g?.cultivo||"—"}</span><br/><small style="color:#888">${alq1txt}</small></td>
                                <td>${g?.cultivo_2?`<span style="color:${col2};font-weight:700">${g.cultivo_2}</span><br/><small style="color:#888">${alq2txt}</small>`:"—"}</td>
                                <td class="num" style="color:${mbComb>=0?"#2d7a3a":"#c0392b"};font-weight:700">${mbComb>=0?"+":""}${mbComb.toFixed(0)}</td>
                                <td class="num" style="color:${mbComb>=0?"#2d7a3a":"#c0392b"};font-weight:700">${ha>0?fmtUSD(mbComb*ha):"—"}</td>
                              </tr>`;
                            }).join("");
                            // Resumen por cultivo
                            const resumenCultivos = cultivosEmpArr.map(([cultivo, v]) => {
                              const col = colores[cultivo]||"#27ae60";
                              const mbHa = v.ha>0?v.mbTotal/v.ha:0;
                              const precioNetoAvg = v.ha>0?v.precioNetoSum/v.ha:0;
                              const costoTotalHa = v.ha>0?(v.costosTotal+v.alquilerTotal)/v.ha:0;
                              const rindeInd = precioNetoAvg>0?(costoTotalHa/precioNetoAvg*10).toFixed(1):"—";
                              return `<tr>
                                <td><span style="color:${col};font-weight:700">${cultivo}</span></td>
                                <td class="num">${Math.round(v.ha)}</td>
                                <td class="num">${v.n}</td>
                                <td class="num">USD ${v.ha>0?(v.ingresoTotal/v.ha).toFixed(0):0}</td>
                                <td class="num">USD ${v.ha>0?(v.costosTotal/v.ha).toFixed(0):0}</td>
                                <td class="num">USD ${v.ha>0?(v.alquilerTotal/v.ha).toFixed(0):0}</td>
                                <td class="num" style="color:${mbHa>=0?"#2d7a3a":"#c0392b"};font-weight:700">${mbHa>=0?"+":""}USD ${mbHa.toFixed(0)}</td>
                                <td class="num">${rindeInd} qq/ha</td>
                              </tr>`;
                            }).join("");
                            // SVG torta distribución ha
                            const total = haTotalEmp||1;
                            let startAngle = -Math.PI/2;
                            const slices = cultivosEmpArr.map(([cultivo, v]) => {
                              const angle = (v.ha/total)*2*Math.PI;
                              const x1=70+60*Math.cos(startAngle), y1=70+60*Math.sin(startAngle);
                              startAngle+=angle;
                              const x2=70+60*Math.cos(startAngle), y2=70+60*Math.sin(startAngle);
                              const large=angle>Math.PI?1:0;
                              const col=colores[cultivo]||"#95a5a6";
                              return `<path d="M70,70 L${x1.toFixed(1)},${y1.toFixed(1)} A60,60 0 ${large},1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${col}" opacity="0.85"/>`;
                            }).join("");
                            const leyenda = cultivosEmpArr.map(([cultivo,v]) =>
                              `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px"><div style="width:10px;height:10px;border-radius:2px;background:${colores[cultivo]||"#95a5a6"}"></div><span style="font-size:11px">${cultivo}</span><span style="font-size:11px;color:#888;margin-left:auto">${Math.round(v.ha)} ha (${haTotalEmp>0?(v.ha/haTotalEmp*100).toFixed(0):0}%)</span></div>`
                            ).join("");

                            printTable(`Planificación — ${empresaActivaPlan} · ${campanaEmpresa}`, `
                              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">
                                <div>
                                  <div style="font-size:20px;font-weight:700;color:#1e3a23">${empresaActivaPlan}</div>
                                  <div style="font-size:13px;color:#5a7a5e">Campaña ${campanaEmpresa} · ${haTotalEmp} ha · ${filasPlan.length} lotes</div>
                                </div>
                                <div style="text-align:right">
                                  <div style="font-size:13px;font-weight:700;color:#2d7a3a">🌱 Ing. Agr. Ignacio Herrera</div>
                                  <div style="font-size:10px;color:#888">MB Total: <strong style="color:${mbTotalEmp>=0?"#2d7a3a":"#c0392b"}">${fmtUSD(mbTotalEmp)}</strong> · ${haTotalEmp>0?(mbTotalEmp/haTotalEmp).toFixed(0):0} USD/ha</div>
                                </div>
                              </div>
                              <h2 style="font-size:11px;color:#5a7a5e;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:8px">Detalle por Lote</h2>
                              <table style="margin-bottom:24px">
                                <thead><tr><th>Campo</th><th>Lote</th><th>Ha</th><th>Tenencia</th><th>Cultivo 1</th><th>Cultivo 2</th><th>MB/ha</th><th>MB Total</th></tr></thead>
                                <tbody>${tablaLotes}</tbody>
                                <tfoot><tr style="background:#f0f4ef;font-weight:700"><td colspan="6">TOTAL</td><td class="num">${haTotalEmp>0?(mbTotalEmp/haTotalEmp).toFixed(0):0} USD/ha</td><td class="num" style="color:${mbTotalEmp>=0?"#2d7a3a":"#c0392b"}">${fmtUSD(mbTotalEmp)}</td></tr></tfoot>
                              </table>
                              <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
                                <div>
                                  <h2 style="font-size:11px;color:#5a7a5e;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:8px">Resumen por Cultivo</h2>
                                  <table>
                                    <thead><tr><th>Cultivo</th><th>Ha</th><th>Lotes</th><th>Ingreso/ha</th><th>Costos/ha</th><th>Alquiler/ha</th><th>MB/ha</th><th>Rinde Indif.</th></tr></thead>
                                    <tbody>${resumenCultivos}</tbody>
                                  </table>
                                </div>
                                <div>
                                  <h2 style="font-size:11px;color:#5a7a5e;letter-spacing:1px;text-transform:uppercase;font-weight:700;margin-bottom:8px">Distribución de Hectáreas</h2>
                                  <div style="display:flex;align-items:center;gap:16px">
                                    <svg width="140" height="140" viewBox="0 0 140 140">${slices}<circle cx="70" cy="70" r="28" fill="white"/><text x="70" y="67" text-anchor="middle" font-size="9" fill="#888">HA</text><text x="70" y="79" text-anchor="middle" font-size="13" fill="#1e3a23" font-weight="700">${Math.round(haTotalEmp)}</text></svg>
                                    <div style="flex:1">${leyenda}</div>
                                  </div>
                                </div>
                              </div>
                            `);
                          }} style={{ ...st.btnPrimary, background: "#8e44ad", fontSize: 12 }}>📄 Reporte PDF</button>
                          <button onClick={eliminarEmpresaPlan} style={{ ...st.btnPrimary, background: C.danger, fontSize: 12 }}>🗑 Eliminar planificación</button>
                          <button onClick={async () => {
                            const tok = await getValidToken();
                            const norm = s => String(s||"").trim().toLowerCase();
                            const normLote = (a, b) => {
                              if (norm(a)===norm(b)) return true;
                              // Match por número: "LOS CORDOBESES 13 (LC13)" vs "13"
                              const nA=(norm(a).match(/\d+/g)||[]);
                              const nB=(norm(b).match(/\d+/g)||[]);
                              return nB.length>0 && nA.includes(nB[nB.length-1]);
                            };
                            const planCampo = lotesGuardados.filter(p => p.cultivo);
                            if (planCampo.length === 0) { alert("No hay lotes con cultivo cargado. Editá la planificación primero."); return; }
                            let actualizados = 0;
                            for (const p of planCampo) {
                              const mLotes = monitoreos.filter(m =>
                                norm(m.empresa) === norm(empresaActivaPlan) &&
                                normLote(m.lote, p.lote_nombre)
                              );
                              for (const m of mLotes) {
                                await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${m.id}`, {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok}`, Prefer: "return=minimal" },
                                  body: JSON.stringify({ cultivo: p.cultivo })
                                });
                                actualizados++;
                              }
                            }
                            setMonitoreos(prev => prev.map(m => {
                              const match = planCampo.find(p =>
                                norm(p.empresa_nombre) === norm(m.empresa) &&
                                normLote(m.lote, p.lote_nombre)
                              );
                              return match ? { ...m, cultivo: match.cultivo } : m;
                            }));
                            alert(`✓ ${actualizados} monitoreo${actualizados!==1?"s":""} sincronizados con cultivos de la planificación.`);
                          }} style={{ ...st.btnPrimary, background: "#2980b9", fontSize: 12 }}>🔄 Sincronizar → Monitoreos</button>
                        </div>
                      </div>

                      {/* Resumen por cultivo */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                        {/* MB por cultivo */}
                        <div style={{ ...st.card }}>
                          <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Margen Bruto por Cultivo</div>
                          {cultivosEmpArr.map(([cultivo, v]) => {
                            const col = COLORES_CULTIVO[cultivo]||C.accent;
                            const mbHa = v.ha > 0 ? v.mbTotal/v.ha : 0;
                            const pos = mbHa >= 0;
                            return (
                              <div key={cultivo} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ background: col+"20", color: col, padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{cultivo}</span>
                                    <span style={{ fontSize: 11, color: C.muted }}>{Math.round(v.ha)} ha · {v.n} lote{v.n!==1?"s":""}</span>
                                  </div>
                                  <span style={{ fontFamily: F, fontWeight: 700, fontSize: 15, color: pos?C.accent:C.danger }}>
                                    {pos?"+":""}USD {mbHa.toFixed(0)}/ha
                                  </span>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                  {(() => {
                                    const precioNetoAvg = v.ha > 0 ? v.precioNetoSum / v.ha : 0;
                                    const costoTotalHa = v.ha > 0 ? (v.costosTotal + v.alquilerTotal) / v.ha : 0;
                                    const rindeInd = precioNetoAvg > 0 ? (costoTotalHa / precioNetoAvg * 10).toFixed(1) : "—";
                                    const ingresoHaPlan = v.ha>0?(v.ingresoTotal/v.ha):0;
                                    const costosHaPlan = v.ha>0?((v.costosTotal+v.alquilerTotal)/v.ha):0;
                                    const rentabilidad = costosHaPlan > 0 ? (mbHa / costosHaPlan * 100) : 0;
                                    const mbPct = ingresoHaPlan > 0 ? (mbHa / ingresoHaPlan * 100) : 0;
                                    const TOOLTIPS_PLAN = {
                                      "Ingreso": "Ingreso bruto por hectárea = Rinde (qq) × Precio neto (USD/tn) ÷ 10",
                                      "Costos": "Costos directos por hectárea (semilla, labores, agroquímicos, fertilizantes, cosecha)",
                                      "MB Total": "Margen Bruto total = (Ingreso - Costos - Alquiler) × Hectáreas",
                                      "Rinde Indif.": "Rinde de indiferencia: producción mínima para cubrir todos los costos (punto de equilibrio)",
                                      "Rentabilidad": "Rentabilidad = Margen Bruto ÷ Inversión total (costos + alquiler) × 100",
                                      "MB%": "Margen Bruto sobre Ingreso Bruto = MB ÷ Ingreso × 100",
                                    };
                                    return [
                                      ["Ingreso", `USD ${ingresoHaPlan.toFixed(0)}/ha`, C.accent],
                                      ["Costos", `USD ${v.ha>0?(v.costosTotal/v.ha).toFixed(0):0}/ha`, C.warn],
                                      ["MB Total", `${pos?"+":""}USD ${Math.round(v.mbTotal).toLocaleString("es-AR")}`, pos?C.accent:C.danger],
                                      ["Rinde Indif.", `${rindeInd} qq/ha`, C.textDim],
                                      ["Rentabilidad", `${rentabilidad>=0?"+":""}${rentabilidad.toFixed(1)}%`, rentabilidad>=0?C.accent:C.danger],
                                      ["MB%", `${mbPct>=0?"+":""}${mbPct.toFixed(1)}%`, mbPct>=0?C.accent:C.danger],
                                    ].map(([label, val, color]) => (
                                      <Tip key={label} text={TOOLTIPS_PLAN[label]||label}>
                                        <div style={{ background: C.mutedBg, borderRadius: 6, padding: "6px 10px", cursor: "help", width: "100%" }}>
                                          <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px dashed #e8eaed", paddingBottom: 2, marginBottom: 2 }}>{label} ℹ</div>
                                          <div style={{ fontSize: 13, fontWeight: 700, color, fontFamily: F }}>{val}</div>
                                        </div>
                                      </Tip>
                                    ));
                                  })()}
                                </div>
                                {v.alquilerTotal > 0 && (
                                  <div style={{ marginTop: 6, fontSize: 11, color: "#e67e22", fontFamily: F }}>
                                    🏠 Alquiler: USD {v.ha>0?(v.alquilerTotal/v.ha).toFixed(0):0}/ha · USD {Math.round(v.alquilerTotal).toLocaleString("es-AR")} total
                                  </div>
                                )}

                              </div>
                            );
                          })}
                          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: C.textDim }}>TOTAL EMPRESA</span>
                            <span style={{ fontFamily: F, fontWeight: 700, fontSize: 14, color: mbTotalEmp>=0?C.accent:C.danger }}>
                              {mbTotalEmp>=0?"+":""}USD {Math.round(mbTotalEmp).toLocaleString("es-AR")}
                              <span style={{ fontSize: 11, color: C.muted, marginLeft: 8 }}>({haTotalEmp>0?(mbTotalEmp/haTotalEmp).toFixed(0):0} USD/ha)</span>
                            </span>
                          </div>
                        </div>

                        {/* Torta rotación empresa */}
                        <div style={{ ...st.card }}>
                          <div style={{ fontSize: 11, color: C.textDim, fontFamily: F, letterSpacing: 1, textTransform: "uppercase", fontWeight: 700, marginBottom: 14 }}>Distribución de Hectáreas</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <svg width={130} height={130} viewBox="0 0 140 140">
                              {(() => {
                                let startAngle = -Math.PI/2;
                                return cultivosEmpArr.map(([cultivo, v]) => {
                                  const pct = haTotalEmp > 0 ? v.ha/haTotalEmp : 0;
                                  if (pct < 0.01) return null;
                                  const angle = pct * 2 * Math.PI;
                                  const x1 = 70+60*Math.cos(startAngle), y1 = 70+60*Math.sin(startAngle);
                                  startAngle += angle;
                                  const x2 = 70+60*Math.cos(startAngle), y2 = 70+60*Math.sin(startAngle);
                                  return <path key={cultivo} d={`M 70 70 L ${x1} ${y1} A 60 60 0 ${angle>Math.PI?1:0} 1 ${x2} ${y2} Z`} fill={COLORES_CULTIVO[cultivo]||C.accent} stroke="#fff" strokeWidth={1.5}/>;
                                });
                              })()}
                              <circle cx={70} cy={70} r={30} fill={C.surface}/>
                              <text x={70} y={67} textAnchor="middle" fontSize={9} fill={C.muted}>HA</text>
                              <text x={70} y={78} textAnchor="middle" fontSize={11} fill={C.text} fontWeight="700">{Math.round(haTotalEmp).toLocaleString("es-AR")}</text>
                            </svg>
                            <div style={{ flex: 1 }}>
                              {cultivosEmpArr.map(([cultivo, v]) => (
                                <div key={cultivo} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                                  <div style={{ width: 10, height: 10, borderRadius: 2, background: COLORES_CULTIVO[cultivo]||C.accent, flexShrink: 0 }} />
                                  <span style={{ fontSize: 11, color: C.textDim, flex: 1 }}>{cultivo}</span>
                                  <span style={{ fontSize: 11, fontFamily: F, color: C.text, fontWeight: 600 }}>{Math.round(v.ha)} ha</span>
                                  <span style={{ fontSize: 10, color: C.muted }}>({haTotalEmp>0?(v.ha/haTotalEmp*100).toFixed(0):0}%)</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Simulador de Rinde */}
                      <SimuladorRinde
                        planCultivos={planCultivos}
                        filas={filas}
                        mbTotal={mbTotalEmp}
                        haTotalEmp={haTotalEmp}
                        C={C} F={F}
                        filtroCampana={filtroCampana}
                        campanaEmpresa={campanaEmpresa}
                      />

                      {/* Tabla de lotes de la empresa */}
                      <div style={{ ...st.card, padding: 0, overflow: "hidden" }}>
                        <div style={{ padding: "13px 18px", fontSize: 12, color: C.textDim, letterSpacing: 1, borderBottom: `1px solid ${C.border}`, fontFamily: F, background: C.mutedBg, textTransform: "uppercase", fontWeight: 600 }}>
                          Planificación — {empresaActivaPlan} · {campanaEmpresa}
                        </div>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>{["CAMPO","LOTE","HA","TENENCIA","CULTIVO 1","CULTIVO 2","MB/ha","MB TOTAL"].map(h=><th key={h} style={st.th}>{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {filas.map((f, i) => {
                              const g = f.guardado;
                              const alqTipo1 = g?.alquiler_tipo || (g?.alquiler_pct > 0 ? "pct" : "qq");
                              const alqTipo2 = g?.alquiler_tipo_2 || "qq";
                              const r = g ? calcMBPlan(g) : null;
                              const r2 = g?.cultivo_2 ? calcMBPlan({
                                ...g, cultivo: g.cultivo_2,
                                alquiler_tipo: alqTipo2,
                                alquiler_qq_ha: g?.alquiler_qq_ha_2||0,
                                alquiler_pct: g?.alquiler_pct_2||0,
                              }) : null;
                              const mbHaCombinado = (r?.mbHa||0) + (r2?.mbHa||0);
                              const ha = parseFloat(g?.hectareas)||0;
                              const col = g?.cultivo ? (COLORES_CULTIVO[g.cultivo]||C.accent) : C.border;
                              const col2 = g?.cultivo_2 ? (COLORES_CULTIVO[g.cultivo_2]||C.accent) : C.border;
                              // Mini alquiler cell helper
                              const AlqCell = ({tipo, valQq, valPct, onTipo, onVal}) => (
                                <div style={{display:"flex",gap:4,alignItems:"center",marginTop:4}}>
                                  <select defaultValue={tipo}
                                    onChange={e=>onTipo(e.target.value)}
                                    style={{...inputSt,margin:0,padding:"2px 4px",fontSize:9,width:70,cursor:"pointer",color:C.muted}}>
                                    <option value="qq">qq sj/ha</option>
                                    <option value="pct">Aparc. %</option>
                                  </select>
                                  <input type="number"
                                    defaultValue={tipo==="pct"?(valPct||""):(valQq||"")}
                                    placeholder={tipo==="pct"?"%":"qq"}
                                    onBlur={e=>onVal(parseFloat(e.target.value)||0, tipo)}
                                    style={{...inputSt,margin:0,padding:"2px 4px",fontSize:11,width:38}} />
                                </div>
                              );
                              return (
                                <tr key={`${f.campo}|${f.lote}`} style={{ background: i%2===0?"transparent":C.mutedBg+"40" }}>
                                  <td style={st.td}><span style={{fontSize:12,color:C.textDim,fontWeight:600}}>{f.campo}</span></td>
                                  <td style={st.td}><span style={{fontSize:12,fontWeight:700,color:C.text}}>{f.lote}</span></td>
                                  <td style={st.td}>
                                    <input type="number" defaultValue={g?.hectareas||""} placeholder="ha"
                                      onBlur={e=>saveLotePlan(f.campo,f.lote,{hectareas:parseFloat(e.target.value)||null})}
                                      style={{...inputSt,margin:0,padding:"3px 6px",fontSize:12,width:55}} />
                                  </td>
                                  <td style={st.td}>
                                    <select defaultValue={g?.tenencia||"PROPIO"}
                                      onChange={e=>saveLotePlan(f.campo,f.lote,{tenencia:e.target.value})}
                                      style={{...inputSt,margin:0,padding:"3px 6px",fontSize:11,width:90,cursor:"pointer"}}>
                                      <option value="PROPIO">Propio</option>
                                      <option value="ALQUILADO">Alquilado</option>
                                    </select>
                                  </td>
                                  {/* CULTIVO 1 + ALQ 1 */}
                                  <td style={st.td}>
                                    <select defaultValue={g?.cultivo||""}
                                      onChange={e=>saveLotePlan(f.campo,f.lote,{cultivo:e.target.value||null})}
                                      style={{...inputSt,margin:0,padding:"3px 6px",fontSize:11,width:120,cursor:"pointer",background:g?.cultivo?col+"15":"",color:g?.cultivo?col:C.textDim,fontWeight:g?.cultivo?700:400}}>
                                      <option value="">— elegir —</option>
                                      {CULTIVOS_PLAN.map(c=><option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <AlqCell
                                      tipo={alqTipo1} valQq={g?.alquiler_qq_ha} valPct={g?.alquiler_pct}
                                      onTipo={t => { if(t==="qq") saveLotePlan(f.campo,f.lote,{alquiler_tipo:"qq",alquiler_pct:0}); else saveLotePlan(f.campo,f.lote,{alquiler_tipo:"pct",alquiler_qq_ha:0}); }}
                                      onVal={(v,t) => { if(t==="pct") saveLotePlan(f.campo,f.lote,{alquiler_pct:v,alquiler_qq_ha:0,alquiler_tipo:"pct"}); else saveLotePlan(f.campo,f.lote,{alquiler_qq_ha:v,alquiler_pct:0,alquiler_tipo:"qq"}); }}
                                    />
                                    {r && <span style={{fontSize:10,color:col,fontFamily:F,marginTop:2,display:"block"}}>MB: {r.mbHa>=0?"+":""}{r.mbHa.toFixed(0)} USD/ha</span>}
                                  </td>
                                  {/* CULTIVO 2 + ALQ 2 */}
                                  <td style={st.td}>
                                    <select defaultValue={g?.cultivo_2||""}
                                      onChange={e=>saveLotePlan(f.campo,f.lote,{cultivo_2:e.target.value||null})}
                                      style={{...inputSt,margin:0,padding:"3px 6px",fontSize:11,width:120,cursor:"pointer",
                                        background:g?.cultivo_2?col2+"15":"",color:g?.cultivo_2?col2:C.textDim,fontWeight:g?.cultivo_2?700:400}}>
                                      <option value="">—</option>
                                      {CULTIVOS_PLAN.map(c=><option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {g?.cultivo_2 && <AlqCell
                                      tipo={alqTipo2} valQq={g?.alquiler_qq_ha_2} valPct={g?.alquiler_pct_2}
                                      onTipo={t => { if(t==="qq") saveLotePlan(f.campo,f.lote,{alquiler_tipo_2:"qq",alquiler_pct_2:0}); else saveLotePlan(f.campo,f.lote,{alquiler_tipo_2:"pct",alquiler_qq_ha_2:0}); }}
                                      onVal={(v,t) => { if(t==="pct") saveLotePlan(f.campo,f.lote,{alquiler_pct_2:v,alquiler_qq_ha_2:0,alquiler_tipo_2:"pct"}); else saveLotePlan(f.campo,f.lote,{alquiler_qq_ha_2:v,alquiler_pct_2:0,alquiler_tipo_2:"qq"}); }}
                                    />}
                                    {r2 && <span style={{fontSize:10,color:col2,fontFamily:F,marginTop:2,display:"block"}}>MB: {r2.mbHa>=0?"+":""}{r2.mbHa.toFixed(0)} USD/ha</span>}
                                  </td>
                                  <td style={st.td}>
                                    {r ? (
                                      <div style={{display:"flex",flexDirection:"column",gap:1}}>
                                        <span style={{fontFamily:F,fontWeight:700,fontSize:13,color:mbHaCombinado>=0?C.accent:C.danger}}>{mbHaCombinado>=0?"+":""}USD {mbHaCombinado.toFixed(0)}</span>
                                        {r2 && <span style={{fontSize:10,color:C.muted}}>↑{((r.ingresoHa||0)+(r2?.ingresoHa||0)).toFixed(0)} ↓{((r.costos||0)+(r2?.costos||0)).toFixed(0)} 🏠{((r.alquilerUsd||0)+(r2?.alquilerUsd||0)).toFixed(0)}</span>}
                                      </div>
                                    ) : <span style={{color:C.muted,fontSize:11}}>—</span>}
                                  </td>
                                  <td style={st.td}>
                                    {r && ha > 0 ? <span style={{fontFamily:F,fontWeight:700,fontSize:13,color:mbHaCombinado>=0?C.accent:C.danger}}>{mbHaCombinado>=0?"+":""}USD {Math.round(mbHaCombinado*ha).toLocaleString("es-AR")}</span>
                                      : <span style={{color:C.muted,fontSize:11}}>—</span>}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot>
                            <tr style={{background:C.accentLight}}>
                              <td colSpan={6} style={{...st.td,fontWeight:700,color:C.text}}>TOTAL</td>
                              <td style={{...st.td,fontFamily:F,fontWeight:700,color:mbTotalEmp>=0?C.accent:C.danger}}>{mbTotalEmp>=0?"+":""}USD {haTotalEmp>0?(mbTotalEmp/haTotalEmp).toFixed(0):0}/ha</td>
                              <td style={{...st.td,fontFamily:F,fontWeight:700,fontSize:14,color:mbTotalEmp>=0?C.accent:C.danger}}>{mbTotalEmp>=0?"+":""}USD {Math.round(mbTotalEmp).toLocaleString("es-AR")}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  );
                })() : (
                  // ── VISTA EMPRESAS (cards) ──
                  (() => {
                    const empresasPlan = [...new Set(planFiltrado.map(p=>p.empresa_nombre).filter(Boolean))].sort();
                    if (empresasPlan.length === 0) return (
                      <div style={{...st.card,textAlign:"center",padding:56,background:C.accentLight}}>
                        <div style={{fontSize:40,marginBottom:12}}>🌱</div>
                        <div style={{color:C.accent,fontWeight:600,fontSize:15}}>Sin planificaciones cargadas</div>
                        <div style={{color:C.muted,fontSize:13,marginTop:6}}>Importá un Excel o agregá lotes manualmente</div>
                      </div>
                    );
                    return (
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
                        {empresasPlan.map(emp => {
                          const lotes = planFiltrado.filter(p=>p.empresa_nombre===emp);
                          const haEmp = lotes.reduce((s,p)=>s+(parseFloat(p.hectareas)||0),0);
                          const mbEmp = lotes.reduce((s,p)=>{const r=calcMBPlan(p);return s+r.mbHa*(parseFloat(p.hectareas)||0);},0);
                          const cultEmp = [...new Set(lotes.map(p=>p.cultivo).filter(Boolean))];
                          return (
                            <div key={emp} onClick={()=>setEmpresaActivaPlan(emp)}
                              style={{...st.card,cursor:"pointer",borderTop:`4px solid ${C.accent}`,transition:"box-shadow 0.2s"}}
                              onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.12)"}
                              onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.05)"}>
                              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:8}}>{emp}</div>
                              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                                <div style={{background:C.mutedBg,borderRadius:6,padding:"8px 10px"}}>
                                  <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:0.5}}>Hectáreas</div>
                                  <div style={{fontSize:18,fontWeight:700,color:C.text,fontFamily:F}}>{Math.round(haEmp).toLocaleString("es-AR")}</div>
                                </div>
                                <div style={{background:mbEmp>=0?C.accentLight:C.dangerLight,borderRadius:6,padding:"8px 10px"}}>
                                  <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:0.5}}>MB Total</div>
                                  <div style={{fontSize:16,fontWeight:700,color:mbEmp>=0?C.accent:C.danger,fontFamily:F}}>{mbEmp>=0?"+":""}USD {Math.round(mbEmp).toLocaleString("es-AR")}</div>
                                </div>
                              </div>
                              <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
                                {cultEmp.map(c=><span key={c} style={{background:(COLORES_CULTIVO[c]||C.accent)+"20",color:COLORES_CULTIVO[c]||C.accent,padding:"2px 6px",borderRadius:4,fontSize:11,fontWeight:600}}>{c}</span>)}
                              </div>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <span style={{fontSize:11,color:C.muted}}>{lotes.length} lotes</span>
                                <span style={{fontSize:12,color:C.accent,fontWeight:600}}>Ver planificación →</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()
                )}


                </>}
              </div>
              );
            })()}

            {/* ── UMBRALES ── */}
            {tab === "estructura" && <TabEstructura estructuraLotes={estructuraLotes} fetchEstructura={fetchEstructura} session={session} aplicaciones={aplicaciones} st={st} inputSt={inputSt} labelSt={labelSt} C={C} F={F} SANS={SANS} SUPABASE_URL={SUPABASE_URL} SUPABASE_KEY={SUPABASE_KEY} />}

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
                    ["isocas", "Isocas", "larvas/m lineal · umbral: 5", "Alerta cuando supera este valor por metro lineal"],
                    ["chinches", "Chinches", "ninfas/m lineal · umbral: 1", "Ninfas grandes + adultos por metro de surco"],
                    ["pulgones", "Pulgones", "nivel BAJO/MEDIO/ALTO · alerta desde MEDIO", "Se registra como nivel, alerta automática desde MEDIO"],
                    ["chicharrita", "Chicharrita (Dalbulus)", "% plantas afectadas · umbral: 1%", "Insectos adultos, alerta desde 1% de plantas"],
                    ["trips", "Trips", "nivel BAJO/MEDIO/ALTO · alerta desde MEDIO", "Se registra como nivel, alerta automática desde MEDIO"],
                    ["aranhuelas", "Arañuelas", "nivel BAJO/MEDIO/ALTO · alerta desde MEDIO", "Se registra como nivel, alerta automática desde MEDIO"],
                    ["cogollero", "Cogollero", "% plantas con daño · umbral: 5%", "Porcentaje de plantas con daño activo en el cogollo"],
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
            {/* ── HISTORIAL POR LOTE ── */}
            {tab === "historial" && (() => {
              const empresasDisp = [...new Set([
                ...monitoreos.map(m => m.empresa),
                ...aplicaciones.map(a => a.empresa_nombre)
              ].filter(Boolean))].sort();
              const camposDisp = loteHistorialEmp === "todas" ? [] : [...new Set([
                ...monitoreos.filter(m => m.empresa?.trim() === loteHistorialEmp?.trim()).map(m => m.campo),
                ...aplicaciones.filter(a => a.empresa_nombre?.trim() === loteHistorialEmp?.trim()).map(a => a.campo_nombre)
              ].filter(Boolean))].sort();
              // Lotes: usar monitoreos como fuente de verdad del campo, apps solo si coinciden con esos lotes
              const lotesDeMonitoreos = loteHistorialEmp === "todas" ? [] : [...new Set(
                monitoreos.filter(m => m.empresa?.trim() === loteHistorialEmp?.trim() && (loteHistorialCampo === "todos" || m.campo === loteHistorialCampo)).map(m => m.lote).filter(Boolean)
              )];
              const lotesDeApps = loteHistorialEmp === "todas" ? [] : [...new Set(
                aplicaciones.filter(a => a.empresa_nombre?.trim() === loteHistorialEmp?.trim() && (loteHistorialCampo === "todos" || a.campo_nombre === loteHistorialCampo)).map(a => a.lote_nombre).filter(Boolean)
              )];
              // Si hay monitoreos para este campo, solo mostrar lotes que aparecen en monitoreos (más confiable)
              // Si no hay monitoreos, usar aplicaciones
              const lotesDisp = loteHistorialCampo === "todos"
                ? [...new Set([...lotesDeMonitoreos, ...lotesDeApps])].sort()
                : lotesDeMonitoreos.length > 0
                  ? lotesDeMonitoreos.sort()
                  : lotesDeApps.sort();
              const evMonitoreos = loteHistorialEmp === "todas" ? [] : monitoreos
                .filter(m => m.empresa?.trim() === loteHistorialEmp?.trim()
                  && (loteHistorialCampo === "todos" || m.campo === loteHistorialCampo)
                  && (!loteHistorialNombre || m.lote === loteHistorialNombre))
                .map(m => ({ tipo:"monitoreo", fecha:m.fecha, data:m }));
              const evApps = loteHistorialEmp === "todas" ? [] : aplicaciones
                .filter(a => a.empresa_nombre?.trim() === loteHistorialEmp?.trim()
                  && (loteHistorialCampo === "todos" || a.campo_nombre === loteHistorialCampo)
                  && (!loteHistorialNombre || a.lote_nombre === loteHistorialNombre))
                .map(a => ({ tipo:"aplicacion", fecha:a.fecha, data:a }));
              const timeline = [...evMonitoreos, ...evApps].sort((a,b) => b.fecha.localeCompare(a.fecha));
              const haLote = evApps.length > 0 ? Math.max(...evApps.map(ev => parseFloat(ev.data.superficie_ha)||0)) : 0;
              const costoTotal = evApps.reduce((s,ev) => s + (ev.data.productos||[]).reduce((ps,p) => ps + calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd)*(parseFloat(ev.data.superficie_ha)||1),0),0);
              return (
              <div style={{ animation:"fadeIn 0.3s ease" }}>
                <div style={{ display:"flex", gap:12, marginBottom:20, flexWrap:"wrap" }}>
                  <div style={{ flex:1, minWidth:200 }}>
                    <label style={{ fontSize:11, color:C.muted, fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Empresa</label>
                    <select value={loteHistorialEmp} onChange={e => { setLoteHistorialEmp(e.target.value); setLoteHistorialCampo("todos"); setLoteHistorialNombre(null); }} style={{ ...st.sel, width:"100%", fontSize:13 }}>
                      <option value="todas">— Seleccioná una empresa —</option>
                      {empresasDisp.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  {loteHistorialEmp !== "todas" && (
                    <div style={{ flex:1, minWidth:200 }}>
                      <label style={{ fontSize:11, color:C.muted, fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Campo</label>
                      <select value={loteHistorialCampo} onChange={e => { setLoteHistorialCampo(e.target.value); setLoteHistorialNombre(null); }} style={{ ...st.sel, width:"100%", fontSize:13 }}>
                        <option value="todos">Todos los campos</option>
                        {camposDisp.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                  {loteHistorialEmp !== "todas" && (
                    <div style={{ flex:1, minWidth:200 }}>
                      <label style={{ fontSize:11, color:C.muted, fontWeight:600, display:"block", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Lote</label>
                      <select value={loteHistorialNombre||""} onChange={e => setLoteHistorialNombre(e.target.value||null)} style={{ ...st.sel, width:"100%", fontSize:13 }}>
                        <option value="">Todos los lotes ({lotesDisp.length})</option>
                        {lotesDisp.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                {loteHistorialEmp === "todas" ? (
                  <div style={{ ...st.card, textAlign:"center", padding:60, color:C.muted }}>
                    <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
                    <div style={{ fontSize:15, fontWeight:600, color:C.textDim, marginBottom:6 }}>Historial completo por lote</div>
                    <div style={{ fontSize:12 }}>Seleccioná empresa y lote para ver todos sus monitoreos y aplicaciones en una sola vista</div>
                  </div>
                ) : (
                  <>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:20 }}>
                      {[
                        { label:"Monitoreos", val:evMonitoreos.length, color:C.accent, icon:"🔍" },
                        { label:"Aplicaciones", val:evApps.length, color:C.accent, icon:"💊" },
                        { label:"Superficie", val:haLote > 0 ? `${haLote} ha` : "—", color:C.text, icon:"📐" },
                        { label:"Costo total", val:costoTotal > 0 ? `USD ${costoTotal.toFixed(0)}` : "—", color:costoTotal > 0 ? C.accent : C.muted, icon:"💰" },
                      ].map(({ label, val, color, icon }) => (
                        <div key={label} style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`3px solid ${color}`, borderRadius:12, padding:"16px 18px" }}>
                          <div style={{ fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:0.5, marginBottom:8, display:"flex", alignItems:"center", gap:6 }}><span style={{ fontSize:14 }}>{icon}</span>{label}</div>
                          <div style={{ fontSize:28, fontWeight:700, color }}>{val}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ ...st.card, padding:0, overflow:"hidden" }}>
                      <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                        <div style={{ fontSize:13, fontWeight:700, color:C.text }}>📋 {loteHistorialNombre || "Todos los lotes"}{loteHistorialCampo !== "todos" ? ` — ${loteHistorialCampo}` : ""} · {loteHistorialEmp}</div>
                        <div style={{ fontSize:12, color:C.muted }}>{timeline.length} eventos</div>
                      </div>
                      {timeline.length === 0 ? (
                        <div style={{ padding:40, textAlign:"center", color:C.muted }}>Sin registros para este lote</div>
                      ) : (
                        <div style={{ padding:"4px 0" }}>
                          {timeline.map((ev, i) => (
                            <div key={ev.data.id+ev.tipo} style={{ display:"flex", padding:"14px 20px", borderBottom: i < timeline.length-1 ? `1px solid ${C.border}` : "none" }}>
                              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginRight:16, flexShrink:0 }}>
                                <div style={{ width:34, height:34, borderRadius:"50%", background: ev.tipo === "monitoreo" ? C.accentLight : C.mutedBg, border:`2px solid ${ev.tipo === "monitoreo" ? C.accent : C.borderStrong}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>
                                  {ev.tipo === "monitoreo" ? "🔍" : "💊"}
                                </div>
                                {i < timeline.length-1 && <div style={{ width:2, flex:1, minHeight:16, background:C.border, marginTop:4 }} />}
                              </div>
                              <div style={{ flex:1 }}>
                                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
                                  <div style={{ fontSize:13, fontWeight:700, color:C.text }}>
                                    {ev.tipo === "monitoreo" ? "Monitoreo" : "Aplicación"}
                                    <span style={{ color:C.muted, fontWeight:400 }}> · {ev.tipo === "monitoreo" ? ev.data.cultivo : ev.data.tipo_aplicacion}</span>
                                    {ev.tipo === "aplicacion" && ev.data.numero_orden && <span style={{ fontSize:11, color:C.muted }}> · Orden #{ev.data.numero_orden}</span>}
                                  </div>
                                  <div style={{ fontSize:11, color:C.muted, fontFamily:F, flexShrink:0, marginLeft:12 }}>{ev.data.fecha}</div>
                                </div>
                                {ev.tipo === "monitoreo" ? (
                                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                                    {ev.data.estadio && <span style={{ fontSize:11, color:C.textDim }}>Estadio: <b>{ev.data.estadio}</b></span>}
                                    {parseFloat(ev.data.isocas) > 0 && <span style={{ fontSize:11, color:C.warn, fontWeight:600 }}>Isocas: {ev.data.isocas}</span>}
                                    {parseFloat(ev.data.chinches) > 0 && <span style={{ fontSize:11, color:C.warn, fontWeight:600 }}>Chinches: {ev.data.chinches}</span>}
                                    {parseFloat(ev.data.pulgones) > 0 && <span style={{ fontSize:11, color:C.warn, fontWeight:600 }}>Pulgones: {ev.data.pulgones}</span>}
                                    {parseFloat(ev.data.trips) > 0 && <span style={{ fontSize:11, color:C.warn, fontWeight:600 }}>Trips: {ev.data.trips}</span>}
                                    {ev.data.enfermedades?.length > 0 && <span style={{ fontSize:11, color:C.danger, fontWeight:600 }}>Enf: {ev.data.enfermedades.join(", ")}</span>}
                                    {!parseFloat(ev.data.isocas) && !parseFloat(ev.data.chinches) && !parseFloat(ev.data.pulgones) && !parseFloat(ev.data.trips) && !ev.data.enfermedades?.length && (
                                      <span style={{ fontSize:11, color:C.accent, fontWeight:600 }}>✓ Sin plagas detectadas</span>
                                    )}
                                    {ev.data.observaciones && <div style={{ fontSize:11, color:C.muted, marginTop:4, fontStyle:"italic", width:"100%" }}>"{ev.data.observaciones}"</div>}
                                  </div>
                                ) : (
                                  <div>
                                    <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:6 }}>
                                      {ev.data.superficie_ha && <span style={{ fontSize:11, color:C.textDim }}>📐 {ev.data.superficie_ha} ha</span>}
                                      {ev.data.cultivo && <span style={{ fontSize:11, color:C.textDim }}>🌾 {ev.data.cultivo}</span>}
                                      {ev.data.diagnostico && <span style={{ fontSize:11, color:C.textDim }}>🎯 {ev.data.diagnostico}</span>}
                                    </div>
                                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                                      {(ev.data.productos||[]).map((p,pi) => (
                                        <span key={pi} style={{ fontSize:11, background:C.mutedBg, color:C.textDim, padding:"3px 10px", borderRadius:6 }}>
                                          {p.producto_nombre}{p.dosis ? ` · ${p.dosis} ${p.unidad||""}` : ""}
                                          {p.precio_usd ? <span style={{ color:C.accent, fontWeight:600 }}> · USD {calcularCostoHa(parseFloat(p.dosis)||0, p.unidad, p.precio_usd).toFixed(2)}/ha</span> : ""}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              );
            })()}


          </>
        )}
      </main>
      {/* ── MODAL REPORTE PDF ── */}
      {/* ── MODAL EDICIÓN MASIVA ── */}
      {showMasivoModal && (() => {
        const CAMPOS_EDIT = [
          { key: "empresa", label: "Empresa" },
          { key: "campo",   label: "Campo" },
          { key: "lote",    label: "Lote" },
          { key: "cultivo", label: "Cultivo" },
        ];
        const ejecutarMasivo = async () => {
          if (!masivoDesde.trim()) { setMasivoMsg("⚠ Ingresá el valor a buscar"); return; }
          if (!masivoHasta.trim()) { setMasivoMsg("⚠ Ingresá el valor de reemplazo"); return; }
          const registros = filtered.filter(m => m[masivoField]?.trim() === masivoDesde.trim());
          if (registros.length === 0) { setMasivoMsg(`⚠ No hay registros con ${masivoField} = "${masivoDesde}"`); return; }
          if (!window.confirm(`¿Reemplazar "${masivoDesde}" → "${masivoHasta}" en ${registros.length} registros?`)) return;
          setMasivoLoading(true);
          const tok2 = session?.access_token || SUPABASE_KEY;
          let ok = 0, err = 0;
          for (const m of registros) {
            const r = await fetch(`${SUPABASE_URL}/rest/v1/monitoreos?id=eq.${m.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY, Authorization: `Bearer ${tok2}`, Prefer: "return=minimal" },
              body: JSON.stringify({ [masivoField]: masivoHasta.trim() })
            });
            r.ok ? ok++ : err++;
          }
          setMasivoMsg(`✓ ${ok} actualizados${err > 0 ? ` · ⚠ ${err} errores` : ""}`);
          setMasivoLoading(false);
          fetchData();
        };
        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={e => { if (e.target === e.currentTarget) setShowMasivoModal(false); }}>
            <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 460, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>✏️ Edición masiva de registros</div>
                <button onClick={() => setShowMasivoModal(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>✕</button>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 16, background: C.mutedBg, borderRadius: 8, padding: "10px 14px" }}>
                Reemplaza un valor en <strong>{filtered.length} registros filtrados</strong>. Usá los filtros de arriba para acotar el alcance antes de editar.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Campo a editar</label>
                  <select value={masivoField} onChange={e => { setMasivoField(e.target.value); setMasivoDesde(""); setMasivoHasta(""); setMasivoMsg(""); }}
                    style={{ ...st.sel, width: "100%", fontSize: 13 }}>
                    {CAMPOS_EDIT.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Valor actual (buscar)</label>
                  <input value={masivoDesde} onChange={e => setMasivoDesde(e.target.value)} placeholder={`Ej: VACHETTA`}
                    style={{ ...st.sel, width: "100%", fontSize: 13 }} />
                  {masivoDesde && (() => {
                    const cnt = filtered.filter(m => m[masivoField]?.trim() === masivoDesde.trim()).length;
                    return <div style={{ fontSize: 11, color: cnt > 0 ? C.accent : C.danger, marginTop: 4 }}>{cnt > 0 ? `✓ ${cnt} registros encontrados` : "Sin coincidencias en los registros filtrados"}</div>;
                  })()}
                </div>
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Valor nuevo (reemplazar por)</label>
                  <input value={masivoHasta} onChange={e => setMasivoHasta(e.target.value)} placeholder={`Ej: VACHETTA JORGE`}
                    style={{ ...st.sel, width: "100%", fontSize: 13 }} />
                </div>
                {masivoMsg && (
                  <div style={{ fontSize: 13, fontWeight: 600, color: masivoMsg.startsWith("✓") ? C.accent : C.warn, padding: "8px 12px", background: masivoMsg.startsWith("✓") ? C.accentLight : C.warnLight, borderRadius: 8 }}>
                    {masivoMsg}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowMasivoModal(false)} style={st.btnSecondary}>Cancelar</button>
                  <button onClick={ejecutarMasivo} disabled={masivoLoading || !masivoDesde || !masivoHasta}
                    style={{ ...st.btnPrimary, background: "#7c3aed", opacity: (masivoLoading || !masivoDesde || !masivoHasta) ? 0.5 : 1 }}>
                    {masivoLoading ? "⏳ Actualizando..." : "✏️ Aplicar cambio"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {showReporteModal && (() => {
        const hoy = new Date().toISOString().split("T")[0];
        const empresasRep = ["todas", ...new Set(monitoreos.map(m => m.empresa).filter(Boolean))].sort();
        const camposRep = reporteEmpresa === "todas"
          ? ["todos", ...new Set(monitoreos.map(m => m.campo).filter(Boolean))].sort()
          : ["todos", ...new Set(monitoreos.filter(m => m.empresa === reporteEmpresa).map(m => m.campo).filter(Boolean))].sort();

        const monFiltrados = monitoreos.filter(m => {
          if (reporteEmpresa !== "todas" && m.empresa !== reporteEmpresa) return false;
          if (reporteCampo !== "todos" && m.campo !== reporteCampo) return false;
          if (reporteDesde && m.fecha < reporteDesde) return false;
          if (reporteHasta && m.fecha > reporteHasta) return false;
          return true;
        }).sort((a,b) => b.fecha.localeCompare(a.fecha));

        const generarReporte = () => {
          generarInformePDF({
            monitoreos: monFiltrados,
            aplicaciones,
            alertas,
            empresa: reporteEmpresa !== "todas" ? reporteEmpresa : null,
            campo: reporteCampo !== "todos" ? reporteCampo : null,
            periodo: reporteDesde && reporteHasta
              ? reporteDesde + " al " + reporteHasta
              : reporteDesde ? "Desde " + reporteDesde
              : reporteHasta ? "Hasta " + reporteHasta
              : "Toda la campaña"
          });
          setShowReporteModal(false);
        };

        return (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center" }}
            onClick={e => { if (e.target === e.currentTarget) setShowReporteModal(false); }}>
            <div style={{ background: C.surface, borderRadius: 16, padding: 28, width: 480, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>📄 Generar Reporte de Monitoreos</div>
                <button onClick={() => setShowReporteModal(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.muted }}>✕</button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Empresa */}
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Empresa</label>
                  <select value={reporteEmpresa} onChange={e => { setReporteEmpresa(e.target.value); setReporteCampo("todos"); }}
                    style={{ ...st.sel, width: "100%", fontSize: 13 }}>
                    <option value="todas">Todas las empresas</option>
                    {empresasRep.filter(e => e !== "todas").map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>

                {/* Campo */}
                <div>
                  <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Campo</label>
                  <select value={reporteCampo} onChange={e => setReporteCampo(e.target.value)}
                    style={{ ...st.sel, width: "100%", fontSize: 13 }}>
                    {camposRep.map(c => <option key={c} value={c}>{c === "todos" ? "Todos los campos" : c}</option>)}
                  </select>
                </div>

                {/* Rango de fechas */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Desde</label>
                    <input type="date" value={reporteDesde} onChange={e => setReporteDesde(e.target.value)}
                      style={{ ...st.sel, width: "100%", fontSize: 13 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: C.muted, fontWeight: 600, display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Hasta</label>
                    <input type="date" value={reporteHasta} onChange={e => setReporteHasta(e.target.value)}
                      style={{ ...st.sel, width: "100%", fontSize: 13 }} />
                  </div>
                </div>

                {/* Preview */}
                <div style={{ background: C.mutedBg, borderRadius: 10, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 13, color: C.textDim }}>
                    <span style={{ fontWeight: 700, color: C.text }}>{monFiltrados.length}</span> monitoreo{monFiltrados.length !== 1 ? "s" : ""} encontrado{monFiltrados.length !== 1 ? "s" : ""}
                  </div>
                  {monFiltrados.length > 0 && (
                    <div style={{ fontSize: 11, color: C.muted }}>
                      {monFiltrados[monFiltrados.length-1]?.fecha} → {monFiltrados[0]?.fecha}
                    </div>
                  )}
                </div>

                {/* Botones */}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button onClick={() => setShowReporteModal(false)} style={st.btnSecondary}>Cancelar</button>
                  <button onClick={generarReporte} disabled={monFiltrados.length === 0}
                    style={{ ...st.btnPrimary, opacity: monFiltrados.length === 0 ? 0.5 : 1 }}>
                    📄 Generar PDF ({monFiltrados.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      </div> {/* content-area */}
    </div>
  );
}