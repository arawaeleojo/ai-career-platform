'use client';

import { Variants } from "framer-motion";
import Link from "next/link";
import { motion } from "framer-motion";
import { Target, Calendar, FileText, Share2, Globe, ArrowRight, Sparkles, CheckCircle2, Zap } from "lucide-react";

// --- ANIMATION VARIANTS ---

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as any
    }
  }
};


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const mockupPop = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15, delay: 0.2 } }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent relative overflow-hidden selection:bg-primary/30 pb-12 text-text-primary">

      {/* ---------------- LOCAL HERO GLOW (To anchor the text) ---------------- */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 rounded-full blur-[150px] pointer-events-none z-0 screen-blend" />

      {/* ---------------- NAVIGATION ---------------- */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-background/60 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="font-bold text-lg sm:text-xl tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded bg-gradient-to-br from-primary to-accent-blue shadow-[0_0_15px_rgba(157,78,221,0.5)]" />
            <span className="hidden sm:inline">Career Accelerator</span>
            <span className="sm:hidden">Accelerator</span>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex items-center gap-4 sm:gap-6">
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              Log in
            </Link>
            <Link href="/signup" className="text-sm font-semibold bg-text-primary text-background px-4 py-2 rounded-full hover:scale-105 transition-transform duration-200">
              Sign up
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ---------------- HERO SECTION ---------------- */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-20 pt-40 sm:pt-48 pb-24 sm:pb-32 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center text-center"
      >
        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-text-primary text-xs sm:text-sm font-medium mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
          </span>
          The new standard for career growth
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] sm:leading-[1.05] mb-6 sm:mb-8 drop-shadow-2xl px-2">
          Accelerate your <br />
          <span className="text-gradient">Professional Trajectory.</span>
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 drop-shadow-md px-4">
          The AI-powered workspace built to help ambitious professionals set goals, execute daily actions, and generate career-defining opportunities.
        </motion.p>

        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4">
          <Link href="/signup" className="w-full sm:w-auto bg-text-primary text-background px-8 py-4 rounded-full font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
            Start your journey
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.section>

      {/* ---------------- FULL-WIDTH FEATURES SECTION (All 5 Features) ---------------- */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-24 sm:space-y-32">

        {/* Feature 1: Goal Strategist */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} className="flex flex-col lg:flex-row items-center gap-10 sm:gap-16">
          <motion.div variants={fadeInUp} className="flex-1 space-y-4 sm:space-y-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <Target className="text-primary w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md">AI Goal Strategist</h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              Stop setting vague yearly resolutions. Input your high-level ambitions, and our AI instantly reverse-engineers them into actionable monthly milestones and highly specific daily tasks.
            </p>
          </motion.div>
          <motion.div variants={mockupPop} className="flex-1 w-full glass-card p-4 sm:p-6 border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px]" />
            <div className="space-y-4 relative z-10">
              <motion.div initial={{ opacity: 0, scale: 0.8, x: 20 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.5 }} className="bg-background/80 border border-white/5 rounded-2xl rounded-tr-sm p-3 sm:p-4 w-5/6 sm:w-4/5 ml-auto text-xs sm:text-sm text-text-secondary">
                "I want to land a Frontend Developer role in 6 months."
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.8, x: -20 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.8 }} className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tl-sm p-4 sm:p-5 w-[95%] sm:w-[90%] text-xs sm:text-sm space-y-3 shadow-[0_0_15px_rgba(157,78,221,0.1)]">
                <div className="flex items-center gap-2 font-bold text-primary mb-2">
                  <Sparkles className="w-4 h-4" /> Goal Broken Down
                </div>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-3">
                  <motion.div variants={fadeInUp} className="bg-background/50 p-3 rounded-lg border border-white/5 flex items-start gap-3 group-hover:border-primary/30 transition-colors">
                    <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                    <div>
                      <span className="text-text-primary font-medium block">Month 1: Foundation</span>
                      <span className="text-text-secondary text-[10px] sm:text-xs">Master React Hooks & Tailwind CSS</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature 2: Opportunity Tracker */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} className="flex flex-col lg:flex-row-reverse items-center gap-10 sm:gap-16">
          <motion.div variants={fadeInUp} className="flex-1 space-y-4 sm:space-y-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
              <Calendar className="text-accent-blue w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md">Opportunity Tracker</h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              A visually stunning Kanban board for your applications. Build extreme resilience with our Rejection Reward System that tracks your streaks and curates new paths when one door closes.
            </p>
          </motion.div>
          <motion.div variants={mockupPop} className="flex-1 w-full glass-card p-4 sm:p-6 border-accent-blue/20 bg-surface/50 overflow-x-auto">
            <div className="flex gap-4 h-56 sm:h-64 min-w-[450px] lg:min-w-0">
              <div className="flex-1 bg-background/50 rounded-xl p-3 border border-white/5 space-y-2">
                <div className="text-[10px] sm:text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">Applied</div>
                <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-surface border border-white/10 p-3 rounded-lg mb-2 shadow-sm">
                  <div className="w-1/2 h-2 bg-accent-blue/50 rounded mb-2" />
                  <div className="w-3/4 h-2 bg-white/10 rounded" />
                </motion.div>
              </div>
              <div className="flex-1 bg-background/50 rounded-xl p-3 border border-white/5">
                <div className="text-[10px] sm:text-xs font-bold text-text-secondary mb-3 uppercase tracking-wider">Interview</div>
                <motion.div initial={{ opacity: 0, y: -10, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 1 }} className="bg-primary/20 border border-primary/30 p-3 rounded-lg mb-2 transform shadow-[0_4px_15px_rgba(157,78,221,0.2)]">
                  <div className="w-1/2 h-2 bg-primary rounded mb-2" />
                  <div className="w-full h-2 bg-white/30 rounded" />
                </motion.div>
              </div>
              <div className="flex-1 bg-background/50 rounded-xl p-3 border border-white/5 relative overflow-hidden space-y-2">
                <div className="text-[10px] sm:text-xs font-bold text-error mb-3 uppercase tracking-wider flex items-center justify-between">
                  Rejected
                  <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }} className="bg-error/20 text-error px-1.5 py-0.5 rounded text-[10px]">🔥3</motion.span>
                </div>
                <div className="bg-surface border border-error/20 p-3 rounded-lg opacity-60">
                  <div className="w-2/3 h-2 bg-error/50 rounded mb-2" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature 3: Career Assistant AI */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} className="flex flex-col lg:flex-row items-center gap-10 sm:gap-16">
          <motion.div variants={fadeInUp} className="flex-1 space-y-4 sm:space-y-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-secondary/20 flex items-center justify-center border border-secondary/30">
              <FileText className="text-secondary w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md">Career Assistant AI</h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              Stop staring at a blank page. Instantly generate beautifully structured, highly-tailored CVs, cover letters, and project proposals based on specific job descriptions and your history.
            </p>
          </motion.div>
          <motion.div variants={mockupPop} className="flex-1 w-full glass-card p-4 sm:p-6 border-secondary/20 relative">
            <div className="flex flex-col sm:flex-row gap-4 h-full">
              <div className="w-full sm:w-1/3 space-y-3">
                <div className="h-8 bg-background border border-white/10 rounded-lg flex items-center px-3 text-xs text-text-secondary">Frontend Dev...</div>
                <div className="h-20 bg-background border border-white/10 rounded-lg p-3 text-xs text-text-secondary/50">Paste Job Description...</div>
                <motion.button whileHover={{ scale: 1.03 }} className="w-full h-8 bg-secondary text-background rounded-lg text-xs font-bold shadow-[0_0_15px_rgba(0,240,181,0.3)]">Generate CV</motion.button>
              </div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="w-full sm:w-2/3 bg-white/5 border border-white/10 rounded-lg p-4 sm:p-5 space-y-4">
                <motion.div variants={fadeInUp} className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary/30" />
                  <div>
                    <div className="w-20 sm:w-24 h-2 sm:h-3 bg-white/30 rounded mb-1.5" />
                    <div className="w-12 sm:w-16 h-2 bg-white/10 rounded" />
                  </div>
                </motion.div>
                <motion.div variants={staggerContainer} className="space-y-2 pt-2">
                  <motion.div variants={fadeInUp} className="w-full h-2 bg-white/10 rounded" />
                  <motion.div variants={fadeInUp} className="w-full h-2 bg-white/10 rounded" />
                  <motion.div variants={fadeInUp} className="w-4/5 h-2 bg-white/10 rounded" />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature 4: Content Strategist */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} className="flex flex-col lg:flex-row-reverse items-center gap-10 sm:gap-16">
          <motion.div variants={fadeInUp} className="flex-1 space-y-4 sm:space-y-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#F59E0B]/20 flex items-center justify-center border border-[#F59E0B]/30">
              <Share2 className="text-[#F59E0B] w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md">Content Strategist</h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              Build your personal brand seamlessly. Generate hooks, body content, and strategic CTAs tailored for LinkedIn, Twitter, or Instagram to keep you consistently visible.
            </p>
          </motion.div>
          <motion.div variants={mockupPop} className="flex-1 w-full glass-card p-4 sm:p-6 border-[#F59E0B]/20 relative">
            <div className="bg-background border border-white/5 rounded-xl p-4 sm:p-5 space-y-4 shadow-lg shadow-[#F59E0B]/5 relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#F59E0B]" />
                  <span className="text-xs sm:text-sm font-bold text-text-primary">LinkedIn Post</span>
                </div>
                <div className="text-[9px] sm:text-[10px] font-bold bg-[#F59E0B]/20 text-[#F59E0B] px-2 py-1 rounded">Generated</div>
              </div>
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed pt-2">
                <motion.p variants={fadeInUp}><span className="text-text-primary font-medium">Hook:</span> How I landed 3 freelance web development clients without a formal portfolio. 🧵👇</motion.p>
                <div className="space-y-2 py-2">
                  <motion.div variants={fadeInUp} className="h-1.5 sm:h-2 w-3/4 bg-white/10 rounded" />
                  <motion.div variants={fadeInUp} className="h-1.5 sm:h-2 w-full bg-white/10 rounded" />
                  <motion.div variants={fadeInUp} className="h-1.5 sm:h-2 w-5/6 bg-white/10 rounded" />
                </div>
                <motion.p variants={fadeInUp} className="text-accent-blue text-[10px] sm:text-xs mt-3 font-medium">#WebDevelopment #Growth</motion.p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature 5: Portfolio Builder */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer} className="flex flex-col lg:flex-row items-center gap-10 sm:gap-16">
          <motion.div variants={fadeInUp} className="flex-1 space-y-4 sm:space-y-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EC4899]/20 flex items-center justify-center border border-[#EC4899]/30">
              <Globe className="text-[#EC4899] w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md">One-Click Portfolio Builder</h2>
            <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
              Stop worrying about deploying code. Input your details, upload your screenshots, and let the AI generate a stunning HTML/CSS portfolio website. Features instant download.
            </p>
          </motion.div>
          <motion.div variants={mockupPop} className="flex-1 w-full">
            <div className="bg-surface border border-white/10 rounded-xl overflow-hidden shadow-2xl shadow-[#EC4899]/10 group hover:border-[#EC4899]/40 transition-colors">
              <div className="bg-background/80 px-3 sm:px-4 py-2 sm:py-3 flex items-center gap-2 border-b border-white/10">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-error" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#F59E0B]" />
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-success" />
                <div className="ml-2 sm:ml-4 bg-white/5 rounded-md text-[9px] sm:text-[10px] text-text-secondary px-8 sm:px-24 py-1">my-portfolio.dev</div>
              </div>
              <div className="p-4 sm:p-6 flex gap-3 sm:gap-4 h-48 sm:h-56 bg-gradient-to-br from-background to-[#EC4899]/5">
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.7 }} className="w-1/3 flex flex-col justify-center space-y-2 sm:space-y-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#EC4899]/40" />
                  <div className="w-full h-3 sm:h-4 bg-white/20 rounded" />
                  <div className="w-2/3 h-1.5 sm:h-2 bg-white/10 rounded" />
                  <div className="w-16 sm:w-24 h-4 sm:h-6 bg-[#EC4899]/80 rounded-full mt-2" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }} className="w-2/3 bg-background border border-white/5 rounded-lg p-2 flex flex-wrap gap-2">
                  <div className="w-full h-16 sm:h-20 bg-white/5 rounded" />
                  <div className="w-[48%] h-12 sm:h-16 bg-white/5 rounded" />
                  <div className="w-[48%] h-12 sm:h-16 bg-white/5 rounded" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </section>

      {/* ---------------- ELEVATED BOTTOM CTA ---------------- */}
      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={staggerContainer} className="relative z-10 py-16 sm:py-32 px-4 sm:px-6 max-w-5xl mx-auto text-center mt-10">

        {/* Massive Ambient Glow behind the CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[400px] bg-primary/20 blur-[100px] pointer-events-none rounded-full screen-blend z-0" />

        <motion.div variants={mockupPop} className="glass-card p-8 sm:p-16 relative overflow-hidden border border-primary/40 shadow-[0_0_80px_rgba(157,78,221,0.2)] bg-background/80 backdrop-blur-2xl z-10">

          {/* Inner Grid Pattern for Tech Vibe */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

          <div className="relative z-20 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 mb-6 shadow-[0_0_30px_rgba(157,78,221,0.5)]">
              <Zap className="w-8 h-8 text-primary fill-primary/50" />
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6">
              Ready to <span className="text-gradient">Accelerate?</span>
            </h2>
            <p className="text-text-secondary text-base sm:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
              Join the early professionals who are treating their career growth like a measurable, solvable system.
            </p>

            {/* Pulsing CTA Button */}
            <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
              <Link href="/signup" className="inline-flex items-center justify-center gap-3 w-full sm:w-auto bg-gradient-to-r from-primary to-accent-blue text-white px-8 sm:px-12 py-4 sm:py-5 rounded-full font-bold text-lg transition-all duration-300 hover:shadow-[0_0_50px_rgba(157,78,221,0.6)]">
                Create your free account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <p className="text-text-secondary text-xs mt-6 opacity-60">No credit card required. Start building immediately.</p>
          </div>
        </motion.div>
      </motion.section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="relative z-10 border-t border-white/10 mt-8 sm:mt-12 bg-background/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-text-secondary text-center md:text-left">
          <div className="flex items-center gap-2 font-medium">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm bg-gradient-to-br from-primary to-accent-blue opacity-80" />
            Career Accelerator
          </div>
          <p>© 2026 Eleojo Arawa. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}