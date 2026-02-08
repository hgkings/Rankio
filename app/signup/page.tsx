"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();

            // Sign up user
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // Update profile with display name
                await supabase
                    .from("profiles")
                    .update({ display_name: displayName })
                    .eq("id", data.user.id);

                toast.success("Kayıt başarılı! Giriş yapabilirsiniz.");
                router.push("/login");
            }
        } catch (error: any) {
            toast.error(error.message || "Kayıt oluşturulamadı");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Rankio
                        </span>
                    </CardTitle>
                    <CardDescription className="text-center">
                        Yeni hesap oluşturun
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">İsim</Label>
                            <Input
                                id="displayName"
                                type="text"
                                placeholder="Adınız Soyadınız"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="En az 6 karakter"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            disabled={loading}
                        >
                            {loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
                        </Button>
                        <p className="text-sm text-center text-slate-600 dark:text-slate-400">
                            Zaten hesabınız var mı?{" "}
                            <Link href="/login" className="text-indigo-600 hover:underline">
                                Giriş yapın
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
