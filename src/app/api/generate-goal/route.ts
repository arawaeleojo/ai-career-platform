import Groq from "groq-sdk";

export async function POST(req: Request) {
console.log("🚀 API HIT");

try {
const body = await req.json();
        console.log("📥 BODY RECEIVED:", body);
const { goal, timeline, intensity } = body;

if (!goal) {
  return Response.json({ error: "No goal provided" }, { status: 400 });
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const monthsMap = {
  "3 Months": 3,
  "6 Months": 6,
  "12 Months": 12,
};

  const monthsCount = monthsMap[timeline as keyof typeof monthsMap] || 6;
  
const prompt =
  "You are a strict JSON generator.\n\n" +

  "You MUST return ONLY valid JSON.\n\n" +

  "Goal: " + goal + "\n" +
  "Timeline: " + timeline + "\n" +
  "Intensity: " + intensity + "\n\n" +

  "Rules:\n" +
  "- Return EXACTLY " + monthsCount + " months\n" +
  "- Each month must have:\n" +
  "  title (string)\n" +
  "  description (string)\n" +
  "  tasks (array of strings)\n\n" +

  "- Tasks MUST be plain strings\n" +
  "- Do NOT return objects inside tasks\n" +
  "- Do NOT include explanations\n" +
  "- Do NOT include headings like Month 1 outside JSON\n" +
  "- Do NOT include markdown\n\n" +

  "Return ONLY JSON in this exact structure:\n" +

  "{\n" +
  '  "months": [\n' +
  "    {\n" +
  '      "title": "Month 1",\n' +
  '      "description": "Short description",\n' +
  '      "tasks": ["Task 1", "Task 2"]\n' +
  "    }\n" +
  "  ]\n" +
  "}";

const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: prompt },
    { role: "user", content: goal }
  ],
});

const result = completion.choices[0].message.content;

        return Response.json({ result });

    } catch (error) {
console.error("🔥 ERROR:", error);
return Response.json(
{ error: "Failed to generate response" },
{ status: 500 }
);
}
}