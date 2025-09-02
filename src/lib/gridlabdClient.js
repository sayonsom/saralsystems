// Minimal client for our Next.js proxy routes

async function handle(res) {
  if (!res.ok) throw new Error(await res.text());
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.blob();
}

export const projects = {
  async listProjects() {
    return handle(await fetch("/api/projects", { cache: "no-store" }));
  },
  async createProject(data) {
    return handle(await fetch("/api/projects", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) }));
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
    fd.append("project_id", projectId);
    fd.append("main_filename", mainFilename);
    if (name) fd.append("name", name);
    fd.append("file", zipBlob, "project.zip");

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
