'use client';


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, Sparkles, MessageSquare, Hash, Copy, CheckCircle2, 
  RefreshCw, Loader2
} from "lucide-react";

// --- CUSTOM BRAND ICONS (To avoid lucide-react missing exports) ---
const InstagramIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

// --- PLATFORMS & TONES ---
const PLATFORMS = [
  { id: "LinkedIn", icon: LinkedinIcon, color: "text-[#0A66C2]", bg: "bg-[#0A66C2]" },
  { id: "Twitter", icon: TwitterIcon, color: "text-[#1DA1F2]", bg: "bg-[#1DA1F2]" },
  { id: "Instagram", icon: InstagramIcon, color: "text-[#E1306C]", bg: "bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]" }
];

const TONES = ["Professional", "Storytelling", "Provocative", "Analytical", "Motivational"];

// --- MOCK PREVIEWS ---
const MockLinkedInPreview = () => (
  <div className="bg-surface border border-white/10 rounded-xl p-5 w-full max-w-lg mx-auto shadow-2xl">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent-blue p-0.5">
        <div className="w-full h-full bg-background rounded-full flex items-center justify-center border-2 border-background">
          <span className="text-xs font-bold text-white">EA</span>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-text-primary text-sm leading-tight">Eleojo Arawa</h4>
        <p className="text-xs text-text-secondary">Software Engineer | Building Career Accelerator</p>
        <p className="text-[10px] text-text-secondary/70 flex items-center gap-1">Just now • <GlobeIcon /></p>
      </div>
    </div>
    <div className="space-y-4 text-sm text-text-primary leading-relaxed font-sans">
      <p>I sent 50 applications last month and heard nothing back. So I stopped applying.</p>
      <p>Instead, I spent the last 2 weeks building a project that solves a specific problem for a company I admire. I sent it directly to their Engineering Manager on a Tuesday.</p>
      <p>By Thursday, I had an interview.</p>
      <p>Here is the reality check: Your resume is a lottery ticket. Your proof of work is an undeniable asset. Stop telling people what you can do. Start showing them.</p>
      <p>Have you ever landed a role by bypassing the standard application portal? 👇</p>
      <p className="text-[#0A66C2] font-medium pt-2">#CareerGrowth #SoftwareEngineering #ProofOfWork #TechCareers</p>
    </div>
    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between text-text-secondary">
      <div className="flex items-center gap-1.5 text-xs font-medium hover:bg-white/5 px-3 py-2 rounded-lg cursor-pointer transition-colors"><ThumbsUpIcon /> Like</div>
      <div className="flex items-center gap-1.5 text-xs font-medium hover:bg-white/5 px-3 py-2 rounded-lg cursor-pointer transition-colors"><MessageSquare className="w-4 h-4" /> Comment</div>
      <div className="flex items-center gap-1.5 text-xs font-medium hover:bg-white/5 px-3 py-2 rounded-lg cursor-pointer transition-colors"><Share2 className="w-4 h-4" /> Share</div>
    </div>
  </div>
);

const MockTwitterPreview = () => (
  <div className="space-y-4 w-full max-w-lg mx-auto">
    {[
      "The traditional job hunt is broken. Sending resumes into the void is a recipe for burnout.\n\nHere is how I bypassed the ATS and landed an interview at a top tech company in 48 hours. 🧵👇",
      "Step 1: Identify the bottleneck.\n\nI looked at the company's current product and found a small, annoying UI bug in their onboarding flow. Something they definitely knew about but hadn't prioritized.",
      "Step 2: Build the solution.\n\nI cloned their UI, fixed the bug, and recorded a 60-second Loom video explaining my code structure and why I made the architectural choices I did. No fluff, just value.",
      "Step 3: Direct delivery.\n\nI didn't email HR. I found the Engineering Manager on LinkedIn, guessed their email format, and sent the Loom link with a 3-sentence email.\n\nResult? Interview booked. Stop applying. Start proving."
    ].map((tweet, i) => (
      <div key={i} className="bg-surface border border-white/10 rounded-xl p-5 shadow-lg relative">
        {i !== 3 && <div className="absolute top-14 bottom-[-16px] left-9 w-0.5 bg-white/10 z-0" />}
        <div className="flex gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent-blue shrink-0 flex items-center justify-center border-2 border-background">
            <span className="text-[10px] font-bold text-white">EA</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <span className="font-bold text-text-primary text-sm">Eleojo Arawa</span>
              <span className="text-xs text-text-secondary">@eleojo_dev • 1m</span>
            </div>
            <p className="text-sm text-text-primary whitespace-pre-wrap">{tweet}</p>
            <div className="flex items-center gap-6 mt-3 text-text-secondary">
              <MessageSquare className="w-3.5 h-3.5 hover:text-[#1DA1F2] cursor-pointer" />
              <RefreshCw className="w-3.5 h-3.5 hover:text-success cursor-pointer" />
              <HeartIcon />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Mini icons for previews
const GlobeIcon = () => <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>;
const ThumbsUpIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>;
const HeartIcon = () => <svg className="w-3.5 h-3.5 hover:text-error cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>;

export default function ContentStrategistPage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [tone, setTone] = useState("Storytelling");
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const formattedLines = generatedText.split("\n").filter(line => line.trim() !== "");

  const handleGenerate = async () => {
if (!topic.trim()) return;

setIsGenerating(true);
setHasGenerated(false);

try {
const res = await fetch("/api/generate-content", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
topic,
platform,
tone,
}),
});
  const data = await res.json();

const clean = (data.result || "").replace(/\*\*/g, "");

setGeneratedText(clean);
  setHasGenerated(true);
  } catch (err) {
console.error("ERROR:", err);
}

setIsGenerating(false);
};

  const handleCopy = async () => {
if (!generatedText) return;

await navigator.clipboard.writeText(generatedText);

setCopied(true);
setTimeout(() => setCopied(false), 2000);
};

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      
      {/* ---------------- HEADER ---------------- */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/30">
              <Share2 className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Content Strategist</h1>
          </div>
          <p className="text-text-secondary">Transform your career milestones into high-converting personal brand assets.</p>
        </div>
      </motion.div>

      {/* ---------------- SPLIT PANE LAYOUT ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px] pb-12">
        
        {/* LEFT PANE: INPUT ENGINE */}
        <motion.div variants={itemVariants} className="lg:col-span-5 glass-card flex flex-col bg-background/40 backdrop-blur-md border-white/5 overflow-hidden h-[600px]">
          
          <div className="p-6 border-b border-white/5 bg-surface/30">
            <h2 className="font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F59E0B]" /> Growth Engine
            </h2>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Platform Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Target Platform</label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setPlatform(p.id); setHasGenerated(false); }}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                      platform === p.id 
                      ? `${p.bg} border-transparent text-white shadow-[0_0_20px_rgba(255,255,255,0.2)] font-bold scale-[1.02]` 
                      : 'bg-surface/50 border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <p.icon className={`w-5 h-5 ${platform === p.id ? 'text-white' : p.color}`} />
                    <span className="text-xs">{p.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Voice & Tone</label>
              <div className="flex flex-wrap gap-2">
                {TONES.map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      tone === t
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]'
                      : 'bg-surface/50 border-white/5 text-text-secondary hover:text-text-primary hover:border-white/20'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div className="space-y-3 flex-1 flex flex-col">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center justify-between">
                What do you want to talk about?
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., I finally launched my portfolio website after 3 months of struggling with CSS Grid..."
                className="w-full flex-1 min-h-[150px] bg-surface/50 border border-white/10 rounded-xl p-4 text-sm text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-[#F59E0B]/50 focus:ring-1 focus:ring-[#F59E0B]/50 transition-all resize-none shadow-inner"
              />
            </div>
            
          </div>
          
          <div className="p-6 border-t border-white/5 bg-surface/30">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F59E0B] to-[#EC4899] text-white py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Crafting Hook...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate Post
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* RIGHT PANE: PREVIEW */}
        <motion.div variants={itemVariants} className="lg:col-span-7 glass-card flex flex-col bg-background/40 backdrop-blur-md border-[#F59E0B]/20 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#F59E0B]/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Preview Header */}
          <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-surface/30 relative z-10">
            <div className="font-bold text-text-primary flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#F59E0B]" /> 
              Live Preview
            </div>
            
            <AnimatePresence>
              {hasGenerated && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-2">
                  <button onClick={handleGenerate} className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5" title="Regenerate">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/20 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-white border border-[#F59E0B]/30 rounded-lg text-xs font-bold transition-colors">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Text'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Preview Body */}
          <div className="flex-1 relative z-10 p-4 md:p-8 overflow-y-auto bg-surface/10 flex flex-col">
            <AnimatePresence mode="wait">
              
              {!isGenerating && !hasGenerated && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <MessageSquare className="w-8 h-8 text-text-secondary/50" />
                  </div>
                  <h3 className="text-lg font-bold text-text-secondary mb-2">Audience awaits</h3>
                  <p className="text-sm text-text-secondary/60 max-w-sm">
                    Enter your thoughts on the left. The AI will format it perfectly for {platform}'s algorithm, complete with hooks and formatting.
                  </p>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-12 h-12 text-[#F59E0B] animate-spin mb-4" />
                  <h3 className="text-lg font-bold text-text-primary mb-2">Optimizing for {platform}...</h3>
                  <p className="text-sm text-text-secondary max-w-sm animate-pulse">
                    Writing a strong hook, structuring the narrative, and generating relevant hashtags.
                  </p>
                </motion.div>
              )}

              {!isGenerating && hasGenerated && (
                <motion.div key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
{platform === "LinkedIn" && (

<div className="bg-surface border border-white/10 rounded-xl p-5 w-full max-w-lg mx-auto shadow-2xl"> <div className="space-y-4 text-sm text-text-primary leading-relaxed"> {formattedLines.map((line, i) => ( <p key={i}>{line}</p> ))} </div> </div> )}

{platform === "Twitter" && (

<div className="space-y-4 w-full max-w-lg mx-auto"> {formattedLines.map((tweet, i) => ( <div key={i} className="bg-surface border border-white/10 rounded-xl p-5 shadow-lg"> <p className="text-sm text-text-primary whitespace-pre-wrap"> {tweet} </p> </div> ))} </div> )}

{platform === "Instagram" && (

<div className="bg-surface border border-white/10 rounded-xl p-5 w-full max-w-lg mx-auto shadow-2xl"> <p className="text-sm text-text-primary whitespace-pre-line leading-relaxed"> {generatedText} </p> </div> )}                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}