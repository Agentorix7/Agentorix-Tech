"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Show button after page load
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const whatsappNumber = process.env.NEXT_PUBLIC_USER_PHONE|| "";// Replace with your WhatsApp Business number
  const message = encodeURIComponent("Hello! I'd like to learn more about your services.");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-6 md:right-6 z-[9999]"
        >
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl sm:rounded-2xl shadow-2xl border-2 border-border p-4 sm:p-6 w-[calc(100vw-2rem)] sm:w-80 max-w-sm"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-foreground">Chat on WhatsApp</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Click the button below to start a conversation with us on WhatsApp.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors text-sm sm:text-base"
              >
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Open WhatsApp
              </a>
            </motion.div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsExpanded(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-2xl flex items-center justify-center transition-colors"
              aria-label="Open WhatsApp chat"
            >
              <MessageCircle className="h-7 w-7 sm:h-8 sm:w-8" />
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

