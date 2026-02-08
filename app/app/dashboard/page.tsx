"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LevelSection } from "@/components/dashboard/LevelSection";
import { SpecialMissions } from "@/components/dashboard/SpecialMissions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { DailyWheelBanner } from "@/components/dashboard/DailyWheelBanner";
import { Coins, Trophy, Sparkles, Target, ArrowRight, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [completedMissions, setCompletedMissions] = useState(0);
    const supabase = createClient();

    useEffect(() => {
        const getData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUser(user);
                fetchProfile(user.id);
                fetchWallet(user.id);
                fetchStats(user.id);
            }
        };
        getData();
    }, []);

    const fetchProfile = async (userId: string) => {
        const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
        if (data) setProfile(data);
    };

    const fetchWallet = async (userId: string) => {
        const { data } = await supabase
            .from("wallets")
            .select("*")
            .eq("user_id", userId)
            .single();
        if (data) setWallet(data);
    };

    const fetchStats = async (userId: string) => {
        const { count } = await supabase
            .from("mission_submissions")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("status", "approved");
        setCompletedMissions(count || 0);
    };

    const handleBonusClick = () => {
        toast.success("Sürpriz bonusun için cüzdanını kontrol et! 🎁");
    };

    return (
        <div className="min-h-screen bg-dashboard p-4 md:p-10 space-y-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-12">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                <UserCircle className="w-8 h-8" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-none">
                                Hoş geldin, <span className="text-primary italic">{profile?.display_name || user?.email?.split('@')[0] || "Yolcu"}</span>! 👋
                            </h1>
                        </div>
                        <p className="text-slate-400 font-bold text-lg italic font-serif ml-14">
                            Rankio dünyasında bugün yeni fırsatlar seni bekliyor.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Button
                            variant="outline"
                            className="h-14 rounded-2xl border-2 border-slate-200 dark:border-white/10 px-6 font-black text-xs uppercase tracking-widest bg-white dark:bg-slate-900 shadow-sm hover:bg-slate-50 transition-all gap-2"
                            onClick={() => window.location.href = "/app/wheel"}
                        >
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            Çarkı Çevir
                        </Button>
                        <Link href="/app/missions" passHref>
                            <Button className="h-14 rounded-2xl bg-indigo-600 px-8 font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all gap-2">
                                <Target className="w-4 h-4" />
                                Görev Bul
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Level / XP Progress Area */}
                <LevelSection currentXP={completedMissions * 150} />

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCard
                        label="Toplam Puan"
                        value={wallet?.points_balance || 0}
                        icon={Trophy}
                        trend="+12%"
                        iconClassName="text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10"
                    />
                    <StatsCard
                        label="Coin Bakiyesi"
                        value={wallet?.coins_balance || 0}
                        icon={Coins}
                        iconClassName="text-amber-600 bg-amber-50 dark:bg-amber-500/10"
                    />
                    <StatsCard
                        label="Başarı Skoru"
                        value={`${Math.min(100, completedMissions * 10)}%`}
                        icon={Sparkles}
                        trend="+5%"
                        iconClassName="text-purple-600 bg-purple-50 dark:bg-purple-500/10"
                    />
                </div>

                {/* Second Row: Missions and Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <SpecialMissions />
                    <RecentActivity />
                </div>

                {/* Third Row: Premium Wheel Banner */}
                <DailyWheelBanner />

                {/* Footer Spacer */}
                <div className="h-4" />
            </div>
        </div>
    );
}
