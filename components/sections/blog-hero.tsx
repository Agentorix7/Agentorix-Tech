"use client";

import { motion } from "motion/react";
import { FileText } from "lucide-react";

export function BlogHero() {
  return (
    <section className="relative py-24 overflow-hidden pt-32 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[200px] bg-linear-to-b from-primary via-primary/95 to-primary/90 z-5">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <FileText className="h-5 w-5 text-white" />
            <span className="text-xs font-semibold tracking-[0.25em] text-white">BLOG</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
            Blog
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
            Discover insightful resources and expert advice from our seasoned team to elevate your knowledge.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

