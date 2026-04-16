'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import { motion } from "framer-motion";
import { 
  Target, 
  Flame, 
  Briefcase, 
  Plus, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  FileText,
  Share2,
  Globe     
} from "lucide-react";

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

export default function DashboardOverview() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [activation, setActivation] = useState<any>(null);
  const [stats, setStats] = useState({
  pending: 0,
  approved: 0,
  rejected: 0
  });
  
  const displayName =
  profile?.name ||
  user?.email?.split("@")[0] ||
  "User";
  
  const loadStats = async () => {
  const { data } = await supabase.from("opportunities").select("*");

  if (data) {
    setStats({
      pending: data.filter(o => o.status === "Pending").length,
      approved: data.filter(o => o.status === "Approved").length,
      rejected: data.filter(o => o.status === "Rejected").length,
    });
  }
};

  loadStats();
  
  const ACTIVATIONS = [
  {
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    insight: "Consistency beats intensity.",
    action: "Improve one small habit today."
  },
  {
    quote: "Action produces information.",
    author: "Unknown",
    insight: "You don’t need clarity before starting.",
    action: "Take one messy step today."
  },
  {
    quote: "Rejection is just redirection.",
    author: "Unknown",
    insight: "Every no filters you closer to the right yes.",
    action: "Apply to one opportunity today."
  }
  ];
  
  const router = useRouter();

  useEffect(() => {
  const checkUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
    return;
  }

  setUser(user);

  // ✅ FETCH PROFILE FROM DATABASE
  const { data: profileData } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  if (profileData) {
    setProfile(profileData);
  }
};

  checkUser();

  // ✅ ADD THIS PART
  const random = ACTIVATIONS[Math.floor(Math.random() * ACTIVATIONS.length)];
  setActivation(random);

}, []);

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="max-w-6xl mx-auto space-y-8"
    >
      
      {/* ---------------- WELCOME HEADER ---------------- */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-1">
            Welcome back, {displayName}.
          </h1>
          <p className="text-text-secondary">Here is what your trajectory looks like today.</p>
        </div>
        {/* <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_15px_rgba(157,78,221,0.3)]">
          <Plus className="w-4 h-4" /> New Action
        </button> */}
      </motion.div>


      {/* ---------------- STATS ROW ---------------- */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Stat 1: Active Goal */}
        <div className="glass-card p-6 border-primary/20 bg-background/40 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-colors" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="font-medium text-text-secondary text-sm">Focus Mode</span>
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-1">Build. Apply. Iterate.</h3>
          <p className="text-sm text-text-secondary mt-3">
  Stay consistent. Small actions compound into real outcomes.
</p>
        </div>

        {/* Stat 2: Opportunity Streak */}
        <div className="glass-card p-6 border-error/20 bg-background/40 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/10 rounded-full blur-xl group-hover:bg-error/20 transition-colors" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-error/20 border border-error/30">
              <Flame className="w-5 h-5 text-error" />
            </div>
            <span className="font-medium text-text-secondary text-sm">Resilience Streak</span>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-bold text-text-primary">{stats.rejected}</h3>
            <span className="text-text-secondary">Rejections</span>
          </div>
          <p className="text-xs text-secondary mt-3 font-medium bg-secondary/10 inline-block px-2 py-1 rounded">Every rejection is a redirection</p>
        </div>

        {/* Stat 3: Application Pipeline */}
        <div className="glass-card p-6 border-accent-blue/20 bg-background/40 backdrop-blur-md relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent-blue/10 rounded-full blur-xl group-hover:bg-accent-blue/20 transition-colors" />
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent-blue/20 border border-accent-blue/30">
              <Briefcase className="w-5 h-5 text-accent-blue" />
            </div>
            <span className="font-medium text-text-secondary text-sm">Pipeline</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats.pending}</div>
              <div className="text-xs text-text-secondary">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats.approved}</div>
              <div className="text-xs text-text-secondary">Approved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-text-primary">{stats.rejected}</div>
              <div className="text-xs text-text-secondary">Rejected</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---------------- MAIN CONTENT GRID ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Focus (Takes up 2/3 width) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 glass-card p-6 md:p-8 bg-background/40 backdrop-blur-md border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary">Today's Focus</h2>
            <span className="text-xs font-medium bg-primary/20 text-primary px-3 py-1 rounded-full border border-primary/30">AI Generated</span>
          </div>
          
          <div className="space-y-6">
  {activation && (
    <>
      <div className="p-4 rounded-xl bg-surface/50 border border-white/5">
        <p className="text-xs text-primary mb-1 font-semibold">Quote of the day</p>
        <p className="text-lg text-text-primary font-medium leading-relaxed">
          “{activation.quote}”
        </p>
        <p className="text-sm text-text-secondary mt-2">
          — {activation.author}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-surface/50 border border-white/5">
        <p className="text-xs text-primary mb-1 font-semibold">Insight</p>
        <p className="text-text-primary text-sm">
          {activation.insight}
        </p>
      </div>

      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-xs text-primary mb-1 font-semibold">Action</p>
        <p className="text-text-primary text-sm font-medium">
          {activation.action}
        </p>
      </div>
    </>
  )}
</div>
        </motion.div>

        {/* Right Column: Quick Actions */}
        <motion.div variants={itemVariants} className="glass-card p-6 md:p-8 bg-background/40 backdrop-blur-md border-white/5 flex flex-col">
          <h2 className="text-xl font-bold text-text-primary mb-6">Quick Actions</h2>
          
          <div className="flex flex-col gap-3 flex-1">
            <button
  onClick={() => router.push("/dashboard/assistant")}
  className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/5 hover:bg-white/5 transition-colors group"
>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10 text-secondary"><FileText className="w-4 h-4" /></div>
                <span className="font-medium text-sm">Tailor a new CV</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
            </button>
            
<button
  onClick={() => router.push("/dashboard/content")}
  className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/5 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#F59E0B]/10 text-[#F59E0B]"><Share2 className="w-4 h-4" /></div>
                <span className="font-medium text-sm">Draft LinkedIn Post</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
            </button>

<button
  onClick={() => router.push("/dashboard/portfolio")}
  className="flex items-center justify-between p-4 rounded-xl bg-surface/50 border border-white/5 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#EC4899]/10 text-[#EC4899]"><Globe className="w-4 h-4" /></div>
                <span className="font-medium text-sm">Update Portfolio Code</span>
              </div>
              <ArrowRight className="w-4 h-4 text-text-secondary group-hover:text-text-primary group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}