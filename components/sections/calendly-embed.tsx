"use client";

export function CalendlyEmbed() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_LINK || "";
  return (
    <section className="relative py-24 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f0f9ff] via-white to-[#e0f2fe] z-1">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-1/4 w-[520px] h-[520px] bg-primary/12 blur-3xl" />
        <div className="absolute -bottom-20 left-10 w-[480px] h-[480px] bg-primary/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[140px_140px] opacity-60" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <span className="text-xs font-semibold tracking-[0.25em] text-primary">SCHEDULE A MEETING</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
              Book a Meeting
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Schedule a time that works for you and let's discuss your project
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 border-border overflow-hidden">
            <div className="h-[700px] w-full">
              <iframe
                src={calendlyUrl}
                className="w-full h-full border-0"
                title="Calendly Scheduling"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

