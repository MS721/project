import React, { useMemo, useState } from "react";

const CROPS = [
  { key: "bamboo", name: "Bamboo", url: "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/pdfs/bamboo.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZGZzL2JhbWJvby5wZGYiLCJpYXQiOjE3NjAwMzAwOTQsImV4cCI6MTc5MTU2NjA5NH0.EkMIlotEVQ1GhxRnl86LBXlMqemlrcw-xbgKMdyRnvA" },
  { key: "cotton", name: "Cotton", url: "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/pdfs/cotton.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZGZzL2NvdHRvbi5wZGYiLCJpYXQiOjE3NjAwMzAxODEsImV4cCI6MTc5MTU2NjE4MX0.88FCzmJ6oTvcP3NT_IdZQLlnirDBAXAWe6JcR7q75ew" },
  { key: "juliflora", name: "Juliflora", url: "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/pdfs/Juliflora%20(1).pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZGZzL0p1bGlmbG9yYSAoMSkucGRmIiwiaWF0IjoxNzYwMDMwMjA4LCJleHAiOjE3OTE1NjYyMDh9.hGnNenFZaYq1YApSmuas7gOpYrAnASA1gXyy2RaFPwI" },
  { key: "lantana", name: "Lantana", url: "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/pdfs/Lantana%20(1).pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZGZzL0xhbnRhbmEgKDEpLnBkZiIsImlhdCI6MTc2MDAzMDI0MCwiZXhwIjoxNzkxNTY2MjQwfQ.JtGV0H3jA7FJe_ClluibdCyRtozD3WXnk4SOJhM6QL0" },
  { key: "maize", name: "Maize", url: "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/pdfs/maize.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZGZzL21haXplLnBkZiIsImlhdCI6MTc2MDAzMDI2NiwiZXhwIjoxNzkxNTY2MjY2fQ.YF_WDuoMLCMaTX9bwBNsmnHgFmqTsRaWyUm2Gu_4dBU" },
  { key: "sugarcane", name: "Sugarcane", url: "https://twnpddkqfniiirohpkok.supabase.co/storage/v1/object/sign/pdfs/sugarcane.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV81YzNhMTIzOS03MzJmLTQzOGQtODE5My0zM2UzMjNlYWUxM2EiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJwZGZzL3N1Z2FyY2FuZS5wZGYiLCJpYXQiOjE3NjAwMzAyOTEsImV4cCI6MTc5MTU2NjI5MX0.2iikpbiYfaHzdrsWPcUdknzDk_2wtbKaQd2RN6jaEHY" },
];

export default function CropData() {
  const [sel, setSel] = useState(CROPS[0].key);
  const current = useMemo(() => CROPS.find(c => c.key === sel), [sel]);

  return (
    <div className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-extrabold">Crop specific data</h2>
        <p className="text-sm text-foreground/70">Select a crop to preview and download the PDF</p>
      </header>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <select className="select md:w-72" value={sel} onChange={(e)=>setSel(e.target.value)}>
          {CROPS.map(c => <option value={c.key} key={c.key}>{c.name}</option>)}
        </select>
        <a className="btn md:ml-auto" href={current.url} target="_blank" rel="noreferrer">Download PDF</a>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <iframe title={current.name} src={current.url} className="w-full h-[70vh]" />
      </div>
    </div>
  );
}
