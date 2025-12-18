"use client";

import { motion } from "motion/react";
import { Mail, Phone, MessageSquare, MapPin } from "lucide-react";

export function ContactHero() {
  const user_email = process.env.NEXT_PUBLIC_USER_EMAIL|| "";
  const user_phone = process.env.NEXT_PUBLIC_USER_PHONE|| "";
  const handleLocationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('office-locations');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-white">CONTACT US</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white">
            Let's Start a Conversation
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you transform your business with cutting-edge solutions.
          </p>

          {/* Quick Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            <motion.a
              href={`mailto:${user_email}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">Email</div>
                <div className="text-white font-semibold">{user_email}</div>
              </div>
            </motion.a>

            <motion.a
              href={`tel:${user_phone}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">Phone</div>
                <div className="text-white font-semibold">{user_phone}</div>
              </div>
            </motion.a>

            <motion.a
              href={`https://wa.me/${user_phone}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">WhatsApp</div>
                <div className="text-white font-semibold">Chat Now</div>
              </div>
            </motion.a>

            <motion.a
              href="#office-locations"
              onClick={handleLocationClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <div className="text-sm text-white/70 mb-1">Location</div>
                <div className="text-white font-semibold">Multiple Offices</div>
              </div>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

