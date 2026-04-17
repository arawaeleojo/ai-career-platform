'use client';

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Plus, Flame, Gift, Building2, MapPin, DollarSign, 
  MoreHorizontal, Radar, Sparkles, CheckCircle2, Clock, X,
  Briefcase, Trophy, Users, Award, GraduationCap, Banknote 
} from "lucide-react";

// --- ANIMATION VARIANTS ---
const containerVariants= { 
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}as any;

const itemVariants= { 
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
}as any;


const overlayVariants= {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
}as any;

// --- HELPER FUNCTION: GET DYNAMIC ICON ---
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Job': return <Briefcase className="w-3.5 h-3.5" />;
    case 'Grant': return <Banknote className="w-3.5 h-3.5" />;
    case 'Fellowship': return <Award className="w-3.5 h-3.5" />;
    case 'Competition': return <Trophy className="w-3.5 h-3.5" />;
    case 'Connection': return <Users className="w-3.5 h-3.5" />;
    case 'Scholarship': return <GraduationCap className="w-3.5 h-3.5" />;
    default: return <Briefcase className="w-3.5 h-3.5" />;
  }
};

// Map status to specific colors for moving items
const STATUS_COLORS: Record<string, string> = {
  "Pending": "bg-[#F59E0B]",
  "Approved": "bg-success",
  "Rejected": "bg-error"
};

// --- MOCK DATA ---
type Opportunity = {
  id: number;
  entity: string;
  title: string;
  type: string;
  location: string;
};

const initialOpportunities: Opportunity[] = [];

const initialSuggested = [
  { id: 101, entity: "Stripe", title: "Open Source Grant", type: "Grant", location: "Remote", value: "$50k No-Equity", match: 98, highlight: "Matches your OS contributions" },
  { id: 102, entity: "Guillermo Rauch", title: "Twitter DM Intro", type: "Connection", location: "Online", value: "High Leverage", match: 92, highlight: "Mutual connection found" },
];

const COLUMNS = [
  { id: "Pending", title: "Pending", border: "border-[#F59E0B]/30", color: "text-[#F59E0B]" },
  { id: "Approved", title: "Approved", border: "border-success/30", color: "text-success" },
  { id: "Rejected", title: "Rejected", border: "border-error/30", color: "text-error" }, 
];


export default function OpportunityTrackerPage() {
  const [user, setUser] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any[]>(initialOpportunities);
  const [suggestedJobs, setSuggestedJobs] = useState<any[]>([]);
  const [keywords, setKeywords] = useState("");
  const [activeColumn, setActiveColumn] = useState("Pending");

  
  
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  getUser();
}, []);
  
  // Menu & Modal States
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState(false);

  useEffect(() => {
  if (!user) return;

  const loadOpportunities = async () => {
    const { data, error } = await supabase
      .from("opportunities")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOpportunities(data);
    }
  };

  loadOpportunities();
}, [user]);
  
  // Form State for Add Modal
  const [newOpp, setNewOpp] = useState({ entity: '', title: '', type: 'Job', location: '', value: '' });

  // Add AI Suggestion to Tracker
 const handleSaveSuggestion = async (suggested: any) => {
   if (!user) {
  alert("User not logged in");
  return;
}
  // 1. Remove from radar immediately
  setSuggestedJobs(prev => prev.filter(job => job.id !== suggested.id));

  // 2. Build clean DB object (VERY IMPORTANT)
  const newJob = {
  entity: suggested.entity,
  title: suggested.title,
  type: suggested.type,
  location: suggested.location,
  value: suggested.value,
  status: "Pending",
  date: "Just now",
  color: STATUS_COLORS["Pending"],
  user_id: user.id
};

  // 3. Save to database
  const { data, error } = await supabase
    .from("opportunities")
    .insert([newJob])
    .select();

  if (error) {
    console.error("SAVE ERROR:", error);
    return;
  }

  // 4. Instantly update UI (THIS WAS THE MISSING PART)
  if (data) {
    setOpportunities(prev => [...data, ...prev]);
  }
};

  // Create Custom Opportunity
  const handleAddOpportunity = async (e: React.FormEvent) => {
    if (!user) {
  alert("User not logged in");
  return;
}
  e.preventDefault();

  const status = activeColumn;

  const newOpportunity = {
  ...newOpp,
  status,
  date: "Just now",
  color: STATUS_COLORS[status],
  user_id: user.id
};

  const { data, error } = await supabase
    .from("opportunities")
    .insert([newOpportunity])
    .select();

  if (!error && data) {
    setOpportunities(prev => [...prev, ...data]);
  }

  setIsAddModalOpen(false);
  setNewOpp({ entity: '', title: '', type: 'Job', location: '', value: '' });
};

  const handleDeleteOpportunity = async (id: number) => {
  const { error } = await supabase
    .from("opportunities")
    .delete()
    .eq("id", id);

  if (!error) {
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
  }

  setActiveMenuId(null);
  };
  
  const fetchOpportunities = async (keywords: string) => {
  try {
    const res = await fetch("/api/opportunities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ keywords }),
    });

    const data = await res.json();

    if (!data.opportunities) return;

    const formatted = data.opportunities.map((item: any, i: number) => ({
      id: Date.now() + i,
      ...item,
    }));

    setSuggestedJobs(formatted);

  } catch (err) {
    console.error("AI ERROR:", err);
  }
};

  // Move an existing opportunity to a new column
  const handleStatusChange = async (id: number, newStatus: string) => {
  const { error } = await supabase
    .from("opportunities")
    .update({ status: newStatus })
    .eq("id", id);

  if (!error) {
    setOpportunities(prev =>
      prev.map(opp =>
        opp.id === id
          ? { ...opp, status: newStatus, color: STATUS_COLORS[newStatus] }
          : opp
      )
    );
  }

  setActiveMenuId(null);
};

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="max-w-7xl mx-auto space-y-10 pb-12 relative">
      
      {/* Invisible overlay to close dropdowns when clicking outside */}
      {activeMenuId && (
        <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
      )}

      {/* ---------------- MODALS ---------------- */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  onClick={() => setIsAddModalOpen(false)}
  className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
  initial={{ opacity: 0, scale: 0.9, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 20 }}
 transition={{ duration: 0.3 }}
  className="glass-card w-full max-w-lg p-6 sm:p-8 relative z-10 border-white/20 shadow-2xl bg-surface/90"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Add Opportunity</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAddOpportunity} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Type</label>
                  <select value={newOpp.type} onChange={e => setNewOpp({...newOpp, type: e.target.value})} className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none appearance-none">
                    <option>Job</option><option>Grant</option><option>Fellowship</option><option>Competition</option><option>Scholarship</option><option>Connection</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Title / Role / Goal</label>
                  <input required value={newOpp.title} onChange={e => setNewOpp({...newOpp, title: e.target.value})} placeholder="e.g. Frontend Engineer, S26 Batch, Coffee Chat" className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Organization / Person</label>
                  <input required value={newOpp.entity} onChange={e => setNewOpp({...newOpp, entity: e.target.value})} placeholder="e.g. Vercel, Y Combinator, Sarah Drasner" className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-text-primary focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Location / Platform</label>
                    <input value={newOpp.location} onChange={e => setNewOpp({...newOpp, location: e.target.value})} placeholder="e.g. Remote, Twitter, London" className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-text-primary focus:border-primary/50 transition-all outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Value / Stakes</label>
                    <input value={newOpp.value} onChange={e => setNewOpp({...newOpp, value: e.target.value})} placeholder="e.g. $120k, $10k Prize, Mentorship" className="w-full bg-background border border-white/10 rounded-lg p-2.5 text-sm text-text-primary focus:border-primary/50 transition-all outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(157,78,221,0.3)] mt-2">
                  Add to Tracker
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {isRefineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div variants={overlayVariants} initial="hidden" animate="visible" exit="exit" onClick={() => setIsRefineModalOpen(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
<motion.div
  initial={{ opacity: 0, scale: 0.9, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.9, y: 20 }}
  transition={{ duration: 0.3 }}
  className="glass-card w-full max-w-lg p-6 sm:p-8 relative z-10 border-white/20 shadow-2xl bg-surface/90"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold text-text-primary">Refine Radar</h2>
                </div>
                <button onClick={() => setIsRefineModalOpen(false)} className="text-text-secondary hover:text-text-primary transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-text-secondary">Active Opportunity Streams</label>
                  <div className="flex flex-wrap gap-2">
                    {['Jobs', 'Grants', 'Fellowships', 'Competitions', 'Connections'].map(type => (
                      <label key={type} className="flex items-center gap-2 bg-background border border-white/10 px-3 py-2 rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
                        <input type="checkbox" defaultChecked className="accent-primary" />
                        <span className="text-sm text-text-primary">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Target Keywords (Comma separated)</label>
                <textarea
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="React, Open Source, DevRel, Y Combinator..."
                  className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:border-primary/50 outline-none resize-none h-24"
                                  />
                </div>
                <button
                  onClick={() => {
                    fetchOpportunities(keywords);
                    setIsRefineModalOpen(false);
                  }}
                  className="w-full bg-white text-background py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                >
                  Update AI Parameters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- HEADER & RESILIENCE WIDGET ---------------- */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-accent-blue/20 border border-accent-blue/30">
              <Calendar className="w-5 h-5 text-accent-blue" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Opportunity Tracker</h1>
          </div>
          <p className="text-text-secondary">Track jobs, grants, and connections. Every "no" brings you closer to the ultimate "yes."</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-background/40 backdrop-blur-md border border-error/20 p-1.5 rounded-2xl shadow-[0_0_30px_rgba(255,0,85,0.05)]">
          <div className="flex items-center gap-3 px-4 py-2">
            <Flame className="w-6 h-6 text-error animate-pulse" />
            <div>
              <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Resilience Streak</div>
              <div className="text-lg font-bold text-text-primary leading-none mt-1">
                {opportunities.filter(o => o.status === "Rejected").length} Rejections
              </div>
            </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10 hidden sm:block" />
          
        </div>
      </motion.div>

      
      
      {/* ---------------- 3-COLUMN KANBAN BOARD ---------------- */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[500px]">
          {COLUMNS.map((col) => {
            const columnJobs = opportunities.filter(job => job.status === col.id);
            return (
              <div key={col.id} className={`flex flex-col h-[600px] bg-surface/30 rounded-2xl border ${col.border} overflow-hidden`}>
                <div className="p-4 border-b border-white/5 bg-background/50 flex items-center justify-between sticky top-0 z-10">
                  <h3 className={`font-bold text-sm uppercase tracking-wider ${col.color}`}>{col.title}</h3>
                  <span className="bg-white/10 text-text-secondary text-xs font-bold px-2 py-1 rounded-md">{columnJobs.length}</span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  <AnimatePresence>
                    {columnJobs.map((job) => (
                      <motion.div key={job.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card p-4 border-white/5 bg-background/80 hover:border-white/20 transition-all group">
                        
                        <div className="flex items-start justify-between mb-3 relative">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${job.color} shadow-[0_0_8px_currentColor]`} />
                            <h4 className="font-bold text-text-primary text-sm">{job.entity}</h4>
                          </div>
                          
                          {/* Mobile-Friendly Action Menu */}
                          <div className="relative z-40">
                            <button 
                              onClick={() => setActiveMenuId(activeMenuId === job.id ? null : job.id)}
                              className="text-text-secondary hover:text-text-primary opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-white/5"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {activeMenuId === job.id && (
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }} 
                                  animate={{ opacity: 1, scale: 1, y: 0 }} 
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }} 
                                  className="absolute right-0 top-full mt-1 w-40 bg-surface border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
                                >
                                  <div className="text-[10px] font-bold text-text-secondary uppercase px-3 py-1.5 border-b border-white/5 mb-1">Move to...</div>
                                  {COLUMNS.map(c => c.id !== job.status && (
                            
                                    <button 
                                      key={c.id} 
                                      onClick={() => handleStatusChange(job.id, c.id)}
                                      className="w-full text-left px-3 py-2 text-xs font-medium text-text-primary hover:bg-white/5 transition-colors flex items-center gap-2"
                                    >
                                      <div className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[c.id]}`} />
                                      {c.title}
                                    </button>
                                    
                                  ))}
                                  <button
  onClick={() => handleDeleteOpportunity(job.id)}
  className="w-full text-left px-3 py-2 text-xs font-medium text-error hover:bg-error/10 transition-colors flex items-center gap-2 border-t border-white/5 mt-1"
>
  <div className="w-1.5 h-1.5 rounded-full bg-error" />
  Remove
</button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                        
                        <p className="text-sm font-medium text-text-secondary mb-4">{job.title}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-text-secondary/70">
                            {getTypeIcon(job.type)} {job.type}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-secondary/70">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-secondary/70">
                            <DollarSign className="w-3.5 h-3.5" /> {job.value}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {columnJobs.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-white/5 rounded-xl flex items-center justify-center">
                      <span className="text-xs text-text-secondary/50 font-medium">Empty</span>
                    </div>
                  )}
                </div>
                
                <button onClick={() => {
                  setActiveColumn(col.id);
                  setIsAddModalOpen(true);
                }} className="p-3 m-3 border border-white/5 border-dashed rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
                  <Plus className="w-3 h-3" /> Add Opportunity
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ---------------- AI OPPORTUNITY RADAR ---------------- */}
      <motion.div variants={itemVariants} className="glass-card p-6 md:p-8 border-primary/20 bg-background/40 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-full bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radar className="w-5 h-5 text-primary animate-pulse" />
              <h2 className="text-2xl font-bold text-text-primary">AI Opportunity Radar</h2>
            </div>
            <p className="text-sm text-text-secondary">Auto-sourced roles, grants, and connections based on your profile.</p>
          </div>
          <button onClick={() => setIsRefineModalOpen(true)} className="w-full sm:w-auto text-sm font-bold bg-white/5 hover:bg-white/10 text-text-primary px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 border border-white/10">
            <Sparkles className="w-4 h-4 text-primary" /> Refine Criteria
          </button>
        </div>

        <div className="flex flex-col gap-4 relative z-10">
          <AnimatePresence>
            {suggestedJobs.map((job) => (
              <motion.div key={job.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-surface/50 border border-white/10 rounded-2xl p-4 hover:border-primary/40 transition-colors group flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent-blue/20 flex items-center justify-center border border-white/10">
                    {getTypeIcon(job.type)}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-text-primary leading-tight">{job.title}</h4>
                    <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                      <span className="font-medium text-text-primary">{job.entity}</span>
                      <span className="hidden sm:inline text-white/20">•</span>
                      <span className="flex items-center gap-1">{getTypeIcon(job.type)}{job.type}</span>
                      <span className="hidden sm:inline text-white/20">•</span>
                      <span className="hidden sm:flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.value}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start md:items-end justify-center px-4 md:border-l border-white/5">
                  <div className="bg-success/10 border border-success/20 text-success px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 mb-1">{job.match}% Match</div>
                  <div className="text-xs text-text-secondary flex items-center gap-1"><Sparkles className="w-3 h-3 text-primary" /> {job.highlight}</div>
                </div>
                <div className="shrink-0">
                  <button onClick={() => handleSaveSuggestion(job)} className="w-full md:w-auto bg-primary/20 hover:bg-primary text-primary hover:text-white px-5 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" /> Add to Pending
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {suggestedJobs.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-text-secondary bg-surface/30">
              <CheckCircle2 className="w-6 h-6 text-success mb-2" />
              <p className="text-sm font-medium text-text-primary">All radar opportunities processed.</p>
              <p className="text-xs opacity-60 mt-1">The AI is scanning for new matches...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}