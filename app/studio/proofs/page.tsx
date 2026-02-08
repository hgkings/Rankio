"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    ShieldCheck,
    FileText,
    User,
    Zap,
    Loader2,
    ChevronRight
} from "lucide-react";

export default function StudioProofsPage() {
    const [proofs, setProofs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadProofs();
    }, []);

    const loadProofs = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get creator
        const { data: creator } = await supabase
            .from("creators")
            .select("id")
            .eq("owner_profile_id", user.id)
            .single();

        if (!creator) {
            setLoading(false);
            return;
        }

        // Get pending proofs for this creator's missions
        const { data } = await supabase
            .from("proofs")
            .select(`
        *,
        attempt:mission_attempts!inner(
          *,
          mission:missions!inner(*),
          user_profile:profiles!inner(*)
        )
      `)
            .eq("review_status", "pending")
            .eq("attempt.mission.creator_id", creator.id);

        setProofs(data || []);
        setLoading(false);
    };

    const handleReview = async (proofId: string, attemptId: string, status: "approved" | "rejected") => {
        setActionLoading(proofId);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        try {
            // 1. Update proof status
            const { error: proofError } = await supabase
                .from("proofs")
                .update({
                    review_status: status,
                    reviewer_profile_id: user.id
                })
                .eq("id", proofId);

            if (proofError) throw proofError;

            // 2. Update attempt status
            const { error: attemptError } = await supabase
                .from("mission_attempts")
                .update({
                    status,
                    approved_at: status === "approved" ? new Date().toISOString() : null,
                    reviewer_profile_id: user.id
                })
                .eq("id", attemptId);

            if (attemptError) throw attemptError;

            // 3. Handle reward if approved
            if (status === "approved") {
                const { data: attempt } = await supabase
                    .from("mission_attempts")
                    .select("*, mission:missions(*)")
                    .eq("id", attemptId)
                    .single();

                if (attempt) {
                    const totalReward = attempt.mission.points_base + (attempt.mission.points_bonus || 0);

                    // Create ledger entry
                    await supabase.from("ledger_entries").insert({
                        profile_id: attempt.user_profile_id,
                        kind: "points",
                        direction: "credit",
                        amount: totalReward,
                        reason: `Görev Onaylandı: ${attempt.mission.title}`,
                        ref_type: "mission_attempt",
                        ref_id: attemptId
                    });

                    // Update wallet
                    const { data: wallet } = await supabase
                        .from("wallets")
                        .select("points_balance")
                        .eq("profile_id", attempt.user_profile_id)
                        .single();

                    await supabase.from("wallets").update({
                        points_balance: (wallet?.points_balance || 0) + totalReward
                    }).eq("profile_id", attempt.user_profile_id);
                }
            }

            toast.success(status === "approved" ? "Görev başarıyla onaylandı! ✅" : "Görev reddedildi. ❌");
            loadProofs();
        } catch (error: any) {
            toast.error(error.message || "İşlem yapılırken bir hata oluştu.");
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-dashboard flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-brand-indigo" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dashboard p-4 md:p-8 animate-fade-in">
            <div className="max-w-5xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                            GÖREV İNCELEME
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                            Onay <span className="text-gradient">Bekleyenler</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
                            Takipçilerinin gönderdiği kanıtları incele ve ödüllerini dağıt.
                        </p>
                    </div>
                </div>

                {/* Proofs List */}
                {proofs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {proofs.map((proof) => (
                            <div key={proof.id} className="glass-card p-8 group relative overflow-hidden">
                                <div className="flex flex-col lg:flex-row gap-8">

                                    {/* User & Mission Info */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="w-14 h-14 border-2 border-white/20 shadow-lg">
                                                <AvatarImage src={proof.attempt?.user_profile?.avatar_url} />
                                                <AvatarFallback className="bg-gradient-to-br from-brand-indigo to-brand-purple text-white font-black">
                                                    {proof.attempt?.user_profile?.display_name?.charAt(0) || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">KATILIMCI</p>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{proof.attempt?.user_profile?.display_name || 'Anonim User'}</h3>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-white/10 space-y-1">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GÖREV</p>
                                            <p className="font-bold text-lg text-slate-800 dark:text-slate-200">{proof.attempt?.mission?.title}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-brand-indigo border-brand-indigo/20">
                                                    {proof.attempt?.mission?.type.toUpperCase()}
                                                </Badge>
                                                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                    +{proof.attempt?.mission?.points_base} PUAN
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Proof Content */}
                                    <div className="flex-1 bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-6 border-2 border-dashed border-slate-200 dark:border-white/10 relative group/proof">
                                        {proof.file_path ? (
                                            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                                <FileText className="w-12 h-12 text-slate-400" />
                                                <div>
                                                    <p className="font-bold text-slate-700 dark:text-slate-300">Ekran Görüntüsü Yüklendi</p>
                                                    <p className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">{proof.file_path}</p>
                                                </div>
                                                <Button variant="outline" className="rounded-xl font-bold gap-2">
                                                    <Eye className="w-4 h-4" /> Görüntüle
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                                                <Clock className="w-8 h-8" />
                                                <p className="text-sm font-medium">Yazılı açıklama veya meta veri</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-row lg:flex-col gap-3 justify-center">
                                        <Button
                                            onClick={() => handleReview(proof.id, proof.attempt_id, "approved")}
                                            disabled={!!actionLoading}
                                            className="bg-green-500 hover:bg-green-600 text-white font-black px-8 h-14 rounded-2xl shadow-lg shadow-green-500/20 flex-1 lg:flex-none"
                                        >
                                            {actionLoading === proof.id ? <Loader2 className="animate-spin" /> : <><CheckCircle2 className="mr-2 w-5 h-5" /> ONAYLA</>}
                                        </Button>
                                        <Button
                                            onClick={() => handleReview(proof.id, proof.attempt_id, "rejected")}
                                            disabled={!!actionLoading}
                                            variant="outline"
                                            className="border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-black px-8 h-14 rounded-2xl flex-1 lg:flex-none"
                                        >
                                            <XCircle className="mr-2 w-5 h-5" /> REDDET
                                        </Button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-20 text-center space-y-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-dashed border-green-500/30">
                            <ShieldCheck className="w-12 h-12 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white">Her Şey Güncel!</h3>
                            <p className="text-slate-500 font-medium mt-2 max-w-md mx-auto">
                                Bekleyen tüm onayları tamamladın. Topluluğun senin için yeni kanıtlar gönderene kadar dinlenebilirsin.
                            </p>
                        </div>
                        <Link href="/studio/dashboard">
                            <Button className="bg-slate-900 text-white px-8 h-12 rounded-xl font-bold">Studio'ya Dön</Button>
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
}
