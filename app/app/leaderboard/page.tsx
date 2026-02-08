import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Star, TrendingUp, Users, Crown } from "lucide-react";

export default async function LeaderboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get user's profile to find their creator
    const { data: profile } = await supabase
        .from("profiles")
        .select("creator_id")
        .eq("id", user.id)
        .single();

    // Get leaderboard for user's creator
    const { data: leaderboard } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url, wallets(points_balance)")
        .eq("creator_id", profile?.creator_id)
        .order("wallets(points_balance)", { ascending: false })
        .limit(50);

    const rankedUsers = leaderboard?.map((user, index) => ({
        ...user,
        rank: index + 1,
        points: user.wallets?.[0]?.points_balance || 0
    })) || [];

    const topThree = rankedUsers.slice(0, 3);
    const others = rankedUsers.slice(3);
    const currentUserRank = rankedUsers.findIndex(u => u.id === user.id) + 1;

    return (
        <div className="min-h-screen bg-dashboard p-4 md:p-8 animate-fade-in">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-amber-500/20">
                        <Trophy className="w-4 h-4" />
                        SEZON #1 ŞAMPİYONLUK YARIŞI
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                        Liderlik <span className="text-gradient">Tablosu</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-lg mx-auto">
                        Topluluğun en aktif üyeleri arasına gir ve özel rozetler kazan.
                    </p>
                </div>

                {/* Top 3 Podium */}
                {topThree.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end pb-8">
                        {/* 2nd Place */}
                        {topThree[1] && (
                            <div className="order-2 md:order-1">
                                <PodiumCard user={topThree[1]} rank={2} color="text-slate-400" bgColor="bg-slate-100" />
                            </div>
                        )}

                        {/* 1st Place */}
                        <div className="order-1 md:order-2 scale-110">
                            <PodiumCard user={topThree[0]} rank={1} color="text-amber-500" bgColor="bg-amber-500/10" isWinner />
                        </div>

                        {/* 3rd Place */}
                        {topThree[2] && (
                            <div className="order-3">
                                <PodiumCard user={topThree[2]} rank={3} color="text-amber-700" bgColor="bg-amber-700/10" />
                            </div>
                        )}
                    </div>
                )}

                {/* Current User Rank Bar */}
                {currentUserRank > 3 && (
                    <div className="glass bg-brand-indigo text-white p-6 rounded-3xl flex items-center justify-between shadow-xl shadow-brand-indigo/30 animate-slide-up sticky top-24 z-30">
                        <div className="flex items-center gap-6">
                            <div className="text-3xl font-black opacity-50">#{currentUserRank}</div>
                            <div className="flex items-center gap-4">
                                <Avatar className="w-12 h-12 border-2 border-white/20">
                                    <AvatarFallback className="bg-white/20 text-white font-bold uppercase">{rankedUsers[currentUserRank - 1].display_name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-black text-lg">Senin Sıralaman</p>
                                    <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Global Sıralama</p>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-black leading-none">{rankedUsers[currentUserRank - 1].points}</div>
                            <div className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">TOPLAM PUAN</div>
                        </div>
                    </div>
                )}

                {/* Others List */}
                <div className="glass-card overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
                        <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Tüm Sıralama</h3>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Users className="w-4 h-4" />
                            {rankedUsers.length} Toplam Katılımcı
                        </div>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                        {others.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 text-xl font-black text-slate-300 group-hover:text-brand-indigo transition-colors">#{member.rank}</div>
                                    <Avatar className="w-12 h-12 rounded-2xl shadow-sm">
                                        <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-slate-500 font-bold uppercase">
                                            {member.display_name?.[0] || '?'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors">{member.display_name || 'Anonim'}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Gümüş Lig</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-slate-900 dark:text-white drop-shadow-sm">{member.points}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none">PUAN</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function PodiumCard({ user, rank, color, bgColor, isWinner = false }: { user: any, rank: number, color: string, bgColor: string, isWinner?: boolean }) {
    return (
        <div className={`glass-card p-8 flex flex-col items-center text-center space-y-4 relative ${isWinner ? 'border-amber-500/30 shadow-2xl shadow-amber-500/10' : ''}`}>
            {isWinner && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="bg-amber-500 text-white p-2 rounded-xl shadow-xl animate-bounce">
                        <Crown className="w-8 h-8 fill-white" />
                    </div>
                </div>
            )}

            <div className="relative">
                <Avatar className={`w-24 h-24 border-4 ${isWinner ? 'border-amber-500 shadow-amber-500/20 shadow-2xl' : 'border-white/20'}`}>
                    <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-3xl font-black uppercase">{user.display_name?.[0]}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 ${bgColor} ${color} px-4 py-1 rounded-full text-sm font-black shadow-lg border border-white/20 whitespace-nowrap`}>
                    #{rank} GÜMÜŞ
                </div>
            </div>

            <div className="pt-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-[150px]">{user.display_name || 'Anonim'}</h3>
                <div className="flex flex-col items-center mt-2">
                    <span className="text-3xl font-black text-gradient">{user.points}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TOPLAM PUAN</span>
                </div>
            </div>

            <div className="w-full pt-4">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${isWinner ? 'bg-amber-500' : 'bg-brand-indigo'} rounded-full`} style={{ width: isWinner ? '100%' : rank === 2 ? '80%' : '60%' }} />
                </div>
            </div>
        </div>
    )
}
