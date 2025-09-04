"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart as RLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { simulateDay } from "@/lib/simulations/smartHome";
import NewsletterForm from "@/components/NewsletterForm";


export default function Page() {
  // Building & AC
  const [R, setR] = useState(2);
  const [C, setC] = useState(2);
  const [PmaxAC, setPmaxAC] = useState(3);
  const [kAC, setKAC] = useState(0.8);
  const [Ts, setTs] = useState(24);
  const [T0, setT0] = useState(28);
  const [To, setTo] = useState(32);

  // Fridge
  const [TfrSet, setTfrSet] = useState(4);
  const [TfrBand, setTfrBand] = useState(1);
  const [TfrInit, setTfrInit] = useState(6);
  const [Pfr, setPfr] = useState(0.15);
  const [kCool, setKCool] = useState(0.08);
  const [kLeak, setKLeak] = useState(0.015);

  // EV
  const [PmaxEV, setPmaxEV] = useState(7.2); // 32A @ 230V
  const [battKWh, setBattKWh] = useState(60);
  const [soc0, setSoc0] = useState(0.3);
  const [Pother, setPother] = useState(0.0); // placeholder extra load

  // Solar & coordinator
  const [solarPeak, setSolarPeak] = useState(4.0);
  const [Pref, setPref] = useState(2.0);
  const [kEV, setKEV] = useState(1.0);
  const [kAggAC, setKAggAC] = useState(0.2);

  // Time
  const [horizonMin, setHorizon] = useState(240);
  const [dtMin, setDt] = useState(0.25);

  // Simulation results and control
  const [data, setData] = useState([]);
  const [metrics, setMetrics] = useState({ lambdaNominal: 0, satPctAC: 0, satPctEV: 0, a: 0, bAC: 0 });
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = () => {
    setIsSimulating(true);
    const res = simulateDay({
      R: Number(R), C: Number(C), PmaxAC: Number(PmaxAC), kAC: Number(kAC), Ts: Number(Ts), T0: Number(T0), To: Number(To),
      fridge: { Tset: Number(TfrSet), band: Number(TfrBand), Tinit: Number(TfrInit), Pfr: Number(Pfr), kCool: Number(kCool), kLeak: Number(kLeak) },
      ev: { Pmax: Number(PmaxEV), battKWh: Number(battKWh), soc0: Number(soc0), P_other: Number(Pother) },
      solarPeak: Number(solarPeak),
      Pref: Number(Pref), kEV: Number(kEV), kAggAC: Number(kAggAC),
      horizonMin: Number(horizonMin), dtMin: Number(dtMin),
    });
    setData(res.data);
    setMetrics(res.metrics);
    setIsSimulating(false);
  };

  // Initial run
  useEffect(() => {
    runSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="max-w-7xl mx-auto px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Smart Home Stability: Solar · Fridge · AC · EV</h1>
          {/* Excerpt & business use case */}
          <p className="mt-3 text-gray-700 md:text-lg">
            Lyapunov stability gives a practical way to keep smart homes responsive yet calm. By shaping a
            simple energy error and temperature error into a function that always trends down, we can
            coordinate AC, fridge, EV charging, and rooftop solar so the home stays comfortable, tracks a
            grid import target, and charges the car opportunistically.
          </p>
          <p className="mt-2 text-gray-600">
            Business use case: utilities and aggregators can deploy this control to thousands of homes to
            reduce peak demand and ramp rates without sacrificing comfort—unlocking demand response revenue
            and improving grid reliability.
          </p>
          {/* Author meta (similar spirit to posts) */}
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-600">
            <img src="/logo.png" alt="Sayonsom Chanda" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
            <div>
              <div className="font-medium text-gray-900">Sayonsom Chanda, Ph.D.</div>
              <div className="flex items-center gap-2">
                <time dateTime="2025-09-04">Sep 4, 2025</time>
                <span>•</span>
                <span>Tutorial</span>
              </div>
            </div>
          </div>
          {/* Brief guide sentence */}
          <p className="mt-3 text-gray-700 md:text-lg">Short theory on the left. Hands-on sims on the right. Scan, tweak, learn.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* LEFT: THEORY (Typography) */}
          <aside className="prose prose-gray max-w-none md:sticky md:top-6">
            <h2>Why Lyapunov?</h2>
            <p>We want homes that react fast but never spiral. Lyapunov gives a test: pick a function V that always goes down. If V shrinks, the system settles.</p>
            <p>For power, use <code>e = P_grid − P_ref</code>. For comfort, use <code>e = T_in − T_set</code>. Keep e trending to zero.</p>

            <h3>The 10‑second idea</h3>
            <p>Choose <code>V = 0.5 e^2</code>. Make your control law so <code>V̇ = e·ė</code> is negative (or mostly negative if actuators saturate). That’s it.</p>
            <p>In plain English: bigger error → stronger correction; as you get close, back off smoothly.</p>

            <h3>A touch more math</h3>
            <p>
              A minimal thermal model is <code>\dot T_in = -a (T_in - T_o) - b u_ac</code>, where
              <code> a = 1/(RC)</code> and <code>b = P_max/C</code>. Let error <code>e_T = T_in - T_s</code> and a proportional law
              <code> u_ac = k_AC e_T</code> with saturation. Then <code>\dot e_T ≈ -(a + b k_AC) e_T + d</code>. If <code>a + b k_AC &gt; 0</code>
              and disturbances <code>d</code> are small, errors decay exponentially, yielding comfort without oscillation.
            </p>
            <p>
              For power, define <code>e_P = P_grid - P_ref</code> and set EV power <code>P_ev = clip(-k_EV e_P, 0, P_max)</code>.
              This makes <code>\dot V = e_P\,\dot e_P</code> negative when unconstrained and mostly negative under sensible limits.
            </p>

            <h3>Our control knobs</h3>
            <ul>
              <li><b>k_EV:</b> How strongly EV charging fights grid error.</li>
              <li><b>k_AC:</b> Temperature controller gain.</li>
              <li><b>k_Agg(AC):</b> Small nudge so AC helps grid target (don’t overdo; comfort matters).</li>
              <li><b>P_ref:</b> Your grid import goal (kW). Zero means aim for net‑zero.</li>
            </ul>

            <h3>What to watch</h3>
            <ul>
              <li><b>Grid Import:</b> Does it hug <code>P_ref</code> without ripples?</li>
              <li><b>Indoor Temp:</b> Does it track setpoint with small overshoot?</li>
              <li><b>EV SoC:</b> Grows when there’s solar surplus; pauses when grid is tight.</li>
              <li><b>Saturation %:</b> Too high = sluggish control and comfort issues.</li>
            </ul>

            <h3>Failure patterns</h3>
            <p>Big gains + actuator limits = sawtooth power and noisy comfort. Dial back k_EV, keep k_Agg(AC) modest.</p>
            <p>Weak insulation? Raise R (or lower C with smaller thermal mass). Hardware beats tuning.</p>

            <h3>Manager takeaways</h3>
            <p>Stability can be designed, not guessed. These simple laws scale to fleets of devices and DR events.</p>
            <p>Proofs win certification and trust. Smooth behavior saves parts and energy.</p>

            <details className="mt-4">
              <summary>Math in one line</summary>
              <p>Temp loop: <code>ė = −(a + b·k_AC) e + d</code>. If <code>a + b·k_AC &gt; 0</code> and d is small, e decays exponentially.</p>
            </details>
          </aside>

          {/* RIGHT: SIMULATIONS */}
          <div>
            {/* Controls */}
            <div className="grid xl:grid-cols-2 gap-6">
              <Card title="Room & AC">
                <LabeledInput label="R (°C/kW)" value={R} setValue={setR} step={0.1} />
                <LabeledInput label="C (kWh/°C)" value={C} setValue={setC} step={0.1} />
                <LabeledInput label="Pmax AC (kW)" value={PmaxAC} setValue={setPmaxAC} step={0.1} />
                <LabeledInput label="k_AC" value={kAC} setValue={setKAC} step={0.05} />
                <LabeledInput label="Ts (°C)" value={Ts} setValue={setTs} step={0.5} />
                <LabeledInput label="T₀ (°C)" value={T0} setValue={setT0} step={0.5} />
                <LabeledInput label="To (°C)" value={To} setValue={setTo} step={0.5} />
                <Pill>λ = {(metrics.lambdaNominal).toFixed(2)} h⁻¹</Pill>
              </Card>

              <Card title="Fridge">
                <LabeledInput label="T_set (°C)" value={TfrSet} setValue={setTfrSet} step={0.5} />
                <LabeledInput label="Band (±°C)" value={TfrBand} setValue={setTfrBand} step={0.1} />
                <LabeledInput label="T_init (°C)" value={TfrInit} setValue={setTfrInit} step={0.5} />
                <LabeledInput label="P_fridge (kW)" value={Pfr} setValue={setPfr} step={0.05} />
                <LabeledInput label="kCool (°C/min)" value={kCool} setValue={setKCool} step={0.01} />
                <LabeledInput label="kLeak (°C/min)" value={kLeak} setValue={setKLeak} step={0.005} />
              </Card>

              <Card title="EV Charger">
                <LabeledInput label="Pmax EV (kW)" value={PmaxEV} setValue={setPmaxEV} step={0.1} />
                <LabeledInput label="Battery (kWh)" value={battKWh} setValue={setBattKWh} step={1} />
                <LabeledInput label="SoC₀ (0–1)" value={soc0} setValue={setSoc0} step={0.05} />
                <LabeledInput label="k_EV" value={kEV} setValue={setKEV} step={0.1} />
              </Card>

              <Card title="Solar & Coordinator">
                <LabeledInput label="Solar peak (kW)" value={solarPeak} setValue={setSolarPeak} step={0.2} />
                <LabeledInput label="P_ref (kW)" value={Pref} setValue={setPref} step={0.2} />
                <LabeledInput label="k_Agg(AC)" value={kAggAC} setValue={setKAggAC} step={0.05} />
                <LabeledInput label="Horizon (min)" value={horizonMin} setValue={setHorizon} step={5} />
                <LabeledInput label="dt (min)" value={dtMin} setValue={setDt} step={0.05} />
                <Pill warn={metrics.satPctAC>10 || metrics.satPctEV>10}>
                  Sat AC {metrics.satPctAC.toFixed(1)}% · EV {metrics.satPctEV.toFixed(1)}%
                </Pill>
              </Card>
            </div>

            {/* Charts: stacked full-width */}
            <div className="mt-8 space-y-6">
              <ChartCard title="Power Flows (kW)">
                <Chart data={data} lines={[{k:"P_grid", name:"Grid Import", stroke:"#2563eb"},{k:"P_solar", name:"Solar PV", stroke:"#dc2626"},{k:"P_ac", name:"AC", stroke:"#10b981"},{k:"P_fridge", name:"Fridge", stroke:"#f59e0b"},{k:"P_ev", name:"EV", stroke:"#7c3aed"},{k:"P_base", name:"Base", stroke:"#6b7280"}]} yLabel="kW" />
              </ChartCard>
              <ChartCard title="Temperatures (°C)">
                <Chart data={data} lines={[{k:"Tin", name:"Indoor", stroke:"#2563eb"},{k:"Ts", name:"Setpoint", stroke:"#10b981"},{k:"Tfr", name:"Fridge", stroke:"#f59e0b"}]} yLabel="°C" />
              </ChartCard>
              <ChartCard title="Grid Error & EV SoC">
                <ResponsiveContainer width="100%" height={260}>
                  <RLineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="t" tickFormatter={(v)=>v.toFixed(0)} label={{ value: "Time (min)", position: "insideBottom", offset: -5 }} />
                    <YAxis yAxisId="left" label={{ value: "e = P_grid - P_ref (kW)", angle: -90, position: "insideLeft" }} />
                    <YAxis yAxisId="right" orientation="right" domain={[0,100]} label={{ value: "EV SoC (%)", angle: -90, position: "insideRight" }} />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="eGrid" name="Grid Error" stroke="#ef4444" dot={false} />
                    <Line yAxisId="right" type="monotone" dataKey="soc" name="EV SoC (%)" stroke="#0ea5e9" dot={false} />
                  </RLineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Quick experiments (full-width) */}
            <Card title="Quick Experiments">
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                <li><b>PV surplus:</b> Set <code>P_ref = 0</code>, raise solar peak. EV soaks up surplus; grid import ≈ 0.</li>
                <li><b>Evening deficit:</b> Lower solar. EV throttles to hold import near <code>P_ref</code>.</li>
                <li><b>Comfort tradeoff:</b> Increase <code>k_Agg(AC)</code> slowly. Too high → temperature drift.</li>
                <li><b>Oscillation fix:</b> If error ripples, reduce <code>k_EV</code>. If sluggish, nudge it up.</li>
              </ul>
            </Card>

            <footer className="mt-8 text-xs text-gray-500">
              Educational model. Ignores humidity, compressor maps, and some thermal couplings.
            </footer>

            {/* Simulate button at bottom, full width */}
            <div className="mt-6">
              <button
                type="button"
                onClick={runSimulation}
                disabled={isSimulating}
                className="w-full inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-3 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSimulating ? "Simulating…" : "Simulate"}
              </button>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <NewsletterForm />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ---------------------------- UI bits ----------------------------
function LabeledInput({ label, value, setValue, step=0.1 }) {
  return (
    <label className="block mb-2">
      <span className="text-sm text-gray-800">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
      />
    </label>
  );
}

function Card({ title, children }) {
  return (
    <div className="p-4 rounded-2xl border bg-gray-50">
      <h4 className="font-semibold mb-2">{title}</h4>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

function Pill({ children, warn=false }) {
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs mt-2 ${warn ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
      {children}
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="p-4 rounded-2xl border bg-white">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Chart({ data, lines, yLabel }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <RLineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="t" tickFormatter={(v)=>v.toFixed(0)} label={{ value: "Time (min)", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft" }} />
        <Tooltip />
        <Legend />
        {lines.map((l)=> (
          <Line key={l.k} type="monotone" dataKey={l.k} name={l.name} stroke={l.stroke} dot={false} />
        ))}
      </RLineChart>
    </ResponsiveContainer>
  );
}
