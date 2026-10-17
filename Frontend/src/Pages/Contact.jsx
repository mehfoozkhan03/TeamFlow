
import { useState } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaArrowRight,
  FaHeadset,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Update the field that the user changes.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Hide the previous success message when editing again.
    setSubmitted(false);
  };

  // Handle form submission.
  const handleSubmit = (event) => {
    event.preventDefault();

    // Frontend demo only: no message is sent to a server.
    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "General Inquiry",
      message: "",
    });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white">
      {/* Hero section */}
      <section className="relative bg-gradient-to-br from-violet-50 via-white to-indigo-50 px-5 pb-16 pt-16 sm:px-8 sm:pt-20">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-semibold text-violet-700 shadow-sm">
              <FaHeadset />
              WE'RE HERE TO HELP
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Let's talk about
              <span className="block bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                your team.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Have a question, an idea, or need a little help?
              Our team is ready to help you get the most out of TeamFlow.
            </p>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">

          {/* Left information panel */}
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
              Get in touch
            </span>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
              We'd love to hear from you.
            </h2>

            <p className="mt-5 max-w-lg leading-7 text-slate-600">
              Whether you're exploring TeamFlow for your business or
              already using it with your team, reach out to us.
            </p>

            <div className="mt-9 space-y-5">

              {/* Email card */}
              <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/70">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white">
                  <FaEnvelope size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Email us
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Have a question? Send us a message through the form.
                  </p>
                </div>
              </div>

              {/* Support card */}
              <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/70">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <FaHeadset size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Customer support
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Need assistance with your workspace or account?
                    Tell us about the issue.
                  </p>
                </div>
              </div>

              {/* Location card */}
              <div className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/70">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-700 transition group-hover:bg-fuchsia-600 group-hover:text-white">
                  <FaMapMarkerAlt size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Connect from anywhere
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    TeamFlow helps teams collaborate, wherever they work.
                  </p>
                </div>
              </div>
            </div>

            {/* Trust note */}
            <div className="mt-8 flex items-start gap-3 rounded-2xl bg-violet-50 p-5">
              <FaCheckCircle className="mt-1 shrink-0 text-violet-600" />
              <p className="text-sm leading-6 text-slate-600">
                Your message matters to us. Please avoid including
                passwords or other sensitive account information.
              </p>
            </div>
          </div>

          {/* Right contact form */}
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8 lg:p-10">
            <div className="mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200">
                <FaPaperPlane size={20} />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Send us a message
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Fill in the details below and tell us how we can help.
              </p>
            </div>

            {submitted && (
              <div
                role="status"
                className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <FaCheckCircle className="mt-0.5 shrink-0" />
                <p>
                  Demo submission successful! Your message has not
                  been sent to a server yet.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name and email */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Full name <span className="text-violet-600">*</span>
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Email address <span className="text-violet-600">*</span>
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
                    maxLength={254}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </div>

              {/* Subject dropdown */}
              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  What can we help you with?
                </label>

                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                >
                  <option>General Inquiry</option>
                  <option>Technical Support</option>
                  <option>Account Issues</option>
                  <option>Pricing & Plans</option>
                  <option>Business Partnership</option>
                  <option>Feedback & Suggestions</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Your message <span className="text-violet-600">*</span>
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="Tell us a little about what you need..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={3000}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-violet-200 focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {formData.message.length}/3000 characters
                </p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200/70 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-300/60 focus:outline-none focus:ring-4 focus:ring-violet-200 active:translate-y-0"
              >
                Send Message
                <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <p className="text-center text-xs leading-5 text-slate-400">
                By submitting this form, you agree to be contacted
                regarding your inquiry.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 rounded-3xl bg-gradient-to-r from-violet-700 via-violet-700 to-indigo-700 p-8 text-center shadow-xl shadow-violet-200/60 sm:p-12 md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
              Better teamwork starts here.
            </h2>
            <p className="mt-3 max-w-xl leading-7 text-violet-100">
              Bring your people, projects, and conversations together
              with TeamFlow.
            </p>
          </div>

          <a
            href="/signup"
            className="inline-flex shrink-0 items-center gap-3 rounded-xl bg-white px-6 py-4 text-sm font-bold text-violet-700 transition hover:-translate-y-1 hover:bg-violet-50"
          >
            Get Started
            <FaArrowRight />
          </a>
        </div>
      </section>
    </main>
  );
};
