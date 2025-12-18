"use client";

import { useState, useMemo } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
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

type BlogPostsProps = {
  initialPosts: BlogPost[];
  initialCategories: string[];
};

export function BlogPosts({ initialPosts, initialCategories }: BlogPostsProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return initialPosts;
    }
    return initialPosts.filter(post => post.category === selectedCategory);
  }, [selectedCategory, initialPosts]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    });
  };

  return (
    <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f5f9ff] via-white to-[#e8f2ff] z-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-[480px] h-[480px] bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[140px_140px] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {initialCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <Card className="group h-full bg-white border py-0 border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 overflow-hidden cursor-pointer">
                  {/* Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {post.featured && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-primary text-white border-0">
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardHeader className="pb-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <Badge variant="outline" className="border-primary/30 text-primary text-xs">
                        {post.category}
                      </Badge>
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag} 
                          variant="outline" 
                          className="border-border text-muted-foreground text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="">
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </CardContent>

                  <CardFooter className="mb-4 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {post.author.avatar ? (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {post.author.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-foreground">{post.author.name}</div>
                        <div className="text-xs text-muted-foreground">{post.author.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime} min read</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground text-lg">No posts found in this category.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}

