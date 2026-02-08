"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { Label } from "@/components/ui/label";
import { Trophy, Mail, Lock, ArrowRight, Loader2, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ShinyText } from "@/components/ui/shiny-text";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error, data } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        display_name: name,
                        role: "fan",
                    },
                },
            });

            if (error) {
                let message = "Kayıt yapılamadı: " + error.message;
                if (error.message === "User already registered") message = "Bu e-posta adresi zaten kullanımda.";
                throw new Error(message);
            }

            toast.success("Kayıt başarılı! 🎉 Hoş geldin.");
            router.push("/app/dashboard");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Kayıt olurken bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <HeroGeometric>
            <AuthCard>
                <div className="space-y-8">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-xl shadow-primary/20 -rotate-3">
                                <Trophy className="w-8 h-8 fill-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">
                                <ShinyText text="Maceraya" className="block" />
                                <span className="text-primary italic">Başla!</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-sm italic font-serif">
                                Rankio topluluğuna katıl ve ödülleri topla.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Lakabın / İsim</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Gamer_123"
                                    className="w-full h-14 bg-white/5 border-2 border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all shadow-sm text-white"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
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
                            <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Şifre Belirle</Label>
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
                                    Kaydol <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="pt-8 border-t border-white/5 flex flex-col gap-6 items-center">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest leading-none">
                            <span className="text-slate-500">Zaten hesabın var mı?</span>
                            <Link href="/auth/login" className="text-primary hover:underline">
                                Giriş Yap
                            </Link>
                        </div>
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-400 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 border-indigo-500/20 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5" />
                            +100 BONUS COIN KAZAN!
                        </div>
                    </div>
                </div>
            </AuthCard>
        </HeroGeometric>
    );
}
