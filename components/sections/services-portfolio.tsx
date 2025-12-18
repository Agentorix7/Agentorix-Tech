"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PortfolioCard } from "@/components/ui/portfolio-card";

type PortfolioData = {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: string | null;
  image: string;
  description: string;
  link: string | null;
  client: string | null;
  metrics: any;
  before: any;
  after: any;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number | null;
};

type PortfolioGridProps = {
  projects: PortfolioData[];
};

// Portfolio Grid Component
function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        return (
          <PortfolioCard
            key={project.id}
            title={project.title}
            category={project.category}
            type={project.type || null}
            image={project.image}
            description={project.description}
            slug={project.slug}
            link={project.link || null}
            metrics={project.metrics as { label: string; value: string; icon: string } | null}
            before={project.before as Record<string, string> | null}
            after={project.after as Record<string, string> | null}
          />
        );
      })}
    </div>
  );
}

type ServicesPortfolioProps = {
  portfolios: PortfolioData[];
};

export function ServicesPortfolio({ portfolios }: ServicesPortfolioProps) {
  // Filter projects by category
  const itProjects = portfolios.filter(p => p.category === "IT Projects");
  const marketingProjects = portfolios.filter(p => p.category === "Marketing Campaigns");
  const aiProjects = portfolios.filter(p => p.category === "AI & Automation");

  return (
    <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f5f9ff] via-white to-[#e8f2ff] z-5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-[480px] h-[480px] bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[140px_140px] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-primary">PORTFOLIO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-2">
            <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
              Our Portfolio & Case Studies
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Real results from real clients across diverse industries
          </p>
        </div>

        {/* Shadcn UI Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <div className="mb-6 sm:mb-8 overflow-x-auto pb-2 -mx-4 sm:mx-0 px-4 sm:px-0 scrollbar-hide">
            <div className="flex justify-center min-w-max sm:min-w-0">
              <TabsList className="bg-card border border-border rounded-lg sm:rounded-xl inline-flex h-auto p-1 sm:p-1.5">
                <TabsTrigger 
                  value="all" 
                  className="cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap"
                >
                  All Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="it-projects"
                  className="cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap"
                >
                  IT Projects
                </TabsTrigger>
                <TabsTrigger 
                  value="marketing"
                  className="cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap"
                >
                  Marketing Campaigns
                </TabsTrigger>
                <TabsTrigger 
                  value="ai-automation"
                  className="cursor-pointer text-xs sm:text-sm px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 whitespace-nowrap"
                >
                  AI & Automation
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="all" className="mt-8">
            <PortfolioGrid projects={portfolios} />
          </TabsContent>

          <TabsContent value="it-projects" className="mt-8">
            <PortfolioGrid projects={itProjects} />
          </TabsContent>

          <TabsContent value="marketing" className="mt-8">
            <PortfolioGrid projects={marketingProjects} />
          </TabsContent>

          <TabsContent value="ai-automation" className="mt-8">
            <PortfolioGrid projects={aiProjects} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
