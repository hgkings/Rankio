"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NewMissionPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: 'screenshot',
        title: '',
        description: '',
        points_base: 10,
        points_bonus: 0,
        starts_at: new Date().toISOString().split('T')[0],
        ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error('Lütfen giriş yapın');
                return;
            }

            // Get creator profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('creator_id')
                .eq('id', user.id)
                .single();

            if (!profile?.creator_id) {
                toast.error('Creator bilgisi bulunamadı');
                return;
            }

            // Create mission
            const { error } = await supabase
                .from('missions')
                .insert({
                    creator_id: profile.creator_id,
                    ...formData,
                    is_active: true
                });

            if (error) throw error;

            toast.success('Görev başarıyla oluşturuldu! 🎉');
            router.push('/studio/missions');
        } catch (error: any) {
            console.error('Error creating mission:', error);
            toast.error(error.message || 'Görev oluşturulurken hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/studio/missions">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <h1 className="text-3xl font-black text-white">Yeni Görev Oluştur</h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-white/5 border-2 border-white/10 rounded-3xl p-8 space-y-6">
                    {/* Type */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider text-slate-400">
                            Görev Tipi
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { value: 'screenshot', label: '📸 Ekran Görüntüsü', color: 'green' },
                                { value: 'comment', label: '💬 Yorum', color: 'blue' },
                                { value: 'quiz', label: '❓ Quiz', color: 'purple' },
                                { value: 'raid', label: '🎯 Raid', color: 'red' }
                            ].map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type: type.value })}
                                    className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${formData.type === type.value
                                            ? `bg-${type.color}-500/20 border-${type.color}-500/50 text-${type.color}-400`
                                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                                        }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider text-slate-400">
                            Görev Başlığı
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Örn: TikTok videoma yorum yap"
                            className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-black uppercase tracking-wider text-slate-400">
                            Açıklama
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Görev detaylarını açıkla..."
                            rows={4}
                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl p-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            required
                        />
                    </div>

                    {/* Points */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-wider text-slate-400">
                                Temel Puan
                            </label>
                            <input
                                type="number"
                                value={formData.points_base}
                                onChange={(e) => setFormData({ ...formData, points_base: parseInt(e.target.value) })}
                                min="1"
                                className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-wider text-slate-400">
                                Bonus Puan (Opsiyonel)
                            </label>
                            <input
                                type="number"
                                value={formData.points_bonus}
                                onChange={(e) => setFormData({ ...formData, points_bonus: parseInt(e.target.value) })}
                                min="0"
                                className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-wider text-slate-400">
                                Başlangıç Tarihi
                            </label>
                            <input
                                type="date"
                                value={formData.starts_at}
                                onChange={(e) => setFormData({ ...formData, starts_at: e.target.value })}
                                className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black uppercase tracking-wider text-slate-400">
                                Bitiş Tarihi
                            </label>
                            <input
                                type="date"
                                value={formData.ends_at}
                                onChange={(e) => setFormData({ ...formData, ends_at: e.target.value })}
                                className="w-full h-14 bg-white/5 border-2 border-white/10 rounded-2xl px-4 text-white font-bold focus:outline-none focus:border-primary/50 transition-colors"
                                required
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-6 border-t border-white/10">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-primary text-white text-xl font-black rounded-2xl hover:scale-105 transition-transform"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Oluşturuluyor...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Zap className="w-6 h-6 fill-white" />
                                    Görevi Oluştur
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
