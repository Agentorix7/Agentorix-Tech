export interface ServiceData {
  slug: string;
  title: string;
  shortDescription: string;
  overview: string;
  sections: {
    title: string;
    content: string;
    items?: string[];
  }[];
  features?: string[];
  benefits?: string[];
  useCases?: string[];
  caseStudies?: {
    title: string;
    description: string;
    results: string[];
  }[];
  pricing?: {
    title: string;
    description: string;
  };
  cta: {
    text: string;
    link: string;
  };
  image: string;
  icon: string;
}

export const servicesData: Record<string, ServiceData> = {
  "it-services": {
    slug: "it-services",
    title: "IT Services",
    shortDescription: "Comprehensive IT consulting, software development, support, and cloud solutions to keep your business running smoothly.",
    overview: `${process.env.NEXT_PUBLIC_SITE_NAME} provides end-to-end IT solutions designed for enterprise-grade performance, security, and scalability. We help businesses plan, optimize, and modernize IT infrastructure with scalable and secure technology solutions.`,
    sections: [
      {
        title: "IT Consulting",
        content: "We help businesses plan, optimize, and modernize IT infrastructure with scalable and secure technology solutions. Our consulting services include technology strategy, systems audits, and modernization roadmaps.",
        items: [
          "Technology strategy development",
          "Systems audits and assessments",
          "Modernization roadmaps",
          "Infrastructure optimization",
          "Security assessments"
        ]
      },
      {
        title: "Software Development",
        content: "Custom enterprise software designed for automation, productivity, and performance. We build tailored solutions that integrate seamlessly with your existing systems.",
        items: [
          "Custom software solutions",
          "Enterprise applications",
          "Automation tools",
          "System integrations",
          "Legacy system modernization"
        ]
      },
      {
        title: "IT Support & Maintenance",
        content: "Continuous monitoring, updates, debugging, and long-term system reliability. Our 24/7 support ensures your systems run smoothly at all times.",
        items: [
          "24/7 monitoring and support",
          "System updates and patches",
          "Troubleshooting and debugging",
          "Performance optimization",
          "Proactive maintenance"
        ]
      },
      {
        title: "Cybersecurity Solutions",
        content: "Threat assessment, system audits, encryption, network security & vulnerability management. Protect your business with comprehensive security solutions.",
        items: [
          "Threat detection and assessment",
          "Penetration testing",
          "Data protection and encryption",
          "Network security",
          "Vulnerability management",
          "Security compliance"
        ]
      },
      {
        title: "Cloud IT Services",
        content: "Migration, cloud monitoring, DevOps, architecture design & optimization. We help you leverage the cloud for scalability and efficiency.",
        items: [
          "Cloud migration services",
          "DevOps implementation",
          "Cloud architecture design",
          "Cloud monitoring and optimization",
          "Multi-cloud strategies"
        ]
      }
    ],
    features: [
      "Enterprise-grade solutions",
      "Secure infrastructure",
      "Scalable architecture",
      "Modern technology stack"
    ],
    caseStudies: [
      {
        title: "Enterprise Cloud Migration",
        description: "Successfully migrated a Fortune 500 company's entire infrastructure to the cloud, reducing costs by 40% and improving performance.",
        results: ["40% cost reduction", "99.9% uptime", "50% faster deployment"]
      }
    ],
    pricing: {
      title: "Flexible Pricing Models",
      description: "We offer project-based, retainer, and managed service pricing models tailored to your needs."
    },
    cta: {
      text: "Speak With an IT Expert",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
    icon: "Server"
  },
  "digital-marketing": {
    slug: "digital-marketing",
    title: "Digital Marketing Services",
    shortDescription: "SEO, SEM, social media marketing, email campaigns, and content creation to boost your online presence.",
    overview: "We create data-driven digital marketing campaigns that generate measurable ROI. Our comprehensive approach combines SEO, paid advertising, social media, and content marketing to drive growth.",
    sections: [
      {
        title: "SEO (Search Engine Optimization)",
        content: "Enterprise SEO strategies built to increase visibility, site authority, and consistent organic traffic. We optimize your website to rank higher in search results.",
        items: [
          "Keyword research and analysis",
          "On-page optimization",
          "Off-page link building",
          "Technical SEO",
          "Local SEO optimization"
        ]
      },
      {
        title: "SEM / PPC Management",
        content: "High-ROI paid advertising campaigns with advanced targeting & conversion tracking. Maximize your advertising budget with data-driven campaigns.",
        items: [
          "Google Ads management",
          "Facebook & Instagram ads",
          "LinkedIn advertising",
          "Advanced targeting",
          "Conversion tracking and optimization"
        ]
      },
      {
        title: "Social Media Marketing",
        content: "Full content, strategy, posting, monitoring, and paid boosts. Build and engage your audience across all major platforms.",
        items: [
          "Content strategy development",
          "Social media posting and scheduling",
          "Community management",
          "Paid social advertising",
          "Analytics and reporting"
        ]
      },
      {
        title: "Email Marketing",
        content: "Automated workflows, lead nurturing, and conversion-ready email sequences. Keep your audience engaged and drive conversions.",
        items: [
          "Email campaign design",
          "Automated email workflows",
          "Lead nurturing sequences",
          "A/B testing",
          "Performance analytics"
        ]
      },
      {
        title: "Content Creation",
        content: "Modern, research-driven content built for brand authority. High-quality content that engages your audience and drives results.",
        items: [
          "Blog posts and articles",
          "Social media content",
          "Video content",
          "Infographics and visuals",
          "Content strategy"
        ]
      },
      {
        title: "Conversion Rate Optimization",
        content: "Optimize your website and campaigns to convert more visitors into customers. Data-driven improvements that increase revenue.",
        items: [
          "Website optimization",
          "Landing page optimization",
          "A/B testing",
          "User experience improvements",
          "Conversion funnel analysis"
        ]
      },
      {
        title: "Marketing Automation",
        content: "Automate your marketing workflows to save time and scale your efforts. Connect all your marketing tools for seamless automation.",
        items: [
          "Marketing automation setup",
          "Workflow creation",
          "Lead scoring",
          "Multi-channel automation",
          "CRM integration"
        ]
      }
    ],
    benefits: [
      "Measurable ROI",
      "Data-driven strategies",
      "Multi-channel approach",
      "Expert team"
    ],
    pricing: {
      title: "Packages & Pricing",
      description: "We offer flexible packages from starter plans to enterprise solutions. Monthly reports, dashboards, strategy calls, and performance tracking included."
    },
    cta: {
      text: "Boost My Marketing",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    icon: "TrendingUp"
  },
  "lead-generation": {
    slug: "lead-generation",
    title: "B2B/B2C Lead Generation",
    shortDescription: "Strategic lead research, cold outreach, appointment setting, and CRM integration to grow your pipeline.",
    overview: "Performance-based lead generation solutions targeting your ideal customers. We help you build a consistent pipeline of qualified leads through proven strategies.",
    sections: [
      {
        title: "Lead Research & Data Collection",
        content: "Comprehensive research to identify and collect high-quality leads. We use advanced tools and techniques to build accurate, targeted lead databases.",
        items: [
          "B2B lead research",
          "B2C audience targeting",
          "Data verification",
          "Lead enrichment",
          "Database building"
        ]
      },
      {
        title: "Cold Email Outreach",
        content: "High-deliverability sequences with verified databases. Professional email campaigns that get responses and drive conversions.",
        items: [
          "Email sequence creation",
          "Personalization",
          "A/B testing",
          "Deliverability optimization",
          "Response tracking"
        ]
      },
      {
        title: "Social Outreach",
        content: "LinkedIn, Facebook, Instagram prospecting and outreach. Engage with your target audience on their preferred platforms.",
        items: [
          "LinkedIn automation",
          "Social media prospecting",
          "Direct messaging",
          "Connection strategies",
          "Engagement campaigns"
        ]
      },
      {
        title: "Appointment Setting",
        content: "Qualify leads and schedule meetings with decision-makers. We handle the entire process from initial contact to confirmed appointments.",
        items: [
          "Lead qualification",
          "Calendar management",
          "Meeting scheduling",
          "Follow-up sequences",
          "CRM integration"
        ]
      },
      {
        title: "CRM Integration",
        content: "Pipeline setup, lead scoring & complete automation flows. Seamlessly integrate all your lead generation activities with your CRM.",
        items: [
          "CRM setup and configuration",
          "Lead scoring automation",
          "Pipeline management",
          "Automation workflows",
          "Reporting and analytics"
        ]
      }
    ],
    caseStudies: [
      {
        title: "B2B SaaS Lead Generation",
        description: "Generated 500+ qualified leads for a SaaS company in 3 months, resulting in $2M in pipeline value.",
        results: ["500+ qualified leads", "$2M pipeline value", "25% conversion rate"]
      }
    ],
    cta: {
      text: "Launch Your Lead Gen Campaign",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    icon: "Users"
  },
  "ai-sales-agent": {
    slug: "ai-sales-agent",
    title: "AI Sales Agent Solutions",
    shortDescription: "Automated sales agents that handle conversations, qualify leads, and integrate with your CRM systems.",
    overview: "Automated AI-powered SDRs that qualify leads, respond instantly, book meetings, and follow up. Our AI sales agents work 24/7 to engage prospects and drive conversions.",
    sections: [
      {
        title: "What is AI Sales Agent",
        content: "AI Sales Agents are intelligent virtual assistants that autonomously handle sales conversations, qualify leads, and manage follow-ups. They work around the clock to engage prospects and never miss an opportunity.",
        items: [
          "Autonomous sales conversations",
          "24/7 availability",
          "Natural language processing",
          "Lead qualification",
          "Meeting scheduling"
        ]
      },
      {
        title: "Features",
        content: "Our AI Sales Agents come with powerful features designed to replace or augment your SDR team.",
        items: [
          "Automation: Fully automated lead engagement",
          "Chat: Natural conversation capabilities",
          "SDR replacement: Handle initial sales conversations",
          "Multi-channel support",
          "Real-time analytics"
        ]
      },
      {
        title: "Integrations",
        content: "Seamlessly integrate with your existing tools and workflows. Our AI agents work with all major platforms.",
        items: [
          "CRM integration (Salesforce, HubSpot, etc.)",
          "Email integration",
          "WhatsApp automation",
          "SMS capabilities",
          "Calendar systems"
        ]
      },
      {
        title: "Benefits",
        content: "Transform your sales process with AI-powered automation that scales with your business.",
        items: [
          "24/7 lead engagement",
          "Consistent follow-up",
          "Reduced costs",
          "Scalable operations",
          "Higher conversion rates"
        ]
      },
      {
        title: "Use Cases",
        content: "AI Sales Agents are perfect for various sales scenarios and industries.",
        items: [
          "B2B lead qualification",
          "Appointment setting",
          "Customer support",
          "Follow-up automation",
          "Lead nurturing"
        ]
      }
    ],
    features: [
      "Autonomous conversations",
      "CRM integration",
      "Multi-channel support",
      "Real-time analytics"
    ],
    cta: {
      text: "Request AI Agent Demo",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    icon: "Bot"
  },
  "ai-chatbot": {
    slug: "ai-chatbot",
    title: "AI Chatbot Development",
    shortDescription: "Intelligent chatbots for websites, WhatsApp, and e-commerce to automate customer service 24/7.",
    overview: "AI Chatbot Overview: Custom intelligent chatbots that provide instant customer support, answer FAQs, collect leads, and automate interactions across multiple channels.",
    sections: [
      {
        title: "Custom Chatbot for Websites",
        content: "Intelligent chatbots integrated directly into your website to engage visitors, answer questions, and convert leads.",
        items: [
          "Website integration",
          "FAQ automation",
          "Lead capture",
          "24/7 availability",
          "Multi-language support"
        ]
      },
      {
        title: "WhatsApp Automation Bots",
        content: "Automate customer interactions on WhatsApp, the world's most popular messaging platform.",
        items: [
          "WhatsApp Business API integration",
          "Automated responses",
          "Order tracking",
          "Customer support",
          "Marketing campaigns"
        ]
      },
      {
        title: "E-commerce Chatbots",
        content: "Specialized chatbots for e-commerce that help customers find products, process orders, and handle returns.",
        items: [
          "Product recommendations",
          "Order processing",
          "Inventory inquiries",
          "Return and refund handling",
          "Upselling and cross-selling"
        ]
      },
      {
        title: "Customer Service Automation",
        content: "Automate your customer service to handle common inquiries, route complex issues, and provide instant support.",
        items: [
          "Ticket creation",
          "Issue routing",
          "Knowledge base integration",
          "Escalation management",
          "Customer satisfaction tracking"
        ]
      }
    ],
    cta: {
      text: "Get Your Chatbot",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    icon: "MessageSquare"
  },
  "web-app-development": {
    slug: "web-app-development",
    title: "Web & App Development",
    shortDescription: "Modern websites, e-commerce stores, mobile apps, and web applications for all platforms.",
    overview: "We build modern, responsive websites and applications that deliver exceptional user experiences and drive business results.",
    sections: [
      {
        title: "Custom Websites",
        content: "Beautiful, responsive websites tailored to your brand and business needs. From simple landing pages to complex corporate sites.",
        items: [
          "Responsive design",
          "Custom development",
          "SEO optimization",
          "Fast loading times",
          "Mobile-first approach"
        ]
      },
      {
        title: "E-commerce Stores",
        content: "Full-featured online stores with secure payment processing, inventory management, and order fulfillment.",
        items: [
          "Shopping cart functionality",
          "Payment gateway integration",
          "Inventory management",
          "Order tracking",
          "Customer accounts"
        ]
      },
      {
        title: "Web Apps",
        content: "Custom web applications built to solve specific business problems and automate workflows.",
        items: [
          "Custom functionality",
          "User authentication",
          "Database integration",
          "API development",
          "Third-party integrations"
        ]
      },
      {
        title: "CMS (WordPress, Shopify, Webflow)",
        content: "Content management systems that make it easy to update and manage your website content.",
        items: [
          "WordPress development",
          "Shopify store setup",
          "Webflow design",
          "Theme customization",
          "Plugin development"
        ]
      }
    ],
    cta: {
      text: "Start Your Project",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop",
    icon: "Globe"
  },
  "cloud-solutions": {
    slug: "cloud-solutions",
    title: "Cloud Solutions",
    shortDescription: "Cloud migration, infrastructure setup, and managed cloud services for scalable business operations.",
    overview: "Cloud migration, cloud monitoring, DevOps, architecture design & optimization. We help you leverage the cloud for scalability and efficiency.",
    sections: [
      {
        title: "Cloud Migration",
        content: "Seamless migration of your infrastructure to the cloud with zero downtime and minimal disruption.",
        items: [
          "Infrastructure assessment",
          "Migration planning",
          "Data migration",
          "Application migration",
          "Post-migration support"
        ]
      },
      {
        title: "Cloud Architecture",
        content: "Design scalable, secure, and cost-effective cloud architectures tailored to your business needs.",
        items: [
          "Architecture design",
          "Scalability planning",
          "Security implementation",
          "Cost optimization",
          "Best practices"
        ]
      },
      {
        title: "DevOps Services",
        content: "Implement DevOps practices to automate deployment, improve collaboration, and accelerate delivery.",
        items: [
          "CI/CD pipeline setup",
          "Infrastructure as code",
          "Containerization",
          "Monitoring and logging",
          "Automation"
        ]
      },
      {
        title: "Cloud Monitoring",
        content: "24/7 monitoring and optimization of your cloud infrastructure to ensure peak performance.",
        items: [
          "Performance monitoring",
          "Cost tracking",
          "Security monitoring",
          "Automated alerts",
          "Optimization recommendations"
        ]
      }
    ],
    cta: {
      text: "Migrate to Cloud",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    icon: "Cloud"
  },
  "cybersecurity": {
    slug: "cybersecurity",
    title: "Cybersecurity Services",
    shortDescription: "Protect your business with comprehensive security audits, threat monitoring, and compliance solutions.",
    overview: "Threat assessment, system audits, encryption, network security & vulnerability management. Protect your business with comprehensive security solutions.",
    sections: [
      {
        title: "Security Audits",
        content: "Comprehensive security assessments to identify vulnerabilities and risks in your systems.",
        items: [
          "Vulnerability scanning",
          "Penetration testing",
          "Security assessments",
          "Risk analysis",
          "Compliance audits"
        ]
      },
      {
        title: "Threat Monitoring",
        content: "24/7 monitoring and detection of security threats to protect your business in real-time.",
        items: [
          "Threat detection",
          "Intrusion detection",
          "Security monitoring",
          "Incident response",
          "Threat intelligence"
        ]
      },
      {
        title: "Data Protection",
        content: "Encryption, backup, and recovery solutions to protect your critical business data.",
        items: [
          "Data encryption",
          "Backup solutions",
          "Disaster recovery",
          "Data loss prevention",
          "Access controls"
        ]
      },
      {
        title: "Compliance Solutions",
        content: "Ensure your business meets industry standards and regulatory requirements.",
        items: [
          "GDPR compliance",
          "HIPAA compliance",
          "SOC 2 compliance",
          "ISO 27001",
          "PCI DSS"
        ]
      }
    ],
    cta: {
      text: "Secure My Business",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
    icon: "Shield"
  },
  "custom-software": {
    slug: "custom-software",
    title: "Custom Software Development",
    shortDescription: "Tailored software solutions built to your specifications, from web apps to enterprise systems.",
    overview: "Custom enterprise software designed for automation, productivity, and performance. We build tailored solutions that integrate seamlessly with your existing systems.",
    sections: [
      {
        title: "Discovery Phase",
        content: "Thorough analysis of your requirements to design the perfect solution for your business needs.",
        items: [
          "Requirements gathering",
          "System analysis",
          "Architecture design",
          "Technology selection",
          "Project planning"
        ]
      },
      {
        title: "Development",
        content: "Agile development process with regular updates and iterations to ensure the solution meets your needs.",
        items: [
          "Agile methodology",
          "Regular updates",
          "Code quality",
          "Best practices",
          "Documentation"
        ]
      },
      {
        title: "QA & Testing",
        content: "Comprehensive testing to ensure your software is bug-free, secure, and performs optimally.",
        items: [
          "Unit testing",
          "Integration testing",
          "Security testing",
          "Performance testing",
          "User acceptance testing"
        ]
      },
      {
        title: "Deployment & Maintenance",
        content: "Smooth deployment and ongoing maintenance to keep your software running perfectly.",
        items: [
          "Deployment planning",
          "Production deployment",
          "Ongoing maintenance",
          "Updates and patches",
          "Support and monitoring"
        ]
      }
    ],
    cta: {
      text: "Build Custom Software",
      link: "/contact"
    },
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
    icon: "Code"
  }
};

// Additional services data
export const additionalServicesData: Record<string, Partial<ServiceData>> = {
  "creatives": {
    slug: "creatives",
    title: "Creative Services",
    shortDescription: "Professional creative production to elevate your brand with high-quality visuals, branding, and multimedia content.",
    overview: "Professional creative production to elevate your brand. We deliver high-quality graphics, branding, video content, and multimedia solutions that make your brand stand out.",
    sections: [
      { 
        title: "Social Media Content Creation", 
        content: "High-quality graphics, motion posts, reels, carousels, and brand-focused visuals that engage your audience and drive results.",
        items: [
          "Social media graphics",
          "Motion posts and animations",
          "Reels and short videos",
          "Carousel designs",
          "Brand-focused visuals"
        ]
      },
      { 
        title: "Brand Identity Design", 
        content: "Logos, color systems, typography, brand guidelines. Create a cohesive brand identity that resonates with your audience.",
        items: [
          "Logo design",
          "Color palette development",
          "Typography selection",
          "Brand guidelines",
          "Brand style guide"
        ]
      },
      { 
        title: "Marketing Material Design", 
        content: "Brochures, pitch decks, ads, proposals. Professional marketing materials that convert.",
        items: [
          "Brochures and flyers",
          "Pitch decks",
          "Ad designs",
          "Proposals and presentations",
          "Print and digital materials"
        ]
      },
      { 
        title: "Video Editing / Animation", 
        content: "Corporate videos, reels, 2D/3D animations. Bring your brand to life with engaging video content.",
        items: [
          "Corporate video production",
          "Social media reels",
          "2D animations",
          "3D animations",
          "Video post-production"
        ]
      },
      { 
        title: "Podcast Editing", 
        content: "Full audio cleanup, mixing, visual repurposing. Professional podcast production services.",
        items: [
          "Audio cleanup and mixing",
          "Podcast editing",
          "Visual repurposing",
          "Show notes creation",
          "Distribution support"
        ]
      }
    ],
    cta: { text: "Get Creative Services", link: "/contact" },
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
    icon: "Palette"
  },
  "content-writing": {
    slug: "content-writing",
    title: "Content Writing Services",
    shortDescription: "Professional writing services including research, articles, scripts, web content, and proofreading.",
    overview: "Industry research & analysis, professional article writing, book writing & ghostwriting, scripts & copywriting, web content development, and proofreading & editing.",
    sections: [
      { 
        title: "Research", 
        content: "Industry research & analysis to create well-informed, authoritative content.",
        items: [
          "Industry research",
          "Competitor analysis",
          "Market research",
          "Data collection",
          "Fact-checking"
        ]
      },
      { 
        title: "Article Writing & Book Writing", 
        content: "Professional article writing, book writing & ghostwriting services for all your content needs.",
        items: [
          "Blog articles",
          "Long-form content",
          "Book writing",
          "Ghostwriting",
          "Editorial content"
        ]
      },
      { 
        title: "Scripts / Body Copies", 
        content: "Scripts & copywriting that engage audiences and drive conversions.",
        items: [
          "Video scripts",
          "Ad copy",
          "Sales copy",
          "Email copy",
          "Social media copy"
        ]
      },
      { 
        title: "Website Content", 
        content: "Web content development that converts visitors into customers.",
        items: [
          "Homepage content",
          "Landing pages",
          "Product descriptions",
          "About pages",
          "SEO-optimized content"
        ]
      },
      { 
        title: "Proof Reading", 
        content: "Proofreading & editing to ensure your content is error-free and polished.",
        items: [
          "Grammar checking",
          "Spell checking",
          "Style editing",
          "Fact verification",
          "Final polish"
        ]
      }
    ],
    cta: { text: "Hire a Writer", link: "/contact" },
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
    icon: "PenTool"
  },
  "business-plans-strategy": {
    slug: "business-plans-strategy",
    title: "Business Plans & Strategy",
    sections: [
      { title: "Defining the Scope of Business", content: "Market & competitor analysis, scope of business definition" },
      { title: "Social Commerce", content: "Social commerce setup" },
      { title: "Personal Brand Building", content: "Personal branding strategy" },
      { title: "Online Course Creation", content: "Online course development" },
      { title: "Building an Online Portfolio", content: "Portfolio building" }
    ],
    cta: { text: "Build My Business Strategy", link: "/contact" },
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
  },
  "administrative-assistance": {
    slug: "administrative-assistance",
    title: "Administrative Assistance",
    sections: [
      { title: "Virtual Executive Assistant", content: "Virtual executive assistance" },
      { title: "Customer Support", content: "Customer support services" },
      { title: "Managing CRM / Daily Tasks", content: "CRM management" },
      { title: "Data Entry / Script Tracing", content: "Data entry & tracking" },
      { title: "Client Follow-ups", content: "Client follow-ups" }
    ],
    cta: { text: "Get Virtual Assistant", link: "/contact" },
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=600&fit=crop"
  },
  "website-designing": {
    slug: "website-designing",
    title: "Website Designing",
    sections: [
      { title: "Website Designing", content: "Corporate & eCommerce website design" },
      { title: "Website Maintenance", content: "Website maintenance & monitoring" },
      { title: "E-commerce / Shopify", content: "Shopify store setup" },
      { title: "ClickFunnels / Kartra / GoHighLevel", content: "Funnel creation and optimization" },
      { title: "Website Migration", content: "Website migration services" }
    ],
    cta: { text: "Start My Website", link: "/contact" },
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"
  },
  "seo": {
    slug: "seo",
    title: "SEO Services",
    sections: [
      { title: "Competitor Analysis / Keyword Research", content: "Competitor & keyword research" },
      { title: "On-Page / Off-Page SEO", content: "On-page optimization, off-page link building" },
      { title: "Sitemap Submission", content: "Technical SEO & sitemap submission" },
      { title: "Directory Listings Update", content: "Directory listings and citations" },
      { title: "YouTube SEO / Google Maps SEO", content: "YouTube SEO & Google Maps SEO" }
    ],
    cta: { text: "Improve My Rankings", link: "/contact" },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
  },
  "custom-development": {
    slug: "custom-development",
    title: "Custom Development",
    sections: [
      { title: "Mobile App Development", content: "Android / iOS / Cross-Platform app development" },
      { title: "Web Application Development", content: "Web application development" },
      { title: "Discovery Phase", content: "Discovery & system architecture" },
      { title: "QA & Testing", content: "QA testing services" },
      { title: "Deployment & Maintenance", content: "Deployment & maintenance" }
    ],
    cta: { text: "Start Custom Development", link: "/contact" },
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop"
  },
  "crm-assistance": {
    slug: "crm-assistance",
    title: "CRM Assistance",
    sections: [
      { title: "Data Quality Management", content: "Data quality optimization" },
      { title: "Integration with Other Systems", content: "CRM integrations" },
      { title: "Designing Landing Page", content: "Landing page creation" },
      { title: "Email Automation", content: "Email automation" },
      { title: "Analytics & Reporting", content: "KPI reporting & dashboards" }
    ],
    cta: { text: "Optimize My CRM", link: "/contact" },
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop"
  },
  "staff-augmentation": {
    slug: "staff-augmentation",
    title: "Staff Augmentation",
    overview: `Provide professional talent fully managed by ${process.env.NEXT_PUBLIC_SITE_NAME}, including developers, marketers, designers & admins.`,
    sections: [
      { title: "Dedicated Remote Staff", content: `Full-time or part-time professionals managed by ${process.env.NEXT_PUBLIC_SITE_NAME}` },
      { title: "IT Engineers & Developers", content: "Experienced developers and IT engineers" },
      { title: "Digital Marketing Specialists", content: "Marketing experts and specialists" },
      { title: "Virtual Assistants", content: "Virtual assistants for various tasks" },
      { title: "Full-Time / Part-Time / Project-Based Resources", content: "Flexible engagement models" },
      { title: "Managed Talent Oversight", content: "Complete management and oversight" }
    ],
    cta: { text: "Hire Remote Staff", link: "/contact" },
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
  },
  "white-label": {
    slug: "white-label",
    title: "White Label Services",
    overview: "We work fully under your brand's identity, delivering services on your behalf with complete confidentiality.",
    sections: [
      { title: "Work Under Client's Brand Identity", content: "Complete brand alignment" },
      { title: "White Label Web Development", content: "Web development under your brand" },
      { title: "White Label Digital Marketing", content: "Marketing services under your brand" },
      { title: "White Label Lead Generation", content: "Lead generation under your brand" },
      { title: "Confidential Reporting & Communication", content: "Confidential reporting and communication" },
      { title: "Complete NDA & Branding Protection", content: "NDA guaranteed, complete branding protection" }
    ],
    cta: { text: "Partner With Us (White Label)", link: "/contact" },
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop"
  }
};

