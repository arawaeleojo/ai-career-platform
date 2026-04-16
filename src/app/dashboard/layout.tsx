'use client';

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Target, 
  Calendar, 
  FileText, 
  Share2, 
  Globe, 
  Settings, 
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, color: "text-primary" },
  { name: "Goal Strategist", href: "/dashboard/goals", icon: Target, color: "text-primary" },
  { name: "Opportunity Tracker", href: "/dashboard/tracker", icon: Calendar, color: "text-accent-blue" },
  { name: "Career Assistant", href: "/dashboard/assistant", icon: FileText, color: "text-secondary" },
  { name: "Content Strategist", href: "/dashboard/content", icon: Share2, color: "text-[#F59E0B]" },
  { name: "Portfolio Builder", href: "/dashboard/portfolio", icon: Globe, color: "text-[#EC4899]" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  useEffect(() => {
  const checkUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    router.push("/login");
  } else {
    setLoading(false);

    // ✅ FETCH PROFILE
    const { data } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
    }
  }
};

  checkUser();

  // 🔒 Listen for logout in real-time
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    if (!session) {
      router.push("/login");
    }
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);
  const pathname = usePathname();
  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    return;
  }

  router.push("/login");
};
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
  return null;
  }
  
  return (
    <div className="flex min-h-screen relative z-10">
      
      {/* ---------------- MOBILE OVERLAY ---------------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-background/90 backdrop-blur-2xl border-r border-white/5 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.4)] w-64 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        
        {/* Brand & Mobile Close Button */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/5">
          <Link href="/" className="font-bold text-lg tracking-tight flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent-blue shadow-[0_0_15px_rgba(157,78,221,0.5)]" />
            <span className="hidden sm:inline">Career Accelerator</span>
            <span className="sm:hidden">Accelerator</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href} 
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click (mobile)
                className="relative block"
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab" 
                    className="absolute inset-0 bg-white/5 border border-white/10 rounded-xl"
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  />
                )}
                <div className={`relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? item.color : 'opacity-70'}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Actions */}
        {/* ---------------- BOTTOM ACTIONS ---------------- */}
<div className="p-4 border-t border-white/5 space-y-1">
  
  {/* Settings Link */}
  <Link 
    href="/dashboard/settings"
    onClick={() => setIsMobileMenuOpen(false)}
    className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
      pathname === '/dashboard/settings' 
      ? 'bg-white/10 text-text-primary border border-white/10' 
      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
    }`}
  >
    <Settings className={`w-5 h-5 ${pathname === '/dashboard/settings' ? 'text-primary' : 'opacity-70'}`} />
    <span className="font-medium text-sm">Settings</span>
  </Link>

  {/* Logout Link */}
  <button
  onClick={() => {
    setIsMobileMenuOpen(false);
    handleLogout();
  }}
  className="flex items-center gap-3 px-3 py-3 rounded-xl text-text-secondary hover:text-error hover:bg-error/10 transition-colors w-full"
>
  <LogOut className="w-5 h-5 opacity-70" />
  <span className="font-medium text-sm">Log out</span>
</button>
  
</div>
      </aside>

      {/* ---------------- MAIN CONTENT AREA ---------------- */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-background/30 backdrop-blur-md border-b border-white/5 sticky top-0 z-30">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Menu Icon */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-semibold text-text-secondary hidden sm:block">Dashboard</div>
          </div>

          <div className="flex items-center gap-3">
            {/* Name */}
            <div className="text-sm font-medium text-text-primary">
              {profile?.name || "User"}
            </div>
            {/* Avatar */}
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                className="w-9 h-9 rounded-full object-cover border border-white/10"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent-blue" />
            )}

            
          </div>
        </header>

        {/* Page Content passed from page.tsx */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}