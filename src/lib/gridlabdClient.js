// Minimal client for our Next.js API routes

async function handle(res) {
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.blob();
}

export const projects = {
  async listProjects() {
    const data = await handle(await fetch("/api/projects", { cache: "no-store" }));
    return Array.isArray(data) ? data : (data?.projects || data?.data || []);
  },
  async createProject(data) {
    const resp = await handle(await fetch("/api/projects", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }));
    return resp?.id ? resp : (resp?.project || resp?.data || resp);
  },
  async getProject(id) {
    return handle(await fetch(`/api/projects/${id}`, { cache: "no-store" }));
  },
  async updateProject(id, data) {
    return handle(await fetch(`/api/projects/${id}`, { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }));
  },
  async deleteProject(id) {
    return handle(await fetch(`/api/projects/${id}`, { method: "DELETE" }));
  },
};

export const simulations = {
  async runSimulationFromArchive({ projectId, name, mainFilename, zipBlob }) {
    const fd = new FormData();
    
    // Required file field - always include the zip blob
    fd.append("file", zipBlob, "project.zip");
    
    // Always include project_id (use fallback if not provided)
    fd.append("project_id", projectId || "local");
    
    // Optional fields
    if (mainFilename) fd.append("main_filename", mainFilename);
    if (name) fd.append("name", name);
    
    console.log("FormData fields:", Array.from(fd.entries()).map(([k,v]) => `${k}: ${v instanceof File ? `File(${v.size}B, ${v.name})` : v}`));
    console.log("Zip blob details:", zipBlob.size, zipBlob.type);
    
    return handle(await fetch("/api/simulations/archive", { method: "POST", body: fd }));
  },
  async getSimulation(id) {
    return handle(await fetch(`/api/simulations/${id}`, { cache: "no-store" }));
  },
  async cancelSimulation(id) {
    return handle(await fetch(`/api/simulations/${id}`, { method: "DELETE" }));
  },
  async listSimulationFiles(id) {
    return handle(await fetch(`/api/simulations/${id}/files`, { cache: "no-store" }));
  },
  async downloadSimulationFile(id, filename) {
    return handle(await fetch(`/api/simulations/${id}/files/${encodeURIComponent(filename)}`));
  },
};
