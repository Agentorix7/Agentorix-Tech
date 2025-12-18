"use client";
import Image from "next/image";
import { Star, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type TestimonialData = {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
};

type TestimonialsProps = {
  testimonials: TestimonialData[];
};

export function Testimonials({ testimonials }: TestimonialsProps) {
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const [isTopHovered, setIsTopHovered] = useState(false);
  const [isBottomHovered, setIsBottomHovered] = useState(false);
  const topPositionRef = useRef(0);
  const bottomPositionRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  // Duplicate testimonials for infinite scroll
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  useEffect(() => {
    const topRow = topRowRef.current;
    const bottomRow = bottomRowRef.current;
    if (!topRow || !bottomRow || testimonials.length === 0) return;

    let animationId: number;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      // Calculate the width of one set of testimonials
      const firstTopCard = topRow.children[0] as HTMLElement;
      const firstBottomCard = bottomRow.children[0] as HTMLElement;
      
      if (firstTopCard && firstBottomCard) {
        const cardWidth = firstTopCard.offsetWidth;
        const gap = 24; // 6 * 4px (gap-6 = 1.5rem = 24px)
        const setWidth = (cardWidth + gap) * testimonials.length;

        // Initialize bottom row position to start from the beginning (negative position)
        if (!isInitializedRef.current) {
          bottomPositionRef.current = -setWidth;
          bottomRow.style.transform = `translateX(${bottomPositionRef.current}px)`;
          isInitializedRef.current = true;
        }

        // Top row scrolls left (only if not hovered)
        if (!isTopHovered) {
          topPositionRef.current -= speed;
          if (Math.abs(topPositionRef.current) >= setWidth) {
            topPositionRef.current = 0;
          }
          topRow.style.transform = `translateX(${topPositionRef.current}px)`;
        }

        // Bottom row scrolls right (only if not hovered)
        if (!isBottomHovered && bottomPositionRef.current !== null) {
          bottomPositionRef.current += speed;
          if (bottomPositionRef.current >= 0) {
            bottomPositionRef.current = -setWidth;
          }
          bottomRow.style.transform = `translateX(${bottomPositionRef.current}px)`;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isTopHovered, isBottomHovered, testimonials.length]);

  const TestimonialCard = ({ testimonial, index }: { testimonial: TestimonialData; index: number }) => (
    <div
      className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 shrink-0 w-full sm:w-[400px]"
    >
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 opacity-10">
        <Quote className="h-16 w-16 text-primary" />
      </div>

      {/* Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />

      <div className="relative z-10">
        {/* Rating */}
        <div className="flex gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="h-5 w-5 fill-primary text-primary"
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-muted-foreground mb-6 leading-relaxed text-lg">
          "{testimonial.content}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              src={testimonial.image || "/icon.png"}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {testimonial.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {testimonial.role}
            </div>
            <div className="text-xs text-primary font-medium">
              {testimonial.company}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f5f5ff] via-white to-[#e6e6ff] z-6">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/3 w-[420px] h-[420px] bg-primary/12 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-120px] w-[520px] h-[520px] bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:140px_140px] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary">TESTIMONIALS</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            <span className="bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent">
              Client Testimonials
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-2xl mx-auto">
            Industry leaders trust {process.env.NEXT_PUBLIC_SITE_NAME} for reliability, innovation, and measurable results
          </p>
        </div>

        {/* Top Row - Scrolls Left */}
        <div 
          className="mb-6 overflow-hidden"
          onMouseEnter={() => setIsTopHovered(true)}
          onMouseLeave={() => setIsTopHovered(false)}
        >
          <div
            ref={topRowRef}
            className="flex gap-6 will-change-transform"
            style={{ transition: isTopHovered ? 'transform 0.3s ease-out' : 'none' }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`top-${testimonial.id}-${index}`} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom Row - Scrolls Right */}
        <div 
          className="overflow-hidden"
          onMouseEnter={() => setIsBottomHovered(true)}
          onMouseLeave={() => setIsBottomHovered(false)}
        >
          <div
            ref={bottomRowRef}
            className="flex gap-6 will-change-transform"
            style={{ transition: isBottomHovered ? 'transform 0.3s ease-out' : 'none' }}
          >
            {duplicatedTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`bottom-${testimonial.id}-${index}`} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
