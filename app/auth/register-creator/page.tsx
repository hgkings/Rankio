"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { Label } from "@/components/ui/label";
import { Video, Mail, Lock, ArrowRight, Loader2, Sparkles, User, Globe, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { ShinyText } from "@/components/ui/shiny-text";

export default function RegisterCreatorPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creatorName, setCreatorName] = useState("");
    const [platform, setPlatform] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Sign up user
            const { error: signUpError, data: authData } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: name,
                        role: "creator",
                    },
                },
            });

            if (signUpError) throw signUpError;
            if (!authData.user) throw new Error("Kullanıcı oluşturulamadı.");

            // 2. Create entry in creators table (triggers/functions will handle profile link usually, 
            // but we'll manually ensure consistency if needed. Metadata role should trigger the right flow.)

            const { error: creatorError } = await supabase
                .from("creators")
                .insert([{
                    owner_profile_id: authData.user.id,
                    name: creatorName,
                    platform,
                    profile_url: profileUrl,
                    is_active: true
                }]);

            if (creatorError) {
                console.error("Creator record error:", creatorError);
                // We proceed since the user is created, but warn.
                toast.warning("Hesap oluşturuldu ama kanal detayları kaydedilemedi. Profilinden düzenleyebilirsin.");
            } else {
                toast.success("İçerik Üreticisi kaydı başarılı! 🎥 Hoş geldin.");
            }

            router.push("/studio/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Kayıt olurken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <DottedSurface className="opacity-30" />

            <AuthCard className="max-w-xl">
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 -rotate-3">
                                <Video className="w-8 h-8 fill-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
                                <ShinyText text="Stüdyonu" className="block" />
                                <span className="text-primary italic">Kur!</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-sm italic font-serif">
                                Topluluğunu yönet, görevler oluştur.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Gerçek İsim</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="İsim Soyisim"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="creatorName" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Sahne Adı / Kanal</Label>
                            <div className="relative group">
                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="creatorName"
                                    type="text"
                                    placeholder="Kanal Adı"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white"
                                    value={creatorName}
                                    onChange={(e) => setCreatorName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">E-Posta</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="mail@kanal.com"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <Label htmlFor="platform" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Ana Platform</Label>
                            <div className="relative group">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <select
                                    id="platform"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white appearance-none"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    required
                                >
                                    <option value="" disabled className="bg-slate-900">Platform Seç</option>
                                    <option value="tiktok" className="bg-slate-900">TikTok</option>
                                    <option value="instagram" className="bg-slate-900">Instagram</option>
                                    <option value="youtube" className="bg-slate-900">YouTube</option>
                                    <option value="twitch" className="bg-slate-900">Twitch</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 text-left md:col-span-2">
                            <Label htmlFor="profileUrl" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Profil URL</Label>
                            <div className="relative group">
                                <Share2 className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="profileUrl"
                                    type="url"
                                    placeholder="https://tiktok.com/@kanal"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white"
                                    value={profileUrl}
                                    onChange={(e) => setProfileUrl(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left md:col-span-2">
                            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Şifre</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <Button
                                type="submit"
                                className="w-full h-16 bg-primary rounded-2xl text-xl font-black text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group/btn"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Stüdyoyu Aktif Et <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </form>

                    <div className="pt-8 border-t border-white/5 flex flex-col gap-6 items-center">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest leading-none">
                            <span className="text-slate-500">Yanlış seçim mi?</span>
                            <Link href="/auth" className="text-primary hover:underline">
                                Rol Değiştir
                            </Link>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 border-primary/20 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            İÇERİK ÜRETEREK KAZANMAYA BAŞLA!
                        </div>
                    </div>
                </div>
            </AuthCard>
        </div>
    );
}
