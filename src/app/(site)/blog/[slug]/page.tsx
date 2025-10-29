import Image from "next/image";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/shared/link";
import { fetchBlogPostBySlug, fetchBlogPosts } from "@/services/blog";
import type { Components } from "react-markdown";
import type { ReactNode } from "react";
import { ArrowLeft, Calendar, Clock, Eye, Share2, Tag, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

export async function generateStaticParams() {
  const posts = await fetchBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  try {
    const post = await fetchBlogPostBySlug(resolvedParams.slug);
    return {
      title: `${post.title} - Somkid Sodsai`,
      description: post.excerpt ?? undefined,
    };
  } catch {
    return {
      title: "Article not found - Somkid Sodsai",
    };
  }
}

const markdownComponents: Components = {
  code: ((props) => {
    const { inline, className, children, ...rest } = props as {
      inline?: boolean;
      className?: string;
      children?: ReactNode;
    };

    if (inline) {
      return (
        <code className="rounded bg-muted px-1 py-0.5 text-sm" {...rest}>
          {children}
        </code>
      );
    }
    return (
      <pre className="rounded-lg bg-muted/60 p-4 overflow-x-auto">
        <code className={className ?? ""} {...rest}>
          {children}
        </code>
      </pre>
    );
  }) as NonNullable<Components["code"]>,
  a({ ...props }) {
    return (
      <a
        className="text-primary underline underline-offset-4"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    );
  },
  img({ src, alt }) {
    const resolvedSrc = typeof src === "string" ? src : "";
    if (!resolvedSrc) {
      return null;
    }
    return (
      <Image
        src={resolvedSrc}
        alt={alt ?? ""}
        width={1200}
        height={675}
        className="rounded-xl border border-border shadow-sm h-auto w-full"
      />
    );
  },
};

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post;
  try {
    post = await fetchBlogPostBySlug(resolvedParams.slug);
  } catch {
    notFound();
  }

  if (!post) {
    notFound();
  }

  const related = (await fetchBlogPosts()).filter((item) => item.slug !== post.slug).slice(0, 2);
  const author = (post.author ?? {}) as { name?: string; role?: string };

  return (
    <div className="bg-background">
      <section className="py-10 md:py-16 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4">
            <Button asChild variant="ghost" size="sm" className="w-fit gap-2">
              <Link href="/blog">
                <ArrowLeft className="h-4 w-4" />
                Back to all articles
              </Link>
            </Button>

            {post.category && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
            {post.excerpt && <p className="text-lg text-muted-foreground max-w-3xl">{post.excerpt}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                {post.date
                  ? new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} />
                {post.readTime ?? "—"}
              </span>
              <span className="flex items-center gap-2">
                <Eye size={16} />
                {post.views.toLocaleString()}
              </span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                {post.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-muted">
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
                <Button variant="outline" size="sm" className="ml-auto gap-2">
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto space-y-12">
            {post.image && (
              <Image
              src={post.image}
              alt={post.title}
              width={1600}
              height={900}
              className="h-auto w-full rounded-2xl shadow-xl"
              priority
            />
            )}

            <div className="grid lg:grid-cols-4 gap-12">
              {post.tableOfContents?.length > 0 && (
                <aside className="lg:col-span-1 hidden lg:block">
                  <div className="sticky top-28">
                    <Card className="p-6">
                      <h3 className="font-bold mb-4">Table of contents</h3>
                      <nav className="space-y-2">
                        {post.tableOfContents.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                          >
                            {item.title}
                          </a>
                        ))}
                      </nav>
                    </Card>
                  </div>
                </aside>
              )}

              <article className="lg:col-span-3 space-y-6">
                <div className="prose prose-neutral max-w-none leading-relaxed">
                  {post.content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeSlug, rehypeHighlight]}
                      components={markdownComponents}
                    >
                      {post.content}
                    </ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">
                      Full write-up coming soon. In the meantime, reach out if you would like the briefing notes.
                    </p>
                  )}
                </div>

                <Card className="mt-12 p-8 bg-muted/30">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                      <User className="text-white" size={30} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-1">About {author.name ?? "Somkid Sodsai"}</h4>
                      <p className="text-muted-foreground mb-3">{author.role ?? "System administrator"}</p>
                      <p className="text-sm text-muted-foreground">
                        I share the practical lessons from keeping infrastructure resilient and secure. If this article sparks an idea, let&apos;s connect about how to keep your environment running smoothly.
                      </p>
                    </div>
                  </div>
                </Card>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Related <span className="bg-gradient-primary bg-clip-text text-transparent">Articles</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {related.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`}>
                <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="relative overflow-hidden aspect-video">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 400px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={14} />
                      {item.readTime ?? "—"}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}










