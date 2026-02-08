import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Zap, Trophy, TrendingUp, ArrowRight, Star, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dashboard selection:bg-primary/20 overflow-x-hidden text-foreground relative">

      {/* Navigation */}
      <nav className="h-24 flex items-center justify-between px-8 max-w-7xl mx-auto border-b-2 border-foreground sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary border-2 border-foreground rounded-xl flex items-center justify-center shadow-basecamp">
            <Zap className="w-6 h-6 fill-foreground" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">
            RANKIO
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest">Özellikler</Link>
          <Link href="#how-it-works" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest">Nasıl Çalışır?</Link>
          <Link href="#pricing" className="text-sm font-bold hover:text-primary transition-colors uppercase tracking-widest">Ücretlendirme</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="font-bold hover:bg-primary/20">Giriş Yap</Button>
          </Link>
          <Link href="/auth/register">
            <button className="basecamp-button">Kayıt Ol</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section with Animated Background */}
      <div className="relative">
        <HeroGeometric>
          <div className="relative z-20 px-8 pt-24 pb-32 max-w-7xl mx-auto">
            <div className="text-center space-y-10">
              <div className="inline-flex items-center gap-2 bg-primary/20 border-2 border-foreground px-6 py-2 rounded-full font-black text-[10px] tracking-widest uppercase">
                <Sparkles className="w-4 h-4 text-foreground fill-foreground" />
                Eğlence ve Etkileşimin Yeni Hali
              </div>

              <h1 className="text-6xl md:text-8xl font-black leading-tight tracking-tighter text-white">
                İçerik Üreticilerinle <br />
                <span className="bg-primary px-4 border-2 border-foreground inline-block mt-2 shadow-basecamp">Etkileşime Geç,</span> Kazan!
              </h1>

              <p className="text-white/80 text-xl md:text-2xl max-w-3xl mx-auto font-bold leading-relaxed">
                Wrestling with engagement? <br />
                <span className="italic font-medium">It doesn't have to be this hard.</span> Rankio makes it simple, structured, and rewarding for both fans and creators.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12">
                <Link href="/auth/register">
                  <button className="basecamp-button text-xl px-12 py-4">
                    Hemen Başla <ArrowRight className="ml-2 w-6 h-6 inline" />
                  </button>
                </Link>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm" />
                    ))}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-black tracking-tight leading-none text-white">+10,000</p>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Aktif Kullanıcı</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </HeroGeometric>
      </div>

      {/* Feature Cards Section */}
      <section id="features" className="px-8 pb-32 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
        <FeatureCard
          icon={<Trophy className="w-8 h-8" />}
          title="Liderlik Tablosu"
          description="Sıralamada yükselerek özel rozetler ve topluluk içerisinde statü kazan."
          color="bg-blue-400"
        />
        <FeatureCard
          icon={<Star className="w-8 h-8" />}
          title="Özel Görevler"
          description="Sadece senin için hazırlanmış, etkileşim gücü yüksek özel görevleri tamamla."
          color="bg-yellow-400"
        />
        <FeatureCard
          icon={<TrendingUp className="w-8 h-8" />}
          title="Gerçek Ödüller"
          description="Biriktirdiğin puanları markette harca veya içerik üreticilerinin ödüllerine ulaş."
          color="bg-green-400"
        />
      </section>

      {/* Simplified Trust Section */}
      <section className="border-y-2 border-foreground py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-16 opacity-80">
          <div className="text-3xl font-black text-center border-r-2 border-foreground last:border-0 h-full flex items-center justify-center">TIKTOK</div>
          <div className="text-3xl font-black text-center border-r-2 border-foreground last:border-0 h-full flex items-center justify-center">INSTAGRAM</div>
          <div className="text-3xl font-black text-center border-r-2 border-foreground last:border-0 h-full flex items-center justify-center">YOUTUBE</div>
          <div className="text-3xl font-black text-center border-r-2 border-foreground last:border-0 h-full flex items-center justify-center">TWITCH</div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-8 text-center space-y-8 bg-background">
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-foreground text-background rounded-lg flex items-center justify-center text-xl font-black">R</div>
          <span className="text-2xl font-black tracking-tighter">RANKIO</span>
        </div>
        <div className="max-w-md mx-auto h-[2px] bg-foreground/10" />
        <p className="text-foreground/40 text-xs font-black uppercase tracking-[0.2em]">© 2024 Rankio Platform. Structured specifically for you.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) {
  return (
    <div className="basecamp-card p-12 space-y-8 group hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[8px_8px_0px_0px_rgba(11,18,21,1)]">
      <div className={`w-16 h-16 ${color} border-2 border-foreground rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(11,18,21,1)] group-hover:scale-110 transition-all duration-500`}>
        {icon}
      </div>
      <div className="space-y-4">
        <h3 className="text-3xl font-black tracking-tight">{title}</h3>
        <p className="text-foreground/70 font-bold leading-relaxed">{description}</p>
      </div>
      <div className="pt-4">
        <div className="inline-flex items-center gap-2 font-black text-sm uppercase tracking-widest border-b-2 border-foreground cursor-pointer hover:bg-primary/20 transition-colors">
          Detaylar <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}
