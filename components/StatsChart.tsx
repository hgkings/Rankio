"use client";

interface StatsChartProps {
    title: string;
    data: number[];
    labels: string[];
}

export default function StatsChart({ title, data, labels }: StatsChartProps) {
    const maxValue = Math.max(...data);

    return (
        <div className="glass rounded-xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                {title}
            </h3>

            <div className="flex items-end justify-between gap-2 h-48">
                {data.map((value, index) => {
                    const height = (value / maxValue) * 100;

                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full flex items-end justify-center h-40">
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg transition-all duration-500 hover:scale-105 cursor-pointer shadow-lg hover:shadow-indigo-500/50"
                                    style={{ height: `${height}%` }}
                                    title={`${labels[index]}: ${value}`}
                                />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                {labels[index]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
