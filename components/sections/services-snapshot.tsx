"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

type ServiceSnapshotItem = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  icon: string | null;
};

type ServicesSnapshotProps = {
  services: ServiceSnapshotItem[];
};

export function ServicesSnapshot({ services }: ServicesSnapshotProps) {
  return (
    <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#e7f9ff] via-white to-[#c9f2ff] z-10">
      {/* Soft glow accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-16 w-96 h-96 bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-20 right-10 w-[480px] h-[480px] bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[140px_140px] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.2em] text-primary">SERVICES</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
            <span className="bg-linear-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Our Core Services
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto">
            Explore our full suite of digital transformation services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 auto-rows-fr">
          {services.map((service) => {
            const IconComponent = service.icon
              ? (LucideIcons[service.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>)
              : null;

            return (
              <div
                key={service.id}
                className={`group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card/90 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 backdrop-blur-sm`}
              >
                {/* Image Background - always visible, subtle hover lift */}
                <div className="absolute inset-0 opacity-90 group-hover:opacity-80 transition-opacity duration-400 ease-in-out">
                  {service.image ? (
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted" />
                  )}
                </div>

                {/* Soft wash overlay for readability */}
                <div className="absolute inset-0 group-hover:bg-white/10 transition-colors duration-300" />

                {/* Gradient tint on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-primary/5 to-primary/10 opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                
                {/* Top gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-linear-to-t from-card/90 via-card/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="relative p-6 z-10 h-full flex flex-col">
                  {/* Icon */}
                  {IconComponent && (
                    <div className="w-14 h-14 rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-7 w-7 text-primary" />
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 grow">
                    {service.shortDescription}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center z-10 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/services/${service.slug}`} className="z-10 flex items-center">
                      <span className="text-sm font-medium">Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="border-2 border-primary/30 hover:bg-primary/10 text-primary hover:text-primary hover:border-primary/50 shadow-lg shadow-primary/10">
            View All Services
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

