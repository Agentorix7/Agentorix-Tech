"use client";
import { Search, Target, Rocket, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";

const processSteps = [
  {
    step: "01",
    title: "Discovery & Consultation",
    description: "We begin by understanding your business goals, challenges, and opportunities through comprehensive consultations and analysis.",
    icon: Search,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    step: "02",
    title: "Strategy Development",
    description: "Our experts create a tailored strategy aligned with your objectives, leveraging data-driven insights and industry best practices.",
    icon: Target,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    step: "03",
    title: "Execution & Implementation",
    description: "We execute your strategy with precision, using agile methodologies and cutting-edge technologies to deliver results efficiently.",
    icon: Rocket,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    step: "04",
    title: "Optimization & Reporting",
    description: "Continuous monitoring, optimization, and detailed reporting ensure your solutions evolve and deliver maximum value over time.",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  },
];

export function OurProcess() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Our Process
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A proven methodology for delivering exceptional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {processSteps.map((process, index) => {
            const Icon = process.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image Background */}
                <div className="absolute inset-0 opacity-70 group-hover:opacity-10 transition-opacity duration-500">
                  <Image
                    src={process.image}
                    alt={process.title}
                    fill
                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-6 z-10">
                  {/* Step Number */}
                  <div className="text-5xl font-bold text-primary/20 mb-4 group-hover:text-primary/30 transition-colors">
                    {process.step}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {process.title}
                  </h3>
                  <p className="text-white group-hover:text-foreground text-sm leading-relaxed mb-4">
                    {process.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Process Flow Visualization */}
        <div className="hidden lg:flex items-center justify-center gap-4 mt-12">
          {processSteps.map((process, index) => (
            <div key={index} className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                <span className="text-primary font-bold text-sm">{process.step}</span>
              </div>
              {index < processSteps.length - 1 && (
                <ArrowRight className="h-6 w-6 text-primary/30 mx-2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

