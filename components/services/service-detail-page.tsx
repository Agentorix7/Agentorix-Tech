"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Star } from "lucide-react";
import { ServiceData } from "@/lib/services-data";

interface ServiceDetailPageProps {
  service: ServiceData;
}

export function ServiceDetailPage({ service }: ServiceDetailPageProps) {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-b-[150px]">
        {/* Service Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920&h=1080&fit=crop"}
            alt={service.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/50 z-[1]" />

        {/* Content */}
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
            {service.title}
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
            {service.shortDescription || service.overview}
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-white">
            <Link href={service.cta.link}>
              {service.cta.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Overview Section */}
      {service.overview && (
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Overview
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed text-center">
                {service.overview}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Services Sections */}
      {service.sections && service.sections.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Our {service.title}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {service.sections.map((section, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 p-8"
                >
                  <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {section.content}
                  </p>
                  {section.items && section.items.length > 0 && (
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {service.features && service.features.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Key Features
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {service.features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-center"
                >
                  <Star className="h-8 w-8 text-primary mx-auto mb-3" />
                  <p className="text-foreground font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Benefits
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {service.benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border"
                >
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-foreground">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Use Cases Section */}
      {service.useCases && service.useCases.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Use Cases
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {service.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <p className="text-foreground font-medium">{useCase}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies Section */}
      {service.caseStudies && service.caseStudies.length > 0 && (
        <section className="py-20 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Case Studies
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {service.caseStudies.map((caseStudy, index) => (
                <div
                  key={index}
                  className="p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  <h3 className="text-2xl font-semibold mb-3 text-foreground">
                    {caseStudy.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {caseStudy.description}
                  </p>
                  {caseStudy.results && caseStudy.results.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground mb-2">Results:</p>
                      {caseStudy.results.map((result, resultIndex) => (
                        <div key={resultIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                          <span>{result}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {service.pricing && (
        <section className="py-20 bg-gradient-to-b from-background to-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  {service.pricing.title}
                </span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {service.pricing.description}
              </p>
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/contact">
                  Get a Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Let's discuss how {service.title} can transform your business
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
            <Link href={service.cta.link}>
              {service.cta.text}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

