"use client";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-12 sm:pt-16 md:pt-20 mt-8 sm:mt-12 md:mt-16 mx-4 sm:mx-8 md:mx-12 lg:mx-16 rounded-t-[50px] sm:rounded-t-[75px] md:rounded-t-[100px] lg:rounded-t-[150px]">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10" />
      
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-primary/20 animate-pulse" />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      {/* <video src="/about.mp4" autoPlay muted loop className="absolute inset-0 w-full h-full object-cover opacity-90 " /> */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">About {process.env.NEXT_PUBLIC_SITE_NAME}</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Empowering Digital
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Transformation
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            We are a multi-disciplinary technology & marketing company helping global brands 
            build digital efficiency, accelerate revenue, and automate operations.
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
    </section>
  );
}

