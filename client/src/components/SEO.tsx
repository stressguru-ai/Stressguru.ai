import { Helmet } from 'react-helmet-async';

interface FAQItem {
  question: string;
  answer: string;
}

interface HowToStep {
  name: string;
  text: string;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BlogArticle {
  url: string;
  headline: string;
  description: string;
  authorName: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  noindex?: boolean;
  // Structured data props
  includeOrganization?: boolean;
  includeSoftwareApp?: boolean;
  faqItems?: FAQItem[];
  howToSteps?: HowToStep[];
  breadcrumbs?: BreadcrumbItem[];
  blogArticle?: BlogArticle;
  customJsonLd?: object | object[];
}

const BASE_URL = 'https://stressguru.ai';

function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    "name": "StressGuru",
    "legalName": "DrNur AI, LLC",
    "url": BASE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${BASE_URL}/favicon.png`
    },
    "description": "StressGuru is an AI wellness app for iPhone and Apple Watch. It gives women practical guidance from AI wellness personas when work pressure, late-night thoughts, or a full calendar are crowding out rest.",
    "foundingDate": "2025",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@stressguru.ai",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://apps.apple.com/us/app/stressguru-ai/id6748682052"
    ]
  };
}

function getSoftwareAppSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    "@id": `${BASE_URL}/app#app`,
    "name": "StressGuru",
    "alternateName": "StressGuru AI",
    "operatingSystem": "iOS 16+, watchOS 9+",
    "applicationCategory": "HealthApplication",
    "description": "StressGuru is an iPhone and Apple Watch wellness app with 8 AI wellness personas, called Gurus. It offers practical guidance for everyday stress, rest, and wellness habits when pressure begins to take over your time.",
    "url": `${BASE_URL}/app`,
    "downloadUrl": "https://apps.apple.com/us/app/stressguru-ai/id6748682052",
    "publisher": { "@id": `${BASE_URL}/#organization` },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "8 specialized AI wellness personas, called Gurus",
      "Free Relief plan with Anxiety Guru access",
      "Apple Watch signals for wellness context only",
      "Personalized, practical wellness guidance",
      "Available anytime without scheduling"
    ]
  };
}

function getFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };
}

function getHowToSchema(steps: HowToStep[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get Everyday Wellness Guidance With StressGuru",
    "description": "When pressure starts to crowd out your focus or rest, use StressGuru to choose an AI wellness Guru and take one practical next step.",
    "step": steps.map((step, i) => ({
      "@type": "HowToStep",
      "position": i + 1,
      "name": step.name,
      "text": step.text
    }))
  };
}

function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
    }))
  };
}

function getBlogArticleSchema(article: BlogArticle) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.headline,
    "description": article.description,
    "author": {
      "@type": "Organization",
      "name": "StressGuru Editorial Team",
      "url": `${BASE_URL}/editorial-policy`
    },
    "contributor": article.authorName.endsWith("Guru") ? {
      "@type": "SoftwareApplication",
      "name": article.authorName,
      "applicationCategory": "HealthApplication"
    } : undefined,
    "publisher": {
      "@type": "Organization",
      "name": "StressGuru",
      "url": BASE_URL
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "image": article.image || `${BASE_URL}/images/og-stressguru.jpg`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    }
  };
}

const SEO = ({ 
  title, 
  description, 
  keywords = [], 
  canonicalUrl,
  ogImage = '/images/og-stressguru.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  includeOrganization = false,
  includeSoftwareApp = false,
  faqItems,
  howToSteps,
  breadcrumbs,
  blogArticle,
  customJsonLd
}: SEOProps) => {
  const fullTitle = title.includes('StressGuru') ? title : `${title} | StressGuru`;
  // Always use explicit canonicalUrl when provided; fall back to BASE_URL (not window.location.href)
  // to ensure crawlers get a consistent, clean canonical regardless of JS execution
  const currentUrl = canonicalUrl || BASE_URL;

  const schemas: object[] = [];
  if (includeOrganization) schemas.push(getOrganizationSchema());
  if (includeSoftwareApp) schemas.push(getSoftwareAppSchema());
  if (faqItems && faqItems.length > 0) schemas.push(getFAQSchema(faqItems));
  if (howToSteps && howToSteps.length > 0) schemas.push(getHowToSchema(howToSteps));
  if (breadcrumbs && breadcrumbs.length > 0) schemas.push(getBreadcrumbSchema(breadcrumbs));
  if (blogArticle) schemas.push(getBlogArticleSchema(blogArticle));
  if (customJsonLd) {
    if (Array.isArray(customJsonLd)) {
      schemas.push(...customJsonLd);
    } else {
      schemas.push(customJsonLd);
    }
  }

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={currentUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:site_name" content="StressGuru" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`} />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${BASE_URL}${ogImage}`} />

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
