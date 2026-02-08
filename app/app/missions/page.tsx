import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Target,
    Users,
    Zap,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function MissionsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get all active missions
    const { data: missions } = await supabase
        .from("missions")
        .select("*, creator:creators(*)")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    // Get user's attempts to show completion status
    const { data: userAttempts } = await supabase
        .from("mission_attempts")
        .select("mission_id, status")
        .eq("user_profile_id", user.id);

    const attemptsByMission = userAttempts?.reduce((acc, attempt) => {
        acc[attempt.mission_id] = attempt.status;
        return acc;
    }, {} as Record<string, string>) || {};

    return (
        <div className="min-h-screen bg-dashboard p-4 md:p-8 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-brand-indigo/10 text-brand-indigo px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            GÜNLÜK FIRSATLAR
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Aktif <span className="text-gradient">Görevler</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            Favori içerik üreticilerini destekle ve koleksiyonunu genişlet.
                        </p>
                    </div>
                    <div className="flex bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border border-white/20 p-2 rounded-2xl shadow-lg">
                        <button className="px-6 py-2 rounded-xl bg-brand-indigo text-white font-bold text-sm shadow-indigo-500/20 shadow-lg">Hepsi</button>
                        <button className="px-6 py-2 rounded-xl text-slate-500 font-bold text-sm hover:text-brand-indigo transition-colors capitalize">Popüler</button>
                        <button className="px-6 py-2 rounded-xl text-slate-500 font-bold text-sm hover:text-brand-indigo transition-colors capitalize">Yeni</button>
                    </div>
                </div>

                {/* Missions Grid */}
                {missions && missions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {missions.map((mission) => {
                            const attemptStatus = attemptsByMission[mission.id];

                            return (
                                <Link key={mission.id} href={`/app/missions/${mission.id}`} className="group">
                                    <div className="glass-card p-1 relative h-full transition-transform hover:scale-[1.02]">
                                        <div className="p-8 h-full flex flex-col justify-between">

                                            <div className="space-y-6">
                                                {/* Status Badge Top Right */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-brand-indigo to-brand-purple rounded-2xl flex items-center justify-center text-white shadow-lg">
                                                            <Target className="w-6 h-6" />
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">KATEGORİ</p>
                                                            <Badge variant="outline" className="text-brand-indigo border-brand-indigo/30 rounded-lg font-bold">
                                                                {mission.type === 'comment' ? '💬 YORUM' :
                                                                    mission.type === 'quiz' ? '❓ QUIZ' :
                                                                        mission.type === 'screenshot' ? '📸 SCREENSHOT' :
                                                                            '🎯 RAID'}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {attemptStatus && (
                                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black shadow-sm ${attemptStatus === 'approved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                            attemptStatus === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                                                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                            }`}>
                                                            {attemptStatus === 'approved' ? <CheckCircle2 className="w-4 h-4" /> :
                                                                attemptStatus === 'rejected' ? <XCircle className="w-4 h-4" /> :
                                                                    <Clock className="w-4 h-4" />}
                                                            {attemptStatus === 'approved' ? 'TAMAMLANDI' :
                                                                attemptStatus === 'rejected' ? 'REDDEDİLDİ' :
                                                                    'BEKLEMEDE'}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-3">
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors tracking-tight">
                                                        {mission.title}
                                                    </h3>
                                                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                                                        {mission.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-white/20">
                                                        <Users className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">CREATOR</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{mission.creator?.name}</p>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex flex-col items-center justify-center min-w-[120px] shadow-2xl transition-transform group-hover:scale-105">
                                                    <div className="text-2xl font-black leading-none">+{mission.points_base}</div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">ÖDÜL PUAN</div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Hover Decoration */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity pointer-events-none" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="glass-card p-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-300">
                            <ShieldCheck className="w-12 h-12 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Şu an görev yok!</h3>
                            <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">
                                Tüm görevleri tamamladın veya henüz içerik üreticileri yeni görev eklemedi.
                            </p>
                        </div>
                        <Link href="/app/dashboard">
                            <Button className="bg-brand-indigo text-white px-8 h-12 rounded-xl font-bold">Dashboard'a Dön</Button>
                        </Link>
                    </div>
                )}

                {/* Pro Tip */}
                <div className="bg-slate-900 rounded-[2.5rem] p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-indigo/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform group-hover:scale-150 duration-700" />
                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center text-white shadow-2xl animate-bounce">
                            <Sparkles className="w-10 h-10" />
                        </div>
                        <div className="text-center md:text-left flex-1 space-y-2">
                            <h3 className="text-2xl font-black text-white">Görevleri İkiye Katla!</h3>
                            <p className="text-slate-400 font-medium">Rankio+ üyeliği ile tamamladığın her görevden %50 daha fazla puan kazan.</p>
                        </div>
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 px-10 h-14 rounded-2xl font-black text-lg shadow-xl shadow-white/10 whitespace-nowrap">
                            PLANLARI İNCELE
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
