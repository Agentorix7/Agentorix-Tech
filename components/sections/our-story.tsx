"use client";
import Image from "next/image";

export function OurStory() {
  const user_email = process.env.NEXT_PUBLIC_USER_EMAIL|| "";
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      {/* Dark background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Image */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=800&fit=crop"
                alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Solutions - Digital Transformation`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
            </div>
          </div>

          {/* Right Column - Story Text */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8 text-foreground">
              The {process.env.NEXT_PUBLIC_SITE_NAME} Story
            </h2>
            
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                Based on our commitment to excellence, {process.env.NEXT_PUBLIC_SITE_NAME} Solutions is a leading digital transformation partner 
                for businesses worldwide and a trusted technology provider for global enterprises deploying advanced 
                digital solutions. {process.env.NEXT_PUBLIC_SITE_NAME} supports clients in two ways: accelerating digital transformation with 
                high-quality development, advanced AI-powered automation pipelines that push the boundaries of 
                efficiency, scalability, and innovation, plus expert technology teams with expertise in web 
                development, mobile apps, AI integration, cloud infrastructure, and digital marketing; and 
                applying that expertise to help enterprises transform ideas from proof of concept into 
                proprietary digital assets: systems that perform, deliver impact, and drive lasting results 
                on the bottom line.
              </p>
            </div>
            
            <div className="mt-8">
              <p className="text-muted-foreground">
                For more information:{" "}
                <a
                  href={`mailto:${user_email}`}
                  className="text-primary hover:text-primary/80 underline transition-colors"
                >
                  {user_email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

