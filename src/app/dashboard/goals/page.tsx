'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Sparkles, ArrowRight, Calendar, CheckCircle2, Circle, Loader2, Play } from "lucide-react";

// --- ANIMATION VARIANTS ---
const containerVariants = {
hidden: { opacity: 0 },
visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
hidden: { opacity: 0, y: 20 },
visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

export default function GoalStrategistPage() {
const [goal, setGoal] = useState("");
const [isGenerating, setIsGenerating] = useState(false);
const [hasGenerated, setHasGenerated] = useState(false);
const [user, setUser] = useState(null);
const [plan, setPlan] = useState(null);
const [timeline, setTimeline] = useState("6 Months");
const [intensity, setIntensity] = useState("Aggressive");

// useEffect(() => {
// const getUser = async () => {
// const { data } = await supabase.auth.getUser();
// setUser(data.user);
// };
// getUser();
// }, []);

const handleGenerate = async (e) => {
e.preventDefault();

console.log("🔥 BUTTON CLICKED");

if (!goal.trim()) {
console.log("❌ NO GOAL");
return;
}

setIsGenerating(true);
setHasGenerated(false);

try {
  console.log("📡 Sending request..."); 
  const res = await fetch("/api/generate-goal", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ goal, timeline, intensity }),
});

console.log("📥 Response received");

const data = await res.json();

console.log("🧠 RAW RESULT:", data.result);

let parsed;

try {
  // First attempt: direct JSON parse
  parsed = JSON.parse(data.result);
} catch (err) {
  console.log("⚠️ Direct parse failed, attempting cleanup...");

  try {
    let raw = data.result;

    // Extract JSON block from text
    let match = raw.match(/\{[\s\S]*\}/);

    if (match) {
      let cleaned = match[0]
        .replace(/(\w+):/g, '"$1":')   // fix unquoted keys
        .replace(/'/g, '"');          // fix single quotes

      parsed = JSON.parse(cleaned);
    } else {
      throw new Error("No JSON found");
    }

  } catch (err2) {
    console.error("❌ FINAL PARSE FAILED:", err2);
    alert("AI response format error. Try again.");
    setIsGenerating(false);
    return;
  }
}

console.log("✅ PARSED:", parsed);

setPlan(parsed);
setIsGenerating(false);
  setHasGenerated(true); 
  } catch (err) {
console.error("🔥 FETCH ERROR:", err);
setIsGenerating(false);
}
};

const saveGoal = async () => {
if (!user) {
alert("You must be logged in");
return;
}


const { error } = await supabase.from("goals").insert([
  {
    title: goal,
    category: "Career",
    user_id: user.id,
  },
]);

if (error) {
  alert("Error saving goal");
  console.log(error);
} else {
  alert("Goal saved successfully 🚀");
}


};

return (
<motion.div
initial="hidden"
animate="visible"
variants={containerVariants}
className="max-w-6xl mx-auto space-y-8"
>


  <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-text-primary">Goal Strategist</h1>
      </div>
      <p className="text-text-secondary">Input a vague ambition. Let the AI reverse-engineer the exact steps to get there.</p>
    </div>
  </motion.div>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
    
    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
      <div className="glass-card p-6 md:p-8 bg-background/40 backdrop-blur-md border-primary/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[50px] pointer-events-none" />
        
        <form onSubmit={handleGenerate} className="relative z-10 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              What is your ultimate objective?
            </label>
            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., I want to transition from a Junior Developer to a Senior Frontend Engineer in the next 6 months..."
              className="w-full bg-surface/50 border border-white/10 rounded-xl p-4 text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all min-h-[160px] resize-none shadow-inner"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Timeline</label>
                
<select
  value={timeline}
  onChange={(e) => setTimeline(e.target.value)}
  className="w-full bg-surface/50 border border-white/10 rounded-lg p-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">Intensity</label>
<select
  value={intensity}
  onChange={(e) => setIntensity(e.target.value)}
  className="w-full bg-surface/50 border border-white/10 rounded-lg p-2.5 text-sm text-text-primary focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                >
                  <option>Balanced</option>
                <option>Aggressive</option>
                <option>Night & Weekends</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating || !goal.trim()}
            className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent-blue text-white py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(157,78,221,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Strategizing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Strategy
              </>
            )}
          </button>
        </form>
      </div>

      <div className="glass-card p-6 bg-surface/30 border-white/5 border-dashed">
         <h3 className="text-sm font-bold text-text-primary mb-2 flex items-center gap-2">
            <Play className="w-4 h-4 text-secondary fill-secondary/20" /> Pro Tip
         </h3>
         <p className="text-xs text-text-secondary leading-relaxed">
           The more specific you are about your current state and your constraints, the better the AI can tailor your daily execution plan.
         </p>
      </div>
    </motion.div>

    <motion.div variants={itemVariants} className="lg:col-span-7">
      <AnimatePresence mode="wait">
        
        {!isGenerating && !hasGenerated && (
          <motion.div className="h-full min-h-[400px] glass-card border-white/5 flex flex-col items-center justify-center p-8 text-center bg-background/20 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
              <Target className="w-8 h-8 text-text-secondary/50" />
            </div>
            <h3 className="text-lg font-bold text-text-secondary mb-2">Awaiting your command</h3>
            <p className="text-sm text-text-secondary/60 max-w-sm">
              Describe your career goal on the left, and watch as it gets broken down into an exact, step-by-step master plan.
            </p>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div className="h-full min-h-[400px] glass-card border-primary/30 flex flex-col items-center justify-center p-8 text-center bg-background/40 backdrop-blur-md">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-bold text-text-primary mb-2">Analyzing Trajectory...</h3>
          </motion.div>
        )}

        {hasGenerated && (
          <motion.div className="glass-card p-6 md:p-8 border-success/30 bg-background/40 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-primary">Execution Plan</h2>
              <button onClick={saveGoal} className="text-sm font-bold bg-white/10 hover:bg-white/20 text-text-primary px-4 py-2 rounded-lg">
                Save to Dashboard
              </button>
              </div>
              
              

          {/* ✅ MOVE PLAN HERE */}
          <div className="space-y-6">
            {plan?.months?.map((month, index) => (
              <div key={index} className="border border-white/10 rounded-xl p-4">
                <h3 className="text-lg font-bold text-text-primary mb-1">
                  {month.title}
                </h3>
                <p>
                  {typeof month.description === "string"
                    ? month.description
                    : JSON.stringify(month.description)}
                </p>

                                <ul>
                  {(Array.isArray(month.tasks) ? month.tasks : []).map((task, i) => (
                    <li key={i}>
                      {typeof task === "string" ? task : JSON.stringify(task)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>

  </div>
</motion.div>


);
}
