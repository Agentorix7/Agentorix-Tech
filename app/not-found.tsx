"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Animated 404 */}
        <div className="relative">
          <h1 className="text-9xl sm:text-[12rem] font-bold bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 rounded-full" />
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
          >
            <Link href="/services">
              <Search className="mr-2 h-5 w-5" />
              Browse Services
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Popular Pages:</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Services
            </Link>
            <Link
              href="/blog"
              className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

