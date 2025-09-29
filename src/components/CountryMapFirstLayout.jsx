// src/components/CountryMapFirstLayout.jsx
'use client';

import { useState, useMemo } from 'react';
import ElectricityMap from '@/components/ElectricityMaps';
import CountryTimeSeries from '@/components/CountryTimeSeries';

export default function CountryMapFirstLayout({ countryCode, country }) {
  const [open, setOpen] = useState(true);
  const accent = '#ea580b';
  const palette = useMemo(() => ({
    darkest: '#0f0f0f',
    p1: '#1a1a1a',
    p2: '#2a2a2a',
    p3: '#3a3a3a',
    p4: '#4a4a4a',
    p6: '#6a6a6a',
    p8: '#8a8a8a',
    a: '#aaa',
    c: '#ccc',
    e: '#eee',
  }), []);

  const mix = country?.electricity?.sources || [];

  const { carbonSeries, mixSeries72 } = useMemo(() => {
    const end = new Date();
    end.setMinutes(0, 0, 0);

    // Build last 72 hourly timestamps (ascending: 72h ago -> now)
    const ts = [];
    for (let i = 71; i >= 0; i--) {
      const d = new Date(end);
      d.setHours(end.getHours() - i);
      ts.push(d);
    }

    // Carbon intensity around base with smooth variation
    const baseI = country?.electricity?.emissions?.intensity ?? 300;
    const carbonSeries = ts.map((d, idx) => {
      const variation = 30 * Math.sin(idx / 8) + 10 * Math.cos(idx / 5);
      const value = Math.max(50, Math.round(baseI + variation));
      return { ts: d, value };
    });

    // Hourly electricity mix (percent, sums to 100)
    const names = (mix || []).map((s) => s.source);
    const mixSeries72 = ts.map((d, idx) => {
      const values = names.map((_, j) => {
        const base = mix[j]?.percent ?? 0;
        const delta = Math.sin((idx + j * 3) / 7) * (5 + (j % 3));
        return Math.max(0, base + delta);
      });
      const sum = values.reduce((a, b) => a + b, 0) || 1;
      const row = { ts: d };
      let acc = 0;
      for (let j = 0; j < names.length; j++) {
        if (j === names.length - 1) {
          row[names[j]] = Math.max(0, 100 - acc);
        } else {
          const pct = Math.max(0, Math.round((values[j] / sum) * 100));
          row[names[j]] = pct;
          acc += pct;
        }
      }
      return row;
    });

    return { carbonSeries, mixSeries72 };
  }, [countryCode, country]);

  return (
    <div className="relative h-screen w-full saral-map-first" style={{ backgroundColor: '#0f0f0f', color: '#eee' }}>
      <div className="absolute inset-0">
        <ElectricityMap
          country={countryCode}
          initialData={country?.electricity}
          coordinates={country?.coordinates}
          embedded={true}
          showHoverPanel={false}
          onViewDetails={() => setOpen(true)}
        />
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close sidebar' : 'Open sidebar'}
        className="absolute top-4 left-4 z-50 h-10 px-3 font-semibold"
        style={{
          backgroundColor: accent,
          color: '#0f0f0f',
          border: '1px solid #3a3a3a'
        }}
      >
        {open ? 'Hide panels' : 'Show panels'}
      </button>

      {/* Left Sidebar */}
      <aside
        className="absolute top-0 left-0 h-full z-40 overflow-y-auto"
        style={{
          width: open ? 320 : 0,
          backgroundColor: palette.p1,
          borderRight: `1px solid ${palette.p3}`,
          transition: 'transform 200ms ease, width 200ms ease',
          transform: open ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Header */}
        <div style={{ backgroundColor: palette.p2, borderBottom: `1px solid ${palette.p3}` }} className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center" style={{ backgroundColor: palette.p3 }}>
              <span className="text-2xl">{country?.flag}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold" style={{ color: palette.e }}>{country?.name}</h2>
                <span className="text-xs px-1 py-0.5" style={{ backgroundColor: palette.p3, color: palette.a, border: `1px solid ${palette.p4}` }}>
                  {country?.code}
                </span>
              </div>
              <p className="text-xs" style={{ color: palette.a }}>{country?.region}</p>
            </div>
          </div>
        </div>

        {/* Key metrics */}
        <div className="px-4 py-4" style={{ borderBottom: `1px solid ${palette.p3}` }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: palette.e }}>Key metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Production" value={`${country?.electricity?.production?.total} TWh`} accent={accent} />
            <Metric label="Renewables" value={`${country?.electricity?.renewable?.percentage}%`} accent={accent} />
            <Metric label="Carbon" value={`${country?.electricity?.emissions?.intensity} gCO₂/kWh`} accent={accent} />
            <Metric label="Capacity" value={`${country?.electricity?.capacity?.total} GW`} accent={accent} />
            <Metric label="Peak demand" value={`${country?.electricity?.production?.peakDemand} GW`} accent={accent} />
            <Metric label="Reliability" value={`${country?.electricity?.grid?.reliability}%`} accent={accent} />
          </div>
        </div>

        {/* Energy mix */}
        <div className="px-4 py-4" style={{ borderBottom: `1px solid ${palette.p3}` }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: palette.e }}>Energy mix</h3>
          <div className="space-y-2">
            {mix.slice(0, 6).map((s, i) => (
              <div key={i} className="w-full">
                <div className="flex items-center justify-between text-xs" style={{ color: palette.c }}>
                  <span className="capitalize">{s.source}</span>
                  <span>{s.percent}%</span>
                </div>
                <div className="h-2 w-full" style={{ backgroundColor: palette.p3, border: `1px solid ${palette.p4}` }}>
                  <div className="h-full" style={{ width: `${s.percent}%`, backgroundColor: accent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid details */}
        <div className="px-4 py-4">
          <h3 className="text-sm font-semibold mb-3" style={{ color: palette.e }}>Grid</h3>
          <ul className="space-y-2 text-xs" style={{ color: palette.c }}>
            <li className="flex justify-between"><span>Losses</span><span>{country?.electricity?.grid?.losses}%</span></li>
            <li className="flex justify-between"><span>Smart meters</span><span>{country?.electricity?.grid?.smartMeters}%</span></li>
            {country?.electricity?.grid?.substations && (
              <li className="flex justify-between"><span>Substations</span><span>{country?.electricity?.grid?.substations}</span></li>
            )}
          </ul>
        </div>

        {/* Time series panels */}
        <div className="px-4 py-4" style={{ borderTop: `1px solid ${palette.p3}` }}>
          <CountryTimeSeries
            palette={palette}
            accent={accent}
            carbonSeries={carbonSeries}
            mixSeries={mixSeries72}
            sources={mix}
          />
        </div>
      </aside>

      {/* CSS overrides to enforce design */}
      <style jsx global>{`
        .saral-map-first * { border-radius: 0 !important; }
        .saral-map-first [class*="bottom-4"][class*="right-4"][class*="bg-white"] { display: none !important; }
      `}</style>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div className="p-3" style={{ backgroundColor: '#2a2a2a', border: '1px solid #3a3a3a' }}>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: '#aaa' }}>{label}</div>
      <div className="mt-1 text-sm font-semibold" style={{ color: '#eee' }}>{value}</div>
      <div className="mt-2 h-0.5 w-8" style={{ backgroundColor: accent }} />
    </div>
  );
}