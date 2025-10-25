"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/shared/link";
import { Calendar, Clock, Eye, Search, Tag } from "lucide-react";
import type { BlogPostRecord } from "@/services/blog";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadPosts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/blog", { cache: "no-store" });
        if (!res.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const data = (await res.json()) as BlogPostRecord[];
        if (isMounted) {
          setPosts(data);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Unable to load articles right now. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = Array.from(
      new Set(posts.map((post) => post.category).filter((category): category is string => Boolean(category)))
    );
    return ["All", ...values];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
      const search = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search) ||
        (post.excerpt ?? "").toLowerCase().includes(search) ||
        post.tags.some((tag) => tag.toLowerCase().includes(search));
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  return (
    <>
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Journal &{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Field Notes</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Personal essays, facilitation kits, and experiments shipped with product teams across Southeast Asia.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Search articles, topics, or tags..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-3 animate-fade-in">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-primary text-white shadow-glow"
                    : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Loading articles…</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                No articles match that filter yet. Try a different keyword or category.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card
                    className="group h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-border animate-fade-in cursor-pointer"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className="relative overflow-hidden aspect-video">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                          No image
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        {post.category && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            {post.category}
                          </span>
                        )}
                        <div className="flex items-center text-xs text-muted-foreground gap-1">
                          <Eye size={14} />
                          {post.views.toLocaleString()}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-muted-foreground text-sm line-clamp-3">{post.excerpt}</p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground flex items-center gap-1"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {post.date
                            ? new Date(post.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {post.readTime ?? "—"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

