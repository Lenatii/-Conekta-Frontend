import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({
  title = "CONEKTA Africa - Rent • Services • Trust",
  description = "Find verified rental properties, trusted fundis, and short-stay accommodations in Kenya. Powered by Mama Dennis AI. Secure M-Pesa payments, UBARU verified listings.",
  keywords = "rental properties Kenya, apartments Nakuru, bedsitter Nairobi, fundis Kenya, short stay Kenya, UBARU verification, M-Pesa payments, property rental, accommodation Kenya",
  image = "https://www.conekta.co.ke/og-image.jpg",
  url = "https://www.conekta.co.ke",
  type = "website"
}: SEOProps) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="CONEKTA Africa" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="CONEKTA Africa" />
      
      {/* Geo Tags for Kenya Local SEO */}
      <meta name="geo.region" content="KE" />
      <meta name="geo.placename" content="Kenya" />
      <meta name="geo.position" content="-0.3031;36.0800" />
      <meta name="ICBM" content="-0.3031, 36.0800" />
      <meta name="DC.title" content={title} />
      
      {/* Local Business Tags */}
      <meta name="coverage" content="Kenya" />
      <meta name="distribution" content="global" />
      <meta name="target" content="Kenya, Nakuru, Nairobi, Mombasa, Kisumu" />
      <meta name="city" content="Nakuru" />
      <meta name="country" content="Kenya" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data - Organization */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "CONEKTA Africa",
          "description": description,
          "url": url,
          "logo": "https://www.conekta.co.ke/logo.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+254-797-446-155",
            "contactType": "Customer Service",
            "areaServed": "KE",
            "availableLanguage": ["English", "Swahili"]
          },
          "sameAs": [
            "https://www.facebook.com/profile.php?id=61583476898763",
            "https://instagram.com/conektaafrica",
            "https://twitter.com/conektaafrica",
            "https://linkedin.com/company/conektaafrica"
          ],
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Nakuru",
            "addressRegion": "Rift Valley",
            "addressCountry": "KE"
          }
        })}
      </script>
      
      {/* Structured Data - Local Business */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "CONEKTA Africa",
          "image": "https://www.conekta.co.ke/logo.png",
          "@id": url,
          "url": url,
          "telephone": "+254797446155",
          "priceRange": "KES 5000 - 50000",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Nakuru CBD",
            "addressLocality": "Nakuru",
            "addressRegion": "Rift Valley",
            "postalCode": "20100",
            "addressCountry": "KE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -0.3031,
            "longitude": 36.0800
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "00:00",
            "closes": "23:59"
          },
          "sameAs": [
            "https://www.facebook.com/profile.php?id=61583476898763",
            "https://instagram.com/conektaafrica",
            "https://twitter.com/conektaafrica",
            "https://linkedin.com/company/conektaafrica"
          ]
        })}
      </script>
      
      {/* Structured Data - WebSite with SearchAction */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "CONEKTA Africa",
          "url": url,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://www.conekta.co.ke/properties?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
    </Helmet>
  );
}
