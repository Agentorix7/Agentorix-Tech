import Image from "next/image";
import { CheckCircle2, AlertCircle, Lightbulb, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";

type IndustryData = {
  id: string;
  name: string;
  image: string;
  services: {
    painPoints?: string[];
    solutions?: string[];
    caseStudy?: {
      title: string;
      result: string;
      description: string;
    };
  } | null;
};

export async function ServicesIndustries() {
  const industries = await prisma.industry.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      name: true,
      image: true,
      services: true,
    },
  });

  // Transform database data to match component structure
  const transformedIndustries: IndustryData[] = industries.map((industry) => {
    const services = industry.services as any;
    return {
      id: industry.id,
      name: industry.name,
      image: industry.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      services: services || {
        painPoints: [],
        solutions: [],
        caseStudy: { title: "", result: "", description: "" },
      },
    };
  });

  return (
    <section id="industries" className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f0f9ff] via-white to-[#e0f2fe] z-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-[480px] h-[480px] bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[140px_140px] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary">INDUSTRIES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
              Industries We Serve
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tailored solutions addressing specific industry challenges
          </p>
        </div>

        {transformedIndustries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No industries available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {transformedIndustries.map((industry) => {
              const painPoints = industry.services?.painPoints || [];
              const solutions = industry.services?.solutions || [];
              const caseStudy = industry.services?.caseStudy || { title: "", result: "", description: "" };

              return (
                <div
                  key={industry.id}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Image Background */}
                  <div className="absolute inset-0 opacity-90 group-hover:opacity-75 transition-opacity duration-500 ease-in-out">
                    <Image
                      src={industry.image}
                      alt={industry.name}
                      fill
                      className="object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Hover Background Animation */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out" />
                  <div className="absolute inset-0 bg-linear-to-t from-card/95 via-card/70 to-transparent" />

                  {/* Content */}
                  <div className="relative p-6 z-10">
                    <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                      {industry.name}
                    </h3>
                    
                    {/* Pain Points */}
                    {painPoints.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          <h4 className="text-sm font-semibold text-foreground">Pain Points</h4>
                        </div>
                        <ul className="space-y-1">
                          {painPoints.slice(0, 3).map((point, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-red-500 mt-0.5">•</span>
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Solutions */}
                    {solutions.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <h4 className="text-sm font-semibold text-foreground">Our Solutions</h4>
                        </div>
                        <ul className="space-y-1">
                          {solutions.slice(0, 3).map((solution, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                              <span>{solution}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Case Study */}
                    {caseStudy.title && (
                      <div className="pt-3 border-t border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h4 className="text-sm font-semibold text-foreground">Case Study</h4>
                        </div>
                        <p className="text-xs font-medium text-primary mb-1">{caseStudy.title}</p>
                        {caseStudy.result && (
                          <p className="text-xs text-muted-foreground">{caseStudy.result}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* <div className="text-center">
          <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 text-primary hover:text-primary hover:border-primary/50">
            Explore All Industries
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div> */}
      </div>
    </section>
  );
}

