"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, CheckCircle2, Mail, MessageSquare, Send } from "lucide-react";

const services = [
  "IT Services",
  "Digital Marketing",
  "AI Solutions",
  "Lead Generation",
  "Web Development",
  "Mobile App Development",
  "Cloud Solutions",
  "Cybersecurity",
  "SEO Services",
  "Content Writing",
  "Graphic Design",
  "Other"
];

const timelineOptions = [
  "ASAP / Urgent",
  "1-2 weeks",
  "1 month",
  "2-3 months",
  "3-6 months",
  "6+ months"
];

const budgetOptions = [
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000+",
  "Not sure"
];

export function GetQuoteForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    services: [] as string[],
    projectDescription: "",
    timeline: "",
    budget: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    website: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.services.length === 0) {
      alert("Please select at least one service");
      return;
    }
    if (currentStep === 2 && !formData.projectDescription.trim()) {
      alert("Please describe your project");
      return;
    }
    if (currentStep === 3 && (!formData.timeline || !formData.budget)) {
      alert("Please select timeline and budget");
      return;
    }
    if (currentStep === 4 && (!formData.name || !formData.email || !formData.phone)) {
      alert("Please fill in all required contact details");
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/quote-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to submit quote request");
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to submit quote request", error);
      alert("Something went wrong while submitting your quote request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#00c2c7] via-[#00b1bb] to-[#009aa8] z-2">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size[32px_32px] opacity-70" />
        
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-8">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Thank You!
            </h2>
            <p className="text-xl text-white/90 mb-8">
              We've received your quote request and will get back to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    services: [],
                    projectDescription: "",
                    timeline: "",
                    budget: "",
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    website: ""
                  });
                }}
              >
                Submit Another Request
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f0f9ff] via-white to-[#e0f2fe] z-2">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-[480px] h-[480px] bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[140px_140px] opacity-60" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary">GET A QUOTE</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
              Get a Quote
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your project and we'll provide a customized quote
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-12">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step
                    ? "bg-primary border-primary text-white"
                    : "bg-card border-border text-muted-foreground"
                }`}>
                  {currentStep > step ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <span className="font-semibold">{step}</span>
                  )}
                </div>
                {step < 4 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
            {/* Step 1: Select Services */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-2">Select Service(s)</h3>
                <p className="text-muted-foreground mb-6">Choose all services that apply to your project</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceToggle(service)}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 text-left ${
                        formData.services.includes(service)
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-foreground"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{service}</span>
                        {formData.services.includes(service) && (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Describe Project */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-2">Describe Your Project</h3>
                <p className="text-muted-foreground mb-6">Tell us about your project goals and requirements</p>
                <textarea
                  value={formData.projectDescription}
                  onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                  placeholder="Describe your project in detail..."
                  className="w-full min-h-[200px] p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-border focus:border-primary focus:outline-none resize-none"
                />
              </div>
            )}

            {/* Step 3: Timeline & Budget */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <h3 className="text-2xl font-bold mb-2">Timeline & Budget</h3>
                <p className="text-muted-foreground mb-6">Help us understand your timeline and budget expectations</p>
                
                <div>
                  <label className="block text-sm font-semibold mb-4">Project Timeline *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {timelineOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange("timeline", option)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                          formData.timeline === option
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-4">Budget Range *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {budgetOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleInputChange("budget", option)}
                        className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ${
                          formData.budget === option
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Contact Details */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold mb-2">Contact Details</h3>
                <p className="text-muted-foreground mb-6">We'll use this information to get in touch with you</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="John Doe"
                      className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="john@example.com"
                      className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Company Name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      placeholder="Your Company"
                      className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2">Website (if applicable)</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-2 border-primary/30 hover:bg-primary/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            {currentStep < 4 ? (
              <Button
                onClick={handleNext}
                className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              >
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground"
              >
                {isSubmitting ? (
                  <>
                    <Send className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Submit Quote Request
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Info Note */}
          <div className="mt-8 p-3 sm:p-4 rounded-lg sm:rounded-xl bg-primary/5 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground">
              <Mail className="inline h-4 w-4 mr-2 text-primary" />
              You'll receive an email confirmation and we'll contact you via WhatsApp within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

