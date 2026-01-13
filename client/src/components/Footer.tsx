import { Link } from "wouter";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Linkedin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card mt-auto">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold">
              <span className="text-primary">CONEKTA</span>
              <span className="text-muted-foreground text-sm ml-2">Africa</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your Digital OS for Rent • Services • Trust
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by Mama Dennis AI
            </p>
          </div>

          {/* Modules */}
          <div>
            <h3 className="font-semibold mb-4">Modules</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    RentConnect
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/fundis">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    KaziFlow
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/stays">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Short-Stay
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/verify">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    UBARU
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://www.conekta.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Terms & Conditions
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@conekta.africa"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:hello@conekta.africa" className="hover:text-primary transition">hello@conekta.africa</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+254797446155" className="hover:text-primary transition">+254 797 446 155</a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Nakuru • Nairobi</span>
              </li>
              <li className="mt-2">
                <a 
                  href="https://wa.me/254797446155?text=Hi%2C%20I%20need%20help%20with%20CONEKTA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white hover:opacity-90 transition"
                  style={{background: '#25D366'}}
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
            
            {/* Social Media Icons */}
            <div className="flex gap-3 mt-6">
              <a 
                href="https://facebook.com/Conekta" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a 
                href="https://instagram.com/conektaafrica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a 
                href="https://twitter.com/conektaafrica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
              <a 
                href="https://linkedin.com/company/conektaafrica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-accent hover:border-primary transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} <strong>Conekta Technologies</strong> (trading as CONEKTA Africa). All rights reserved.</p>
          <p className="mt-2 text-xs">
            🔒 Secure M-Pesa Payments • ✓ UBARU Verified • 🇰🇪 Made in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
