import { siteConfig } from '@/lib/seo/config';

// 조직 정보 JSON-LD
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo/logo.png`,
    description: siteConfig.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: '서울',
      addressCountry: 'KR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: siteConfig.contact.phone,
      contactType: 'customer service',
      availableLanguage: 'Korean',
    },
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 웹사이트 JSON-LD
export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: 'ko-KR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/education?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 교육 기관 JSON-LD
export function EducationalOrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: 'KRPIC',
    url: siteConfig.url,
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/images/logo/logo.png`,
    },
    description: siteConfig.description,
    areaServed: {
      '@type': 'Country',
      name: 'South Korea',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '재범방지교육 프로그램',
      itemListElement: [
        {
          '@type': 'OfferCatalog',
          name: '음주운전 재범방지교육',
        },
        {
          '@type': 'OfferCatalog',
          name: '폭력범죄 재범방지교육',
        },
        {
          '@type': 'OfferCatalog',
          name: '성범죄 재범방지교육',
        },
        {
          '@type': 'OfferCatalog',
          name: '마약범죄 재범방지교육',
        },
        {
          '@type': 'OfferCatalog',
          name: '도박중독 재범방지교육',
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 교육 과정 JSON-LD
interface CourseJsonLdProps {
  name: string;
  description: string;
  provider?: string;
  url: string;
}

export function CourseJsonLd({ name, description, url }: CourseJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description,
    provider: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    url,
    inLanguage: 'ko',
    courseMode: 'online',
    educationalCredentialAwarded: '수료증',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// FAQ JSON-LD
interface FaqItem {
  question: string;
  answer: string;
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 리뷰 집계 JSON-LD
interface AggregateRatingJsonLdProps {
  itemName: string;
  ratingValue: string;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}

export function AggregateRatingJsonLd({
  itemName,
  ratingValue,
  reviewCount,
  bestRating = 5,
  worstRating = 1,
}: AggregateRatingJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: itemName,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      reviewCount,
      bestRating,
      worstRating,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 빵 부스러기 (Breadcrumb) JSON-LD
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
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

// 지역 비즈니스 JSON-LD
export function LocalBusinessJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.name,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: '서울특별시',
      addressCountry: 'KR',
    },
    priceRange: '₩₩',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 서비스 JSON-LD (교육 서비스)
export function ServiceJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${siteConfig.url}/#service`,
    name: '재범방지교육 서비스',
    description: '법원, 검찰 인정 온라인 재범방지교육 프로그램. 음주운전, 폭력범죄, 성범죄, 마약범죄 등 다양한 교육 제공.',
    provider: {
      '@type': 'EducationalOrganization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    serviceType: '온라인 교육',
    areaServed: {
      '@type': 'Country',
      name: 'KR',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: '재범방지교육 프로그램',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '음주운전 재범방지교육',
            description: '음주운전 예방을 위한 온라인 교육 프로그램',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '폭력범죄 재범방지교육',
            description: '폭력 예방을 위한 온라인 교육 프로그램',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '성범죄 재범방지교육',
            description: '성범죄 예방을 위한 온라인 교육 프로그램',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '마약범죄 재범방지교육',
            description: '마약범죄 예방을 위한 온라인 교육 프로그램',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: '재산범죄 재범방지교육',
            description: '재산범죄 예방을 위한 온라인 교육 프로그램',
          },
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 웹페이지 JSON-LD
export function WebPageJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${siteConfig.url}/#webpage`,
    url: siteConfig.url,
    name: '재범방지교육통합센터 | 법원·검찰 인정 온라인 교육',
    description: siteConfig.description,
    isPartOf: {
      '@id': `${siteConfig.url}/#website`,
    },
    about: {
      '@id': `${siteConfig.url}/#organization`,
    },
    inLanguage: 'ko-KR',
    datePublished: '2025-01-01T00:00:00+09:00',
    dateModified: new Date().toISOString(),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 이미지 객체 JSON-LD
export function ImageObjectJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    '@id': `${siteConfig.url}/images/og-image.png`,
    url: `${siteConfig.url}/images/og-image.png`,
    width: 1200,
    height: 630,
    caption: siteConfig.name,
    inLanguage: 'ko-KR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 기사/공지사항 JSON-LD
interface ArticleJsonLdProps {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}

export function ArticleJsonLd({ title, description, url, datePublished, dateModified, image }: ArticleJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/images/logo/logo.png`,
      },
    },
    image: image || `${siteConfig.url}/images/og-image.png`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'ko-KR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

// 전문 서비스 JSON-LD
export function ProfessionalServiceJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${siteConfig.url}/#professionalservice`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo/logo.png`,
    image: `${siteConfig.url}/images/og-image.png`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '고양대로 620',
      addressLocality: '고양시',
      addressRegion: '경기도',
      postalCode: '10381',
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 37.6764,
      longitude: 126.7583,
    },
    priceRange: '₩₩',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://pf.kakao.com/_krpic',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
