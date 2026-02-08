import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DailyWheelBanner() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white shadow-xl group">
            {/* Decorative Background Elements */}
            <div className="absolute -right-10 -top-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
                <Sparkles className="h-64 w-64" />
            </div>
            <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-4 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border border-white/20">
                        <Sparkles className="h-3 w-3" />
                        Günlük Şans Çarkı
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black tracking-tight leading-none uppercase">
                            Şansını <span className="text-yellow-300 italic font-serif">Çevir!</span>
                        </h2>
                        <p className="max-w-md text-white/80 font-medium text-lg italic font-serif leading-relaxed">
                            Her gün bedava puan ve coin kazanma fırsatı seni bekliyor. <br />
                            <span className="text-white">Bugünkü ödülünü daha almadın!</span>
                        </p>
                    </div>
                </div>

                <Link href="/app/wheel" passHref>
                    <Button className="h-16 rounded-2xl bg-white px-10 text-xl font-black text-indigo-600 shadow-2xl hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all group/btn">
                        Şimdi Çevir
                        <ArrowRight className="ml-3 h-6 w-6 group-hover/btn:translate-x-2 transition-transform" />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
