"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Target,
    Trophy,
    Wallet,
    User,
    LogOut,
    Sparkles,
    Zap,
    Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
                setProfile(data);
            }
        };
        getProfile();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/auth/login");
    };

    const navItems = [
        { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
        { label: "Görevler", href: "/app/missions", icon: Target },
        { label: "Günlük Çark", href: "/app/wheel", icon: Sparkles },
        { label: "Liderlik", href: "/app/leaderboard", icon: Trophy },
        { label: "Cüzdan", href: "/app/wallet", icon: Wallet },
        { label: "Profil", href: "/app/profile", icon: User },
    ];

    if (profile?.role === 'creator' || profile?.role === 'admin') {
        navItems.splice(1, 0, { label: "Studio", href: "/studio/dashboard", icon: Video });
    }

    return (
        <div className="w-72 h-screen bg-card border-r-2 border-white/5 flex flex-col p-6 sticky top-0 z-50">
            {/* Brand */}
            <div className="mb-12 px-2">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-6 transition-transform">
                        <Zap className="w-6 h-6 fill-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-white">
                        RANKIO
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all group ${isActive
                                    ? "bg-primary border-primary shadow-lg shadow-primary/20 font-black text-white"
                                    : "border-transparent text-slate-400 hover:border-white/10 hover:text-white"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm uppercase tracking-widest">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Quick Access Card */}
            <div className="mb-8 p-6 rounded-2xl bg-white/5 border-2 border-white/5 shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 opacity-60 font-serif italic">PRO ÜYELİK</p>
                    <p className="text-sm font-black text-white mb-4 leading-tight uppercase">Görevlerden 2x Puan Kazan!</p>
                    <Button size="sm" className="w-full bg-primary text-white hover:bg-primary/90 text-[11px] font-black h-9 rounded-lg shadow-lg shadow-primary/10">
                        ŞİMDİ YÜKSELT
                    </Button>
                </div>
            </div>

            {/* Footer / Logout */}
            <div className="pt-6 border-t-2 border-white/5">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start gap-3 text-red-500 hover:text-red-400 hover:bg-red-500/10 font-black uppercase tracking-widest text-xs"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Oturumu Kapat</span>
                </Button>
            </div>
        </div>
    );
}
