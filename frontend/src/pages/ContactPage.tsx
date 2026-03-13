'use client';

import { useState, useCallback } from 'react';
import {
  Mail,
  MapPin,
  Send,
  MessageCircle,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Phone,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { createLead } from '@/lib/api';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormData {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string;
}

interface WhatsAppContact {
  number: string;
  label: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface ContactCardProps {
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  hoverBorder?: string;
  external?: boolean;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const INITIAL_FORM: FormData = {
  name: '',
  email: '',
  company: '',
  service: '',
  message: '',
};

const WHATSAPP_NUMBERS: WhatsAppContact[] = [
  { number: '+2347016479713', label: 'Primary' },
  { number: '+2348156792070', label: 'Secondary' },
];

const SERVICES: string[] = [
  'AI-Powered Website',
  'Automation & Workflows',
  'AI Agents',
  'SEO & Growth',
  'Graphic Design',
  'Brand Identity',
  'Other',
];

const FAQS: FaqItem[] = [
  {
    q: 'How long does a typical project take?',
    a: 'Timelines vary by scope. A starter website takes ~2 weeks; complex automation systems typically take 4–6 weeks.',
  },
  {
    q: 'Do you work with international clients?',
    a: 'Yes! Our remote team is set up for seamless collaboration across all time zones.',
  },
  {
    q: 'What technologies do you use?',
    a: 'We use React, Node.js, Python, and cloud infrastructure (AWS, GCP, Azure) — modern, scalable, proven.',
  },
  {
    q: 'Do you provide ongoing support?',
    a: 'Yes, we offer maintenance and support packages to keep your systems running smoothly post-launch.',
  },
  {
    q: 'What are your payment terms?',
    a: 'We require 50% upfront and 50% on completion. Milestone-based payments are available for larger projects.',
  },
  {
    q: 'Can I see examples of your work?',
    a: 'Absolutely — check our portfolio or contact us for industry-specific case studies.',
  },
];

// ---------------------------------------------------------------------------
// ContactCard sub-component
// ---------------------------------------------------------------------------

const ContactCard = ({
  href,
  icon,
  iconBg,
  label,
  value,
  hoverBorder = 'hover:border-[#F2C94C]/30',
  external = false,
}: ContactCardProps) => (
  <a
    href={href}
    className={`card-tile p-5 sm:p-6 flex items-center gap-4 ${hoverBorder} transition-all`}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  >
    <div
      className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-[#A7ACB8] mb-1">{label}</p>
      <p className="text-[#F4F6FA] font-semibold text-sm sm:text-base truncate">{value}</p>
    </div>
    <ArrowRight className="w-5 h-5 text-[#A7ACB8] flex-shrink-0" aria-hidden="true" />
  </a>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const ContactPage = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [formState, setFormState] = useState<FormState>({ status: 'idle', message: '' });

  const isSubmitting = formState.status === 'submitting';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState({ status: 'submitting', message: '' });

    try {
      await createLead(formData);
      setFormData(INITIAL_FORM);
      setFormState({
        status: 'success',
        message: 'Thank you for reaching out! We will get back to you within 24 hours.',
      });
      setTimeout(() => setFormState({ status: 'idle', message: '' }), 6000);
    } catch (err) {
      setFormState({
        status: 'error',
        message: 'Something went wrong. Please try again or reach out directly.',
      });
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#F4F6FA] ' +
    'placeholder:text-[#A7ACB8]/50 focus:outline-none focus:border-[#F2C94C]/50 transition-colors text-sm';

  return (
    <div className="min-h-screen bg-[#0B0C0F] pt-20 sm:pt-24 lg:pt-28">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <span className="micro-label mb-4 block">GET IN TOUCH</span>
            <h1 className="heading-xl font-display font-bold text-[#F4F6FA] uppercase mb-6">
              Let's Build Something Great
            </h1>
            <p className="body-text text-lg sm:text-xl">
              Ready to transform your business with intelligent systems? Book a strategy call or
              send us a message — we'll respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── Contact Grid ─────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">

            {/* ── Contact Form ─────────────────────────────────────────── */}
            <div className="card-tile p-5 sm:p-6 lg:p-8">
              <h2 className="font-display font-semibold text-xl text-[#F4F6FA] mb-6">
                Send Us a Message
              </h2>

              {/* Form status banner */}
              {formState.status === 'success' && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                  <p className="text-green-500 text-sm">{formState.message}</p>
                </div>
              )}

              {formState.status === 'error' && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" aria-hidden="true" />
                  <p className="text-red-400 text-sm">{formState.message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">

                {/* Row 1: Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm text-[#A7ACB8] mb-2">
                      Name <span aria-label="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm text-[#A7ACB8] mb-2">
                      Email <span aria-label="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      placeholder="your@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row 2: Company + Service */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="company" className="block text-sm text-[#A7ACB8] mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      autoComplete="organization"
                      placeholder="Your company"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm text-[#A7ACB8] mb-2">
                      Service Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      <option value="" className="bg-[#0B0C0F]">
                        Select a service
                      </option>
                      {SERVICES.map((service) => (
                        <option key={service} value={service} className="bg-[#0B0C0F]">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm text-[#A7ACB8] mb-2">
                    Message <span aria-label="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Tell us about your project..."
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* ── Contact Info ─────────────────────────────────────────── */}
            <div className="space-y-4 sm:space-y-6">
              <ContactCard
                href="mailto:codebrix48@gmail.com"
                icon={<Mail className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2C94C]" aria-hidden="true" />}
                iconBg="bg-[#F2C94C]/10"
                label="Email Us"
                value="codebrix48@gmail.com"
              />

              <ContactCard
                href="tel:+2347016479713"
                icon={<Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#F2C94C]" aria-hidden="true" />}
                iconBg="bg-[#F2C94C]/10"
                label="Call Us"
                value="+234 701 647 9713"
              />

              {WHATSAPP_NUMBERS.map((wa) => (
                <ContactCard
                  key={wa.number}
                  href={`https://wa.me/${wa.number.replace('+', '')}`}
                  icon={
                    <MessageCircle
                      className="w-5 h-5 sm:w-6 sm:h-6 text-green-500"
                      aria-hidden="true"
                    />
                  }
                  iconBg="bg-green-500/10"
                  label={`WhatsApp (${wa.label})`}
                  value={wa.number}
                  hoverBorder="hover:border-green-500/30"
                  external
                />
              ))}

              {/* Location — decorative, not a link */}
              <div className="card-tile p-5 sm:p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#6B62B8]/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#6B62B8]" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-[#A7ACB8] mb-1">Location</p>
                  <p className="text-[#F4F6FA] font-semibold text-sm sm:text-base">
                    Global Remote Team
                  </p>
                </div>
              </div>

              {/* Calendly CTA */}
              <a
                href="https://calendly.com/codebrix48/codebrix-strategy-call"
                target="_blank"
                rel="noopener noreferrer"
                className="card-tile p-5 sm:p-6 flex items-center gap-4 hover:border-[#F2C94C]/30 transition-all"
                style={{ background: 'linear-gradient(135deg, #6B62B8 0%, #4a4190 100%)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/70 mb-1">Schedule a Call</p>
                  <p className="text-white font-semibold text-sm sm:text-base">
                    Book Free Strategy Call
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white flex-shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="card-tile p-6 sm:p-8 lg:p-10">
            <h2 className="heading-md font-display font-bold text-[#F4F6FA] mb-8 sm:mb-10 text-center">
              Frequently Asked Questions
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <dt className="font-display font-semibold text-[#F4F6FA] mb-2 text-sm sm:text-base">
                    {faq.q}
                  </dt>
                  <dd className="body-text text-xs sm:text-sm">{faq.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;