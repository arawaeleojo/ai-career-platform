import Groq from "groq-sdk";

export async function POST(req: Request) {
try {
const body = await req.json();
        const { name, role, bio, theme } = body;
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const prompt = `
You are a world-class copywriter and frontend UX expert.

Your job is to FILL a premium, high-converting portfolio website template with compelling content.

USER DATA:
Name: ${name}
Role: ${role}
Bio: ${bio}

INSTRUCTIONS:

Replace ALL placeholders with high-quality, professional content
Keep structure EXACTLY the same
Do NOT remove styles or layout
Do NOT explain anything
Return ONLY HTML

TEMPLATE:

<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>${name}</title> <script src="https://cdn.tailwindcss.com"></script> <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&display=swap" rel="stylesheet"> <style> body { font-family: 'Space Grotesk', sans-serif; background:#030303; color:#f3f4f6; overflow-x:hidden; } /* 🔥 HERO GLOW BACKGROUND */ .hero-bg { position:absolute; width:600px; height:600px; background: radial-gradient(circle, ${theme.hex}20 0%, transparent 70%); top:-200px; left:50%; transform:translateX(-50%); filter: blur(80px); z-index:-1; } .bento-card { background:#111; border-radius:20px; padding:20px; transition:0.3s; } .bento-card:hover { transform:translateY(-6px); box-shadow:0 20px 40px ${theme.hex}30; } .gradient-text { background: linear-gradient(135deg, #fff, ${theme.hex}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; } </style> </head> <body> <!-- HERO --> <section class="min-h-screen flex items-center justify-center px-6 pt-32 text-center relative"> <div class="hero-bg"></div> <div class="max-w-3xl mx-auto">

<h1 class="text-5xl md:text-7xl font-bold mb-6 leading-tight">
  Crafting <span class="gradient-text">digital experiences</span><br/>
  that stand out
</h1>

<h2 class="text-xl mb-4" style="color:${theme.hex}">
  ${name} — ${role}
</h2>

<p class="text-gray-400 mb-8 text-lg">
  ${bio}
</p>

<div class="flex justify-center gap-4">
  <a href="#work" class="px-6 py-3 rounded-full font-bold" style="background:${theme.hex}; color:white;">
    View Work
  </a>
  <a href="#contact" class="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10">
    Contact
  </a>
</div>
</div> </section> <!-- ABOUT --> <section id="about" class="py-24 px-6"> <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
<div>
  <img src="https://picsum.photos/500/500" class="rounded-2xl">
</div>

<div>
  <h2 class="text-4xl font-bold mb-6">About Me</h2>
  <p class="text-gray-400">ABOUT_PARAGRAPH_1</p>
</div>
</div> </section> <!-- SERVICES --> <section class="py-24 px-6"> <h2 class="text-4xl font-bold mb-12">Services</h2> <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
<div class="bento-card">
  <h3>SERVICE_1</h3>
  <p>DESC_1</p>
</div>

<div class="bento-card">
  <h3>SERVICE_2</h3>
  <p>DESC_2</p>
</div>

<div class="bento-card">
  <h3>SERVICE_3</h3>
  <p>DESC_3</p>
</div>
</div> </section> <!-- PROJECTS --> <section id="work" class="py-24 px-6"> <h2 class="text-4xl font-bold mb-12">Projects</h2><div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
<div>
  <img src="https://picsum.photos/600/400?1">
  <h3 class="text-xl mt-4">PROJECT_1</h3>
  <p>PROJECT_DESC_1</p>
</div>

<div>
  <img src="https://picsum.photos/600/400?2">
  <h3 class="text-xl mt-4">PROJECT_2</h3>
  <p>PROJECT_DESC_2</p>
</div>

<div>
  <img src="https://picsum.photos/600/400?3">
  <h3 class="text-xl mt-4">PROJECT_3</h3>
  <p>PROJECT_DESC_3</p>
</div>

<div>
  <img src="https://picsum.photos/600/400?4">
  <h3 class="text-xl mt-4">PROJECT_4</h3>
  <p>PROJECT_DESC_4</p>
</div>
</div> </section> <!-- TESTIMONIALS --> <section class="py-24 px-6 text-center"> <h2 class="text-4xl font-bold mb-12">Testimonials</h2> <div class="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
<div class="bento-card">
  <p>"TESTIMONIAL_1"</p>
</div>

<div class="bento-card">
  <p>"TESTIMONIAL_2"</p>
</div>

<div class="bento-card">
  <p>"TESTIMONIAL_3"</p>
</div>
</div> </section> <!-- CONTACT --> <section class="py-24 px-6 text-center"> <h2 class="text-4xl mb-6">Let's work together</h2> <p class="text-gray-400 mb-6">CONTACT_TEXT</p> <a href="#" class="px-6 py-3 rounded-full" style="background:${theme.hex}; color:white;"> Contact Me </a> </section> <footer class="text-center py-10 text-gray-500"> © 2026 ${name} </footer> </body> </html> `

const completion = await groq.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    { role: "system", content: prompt },
    { role: "user", content: name },
  ],
});

const result = completion.choices[0].message.content;

        return Response.json({ result });
} catch (error) {
console.error(error);
return Response.json({ error: "Failed" }, { status: 500 });
}
}