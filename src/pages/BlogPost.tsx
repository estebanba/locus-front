import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost, getItemImageUrls, BlogPost as BlogPostType } from '@/services/api';
import { useSEO, defaultSEO } from '@/hooks/useSEO';
import { BackButton } from '@/components/ui/BackButton';
import { Footer } from '@/components/Footer';
// Removed ReactMarkdown imports - content is already HTML from backend

/**
 * Blog post detail page that displays a single blog post with full content
 * Includes proper SEO meta tags, structured data, and HTML rendering
 */
export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [postImageUrl, setPostImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) {
        setError('Blog post not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const blogPost = await getBlogPost(slug);
        setPost(blogPost);
        setError(null);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  useEffect(() => {
    const fetchPostImage = async () => {
      if (post && post.imagesPath && post.name) {
        try {
          const images = await getItemImageUrls(`${post.imagesPath}${post.name}`);
          if (images.length > 0) {
            // Select a random image
            const randomIndex = Math.floor(Math.random() * images.length);
            setPostImageUrl(images[randomIndex].secure_url);
          }
        } catch (err) {
          console.error('Failed to load post image:', err);
        }
      }
    };

    fetchPostImage();
  }, [post]);

  // Set SEO meta tags for the blog post
  useSEO({
    ...defaultSEO,
    title: post?.metaTitle || post?.title || 'Blog Post - Esteban Basili',
    description: post?.metaDescription || post?.description || post?.excerpt,
    keywords: [...(defaultSEO.keywords || []), ...(post?.tags || [])],
    author: post?.author || defaultSEO.author,
    canonicalUrl: post?.canonicalUrl || `${window.location.origin}/blog/${slug}`,
    image: postImageUrl || post?.socialImage || post?.image,
    type: 'article',
    publishedTime: post?.date,
    tags: post?.tags,
  });

  if (loading) {
    return (
      <div className="p-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-1">
          <BackButton variant="text" />
          <div className="text-center py-10">Loading post...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="p-4 pt-8 flex flex-col min-h-screen">
        <div className="flex-1">
          <BackButton variant="text" />
          <div className="text-center py-10">
            <h2 className="text-2xl font-semibold mb-4">Blog Post Not Found</h2>
            <p className="text-muted-foreground mb-8">
              {error || 'The blog post you are looking for does not exist.'}
            </p>
            <Link 
              to="/blog" 
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              View All Posts
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-4 pt-8 flex flex-col min-h-screen">
      <div className="flex-1 space-y-8">
        <div className="w-full flex justify-start">
          <BackButton variant="text" />
        </div>
        
        <article className="w-full">
          {/* Blog post header */}
          <header className="mb-8">
            {postImageUrl && (
              <div className="aspect-video overflow-hidden rounded-lg mb-8">
                <img
                  src={postImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <h1 className="text-3xl tracking-tight mb-4">{post.title}</h1>
            
            <div className="flex justify-end items-center text-muted-foreground mb-4 flex-wrap gap-4">
              <div className="flex flex-col items-end">
                <time dateTime={post.date}>{formattedDate}</time>
                <p>{post.readingTime} min read</p>
              </div>
            </div>

            

            {/* {post.description && (
              <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4 mb-8">
                {post.description}
              </p>
            )} */}
          </header>

          {/* Blog post content - rendered as HTML since backend already converts markdown to HTML */}
          <div 
            className="prose prose-gray dark:prose-invert max-w-none
              [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-8 [&>h1]:mb-4
              [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:mt-6 [&>h2]:mb-3  
              [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2
              [&>p]:mb-4 [&>p]:leading-relaxed
              [&>pre]:bg-gray-100 [&>pre]:dark:bg-gray-800 [&>pre]:rounded-md [&>pre]:p-4 [&>pre]:overflow-x-auto
              [&>code]:bg-gray-100 [&>code]:dark:bg-gray-800 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm
              [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-muted-foreground [&>blockquote]:my-4
              [&>ul]:list-disc [&>ul]:list-inside [&>ul]:mb-4 [&>ul]:space-y-1
              [&>ol]:list-decimal [&>ol]:list-inside [&>ol]:mb-4 [&>ol]:space-y-1
              [&>a]:text-primary [&>a]:hover:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Blog post footer */}
          <footer className="mt-12 pt-8">

          {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/blog/tag/${tag}`}
                    className="inline-block px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* <div className="flex justify-between items-center">
              <Link 
                to="/blog"
                className="inline-flex items-center px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
              >
                ← All Posts
              </Link>
              
              <div className="text-sm text-muted-foreground">
                <p>Published on {formattedDate}</p>
                {post.author && <p>by {post.author}</p>}
              </div>
            </div> */}
          </footer>
        </article>

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description || post.excerpt,
              author: {
                "@type": "Person",
                name: post.author || "Esteban Basili",
              },
              datePublished: post.date,
              image: postImageUrl || post.image,
              publisher: {
                "@type": "Person",
                name: "Esteban Basili",
              },
              url: `${window.location.origin}/blog/${post.slug}`,
              keywords: post.tags?.join(", "),
            }),
          }}
        />
      </div>
      
      <Footer />
    </div>
  );
} 