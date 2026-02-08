"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { Label } from "@/components/ui/label";
import { Zap, Mail, Lock, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DottedSurface } from "@/components/ui/dotted-surface";

import { ShinyText } from "@/components/ui/shiny-text";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error, data: { user } } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                const message = error.message === "Invalid login credentials"
                    ? "Bilgileriniz hatalı. Lütfen kontrol edin."
                    : "Giriş yapılamadı: " + error.message;
                throw new Error(message);
            }

            if (user) {
                // Fetch profile to determine role-based redirection
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                toast.success("Oturum başarıyla açıldı! 🎉");

                // Redirection logic
                if (profile?.role === 'creator') {
                    router.push("/studio/dashboard");
                } else if (profile?.role === 'admin') {
                    router.push("/admin/proofs");
                } else {
                    router.push("/app/dashboard");
                }

                router.refresh();
            }
        } catch (error: any) {
            toast.error(error.message || "Giriş yapılırken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        toast.info("Şifre sıfırlama özelliği yakında eklenecek! 🛠️");
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            <DottedSurface className="opacity-30" />

            <AuthCard>
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 rotate-3">
                                <Zap className="w-8 h-8 fill-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
                                <ShinyText text="Tekrar" className="block" />
                                <span className="text-primary italic">Hoş Geldin!</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-sm italic font-serif">
                                Rankio evrenine giriş yap ve görevlere devam et.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">E-Posta Adresi</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="ornek@mail.com"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2 text-left">
                            <div className="flex items-center justify-between ml-1">
                                <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Şifre</Label>
                                <button onClick={handleForgotPassword} className="text-[10px] font-black text-primary hover:text-primary/80 uppercase tracking-[0.1em]">Unuttum?</button>
                            </div>
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
                        <Button
                            type="submit"
                            className="w-full h-16 bg-primary rounded-2xl text-xl font-black text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all group/btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                <span className="flex items-center gap-2">
                                    Giriş Yap <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="pt-8 border-t border-white/5 flex flex-col gap-6 items-center">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest leading-none">
                            <span className="text-slate-500">Hesabın yok mu?</span>
                            <Link href="/auth" className="text-primary hover:underline">
                                Kayıt Ol
                            </Link>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-yellow-400/10 text-yellow-500 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 border-yellow-400/20 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            İLK GİRİŞTE +50 PUAN!
                        </div>
                    </div>
                </div>
            </AuthCard>
        </div>
    );
}
