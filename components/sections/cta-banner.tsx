"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTABanner() {
  const user_phone = process.env.NEXT_PUBLIC_USER_PHONE|| "";
  return (
    <section className="py-24 relative overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#00c2c7] via-[#00b1bb] to-[#009aa8] z-1">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:32px_32px] opacity-70" />
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/15 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/15 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-8">
            <Sparkles className="h-10 w-10 text-white" />
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-white">
            Start Your Project Today
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl sm:text-2xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Let's Build Your Digital Future Together
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="group text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-lg shadow-white/20"
            >
              <Link href="/contact" className="flex items-center justify-center">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-white/30 bg-transparent text-white hover:bg-white/10 hover:border-white/50"
            >
              <Link href={`https://wa.me/${user_phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              Schedule Consultation
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">50+ Clients</div>
              <div className="text-sm">Projects Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">100% Satisfaction</div>
              <div className="text-sm">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">24/7 Support</div>
              <div className="text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

