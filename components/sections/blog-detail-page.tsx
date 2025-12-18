"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Facebook, Twitter, Linkedin, Copy, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown content
  image: string;
  category: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
  publishedAt: string;
  readTime: number;
  featured: boolean;
};

interface BlogDetailPageProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export function BlogDetailPage({ post, relatedPosts }: BlogDetailPageProps) {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  const handleShare = async (platform: string) => {
    // Construct the full URL explicitly - use current page URL or construct from slug
    let blogUrl: string;
    if (typeof window !== 'undefined') {
      // Use the current page URL (most reliable)
      blogUrl = window.location.href;
    } else {
      // Fallback for SSR
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${process.env.NEXT_PUBLIC_SITE_NAME}.com`;
      blogUrl = `${baseUrl}/blog/${post.slug}`;
    }
    
    const title = post.title;
    const text = post.excerpt || post.title;

    switch (platform) {
      case "copy":
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(blogUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          // Fallback for older browsers
          const textArea = document.createElement('textarea');
          textArea.value = blogUrl;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
        break;
      case "facebook":
        // Facebook share URL - only use 'u' parameter (quote is deprecated)
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(blogUrl)}`;
        // Open in new tab (Facebook handles the rest)
        window.open(facebookUrl, "_blank", "noopener,noreferrer");
        break;
      case "twitter":
        // Twitter share URL with title and URL
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(blogUrl)}&text=${encodeURIComponent(title)}&via=${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`;
        window.open(
          twitterUrl,
          "_blank",
          "width=600,height=400"
        );
        break;
      case "linkedin":
        // LinkedIn share URL
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`;
        window.open(
          linkedInUrl,
          "_blank",
          "width=600,height=400"
        );
        break;
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden pt-32 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[200px] bg-linear-to-b from-primary via-primary/95 to-primary/90 z-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </Link>

            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <Badge variant="outline" className="border-white/30 text-white bg-white/10">
                {post.category}
              </Badge>
              {post.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="border-white/20 text-white/80 bg-white/5"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              {post.title}
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author & Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <div className="flex items-center gap-3">
                {post.author.avatar ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                    <span className="text-lg font-semibold text-white">
                      {post.author.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <div className="font-semibold text-white">{post.author.name}</div>
                  <div className="text-sm text-white/70">{post.author.role}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Article Content */}
      <section className="relative py-16 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f5f9ff] via-white to-[#e8f2ff] z-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-primary/12 blur-3xl" />
          <div className="absolute -bottom-20 right-10 w-[480px] h-[480px] bg-primary/10 blur-3xl" />
        </div>

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-96 w-full rounded-xl sm:rounded-2xl overflow-hidden mb-12 shadow-xl"
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>

            {/* Article Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg max-w-none"
            >
              <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-6 sm:p-8 md:p-12 shadow-lg">
                <div className="blog-content text-foreground">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }: any) => (
                        <h1 className="text-3xl font-bold mb-4 mt-6 text-foreground" {...props} />
                      ),
                      h2: ({ node, ...props }: any) => (
                        <h2 className="text-2xl font-bold mb-3 mt-5 text-foreground" {...props} />
                      ),
                      h3: ({ node, ...props }: any) => (
                        <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground" {...props} />
                      ),
                      p: ({ node, ...props }: any) => (
                        <p className="mb-4 leading-relaxed text-foreground" {...props} />
                      ),
                      ul: ({ node, ...props }: any) => (
                        <ul className="list-disc pl-6 mb-4 text-foreground" {...props} />
                      ),
                      ol: ({ node, ...props }: any) => (
                        <ol className="list-decimal pl-6 mb-4 text-foreground" {...props} />
                      ),
                      li: ({ node, ...props }: any) => (
                        <li className="mb-1 text-foreground" {...props} />
                      ),
                      blockquote: ({ node, ...props }: any) => (
                        <blockquote
                          className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
                          {...props}
                        />
                      ),
                      code: ({ node, inline, ...props }: any) =>
                        inline ? (
                          <code
                            className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground"
                            {...props}
                          />
                        ) : (
                          <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-4">
                            <code className="text-sm font-mono text-foreground" {...props} />
                          </pre>
                        ),
                      a: ({ node, ...props }: any) => (
                        <a
                          className="text-primary hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      img: ({ node, ...props }: any) => (
                        <img className="rounded-lg my-4 max-w-full" {...props} />
                      ),
                      hr: ({ node, ...props }: any) => (
                        <hr className="my-6 border-border" {...props} />
                      ),
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.article>

            {/* Share Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-12"
            >
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    <span className="text-sm sm:text-base text-muted-foreground font-medium whitespace-nowrap">
                      Share this article:
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare("facebook")}
                        className="border-border hover:border-primary bg-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 flex-1 sm:flex-initial min-w-[100px] sm:min-w-0"
                      >
                        <Facebook className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">Facebook</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare("twitter")}
                        className="border-border hover:border-primary bg-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 flex-1 sm:flex-initial min-w-[100px] sm:min-w-0"
                      >
                        <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">Twitter</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare("linkedin")}
                        className="border-border hover:border-primary bg-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 flex-1 sm:flex-initial min-w-[100px] sm:min-w-0"
                      >
                        <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                        <span className="whitespace-nowrap">LinkedIn</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare("copy")}
                        className="border-border hover:border-primary bg-white text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 flex-1 sm:flex-initial min-w-[100px] sm:min-w-0"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="whitespace-nowrap">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
                            <span className="whitespace-nowrap">Copy Link</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-white via-[#f0f9ff] to-white z-3">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] bg-primary/8 blur-3xl" />
            <div className="absolute -bottom-20 left-10 w-[480px] h-[480px] bg-primary/8 blur-3xl" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Related Articles
                </span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Continue reading more articles on {post.category}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={`/blog/${relatedPost.slug}`}>
                    <Card className="group h-full py-0 bg-white border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden cursor-pointer">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge variant="outline" className="mb-3 border-primary/30 text-primary text-xs">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{relatedPost.readTime} min read</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

