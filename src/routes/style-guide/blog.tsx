import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Clock,
  Code,
  Link as LinkIcon,
  MoreHorizontal,
  Reply,
  Share2,
  ThumbsUp,
} from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
import { useState } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/style-guide/blog")({
  component: BlogPage,
});

// ============================================================================
// TABLE OF CONTENTS DATA
// ============================================================================

const tableOfContents = [
  { id: "introduction", title: "Introduction", level: 1 },
  { id: "getting-started", title: "Getting Started", level: 1 },
  { id: "installation", title: "Installation", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "core-concepts", title: "Core Concepts", level: 1 },
  { id: "components", title: "Components", level: 2 },
  { id: "styling", title: "Styling", level: 2 },
  { id: "best-practices", title: "Best Practices", level: 1 },
  { id: "conclusion", title: "Conclusion", level: 1 },
];

// ============================================================================
// RELATED ARTICLES DATA
// ============================================================================

const relatedArticles = [
  {
    id: 1,
    title: "Understanding React Server Components",
    excerpt: "A deep dive into the new paradigm of server-side rendering in React.",
    author: "Sarah Chen",
    date: "Jan 15, 2026",
    readTime: "8 min read",
    category: "React",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Building Accessible Web Applications",
    excerpt: "Learn how to make your applications usable by everyone.",
    author: "Alex Rivera",
    date: "Jan 12, 2026",
    readTime: "6 min read",
    category: "Accessibility",
    gradient: "from-green-500 to-emerald-600",
  },
  {
    id: 3,
    title: "The Future of CSS: Container Queries",
    excerpt: "Exploring how container queries change responsive design.",
    author: "Jordan Kim",
    date: "Jan 10, 2026",
    readTime: "5 min read",
    category: "CSS",
    gradient: "from-purple-500 to-pink-600",
  },
];

// ============================================================================
// COMMENTS DATA
// ============================================================================

const comments = [
  {
    id: 1,
    author: {
      name: "Emily Watson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      initials: "EW",
    },
    content:
      "This is an incredibly well-written article! The examples are clear and the explanations are easy to follow. I especially appreciated the section on best practices - it really helped me understand the nuances.",
    date: "2 hours ago",
    likes: 12,
    replies: [
      {
        id: 2,
        author: {
          name: "Marcus Chen",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          initials: "MC",
        },
        content:
          "I agree! The best practices section was particularly helpful for my current project.",
        date: "1 hour ago",
        likes: 3,
      },
    ],
  },
  {
    id: 3,
    author: {
      name: "David Park",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      initials: "DP",
    },
    content:
      "Great article! One question though - how would you handle the edge case where the component needs to maintain state across re-renders? Would you recommend using a ref or is there a better pattern?",
    date: "5 hours ago",
    likes: 8,
    replies: [],
  },
];

// ============================================================================
// ARTICLE HEADER COMPONENT
// ============================================================================

function ArticleHeader() {
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <header className="space-y-6">
      {/* Category Badge */}
      <Badge variant="secondary" className="text-xs uppercase tracking-wider">
        Development
      </Badge>

      {/* Article Title */}
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
        Building Beautiful, Accessible User Interfaces with Modern Web Technologies
      </h1>

      {/* Subtitle/Excerpt */}
      <p className="font-serif text-xl text-on-surface-variant leading-relaxed">
        A comprehensive guide to creating stunning, user-friendly interfaces that work for everyone.
        Learn the principles, patterns, and practices that make great design.
      </p>

      {/* Author Info & Meta */}
      <div className="flex flex-wrap items-center gap-4 pt-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Jordan Kim</p>
            <p className="text-sm text-on-surface-variant">Senior Frontend Engineer</p>
          </div>
        </div>

        <Separator orientation="vertical" className="h-10 hidden sm:block" />

        <div className="flex items-center gap-4 text-sm text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>January 18, 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>12 min read</span>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <span className="text-sm text-on-surface-variant mr-2">Share:</span>
        <Button variant="ghost" size="icon-sm">
          <TwitterIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <FacebookIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <LinkedinIcon className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="h-5 mx-2" />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={cn(isBookmarked && "text-primary")}
        >
          <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
        </Button>
      </div>
    </header>
  );
}

// ============================================================================
// ARTICLE BODY COMPONENT
// ============================================================================

function ArticleBody() {
  return (
    <article className="font-serif prose prose-lg max-w-none">
      {/* Introduction Section */}
      <section id="introduction">
        <p className="text-xl leading-relaxed text-foreground/90 first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
          In the ever-evolving landscape of web development, creating user interfaces that are both
          beautiful and accessible has become more important than ever. This guide will walk you
          through the essential principles and practices that define modern UI development.
        </p>

        <p className="text-lg leading-relaxed text-foreground/80">
          Whether you're building a simple landing page or a complex application, understanding
          these fundamentals will help you create experiences that delight users while remaining
          accessible to everyone. Let's dive into the world of modern web design.
        </p>
      </section>

      {/* Getting Started Section */}
      <section id="getting-started" className="mt-12">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground not-prose mb-6">
          Getting Started
        </h2>

        <p className="text-lg leading-relaxed text-foreground/80">
          Before we begin, it's important to understand the tools and technologies we'll be working
          with. Modern UI development leverages a powerful ecosystem of frameworks, libraries, and
          design systems.
        </p>

        {/* Installation Subsection */}
        <h3
          id="installation"
          className="font-serif text-2xl font-semibold tracking-tight text-foreground not-prose mt-8 mb-4"
        >
          Installation
        </h3>

        <p className="text-lg leading-relaxed text-foreground/80">
          Getting started is straightforward. You'll need Node.js installed on your system, then you
          can use your preferred package manager to install the dependencies.
        </p>

        {/* Code Block */}
        <div className="not-prose my-6">
          <div className="bg-slate-900 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-400">Terminal</span>
              </div>
              <Button variant="ghost" size="xs" className="text-slate-400 hover:text-slate-200">
                Copy
              </Button>
            </div>
            <pre className="p-4 overflow-x-auto">
              <code className="text-sm text-slate-200 font-mono">
                {`# Using npm
npm install @ui/components

# Using pnpm
pnpm add @ui/components

# Using yarn
yarn add @ui/components`}
              </code>
            </pre>
          </div>
        </div>

        {/* Configuration Subsection */}
        <h3
          id="configuration"
          className="font-serif text-2xl font-semibold tracking-tight text-foreground not-prose mt-8 mb-4"
        >
          Configuration
        </h3>

        <p className="text-lg leading-relaxed text-foreground/80">
          After installation, you'll need to configure the library to work with your project. This
          typically involves setting up your theme, configuring your build tools, and importing the
          necessary styles.
        </p>
      </section>

      {/* Blockquote */}
      <blockquote className="not-prose my-8 border-l-4 border-primary pl-6 py-2 italic">
        <p className="text-xl text-foreground/80 font-serif leading-relaxed">
          "Design is not just what it looks like and feels like. Design is how it works."
        </p>
        <footer className="mt-2 text-sm text-on-surface-variant not-italic">— Steve Jobs</footer>
      </blockquote>

      {/* Core Concepts Section */}
      <section id="core-concepts" className="mt-12">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground not-prose mb-6">
          Core Concepts
        </h2>

        <p className="text-lg leading-relaxed text-foreground/80">
          Understanding the core concepts behind modern UI development is essential for creating
          maintainable and scalable applications. Let's explore the key principles that guide
          effective interface design.
        </p>

        {/* Components Subsection */}
        <h3
          id="components"
          className="font-serif text-2xl font-semibold tracking-tight text-foreground not-prose mt-8 mb-4"
        >
          Components
        </h3>

        <p className="text-lg leading-relaxed text-foreground/80">
          Components are the building blocks of modern user interfaces. They encapsulate structure,
          style, and behavior into reusable, composable units. A well-designed component system
          provides:
        </p>

        {/* Unordered List */}
        <ul className="not-prose my-6 space-y-3">
          <li className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
            <span className="text-lg text-foreground/80">
              <strong className="text-foreground">Consistency</strong> — Uniform appearance and
              behavior across your application
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
            <span className="text-lg text-foreground/80">
              <strong className="text-foreground">Reusability</strong> — Write once, use everywhere
              philosophy
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
            <span className="text-lg text-foreground/80">
              <strong className="text-foreground">Maintainability</strong> — Easy to update and
              extend over time
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0" />
            <span className="text-lg text-foreground/80">
              <strong className="text-foreground">Testability</strong> — Isolated units that can be
              tested independently
            </span>
          </li>
        </ul>

        {/* Styling Subsection */}
        <h3
          id="styling"
          className="font-serif text-2xl font-semibold tracking-tight text-foreground not-prose mt-8 mb-4"
        >
          Styling
        </h3>

        <p className="text-lg leading-relaxed text-foreground/80">
          Modern CSS has evolved significantly, offering powerful features like CSS Variables,
          Container Queries, and advanced layout systems. Here's a comparison of different
          approaches:
        </p>

        {/* Ordered List */}
        <ol className="not-prose my-6 space-y-3 counter-reset-list">
          <li className="flex items-start gap-3">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0">
              1
            </span>
            <span className="text-lg text-foreground/80">
              <strong className="text-foreground">Utility-First CSS</strong> — Tailwind CSS and
              similar approaches offer rapid development with consistent design tokens
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0">
              2
            </span>
            <span className="text-lg text-foreground/80">
              <strong className="text-foreground">CSS-in-JS</strong> — Libraries like
              styled-components provide component-scoped styles with full JavaScript power
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="h-6 w-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center shrink-0">
              3
            </span>
            <span className="text-lg text-foreground/80">
              <strong className="text-foreground">CSS Modules</strong> — Scoped CSS with the
              simplicity of traditional stylesheets
            </span>
          </li>
        </ol>
      </section>

      {/* Image with Caption */}
      <figure className="not-prose my-10">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xl font-medium">Article Image Placeholder</span>
        </div>
        <figcaption className="mt-3 text-center text-sm text-on-surface-variant">
          Figure 1: A visual representation of the component hierarchy in a typical application.
        </figcaption>
      </figure>

      {/* Best Practices Section */}
      <section id="best-practices" className="mt-12">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground not-prose mb-6">
          Best Practices
        </h2>

        <p className="text-lg leading-relaxed text-foreground/80">
          Following best practices ensures your interfaces remain performant, accessible, and
          maintainable. Here are key recommendations to keep in mind throughout your development
          process.
        </p>

        {/* Info Callout */}
        <div className="not-prose my-6 p-4 bg-info/10 border border-info/20 rounded-lg">
          <p className="text-info-foreground text-lg">
            <strong>Pro Tip:</strong> Always test your interfaces with keyboard navigation and
            screen readers. This not only helps users with disabilities but often reveals usability
            issues that affect everyone.
          </p>
        </div>

        <p className="text-lg leading-relaxed text-foreground/80">
          Performance is another crucial aspect. Lazy loading, code splitting, and optimized assets
          can significantly improve the user experience, especially on slower connections. Consider
          using modern image formats like WebP and AVIF for better compression.
        </p>

        {/* Inline Link Example */}
        <p className="text-lg leading-relaxed text-foreground/80">
          For more detailed information, check out the
          <a href="#" className="text-primary hover:underline underline-offset-4 mx-1">
            official documentation
          </a>
          or explore our
          <a href="#" className="text-primary hover:underline underline-offset-4 mx-1">
            example projects
          </a>
          to see these principles in action.
        </p>
      </section>

      {/* Conclusion Section */}
      <section id="conclusion" className="mt-12">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground not-prose mb-6">
          Conclusion
        </h2>

        <p className="text-lg leading-relaxed text-foreground/80">
          Building beautiful, accessible user interfaces is both an art and a science. By
          understanding the core concepts, following best practices, and staying current with modern
          techniques, you can create experiences that truly resonate with your users.
        </p>

        <p className="text-lg leading-relaxed text-foreground/80">
          Remember that great design is iterative. Don't be afraid to experiment, gather feedback,
          and continuously improve your interfaces. The best designs emerge from a deep
          understanding of both the technology and the people who use it.
        </p>
      </section>
    </article>
  );
}

// ============================================================================
// TABLE OF CONTENTS SIDEBAR
// ============================================================================

function TableOfContentsSidebar() {
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24">
        <h4 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider mb-4">
          On This Page
        </h4>
        <nav className="space-y-1">
          {tableOfContents.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "block text-sm transition-colors py-1",
                item.level === 2 ? "pl-4" : "pl-0",
                activeSection === item.id
                  ? "text-primary font-medium"
                  : "text-on-surface-variant hover:text-foreground",
              )}
            >
              {item.title}
            </a>
          ))}
        </nav>

        <Separator className="my-6" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Share2 className="h-4 w-4" />
            Share Article
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
            <Bookmark className="h-4 w-4" />
            Save for Later
          </Button>
        </div>
      </div>
    </aside>
  );
}

// ============================================================================
// AUTHOR BIO COMPONENT
// ============================================================================

function AuthorBio() {
  return (
    <Card className="mt-12">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <Avatar className="h-20 w-20 shrink-0">
            <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold">Jordan Kim</h3>
              <Badge variant="secondary" className="text-xs">
                Author
              </Badge>
            </div>
            <p className="text-on-surface-variant mb-4">
              Jordan is a Senior Frontend Engineer with over 10 years of experience building user
              interfaces. She specializes in React, TypeScript, and design systems. When not coding,
              she enjoys teaching and contributing to open source.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Follow
              </Button>
              <Button variant="ghost" size="icon-sm">
                <TwitterIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <LinkedinIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// RELATED ARTICLES COMPONENT
// ============================================================================

function RelatedArticles() {
  return (
    <section className="mt-16">
      <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Related Articles</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => (
          <Card
            key={article.id}
            className="overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer"
          >
            <div className={cn("h-32 bg-gradient-to-br", article.gradient)} />
            <CardContent className="p-4">
              <Badge variant="outline" className="text-xs mb-2">
                {article.category}
              </Badge>
              <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-sm text-on-surface-variant line-clamp-2 mb-3">{article.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-on-surface-variant">
                <span>{article.author}</span>
                <span>{article.readTime}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// COMMENTS SECTION
// ============================================================================

function CommentsSection() {
  const [commentText, setCommentText] = useState("");

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Comments{" "}
          <span className="text-on-surface-variant font-normal">({comments.length + 1})</span>
        </h2>
      </div>

      {/* Comment Input */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarFallback>ME</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end">
                <Button disabled={!commentText.trim()}>Post Comment</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="space-y-4">
            {/* Main Comment */}
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={comment.author.avatar} />
                <AvatarFallback>{comment.author.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-surface-container rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-xs text-on-surface-variant">{comment.date}</span>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        <DropdownMenuItem>Copy link</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-sm text-foreground/80">{comment.content}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 px-2">
                  <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-foreground transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-foreground transition-colors">
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-14 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex gap-4">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={reply.author.avatar} />
                      <AvatarFallback>{reply.author.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-surface-container rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{reply.author.name}</span>
                          <span className="text-xs text-on-surface-variant">{reply.date}</span>
                        </div>
                        <p className="text-sm text-foreground/80">{reply.content}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-1 px-2">
                        <button className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-foreground transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{reply.likes}</span>
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-foreground transition-colors">
                          <Reply className="h-3.5 w-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="mt-8 text-center">
        <Button variant="outline">Load More Comments</Button>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface-high/80 backdrop-blur-[20px] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/style-guide"
              className="flex items-center gap-2 text-on-surface-variant hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Style Guide</span>
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-display text-xl font-bold tracking-tight">Blog & Editorial</h1>
              <p className="text-on-surface-variant text-sm">
                Typography-focused article layout with serif fonts
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto py-12 px-6">
        <div className="flex gap-12">
          {/* Main Article Content */}
          <div className="flex-1 max-w-prose">
            <ArticleHeader />

            {/* Featured Image */}
            <div className="my-10">
              <div className="aspect-video bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-medium">Featured Image</span>
              </div>
            </div>

            <ArticleBody />
            <AuthorBio />
            <RelatedArticles />
            <CommentsSection />
          </div>

          {/* Sidebar */}
          <TableOfContentsSidebar />
        </div>

        {/* Footer spacing */}
        <div className="h-12" />
      </main>
    </div>
  );
}
