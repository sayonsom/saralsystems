// Simple helper to open a WebSocket to backend for simulation logs

export function openSimulationWS(baseUrl, simulationId, token) {
  try {
    const wsBase = baseUrl.replace(/^http/i, "ws");
    const url = new URL(`${wsBase}/ws/simulations/${simulationId}`);
    if (token) url.searchParams.set("token", token);
    return new WebSocket(url.toString());
  } catch (e) {
    return null;
  }
}
