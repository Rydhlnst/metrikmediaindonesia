import { SITE_CONFIG } from "@/lib/constants";

interface JsonLdProps {
  type: "website" | "article" | "organization";
  data?: Record<string, unknown>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  let jsonLd: Record<string, unknown> = {};

  if (type === "website") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      description: SITE_CONFIG.description,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_CONFIG.url}/pencarian?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
      ...data,
    };
  }

  if (type === "organization") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsMediaOrganization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/metrikmedialogo.png`,
      sameAs: [
        "https://facebook.com/metrikmediaid",
        "https://twitter.com/metrikmediaid",
        "https://instagram.com/metrikmediaid",
        "https://youtube.com/@metrikmediaid",
      ],
      ...data,
    };
  }

  if (type === "article") {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      publisher: {
        "@type": "NewsMediaOrganization",
        name: SITE_CONFIG.name,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_CONFIG.url}/metrikmedialogo.png`,
        },
      },
      ...data,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function WebsiteJsonLd() {
  return <JsonLd type="website" />;
}

export function OrganizationJsonLd() {
  return <JsonLd type="organization" />;
}

export function ArticleJsonLd({
  title,
  description,
  image,
  datePublished,
  dateModified,
  author,
  slug,
  category,
}: {
  title: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  slug: string;
  category: string;
}) {
  return (
    <JsonLd
      type="article"
      data={{
        headline: title,
        description,
        image,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
          "@type": "Person",
          name: author,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_CONFIG.url}/${category}/${slug}`,
        },
        articleSection: category,
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
