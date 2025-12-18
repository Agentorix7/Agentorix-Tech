"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Minimize2, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
type ChatMessage = {
  id?: string;
  text: string;
  sender: "user" | "bot";
  time: string;
  recommendedServices?: string[];
  showBookMeeting?: boolean;
  isTyping?: boolean;
};

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: `msg-${Date.now()}`,
      text: `Hello! 👋 Welcome to **${process.env.NEXT_PUBLIC_SITE_NAME} Solutions**. I'm here to help you!\n\nI can assist you with:\n\n• Answering questions about our services and solutions\n• Arranging meetings with our team\n• Providing information about our offerings\n• Getting quotes for your projects\n• Recommending the best services for your needs\n\nFeel free to ask me anything! How can I help you today?`,
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTyping: false, // Initial message doesn't need typing effect
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_LINK || "";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random()}`,
      text: textToSend,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = textToSend;
    if (!messageText) {
      setInputMessage("");
    }
    setIsLoading(true);

    // Add typing indicator
    const typingMessage: ChatMessage = {
      id: `msg-typing-${Date.now()}`,
      text: "Typing...",
      sender: "bot",
      time: "",
    };
    setMessages(prev => [...prev, typingMessage]);

    try {
      // Prepare messages for API (convert to OpenAI format)
      const apiMessages = messages
        .filter(m => m.sender !== "bot" || !m.text.includes("Typing..."))
        .map(m => ({
          role: m.sender === "user" ? "user" as const : "assistant" as const,
          content: m.text,
        }));

      // Add current user message
      apiMessages.push({
        role: "user",
        content: userInput,
      });

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
          context: {
            pagePath: window.location.pathname,
            referrer: document.referrer,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to get response" }));
        throw new Error(errorData.error || errorData.message || "Failed to get response");
      }

      const data = await response.json();
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.text !== "Typing..."));

      // Clean up any remaining JSON artifacts from the response text
      let cleanedReplyText = data.replyText || "I apologize, but I couldn't generate a response. Please try again.";
      
      // Remove any JSON objects that might have slipped through
      cleanedReplyText = cleanedReplyText
        .replace(/\{\s*"action"\s*:\s*"recommend_services"\s*,\s*"services"\s*:\s*\[[^\]]*\]\s*\}/gi, '')
        .replace(/\{\s*"action"\s*:\s*"[^"]+"\s*[^}]*\}/gi, '')
        .replace(/\{[^{}]*"action"[^{}]*\}/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      // Add bot response with typing effect
      const messageId = `msg-${Date.now()}-${Math.random()}`;
      const botMessage: ChatMessage = {
        id: messageId,
        text: cleanedReplyText,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedServices: data.recommendedServices || undefined,
        showBookMeeting: data.showBookMeeting || false,
        isTyping: true,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      
      // Remove typing indicator
      setMessages(prev => prev.filter(m => m.text !== "Typing..."));

      // Add error message
      const errorMessageId = `msg-error-${Date.now()}`;
      const errorMessage: ChatMessage = {
        id: errorMessageId,
        text: "Sorry, I'm having trouble connecting right now. Please try again or use our contact form.",
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isTyping: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            className="fixed bottom-20 md:bottom-24 right-4 sm:right-6 md:right-6 z-[9998] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-2xl flex items-center justify-center transition-colors"
            aria-label="Open live chat"
          >
            <MessageSquare className="h-8 w-8" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-28 md:right-6 z-[9999] bg-white rounded-2xl shadow-2xl border-2 border-border overflow-hidden ${
              isMinimized 
                ? "w-[calc(100vw-2rem)] sm:w-80 h-16" 
                : "w-[calc(100vw-2rem)] sm:w-96 md:w-[400px] lg:w-[420px] h-[calc(100vh-8rem)] sm:h-[600px] md:h-[650px]"
            } flex flex-col transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-primary text-white p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                <div>
                  <div className="font-semibold text-sm sm:text-base">Live Chat</div>
                  <div className="text-[10px] sm:text-xs text-white/80">We're online</div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <Minimize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close chat"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/30">
                  {/* Quick Action Buttons - Show only on first message */}
                  {messages.length === 1 && (
                    <div className="space-y-2 mb-3 sm:mb-4">
                      <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground px-1 sm:px-2">Quick actions:</div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSend("Show me all your services");
                          }}
                          className="px-2.5 py-1.5 sm:px-3 bg-white border border-border hover:bg-primary/5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors"
                        >
                          📋 Our Services
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSend("I want to book a meeting");
                          }}
                          className="px-2.5 py-1.5 sm:px-3 bg-white border border-border hover:bg-primary/5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors"
                        >
                          📅 Book Meeting
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleSend("I need a quote for my project");
                          }}
                          className="px-2.5 py-1.5 sm:px-3 bg-white border border-border hover:bg-primary/5 rounded-lg text-[10px] sm:text-xs font-medium transition-colors"
                        >
                          💰 Get Quote
                        </button>
                      </div>
                    </div>
                  )}
                  {messages.map((message, index) => (
                    <div key={message.id || index} className="space-y-2">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                            message.sender === "user"
                              ? "bg-primary text-white shadow-md"
                              : "bg-gradient-to-br from-white to-primary/5 border border-border/60 text-foreground shadow-sm"
                          }`}
                        >
                          {message.sender === "bot" ? (
                            <div className="prose prose-sm sm:prose-base max-w-none">
                              {message.isTyping ? (
                                <div className="text-xs sm:text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
                                  <TypewriterEffect
                                    words={message.text}
                                    speed={20}
                                    cursorClassName="bg-foreground"
                                    onComplete={() => {
                                      if (message.id) {
                                        setMessages(prev => 
                                          prev.map((msg) => 
                                            msg.id === message.id 
                                              ? { ...msg, isTyping: false }
                                              : msg
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </div>
                              ) : (
                                <ReactMarkdown
                                  components={{
                                    p: ({ node, ...props }: any) => (
                                      <p className="mb-2 sm:mb-2.5 leading-relaxed text-xs sm:text-sm text-foreground last:mb-0" {...props} />
                                    ),
                                    strong: ({ node, ...props }: any) => (
                                      <strong className="font-semibold text-foreground" {...props} />
                                    ),
                                    em: ({ node, ...props }: any) => (
                                      <em className="italic text-foreground" {...props} />
                                    ),
                                    ul: ({ node, ...props }: any) => (
                                      <ul className="list-disc pl-4 sm:pl-5 mb-2 sm:mb-2.5 space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-foreground" {...props} />
                                    ),
                                    ol: ({ node, ...props }: any) => (
                                      <ol className="list-decimal pl-4 sm:pl-5 mb-2 sm:mb-2.5 space-y-1 sm:space-y-1.5 text-xs sm:text-sm text-foreground" {...props} />
                                    ),
                                    li: ({ node, ...props }: any) => (
                                      <li className="leading-relaxed text-xs sm:text-sm" {...props} />
                                    ),
                                    h1: ({ node, ...props }: any) => (
                                      <h1 className="text-base sm:text-lg font-bold mb-2 sm:mb-2.5 text-foreground" {...props} />
                                    ),
                                    h2: ({ node, ...props }: any) => (
                                      <h2 className="text-sm sm:text-base font-semibold mb-1.5 sm:mb-2 text-foreground" {...props} />
                                    ),
                                    h3: ({ node, ...props }: any) => (
                                      <h3 className="text-xs sm:text-sm font-semibold mb-1 sm:mb-1.5 text-foreground" {...props} />
                                    ),
                                    code: ({ node, inline, ...props }: any) =>
                                      inline ? (
                                        <code className="bg-muted px-1 py-0.5 rounded text-[10px] sm:text-xs font-mono text-primary" {...props} />
                                      ) : (
                                        <code className="block bg-muted p-2 rounded text-[10px] sm:text-xs font-mono text-foreground overflow-x-auto" {...props} />
                                      ),
                                    blockquote: ({ node, ...props }: any) => (
                                      <blockquote className="border-l-4 border-primary/30 pl-2 sm:pl-3 italic my-2 text-muted-foreground text-xs sm:text-sm" {...props} />
                                    ),
                                    a: ({ node, ...props }: any) => (
                                      <a className="text-primary hover:text-primary/80 underline font-medium" {...props} />
                                    ),
                                  }}
                                >
                                  {message.text}
                                </ReactMarkdown>
                              )}
                            </div>
                          ) : (
                            <div className="text-xs sm:text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</div>
                          )}
                          {message.time && (
                            <div className={`text-[10px] sm:text-xs mt-2 sm:mt-2.5 pt-1.5 sm:pt-2 border-t ${
                              message.sender === "user" 
                                ? "text-white/70 border-white/20" 
                                : "text-muted-foreground border-border/40"
                            }`}>
                              {message.time}
                            </div>
                          )}
                        </div>
                      </motion.div>
                      
                      {/* Recommended Services */}
                      {message.sender === "bot" && message.recommendedServices && message.recommendedServices.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start w-full"
                        >
                          <div className="max-w-[85%] sm:max-w-[80%] w-full bg-white border border-border rounded-xl sm:rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3">
                            <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground mb-2 sm:mb-3">
                              {message.recommendedServices.length > 5 ? "Our Services:" : "Recommended Services:"}
                            </div>
                            <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1">
                              <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                                {message.recommendedServices.map((slug) => (
                                  <Link
                                    key={slug}
                                    href={`/services/${slug}`}
                                    className="group flex items-start gap-2 sm:gap-3 p-2 sm:p-2.5 bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 border border-primary/20 hover:border-primary/40 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-sm"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                                        {slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                                      </div>
                                    </div>
                                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary/60 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                                  </Link>
                                ))}
                              </div>
                            </div>
                            <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-muted-foreground text-center">
                              Click any service to learn more
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Book Meeting Button */}
                      {message.sender === "bot" && message.showBookMeeting && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex justify-start"
                        >
                          <Button
                            onClick={() => setShowCalendly(true)}
                            className="bg-primary hover:bg-primary/90 text-white rounded-lg sm:rounded-xl px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2"
                          >
                            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Book a Meeting
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 sm:p-4 border-t border-border bg-white">
                  <div className="flex gap-1.5 sm:gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 text-xs sm:text-sm"
                    />
                    <Button
                      onClick={() => handleSend()}
                      size="icon"
                      className="bg-primary hover:bg-primary/90 h-9 w-9 sm:h-10 sm:w-10"
                      disabled={isLoading || !inputMessage.trim()}
                    >
                      <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 text-center">
                    Press Enter to send
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendly Modal */}
      <AnimatePresence>
        {showCalendly && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center p-0 sm:p-4"
            onClick={() => setShowCalendly(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:w-full sm:max-w-4xl sm:h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="bg-primary text-white p-3 sm:p-4 flex items-center justify-between">
                <div className="font-semibold text-sm sm:text-base">Book a Meeting</div>
                <button
                  onClick={() => setShowCalendly(false)}
                  className="p-1 sm:p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={calendlyUrl}
                  className="w-full h-full border-0"
                  title="Calendly Scheduling"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

