import Groq from "groq-sdk";

export async function POST(req: Request) {
try {
const body = await req.json();
        const { jobDescription, type } = body;

if (!jobDescription) {
  return Response.json({ error: "Missing input" }, { status: 400 });
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

let instruction = "";

if (type === "Cover Letter") {
  instruction = "Write a professional, personalized cover letter.";
} else if (type === "CV Bullet Points") {
  instruction = "Generate strong CV bullet points based on this role.";
} else if (type === "Interview Prep") {
  instruction = "Generate likely interview questions and smart answer strategies.";
} else if (type === "Project Proposal") {
  instruction = "Write a professional project proposal.";
}

const prompt =
  "You are a professional career assistant.\n\n" +
  instruction + "\n\n" +
  "Job Description:\n" + jobDescription + "\n\n" +
  "Make it tailored, practical, and high-quality.\n" +
  "Do not include explanations.\n" +
  "Write like a real human.";

const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: prompt },
    { role: "user", content: jobDescription },
  ],
});

const result = completion.choices[0].message.content;

        return Response.json({ result });

    } catch (error) {
console.error(error);
return Response.json({ error: "Failed" }, { status: 500 });
}
}