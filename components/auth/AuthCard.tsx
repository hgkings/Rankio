"use client";
import React, { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

export function AuthCard({
    children,
    className,
    spotlightColor = 'rgba(99, 102, 241, 0.15)'
}: AuthCardProps) {
    const divRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div className="relative group/auth-outer">
            {/* Glow behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-indigo-500 to-purple-600 rounded-[32px] blur-2xl opacity-10 group-hover/auth-outer:opacity-20 transition duration-1000" />

            <Card
                ref={divRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setOpacity(1)}
                onMouseLeave={() => setOpacity(0)}
                className={cn(
                    "relative w-full max-w-md border border-white/10 rounded-[32px] bg-card/80 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500",
                    className
                )}
            >
                {/* Spotlight Overlay */}
                <div
                    className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                    style={{
                        opacity,
                        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                    }}
                />

                {/* Soft Grain Overlay */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <CardContent className="p-8 md:p-12 relative z-10">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
