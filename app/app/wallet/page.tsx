import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Wallet,
    Coins,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    History,
    CreditCard,
    Sparkles,
    Zap,
    ChevronRight
} from "lucide-react";

export default async function WalletPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get wallet
    const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("profile_id", user.id)
        .single();

    // Get recent ledger entries
    const { data: ledgerEntries } = await supabase
        .from("ledger_entries")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

    return (
        <div className="min-h-screen bg-dashboard p-4 md:p-8 animate-fade-in">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            FİNANSAL ÖZET
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Dijital <span className="text-gradient">Cüzdanım</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            Biriktirdiğin puanları ve coinlerini buradan yönetebilirsin.
                        </p>
                    </div>
                    <Button className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-8 h-12 rounded-xl font-bold hover:scale-105 transition-all shadow-xl">
                        Para Çek / Harca
                    </Button>
                </div>

                {/* Balance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Points Card */}
                    <div className="glass-card p-10 bg-gradient-to-br from-brand-indigo via-brand-indigo/90 to-brand-purple text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-125 transition-transform duration-700">
                            <Zap className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/20">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div className="bg-white/10 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">PUAN BAKİYESİ</div>
                            </div>
                            <div>
                                <div className="text-6xl font-black tracking-tighter drop-shadow-lg">{wallet?.points_balance || 0}</div>
                                <p className="text-white/70 font-bold uppercase tracking-widest text-xs mt-2">Toplam Kazanılan Puan</p>
                            </div>
                            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                <p className="text-sm font-medium text-white/80">Bu ay +1,250 puan kazandın</p>
                                <ArrowUpRight className="w-5 h-5 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Coins Card */}
                    <div className="glass-card p-10 bg-slate-900 dark:bg-white dark:text-slate-900 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-125 transition-transform duration-700">
                            <Coins className="w-48 h-48" />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="p-3 bg-amber-500/20 rounded-2xl backdrop-blur-md border border-amber-500/20">
                                    <Coins className="w-8 h-8 text-amber-500" />
                                </div>
                                <div className="bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase">COIN BAKİYESİ</div>
                            </div>
                            <div>
                                <div className="text-6xl font-black tracking-tighter drop-shadow-lg">
                                    <span className="text-amber-500">R</span>{wallet?.coins_balance || 0}
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Harcanabilir Rankio Coin</p>
                            </div>
                            <div className="pt-6 border-t border-white/10 dark:border-slate-200">
                                <Button className="w-full bg-brand-indigo hover:bg-brand-indigo/90 text-white font-black h-12 rounded-xl text-sm shadow-xl shadow-brand-indigo/30">
                                    BAKİYE YÜKLE
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Transaction History Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black flex items-center gap-3">
                            <History className="w-7 h-7 text-brand-indigo" />
                            İşlem Geçmişi
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Filtrele:</span>
                            <select className="bg-transparent border-none text-xs font-bold text-brand-indigo focus:ring-0 outline-none cursor-pointer">
                                <option>Tüm İşlemler</option>
                                <option>Sadece Puanlar</option>
                                <option>Sadece Coinler</option>
                            </select>
                        </div>
                    </div>

                    <div className="glass-card overflow-hidden">
                        {ledgerEntries && ledgerEntries.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-white/5">
                                {ledgerEntries.map((entry) => (
                                    <div key={entry.id} className="flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                        <div className="flex items-center gap-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 ${entry.direction === 'credit'
                                                    ? 'bg-green-500/10 border-green-500/20 text-green-500'
                                                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                                                } group-hover:scale-110 transition-transform duration-300`}>
                                                {entry.direction === 'credit' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 dark:text-white group-hover:text-brand-indigo transition-colors">
                                                    {entry.reason || 'Sistem İşlemi'}
                                                </p>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                                    {new Date(entry.created_at).toLocaleString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right space-y-1">
                                            <div className={`text-2xl font-black ${entry.direction === 'credit' ? 'text-green-500' : 'text-red-500'
                                                }`}>
                                                {entry.direction === 'credit' ? '+' : '-'}{entry.amount}
                                            </div>
                                            <Badge variant="outline" className={`rounded-lg font-black border-2 ${entry.kind === 'points'
                                                    ? 'text-brand-indigo border-brand-indigo/20 bg-brand-indigo/5'
                                                    : 'text-amber-500 border-amber-500/20 bg-amber-500/5'
                                                }`}>
                                                {entry.kind === 'points' ? 'PUAN' : 'COIN'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center space-y-6">
                                <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto border-2 border-dashed border-slate-300">
                                    <CreditCard className="w-12 h-12 text-slate-400" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white">Henüz işlem yok</h3>
                                    <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">
                                        Görevleri tamamladıkça veya marketten alışveriş yaptıkça finansal geçmişin burada şekillenecek.
                                    </p>
                                </div>
                            </div>
                        )}

                        {ledgerEntries && ledgerEntries.length > 5 && (
                            <div className="p-4 bg-slate-50 dark:bg-white/5 text-center">
                                <Button variant="ghost" className="text-xs font-black text-slate-500 hover:text-brand-indigo uppercase tracking-widest">
                                    Daha Fazla Göster <ChevronRight className="ml-1 w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pro Banner */}
                <div className="bg-gradient-to-r from-brand-indigo via-brand-purple to-brand-pink p-1 rounded-[2.5rem] shadow-2xl">
                    <div className="bg-slate-900 rounded-[2.3rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20 animate-pulse">
                                <Sparkles className="w-8 h-8 text-amber-400 fill-amber-400" />
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-black text-white">Gelirlerini Optimize Et!</h3>
                                <p className="text-slate-400 font-medium mt-1">Premium üyeler çekim taleplerinde öncelik kazanır.</p>
                            </div>
                        </div>
                        <Button className="bg-white text-slate-900 hover:bg-slate-100 px-10 h-14 rounded-2xl font-black text-lg">
                            DETAYLAR
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}
