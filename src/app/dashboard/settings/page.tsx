'use client';

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Brain, 
  Shield, 
  Globe, 
  Save,
  CheckCircle2,
  Trash2
} from "lucide-react";

// --- CUSTOM GITHUB ICON ---
const GithubIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function SettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    setUser(user);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setName(data.name || "");
      setAvatar(data.avatar_url || "");
    }
  };

  loadProfile();
  }, []);
  const handlePasswordChange = async () => {
  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (newPassword.length < 6) {
    alert("Password should be at least 6 characters");
    return;
  }

  // ⚠️ Supabase does NOT verify current password directly
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    alert("Error updating password");
  } else {
    alert("Password updated ✅");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }
};

  const handleImageUpload = async (e: any) => {
  const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

  if (!user) return;

  const fileExt = file.name.split(".").pop();
  const fileName = `${user.id}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, { upsert: true });

  if (uploadError) {
    console.error(uploadError);
    alert("Upload failed");
    return;
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  setAvatar(data.publicUrl);
  };
  
  const handleSave = async () => {
  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      name,
      avatar_url: avatar,
    })
    .eq("id", user.id);

  if (!error) {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }
};

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    // { id: "ai", label: "AI Tuning", icon: Brain },
    // { id: "integrations", label: "Connections", icon: GithubIcon },
    { id: "security", label: "Account", icon: Shield },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your data and AI preferences.</p>
        </div>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Changes Saved" : "Save Settings"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id 
                ? "bg-white/10 text-text-primary border border-white/10" 
                : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-primary" : "opacity-70"}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            className="glass-card p-6 md:p-8 bg-background/40 backdrop-blur-md border-white/5 space-y-8"
          >
            {activeTab === "profile" && (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-text-primary">Professional Identity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Full Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:border-primary/50 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Avatar URL</label>
                     <label className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-white/10 bg-surface/50 cursor-pointer hover:border-primary/50 transition-all text-sm text-text-secondary">
  {fileName || "Click to upload avatar"}
  <input
    type="file"
    accept="image/*"
    onChange={handleImageUpload}
    className="hidden"
  />
</label>
                      {/* {avatar && (
                        <img src={avatar} className="w-16 h-16 rounded-full mt-2" />
                      )} */}
                    </div>
                    {/* <div className="space-y-1.5">
                      <label className="text-xs font-bold text-text-secondary uppercase">Current Role</label>
                      <input defaultValue="Software Engineer" className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:border-primary/50 outline-none" />
                    </div> */}
                  </div>
                </section>

                {/* <section className="space-y-4">
                  <h3 className="text-lg font-bold text-text-primary">The "AI Brain"</h3>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-text-secondary uppercase">Master Skillset</label>
                    <textarea 
                      defaultValue="React, Next.js, Tailwind CSS, TypeScript, UI/UX Design, Python, Technical Writing"
                      className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary focus:border-primary/50 outline-none h-24 resize-none" 
                    />
                  </div>
                </section> */}
              </div>
            )}

            {/* {activeTab === "ai" && (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-text-primary">Generation Style</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-text-primary">Accountability Tone</p>
                        <p className="text-xs text-text-secondary">How the AI speaks to you in the Goal Strategist.</p>
                      </div>
                      <select defaultValue="Brutally Honest" className="bg-background border border-white/10 rounded-lg p-2 text-xs text-text-primary outline-none">
                        <option value="Supportive Mentor">Supportive Mentor</option>
                        <option value="Brutally Honest">Brutally Honest</option>
                        <option value="Balanced">Balanced</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface/30 rounded-xl border border-white/5">
                      <div>
                        <p className="text-sm font-bold text-text-primary">Opportunity Radar Focus</p>
                        <p className="text-xs text-text-secondary">Prioritize specific types of opportunities.</p>
                      </div>
                      <select defaultValue="Remote Only" className="bg-background border border-white/10 rounded-lg p-2 text-xs text-text-primary outline-none">
                        <option value="Broad Reach">Broad Reach</option>
                        <option value="High Salary/Value Only">High Salary/Value Only</option>
                        <option value="Remote Only">Remote Only</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-text-primary">External Sync</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-[#24292e]/20 rounded-xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <GithubIcon className="w-5 h-5" />
                      <div>
                        <p className="text-sm font-bold text-text-primary">GitHub</p>
                        <p className="text-xs text-text-secondary">Sync projects for Portfolio Builder.</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline">Connect</button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-accent-blue" />
                      <div>
                        <p className="text-sm font-bold text-text-primary">Personal Website</p>
                        <p className="text-xs text-text-secondary">eleojoarawa.dev</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-error hover:underline">Disconnect</button>
                  </div>
                </div>
              </div>
            )} */}

            {activeTab === "security" && (
              <div className="space-y-6">
                <section className="space-y-4">
                  <h3 className="text-lg font-bold text-text-primary">Account Actions</h3>
                  <div className="space-y-3">
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary outline-none"
                      />

                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary outline-none"
                      />

                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-surface/50 border border-white/10 rounded-lg p-3 text-sm text-text-primary outline-none"
                      />

                      <button
                        onClick={handlePasswordChange}
                        className="w-full p-3 bg-primary text-white rounded-lg"
                      >
                        Update Password
                      </button>
                    </div>
                    <button onClick={async () => {
  if (!confirm("Are you sure? This cannot be undone.")) return;

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  await supabase.from("profiles").delete().eq("id", user.id);
  await supabase.auth.signOut();

  router.push("/login");
}} className="w-full text-left p-4 bg-error/5 rounded-xl border border-error/20 text-sm text-error hover:bg-error/10 transition-colors flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Delete Data & Nuke Account
                    </button>
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}