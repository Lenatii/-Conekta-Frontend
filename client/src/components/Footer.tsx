import { Link } from "wouter";

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
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>📧 hello@conekta.africa</li>
              <li>📱 +254 797 446 155</li>
              <li>📍 Nakuru • Nairobi</li>
            </ul>
            <div className="mt-4 flex space-x-4">
              <a
                href="https://wa.me/254797446155"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80 transition-opacity"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CONEKTA Africa. All rights reserved.</p>
          <p className="mt-2 text-xs">
            🔒 Secure M-Pesa Payments • ✓ UBARU Verified • 🇰🇪 Made in Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
