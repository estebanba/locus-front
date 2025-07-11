import { useState, useEffect } from 'react';
import { getBlogPosts, BlogPostSummary } from '@/services/api';
import { useSEO, defaultSEO } from '@/hooks/useSEO';
import { BackButton } from "@/components/ui/BackButton";
import { Footer } from "@/components/Footer";
import { CardWrapper } from "@/components/ui/CardWrapper";

/**
 * Blog listing page that displays all blog posts with summaries
 * Includes proper SEO meta tags and consistent styling with other pages
 */
export function Blog() {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set SEO meta tags for the blog listing page
  useSEO({
    ...defaultSEO,
    title: 'Blog - Esteban Basili',
    description: 'Read my latest thoughts on web development, design, and technology. In-depth articles about React, JavaScript, UI/UX, and more.',
    keywords: [...(defaultSEO.keywords || []), 'blog', 'articles', 'web development', 'react', 'javascript', 'design'],
    canonicalUrl: `${window.location.origin}/blog`,
    type: 'website',
  });

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const blogPosts = await getBlogPosts();
        setPosts(blogPosts);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="p-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-1">
          <BackButton variant="text" />
          <h1 className="text-3xl tracking-tight mb-4 mt-8">Blog</h1>
          <p className="text-muted-foreground mb-8">
            Thoughts on web development, design, and technology.
          </p>
          <div className="text-center py-10">Loading posts...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-1">
          <BackButton variant="text" />
          <h1 className="text-3xl tracking-tight mb-4 mt-8">Blog</h1>
          <p className="text-muted-foreground mb-8">
            Thoughts on web development, design, and technology.
          </p>
          <div className="text-center py-10 text-red-500">Error loading posts: {error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="p-4 pt-8 flex flex-col min-h-screen">
      <div className="flex-1 space-y-8">
        <div className="w-full flex justify-start">
          <BackButton variant="text" />
        </div>
        
        <div className="w-full">
          <h1 className="text-3xl tracking-tight mb-4">Blog</h1>
          <p className="text-muted-foreground mb-8">
            Thoughts on engineering, design, and life.
          </p>
        </div>

        <div className="w-full">
          {posts.length === 0 ? (
            <p className="text-center text-muted-foreground">No posts to display.</p>
          ) : (
            <div className="space-y-0">
              {posts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} isLast={index === posts.length - 1} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

/**
 * Individual blog post card component - styled like ListCard for consistency
 * Features tooltip with post image using enhanced CardWrapper
 */
function BlogPostCard({ post, isLast = false }: { post: BlogPostSummary; isLast?: boolean }) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Determine image configuration for tooltip based on new 'name' and 'imagesPath' properties
  const imageConfig = post.imagesPath && post.name ? {
    cloudinary: {
      imagesPath: post.imagesPath,
      name: post.name
    },
    alt: post.title
  } : undefined;

  return (
    <CardWrapper 
      to={`/blog/${post.slug}`}
      imageConfig={imageConfig}
      isLast={isLast}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-lg font-semibold hover:underline">
          {post.title}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {formattedDate} • {post.readingTime} min read
        {/* {post.author && ` • by ${post.author}`} */}
      </p>
      {post.description && (
        <p className="text-sm text-muted-foreground">
          {post.description}
        </p>
      )}
    </CardWrapper>
  );
} 