"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";


export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true); // Show navbar at the top
      } else {
        if (direction < 0) {
          setVisible(true); // Show when scrolling up
        } else {
          setVisible(false); // Hide when scrolling down
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-5xl top-4 fixed left-4 right-4 sm:left-6 sm:right-6 md:inset-x-0 md:mx-auto bg-background/30 backdrop-blur-sm border border-border rounded-full shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-5000 px-3 sm:px-4 md:px-6 py-2 items-center gap-2 sm:gap-4 md:gap-8",
          className
        )}
      >
        {/* Desktop: Left Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 flex-1 justify-around">
          {navItems.slice(0, Math.ceil(navItems.length / 2)).map((navItem: any, idx: number) => (
            <Link
              key={`link-left=${idx}`}
              href={navItem.link}
              className={cn(
                "relative items-center flex space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              )}
            >
              <span>{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile: Left Navigation Links (Icons with text) */}
        <div className="flex md:hidden items-center space-x-1 sm:space-x-2 flex-1 justify-around">
          {navItems.slice(0, Math.ceil(navItems.length / 2)).map((navItem: any, idx: number) => (
            <Link
              key={`mobile-link-left=${idx}`}
              href={navItem.link}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 rounded-lg transition-colors hover:bg-primary/10 group"
              )}
            >
              {navItem.icon && (
                <span className="text-muted-foreground group-hover:text-primary transition-colors [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                  {navItem.icon}
                </span>
              )}
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors leading-tight">
                {navItem.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Center Logo */}
        <Link href="/" className="shrink-0 flex items-center justify-center mx-1 sm:mx-2">
          {/* Small screen icon */}
          <Image 
            src="/icon.png" 
            alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Solutions`} 
            width={40} 
            height={40}
            className="w-8 h-8 sm:w-10 sm:h-10 md:hidden"
          />
          {/* Large screen logo */}
          <Image 
            src="/logo.png" 
            alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Solutions`} 
            width={120} 
            height={250}
            className="hidden md:block w-[120px] h-auto"
          />
        </Link>
        
        {/* Desktop: Right Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 flex-1 justify-around">
          {navItems.slice(Math.ceil(navItems.length / 2)).map((navItem: any, idx: number) => (
            <Link
              key={`link-right=${idx}`}
              href={navItem.link}
              className={cn(
                "relative items-center flex space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
              )}
            >
              <span>{navItem.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile: Right Navigation Links (Icons with text) */}
        <div className="flex md:hidden items-center space-x-1 sm:space-x-2 flex-1 justify-around">
          {navItems.slice(Math.ceil(navItems.length / 2)).map((navItem: any, idx: number) => (
            <Link
              key={`mobile-link-right=${idx}`}
              href={navItem.link}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-1 sm:px-2 py-1 rounded-lg transition-colors hover:bg-primary/10 group"
              )}
            >
              {navItem.icon && (
                <span className="text-muted-foreground group-hover:text-primary transition-colors [&>svg]:h-4 [&>svg]:w-4 sm:[&>svg]:h-5 sm:[&>svg]:w-5">
                  {navItem.icon}
                </span>
              )}
              <span className="text-[10px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors leading-tight">
                {navItem.name}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
