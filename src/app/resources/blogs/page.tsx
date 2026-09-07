import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumCtaSection from "@/components/ui/PremiumCtaSection";
import { Clock, User, Calendar } from "lucide-react";
import Link from "next/link";

const BLOG_POSTS = [
  {
    id: "1",
    title: "How to Lower CPA by 40% with Authentic UGC",
    excerpt: "A complete tear-down of how top D2C brands are replacing expensive studio shoots with high-volume, authentic creator content to drastically lower their acquisition costs.",
    category: "Case Study",
    author: "Sarah Jenkins",
    date: "Oct 12, 2026",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: true
  },
  {
    id: "2",
    title: "The 3 Social Hooks That Convert in 2026",
    excerpt: "Stop guessing what works. We analyzed over 10,000 top-performing ad creatives to find the exact hook structures that maximize retention in the first 3 seconds.",
    category: "Strategy",
    author: "Marcus Chen",
    date: "Oct 08, 2026",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1616469829941-c7200edec809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "3",
    title: "B2B Influencer Marketing: A Playbook",
    excerpt: "Influencers aren't just for lip gloss anymore. Learn how enterprise SaaS companies are using LinkedIn creators to drive high-intent demos.",
    category: "B2B SaaS",
    author: "Elena Rodriguez",
    date: "Oct 01, 2026",
    readTime: "12 min read",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "4",
    title: "Automating Commercial Content Rights",
    excerpt: "The legal nightmare of UGC usage rights is over. Here is how smart contracts and automated whitelisting are protecting brands globally.",
    category: "Legal & Compliance",
    author: "David Kim",
    date: "Sep 28, 2026",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "5",
    title: "Scaling Creator Collaboration Workflows",
    excerpt: "Workflows are the heartbeat of campaigns. A step-by-step guide to scaling creator collaborations using structured platform workflows.",
    category: "Creator Workflows",
    author: "Sarah Jenkins",
    date: "Sep 22, 2026",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "6",
    title: "Creator Payouts: The 1099 Nightmare",
    excerpt: "Paying 500 creators globally doesn't have to break your accounting team. How to completely automate tax compliance and escrow.",
    category: "Finance",
    author: "Krishna Asthawani",
    date: "Sep 15, 2026",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    featured: false
  }
];

export const metadata = {
  title: "Insights & Strategies | UGC FY Blog",
  description: "Read the latest trends, case studies, and tactical advice from the forefront of the creator economy.",
};

export default function BlogPage() {
  const featuredPost = BLOG_POSTS.find(post => post.featured);
  const regularPosts = BLOG_POSTS.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar theme="dark" />

      <main className="flex-1 pt-[76px]">
        {/* Blog Header */}
        <section className="py-20 bg-slate-50 border-b border-slate-100">
          <div className="max-w-[1280px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Insights & <span className="text-[var(--color-primary)]">Strategies</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl">
              Deep-dive case studies, algorithmic tear-downs, and tactical advice from the smartest marketers in the creator economy.
            </p>
          </div>
        </section>

        {/* Featured Article */}
        {featuredPost && (
          <section className="py-16">
            <div className="max-w-[1280px] mx-auto px-6">
              <article className="group relative bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col lg:flex-row hover:shadow-2xl transition-all duration-300">
                <div className="lg:w-1/2 relative aspect-video lg:aspect-auto overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredPost.imageUrl}
                    alt={featuredPost.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900">
                    Featured
                  </div>
                </div>
                <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-sm font-semibold text-[var(--color-primary)]">{featuredPost.category}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                    <time className="text-sm font-medium text-slate-500 flex items-center gap-1"><Calendar className="w-4 h-4" />{featuredPost.date}</time>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-6 leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                    <Link href={`/resources/blogs/${featuredPost.id}`} className="before:absolute before:inset-0">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center"><User className="w-5 h-5 text-slate-500" /></div>
                      <span className="font-semibold text-slate-900">{featuredPost.author}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1"><Clock className="w-4 h-4" />{featuredPost.readTime}</span>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Blog Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-[1280px] mx-auto px-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-10">Latest Articles</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <article key={post.id} className="group flex flex-col bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-slate-900 shadow-sm">
                      {post.category}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 leading-snug group-hover:text-[var(--color-primary)] transition-colors">
                      <Link href={`/resources/blogs/${post.id}`} className="before:absolute before:inset-0">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-16 text-center">
              <button className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold rounded-xl transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </section>

        <PremiumCtaSection
          title="Stay ahead of the curve."
          description="Subscribe to our newsletter for weekly insights or start your free trial today."
        />
      </main>

      <Footer />
    </div>
  );
}
