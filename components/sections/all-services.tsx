"use client";

import { ServiceCard } from "@/components/ui/service-card";

type Service = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  image: string;
  icon: string;
};

type AllServicesProps = {
  services: Service[];
};

export function AllServices({ services }: AllServicesProps) {
  return (
    <section className="py-20 bg-linear-to-b from-background to-primary/5 pb-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive digital solutions tailored to your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No services available at the moment.</p>
            </div>
          ) : (
            services.map((service) => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.shortDescription}
                image={service.image}
                icon={service.icon}
                slug={service.slug}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

