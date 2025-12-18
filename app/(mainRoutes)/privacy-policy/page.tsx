import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
  description: "Privacy Policy for " + process.env.NEXT_PUBLIC_SITE_NAME + " Solutions",
};

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              How we collect, use, and protect your personal information
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
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {process.env.NEXT_PUBLIC_SITE_NAME} Solutions ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may collect information about you in a variety of ways. The information we may collect includes:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Personal Data:</strong> Name, email address, phone number, company name, and other contact information</li>
                  <li><strong>Usage Data:</strong> Information about how you access and use our website and services</li>
                  <li><strong>Device Data:</strong> Information about your device, including IP address, browser type, and operating system</li>
                  <li><strong>Cookies:</strong> Data files that are placed on your device when you visit our website</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process your requests and transactions</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze trends, usage, and activities</li>
                  <li>Detect, prevent, and address technical issues</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Information Sharing and Disclosure</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground mt-4">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist us in operating our website and conducting our business</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Cookies and Tracking Technologies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>The right to access your personal information</li>
                  <li>The right to rectify inaccurate information</li>
                  <li>The right to request deletion of your information</li>
                  <li>The right to object to processing of your information</li>
                  <li>The right to data portability</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Data Retention</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Children's Privacy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">10. Changes to This Privacy Policy</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4 text-foreground">11. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us at:
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

