import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <img src="/conekta-logo.png" alt="CONEKTA Africa" className="h-16 w-auto" />
              <div className="text-xl font-bold hidden sm:block">
                <span className="text-primary">CONEKTA</span>
                <span className="text-muted-foreground text-sm ml-2">Africa</span>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Social Media Icons */}
            <div className="flex items-center space-x-3 mr-2">
              <a href="https://facebook.com/conektaafrica" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="https://instagram.com/conektaafrica" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://twitter.com/conektaafrica" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com/company/conektaafrica" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <div className="h-6 w-px bg-border" />
            <Link href="/properties">
              <a className="text-foreground/80 hover:text-primary transition-colors">
                Properties
              </a>
            </Link>
            <Link href="/fundis">
              <a className="text-foreground/80 hover:text-primary transition-colors">
                Fundis
              </a>
            </Link>
            <Link href="/stays">
              <a className="text-foreground/80 hover:text-primary transition-colors">
                Short-Stay
              </a>
            </Link>
            <Link href="/verify">
              <a className="text-foreground/80 hover:text-primary transition-colors">
                UBARU
              </a>
            </Link>
          </div>

          {/* WhatsApp Chat Button */}
          <a 
            href="https://wa.me/254797446155?text=Hi, I need help with CONEKTA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:block"
          >
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-[#7c5cff] to-[#00e0b8] hover:opacity-90 transition-opacity"
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp Chat
            </Button>
          </a>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <a className="text-foreground/80 hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => logout()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </a>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border/50">
            <Link href="/properties">
              <a className="block py-2 text-foreground/80 hover:text-primary transition-colors">
                Properties
              </a>
            </Link>
            <Link href="/fundis">
              <a className="block py-2 text-foreground/80 hover:text-primary transition-colors">
                Fundis
              </a>
            </Link>
            <Link href="/stays">
              <a className="block py-2 text-foreground/80 hover:text-primary transition-colors">
                Short-Stay
              </a>
            </Link>
            <Link href="/verify">
              <a className="block py-2 text-foreground/80 hover:text-primary transition-colors">
                UBARU
              </a>
            </Link>
            <div className="pt-4 border-t border-border/50 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()} className="block">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </a>
                  <Link href="/register">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
