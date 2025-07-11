import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:7001';
const DIST_DIR = join(__dirname, '../dist');
const TEMPLATE_PATH = join(DIST_DIR, 'index.html');

/**
 * Fetch data from the API
 */
async function fetchAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

/**
 * Generate meta tags for a blog post
 */
function generateMetaTags(post) {
  const metaTags = [];
  
  if (post.metaTitle || post.title) {
    metaTags.push(`<title>${escapeHtml(post.metaTitle || post.title)}</title>`);
  }
  
  if (post.metaDescription || post.description || post.excerpt) {
    metaTags.push(`<meta name="description" content="${escapeHtml(post.metaDescription || post.description || post.excerpt)}" />`);
  }
  
  if (post.author) {
    metaTags.push(`<meta name="author" content="${escapeHtml(post.author)}" />`);
  }
  
  if (post.tags && post.tags.length > 0) {
    metaTags.push(`<meta name="keywords" content="${escapeHtml(post.tags.join(', '))}" />`);
  }
  
  // Open Graph tags
  metaTags.push(`<meta property="og:title" content="${escapeHtml(post.metaTitle || post.title)}" />`);
  metaTags.push(`<meta property="og:description" content="${escapeHtml(post.metaDescription || post.description || post.excerpt)}" />`);
  metaTags.push(`<meta property="og:type" content="article" />`);
  metaTags.push(`<meta property="og:url" content="${post.canonicalUrl || `https://www.estebanbasili.com/blog/${post.slug}`}" />`);
  
  if (post.socialImage || post.image) {
    metaTags.push(`<meta property="og:image" content="${escapeHtml(post.socialImage || post.image)}" />`);
  }
  
  if (post.date) {
    metaTags.push(`<meta property="article:published_time" content="${post.date}" />`);
  }
  
  if (post.author) {
    metaTags.push(`<meta property="article:author" content="${escapeHtml(post.author)}" />`);
  }
  
  if (post.tags && post.tags.length > 0) {
    post.tags.forEach(tag => {
      metaTags.push(`<meta property="article:tag" content="${escapeHtml(tag)}" />`);
    });
  }
  
  // Twitter Card tags
  metaTags.push(`<meta name="twitter:card" content="${post.image ? 'summary_large_image' : 'summary'}" />`);
  metaTags.push(`<meta name="twitter:title" content="${escapeHtml(post.metaTitle || post.title)}" />`);
  metaTags.push(`<meta name="twitter:description" content="${escapeHtml(post.metaDescription || post.description || post.excerpt)}" />`);
  
  if (post.socialImage || post.image) {
    metaTags.push(`<meta name="twitter:image" content="${escapeHtml(post.socialImage || post.image)}" />`);
  }
  
  // Canonical URL
  if (post.canonicalUrl) {
    metaTags.push(`<link rel="canonical" href="${escapeHtml(post.canonicalUrl)}" />`);
  }
  
  return metaTags.join('\n    ');
}

/**
 * Generate structured data for a blog post
 */
function generateStructuredData(post) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description || post.excerpt,
    "author": {
      "@type": "Person",
      "name": post.author || "Esteban Basili"
    },
    "datePublished": post.date,
    "publisher": {
      "@type": "Person",
      "name": "Esteban Basili"
    },
    "url": post.canonicalUrl || `https://www.estebanbasili.com/blog/${post.slug}`
  };
  
  if (post.image) {
    structuredData.image = post.image;
  }
  
  if (post.tags && post.tags.length > 0) {
    structuredData.keywords = post.tags.join(", ");
  }
  
  return JSON.stringify(structuredData, null, 2);
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Prerender a blog post
 */
async function prerenderBlogPost(template, post) {
  const metaTags = generateMetaTags(post);
  const structuredData = generateStructuredData(post);
  
  // Replace the template placeholders
  let html = template;
  
  // Update title in the HTML
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(post.metaTitle || post.title)}</title>`);
  
  // Update or add meta description
  const descriptionContent = escapeHtml(post.metaDescription || post.description || post.excerpt);
  if (html.includes('<meta name="description"')) {
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${descriptionContent}" />`);
  } else {
    html = html.replace(/<meta name="viewport"/, `<meta name="description" content="${descriptionContent}" />\n    <meta name="viewport"`);
  }
  
  // Add all meta tags before the closing head tag
  html = html.replace('</head>', `    ${metaTags}\n    <script type="application/ld+json">\n${structuredData}\n    </script>\n  </head>`);
  
  return html;
}

/**
 * Main prerender function
 */
async function prerender() {
  console.log('🚀 Starting prerendering process...');
  
  try {
    // Read the base template
    console.log('📖 Reading template file...');
    const template = await readFile(TEMPLATE_PATH, 'utf-8');
    
    // Fetch blog posts
    console.log('📡 Fetching blog posts...');
    const blogPosts = await fetchAPI('/api/blog');
    
    if (!blogPosts) {
      console.error('❌ Failed to fetch blog posts');
      return;
    }
    
    console.log(`📝 Found ${blogPosts.length} blog posts to prerender`);
    
    // Create directories
    const blogDir = join(DIST_DIR, 'blog');
    await mkdir(blogDir, { recursive: true });
    
    // Prerender each blog post
    for (const postSummary of blogPosts) {
      console.log(`⚙️  Prerendering: ${postSummary.slug}`);
      
      // Fetch full post data
      const post = await fetchAPI(`/api/blog/${postSummary.slug}`);
      if (!post) {
        console.warn(`⚠️  Failed to fetch full data for ${postSummary.slug}`);
        continue;
      }
      
      // Generate prerendered HTML
      const html = await prerenderBlogPost(template, post);
      
      // Create directory for the post
      const postDir = join(blogDir, post.slug);
      await mkdir(postDir, { recursive: true });
      
      // Write the HTML file
      const outputPath = join(postDir, 'index.html');
      await writeFile(outputPath, html, 'utf-8');
      
      console.log(`✅ Generated: ${outputPath}`);
    }
    
    // Also prerender the blog listing page
    console.log('⚙️  Prerendering blog listing page...');
    const blogListingHtml = template
      .replace(/<title>.*?<\/title>/, '<title>Blog - Esteban Basili</title>')
      .replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="Read my latest thoughts on web development, design, and technology. In-depth articles about React, JavaScript, UI/UX, and more." />')
      .replace('</head>', '    <meta property="og:title" content="Blog - Esteban Basili" />\n    <meta property="og:description" content="Read my latest thoughts on web development, design, and technology." />\n    <meta property="og:type" content="website" />\n    <link rel="canonical" href="https://www.estebanbasili.com/blog" />\n  </head>');
    
    const blogIndexPath = join(blogDir, 'index.html');
    await writeFile(blogIndexPath, blogListingHtml, 'utf-8');
    console.log(`✅ Generated: ${blogIndexPath}`);
    
    console.log('🎉 Prerendering completed successfully!');
    
  } catch (error) {
    console.error('❌ Prerendering failed:', error);
    process.exit(1);
  }
}

// Run the prerender function
prerender(); 