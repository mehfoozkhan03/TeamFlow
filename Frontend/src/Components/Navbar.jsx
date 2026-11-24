
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaArrowRight,
  FaMoon,
  FaSun,
  FaCog,
} from "react-icons/fa";

import {
  getUser,
  getFullName,
  getInitials,
  logoutUser,
  AUTH_CHANGED_EVENT,
} from "../Services/authUtils";

import { logout } from "../Store/User/User";
import { useTheme } from "../Context/ThemeContext";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const { isAuth, user } = useSelector((state) => state.user);

  const { theme, toggleTheme } = useTheme();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(() => getUser());

  const loggedIn = Boolean(isAuth);

  // Sync profile when authentication changes
  useEffect(() => {
    if (isAuth) {
      setProfile(user?.user ?? user ?? getUser());
    } else {
      setProfile(null);
      setProfileOpen(false);
    }
  }, [isAuth, user]);

  // Listen for authentication changes
  useEffect(() => {
    const syncAuth = () => {
      if (isAuth) {
        setProfile(getUser());
      }
    };

    window.addEventListener(AUTH_CHANGED_EVENT, syncAuth);

    return () => {
      window.removeEventListener(AUTH_CHANGED_EVENT, syncAuth);
    };
  }, [isAuth]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    logoutUser();
    dispatch(logout());

    setProfile(null);
    setProfileOpen(false);
    setMobileMenu(false);

    navigate("/login", { replace: true });
  };

  const closeMenu = () => {
    setMobileMenu(false);
  };

  // Theme toggle
  const handleThemeToggle = () => {
    toggleTheme();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const fullName = getFullName(profile);
  const initials = getInitials(profile);

  const linkClass = ({ isActive }) =>
    `transition-colors duration-200 ${
      isActive
        ? "font-semibold text-violet-600"
        : "theme-nav-link"
    }`;

  return (
    <header className="theme-navbar sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-200">
            <img
              src="/favicon.svg"
              alt="TeamFlow Logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight theme-text-primary">
              TeamFlow
            </h1>
            <p className="text-xs theme-text-secondary">
              Work smarter together
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={linkClass}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={handleThemeToggle}
            className="theme-icon-button"
            title={
              theme === "light"
                ? "Enable dark mode"
                : "Enable light mode"
            }
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <FaMoon size={18} />
            ) : (
              <FaSun size={18} />
            )}
          </button>

          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="theme-nav-link rounded-xl px-4 py-2.5 font-medium transition hover:bg-gray-100"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-violet-200 transition hover:bg-violet-700"
              >
                Get Started
                <FaArrowRight size={13} />
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileRef}>

              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
                className="theme-profile-button flex items-center gap-3 rounded-xl border px-3 py-2 transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                  {initials || <FaUserCircle size={24} />}
                </div>

                <div className="text-left">
                  <p className="max-w-32 truncate text-sm font-semibold theme-text-primary">
                    {fullName || "My Account"}
                  </p>
                  <p className="text-xs theme-text-secondary">
                    Account
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="theme-dropdown absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border p-2 shadow-xl">

                  <div className="theme-divider border-b px-3 py-3">
                    <p className="truncate text-sm font-semibold theme-text-primary">
                      {fullName || "My Account"}
                    </p>
                    <p className="text-xs theme-text-secondary">
                      Signed in
                    </p>
                  </div>

                  {/* Settings */}
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="theme-dropdown-link mt-2 flex items-center gap-3 rounded-xl px-3 py-3 font-medium transition"
                  >
                    <FaCog />
                    Settings
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 md:hidden">

          <button
            type="button"
            onClick={handleThemeToggle}
            className="theme-icon-button"
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <FaMoon size={18} />
            ) : (
              <FaSun size={18} />
            )}
          </button>

          <button
            type="button"
            className="theme-icon-button"
            onClick={() => setMobileMenu((prev) => !prev)}
            aria-label={mobileMenu ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenu}
          >
            {mobileMenu ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenu && (
        <div className="theme-mobile-menu border-t px-4 py-5 md:hidden">
          <div className="flex flex-col gap-2">

            {navLinks.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 font-medium transition ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "theme-nav-link"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="theme-divider my-2 border-t" />

            {!loggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="theme-nav-link rounded-xl px-4 py-3 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700"
                >
                  Get Started
                  <FaArrowRight size={13} />
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 px-3 py-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                    {initials || <FaUserCircle size={24} />}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold theme-text-primary">
                      {fullName || "My Account"}
                    </p>
                    <p className="text-xs theme-text-secondary">
                      Signed in
                    </p>
                  </div>
                </div>

                {/* Mobile Settings */}
                <Link
                  to="/settings"
                  onClick={closeMenu}
                  className="theme-dropdown-link flex items-center gap-3 rounded-xl px-4 py-3 font-medium"
                >
                  <FaCog />
                  Settings
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
