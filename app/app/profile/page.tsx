"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        const { data } = await supabase
            .from("profiles")
            .select("*, creator:creators(*)")
            .eq("id", user.id)
            .single();

        setProfile(data);
        setDisplayName(data?.display_name || "");
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const supabase = createClient();

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            await supabase
                .from("profiles")
                .update({ display_name: displayName })
                .eq("id", user.id);

            toast.success("Profil güncellendi!");
            loadProfile();
        } catch (error: any) {
            toast.error(error.message || "Profil güncellenemedi");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8 flex items-center justify-center">
                <p>Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                        👤 Profilim
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        Profil bilgilerini yönet
                    </p>
                </div>

                {/* Profile Card */}
                <Card className="mb-6">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl">
                                    {profile?.display_name?.charAt(0) || '?'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle>{profile?.display_name || 'Anonim'}</CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="secondary">
                                        {profile?.role === 'admin' ? '👑 Admin' :
                                            profile?.role === 'creator' ? '⭐ Creator' :
                                                '👤 Fan'}
                                    </Badge>
                                    {profile?.is_verified && (
                                        <Badge className="bg-green-500">✓ Doğrulanmış</Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="displayName">İsim</Label>
                            <Input
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="mt-2"
                            />
                        </div>

                        {profile?.verification_code && (
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
                                <Label>Doğrulama Kodu</Label>
                                <p className="text-2xl font-mono font-bold text-indigo-600 dark:text-indigo-400 mt-2">
                                    {profile.verification_code}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                    Bu kodu yorumlarda kullan
                                </p>
                            </div>
                        )}

                        {profile?.creator && (
                            <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                                <Label>Bağlı Creator</Label>
                                <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mt-2">
                                    {profile.creator.name}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {profile.creator.platform}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-4">
                            <Button onClick={handleSave} disabled={saving} className="flex-1">
                                {saving ? "Kaydediliyor..." : "Kaydet"}
                            </Button>
                            <Button variant="outline" onClick={handleLogout} className="flex-1">
                                Çıkış Yap
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
