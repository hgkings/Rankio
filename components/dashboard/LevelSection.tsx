import React from "react";
import { Progress } from "@/components/ui/progress";
import { Zap, Flame, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LevelSectionProps {
    currentLevel?: number;
    currentXP?: number;
    maxXP?: number;
}

export function LevelSection({
    currentLevel = 1,
    currentXP = 340,
    maxXP = 1000,
}: LevelSectionProps) {
    const progress = (currentXP / maxXP) * 100;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-card border-2 border-white/5 rounded-3xl shadow-xl">
            <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg rotate-3">
                    <Trophy className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-slate-900 text-xs font-black px-2 py-0.5 rounded-lg border-2 border-slate-900 shadow-md">
                    LVL {currentLevel}
                </div>
            </div>

            <div className="flex-1 w-full space-y-3">
                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <h4 className="text-sm font-black uppercase text-slate-500 tracking-widest">Gelişim Durumu</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-white">{currentXP} XP</span>
                            <span className="text-slate-500 font-bold">/ {maxXP} XP</span>
                        </div>
                    </div>
                    <Badge variant="outline" className="h-8 border-2 border-white/5 rounded-xl px-3 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-400">
                        <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                        0 Günlük Seri
                    </Badge>
                </div>
                <Progress value={progress} className="h-3 rounded-full bg-white/5" indicatorClassName="bg-primary rounded-full" />
            </div>
        </div>
    );
}
