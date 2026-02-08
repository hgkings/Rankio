'use client';
import { cn } from '@/lib/utils';
import React from 'react';

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
}

export function ShinyText({
    text,
    disabled = false,
    speed = 5,
    className,
}: ShinyTextProps) {
    const animationDuration = `${speed}s`;

    return (
        <div
            className={cn(
                'inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-white/40 to-white bg-[length:200%_100%]',
                !disabled && 'animate-shiny-text',
                className
            )}
            style={{ animationDuration }}
        >
            {text}
        </div>
    );
}
