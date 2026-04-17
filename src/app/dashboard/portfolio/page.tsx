'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Globe, Sparkles, Layout, Palette, Code, Download, 
  Loader2, Monitor, Smartphone, ExternalLink, RefreshCw
} from "lucide-react";

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

// --- DYNAMIC THEME OPTIONS ---
const THEMES = [
  { id: "Neon Pink", hex: "#EC4899", gradient: "linear-gradient(to right, #EC4899, #8B5CF6)" },
  { id: "Electric Blue", hex: "#2563EB", gradient: "linear-gradient(to right, #2563EB, #22D3EE)" },
  { id: "Emerald", hex: "#00F0B5", gradient: "linear-gradient(to right, #00F0B5, #059669)" },
  { id: "Deep Purple", hex: "#9D4EDD", gradient: "linear-gradient(to right, #9D4EDD, #4F46E5)" },
  { id: "Sunset", hex: "#F59E0B", gradient: "linear-gradient(to right, #F59E0B, #EF4444)" },
];

export default function PortfolioBuilderPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [customColor, setCustomColor] = useState("#FFD700"); // Default custom color
  const [generatedCode, setGeneratedCode] = useState("");
  
  // Form State
  const [formData, setFormData] = useState({
    name: "Enter your name",
    role: "Enter your role",
    bio: "Enter your bio",
    theme: THEMES[0] // Default to Neon Pink
  });

  const handleGenerate = async () => {
setIsGenerating(true);
setHasGenerated(false);

try {
const res = await fetch("/api/generate-portfolio", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
name: formData.name,
role: formData.role,
bio: formData.bio,
theme: formData.theme,
}),
});
  const data = await res.json();

setGeneratedCode(data.result);
  setHasGenerated(true);
  } catch (err) {
console.error("ERROR:", err);
}

setIsGenerating(false);
  };
  
  const handleExportCode = () => {
if (!generatedCode) return;

const blob = new Blob([generatedCode], { type: "text/html" });
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "portfolio.html";
a.click();

URL.revokeObjectURL(url);
};

  // --- MOCK GENERATED PORTFOLIO COMPONENT ---
  const MockPortfolio = () => (
    <div className={`w-full h-full bg-[#050505] text-white font-sans overflow-y-auto overflow-x-hidden ${viewMode === 'mobile' ? 'max-w-[375px] mx-auto border-x border-white/10' : ''}`}>
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 md:p-8">
        <div className="font-bold text-xl tracking-tighter">EA.</div>
        <div className="flex gap-6 text-sm font-medium text-gray-400">
          <span className="hover:text-white cursor-pointer transition-colors">Work</span>
          <span className="hover:text-white cursor-pointer transition-colors">About</span>
          <span className="hover:text-white cursor-pointer transition-colors">Contact</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="px-6 md:px-12 pt-12 md:pt-24 pb-20 flex flex-col items-start relative">
        <div 
          className="absolute top-0 right-0 w-64 h-64 opacity-20 blur-[80px] rounded-full pointer-events-none" 
          style={{ background: formData.theme.gradient }}
        />
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4 relative z-10">
          Hi, I'm {formData.name}. <br/>
          <span style={{ backgroundImage: formData.theme.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {formData.role}.
          </span>
        </h1>
        <p className="text-gray-400 max-w-lg leading-relaxed mb-8 relative z-10">
          {formData.bio}
        </p>
        <button 
          className="text-white px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition-transform relative z-10"
          style={{ background: formData.theme.gradient }}
        >
          View My Projects
        </button>
      </header>

      {/* Selected Work */}
      <section className="px-6 md:px-12 py-12 border-t border-white/5 bg-[#0A0A0A]">
        <h2 className="text-2xl font-bold mb-8">Selected Work</h2>
        <div className={`grid gap-6 ${viewMode === 'desktop' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {/* Project 1 */}
          <div className="group cursor-pointer">
            <div className="w-full h-48 bg-white/5 rounded-xl mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div 
                className="absolute bottom-0 left-4 right-4 h-32 opacity-20 rounded-t-xl translate-y-10 group-hover:translate-y-4 transition-transform duration-500"
                style={{ background: formData.theme.gradient }}
              />
            </div>
            <h3 className="font-bold text-lg">Chastar Marine</h3>
            <p className="text-sm text-gray-500">Corporate Website Redesign</p>
          </div>
          {/* Project 2 */}
          <div className="group cursor-pointer">
            <div className="w-full h-48 bg-white/5 rounded-xl mb-4 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
              <div 
                className="absolute bottom-0 left-4 right-4 h-32 opacity-20 rounded-t-xl translate-y-10 group-hover:translate-y-4 transition-transform duration-500"
                style={{ background: formData.theme.gradient }}
              />
            </div>
            <h3 className="font-bold text-lg">LBM Solutions</h3>
            <p className="text-sm text-gray-500">Web App Architecture</p>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      
      {/* ---------------- HEADER ---------------- */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-[#EC4899]/20 border border-[#EC4899]/30">
              <Globe className="w-5 h-5 text-[#EC4899]" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Portfolio Builder</h1>
          </div>
          <p className="text-text-secondary">Instantly generate and deploy a stunning, responsive portfolio website.</p>
        </div>
      </motion.div>

      {/* ---------------- SPLIT PANE LAYOUT ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-[650px] pb-12">
        
        {/* LEFT PANE: CONFIGURATION ENGINE */}
        <motion.div variants={itemVariants} className="lg:col-span-4 glass-card flex flex-col bg-background/40 backdrop-blur-md border-white/5 overflow-hidden">
          
          <div className="p-6 border-b border-white/5 bg-surface/30">
            <h2 className="font-bold text-text-primary flex items-center gap-2">
              <Layout className="w-4 h-4 text-[#EC4899]" /> Configuration
            </h2>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Theme Selection */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-2">
                <Palette className="w-3.5 h-3.5" /> Brand Theme
              </label>
              <div className="grid grid-cols-2 gap-3">
                
                {/* Predefined Themes */}
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setFormData({ ...formData, theme })}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      formData.theme.id === theme.id 
                      ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                      : 'bg-surface/50 border-white/5 text-text-secondary hover:bg-white/5'
                    }`}
                    style={{ 
                      borderColor: formData.theme.id === theme.id ? theme.hex : '',
                      color: formData.theme.id === theme.id ? theme.hex : ''
                    }}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ background: theme.gradient }} />
                    <span className="text-xs font-medium">{theme.id}</span>
                  </button>
                ))}

                {/* Custom Color Picker */}
                <div className="relative group">
                  <input 
                    type="color" 
                    value={customColor}
                    onChange={(e) => {
                      const hex = e.target.value;
                      setCustomColor(hex);
                      setFormData({ 
                        ...formData, 
                        theme: { 
                          id: "Custom", 
                          hex: hex, 
                          gradient: `linear-gradient(to right, ${hex}, ${hex}80)` 
                        } 
                      });
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Choose custom color"
                  />
                  <button
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      formData.theme.id === "Custom" 
                      ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                      : 'bg-surface/50 border-white/5 text-text-secondary group-hover:bg-white/5'
                    }`}
                    style={{ 
                      borderColor: formData.theme.id === "Custom" ? customColor : '',
                      color: formData.theme.id === "Custom" ? customColor : ''
                    }}
                  >
                    <div 
                      className="w-4 h-4 rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,0.5)] border border-white/20" 
                      style={{ background: customColor }} 
                    />
                    <span className="text-xs font-medium">Custom</span>
                  </button>
                </div>

              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5" />

            {/* Content Inputs */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Hero Content</label>
              
              <div className="space-y-1.5">
                <span className="text-xs text-text-secondary ml-1">Display Name</span>
                <input 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-text-secondary ml-1">Primary Role</span>
                <input 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-text-secondary ml-1">Short Bio</span>
                <textarea 
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:border-white/30 focus:ring-1 focus:ring-white/30 outline-none transition-all resize-none h-24"
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-white/5" />

            {/* Data Source Info */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Code className="w-4 h-4 text-text-primary" />
                <span className="text-sm font-bold text-text-primary">Projects Auto-Synced</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Fill in your details and what you would like to show on your portfolio, the above entries are just placeholders
              </p>
            </div>
            
          </div>
          
          <div className="p-6 border-t border-white/5 bg-surface/30">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 text-white py-3.5 rounded-xl font-bold transition-all duration-300 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: formData.theme.gradient,
                boxShadow: `0 0 25px ${formData.theme.hex}40`
              }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Compiling Assets...
                </>
              ) : hasGenerated ? (
                <>
                  <RefreshCw className="w-5 h-5" /> Rebuild Portfolio
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" /> Build Portfolio
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* RIGHT PANE: LIVE BROWSER PREVIEW */}
        <motion.div variants={itemVariants} className="lg:col-span-8 glass-card flex flex-col bg-[#050505] border-white/10 relative overflow-hidden">
          
          {/* Main Background glow bound to the current theme */}
          <div 
            className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full blur-[100px] pointer-events-none transition-all duration-500" 
            style={{ background: formData.theme.gradient }}
          />

          {/* Browser Header / Controls */}
          <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#111] relative z-20">
            
            {/* macOS window dots */}
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error/80" />
              <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>

            {/* View Toggles */}
            <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/5">
              <button 
                onClick={() => setViewMode("desktop")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'desktop' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode("mobile")}
                className={`p-1.5 rounded-md transition-colors ${viewMode === 'mobile' ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            {/* URL Bar Mock */}
            <div className="hidden md:flex items-center justify-center bg-black/50 border border-white/5 rounded-md px-32 py-1 text-[10px] text-text-secondary font-mono">
              eleojoarawa.dev
            </div>

            {/* Export Actions */}
            <AnimatePresence>
              {hasGenerated && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="flex items-center gap-2">
                  <button onClick={handleExportCode}
                    className="flex items-center gap-2 px-3 py-1.5 hover:opacity-80 border rounded-lg text-xs font-bold transition-all"
                    style={{ borderColor: `${formData.theme.hex}50`, color: formData.theme.hex, backgroundColor: `${formData.theme.hex}10` }}
                  >
                    <Download className="w-3.5 h-3.5" /> Export Code
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            {!hasGenerated && <div className="w-24" /> /* Spacer */}
          </div>

          {/* Browser Viewport */}
          <div className="flex-1 relative z-10 bg-black flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              
              {!isGenerating && !hasGenerated && (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                    <Globe className="w-8 h-8 text-text-secondary/50" />
                  </div>
                  <h3 className="text-lg font-bold text-text-secondary mb-2">Ready to Build</h3>
                  <p className="text-sm text-text-secondary/60 max-w-sm">
                    Configure your brand details on the left, and the AI will generate the raw HTML/CSS/JS for your portfolio.
                  </p>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col items-center justify-center text-center bg-[#0A0A0A]">
                  <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: formData.theme.hex }} />
                  <h3 className="text-lg font-bold text-text-primary mb-2">Compiling Portfolio...</h3>
                  <div className="text-sm text-text-secondary/60 font-mono text-left bg-black p-4 rounded-lg border border-white/5 mt-4 w-64 space-y-1">
                    <p className="animate-pulse">&gt; Generating structure...</p>
                    <p className="animate-pulse" style={{ animationDelay: "0.5s" }}>&gt; Applying custom theme...</p>
                    <p className="animate-pulse" style={{ animationDelay: "1s" }}>&gt; Optimizing assets...</p>
                  </div>
                </motion.div>
              )}

              {!isGenerating && hasGenerated && (
                <motion.div key="output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
                  console.log("GENERATED HTML:", generatedCode);
                  <iframe srcDoc={generatedCode} className="w-full h-full border-none" />
                  
                  {/* Floating Deploy Button inside preview */}
                  <div className="absolute bottom-6 right-6">
                     <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full text-sm font-bold shadow-2xl hover:scale-105 transition-transform">
                       <ExternalLink className="w-4 h-4" /> Deploy to Vercel
                     </button>
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