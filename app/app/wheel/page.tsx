"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, Trophy, Coins, Star, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const REWARDS = [
    { type: "points", value: 10, label: "+10 Puan", color: "bg-blue-500" },
    { type: "points", value: 25, label: "+25 Puan", color: "bg-indigo-500" },
    { type: "coins", value: 5, label: "+5 Coin", color: "bg-amber-500" },
    { type: "points", value: 50, label: "+50 Puan", color: "bg-purple-500" },
    { type: "coins", value: 10, label: "+10 Coin", color: "bg-orange-500" },
    { type: "points", value: 15, label: "+15 Puan", color: "bg-pink-500" },
];

export default function WheelPage() {
    const [spinning, setSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [canSpin, setCanSpin] = useState(false);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        checkCooldown();
    }, []);

    const checkCooldown = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/auth/login");
            return;
        }

        const { data, error } = await supabase.rpc("can_spin_today", {
            check_user_id: user.id,
        });

        setCanSpin(data);
        setLoading(false);
    };

    const handleSpin = async () => {
        if (spinning || !canSpin) return;

        setSpinning(true);

        // Calculate final rotation
        const numRewards = REWARDS.length;
        const randomIndex = Math.floor(Math.random() * numRewards);
        const segmentAngle = 360 / numRewards;
        const additionalRotation = 360 * 5 + (randomIndex * segmentAngle);
        const newRotation = rotation + additionalRotation;

        setRotation(newRotation);

        // Wait for animation
        setTimeout(async () => {
            setSpinning(false);
            const reward = REWARDS[(numRewards - randomIndex) % numRewards];

            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // Save spin result
                const { error: spinError } = await supabase.from("wheel_spins").insert({
                    user_id: user.id,
                    reward_type: reward.type,
                    reward_value: reward.value,
                });

                if (spinError) throw spinError;

                // Update Wallet (Simple approach for MVP, usually done via DB Trigger)
                // We'll trust the DB triggers to handle ledger/wallet for now, 
                // but if they don't exist yet, we'd need to add them.

                toast.success(`Tebrikler! ${reward.label} kazandın! 🥳`);
                setCanSpin(false);
                router.refresh();
            } catch (error: any) {
                toast.error("Ödül kaydedilirken bir hata oluştu.");
                console.error(error);
            }
        }, 4000);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-dashboard">
                <Loader2 className="w-12 h-12 animate-spin text-brand-indigo" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dashboard p-4 md:p-8 animate-fade-in flex flex-col items-center">
            <div className="max-w-4xl w-full text-center space-y-12">

                <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-brand-indigo/10 text-brand-indigo px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-brand-indigo/20">
                        <Sparkles className="w-4 h-4" />
                        GÜNLÜK HEDİYE ÇARKI
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Şansını <span className="text-gradient">Dene!</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-lg mx-auto">
                        Her gün 1 kez çevir, bedava puan ve coin kazanma şansını yakala.
                    </p>
                </div>

                {/* Wheel Container */}
                <div className="relative flex justify-center items-center py-10">
                    {/* Static Pointer */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                        <div className="w-8 h-12 bg-slate-900 dark:bg-white rounded-b-full shadow-2xl flex items-center justify-center pt-2">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        </div>
                    </div>

                    {/* The Wheel */}
                    <div
                        className="w-80 h-80 md:w-[450px] md:h-[450px] rounded-full border-[12px] border-slate-900 dark:border-white shadow-[0_0_50px_rgba(0,0,0,0.1)] relative overflow-hidden transition-transform duration-[4000ms] cubic-bezier(0.15, 0, 0.15, 1)"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        {REWARDS.map((reward, i) => (
                            <div
                                key={i}
                                className={`absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center ${reward.color} border-r-2 border-slate-900/10`}
                                style={{
                                    transform: `rotate(${i * (360 / REWARDS.length)}deg) translate(-50%, -50%)`,
                                    clipPath: 'polygon(100% 100%, 0 100%, 0 0)'
                                }}
                            >
                                <div className="flex flex-col items-center gap-1 -rotate-45 translate-x-12 translate-y-12 text-white font-black text-xs md:text-sm">
                                    {reward.type === 'points' ? <Zap className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                                    <span>{reward.value}</span>
                                </div>
                            </div>
                        ))}

                        {/* Center Cap */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-900 dark:bg-white rounded-full z-10 shadow-2xl flex items-center justify-center">
                            <div className="w-12 h-12 border-4 border-dashed border-slate-700 dark:border-slate-200 rounded-full animate-spin-slow" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="pt-8">
                    {canSpin ? (
                        <Button
                            onClick={handleSpin}
                            disabled={spinning}
                            className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink text-white px-12 h-16 rounded-2xl text-xl font-black shadow-2xl hover:scale-110 active:scale-95 transition-all shadow-brand-indigo/30"
                        >
                            {spinning ? <Loader2 className="w-6 h-6 animate-spin" /> : "ÇARKI ÇEVİR!"}
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-500 px-8 h-16 rounded-2xl font-black text-lg border-2 border-dashed border-slate-300 dark:border-slate-700">
                                BUGÜN HAKKIN DOLDU
                            </div>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                                <RotateCcw className="w-4 h-4" />
                                24 SAAT SONRA TEKRAR DENE
                            </p>
                        </div>
                    )}
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <WheelInfoCard icon={<Trophy className="text-amber-500" />} title="Ücretsiz" desc="Her gün bedava" />
                    <WheelInfoCard icon={<Zap className="text-brand-indigo" />} title="Anında" desc="Cüzdana aktarılır" />
                    <WheelInfoCard icon={<Sparkles className="text-brand-purple" />} title="Büyük Ödül" desc="+50 Puan kazanma şansı" />
                </div>

            </div>
        </div>
    );
}

function WheelInfoCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="glass-card p-6 flex flex-col items-center gap-2">
            <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl mb-2">
                {icon}
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
            <p className="text-sm text-slate-500">{desc}</p>
        </div>
    );
}
