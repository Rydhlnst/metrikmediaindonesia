import { SITE_CONFIG } from "./constants";

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noindex?: boolean;
}

export function generateMetadata({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  publishedTime,
  modifiedTime,
  authors,
  noindex = false,
}: SEOProps) {
  const fullTitle = title
    ? `${title} - ${SITE_CONFIG.name}`
    : `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`;
  const metaDescription = description || SITE_CONFIG.description;
  const canonicalUrl = canonical || SITE_CONFIG.url;
  const image = ogImage || `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`;

  return {
    title: fullTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
      },
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.name,
        },
      ],
      type: ogType,
      ...(ogType === "article" && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [image],
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export function generateNewsArticleSchema(article: {
  headline: string;
  description: string;
  url: string;
  imageUrl?: string;
  datePublished: string;
  dateModified?: string;
  authorName: string;
  authorUrl?: string;
  publisherName?: string;
  publisherLogo?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": article.url,
    },
    headline: article.headline,
    description: article.description,
    image: article.imageUrl ? [article.imageUrl] : [`${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`],
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      "@type": "Person",
      name: article.authorName,
      ...(article.authorUrl && { url: article.authorUrl }),
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: article.publisherName || SITE_CONFIG.company,
      url: SITE_CONFIG.url,
      logo: {
        "@type": "ImageObject",
        url: article.publisherLogo || `${SITE_CONFIG.url}/logo.png`,
      },
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.company,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    sameAs: [
      "https://facebook.com/metrikmediaid",
      "https://twitter.com/metrikmediaid",
      "https://instagram.com/metrikmediaid",
      "https://youtube.com/@metrikmediaid",
    ],
  };
}
