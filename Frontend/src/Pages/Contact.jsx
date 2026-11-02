
import { useState } from "react";
import emailjs from "@emailjs/browser";
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

import { contactDetails } from "../Data/contact";
import { faqs } from "../Data/faqs";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General enquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // Email validation
  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      return "Email address is required.";
    }

    if (!emailPattern.test(email.trim())) {
      return "Please enter a valid email address.";
    }

    return "";
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
    setSendError("");

    if (name === "email" && emailTouched) {
      setEmailError(validateEmail(value));
    }
  };

  // Validate email when the user leaves the field
  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(formData.email));
  };

  // Send contact form through EmailJS
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sending) return;

    setEmailTouched(true);

    const error = validateEmail(formData.email);
    setEmailError(error);

    if (error) return;

    if (
      !formData.name.trim() ||
      !formData.message.trim()
    ) {
      setSendError("Please complete all required fields.");
      return;
    }

    // Check EmailJS configuration
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setSendError(
        "Email service is not configured. Please try again later."
      );
      console.error("Missing EmailJS environment variables.");
      return;
    }

    setSending(true);
    setSubmitted(false);
    setSendError("");

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name.trim(),
          reply_to: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
        },
        {
          publicKey,
        }
      );

      // Success
      setSubmitted(true);

      setFormData({
        name: "",
        email: "",
        subject: "General enquiry",
        message: "",
      });

      setEmailTouched(false);
      setEmailError("");
    } catch (error) {
      console.error("EmailJS error:", error);

      setSendError(
        "Unable to send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute right-0 top-137.5 h-80 w-80 rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <MessageSquare size={16} />
            We'd love to hear from you
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-blue-950 sm:text-5xl lg:text-6xl">
            Let's start a{" "}
            <span className="text-indigo-950">
              conversation.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-950 sm:text-lg">
            Have a question, an idea, or need a little help? Tell us what's on
            your mind. The TeamFlow team is ready to help you move forward.
          </p>
        </section>

        {/* Contact form and information */}
        <section className="mt-16 grid gap-8 lg:mt-20 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Form card */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/60 sm:p-9 lg:p-10">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-black">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-black">
                Fill in the details below and let us know how we can help.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Full name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-black"
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
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Email address */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-black"
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
                    onBlur={handleEmailBlur}
                    required
                    maxLength={254}
                    aria-invalid={Boolean(emailError)}
                    aria-describedby={
                      emailError ? "email-error" : undefined
                    }
                    className={`w-full rounded-xl border ${
                      emailError
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    } bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2`}
                  />

                  {emailError && (
                    <p
                      id="email-error"
                      role="alert"
                      className="mt-1.5 flex items-start gap-1.5 text-sm text-red-500"
                    >
                      <span aria-hidden="true">⚠</span>
                      <span>{emailError}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  What can we help you with?
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option>General enquiry</option>
                  <option>Technical support</option>
                  <option>Account assistance</option>
                  <option>Feedback and suggestions</option>
                  <option>Business partnership</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-black"
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
                  maxLength={5000}
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={sending}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sending ? "Sending..." : "Send message"}

                {!sending && (
                  <Send
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

              {/* Error message */}
              {sendError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {sendError}
                </div>
              )}

              {/* Success message */}
              {submitted && (
                <div
                  role="status"
                  className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-6 text-emerald-800"
                >
                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0"
                  />

                  <span>
                    Your message has been sent successfully!
                    Our team will get back to you.
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
            <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-9">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">
                Get in touch
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-black sm:text-3xl">
                We're here to help your team succeed.
              </h2>

              <p className="mt-4 text-sm leading-7 text-gray-800">
                Whether you're exploring TeamFlow or already using it, we'd
                love to hear from you.
              </p>

              <div className="mt-8 space-y-6">
                {contactDetails.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-blue-600">
                        <Icon size={21} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-black">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-sm text-gray-950">
                          {item.description}
                        </p>

                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-2 inline-flex items-center gap-1 break-all text-sm font-medium text-blue-600 transition hover:text-blue-800"
                          >
                            {item.value}
                            <ArrowUpRight
                              size={15}
                              className="shrink-0"
                            />
                          </a>
                        ) : (
                          <p className="mt-2 text-sm font-medium text-blue-600">
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
            <div className="relative overflow-hidden rounded-3xl border border-blue-200 bg-white p-7 sm:p-9">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <MessageSquare size={23} />
                </div>

                <h3 className="mt-5 text-xl font-semibold text-black">
                  Great teams start with great communication.
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-800">
                  Have an idea that could make teamwork better? We're always
                  interested in hearing new perspectives.
                </p>

                <a
                  href="mailto:hello@teamflow.com"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-indigo-800"
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
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              FAQs
            </span>

            <h2 className="mt-4 text-3xl font-bold text-black sm:text-4xl">
              Frequently asked questions
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Quick answers to help you get started with TeamFlow.
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
                  {faq.question}

                  <span className="text-xl text-blue-600 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>

                <p className="mt-4 pr-6 text-sm leading-7 text-slate-600">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 rounded-3xl border border-slate-200 bg-slate-50 px-6 py-12 text-center sm:px-12 lg:mt-28 lg:py-16">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <MapPin size={25} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-slate-900 sm:text-3xl">
            Let's make teamwork simpler.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            Your next great project starts with a conversation. Reach out and
            let's explore what we can build together.
          </p>

          <a
            href="mailto:supportteamflow0@gmail.com"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Contact our team
            <ArrowUpRight size={17} />
          </a>
        </section>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 pt-7 text-center">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} TeamFlow. Built for better teamwork.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default Contact;
