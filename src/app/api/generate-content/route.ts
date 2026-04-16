import Groq from "groq-sdk";

export async function POST(req: Request) {
try {
const body = await req.json();
        const { topic, platform, tone } = body;
if (!topic) {
  return Response.json({ error: "Missing topic" }, { status: 400 });
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const prompt =
"You are a professional content strategist.\n\n" +

"Platform: " + platform + "\n" +
"Tone: " + tone + "\n\n" +

"User Idea:\n" + topic + "\n\n" +

"STRICT INSTRUCTIONS:\n\n" +

// PLATFORM RULES
"PLATFORM RULES:\n" +
"- LinkedIn: Write in paragraphs, storytelling style, longer format\n" +
"Twitter: Separate each tweet with a new line. Each line must be a complete tweet.\n" +
"- Instagram: Write caption style, engaging, with emojis and hashtags\n\n" +

// TONE RULES
"TONE RULES:\n" +
"- Professional: clean, clear, no slang\n" +
"- Storytelling: emotional, narrative-driven\n" +
"- Provocative: bold, controversial, attention-grabbing\n" +
"- Analytical: logical, structured, insightful\n" +
"- Motivational: inspiring, energetic\n\n" +

// STRUCTURE
"STRUCTURE:\n" +
"- Strong hook in first line\n" +
"- Clear flow\n" +
"- Natural human writing\n" +
"- Add spacing between paragraphs\n\n" +

// OUTPUT RULES
"OUTPUT RULES:\n" +
"- Do NOT use markdown (** or *)\n" +
"- Do NOT explain anything\n" +
        "- Output ONLY the final content\n";
    
const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: prompt },
    { role: "user", content: topic },
  ],
});

const result = completion.choices[0].message.content;

        return Response.json({ result });
} catch (error) {
console.error(error);
return Response.json({ error: "Failed" }, { status: 500 });
}
}