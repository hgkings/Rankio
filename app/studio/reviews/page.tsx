"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2, Image as ImageIcon, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Proof {
    id: string;
    file_path: string;
    review_status: string;
    created_at: string;
}

interface Attempt {
    id: string;
    status: string;
    submitted_at: string;
    user_profile_id: string;
    mission_id: string;
    mission: {
        title: string;
        points_base: number;
        points_bonus: number;
    };
    profiles: {
        display_name: string;
        avatar_url: string;
    };
    proofs: Proof[];
}

export default function ReviewsPage() {
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        fetchPendingAttempts();
    }, []);

    const fetchPendingAttempts = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get creator's profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('creator_id')
                .eq('id', user.id)
                .single();

            if (!profile?.creator_id) {
                toast.error('Creator bilgisi bulunamadı');
                return;
            }

            // Fetch pending attempts for this creator's missions
            const { data, error } = await supabase
                .from('mission_attempts')
                .select(`
                    *,
                    mission:missions!inner(title, points_base, points_bonus, creator_id),
                    profiles!mission_attempts_user_profile_id_fkey(display_name, avatar_url),
                    proofs(*)
                `)
                .eq('mission.creator_id', profile.creator_id)
                .eq('status', 'pending')
                .order('submitted_at', { ascending: false });

            if (error) throw error;
            setAttempts(data || []);
        } catch (error: any) {
            console.error('Error fetching attempts:', error);
            toast.error('Görevler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (attemptId: string, userId: string, points: number) => {
        setProcessingId(attemptId);
        try {
            // Check if already rewarded (idempotency)
            const { data: existingLedger } = await supabase
                .from('ledger_entries')
                .select('id')
                .eq('ref_type', 'mission_attempt')
                .eq('ref_id', attemptId)
                .single();

            if (existingLedger) {
                toast.error('Bu görev için ödül zaten verilmiş');
                return;
            }

            // Update attempt status
            const { error: attemptError } = await supabase
                .from('mission_attempts')
                .update({
                    status: 'approved',
                    approved_at: new Date().toISOString()
                })
                .eq('id', attemptId);

            if (attemptError) throw attemptError;

            // Update wallet
            const { data: wallet } = await supabase
                .from('wallets')
                .select('points_balance')
                .eq('profile_id', userId)
                .single();

            const newBalance = (wallet?.points_balance || 0) + points;

            const { error: walletError } = await supabase
                .from('wallets')
                .update({ points_balance: newBalance })
                .eq('profile_id', userId);

            if (walletError) throw walletError;

            // Create ledger entry
            const { error: ledgerError } = await supabase
                .from('ledger_entries')
                .insert({
                    profile_id: userId,
                    kind: 'points',
                    direction: 'credit',
                    amount: points,
                    reason: 'Mission completed',
                    ref_type: 'mission_attempt',
                    ref_id: attemptId
                });

            if (ledgerError) throw ledgerError;

            toast.success(`Görev onaylandı! ${points} puan verildi 🎉`);
            fetchPendingAttempts();
        } catch (error: any) {
            console.error('Approval error:', error);
            toast.error(error.message || 'Onaylama başarısız oldu');
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (attemptId: string) => {
        setProcessingId(attemptId);
        try {
            const { error } = await supabase
                .from('mission_attempts')
                .update({ status: 'rejected' })
                .eq('id', attemptId);

            if (error) throw error;

            toast.success('Görev reddedildi');
            fetchPendingAttempts();
        } catch (error: any) {
            console.error('Rejection error:', error);
            toast.error('Reddetme başarısız oldu');
        } finally {
            setProcessingId(null);
        }
    };

    const getProofUrl = async (filePath: string) => {
        const { data } = supabase.storage
            .from('proofs')
            .getPublicUrl(filePath);
        return data.publicUrl;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                    <p className="text-slate-400 font-bold">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-white">Kanıt İncelemeleri</h1>
                    <p className="text-slate-400 font-bold">
                        {attempts.length} görev inceleme bekliyor
                    </p>
                </div>

                {/* Attempts List */}
                {attempts.length === 0 ? (
                    <div className="bg-white/5 border-2 border-white/10 rounded-3xl p-12 text-center">
                        <p className="text-2xl font-black text-slate-400">İnceleme bekleyen görev yok</p>
                        <p className="text-slate-500 mt-2">Yeni görevler geldiğinde burada görünecek</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {attempts.map((attempt) => {
                            const totalPoints = attempt.mission.points_base + (attempt.mission.points_bonus || 0);
                            const proof = attempt.proofs?.[0];

                            return (
                                <div
                                    key={attempt.id}
                                    className="bg-white/5 border-2 border-white/10 rounded-3xl p-6 space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-2xl font-black text-white">
                                                {attempt.mission.title}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-black">
                                                        {attempt.profiles?.display_name?.[0] || '?'}
                                                    </div>
                                                    <span className="text-slate-300 font-bold">
                                                        {attempt.profiles?.display_name || 'Unknown'}
                                                    </span>
                                                </div>
                                                <span className="text-slate-500">•</span>
                                                <span className="text-slate-400 text-sm">
                                                    {new Date(attempt.submitted_at).toLocaleDateString('tr-TR')}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-3xl font-black text-primary">{totalPoints}</div>
                                            <div className="text-sm text-slate-400">puan</div>
                                        </div>
                                    </div>

                                    {/* Proof Preview */}
                                    {proof && (
                                        <div className="bg-white/5 rounded-2xl p-4 space-y-3">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <ImageIcon className="w-5 h-5" />
                                                <span className="text-sm font-bold">Kanıt</span>
                                            </div>
                                            <div className="relative w-full max-w-md">
                                                <img
                                                    src={supabase.storage.from('proofs').getPublicUrl(proof.file_path).data.publicUrl}
                                                    alt="Proof"
                                                    className="w-full rounded-xl border-2 border-white/10"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                                        <Button
                                            onClick={() => handleApprove(attempt.id, attempt.user_profile_id, totalPoints)}
                                            disabled={processingId === attempt.id}
                                            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl"
                                        >
                                            {processingId === attempt.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                                    Onayla
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(attempt.id)}
                                            disabled={processingId === attempt.id}
                                            variant="outline"
                                            className="flex-1 h-12 border-2 border-red-500/30 text-red-500 hover:bg-red-500/10 font-black rounded-xl"
                                        >
                                            <XCircle className="w-5 h-5 mr-2" />
                                            Reddet
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
