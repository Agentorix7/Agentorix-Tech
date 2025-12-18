"use client";
import Image from "next/image";
import { Users, Lightbulb, Heart, Zap, Target, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const cultureValues = [
  {
    icon: Users,
    title: "Collaborative Environment",
    description: "We believe in the power of teamwork and open communication.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
  },
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "Encouraging creative thinking and cutting-edge solutions.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    icon: Heart,
    title: "Work-Life Balance",
    description: "Supporting our team's well-being and personal growth.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&h=400&fit=crop",
  },
  {
    icon: Zap,
    title: "Continuous Learning",
    description: "Investing in professional development and skill enhancement.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "Focusing on measurable outcomes and client success.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "Embracing diversity and international best practices.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
  },
];

const cultureImages = [
  {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    event: "Team Collaboration Session",
    date: "Q1 2024",
    description: "Our team working together on innovative solutions in a collaborative environment.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    event: "Innovation Workshop",
    date: "Q2 2024",
    description: "Brainstorming session where we explore new technologies and creative approaches.",
  },
  {
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop",
    event: "Strategy Planning Meeting",
    date: "Q3 2024",
    description: "Planning our roadmap and discussing strategies for client success.",
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    event: "Data Analytics Review",
    date: "Q4 2024",
    description: "Reviewing performance metrics and analyzing data to drive better decisions.",
  },
];

// Duplicate images for infinite scroll
const duplicatedCultureImages = [...cultureImages, ...cultureImages, ...cultureImages];

export function CompanyCulture() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const positionRef = useRef(0);

  useEffect(() => {
    const galleryContainer = galleryRef.current;
    if (!galleryContainer) return;

    let animationId: number;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      const firstCard = galleryContainer.children[0] as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 16; // gap-4 = 1rem = 16px
        const setWidth = (cardWidth + gap) * cultureImages.length;

        if (!isHovered) {
          positionRef.current -= speed;
          if (Math.abs(positionRef.current) >= setWidth) {
            positionRef.current = 0;
          }
          galleryContainer.style.transform = `translateX(${positionRef.current}px)`;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  return (
    <section className="py-20 relative overflow-hidden rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] z-6">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-background" />s
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              Company Culture
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our work philosophy and culture highlights
          </p>
        </div>

        {/* Culture Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {cultureValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
              >
                {/* Image Background */}
                <div className="absolute inset-0 opacity-50 group-hover:opacity-10 transition-opacity duration-500">
                  <Image
                    src={value.image}
                    alt={value.title}
                    fill
                    className="object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative p-6 z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-7 w-7 text-foreground group-hover:text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Culture Images Gallery - Auto-scrolling with Flip Cards */}
        <div
          className="overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            ref={galleryRef}
            className="flex gap-4 will-change-transform"
            style={{ transition: isHovered ? 'transform 0.3s ease-out' : 'none' }}
          >
            {duplicatedCultureImages.map((item, index) => (
              <div
                key={index}
                className="group relative aspect-square rounded-xl overflow-visible shrink-0 w-[300px] cursor-pointer"
                style={{ perspective: "1000px" }}
                onMouseEnter={() => {
                  setIsHovered(true);
                  setHoveredCardIndex(index);
                }}
                onMouseLeave={() => {
                  setIsHovered(false);
                  setHoveredCardIndex(null);
                }}
              >
                {/* Flip Card */}
                <div 
                  className="relative w-full h-full rounded-xl"
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.7s",
                    transform: hoveredCardIndex === index ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Front Side - Image */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl overflow-hidden"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.event}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
                  </div>

                  {/* Back Side - Event Information */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-xl overflow-hidden bg-primary border-2 border-primary/50"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center">
                      <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-primary-foreground text-xs font-medium mb-3">
                          {item.date}
                        </div>
                        <h3 className="text-primary-foreground font-bold text-lg mb-3">
                          {item.event}
                        </h3>
                        <p className="text-primary-foreground/90 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

