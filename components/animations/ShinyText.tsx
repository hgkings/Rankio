"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ShinyTextProps {
    text: string;
    disabled?: boolean;
    speed?: number;
    className?: string;
    color?: string;
}

export const ShinyText = ({
    text,
    disabled = false,
    speed = 2,
    className = "",
    color = "#B4B4B4"
}: ShinyTextProps) => {
    if (disabled) return <span className={className}>{text}</span>;

    return (
        <span
            className={`relative inline-block overflow-hidden ${className}`}
            style={{ color }}
        >
            {text}
            <motion.span
                className="absolute top-0 left-0 w-full h-full block"
                style={{
                    background: "linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)",
                    backgroundSize: "200% 100%",
                }}
                animate={{
                    backgroundPosition: ["200% 0", "-200% 0"],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 1,
                }}
            />
        </span>
    );
};
