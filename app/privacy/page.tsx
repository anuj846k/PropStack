'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'collection', label: 'Information We Collect' },
  { id: 'usage', label: 'How We Use Your Data' },
  { id: 'ai-processing', label: 'AI Data Processing' },
  { id: 'storage', label: 'Data Storage & Security' },
  { id: 'sharing', label: 'Data Sharing' },
  { id: 'rights', label: 'Your Rights' },
  { id: 'cookies', label: 'Cookies & Tracking' },
  { id: 'retention', label: 'Data Retention' },
  { id: 'changes', label: 'Policy Changes' },
  { id: 'contact', label: 'Contact Us' },
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState('collection');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="flex">
        <aside className="hidden lg:block fixed left-0 top-0 h-screen w-80 p-12 bg-[#f5f5f0]">
          <nav className="space-y-1 mt-20">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  'block w-full text-left px-4 py-2.5 text-sm transition-colors border-l-2',
                  activeSection === section.id
                    ? 'border-black text-black font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-900',
                )}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="w-full lg:ml-80 px-6 md:px-12 lg:px-16 py-12 lg:py-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-16 lg:mb-24 text-balance">
            Privacy Policy
          </h1>

          <div className="max-w-3xl space-y-16">
            <section id="collection" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack collects information necessary to provide our
                  property management services. This includes:
                </p>
                <p>
                  <strong>Account Information:</strong> Name, email address,
                  phone number, and role (landlord or tenant) when you create an
                  account via Google Sign-In.
                </p>
                <p>
                  <strong>Property Data:</strong> Property addresses, unit
                  details, rent amounts, lease terms, security deposits, and
                  tenancy dates entered by landlords.
                </p>
                <p>
                  <strong>Maintenance Data:</strong> Issue descriptions, photos
                  uploaded with tickets, vendor assignments, and resolution
                  status.
                </p>
                <p className="font-semibold text-gray-700">
                  <strong>Voice & Communication Data:</strong> Call recordings,
                  transcripts, and AI-generated summaries from automated calls
                  made by our AI agent Sara on behalf of landlords.
                </p>
              </div>
            </section>

            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                How We Use Your Data
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We use your data to operate and improve PropStack&apos;s
                  property management services, including:
                </p>
                <p>
                  Managing properties, units, and tenancies. Processing and
                  tracking maintenance tickets. Coordinating vendor assignments.
                  Sending notifications about ticket updates, lease renewals,
                  and payment reminders.
                </p>
                <p>
                  Powering AI features including automated rent collection
                  calls, maintenance severity analysis, tenant screening
                  reports, and rental price intelligence.
                </p>
                <p className="font-semibold text-gray-700">
                  We do not sell your personal data to third parties. Your
                  property and financial information is used solely for platform
                  functionality.
                </p>
              </div>
            </section>

            <section id="ai-processing" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                AI Data Processing
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack uses AI services including Google Gemini and Sarvam
                  AI to power intelligent features. When using AI features,
                  relevant data may be processed by these third-party AI
                  providers.
                </p>
                <p>
                  <strong>Maintenance Analysis:</strong> Photos and descriptions
                  from maintenance tickets are sent to our AI service for
                  severity triage and categorization.
                </p>
                <p>
                  <strong>Voice Calls:</strong> AI agent calls are processed
                  through Sarvam AI for voice synthesis and regional language
                  support (Hindi, Tamil, Telugu, Kannada, Marathi). Call audio
                  is recorded and stored.
                </p>
                <p>
                  <strong>Visual Inspections:</strong> Move-in and move-out
                  videos may be analyzed by AI for security deposit dispute
                  resolution. Visual data is processed to generate condition
                  reports.
                </p>
                <p className="font-semibold text-gray-700">
                  AI-generated outputs are stored on our platform and accessible
                  only to authorized users (the landlord and relevant tenant).
                </p>
              </div>
            </section>

            <section id="storage" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Data Storage & Security
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  All data is stored in Supabase (PostgreSQL) with row-level
                  security policies ensuring users can only access data they are
                  authorized to view.
                </p>
                <p>
                  Files including maintenance photos, documents, and call
                  recordings are stored in Supabase Storage with encrypted
                  connections and access controls.
                </p>
                <p>
                  Authentication is handled via Supabase Auth with Google OAuth
                  integration. Session tokens are managed securely with
                  HTTP-only cookies.
                </p>
                <p className="font-semibold text-gray-700">
                  We implement encryption in transit (TLS), role-based access
                  controls, and regular security audits to protect your data.
                </p>
              </div>
            </section>

            <section id="sharing" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Data Sharing
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>We share your data only in the following circumstances:</p>
                <p>
                  <strong>Landlord ↔ Tenant:</strong> Landlords can view tenant
                  information, maintenance tickets, and tenancy details. Tenants
                  can view their own tenancy and ticket information.
                </p>
                <p>
                  <strong>Vendor Coordination:</strong> When a vendor is
                  assigned to a maintenance ticket, limited information (unit
                  location, issue description) may be shared with the vendor for
                  service delivery.
                </p>
                <p>
                  <strong>AI Service Providers:</strong> Data necessary for AI
                  processing is shared with Google (Gemini) and Sarvam AI under
                  their respective data processing agreements.
                </p>
                <p className="font-semibold text-gray-700">
                  We do not sell, rent, or trade your personal information to
                  advertisers or data brokers under any circumstances.
                </p>
              </div>
            </section>

            <section id="rights" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Your Rights
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  You have the right to access, correct, or delete your personal
                  data at any time. You can update your profile information
                  directly through the platform.
                </p>
                <p>
                  You may request a complete export of your data in a
                  machine-readable format by contacting our support team.
                </p>
                <p>
                  You may opt out of AI-powered call features by configuring
                  your preferences in the dashboard settings. Manual
                  alternatives are available for all AI-automated workflows.
                </p>
                <p className="font-semibold text-gray-700">
                  To exercise any of these rights, contact us at
                  privacy@propstack.in. We will respond to all requests within
                  30 days.
                </p>
              </div>
            </section>

            <section id="cookies" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Cookies & Tracking
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack uses essential cookies for authentication and
                  session management. These cookies are required for the
                  platform to function and cannot be disabled.
                </p>
                <p>
                  We use Supabase authentication cookies to maintain your login
                  session securely. These are HTTP-only cookies that cannot be
                  accessed by client-side scripts.
                </p>
                <p>
                  We may use analytics cookies to understand platform usage
                  patterns and improve our services. You can opt out of
                  analytics tracking through your browser settings.
                </p>
              </div>
            </section>

            <section id="retention" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Data Retention
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Active account data is retained as long as your account is
                  active. Upon account deletion, personal data is permanently
                  removed within 30 days.
                </p>
                <p>
                  Maintenance ticket history and activity logs are retained for
                  3 years for audit purposes, even after tenancy ends. This is
                  necessary for dispute resolution and legal compliance.
                </p>
                <p className="font-semibold text-gray-700">
                  Call recordings are retained for 12 months from the date of
                  recording. After this period, recordings are automatically
                  deleted, though transcripts and summaries may be retained
                  longer.
                </p>
                <p>
                  Anonymized and aggregated data may be retained indefinitely
                  for analytics and platform improvement purposes.
                </p>
              </div>
            </section>

            <section id="changes" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Policy Changes
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices, technology, or legal requirements.
                </p>
                <p>
                  Significant changes will be communicated via email
                  notification and an in-app banner at least 14 days before
                  taking effect.
                </p>
                <p className="font-semibold text-gray-700">
                  Continued use of PropStack after policy changes constitutes
                  acceptance of the updated terms. If you disagree with any
                  changes, you may delete your account.
                </p>
              </div>
            </section>

            <section id="contact" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Contact Us
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  If you have any questions about this Privacy Policy or how we
                  handle your data, please contact us:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex gap-2">
                    <span className="text-black">•</span>
                    <span>
                      Privacy Team:{' '}
                      <a
                        href="mailto:privacy@propstack.in"
                        className="text-blue-600 hover:underline"
                      >
                        privacy@propstack.in
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-black">•</span>
                    <span>
                      General Support:{' '}
                      <a
                        href="mailto:support@propstack.in"
                        className="text-blue-600 hover:underline"
                      >
                        support@propstack.in
                      </a>
                    </span>
                  </li>
                </ul>
                <p className="font-semibold text-gray-700 mt-6">
                  This Privacy Policy is governed by the Information Technology
                  Act, 2000 and applicable data protection regulations of India.
                  Disputes shall be subject to the jurisdiction of courts in
                  Pune, Maharashtra.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
