"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Mission, MissionAttempt } from "@/lib/types/database";

export default function MissionDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [mission, setMission] = useState<Mission | null>(null);
    const [attempt, setAttempt] = useState<MissionAttempt | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadMission();
    }, [params.id]);

    const loadMission = async () => {
        setLoading(true);
        const supabase = createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push("/login");
            return;
        }

        // Load mission
        const { data: missionData } = await supabase
            .from("missions")
            .select("*, creator:creators(*)")
            .eq("id", params.id)
            .single();

        setMission(missionData);

        // Check if user already has an attempt
        const { data: attemptData } = await supabase
            .from("mission_attempts")
            .select("*, proofs(*)")
            .eq("mission_id", params.id)
            .eq("user_profile_id", user.id)
            .single();

        setAttempt(attemptData);
        setLoading(false);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            // Create attempt
            const { data: newAttempt, error: attemptError } = await supabase
                .from("mission_attempts")
                .insert({
                    mission_id: params.id,
                    user_profile_id: user.id,
                    status: "pending"
                })
                .select()
                .single();

            if (attemptError) throw attemptError;

            // If screenshot mission and file provided, upload proof
            if (mission?.type === "screenshot" && file) {
                const fileExt = file.name.split(".").pop();
                const fileName = `${user.id}/${newAttempt.id}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from("proofs")
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // Create proof record
                await supabase
                    .from("proofs")
                    .insert({
                        attempt_id: newAttempt.id,
                        user_profile_id: user.id,
                        file_path: fileName,
                        type: "screenshot",
                        review_status: "pending"
                    });
            }

            toast.success("Görev gönderildi! Onay bekleniyor.");
            loadMission();
        } catch (error: any) {
            toast.error(error.message || "Görev gönderilemedi");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center">
                <p>Yükleniyor...</p>
            </div>
        );
    }

    if (!mission) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center">
                <p>Görev bulunamadı</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-3xl mx-auto">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    ← Geri
                </Button>

                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div>
                                <CardTitle className="text-2xl mb-2">{mission.title}</CardTitle>
                                <CardDescription>{mission.creator?.name}</CardDescription>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold text-indigo-600">
                                    {mission.points_base}
                                </div>
                                <div className="text-sm text-slate-500">puan</div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Badge>
                                {mission.type === 'comment' ? '💬 Yorum' :
                                    mission.type === 'quiz' ? '❓ Quiz' :
                                        mission.type === 'screenshot' ? '📸 Screenshot' :
                                            '🎯 Raid'}
                            </Badge>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Açıklama</h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                {mission.description}
                            </p>
                        </div>

                        {mission.points_bonus > 0 && (
                            <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                                <p className="text-amber-700 dark:text-amber-300">
                                    🎁 Bonus Puan: +{mission.points_bonus}
                                </p>
                            </div>
                        )}

                        {attempt ? (
                            <div className="p-4 border rounded-lg">
                                <h3 className="font-semibold mb-2">Durumun</h3>
                                <Badge className={
                                    attempt.status === 'approved' ? 'bg-green-500' :
                                        attempt.status === 'rejected' ? 'bg-red-500' :
                                            'bg-yellow-500'
                                }>
                                    {attempt.status === 'approved' ? '✓ Onaylandı' :
                                        attempt.status === 'rejected' ? '✗ Reddedildi' :
                                            '⏳ İnceleniyor'}
                                </Badge>
                                <p className="text-sm text-slate-500 mt-2">
                                    Gönderim: {new Date(attempt.submitted_at).toLocaleString('tr-TR')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="font-semibold">Görevi Tamamla</h3>

                                {mission.type === "screenshot" && (
                                    <div>
                                        <Label htmlFor="proof">Ekran Görüntüsü Yükle</Label>
                                        <Input
                                            id="proof"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            Görevin kanıtı olarak ekran görüntüsü yükle
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={handleSubmit}
                                    disabled={submitting || (mission.type === "screenshot" && !file)}
                                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
                                >
                                    {submitting ? "Gönderiliyor..." : "Görevi Gönder"}
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
