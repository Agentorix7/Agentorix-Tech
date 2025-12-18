"use client";
import Image from "next/image";
import { ArrowRight, TrendingUp, Users, Zap, Bot, Megaphone, Code, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

type PortfolioData = {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: string | null;
  image: string;
  description: string;
  link: string | null;
  metrics: any; // JSON from Prisma
};

type PortfolioHighlightProps = {
  portfolios: PortfolioData[];
};

export function PortfolioHighlight({ portfolios }: PortfolioHighlightProps) {
  // Helper function to get icon component from icon name
  const getIconComponent = (iconName: string | null | undefined) => {
    if (!iconName) return TrendingUp; // Default icon
    
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return IconComponent;
    }
    
    // Fallback to default icon if not found
    return TrendingUp;
  };

  // Limit to 6 featured portfolios or first 6 active ones
  const displayedPortfolios = portfolios.slice(0, 6);

  if (displayedPortfolios.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#eef4ff] via-white to-[#d5e6ff] z-7">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-10 w-[520px] h-[520px] bg-primary/15 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-120px] w-[620px] h-[620px] bg-primary/12 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.06),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05),transparent_35%)]" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary">PORTFOLIO</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-linear-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Portfolio Highlights
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto">
            A curated selection of successful client projects with measurable impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayedPortfolios.map((portfolio) => {
            const MetricIcon = portfolio.metrics?.icon
              ? getIconComponent(portfolio.metrics.icon)
              : TrendingUp;
            
            const portfolioLink = portfolio.link || `/portfolio/${portfolio.slug}`;
            const categoryBadge = portfolio.type || portfolio.category;

            return (
              <div
                key={portfolio.id}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden rounded-xl sm:rounded-2xl">
                  <Image
                    src={portfolio.image}
                    alt={portfolio.title}
                    fill
                    className="object-cover p-2 rounded-xl sm:rounded-2xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  
                  {/* Category Badge */}
                  {categoryBadge && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur-sm text-white text-xs font-medium shadow-md">
                        {categoryBadge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 bg-white">
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    <Link href={portfolioLink}>
                      {portfolio.title}
                    </Link>
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                    {portfolio.description}
                  </p>

                  {/* Metrics - Only show if metrics exist */}
                  {portfolio.metrics && 
                   typeof portfolio.metrics === 'object' && 
                   portfolio.metrics !== null &&
                   'label' in portfolio.metrics && 
                   'value' in portfolio.metrics && (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <MetricIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-3xl font-bold text-primary mb-0.5">
                          {String(portfolio.metrics.value)}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {String(portfolio.metrics.label)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/25">
            <Link href="/services">
              View Full Portfolio
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
