'use client';
import html2pdf from "html2pdf.js";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, Sparkles, Briefcase, FileSignature, Presentation, 
  MessageSquare, ChevronDown, CheckCircle2, Copy, Download, RefreshCw, Loader2 
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

// --- MOCK AI OUTPUTS ---
const MOCK_OUTPUTS: Record<string, React.ReactNode> = {
  "Cover Letter": (
    <div className="space-y-4 text-sm text-text-primary leading-relaxed font-serif">
      <p>Dear Hiring Manager at Stripe,</p>
      <p>
        I am writing to express my strong interest in the Frontend Engineer position. 
        With over three years of experience building scalable, accessible, and performant web applications 
        using React and Next.js, I am drawn to Stripe's commitment to increasing the GDP of the internet.
      </p>
      <p>
        In my recent project redesigning the architecture for Chastar Marine, I successfully migrated their 
        legacy system to a modern stack, reducing load times by 40% and implementing a robust UI/UX 
        design system that improved user retention. My ability to blend technical execution with 
        strategic design aligns perfectly with your requirement for engineers who possess deep product sense.
      </p>
      <p>
        I would welcome the opportunity to discuss how my background in both computer science and 
        digital illustration can bring a unique, detail-oriented perspective to your engineering team.
      </p>
      <p>Sincerely,<br/>Eleojo Arawa</p>
    </div>
  ),
  "CV Bullet Points": (
    <ul className="space-y-3 text-sm text-text-primary list-disc pl-5 leading-relaxed">
      <li>Spearheaded the redesign and full-stack development of enterprise websites (Chastar Marine, LBM Solutions), utilizing React and Tailwind CSS to increase client conversion rates by 25%.</li>
      <li>Architected and deployed responsive, accessibility-compliant user interfaces, reducing cross-browser inconsistencies and improving lighthouse performance scores to 95+.</li>
      <li>Collaborated directly with stakeholders to translate business requirements into technical deliverables, managing the end-to-end lifecycle from Figma wireframes to production deployment.</li>
    </ul>
  ),
  "Interview Prep": (
    <div className="space-y-4 text-sm text-text-primary leading-relaxed">
      <h4 className="font-bold text-accent-blue mb-2">High-Probability Questions for Stripe:</h4>
      <div className="space-y-3">
        <div className="bg-surface/50 p-3 rounded-lg border border-white/5">
          <p className="font-bold text-text-secondary">1. How do you handle state management in a complex React application?</p>
          <p className="text-xs text-text-secondary/70 mt-1"><span className="text-primary font-medium">Strategy:</span> Mention your experience with Redux/Context API, but focus on Stripe's preference for localized state and performance optimization.</p>
        </div>
        <div className="bg-surface/50 p-3 rounded-lg border border-white/5">
          <p className="font-bold text-text-secondary">2. Walk me through a time you had to compromise on a technical decision to meet a business deadline.</p>
          <p className="text-xs text-text-secondary/70 mt-1"><span className="text-primary font-medium">Strategy:</span> Use the STAR method. Reference the Chastar Marine project timeline and how you prioritized core features.</p>
        </div>
      </div>
    </div>
  )
};

const DOC_TYPES = [
  { id: "Cover Letter", icon: FileSignature },
  { id: "CV Bullet Points", icon: Briefcase },
  { id: "Interview Prep", icon: MessageSquare },
  { id: "Project Proposal", icon: Presentation },
];

export default function CareerAssistantPage() {
  const [activeType, setActiveType] = useState("Cover Letter");
  const [jobDescription, setJobDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<React.ReactNode | null>(null);
  const outputRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
if (!jobDescription.trim()) return;

setIsGenerating(true);
setOutput(null);
setCopied(false);

try {
const res = await fetch("/api/generate-career", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
jobDescription,
type: activeType,
}),
}); 
  const data = await res.json(); 
  const cleanText = data.result.replace(/\*\*/g, "");

setOutput(
  <div className="text-sm text-text-primary whitespace-pre-line leading-relaxed">
    {cleanText}
  </div>
);
  } catch (error) {
console.error("ERROR:", error);
}

setIsGenerating(false);
};

  const handleExportPDF = () => {
if (!outputRef.current) return;

const element = outputRef.current;

const opt = {
margin: 0.5,
  filename: "career-document.pdf",
html2canvas: {
  scale: 2,
  useCORS: true,

  // 🔥 THIS IS THE FIX
  ignoreElements: (el: HTMLElement) => {
    return el.style?.color?.includes("okl") || false;
  },

  onclone: (doc: Document) => {
    // Force safe styles globally
    const style = doc.createElement("style");
    style.innerHTML = `
      * {
        color: #000 !important;
        background: #fff !important;
        border-color: #ddd !important;
      }
    `;
    doc.head.appendChild(style);
  }
},

jsPDF: {
  unit: "in",
  format: "a4",
  orientation: "portrait",
  },
};

import("html2pdf.js").then((html2pdf) => {
html2pdf.default().from(element).set(opt).save();
});
};
  
  const handleCopy = async () => {
if (!output) return;

try {
const text = typeof output === "string"
? output
    : output.props?.children || "";
  await navigator.clipboard.writeText(
  typeof text === "string" ? text : JSON.stringify(text)
);

setCopied(true);
  setTimeout(() => setCopied(false), 2000);
  } catch (err) {
console.error("Copy failed:", err);
}
};

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      
      {/* ---------------- HEADER ---------------- */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/30">
              <FileText className="w-5 h-5 text-secondary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Career Assistant AI</h1>
          </div>
          <p className="text-text-secondary">Generate highly-tailored documents based on your profile and the specific job description.</p>
        </div>
      </motion.div>

      {/* ---------------- SPLIT PANE LAYOUT ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[600px]">
        
        {/* LEFT PANE: INPUT */}
        <motion.div variants={itemVariants} className="lg:col-span-5 glass-card flex flex-col bg-background/40 backdrop-blur-md border-white/5 overflow-hidden h-[600px]">
          <div className="p-6 border-b border-white/5 bg-surface/30">
            <h2 className="font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Document Parameters
            </h2>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Document Type Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Output Type</label>
              <div className="grid grid-cols-2 gap-3">
                {DOC_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveType(type.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                      activeType === type.id 
                      ? 'bg-secondary/10 border-secondary text-secondary shadow-[0_0_15px_rgba(0,240,181,0.15)] font-bold' 
                      : 'bg-surface/50 border-white/5 text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                  >
                    <type.icon className="w-4 h-4" />
                    {type.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="space-y-3 flex-1 flex flex-col">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center justify-between">
                Target Role Details
                <span className="text-[10px] text-text-secondary/50 normal-case">Paste Job Description below</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="e.g. We are looking for a Senior Frontend Engineer who is an expert in React, Next.js, and Tailwind CSS to join our core product team..."
                className="w-full flex-1 min-h-[250px] bg-surface/50 border border-white/10 rounded-xl p-4 text-sm text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 transition-all resize-none shadow-inner"
              />
            </div>
            
          </div>
          
          <div className="p-6 border-t border-white/5 bg-surface/30">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !jobDescription.trim()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-secondary to-accent-blue text-background py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,240,181,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Generate {activeType}
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* RIGHT PANE: OUTPUT */}
        <motion.div variants={itemVariants} className="lg:col-span-7 glass-card flex flex-col bg-background/40 backdrop-blur-md border-secondary/20 relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Output Header */}
          <div className="h-16 px-6 border-b border-white/5 flex items-center justify-between bg-surface/30 relative z-10">
            <div className="font-bold text-text-primary flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-secondary" /> 
              Generated Output
            </div>
            
            {/* Action Buttons (Only show if output exists) */}
            <AnimatePresence>
              {output && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-2">
                  <button onClick={handleGenerate} className="p-2 text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-white/5" title="Regenerate">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-white/10 mx-1" />
                  <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-text-primary transition-colors">
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                  <button
  onClick={handleExportPDF}
  className="flex items-center gap-2 px-3 py-1.5 bg-secondary/20 hover:bg-secondary text-secondary hover:text-background border border-secondary/30 rounded-lg text-xs font-bold transition-colors"
>
  <Download className="w-3.5 h-3.5" />
  Export PDF
</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Output Body */}
          <div className="flex-1 relative z-10 p-8 overflow-y-auto bg-surface/10">
            <AnimatePresence mode="wait">
              
              {/* Empty State */}
              {!isGenerating && !output && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <FileText className="w-8 h-8 text-text-secondary/50" />
                  </div>
                  <h3 className="text-lg font-bold text-text-secondary mb-2">Blank Canvas</h3>
                  <p className="text-sm text-text-secondary/60 max-w-sm">
                    Select your document type, paste the job description, and let the AI tailor your experience perfectly to the role.
                  </p>
                </motion.div>
              )}

              {/* Loading Skeleton */}
              {isGenerating && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                    <div className="w-12 h-12 rounded-full bg-secondary/20 animate-pulse" />
                    <div>
                      <div className="w-48 h-4 bg-white/10 rounded mb-2 animate-pulse" />
                      <div className="w-32 h-3 bg-white/5 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="w-full h-3 bg-white/10 rounded animate-pulse" />
                    <div className="w-full h-3 bg-white/10 rounded animate-pulse" />
                    <div className="w-5/6 h-3 bg-white/10 rounded animate-pulse" />
                  </div>
                  <div className="space-y-3 pt-4">
                    <div className="w-full h-3 bg-white/10 rounded animate-pulse" />
                    <div className="w-4/5 h-3 bg-white/10 rounded animate-pulse" />
                  </div>
                </motion.div>
              )}

              {/* Generated Content */}
              {!isGenerating && output && (
                <motion.div key="output" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full">
                  {/* Mock content renders here */}
                  <div
  ref={outputRef}
  className="bg-white/5 p-8 rounded-xl border border-white/10 shadow-lg min-h-full"
>
  {output}
</div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}