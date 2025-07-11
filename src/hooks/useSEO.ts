import { useEffect } from 'react';

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  canonicalUrl?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  locale?: string;
  siteName?: string;
}

/**
 * React 19 compatible SEO hook that manages document head meta tags
 * without the need for react-helmet or external dependencies
 */
export function useSEO(config: SEOConfig) {
  useEffect(() => {
    // Store original values for cleanup
    const originalTitle = document.title;
    const addedElements: HTMLElement[] = [];

    // Helper function to create or update meta tag
    const createOrUpdateMeta = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      const selector = `meta[${attribute}="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
        addedElements.push(element);
      }
      
      element.setAttribute('content', content);
    };

    // Helper function to create or update link tag
    const createOrUpdateLink = (rel: string, href: string) => {
      const selector = `link[rel="${rel}"]`;
      let element = document.querySelector(selector) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        document.head.appendChild(element);
        addedElements.push(element);
      }
      
      element.href = href;
    };

    // Set page title
    if (config.title) {
      document.title = config.title;
    }

    // Basic meta tags
    if (config.description) {
      createOrUpdateMeta('description', config.description);
    }

    if (config.keywords && config.keywords.length > 0) {
      createOrUpdateMeta('keywords', config.keywords.join(', '));
    }

    if (config.author) {
      createOrUpdateMeta('author', config.author);
    }

    // Canonical URL
    if (config.canonicalUrl) {
      createOrUpdateLink('canonical', config.canonicalUrl);
    }

    // Open Graph tags
    if (config.title) {
      createOrUpdateMeta('og:title', config.title, true);
    }

    if (config.description) {
      createOrUpdateMeta('og:description', config.description, true);
    }

    if (config.image) {
      createOrUpdateMeta('og:image', config.image, true);
    }

    createOrUpdateMeta('og:type', config.type || 'website', true);

    if (config.canonicalUrl) {
      createOrUpdateMeta('og:url', config.canonicalUrl, true);
    }

    if (config.locale) {
      createOrUpdateMeta('og:locale', config.locale, true);
    }

    if (config.siteName) {
      createOrUpdateMeta('og:site_name', config.siteName, true);
    }

    // Article-specific Open Graph tags
    if (config.type === 'article') {
      if (config.publishedTime) {
        createOrUpdateMeta('article:published_time', config.publishedTime, true);
      }

      if (config.modifiedTime) {
        createOrUpdateMeta('article:modified_time', config.modifiedTime, true);
      }

      if (config.author) {
        createOrUpdateMeta('article:author', config.author, true);
      }

      if (config.tags && config.tags.length > 0) {
        // For multiple tags, we create multiple meta tags
        config.tags.forEach((tag) => {
          const tagElement = document.createElement('meta');
          tagElement.setAttribute('property', 'article:tag');
          tagElement.setAttribute('content', tag);
          document.head.appendChild(tagElement);
          addedElements.push(tagElement);
        });
      }
    }

    // Twitter Card tags
    createOrUpdateMeta('twitter:card', config.image ? 'summary_large_image' : 'summary');

    if (config.title) {
      createOrUpdateMeta('twitter:title', config.title);
    }

    if (config.description) {
      createOrUpdateMeta('twitter:description', config.description);
    }

    if (config.image) {
      createOrUpdateMeta('twitter:image', config.image);
    }

    // Cleanup function to restore original state
    return () => {
      document.title = originalTitle;
      addedElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
    };
  }, [
    config.title,
    config.description,
    config.keywords?.join(','),
    config.author,
    config.canonicalUrl,
    config.image,
    config.type,
    config.publishedTime,
    config.modifiedTime,
    config.tags?.join(','),
    config.locale,
    config.siteName,
  ]);
}

/**
 * Default SEO configuration for the site
 */
export const defaultSEO: SEOConfig = {
  title: 'Esteban Basili - Developer & Designer',
  description: 'Personal portfolio and blog of Esteban Basili, a full-stack developer and designer passionate about creating exceptional digital experiences.',
  keywords: ['Esteban Basili', 'developer', 'designer', 'portfolio', 'web development', 'frontend', 'backend'],
  author: 'Esteban Basili',
  siteName: 'Esteban Basili',
  locale: 'en_US',
  type: 'website',
}; 