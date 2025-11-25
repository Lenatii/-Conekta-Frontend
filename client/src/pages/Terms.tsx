import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Streamdown } from "streamdown";

export default function TermsPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/TERMS_AND_CONDITIONS.md")
      .then((res) => res.text())
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Terms:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 py-12">
        <div className="container mx-auto max-w-4xl">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading Terms & Conditions...</p>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none">
              <Streamdown>{content}</Streamdown>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
