import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { keywords } = await req.json();

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `
You are an opportunity discovery assistant.

Based on these keywords:
${keywords}

Generate 5 HIGH QUALITY opportunities.

STRICT RULES:
- Return ONLY valid JSON
- Do NOT include explanations
- Do NOT include text before or after JSON
- Do NOT include markdown (no \`\`\`)
- Do NOT say anything like "Here are..."

FORMAT:

{
  "opportunities": [
    {
      "entity": "Company or Person",
      "title": "Opportunity title",
      "type": "Job | Grant | Fellowship | Competition | Connection",
      "location": "Location or Remote",
      "value": "Salary / Benefit",
      "match": 90,
      "highlight": "Why this fits the user"
    }
  ]
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
    });

    let result = completion.choices[0].message.content;

    result = result.replace(/```json/g, "").replace(/```/g, "").trim();

    let parsed;

try {
  // Extract only JSON part (in case AI adds text)
  const jsonMatch = result.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("No JSON found in response");
  }

  parsed = JSON.parse(jsonMatch[0]);

} catch (err) {
  console.error("❌ JSON PARSE ERROR:", result);

  return Response.json({
    opportunities: []
  });
}

    return Response.json(parsed);

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}