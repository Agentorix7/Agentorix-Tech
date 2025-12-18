"use client";
import { 
  Globe2, 
  Award, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Brain
} from "lucide-react";

const features = [
  {
    icon: Globe2,
    title: "360° Digital Transformation",
    description: "End-to-end solutions covering every aspect of your digital presence",
    gradient: "from-primary/20 to-primary/10",
  },
  {
    icon: Award,
    title: "Certified Experts",
    description: "Team of certified professionals across IT, AI & Marketing",
    gradient: "from-primary/20 to-primary/10",
  },
  {
    icon: TrendingUp,
    title: "Proven Track Record",
    description: "Success stories across 20+ industries with measurable results",
    gradient: "from-primary/20 to-primary/10",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Clear, upfront pricing with no hidden fees or surprises",
    gradient: "from-primary/20 to-primary/10",
  },
  {
    icon: Zap,
    title: "AI-Powered Workflow",
    description: "Leverage cutting-edge AI to automate and optimize operations",
    gradient: "from-primary/20 to-primary/10",
  },
  {
    icon: Brain,
    title: "Reliable Support",
    description: "Dedicated support teams, quick issue resolution.",
    gradient: "from-primary/20 to-primary/10",
  },
];

export function WhyChoose() {
  return (
    <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f2fbff] via-white to-[#dff3ff] z-9">
      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[420px] h-[420px] bg-primary/12 blur-3xl" />
        <div className="absolute bottom-[-180px] right-0 w-[520px] h-[520px] bg-primary/14 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_0%,transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_50%,rgba(255,255,255,0.05),transparent_30%)]" />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary">WHY {process.env.NEXT_PUBLIC_SITE_NAME}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            <span className="bg-linear-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Why Choose {process.env.NEXT_PUBLIC_SITE_NAME}
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto">
            Enterprise-grade solutions with transparent execution and proven results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 rounded-xl sm:rounded-2xl transition-opacity duration-300`} />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

