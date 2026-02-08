import { ReactNode } from "react";

interface DashboardCardProps {
    title: string;
    value: string;
    trend?: string;
    icon: ReactNode;
    gradient: string;
}

export function DashboardCard({ title, value, trend, icon, gradient }: DashboardCardProps) {
    // Map existing gradients to solid Basecamp colors where possible
    const iconBg = gradient.includes("amber") ? "bg-primary" : gradient.includes("blue") ? "bg-blue-200" : gradient.includes("purple") ? "bg-yellow-200" : "bg-primary";

    return (
        <div className="basecamp-card p-6 h-full flex flex-col justify-between group cursor-default relative overflow-hidden">
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 w-full h-1 ${iconBg === 'bg-primary' ? 'bg-primary' : 'bg-foreground/20'}`} />

            <div className="flex items-start justify-between relative z-10 pt-2">
                <div className={`p-3 rounded-xl border-2 border-foreground ${iconBg} shadow-[2px_2px_0px_0px_rgba(11,18,21,1)] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all`}>
                    {icon}
                </div>
                {trend && (
                    <div className="flex items-center gap-1 bg-foreground text-background text-[10px] font-black px-2 py-0.5 rounded border border-foreground uppercase tracking-widest">
                        {trend}
                    </div>
                )}
            </div>

            <div className="mt-8 relative z-10">
                <h3 className="text-foreground/60 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-4xl font-black text-foreground tracking-tighter tabular-nums mb-1">
                        {value}
                    </span>
                </div>
            </div>
        </div>
    );
}
