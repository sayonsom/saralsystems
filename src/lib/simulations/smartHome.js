// ---------------------------- Simulation ----------------------------
function simulateDay({
  R = 2, C = 2, PmaxAC = 3, kAC = 0.8, Ts = 24, T0 = 28, To = 32,
  fridge, ev, solarPeak = 4, Pref = 2.0, kEV = 1.0, kAggAC = 0.2,
  horizonMin = 180, dtMin = 0.25
}) {
  const a = 1 / (R * C);
  const bAC = PmaxAC / C;

  let Tin = T0;
  let Tfr = fridge.Tinit;
  let fridgeOn = false;
  let soc = ev.soc0;

  const N = Math.floor(horizonMin / dtMin);
  const data = [];
  let satAC = 0, satEV = 0;

  const solarProfile = (tMin) => {
    const h = tMin / 60;
    if (h < 6 || h > 18) return 0;
    const x = (h - 6) / 12;
    return solarPeak * Math.sin(Math.PI * x);
  };

  for (let i = 0; i <= N; i++) {
    const tMin = i * dtMin;
    const P_solar = solarProfile(tMin);

    const P_base = 0.3;
    const { Tset, band, Pfr, kCool, kLeak } = fridge;
    if (Tfr >= Tset + band) fridgeOn = true;
    if (Tfr <= Tset - band) fridgeOn = false;
    const P_fridge = fridgeOn ? Pfr : 0;
    const dTfr = (fridgeOn ? -kCool : 0) + kLeak * (Tin - Tfr);
    Tfr += dTfr * dtMin;

    const eT = Tin - Ts;
    let u_ac = Math.max(0, Math.min(1, kAC * eT));
    const u_ac_mod = Math.max(0, Math.min(1, u_ac + kAggAC * (P_base + P_fridge + u_ac * PmaxAC - P_solar - Pref)));
    if (u_ac !== u_ac_mod) satAC++;
    u_ac = u_ac_mod;
    const P_ac = u_ac * PmaxAC;

    const P_load_unc = P_base + P_fridge + P_ac + ev.P_other;
    const eGrid = (P_load_unc - P_solar) - Pref;

    let P_ev = Math.max(0, Math.min(ev.Pmax, -kEV * eGrid));
    if (P_ev === 0 || P_ev === ev.Pmax) satEV++;

    const P_load_tot = P_load_unc + P_ev;
    const P_grid = P_load_tot - P_solar;
    const eGrid2 = P_grid - Pref;

    const dTin = -a * (Tin - To) - (PmaxAC * u_ac) / C;
    Tin += dTin * (dtMin / 60);

    const eta = 0.92;
    soc = Math.max(0, Math.min(1, soc + (P_ev * eta) * (dtMin / 60) / ev.battKWh));

    data.push({ t: tMin, P_solar, P_base, P_fridge, P_ac, P_ev, P_grid, Tin, Ts, Tfr, eGrid: eGrid2, soc: soc * 100 });
  }

  const satPctAC = (100 * satAC) / (N + 1);
  const satPctEV = (100 * satEV) / (N + 1);
  const lambdaNominal = a + bAC * kAC;

  return { data, metrics: { a, bAC, lambdaNominal, satPctAC, satPctEV } };
}

export { simulateDay };
