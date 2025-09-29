// src/components/CountryTimeSeries.jsx
'use client';

import { useMemo } from 'react';

/**
 * Simple 72h line chart for carbon intensity
 */
export default function CountryTimeSeries({
  palette,
  accent = '#ea580b',
  carbonSeries = [],
  mixSeries = [],
  sources = [],
}) {
  const width = 288;  // fits sidebar nicely (320px - paddings)
  const height = 120;
  const pad = { l: 28, r: 8, t: 8, b: 20 };

  const domainCarbon = useMemo(() => {
    if (!carbonSeries.length) return [0, 1];
    let min = Infinity, max = -Infinity;
    for (const p of carbonSeries) {
      if (p.value < min) min = p.value;
      if (p.value > max) max = p.value;
    }
    if (min === max) { min -= 1; max += 1; }
    return [Math.floor(min), Math.ceil(max)];
  }, [carbonSeries]);

  const xScale = (i, n) => {
    if (n <= 1) return pad.l;
    return pad.l + (i * (width - pad.l - pad.r)) / (n - 1);
  };
  const yScale = (v, min, max) => {
    if (max - min === 0) return height - pad.b;
    return pad.t + (height - pad.t - pad.b) * (1 - (v - min) / (max - min));
  };

  const carbonPoints = useMemo(() => {
    const [min, max] = domainCarbon;
    return carbonSeries.map((p, i) => `${xScale(i, carbonSeries.length)},${yScale(p.value, min, max)}`).join(' ');
  }, [carbonSeries, domainCarbon]);

  // Build stacked areas for energy mix (take top 4 by avg)
  const topSources = useMemo(() => {
    if (!sources?.length) return [];
    const names = sources.map(s => s.source);
    const avg = {};
    for (const s of names) avg[s] = 0;

    for (const row of mixSeries) {
      for (const s of names) avg[s] += row[s] ?? 0;
    }
    names.sort((a, b) => avg[b] - avg[a]);
    return names.slice(0, 4);
  }, [sources, mixSeries]);

  const stackedPaths = useMemo(() => {
    if (!mixSeries.length || !topSources.length) return [];

    const W = width - pad.l - pad.r;
    const H = height - pad.t - pad.b;
    const n = mixSeries.length;

    const layers = topSources.map(() => new Array(n).fill(0));
    // Build cumulative stacks (0..100)
    for (let i = 0; i < n; i++) {
      let acc = 0;
      for (let j = 0; j < topSources.length; j++) {
        const val = Math.max(0, mixSeries[i][topSources[j]] ?? 0);
        acc += val;
        layers[j][i] = Math.min(100, acc);
      }
    }

    // Convert each cumulative layer to an area path
    const paths = [];
    for (let j = 0; j < topSources.length; j++) {
      const upper = layers[j];
      const lower = j === 0 ? new Array(n).fill(0) : layers[j - 1];

      // upper line
      const up = upper.map((v, i) => {
        const x = pad.l + (i * W) / (n - 1);
        const y = pad.t + H * (1 - v / 100);
        return `${x},${y}`;
      }).join(' ');

      // lower line (reverse)
      const lo = lower.slice().reverse().map((v, k) => {
        const i = n - 1 - k;
        const x = pad.l + (i * W) / (n - 1);
        const y = pad.t + H * (1 - v / 100);
        return `${x},${y}`;
      }).join(' ');

      const color = j === 0 ? accent :
        j === 1 ? '#6a6a6a' :
        j === 2 ? '#8a8a8a' : '#3a3a3a';

      paths.push({ d: `${up} ${lo}`, color, name: topSources[j] });
    }
    return paths.reverse(); // draw smallest on top
  }, [mixSeries, topSources]);

  const gridLines = useMemo(() => {
    const lines = [];
    const [min, max] = domainCarbon;
    const ticks = 4;
    for (let i = 0; i <= ticks; i++) {
      const v = min + (i * (max - min)) / ticks;
      const y = yScale(v, min, max);
      lines.push({ y, v: Math.round(v) });
    }
    return lines;
  }, [domainCarbon]);

  return (
    <div>
      {/* Carbon Intensity (72h) */}
      <div style={{ background: palette.p2, border: `1px solid ${palette.p3}` }} className="mb-4">
        <div className="px-3 py-2 text-xs font-semibold" style={{ color: palette.e, background: palette.p1, borderBottom: `1px solid ${palette.p3}` }}>
          Hourly Carbon Intensity (last 72h)
        </div>
        <div className="px-2 py-2">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            {/* Grid */}
            {gridLines.map((g, idx) => (
              <g key={idx}>
                <line x1={pad.l} x2={width - pad.r} y1={g.y} y2={g.y} stroke={palette.p3} strokeWidth="1" />
                <text x={2} y={g.y + 3} fontSize="9" fill={palette.a}>{g.v}</text>
              </g>
            ))}
            {/* Carbon polyline */}
            <polyline points={carbonPoints} fill="none" stroke={accent} strokeWidth="2" />
          </svg>
          <div className="mt-1 flex justify-between text-[10px]" style={{ color: palette.c }}>
            <span>72h ago</span>
            <span>now</span>
          </div>
        </div>
      </div>

      {/* Electricity Mix (72h) */}
      <div style={{ background: palette.p2, border: `1px solid ${palette.p3}` }}>
        <div className="px-3 py-2 text-xs font-semibold" style={{ color: palette.e, background: palette.p1, borderBottom: `1px solid ${palette.p3}` }}>
          Hourly Electricity Mix (last 72h)
        </div>
        <div className="px-2 py-2">
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            {/* Stacked areas */}
            {stackedPaths.map((layer, idx) => (
              <polygon key={idx} points={layer.d} fill={layer.color} opacity="0.9" />
            ))}
            {/* Frame */}
            <rect x={pad.l} y={pad.t} width={width - pad.l - pad.r} height={height - pad.t - pad.b} fill="none" stroke={palette.p3} />
          </svg>
          {/* Legend */}
          <div className="mt-2 flex flex-wrap gap-2">
            {stackedPaths.map((layer, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-[10px]" style={{ color: palette.c }}>
                <span className="inline-block" style={{ width: 10, height: 10, background: layer.color }} />
                {layer.name}
              </span>
            ))}
          </div>
          <div className="mt-1 flex justify-between text-[10px]" style={{ color: palette.c }}>
            <span>72h ago</span>
            <span>now</span>
          </div>
        </div>
      </div>
    </div>
  );
}