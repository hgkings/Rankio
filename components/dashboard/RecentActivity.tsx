import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, ZapOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function RecentActivity() {
    return (
        <Card className="border-2 border-slate-200/60 dark:border-white/5 shadow-sm rounded-3xl h-full flex flex-col bg-white dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center gap-3 pb-6">
                <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600">
                    <History className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Son Hareketlerin</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-300 dark:text-slate-600">
                    <ZapOff className="w-8 h-8" />
                </div>
                <p className="text-sm text-slate-500 font-bold italic font-serif">Henüz bir aktiviten yok.</p>
            </CardContent>
        </Card>
    );
}
