import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ApiCall } from "../Api/ApiCall";

import { useSelector, useDispatch } from "react-redux";
import { signupUser } from "../Store/User/User";

export const Form = ({ props = [], button }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const isSignup = location.pathname.toLowerCase().includes("signup");

  const { isLoading, isError, user, isAuth } = useSelector(
    (store) => store.user,
  );
  console.log(
    "🚀 ~ Form ~ isLoading,isError,user,isAuth:",
    isLoading,
    isError,
    user,
    isAuth,
  );

  const [form, setForm] = React.useState(() =>
    props.reduce((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {}),
  );

  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(signupUser(form)); // for reducer

    // setLoading(true);
    // setMessage("");
    // setSuccess(false);

    // try {
    //   const endpoint = location.pathname.replace(/\/+$/, "");

    //   const response = await ApiCall.post(`/user${endpoint}`, form);

    //   setSuccess(true);
    //   setMessage(response.data?.message || "Request completed successfully.");

    //   console.log("TeamFlow response:", response.data);
    // } catch (error) {
    //   console.error("Form submission failed:", error);

    //   setMessage(
    //     error.response?.data?.message ||
    //       "Something went wrong. Please try again.",
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#101426] px-4 py-12 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />

      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />

      {/* Authentication card */}
      <section className="relative w-full max-w-115 rounded-[28px] border border-white/10 bg-white p-7 shadow-2xl shadow-black/30 sm:p-10">
        {/* Logo */}
        <Link to="/" className="mb-9 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200/60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-6 w-6"
            >
              <rect x="3" y="4" width="18" height="16" rx="4" />
              <path d="M8 9h8M8 13h5" strokeLinecap="round" />
              <path
                d="m14 16 2 2 4-4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div>
            <span className="block text-xl font-extrabold tracking-tight text-slate-900">
              TeamFlow
            </span>
            <span className="text-xs font-medium text-slate-500">
              Your team's workspace
            </span>
          </div>
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            {isSignup ? "GET STARTED" : "WELCOME BACK"}
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {isSignup ? "Create your account" : "Sign in to TeamFlow"}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isSignup
              ? "Set up your account and bring your team together."
              : "Enter your details to access your workspace."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {props.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-semibold capitalize text-slate-700"
              >
                {field.name === "dob" ? "Date of birth" : field.name}
              </label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={form[field.name] ?? ""}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 outline-none transition hover:border-indigo-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="" disabled>
                    Select {field.name}
                  </option>

                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="relative">
                  <input
                    id={field.name}
                    name={field.name}
                    type={
                      field.name === "password" && showPassword
                        ? "text"
                        : field.type
                    }
                    placeholder={
                      field.placeholder || `Enter your ${field.name}`
                    }
                    value={form[field.name] ?? ""}
                    onChange={handleChange}
                    required
                    minLength={field.name === "password" ? 8 : undefined}
                    autoComplete={
                      field.name === "password"
                        ? isSignup
                          ? "new-password"
                          : "current-password"
                        : field.name === "email"
                          ? "email"
                          : field.name === "name"
                            ? "name"
                            : field.name === "phone"
                              ? "tel"
                              : field.name === "dob"
                                ? "bday"
                                : "on"
                    }
                    className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 ${
                      field.name === "password" ? "pr-16" : ""
                    }`}
                  />

                  {field.name === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 px-4 text-xs font-semibold text-slate-500 transition hover:text-indigo-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Login helper */}
          {!isSignup && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 accent-indigo-600"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() =>
                  setMessage(
                    "Please contact your administrator to reset your password.",
                  )
                }
                className="font-semibold text-indigo-600 hover:text-indigo-800"
              >
                Forgot password?
              </button>
            </div>
          )}

          {/* Status message */}
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-xl border px-4 py-3 text-sm ${
                success
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Primary action */}
          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200/70 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Please wait..." : button}

            {!loading && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M5 12h14m-7-7 7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </form>

        {/* Alternate action */}
        <div className="mt-7 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">TEAMFLOW</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isSignup ? "Already have an account?" : "New to TeamFlow?"}{" "}
          <Link
            to={isSignup ? "/login" : "/signup"}
            className="font-bold text-indigo-600 transition hover:text-indigo-800 hover:underline"
          >
            {isSignup ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>

      {/* Footer */}
      <p className="absolute bottom-3 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} TeamFlow. Built for better teamwork.
      </p>
    </main>
  );
};
