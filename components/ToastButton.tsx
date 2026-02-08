"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { toast } from "sonner";
import { type VariantProps } from "class-variance-authority";

interface ToastButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    message: string;
    toastType?: "success" | "info" | "warning" | "error";
    children: React.ReactNode;
}

export function ToastButton({
    message,
    toastType = "info",
    children,
    variant,
    size,
    className,
    ...props
}: ToastButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        // If the button has a custom onClick from props, call it too
        if (props.onClick) props.onClick(e);

        // Trigger toast
        switch (toastType) {
            case "success":
                toast.success(message);
                break;
            case "warning":
                toast.warning(message);
                break;
            case "error":
                toast.error(message);
                break;
            case "info":
            default:
                toast.info(message);
                break;
        }
    };

    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            {...props}
            onClick={handleClick}
        >
            {children}
        </Button>
    );
}
