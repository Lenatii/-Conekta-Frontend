import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
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
            <a className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="text-2xl font-bold">
                <span className="text-primary">CONEKTA</span>
                <span className="text-muted-foreground text-sm ml-2">Africa</span>
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
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
