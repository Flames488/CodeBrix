import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = () => {
  const location = useLocation();
  const canonicalUrl = `https://codebrixweb.com${location.pathname}`;

  // Structured data schemas
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://codebrixweb.com/#organization',
    name: 'Codebrix',
    url: 'https://codebrixweb.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://codebrixweb.com/logo.png',
      width: 512,
      height: 512,
    },
    description: 'Your Partner in AI, Automation & Intelligent Web Systems. Codebrix builds AI-powered websites, automation, and intelligent workflows that eliminate manual work, improve business efficiency, and scale operations reliably.',
    sameAs: [
      'https://linkedin.com/company/codebrix',
      'https://twitter.com/codebrix',
      'https://github.com/codebrix',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-701-647-9713',
      contactType: 'customer service',
      availableLanguage: ['English'],
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://codebrixweb.com/#website',
    url: 'https://codebrixweb.com',
    name: 'Codebrix - AI Systems & Automation',
    description: 'Your Partner in AI, Automation & Intelligent Web Systems. AI-powered systems that run, optimize, and grow modern businesses',
    publisher: {
      '@id': 'https://codebrixweb.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://codebrixweb.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const serviceSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI-Powered Websites',
      provider: {
        '@id': 'https://codebrixweb.com/#organization',
      },
      description: 'Conversion-focused, performance-optimized, automated websites with AI enhancement.',
      areaServed: 'Global',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Website Development Services',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Automation & Intelligent Workflows',
      provider: {
        '@id': 'https://codebrixweb.com/#organization',
      },
      description: 'Replace repetitive tasks, integrate tools, reduce human workload with intelligent automation.',
      areaServed: 'Global',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'AI Agents & Digital Receptionists',
      provider: {
        '@id': 'https://codebrixweb.com/#organization',
      },
      description: 'Lead qualification, 24/7 instant response, multi-channel integration with AI agents.',
      areaServed: 'Global',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'SEO & Growth Engines',
      provider: {
        '@id': 'https://codebrixweb.com/#organization',
      },
      description: 'Automated ranking, lead generation, measurable growth systems.',
      areaServed: 'Global',
    },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://codebrixweb.com/',
      },
      ...(location.pathname !== '/' ? [{
        '@type': 'ListItem',
        position: 2,
        name: location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2),
        item: canonicalUrl,
      }] : []),
    ],
  };

  useEffect(() => {
    // Update meta tags dynamically
    const metaTags = {
      'description': 'Codebrix builds AI-powered websites, automation, and intelligent workflows that eliminate manual work, improve business efficiency, and scale operations reliably.',
      'keywords': 'AI automation, intelligent workflows, AI-powered websites, digital receptionists, business automation solutions, scalable AI systems',
      'author': 'Codebrix',
      'robots': 'index, follow',
      'og:title': 'Codebrix - AI Systems & Automation',
      'og:description': 'We Build Intelligent Digital Systems That Do the Work for You',
      'og:type': 'website',
      'og:url': canonicalUrl,
      'og:image': 'https://codebrixweb.com/og-image.jpg',
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Codebrix - AI Systems & Automation',
      'twitter:description': 'Your Partner in AI, Automation & Intelligent Web Systems. We Build Intelligent Digital Systems That Do the Work for You',
      'twitter:image': 'https://codebrixweb.com/og-image.jpg',
    };

    // Update or create meta tags
    Object.entries(metaTags).forEach(([name, content]) => {
      const isOg = name.startsWith('og:');
      let meta = document.querySelector(`meta[${isOg ? 'property' : 'name'}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(isOg ? 'property' : 'name', name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    });

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Update title
    document.title = 'Codebrix - AI Systems & Automation';
  }, [canonicalUrl]);

  return (
    <script type="application/ld+json">
      {JSON.stringify([
        organizationSchema,
        websiteSchema,
        breadcrumbSchema,
        ...serviceSchemas,
      ])}
    </script>
  );
};

export default SEO;
