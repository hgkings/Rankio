import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SpecialMissions() {
    return (
        <Card className="border-2 border-slate-200/60 dark:border-white/5 shadow-sm rounded-3xl h-full flex flex-col bg-white dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600">
                        <Target className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight">Sana Özel Görevler</CardTitle>
                </div>
                <Link href="/app/missions" className="text-xs font-black text-indigo-600 hover:underline uppercase tracking-widest">
                    Tümünü Gör
                </Link>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600">
                    <Search className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">Yeni görev bulunamadı</p>
                    <p className="text-sm text-slate-500 font-medium italic font-serif">Takip ettiğin içerik üreticilerini kontrol et veya yeni içerik üreticileri keşfet.</p>
                </div>
                <Link href="/app/missions">
                    <Button variant="outline" className="border-2 border-slate-200 dark:border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest h-12 px-6">
                        Görev Kesfet <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
