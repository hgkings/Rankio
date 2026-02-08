import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    className?: string;
    iconClassName?: string;
}

export function StatsCard({
    label,
    value,
    icon: Icon,
    trend,
    className,
    iconClassName,
}: StatsCardProps) {
    return (
        <Card className={cn("overflow-hidden border-2 border-slate-200/60 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 bg-white dark:bg-slate-900/50 backdrop-blur-sm group", className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className={cn("p-3 rounded-2xl bg-slate-100 dark:bg-white/5 transition-colors group-hover:scale-110 duration-500", iconClassName)}>
                        <Icon className="w-6 h-6" />
                    </div>
                    {trend && (
                        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold text-[10px] tracking-tight">
                            {trend}
                        </Badge>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{label}</p>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tighter tabular-nums">
                        {value}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );
}
