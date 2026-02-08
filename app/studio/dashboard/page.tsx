import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    BarChart3,
    Target,
    CheckCircle2,
    Users,
    PlusCircle,
    ArrowRight,
    TrendingUp,
    Zap,
    Star
} from "lucide-react";

export default async function StudioDashboard() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Get creator record
    const { data: creator } = await supabase
        .from("creators")
        .select("*")
        .eq("owner_profile_id", user.id)
        .single();

    if (!creator) {
        return (
            <div className="min-h-screen bg-dashboard flex items-center justify-center p-8">
                <div className="max-w-2xl w-full text-center space-y-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-brand-indigo to-brand-purple rounded-3xl flex items-center justify-center text-white mx-auto shadow-2xl animate-bounce">
                        <Star className="w-12 h-12 fill-white" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                            Creator <span className="text-gradient">Studio</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">
                            Topluluğunu büyütmek ve içeriklerini oyunlaştırmak için ilk adımı at.
                        </p>
                    </div>
                    <Card className="glass-card p-10 border-0 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-2">Başlamaya Hazır Mısın?</h3>
                        <p className="text-slate-500 mb-8">Henüz bir Creator kaydın bulunmuyor. Kaydını oluşturarak hemen görev yayınlamaya başlayabilirsin.</p>
                        <Button className="w-full h-14 bg-brand-indigo text-white rounded-2xl font-black text-lg hover:scale-[1.02] transition-all">
                            CREATOR PANELINI AKTİF ET
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    // Get stats
    const { count: missionsCount } = await supabase
        .from("missions")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", creator.id);

    const { count: pendingProofsCount } = await supabase
        .from("proofs")
        .select("*, attempt:mission_attempts!inner(mission:missions!inner(creator_id))", { count: "exact", head: true })
        .eq("review_status", "pending")
        .eq("attempt.mission.creator_id", creator.id);

    const { count: communityCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("creator_id", creator.id);

    return (
        <div className="min-h-screen bg-dashboard p-4 md:p-8 animate-fade-in">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-purple-500/20 mb-2">
                            <BarChart3 className="w-4 h-4" />
                            YÖNETİM PANELİ
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Studio <span className="text-gradient">Dashboard</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            Hoş geldin, <span className="font-bold text-slate-900 dark:text-white">{creator.name}</span>. Topluluğun harika gidiyor!
                        </p>
                    </div>
                    <Link href="/studio/missions/new">
                        <Button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-8 h-14 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                            <PlusCircle className="w-6 h-6" />
                            YENİ GÖREV
                        </Button>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StudioStatCard
                        title="Aktif Görevler"
                        value={missionsCount || 0}
                        icon={<Target className="w-6 h-6" />}
                        gradient="from-blue-600 to-indigo-600"
                    />
                    <StudioStatCard
                        title="Bekleyen Onaylar"
                        value={pendingProofsCount || 0}
                        icon={<CheckCircle2 className="w-6 h-6" />}
                        gradient="from-amber-400 to-orange-500"
                        alert={pendingProofsCount && pendingProofsCount > 0 ? true : false}
                    />
                    <StudioStatCard
                        title="Fan Topluluğu"
                        value={communityCount || 0}
                        icon={<Users className="w-6 h-6" />}
                        gradient="from-purple-600 to-pink-600"
                    />
                </div>

                {/* Main Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Quick Tasks */}
                    <div className="glass-card p-10 flex flex-col justify-between group">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-brand-indigo/10 rounded-2xl flex items-center justify-center text-brand-indigo mb-6">
                                <Zap className="w-8 h-8 fill-brand-indigo" />
                            </div>
                            <h3 className="text-2xl font-black">Hızlı Aksiyonlar</h3>
                            <p className="text-slate-500 font-medium">Topluluğunu canlandırmak için yeni bir raid veya yorum görevi başlat.</p>
                        </div>
                        <div className="mt-8 space-y-3">
                            <QuickActionLink href="/studio/missions" icon={<ArrowRight />} label="Tüm Görevleri Listele" />
                            <QuickActionLink href="/studio/proofs" icon={<ArrowRight />} label="Onay Sırasına Git" />
                            <QuickActionLink href="/studio/community" icon={<ArrowRight />} label="Üye Listesini İncele" />
                        </div>
                    </div>

                    {/* Growth Card */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <TrendingUp className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-2xl font-black italic tracking-widest text-brand-pink">RANKIO PRO</h3>
                            <p className="text-4xl font-black leading-tight">Analitiklerini <br /> İkiye Katla!</p>
                            <p className="text-slate-400 font-medium max-w-xs">Hangi görevlerin daha çok tıklandığını ve kullanıcı davranışlarını detaylı gör.</p>
                            <Button className="bg-white text-slate-900 hover:bg-slate-100 font-black px-8 h-12 rounded-xl text-sm">
                                DETAYLARI GÖR
                            </Button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

function StudioStatCard({ title, value, icon, gradient, alert = false }: { title: string, value: any, icon: any, gradient: string, alert?: boolean }) {
    return (
        <div className="glass-card p-8 group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 -mr-16 -mt-16 rounded-full blur-3xl`} />
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`p-4 bg-gradient-to-br ${gradient} text-white rounded-2xl shadow-lg`}>
                    {icon}
                </div>
                {alert && (
                    <div className="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full animate-pulse">
                        İLGİ GEREKİYOR
                    </div>
                )}
            </div>
            <div className="relative z-10">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <p className="text-5xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">{value}</p>
            </div>
        </div>
    )
}

function QuickActionLink({ href, icon, label }: { href: string, icon: any, label: string }) {
    return (
        <Link href={href} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-white/5 hover:bg-brand-indigo hover:text-white transition-all group/link">
            <span className="font-bold">{label}</span>
            <div className="group-hover/link:translate-x-1 transition-transform">{icon}</div>
        </Link>
    )
}
