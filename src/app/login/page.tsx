'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

const cardVariant = {
hidden: { opacity: 0, y: 40, scale: 0.95 },
visible: {
opacity: 1,
y: 0,
scale: 1,
transition: { type: "spring" as const, stiffness: 100, damping: 15 }
}
};

export default function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);

    
const router = useRouter();

const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        alert(error.message);
        setLoading(false);
        return;
    }

    setLoading(false);

    // redirect after login
    router.push("/dashboard");
};

return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative z-10 pt-20">

        <motion.div
            initial="hidden"
            animate="visible"
            variants={cardVariant}
            className="glass-card w-full max-w-md p-8 sm:p-10 relative overflow-hidden bg-background/80 backdrop-blur-2xl border-primary/20 shadow-[0_0_50px_rgba(157,78,221,0.1)]"
        >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/30 blur-[60px] pointer-events-none rounded-full mix-blend-screen" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-blue/20 blur-[60px] pointer-events-none rounded-full mix-blend-screen" />

            <div className="relative z-10 space-y-8">

                <div className="text-center space-y-2">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity">
                        <div className="w-5 h-5 rounded-sm bg-gradient-to-br from-primary to-accent-blue shadow-[0_0_10px_rgba(157,78,221,0.5)]" />
                        <span className="font-bold text-sm tracking-tight text-text-primary">Career Accelerator</span>
                    </Link>
                    <h1 className="text-3xl font-bold tracking-tight text-text-primary">
                        Welcome back
                    </h1>
                    <p className="text-text-secondary text-sm">
                        Log in to continue building your future.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary ml-1">
                            Email address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-text-secondary/50 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-medium text-text-secondary">
                                Password
                            </label>
                            <Link href="#" className="text-xs text-text-secondary hover:text-primary transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-text-secondary/50 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-surface/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-text-primary placeholder:text-text-secondary/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-accent-blue text-white py-3.5 rounded-xl font-bold transition-all duration-300 hover:shadow-[0_0_25px_rgba(157,78,221,0.4)] mt-2"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <p className="text-center text-sm text-text-secondary">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-medium hover:text-primary/80 transition-colors drop-shadow-[0_0_8px_rgba(157,78,221,0.4)]">
                        Sign up for free
                    </Link>
                </p>
            </div>
        </motion.div>
    </main>
);

}
