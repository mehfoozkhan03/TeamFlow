
import { useState } from "react";
import {
  Mail,
  MessageSquare,
  Clock,
  ArrowUpRight,
  Send,
  CheckCircle2,
  MapPin,
  Headphones,
} from "lucide-react";

const contactDetails = [
  {
    icon: Mail,
    title: "Email us",
    description: "For general questions and enquiries",
    value: "hello@teamflow.com",
    href: "mailto:hello@teamflow.com",
  },
  {
    icon: Headphones,
    title: "Customer support",
    description: "We're here to help your team",
    value: "support@teamflow.com",
    href: "mailto:support@teamflow.com",
  },
  {
    icon: Clock,
    title: "Response time",
    description: "Our team usually replies within",
    value: "24–48 business hours",
    href: null,
  },
];

const faqs = [
  {
    question: "What is TeamFlow?",
    answer:
      "TeamFlow is a team collaboration and project management platform that helps teams organize tasks, manage projects, and work together efficiently.",
  },
  {
    question: "How can I get help with my account?",
    answer:
      "You can contact our support team using the contact form or email support@teamflow.com. Share a few details about your issue so we can help you.",
  },
  {
    question: "Can I use TeamFlow with my team?",
    answer:
      "Yes! TeamFlow is designed to help teams collaborate, assign tasks, track progress, and keep project communication organized.",
  },
  {
    question: "How can I share feedback or suggestions?",
    answer:
      "Choose Feedback in the subject field of the contact form and tell us what you would like to see improved. We appreciate your ideas.",
  },
];

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General enquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSubmitted(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend demo only: no message is sent to a server.
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "General enquiry",
      message: "",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#0B1020] text-slate-100">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-0 top-137.5 h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
            <MessageSquare size={16} />
            We'd love to hear from you
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Let's start a{" "}
            <span className="bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              conversation.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
            Have a question, an idea, or need a little help? Tell us what’s on
            your mind. The TeamFlow team is ready to help you move forward.
          </p>
        </section>

        {/* Contact form and information */}
        <section className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Form card */}
          <div className="rounded-3xl border border-white/8 bg-[#10172A]/90 p-6 shadow-2xl shadow-black/20 sm:p-9 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white">
                Send us a message
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Fill in the details below and let us know how we can help.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  What can we help you with?
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3.5 text-sm text-slate-200 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option>General enquiry</option>
                  <option>Technical support</option>
                  <option>Account assistance</option>
                  <option>Feedback and suggestions</option>
                  <option>Business partnership</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us a little about what you need..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#10172A] active:scale-[0.99]"
              >
                Send message
                <Send
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>

              {submitted && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm leading-6 text-emerald-300"
                >
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                  <span>
                    Demo submission successful! The form is frontend-only, so
                    your message has not actually been sent.
                  </span>
                </div>
              )}

              <p className="text-center text-xs leading-5 text-slate-500">
                By submitting, you agree to be contacted about your enquiry.
              </p>
            </form>
          </div>

          {/* Contact details */}
          <div className="flex flex-col gap-6">
            <div className="rounded-3xl border border-white/8 bg-[#10172A]/90 p-7 sm:p-9">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-400">
                Get in touch
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
                We're here to help your team succeed.
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Whether you’re exploring TeamFlow or already using it, we’d
                love to hear from you.
              </p>

              <div className="mt-8 space-y-6">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-400">
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm text-slate-400">
                          {item.description}
                        </p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-2 inline-flex items-center gap-1 break-all text-sm font-medium text-blue-400 transition hover:text-blue-300"
                          >
                            {item.value}
                            <ArrowUpRight
                              size={15}
                              className="shrink-0"
                            />
                          </a>
                        ) : (
                          <p className="mt-2 text-sm font-medium text-blue-400">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Highlight card */}
            <div className="relative overflow-hidden rounded-3xl border border-blue-400/20 bg-linear-to-br from-blue-600/20 via-indigo-600/10 to-[#10172A] p-7 sm:p-9">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/15 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
                  <MessageSquare size={23} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-white">
                  Great teams start with great communication.
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-400">
                  Have an idea that could make teamwork better? We’re always
                  interested in hearing new perspectives.
                </p>

                <a
                  href="mailto:hello@teamflow.com"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white"
                >
                  Share your idea
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto mt-24 max-w-3xl lg:mt-32">
          <div className="text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              FAQs
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Quick answers to help you get started with TeamFlow.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-white/8 bg-[#10172A]/80 p-5 transition hover:border-blue-400/30 sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-100 [&::-webkit-details-marker]:hidden">
                  {faq.question}
                  <span className="text-xl text-blue-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-4 pr-6 text-sm leading-7 text-slate-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 rounded-3xl border border-white/8 bg-[#10172A] px-6 py-12 text-center sm:px-12 lg:mt-28 lg:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            <MapPin size={25} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl">
            Let's make teamwork simpler.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
            Your next great project starts with a conversation. Reach out and
            let’s explore what we can build together.
          </p>

          <a
            href="mailto:hello@teamflow.com"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Contact our team
            <ArrowUpRight size={17} />
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-white/8 pt-7 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TeamFlow. Built for better teamwork.
          </p>
        </footer>
      </div>
    </main>
  );
}
