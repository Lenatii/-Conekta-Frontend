import { useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, Home as HomeIcon, Wrench, Hotel, Shield, ArrowRight, 
  MessageCircle, Sparkles, Bot, ShieldCheck, Bed
} from "lucide-react";
import MamaDennisChatWidget from "@/components/MamaDennisChatWidget";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const whatsappNumber = "+254797446155";
  const whatsappMessage = "Hi, I'm interested in CONEKTA";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="fade-in-up">
              {/* Mama Dennis AI Badge - Clickable for future standalone UI */}
              <button
                onClick={() => {
                  // TODO: Link to Mama Dennis standalone UI when available
                  // For now, just show a message
                  alert('Mama Dennis standalone UI coming soon! For now, use the chat widget.');
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/16 text-sm text-slate-200 mb-6 hover:border-teal-400/50 hover:bg-teal-500/10 transition-all cursor-pointer"
                style={{background: 'linear-gradient(90deg, rgba(124,92,255,.25), rgba(0,224,184,.25))'}}
              >
                <Sparkles className="w-4 h-4" />
                <span>Powered by Mama Dennis AI</span>
              </button>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
                Your Digital OS for <span className="gradient-text">Rent • Services • Trust</span>
              </h1>
              
              <p className="text-slate-300 text-lg lg:text-xl leading-relaxed max-w-2xl mb-8">
                Find verified homes, hire trusted fundis, get UBARU certified, and book short-stays — all in one platform. Built for Kenya & Africa with automation, accountability, and heart.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <a href="#modules">
                  <Button size="lg" className="rounded-xl px-6 py-4 text-lg font-bold text-black" style={{background: 'linear-gradient(90deg,#c9c5ff,#9ef7e8)'}}>
                    Explore Modules
                  </Button>
                </a>
                <a href="/signup">
                  <Button size="lg" variant="outline" className="rounded-xl px-6 py-4 glass text-white font-semibold text-lg border-white/12">
                    Get Started
                  </Button>
                </a>
              </div>
              
              {/* Trust Badges */}
              <div className="flex items-center gap-3 text-sm text-slate-400 flex-wrap">
                <div className="border border-white/12 rounded-full px-4 py-2 hover:bg-white/10 transition cursor-pointer">
                  🛡️ Conekta-Pay • UBARU Certified
                </div>
                <div 
                  className="border border-white/12 rounded-full px-4 py-2 hover:bg-white/10 transition cursor-pointer relative group"
                  onClick={() => {
                    const chatButton = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                    if (chatButton) chatButton.click();
                  }}
                >
                  💬 WhatsApp First
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                    Coming soon! Use web chat
                  </span>
                </div>
                <div className="border border-white/12 rounded-full px-4 py-2 hover:bg-white/10 transition cursor-pointer">
                  📱 M-Pesa Ready
                </div>
              </div>
            </div>
            
            {/* Right: Module Preview Cards */}
            <div className="glass rounded-3xl p-8 float-animation" style={{position: 'relative', overflow: 'hidden'}}>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/properties">
                  <div className="rounded-2xl p-6 border border-green-500/40 hover:border-green-500/80 hover:shadow-lg hover:shadow-green-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative" style={{background: 'linear-gradient(135deg, rgba(34,197,94,.15), rgba(34,197,94,.05))'}}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(circle at top right, rgba(34,197,94,.1), transparent)'}}></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg">CONEKTA Rentals</h4>
                        <HomeIcon className="w-6 h-6 text-green-400" />
                      </div>
                      <p className="text-sm text-slate-300">Verified rentals with 360° tours</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/fundis">
                  <div className="rounded-2xl p-6 border border-teal-500/40 hover:border-teal-500/80 hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative" style={{background: 'linear-gradient(135deg, rgba(20,184,166,.15), rgba(20,184,166,.05))'}}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(circle at top right, rgba(20,184,166,.1), transparent)'}}></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg">CONEKTA Fundis</h4>
                        <Wrench className="w-6 h-6 text-teal-400" />
                      </div>
                      <p className="text-sm text-slate-300">Hire vetted fundis safely</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/verify">
                  <div className="rounded-2xl p-6 border border-purple-500/40 hover:border-purple-500/80 hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative" style={{background: 'linear-gradient(135deg, rgba(168,85,247,.15), rgba(168,85,247,.05))'}}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(circle at top right, rgba(168,85,247,.1), transparent)'}}></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg">CONEKTA Trust</h4>
                        <ShieldCheck className="w-6 h-6 text-purple-400" />
                      </div>
                      <p className="text-sm text-slate-300">Trust certification system</p>
                    </div>
                  </div>
                </Link>
                
                <Link href="/stays">
                  <div className="rounded-2xl p-6 border border-orange-500/40 hover:border-orange-500/80 hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group overflow-hidden relative" style={{background: 'linear-gradient(135deg, rgba(249,115,22,.15), rgba(249,115,22,.05))'}}>
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'radial-gradient(circle at top right, rgba(249,115,22,.1), transparent)'}}></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-lg">CONEKTA Stays</h4>
                        <Bed className="w-6 h-6 text-orange-400" />
                      </div>
                      <p className="text-sm text-slate-300">Host & book stays easily</p>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="mt-6 p-4 rounded-xl border border-white/10" style={{background: 'linear-gradient(90deg, rgba(124,92,255,.2), rgba(0,224,184,.2))'}}>
                <div className="flex items-center gap-3">
                  <Bot className="w-8 h-8 text-teal-400" />
                  <div>
                    <p className="font-bold text-white">Mama Dennis AI</p>
                    <p className="text-sm text-slate-300">Your Digital Guardian & CTO</p>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="py-20 border-t border-white/10">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">How it works</h2>
            <p className="text-slate-300 text-lg">Simple steps from discovery to done — in chat or on web.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num: "1", title: "Discover", desc: "Browse rentals & services or say 'Hi' on WhatsApp" },
              { num: "2", title: "Verify", desc: "CONEKTA Trust checks owners & providers. See the badge." },
              { num: "3", title: "Book & Pay", desc: "Secure Conekta-Pay with M-Pesa. Funds on completion." },
              { num: "4", title: "Rate & Grow", desc: "Reviews build reputation. AI learns & optimizes." }
            ].map((step) => (
              <div key={step.num} className="glass rounded-2xl p-8 text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{background: 'linear-gradient(135deg,#7c5cff,#00e0b8)'}}>
                  <span className="font-bold text-2xl">{step.num}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODULES SECTION */}
      <section id="modules" className="py-20 border-t border-white/10">
        <div className="container mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4">All Modules Under One Roof</h2>
            <p className="text-slate-300 text-lg">Your complete Digital OS for rent, services, trust, and stays.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CONEKTA Rentals */}
            <Link href="/properties">
              <Card className="glass rounded-2xl border-white/10 module-card overflow-hidden group cursor-pointer h-[400px] relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url(/module-rentconnect.jpg)'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                <CardContent className="p-6 flex flex-col relative z-10 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">CONEKTA Rentals</h3>
                    <HomeIcon className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-sm text-slate-200 mb-4 flex-grow">
                    Browse verified property listings with 360° virtual tours, secure applications, and digital lease agreements.
                  </p>
                  <div className="text-xs text-slate-300 mb-4 p-3 rounded-lg bg-black/30 backdrop-blur-sm">
                    ✓ 5% commission<br/>
                    ✓ Virtual tours<br/>
                    ✓ Conekta-Pay protection
                  </div>
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold bg-black/40 hover:bg-black/60 transition">
                    <span>Explore Properties</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            {/* CONEKTA Fundis */}
            <Link href="/fundis">
              <Card className="glass rounded-2xl border-white/10 module-card overflow-hidden group cursor-pointer h-[400px] relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url(/module-kaziflow.jpg)'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                <CardContent className="p-6 flex flex-col relative z-10 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">CONEKTA Fundis</h3>
                    <Wrench className="w-8 h-8 text-teal-400" />
                  </div>
                  <p className="text-sm text-slate-200 mb-4 flex-grow">
                    Hire vetted service providers (fundis) with confidence. Pay safely through Conekta-Pay and rate their work.
                  </p>
                  <div className="text-xs text-slate-300 mb-4 p-3 rounded-lg bg-black/30 backdrop-blur-sm">
                    ✓ Background checks<br/>
                    ✓ Conekta-Pay payments<br/>
                    ✓ Rating system
                  </div>
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold bg-black/40 hover:bg-black/60 transition">
                    <span>Find Fundis</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            {/* UBARU */}
            <Link href="/verify">
              <Card className="glass rounded-2xl border-white/10 module-card overflow-hidden group cursor-pointer h-[400px] relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url(/module-ubaru.jpg)'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                <CardContent className="p-6 flex flex-col relative z-10 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">CONEKTA Trust</h3>
                    <ShieldCheck className="w-8 h-8 text-purple-400" />
                  </div>
                  <p className="text-sm text-slate-200 mb-4 flex-grow">
                    Trust certification system that verifies landlords, tenants, and service providers to reduce fraud.
                  </p>
                  <div className="text-xs text-slate-300 mb-4 p-3 rounded-lg bg-black/30 backdrop-blur-sm">
                    ✓ KYC verification<br/>
                    ✓ Background checks<br/>
                    ✓ Trust scores
                  </div>
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold bg-black/40 hover:bg-black/60 transition">
                    <span>Get Certified</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
            {/* Short-Stay */}
            <Link href="/stays">
              <Card className="glass rounded-2xl border-white/10 module-card overflow-hidden group cursor-pointer h-[400px] relative">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{backgroundImage: 'url(/module-shortstay.jpg)'}}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
                <CardContent className="p-6 flex flex-col relative z-10 h-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">CONEKTA Stays</h3>
                    <Bed className="w-8 h-8 text-teal-400" />
                  </div>
                  <p className="text-sm text-slate-200 mb-4 flex-grow">
                    Host your space or book verified short-term stays with secure payments and instant confirmations.
                  </p>
                  <div className="text-xs text-slate-300 mb-4 p-3 rounded-lg bg-black/30 backdrop-blur-sm">
                    ✓ Instant booking<br/>
                    ✓ Host protection<br/>
                    ✓ Flexible stays
                  </div>
                  <Button variant="ghost" className="mt-auto w-full justify-center gap-2 text-teal-400 hover:text-white font-semibold bg-black/40 hover:bg-black/60 transition">
                    <span>Book Stays</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
            
          </div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="glass rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold mb-2">Ready to get started?</h3>
              <p className="text-slate-300 text-lg">Let Mama Dennis guide you. Quick, human, effective.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative group">
                <Button 
                  size="lg" 
                  className="rounded-xl px-6 py-4 text-lg font-bold text-white inline-flex items-center gap-2" 
                  style={{background: '#25D366'}}
                  onClick={() => {
                    const chatButton = document.querySelector('[data-chat-toggle]') as HTMLButtonElement;
                    if (chatButton) chatButton.click();
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </Button>
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                  Coming soon! Use web chat
                </span>
              </div>
              <a href="mailto:hello@conekta.africa">
                <Button size="lg" variant="outline" className="rounded-xl px-6 py-4 glass text-white font-semibold text-lg border-white/12">
                  Contact Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MamaDennisChatWidget />
    </div>
  );
}
