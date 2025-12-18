"use client";
import Image from "next/image";
import Link from "next/link";
import { 
  Phone, 
  MapPin, 
  Mail, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "IT Services", href: "/services/it-services" },
  { name: "Digital Marketing", href: "/services/digital-marketing" },
  { name: "AI Solutions", href: "/services/ai-sales-agent" },
  { name: "Web Development", href: "/services/web-app-development" },
  { name: "Lead Generation", href: "/services/lead-generation" },
];

const socialLinks = [
  { name: "Facebook", icon: Facebook, href: process.env.NEXT_PUBLIC_FACEBOOK_URL || "" },
  { name: "Twitter", icon: Twitter, href: process.env.NEXT_PUBLIC_TWITTER_URL || "" },
  { name: "LinkedIn", icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "" },
  { name: "Instagram", icon: Instagram, href: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "" },
];

export function Footer() {
  const [email, setEmail] = useState("");

  const user_email = process.env.NEXT_PUBLIC_USER_EMAIL || "";
  const user_phone = process.env.NEXT_PUBLIC_USER_PHONE || "";

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Newsletter subscription:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/logo.png"
                alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Solutions`}
                width={150}
                height={60}
                className="h-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {process.env.NEXT_PUBLIC_SITE_NAME} delivers cutting-edge digital solutions that drive revenue, 
              automate operations, and scale your business.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a href={`tel:${user_phone}`} className="hover:text-primary transition-colors">
                  {user_phone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>
                  Building 40C Office 07, 4th Floor<br />
                  Main Khayaban-e-Bukhari<br />
                  DHA Phase 6, Karachi
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${user_email}`} className="hover:text-primary transition-colors">
                  {user_email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to get updates on our latest solutions and industry insights.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3 text-foreground">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary hover:text-primary transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_SITE_NAME} Solutions. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <Link
                href="/terms-of-service"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link
                href="/privacy-policy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

