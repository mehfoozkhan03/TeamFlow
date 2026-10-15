import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  FaUsers,
  FaBars,
  FaTimes,
  FaArrowRight,
} from "react-icons/fa";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `relative rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-violet-50 text-violet-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-violet-700"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <nav className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-[82px] items-center justify-between">

          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 text-white shadow-lg shadow-violet-200/70 transition duration-300 group-hover:rotate-[-5deg] group-hover:scale-105">
              <FaUsers size={24} />
            </div>

            <div>
              <h1 className="text-[23px] font-extrabold leading-tight tracking-tight text-slate-900">
                Team<span className="text-violet-600">Flow</span>
              </h1>
              <p className="mt-1 text-[11px] font-medium tracking-wide text-slate-500">
                WORK BETTER, TOGETHER
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-2 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </div>

          {/* Desktop action buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <NavLink
              to="/login"
              className="rounded-xl px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-violet-50 hover:text-violet-700"
            >
              Log in
            </NavLink>

            <NavLink
              to="/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-md shadow-violet-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-violet-300/60"
            >
              Get Started
              <FaArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </NavLink>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 md:hidden"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Mobile navigation */}
        {menuOpen && (
          <div className="border-t border-slate-100 pb-5 pt-4 md:hidden">
            <div className="flex flex-col gap-2">
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={navLinkClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/about"
                onClick={closeMenu}
                className={navLinkClass}
              >
                About
              </NavLink>

              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700 transition hover:border-violet-300 hover:bg-violet-50"
                >
                  Log in
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-3 text-center text-sm font-bold text-white shadow-md shadow-violet-200"
                >
                  Get Started <FaArrowRight size={12} />
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
