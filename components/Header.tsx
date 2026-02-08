"use client";

import { Bell, Search, User, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Header() {
    const handleFeatureNotice = () => {
        toast.info("Bu özellik yakında aktif olacak! 🔥");
    };
    return (
        <header className="h-20 bg-background border-b-2 border-foreground px-8 flex items-center justify-between sticky top-0 z-40">
            {/* Search Bar */}
            <div className="relative w-96 group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none group-focus-within:text-foreground transition-colors">
                    <Search className="w-5 h-5 text-foreground/40" />
                </div>
                <input
                    type="text"
                    placeholder="İçerik üreticisi veya görev ara..."
                    className="w-full bg-white border-2 border-foreground rounded-xl py-2.5 pl-12 pr-4 text-sm focus:bg-white transition-all outline-none shadow-[2px_2px_0px_0px_rgba(11,18,21,1)] focus:shadow-none focus:translate-x-[1px] focus:translate-y-[1px]"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-6">

                {/* Pro Badge */}
                <div className="hidden lg:flex items-center gap-2 bg-primary border-2 border-foreground text-foreground px-4 py-2 rounded-xl text-[10px] font-black shadow-[3px_3px_0px_0px_rgba(11,18,21,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-default uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    FREE HESAP
                </div>

                {/* Notifications */}
                <div className="relative group">
                    <Button
                        onClick={handleFeatureNotice}
                        variant="ghost"
                        size="icon"
                        className="w-12 h-12 rounded-xl border-2 border-transparent hover:border-foreground transition-all"
                    >
                        <Bell className="w-6 h-6 text-foreground" />
                        <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-foreground rounded-full" />
                    </Button>
                </div>

                {/* User Profile */}
                <div
                    onClick={() => toast.success("Profil ayarlarına yönlendiriliyorsunuz...")}
                    className="flex items-center gap-3 pl-6 border-l-2 border-foreground/10 group cursor-pointer"
                >
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-foreground group-hover:underline transition-colors uppercase tracking-widest leading-none mb-1">
                            Hesabım
                        </p>
                        <p className="text-[9px] font-bold text-foreground/40 italic font-serif">
                            Giriş Yapıldı
                        </p>
                    </div>
                    <Avatar className="w-11 h-11 rounded-xl border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(11,18,21,1)] group-hover:scale-105 transition-all">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-foreground font-black text-xs">
                            RK
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
}
