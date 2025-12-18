"use client";
import { Award, Trophy, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import * as LucideIcons from "lucide-react";

type AchievementData = {
  id: string;
  type: "ACHIEVEMENT" | "CERTIFICATION";
  // Achievement fields
  icon: string | null;
  title: string | null;
  organization: string | null;
  year: string | null;
  description: string | null;
  image: string | null;
  // Certification fields
  name: string | null;
  status: string | null;
  logo: string | null;
};

type AchievementsProps = {
  achievements: AchievementData[];
  certifications: AchievementData[];
};

export function Achievements({ achievements, certifications }: AchievementsProps) {
  const certificationsRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const positionRef = useRef(0);

  // Duplicate certifications for infinite scroll
  const duplicatedCertifications = [...certifications, ...certifications, ...certifications];

  useEffect(() => {
    const certificationsContainer = certificationsRef.current;
    if (!certificationsContainer || certifications.length === 0) return;

    let animationId: number;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      const firstCard = certificationsContainer.children[0] as HTMLElement;
      if (firstCard) {
        const cardWidth = firstCard.offsetWidth;
        const gap = 16; // gap-4 = 1rem = 16px
        const setWidth = (cardWidth + gap) * certifications.length;

        if (!isHovered) {
          positionRef.current -= speed;
          if (Math.abs(positionRef.current) >= setWidth) {
            positionRef.current = 0;
          }
          certificationsContainer.style.transform = `translateX(${positionRef.current}px)`;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isHovered, certifications.length]);

  // Helper function to get icon component from icon name
  const getIconComponent = (iconName: string | null | undefined) => {
    if (!iconName) return Award; // Default icon
    
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return IconComponent;
    }
    
    // Fallback to default icon if not found
    return Award;
  };

  if (achievements.length === 0 && certifications.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-linear-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
              Achievements & Certifications
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Recognized excellence and industry certifications
          </p>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {achievements.map((achievement) => {
              const Icon = getIconComponent(achievement.icon);
              return (
                <div
                  key={achievement.id}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Image Background */}
                  {achievement.image && (
                    <div className="absolute inset-0 opacity-50 group-hover:opacity-10 transition-opacity duration-500">
                      <Image
                        src={achievement.image}
                        alt={achievement.title || "Achievement"}
                        fill
                        className="object-cover scale-100 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative p-6 z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-foreground group-hover:text-primary" />
                    </div>

                    {/* Year Badge */}
                    {achievement.year && (
                      <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-foreground group-hover:text-primary text-xs font-medium mb-3">
                        {achievement.year}
                      </div>
                    )}

                    {/* Content */}
                    {achievement.title && (
                      <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                        {achievement.title}
                      </h3>
                    )}
                    {achievement.organization && (
                      <p className="text-foreground group-hover:text-primary text-sm font-medium mb-2">
                        {achievement.organization}
                      </p>
                    )}
                    {achievement.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="bg-card rounded-xl sm:rounded-2xl border border-border p-6 sm:p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center text-foreground">
              Certifications & Partnerships
            </h3>
            <div
              className="overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div
                ref={certificationsRef}
                className="flex gap-4 will-change-transform"
                style={{ transition: isHovered ? 'transform 0.3s ease-out' : 'none' }}
              >
                {duplicatedCertifications.map((cert, index) => (
                  <div
                    key={`${cert.id}-${index}`}
                    className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg sm:rounded-xl bg-linear-to-br from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 shrink-0 w-[200px]"
                  >
                    {/* Company Logo */}
                    <div className="relative w-16 h-16 mb-3 rounded-full overflow-hidden bg-white border border-border/50 flex items-center justify-center">
                      {cert.logo ? (
                        <Image
                          src={cert.logo}
                          alt={cert.name || "Certification"}
                          fill
                          className="object-contain"
                        />
                      ) : (
                        <Award className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    {/* Certification Name */}
                    <div className="text-center">
                      {cert.name && (
                        <div className="text-sm font-semibold text-foreground mb-1">
                          {cert.name}
                        </div>
                      )}
                      {cert.status && (
                        <div className="text-xs text-muted-foreground">
                          {cert.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
