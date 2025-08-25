export async function POST(request) {
  try {
    const { projectDescription } = await request.json();

    if (!projectDescription || projectDescription.length < 10) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid project description." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY || "";
    const prompt = `You are an expert consultant for 'Saral', an Indian company that simplifies the energy transition. A potential customer has described their project as: "${projectDescription}".
      \nBased on this, generate a simple project starter kit. Your response must be in a JSON format.\n\nThe JSON object must have the following keys: "key_considerations", "next_steps", and "recommended_service".\n- "key_considerations" should be an array of 3-4 strings, outlining the most important factors to consider for this project in the Indian context.\n- "next_steps" should be an array of 3-4 strings, providing a clear, actionable checklist for the user.\n- "recommended_service" must be one of Saral's services: 'Data Center Prospecting & Design', 'PPA Cost-Saving Analysis', 'AI Workflow Automation', or 'Energy Workforce Skill-Gap ID'.\n\nKeep the language simple, clear, and encouraging. The considerations and next steps should be actionable and easy to understand for a non-expert.`;

    // If API key missing, return a deterministic mock for dev/preview
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          key_considerations: [
            "Assess local DISCOM policies and net metering availability",
            "Evaluate rooftop load capacity and shading across seasons",
            "Estimate CAPEX and expected payback under current tariffs",
            "Plan for O&M: cleaning, inverter replacements, warranties",
          ],
          next_steps: [
            "Share previous 12 months electricity bills",
            "Site survey for structural and electrical audit",
            "Obtain 2-3 vendor quotes with itemized BoM",
            "Review financing and incentives (state/central)",
          ],
          recommended_service: "PPA Cost-Saving Analysis",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Upstream API error: ${res.statusText}` }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await res.json();
    const rawText =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

    const jsonText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch {
      parsed = { error: "Invalid JSON from model" };
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "Unexpected server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

