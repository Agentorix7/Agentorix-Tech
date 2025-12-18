import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
  description: "Terms of Service for " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden pt-32 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[200px] bg-linear-to-b from-primary via-primary/95 to-primary/90 z-5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-size-[40px_40px] opacity-30" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 backdrop-blur">
              <span className="text-xs font-semibold tracking-[0.25em] text-white">LEGAL</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
              Terms of Service
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Please read these terms carefully before using our services
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-16 overflow-hidden -mt-32 pt-40 rounded-b-[50px] sm:rounded-b-[100px] md:rounded-b-[150px] bg-linear-to-b from-[#f5f9ff] via-white to-[#e8f2ff] z-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-border p-6 sm:p-8 md:p-12 shadow-lg prose prose-lg max-w-none">
            <div className="text-foreground space-y-6">
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using {process.env.NEXT_PUBLIC_SITE_NAME} Solutions' website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Use License</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to temporarily access the materials on {process.env.NEXT_PUBLIC_SITE_NAME} Solutions' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained on the website</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {process.env.NEXT_PUBLIC_SITE_NAME} Solutions provides IT services, digital marketing, AI solutions, web development, and related services. We reserve the right to modify, suspend, or discontinue any service at any time without prior notice.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. User Accounts</h2>
                <p className="text-muted-foreground leading-relaxed">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of {process.env.NEXT_PUBLIC_SITE_NAME} Solutions and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall {process.env.NEXT_PUBLIC_SITE_NAME} Solutions, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which {process.env.NEXT_PUBLIC_SITE_NAME} Solutions operates, without regard to its conflict of law provisions.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">10. Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Email: {process.env.NEXT_PUBLIC_USER_EMAIL}<br />
                  Website: {process.env.NEXT_PUBLIC_SITE_URL}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

