"use client";

import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { User, Video, ArrowRight, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { ShinyText } from "@/components/ui/shiny-text";

export default function AuthRolePage() {
    return (
        <HeroGeometric>
            <AuthCard className="max-w-2xl">
                <div className="space-y-12">
                    <div className="text-center space-y-6">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-primary rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-primary/20 rotate-3 animate-bounce-slow">
                                <Zap className="w-10 h-10 fill-white" />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-5xl font-black tracking-tighter text-white uppercase leading-none">
                                <ShinyText text="Rankio'ya" className="block" />
                                <span className="text-primary italic">Hoş Geldin!</span>
                            </h1>
                            <p className="text-slate-400 font-bold text-lg italic font-serif">
                                Macerana nasıl devam etmek istersin?
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Fan Option */}
                        <Link href="/auth/register-fan" className="group/card">
                            <div className="relative p-8 rounded-3xl border-2 border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-500 h-full flex flex-col text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover/card:scale-110 transition-transform">
                                    <User className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Kullanıcı (Fan)</h3>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                        Favori içerik üreticilerini takip et, görevleri tamamla ve ödüller kazan.
                                    </p>
                                </div>
                                <div className="pt-4 mt-auto">
                                    <span className="inline-flex items-center gap-2 text-indigo-400 font-black text-xs uppercase tracking-widest group-hover/card:translate-x-2 transition-transform">
                                        Seç ve Devam Et <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Creator Option */}
                        <Link href="/auth/register-creator" className="group/card">
                            <div className="relative p-8 rounded-3xl border-2 border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-500 h-full flex flex-col text-center space-y-4">
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary group-hover/card:scale-110 transition-transform">
                                    <Video className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">İçerik Üreticisi</h3>
                                    <p className="text-slate-400 font-medium text-sm leading-relaxed">
                                        Kendi topluluğunu kur, görevler oluştur ve takipçilerinle etkileşime gir.
                                    </p>
                                </div>
                                <div className="pt-4 mt-auto">
                                    <span className="inline-flex items-center gap-2 text-primary font-black text-xs uppercase tracking-widest group-hover/card:translate-x-2 transition-transform">
                                        Stüdyonu Kur <ArrowRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                            Zaten bir hesabın var mı?
                        </p>
                        <Link href="/auth/login" passHref>
                            <Button variant="outline" className="h-14 rounded-2xl border-2 border-white/10 px-10 font-black text-xs uppercase tracking-widest hover:bg-white/5 transition-all">
                                Giriş Yap
                            </Button>
                        </Link>
                    </div>
                </div>
            </AuthCard>
        </HeroGeometric>
    );
}
