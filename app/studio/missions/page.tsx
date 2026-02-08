"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Trophy, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Mission {
    id: string;
    type: string;
    title: string;
    description: string;
    points_base: number;
    points_bonus: number;
    is_active: boolean;
    starts_at: string;
    ends_at: string;
    created_at: string;
}

export default function StudioMissionsPage() {
    const [missions, setMissions] = useState<Mission[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: profile } = await supabase
                .from('profiles')
                .select('creator_id')
                .eq('id', user.id)
                .single();

            if (!profile?.creator_id) return;

            const { data, error } = await supabase
                .from('missions')
                .select('*')
                .eq('creator_id', profile.creator_id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMissions(data || []);
        } catch (error: any) {
            console.error('Error fetching missions:', error);
            toast.error('Görevler yüklenirken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const toggleActive = async (missionId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('missions')
                .update({ is_active: !currentStatus })
                .eq('id', missionId);

            if (error) throw error;

            toast.success(currentStatus ? 'Görev devre dışı bırakıldı' : 'Görev aktif edildi');
            fetchMissions();
        } catch (error: any) {
            toast.error('İşlem başarısız oldu');
        }
    };

    const getTypeBadge = (type: string) => {
        const types: Record<string, { label: string; emoji: string }> = {
            comment: { label: 'Yorum', emoji: '💬' },
            quiz: { label: 'Quiz', emoji: '❓' },
            screenshot: { label: 'Screenshot', emoji: '📸' },
            raid: { label: 'Raid', emoji: '🎯' }
        };

        const typeInfo = types[type] || types.comment;
        return `${typeInfo.emoji} ${typeInfo.label}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400 font-bold">Yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-black text-white">Görevlerim</h1>
                        <p className="text-slate-400 font-bold">{missions.length} görev oluşturuldu</p>
                    </div>
                    <Link href="/studio/missions/new">
                        <Button className="h-14 px-6 bg-primary text-white font-black rounded-2xl hover:scale-105 transition-transform">
                            <Plus className="w-5 h-5 mr-2" />
                            Yeni Görev
                        </Button>
                    </Link>
                </div>

                {/* Missions Grid */}
                {missions.length === 0 ? (
                    <div className="bg-white/5 border-2 border-white/10 rounded-3xl p-12 text-center space-y-4">
                        <Trophy className="w-16 h-16 text-slate-500 mx-auto" />
                        <p className="text-2xl font-black text-slate-400">Henüz görev oluşturmadınız</p>
                        <p className="text-slate-500">İlk görevinizi oluşturun ve topluluğunuzu aktif edin!</p>
                        <Link href="/studio/missions/new">
                            <Button className="mt-4 bg-primary text-white font-black">
                                <Plus className="w-5 h-5 mr-2" />
                                İlk Görevi Oluştur
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {missions.map((mission) => {
                            const totalPoints = mission.points_base + (mission.points_bonus || 0);
                            const isExpired = new Date(mission.ends_at) < new Date();

                            return (
                                <div
                                    key={mission.id}
                                    className="bg-white/5 border-2 border-white/10 rounded-3xl p-6 space-y-4 hover:border-primary/30 transition-colors"
                                >
                                    {/* Header */}
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black text-white leading-tight mb-2">
                                                {mission.title}
                                            </h3>
                                            <span className="text-sm font-bold text-slate-400">
                                                {getTypeBadge(mission.type)}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-primary">{totalPoints}</div>
                                            <div className="text-xs text-slate-400">puan</div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-sm text-slate-400 line-clamp-2">
                                        {mission.description}
                                    </p>

                                    {/* Status */}
                                    <div className="flex items-center gap-2">
                                        {mission.is_active && !isExpired ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-black">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Aktif
                                            </span>
                                        ) : isExpired ? (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-black">
                                                <Clock className="w-3 h-3" />
                                                Süresi Doldu
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-xs font-black">
                                                <XCircle className="w-3 h-3" />
                                                Pasif
                                            </span>
                                        )}
                                    </div>

                                    {/* Dates */}
                                    <div className="text-xs text-slate-500 space-y-1">
                                        <p>Başlangıç: {new Date(mission.starts_at).toLocaleDateString('tr-TR')}</p>
                                        <p>Bitiş: {new Date(mission.ends_at).toLocaleDateString('tr-TR')}</p>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 border-t border-white/10 flex gap-2">
                                        <Button
                                            onClick={() => toggleActive(mission.id, mission.is_active)}
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 font-bold"
                                            disabled={isExpired}
                                        >
                                            {mission.is_active ? 'Devre Dışı Bırak' : 'Aktif Et'}
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
