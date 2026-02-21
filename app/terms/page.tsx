'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const sections = [
  { id: 'overview', label: 'Platform Overview' },
  { id: 'accounts', label: 'User Accounts & Roles' },
  { id: 'properties', label: 'Property Management' },
  { id: 'maintenance', label: 'Maintenance & Tickets' },
  { id: 'ai-services', label: 'AI-Powered Services' },
  { id: 'data', label: 'Data & Privacy' },
  { id: 'payments', label: 'Payments & Billing' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'termination', label: 'Termination' },
  { id: 'contact', label: 'Contact Information' },
];

export default function TermsPage() {
  const [activeSection, setActiveSection] = useState('overview');

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
            Terms of Service
          </h1>

          <div className="max-w-3xl space-y-16">
            <section id="overview" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Platform Overview
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack is an AI-native property management platform
                  designed for landlords and tenants. By accessing or using
                  PropStack, you agree to be bound by these Terms of Service.
                </p>
                <p>
                  The platform enables landlords to manage properties, units,
                  tenancies, maintenance workflows, vendor coordination, and
                  tenant communication — all powered by intelligent AI agents.
                </p>
                <p className="font-semibold text-gray-700">
                  These terms were last updated on February 21, 2026. We reserve
                  the right to update these terms at any time with reasonable
                  notice to users.
                </p>
              </div>
            </section>

            <section id="accounts" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                User Accounts & Roles
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack supports two primary user roles:{' '}
                  <strong>Landlords</strong> and <strong>Tenants</strong>. Both
                  share a unified account system differentiated by a role field.
                </p>
                <p>
                  Landlords can manage properties, units, tenancies, vendors,
                  and maintenance workflows. Tenants can report maintenance
                  issues, view their tenancy details, and communicate with their
                  landlord.
                </p>
                <p>
                  You are responsible for maintaining the confidentiality of
                  your account credentials. You must not share your login
                  information with unauthorized parties.
                </p>
                <p className="font-semibold text-gray-700">
                  One account per person. Creating multiple accounts to
                  circumvent restrictions or abuse the platform is prohibited.
                </p>
              </div>
            </section>

            <section id="properties" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Property Management
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Landlords can register multiple properties on PropStack. Each
                  property contains individual units with configurable rent
                  amounts, and tenancies that track the relationship between
                  tenants and units over time.
                </p>
                <p>
                  You are solely responsible for the accuracy of property
                  information, rent amounts, and tenancy records entered into
                  ProPStack. The platform does not verify ownership or legal
                  rights to any property listed.
                </p>
                <p>
                  Tenancy records include move-in dates, lease end dates,
                  deposit amounts, and active status. Historical tenancy data is
                  preserved for audit and reference purposes.
                </p>
              </div>
            </section>

            <section id="maintenance" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Maintenance & Tickets
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Tenants can report maintenance issues by creating tickets
                  linked to their unit. Each ticket tracks the reporter, issue
                  description, severity, assigned vendor, and current status in
                  the resolution workflow.
                </p>
                <p>
                  Tickets may include multiple images uploaded by the tenant as
                  evidence of the issue. All images are stored securely in
                  Supabase Storage.
                </p>
                <p className="font-semibold text-gray-700">
                  Every action on a ticket — creation, vendor assignment, status
                  changes — is recorded in an activity log for full audit
                  trails.
                </p>
                <p>
                  Notifications are sent to relevant parties when ticket events
                  occur. Landlords are notified when tickets are created;
                  tenants are notified when their tickets are resolved.
                </p>
              </div>
            </section>

            <section id="ai-services" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                AI-Powered Services
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack uses AI agents for automated rent collection calls,
                  maintenance triage, tenant screening, lease renewal
                  negotiations, and document management. These services are
                  powered by Gemini, Sarvam AI, and our proprietary agent
                  framework.
                </p>
                <p>
                  AI agent "Sara" may contact tenants via phone call on behalf
                  of the landlord for rent reminders, maintenance follow-ups,
                  and lease discussions. Calls are conducted in supported Indian
                  languages including Hindi, Tamil, Telugu, Kannada, and
                  Marathi.
                </p>
                <p className="font-semibold text-gray-700">
                  All AI-generated calls are recorded and summarized. Call
                  recordings and transcripts are available to the landlord via
                  the dashboard.
                </p>
                <p>
                  AI-powered photo analysis is used to triage maintenance ticket
                  severity. The AI may also compare move-in and move-out visual
                  inspections for security deposit dispute resolution. AI
                  outputs are advisory and should not be treated as legal
                  opinions.
                </p>
              </div>
            </section>

            <section id="data" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Data & Privacy
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack stores personal data including names, contact
                  information, property details, financial records, and
                  communication logs. All data is stored in Supabase with
                  PostgreSQL and protected by row-level security.
                </p>
                <p>
                  We implement industry-standard security measures including
                  encrypted connections, secure authentication via Supabase
                  Auth, and access controls based on user roles.
                </p>
                <p>
                  For complete details on how we collect, use, and protect your
                  data, please refer to our{' '}
                  <a href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </section>

            <section id="payments" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Payments & Billing
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack facilitates rent tracking and collection but does
                  not directly process rent payments between landlords and
                  tenants. Payment processing is handled through integrated
                  third-party payment providers.
                </p>
                <p>
                  Platform subscription fees, if applicable, are billed on a
                  recurring basis. You authorize PropStack to charge the payment
                  method on file for subscription renewal.
                </p>
                <p className="font-semibold text-gray-700">
                  Refunds for platform subscriptions are handled on a
                  case-by-case basis. Contact support for refund requests.
                </p>
              </div>
            </section>

            <section id="liability" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PropStack is a management tool and does not guarantee the
                  quality of work performed by vendors, the behavior of tenants,
                  or the accuracy of AI-generated assessments.
                </p>
                <p>
                  We are not liable for disputes between landlords and tenants,
                  vendor performance issues, property damage, or financial
                  losses arising from use of the platform.
                </p>
                <p className="font-semibold text-gray-700">
                  AI-generated content, including maintenance severity
                  assessments, security deposit damage reports, and rent pricing
                  intelligence, is provided for informational purposes only and
                  should not be treated as professional or legal advice.
                </p>
                <p>
                  PropStack&apos;s total liability shall not exceed the amount
                  paid by you for platform services in the twelve months
                  preceding the claim.
                </p>
              </div>
            </section>

            <section id="termination" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Termination
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  You may terminate your account at any time by contacting
                  support. Upon termination, your data will be retained for 30
                  days for recovery purposes before permanent deletion.
                </p>
                <p>
                  PropStack reserves the right to suspend or terminate accounts
                  that violate these terms, engage in fraudulent activity, or
                  abuse platform features including AI services.
                </p>
                <p>
                  Tenancy records and maintenance history may be retained in
                  anonymized form for analytics and platform improvement
                  purposes.
                </p>
              </div>
            </section>

            <section id="contact" className="scroll-mt-24">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Contact Information
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us:
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex gap-2">
                    <span className="text-black">•</span>
                    <span>
                      General Inquiries:{' '}
                      <a
                        href="mailto:support@propstack.in"
                        className="text-blue-600 hover:underline"
                      >
                        support@propstack.in
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-black">•</span>
                    <span>
                      Legal:{' '}
                      <a
                        href="mailto:legal@propstack.in"
                        className="text-blue-600 hover:underline"
                      >
                        legal@propstack.in
                      </a>
                    </span>
                  </li>
                </ul>
                <p className="font-semibold text-gray-700 mt-6">
                  These Terms of Service are governed by the laws of India. Any
                  disputes arising from these terms shall be subject to the
                  exclusive jurisdiction of the courts of Pune, Maharashtra.
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
