import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as RLTooltip, GeoJSON } from "react-leaflet";
import L from "leaflet";

const INDIA_CENTER = [22.9734, 78.6569];
const PAGE_SIZE = 10;
const SOURCE_COLORS = {
  "Steel Plants": "#dc2626",
  "Rice Mills": "#16a34a",
  "Geocoded Companies": "#111827",
  "Steel Plants with BF": "#f59e0b",
};

const DATA_SOURCES = {
  "Steel Plants": [
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/steel_plants_geocoded.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9zdGVlbF9wbGFudHNfZ2VvY29kZWQuY3N2IiwiaWF0IjoxNzYxMjUxMjc5LCJleHAiOjQ5MTQ4NTEyNzl9.0arSPoG81-tGxKs63Wdft0Srn1F00Dvaca87JRKbSZI",
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/steel_plant_data.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9zdGVlbF9wbGFudF9kYXRhLmNzdiIsImlhdCI6MTc2MTI1MTMxNywiZXhwIjo0OTE0ODUxMzE3fQ.N2D7eB5rAQYLJdwXWjtpO4L_spS9h4Y0Mp1vjwDASyM",
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/STEEL%20PLANTS%20BF%20CAPACITY%20DATA.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9TVEVFTCBQTEFOVFMgQkYgQ0FQQUNJVFkgREFUQS5jc3YiLCJpYXQiOjE3NjEyNTA4MTcsImV4cCI6MTc2MTg1NTYxN30.D380Do3YKOswk8Twus4MW73k4eHGFpIUqoSNlxSrSAw",
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/steel_plant_data.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9zdGVlbF9wbGFudF9kYXRhLmNzdiIsImlhdCI6MTc2MTI1MDczNiwiZXhwIjoxNzYxODU1NTM2fQ.wRsVqJDPQOPKoonFyu10nvvwkWbc0noS8nQ4F5oErkk",
  ],
  "Rice Mills": [
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/ricemills.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9yaWNlbWlsbHMuY3N2IiwiaWF0IjoxNzYxMjUxMTE4LCJleHAiOjE3NjE4NTU5MTh9.9VYAJhDRoWz32HGDtw_pfDmnJ1evT18CqT5Rx2BjEOw",
  ],
  "Geocoded Companies": [
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/geocoded_combined_companies.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9nZW9jb2RlZF9jb21iaW5lZF9jb21wYW5pZXMuY3N2IiwiaWF0IjoxNzYxMjUxMTg5LCJleHAiOjE3Njk4OTExODl9.4U0gMBQj91ErKdIYW_QWLnVZyvemish_bPPS79bz8Zk",
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/geocoded_ru1600_full.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9nZW9jb2RlZF9ydTE2MDBfZnVsbC5jc3YiLCJpYXQiOjE3NjEyNTEyNDYsImV4cCI6NDkxNDg1MTI0Nn0.NDwdfOLBPQ1SBNEEBj4WsaqjscqntMJPElMMIhKNAN8",
  ],
  "Steel Plants with BF": [
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/STEEL%20PLANTS%20BF%20CAPACITY%20DATA.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9TVEVFTCBQTEFOVFMgQkYgQ0FQQUNJVFkgREFUQS5jc3YiLCJpYXQiOjE3NjEyNTA4MTcsImV4cCI6MTc2MTg1NTYxN30.D380Do3YKOswk8Twus4MW73k4eHGFpIUqoSNlxSrSAw",
    "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/mills/steel_plant_data.csv?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtaWxscy9zdGVlbF9wbGFudF9kYXRhLmNzdiIsImlhdCI6MTc2MTI1MDczNiwiZXhwIjoxNzYxODU1NTM2fQ.wRsVqJDPQOPKoonFyu10nvvwkWbc0noS8nQ4F5oErkk",
  ],
};

const OVERLAYS = {
  "bamboo.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/bamboo.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2JhbWJvby5nZW9qc29uIiwiaWF0IjoxNzYxMjUxMzg1LCJleHAiOjQ5MTQ4NTEzODV9.RawQmaHSCGWS6YlolN6e0gpxGpdlgEzcYgLAsmEaoEA",
  "cottonstalk.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/cottonstalk.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2NvdHRvbnN0YWxrLmdlb2pzb24iLCJpYXQiOjE3NjEyNTE0MDgsImV4cCI6NDkxNDg1MTQwOH0.luFVG8OnmtvvwbxDTa0-3xQtRVLT0ef2rLPbMNzw6vA",
  "enhanced_bamboo.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/enhanced_bamboo.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2VuaGFuY2VkX2JhbWJvby5nZW9qc29uIiwiaWF0IjoxNzYxMjUxNDM4LCJleHAiOjQ5MTQ4NTE0Mzh9.OZ1Uj_Lg9zVv7UapgffCwIHoj3Sbhan93X3Z_g8BW4o",
  "enhanced_cottonstalk.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/enhanced_cottonstalk.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2VuaGFuY2VkX2NvdHRvbnN0YWxrLmdlb2pzb24iLCJpYXQiOjE3NTk0MTQzOTksImV4cCI6MTc2MDAxOTE5OX0.A8LeLQFLZABSMIEW6Fj95nLGU9rVz_a8e66pSVG2ji8",
  "enhanced_juliflora.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/enhanced_cottonstalk.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2VuaGFuY2VkX2NvdHRvbnN0YWxrLmdlb2pzb24iLCJpYXQiOjE3NjEyNTE0NjUsImV4cCI6NDkxNDg1MTQ2NX0.vRcXcpAZT32dOk8D6cN0-VyowyFCjDnf41Z39Ki1M9A",
  "enhanced_juliflorapdf.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/enhanced_lantanapresence.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2VuaGFuY2VkX2xhbnRhbmFwcmVzZW5jZS5nZW9qc29uIiwiaWF0IjoxNzYxMjUxNTIxLCJleHAiOjQ5MTQ4NTE1MjF9._aho9U4I5Q8EsjjcT_rpdsg5qfiEEwgNWVuBZGt5kiI",
  "enhanced_lantanapresence.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/enhanced_lantanapresence.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2VuaGFuY2VkX2xhbnRhbmFwcmVzZW5jZS5nZW9qc29uIiwiaWF0IjoxNzYxMjUxNTgyLCJleHAiOjQ5MTQ4NTE1ODJ9.WB3WiZcXTj4pZ7Z-XkYZ5bJIH3qLIkcv_gexESg3Ll4",
  "enhanced_maize.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/enhanced_maize.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2VuaGFuY2VkX21haXplLmdlb2pzb24iLCJpYXQiOjE3NjEyNTE2MDksImV4cCI6NDkxNDg1MTYwOX0.FxfnFINlc8jlnJQd2_ZivoWqPGgLylQBo8dCWREV8sE",
  "enhanced_sugarcane.geojson": "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/geojson/enhanced_sugarcane.geojson?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJnZW9qc29uL2VuaGFuY2VkX3N1Z2FyY2FuZS5nZW9qc29uIiwiaWF0IjoxNzYxMjUxNjM4LCJleHAiOjQ5MTQ4NTE2Mzh9.HEZLuqnqLwP_t6BH6QHeh1VktKrz2jMtaQRjrzjLgb8",
};

const STATUS_OPTIONS = [
  "Operational (Has undergone insolvency proceedings)",
  "Operational (Active - though parent group has faced insolvency issues)",
  "Closed / Defunct (Underwent liquidation)",
  "Franchise Model-A",
  "Undergoing insolvency proceedings / operations impacted.",
  "Foundry unit",
  "Dormant",
  "ANP",
];

const FURNACE_OPTIONS = [
  "AOD","AOD/VOD","BF.BOF","Bloom Caster","Casting/Foundry Unit","Conarc","DRI","EAF","IF","RM","SAF","Sinter Plant","TM","WM"
];

function parseCSV(text) {
  const rows = [];
  let i = 0, field = '', row = [], inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { field += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (c === ',' && !inQuotes) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !inQuotes) {
      if (field !== '' || row.length) { row.push(field); rows.push(row); row = []; field = ''; }
    } else { field += c; }
    i++;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift() || [];
  const keys = header.map(h => h.trim());
  return rows.filter(r => r.length).map(cols => {
    const obj = {};
    keys.forEach((k, idx) => { obj[k] = (cols[idx] ?? '').trim(); });
    return obj;
  });
}

function pick(obj, candidates) {
  for (const key of candidates) {
    for (const k in obj) {
      if (k.toLowerCase().replace(/\s+/g, '') === key.toLowerCase().replace(/\s+/g, '')) return obj[k];
    }
  }
  return '';
}


function colorFromString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return `hsl(${hue} 70% 45%)`;
}

export default function Dashboard() {
  const [sources, setSources] = useState([]);
  const [search, setSearch] = useState("");
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [furnaces, setFurnaces] = useState([]);
  const [overlays, setOverlays] = useState([]);
  const [page, setPage] = useState(1);

  const dataCache = useRef(new Map());
  const overlayCache = useRef(new Map());
  const [rows, setRows] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const all = [];
      for (const src of sources) {
        const urls = DATA_SOURCES[src] || [];
        for (const url of urls) {
          try {
            if (!dataCache.current.has(url)) {
              const res = await fetch(url);
              const txt = await res.text();
              const parsed = parseCSV(txt).map((r) => ({ ...normalizeRow(r), source: src }));
              dataCache.current.set(url, parsed);
            }
            all.push(...(dataCache.current.get(url) || []));
          } catch (e) {
            console.error("Failed to load", url, e);
          }
        }
      }
      if (!cancelled) setRows(all);
    }
    load();
    return () => { cancelled = true; };
  }, [sources]);

  const stateOptions = useMemo(() => Array.from(new Set(rows.map(r => r.state).filter(Boolean))).sort(), [rows]);
  const districtOptions = useMemo(() => Array.from(new Set(rows.filter(r => !states.length || states.includes(r.state)).map(r => r.district).filter(Boolean))).sort(), [rows, states]);
  const statusOptions = useMemo(() => Array.from(new Set(rows.map(r => r.operational_status).filter(Boolean))).sort(), [rows]);
  const furnaceOptions = useMemo(() => Array.from(new Set(rows.flatMap(r => String(r.furnace || "").split(/[,;/]|\s\|\s/)).map(s => s.trim()).filter(Boolean))).sort(), [rows]);

  const filtered = useMemo(() => {
    let list = rows;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r => `${r.name} ${r.state} ${r.district}`.toLowerCase().includes(s));
    }
    if (states.length) list = list.filter(r => states.includes(r.state));
    if (districts.length) list = list.filter(r => districts.includes(r.district));
    if (statuses.length) list = list.filter(r => statuses.includes(r.operational_status));
    if (furnaces.length) list = list.filter(r => furnaces.some(f => String(r.furnace).toLowerCase().includes(f.toLowerCase())));
    return list.filter(r => r.lat != null && r.lon != null);
  }, [rows, search, states, districts, statuses, furnaces]);

  useEffect(() => { setPage(1); }, [filtered.length, sources.join(','), search, states.join(','), districts.join(','), statuses.join(','), furnaces.join(',')]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-extrabold">Biochar Cluster Map with Industrial Data and GeoJSON Overlays</h1>
        <p className="text-sm md:text-base text-foreground/70">Filter plants</p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-3">
          <MultiSelect label="Data sources" options={Object.keys(DATA_SOURCES)} selected={sources} setSelected={setSources} />

          <label className="text-sm font-semibold">Search Name (Plant/Company/Rice Mill)</label>
          <input className="input" placeholder="Search by name" value={search} onChange={e=>setSearch(e.target.value)} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <MultiSelect label="State" options={stateOptions} selected={states} setSelected={setStates} disabled={!sources.length} />
            <MultiSelect label="District" options={districtOptions} selected={districts} setSelected={setDistricts} disabled={!states.length && !sources.length} />
          </div>
        </div>

        <div className="md:col-span-1 space-y-3">
          <MultiSelect label="Operational status" options={statusOptions.length ? statusOptions : STATUS_OPTIONS} selected={statuses} setSelected={setStatuses} />
          <MultiSelect label="Furnace" options={furnaceOptions.length ? furnaceOptions : FURNACE_OPTIONS} selected={furnaces} setSelected={setFurnaces} />
        </div>

        <div className="md:col-span-1 space-y-3">
          <MultiSelect label="Select Primary GeoJSON Overlays" options={Object.keys(OVERLAYS)} selected={overlays} setSelected={setOverlays} />
        </div>
      </section>

      <section className="space-y-3">
        <div className="rounded-lg border overflow-hidden">
          <div className="flex items-center gap-4 p-3 border-b bg-secondary/50">
            <div className="text-sm font-medium">Legend:</div>
            {Object.keys(SOURCE_COLORS).map((s) => (
              <div key={s} className="flex items-center gap-2 text-sm">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: SOURCE_COLORS[s] }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
          <MapContainer center={INDIA_CENTER} zoom={5} className="h-[480px] w-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filtered.map((r, idx) => (
              <CircleMarker key={`${r.name}-${idx}`} center={[r.lat, r.lon]} radius={2} pathOptions={{ color: SOURCE_COLORS[r.source] || colorFromString(r.name), fillColor: SOURCE_COLORS[r.source] || colorFromString(r.name), fillOpacity: 0.9 }}>
                <RLTooltip direction="top" offset={[0, -4]} opacity={1} permanent={false}>
                  <div className="text-xs">
                    <div className="font-semibold">{r.name}</div>
                    <div>{r.district || 'N/A'}, {r.state || 'N/A'}</div>
                  </div>
                </RLTooltip>
              </CircleMarker>
            ))}

            {overlays.map((key, i) => (
              <Overlay key={key} index={i} name={key} url={OVERLAYS[key]} overlayCache={overlayCache} />
            ))}
          </MapContainer>
        </div>
        <div className="text-sm"><span className="font-semibold">Total mills shown:</span> {filtered.length}</div>
      </section>

      <section className="rounded-lg border overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-3">Plant name</th>
              <th className="text-left p-3">State</th>
              <th className="text-left p-3">District</th>
              <th className="text-left p-3">Operational status</th>
              <th className="text-left p-3">Furnance</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-muted/40">
                <td className="p-3">{r.name}</td>
                <td className="p-3">{r.state}</td>
                <td className="p-3">{r.district}</td>
                <td className="p-3">{r.operational_status}</td>
                <td className="p-3">{r.furnace}</td>
              </tr>
            ))}
            {!paged.length && (
              <tr>
                <td className="p-6 text-center text-foreground/60" colSpan={5}>No results</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between p-3 border-t bg-white">
          <div className="text-xs text-foreground/60">Page {page} of {pageCount}</div>
          <div className="flex gap-2">
            <button className="btn" onClick={()=>setPage(p=>Math.max(1, p-1))} disabled={page<=1}>Prev</button>
            <button className="btn" onClick={()=>setPage(p=>Math.min(pageCount, p+1))} disabled={page>=pageCount}>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}

function normalizeKey(k){return k.toLowerCase().replace(/[^a-z0-9]/g,'');}
function pickFuzzy(obj, patterns){
  const entries = Object.entries(obj);
  for(const p of patterns){
    const pn = normalizeKey(p);
    for(const [k,v] of entries){
      const kn = normalizeKey(k);
      if(kn.includes(pn)) return v;
    }
  }
  return '';
}
function pickRegex(obj, regexes){
  for(const [k,v] of Object.entries(obj)){
    const nk = normalizeKey(k);
    if(regexes.some(re => re.test(nk))) return v;
  }
  return '';
}

function Overlay({ name, url, overlayCache, index }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (!overlayCache.current.has(url)) {
          const res = await fetch(url);
          const json = await res.json();
          overlayCache.current.set(url, json);
        }
        if (!cancelled) setData(overlayCache.current.get(url));
      } catch (e) { console.error("overlay", url, e); }
    }
    load();
    return () => { cancelled = true; };
  }, [url]);

  const color = useMemo(() => colorFromString(name), [name]);
  const dashArray = index % 3 === 0 ? "4 4" : index % 3 === 1 ? "8 4" : undefined;
  if (!data) return null;
  return (
    <GeoJSON
      data={data}
      style={{ color, weight: 1.2, fillOpacity: 0.12, fillColor: color, dashArray }}
      pointToLayer={(feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 2,
          color,
          weight: 0.6,
          fillColor: color,
          fillOpacity: 0.85,
        })
      }
      onEachFeature={(feature, layer) => {
        const place = pickFuzzy(feature.properties || {}, ["name","placename","location","label","district","tehsil"]) || "Unknown";
        const st = pickFuzzy(feature.properties || {}, ["state","stname","state_name"]) || "";
        layer.bindTooltip(`${place}${st ? `, ${st}` : ''}`, { sticky: true, direction: 'top' });
      }}
    />
  );
}

function normalizeRow(row) {
  const lat = pick(row, ["lat","latitude","y","ycoord","latitude (y)"]);
  const lon = pick(row, ["lon","lng","long","longitude","x","xcoord","longitude (x)"]);
  const name = pick(row, ["plantname","name","company","companyname","millname","plant","unit","site"]);
  const state = pick(row, ["state","state name","st","stname"]);
  const district = pick(row, ["district","dist","districtname"]);
  let status = pickFuzzy(row, ["operational status","status","operating status","operation status","operational"]);
  if(!status) status = pickRegex(row, [/operat/, /status/, /active/, /defunct/, /insolv/]);
  let furnace = pickFuzzy(row, ["furnace","furnance","furnace type","furnacetype","process","technology","route","steelmaking","converter"]);
  if(!furnace) furnace = pickRegex(row, [/furn/, /furnan/, /process/, /(eaf|bf|if|saf|dri|rm|sinter|caster|conarc|aod|vod)/]);
  const latNum = parseFloat(String(lat).replace(/,/g, '.'));
  const lonNum = parseFloat(String(lon).replace(/,/g, '.'));
  return {
    name: name || "Unknown",
    state: (state || "").trim(),
    district: (district || "").trim(),
    operational_status: (status || "").trim(),
    furnace: (furnace || "").trim(),
    lat: isFinite(latNum) ? latNum : null,
    lon: isFinite(lonNum) ? lonNum : null,
  };
}

function MultiSelect({ label, options, selected, setSelected, disabled }){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const ref=useRef(null);

  useEffect(()=>{
    function onClick(e){ if(open && ref.current && !ref.current.contains(e.target)) setOpen(false); }
    function onKey(e){ if(e.key === 'Escape') setOpen(false); }
    window.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
    return ()=>{
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
    };
  },[open]);

  const filtered = useMemo(()=>options.filter(o=>o && o.toString().toLowerCase().includes(q.toLowerCase())),[options,q]);

  function toggle(v){
    if(selected.includes(v)) setSelected(selected.filter(x=>x!==v));
    else setSelected([...selected, v]);
  }
  function clearAll(){ setSelected([]); setQ(''); }

  return (
    <div className="space-y-1 relative" ref={ref}>
      <label className="text-sm font-semibold">{label}</label>
      <button type="button" disabled={disabled} onClick={()=>setOpen(o=>!o)} className="w-full justify-between select text-left flex items-center gap-2 h-12 text-base">
        <span className="truncate">{selected.length ? `${selected.length} selected` : 'Select...'}</span>
        <span aria-hidden className="ml-auto text-foreground/60">▾</span>
      </button>
      {open && (
        <div
          className="absolute left-0 mt-1 w-full rounded-md border bg-white shadow-2xl z-[9999]"
          style={{ maxHeight: "70vh", overflowY: "auto", overscrollBehavior: "contain" }}
        >
          <div className="sticky top-0 p-2 border-b bg-white/95 backdrop-blur z-10">
            <input className="input text-lg" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
            <div className="mt-2 text-right"><button className="badge" onClick={clearAll}>Clear</button></div>
          </div>
          <ul className="p-2">
            {filtered.map(v=> (
              <li
                key={v}
                className="flex items-start gap-3 py-3 px-3 text-lg leading-6 hover:bg-secondary rounded cursor-pointer"
                onClick={()=>toggle(v)}
              >
                <input className="mt-0.5 h-5 w-5" aria-label={v} type="checkbox" checked={selected.includes(v)} onChange={()=>toggle(v)} />
                <span className="whitespace-normal break-words" title={v}>{v}</span>
              </li>
            ))}
            {!filtered.length && <li className="py-3 text-sm text-foreground/60">No options</li>}
          </ul>
        </div>
      )}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selected.slice(0,6).map(v => (
            <span key={v} className="badge" title={v}>{v}</span>
          ))}
          {selected.length>6 && (<span className="badge">+{selected.length-6} more</span>)}
        </div>
      )}
    </div>
  );
}
