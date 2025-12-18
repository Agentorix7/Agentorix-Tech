import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type IndustrySnapshot = {
  id: string;
  name: string;
  description: string;
  image: string;
  painPoints: string[];
  solutions: string[];
};

export async function IndustriesServe() {
  const industriesFromDb = await prisma.industry.findMany({
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
      description: true,
      image: true,
      services: true,
    },
  });

  const industries: IndustrySnapshot[] = industriesFromDb.map((industry) => {
    const services = industry.services as any;
    const painPoints = Array.isArray(services?.painPoints) ? services.painPoints : [];
    const solutions = Array.isArray(services?.solutions) ? services.solutions : [];

    return {
      id: industry.id,
      name: industry.name,
      description: industry.description || "",
      image:
        industry.image ||
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
      painPoints,
      solutions,
    };
  }).slice(0, 10);

  return (
    <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#e9f9f4] via-white to-[#c9f1e6] z-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/4 w-[520px] h-[520px] bg-primary/12 blur-3xl" />
        <div className="absolute bottom-[-180px] right-[-80px] w-[620px] h-[620px] bg-primary/14 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[140px_140px] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary">INDUSTRIES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            <span className="bg-linear-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Industries We Serve
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto">
            Proven expertise across diverse sectors with tailored solutions
          </p>
        </div>

        {industries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No industries available at the moment.</p>
          </div>
        ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {industries.map((industry) => (
            <div
              key={industry.id}
              className="group relative aspect-4/5 md:aspect-3/4 rounded-lg sm:rounded-xl cursor-pointer flip-card-container"
            >
              {/* Flip Card Container */}
              <div className="flip-card-inner">
                {/* Front Side */}
                <div className="flip-card-front absolute inset-0 w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-card border border-border">
                  <Image
                    src={industry.image}
                    alt={industry.name}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/50 to-transparent" />
                  
                  {/* Front Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                    <h3 className="text-white font-bold text-base sm:text-lg mb-2">
                      {industry.name}
                    </h3>
                    <p className="text-white/90 text-xs sm:text-sm">
                      {industry.description}
                    </p>
                  </div>
                </div>

                {/* Back Side */}
                <div className="flip-card-back absolute inset-0 w-full h-full rounded-lg sm:rounded-xl overflow-hidden bg-linear-to-br from-primary via-primary/90 to-primary/80 border-2 border-primary/50">
                  {/* Back Content */}
                  <div className="absolute inset-0 p-4 flex flex-col">
                    <div className="mb-3">
                      <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                        {industry.name}
                      </h3>
                      <p className="text-white/80 text-xs mb-3">
                        {industry.description}
                      </p>
                    </div>
                    
                    {/* Pain points & our solutions */}
                    <div className="flex-1 overflow-y-auto space-y-3">
                      {industry.painPoints.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold text-white/80 mb-1">
                            Pain points
                          </p>
                          <ul className="space-y-1">
                            {industry.painPoints.slice(0, 3).map((point, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-white/90 text-xs"
                              >
                                <span className="mt-0.5 text-white">•</span>
                                <span className="leading-tight">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {industry.solutions.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold text-white/80 mb-1">
                            Our solutions
                          </p>
                          <ul className="space-y-1">
                            {industry.solutions.slice(0, 3).map((solution, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-white/90 text-xs"
                              >
                                <CheckCircle2 className="h-3 w-3 text-white mt-0.5 shrink-0" />
                                <span className="leading-tight">{solution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    
                    {/* Learn More Button */}
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="flex items-center justify-center gap-1 text-white text-xs font-medium group-hover:gap-2 transition-all">
                        <span>Learn more</span>
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        <div className="text-center">
          <Link href={'/services#industries'}>
          <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 text-primary hover:text-primary hover:border-primary/50">
            Explore All Industries
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

