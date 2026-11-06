
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaArrowRight,
} from "react-icons/fa";

import {
  getUser,
  getFullName,
  getInitials,
  logoutUser,
  AUTH_CHANGED_EVENT,
} from "../Services/authUtils";

import { logout } from "../Store/User/User";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const { isAuth, user } = useSelector((state) => state.user);

  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState(() => getUser());

  // Redux is the source of truth for Navbar visibility.
  const loggedIn = Boolean(isAuth);

  // Sync profile when authentication/user changes.
  useEffect(() => {
    if (isAuth) {
      setProfile(user?.user ?? user ?? getUser());
    } else {
      setProfile(null);
      setProfileOpen(false);
    }
  }, [isAuth, user]);

  // Listen for authentication cookie changes.
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

  // Close profile menu when clicking outside.
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
    // Clear authentication cookies.
    logoutUser();

    // Update Redux state.
    dispatch(logout());

    // Close menus.
    setProfile(null);
    setProfileOpen(false);
    setMobileMenu(false);

    // Redirect to login.
    navigate("/login", { replace: true });
  };

  const closeMenu = () => {
    setMobileMenu(false);
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
        : "text-gray-600 hover:text-violet-600"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-200">
            <span className="text-lg font-bold">
                <img src="/favicon.svg"alt="Logo"className="w-10 h-10 object-contain"/>
                </span>
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">
              TeamFlow
            </h1>
            <p className="text-xs text-gray-500">
              Work smarter together
            </p>
          </div>
        </Link>

        {/* Desktop navigation */}
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

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="rounded-xl px-4 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
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
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
                aria-label="Open profile menu"
                className="flex items-center gap-3 rounded-xl border border-gray-200 px-3 py-2 transition hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                  {initials || <FaUserCircle size={24} />}
                </div>

                <div className="text-left">
                  <p className="max-w-32 truncate text-sm font-semibold text-gray-800">
                    {fullName || "My Account"}
                  </p>
                  <p className="text-xs text-gray-500">Account</p>
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {fullName || "My Account"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Signed in
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-red-600 transition hover:bg-red-50"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 text-gray-700 md:hidden"
          onClick={() => setMobileMenu((prev) => !prev)}
          aria-label={mobileMenu ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenu}
        >
          {mobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {mobileMenu && (
        <div className="border-t border-gray-100 bg-white px-4 py-5 md:hidden">
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
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            <div className="my-2 border-t border-gray-100" />

            {!loggedIn ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 font-medium text-gray-700 hover:bg-gray-50"
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
                    <p className="truncate font-semibold text-gray-800">
                      {fullName || "My Account"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Signed in
                    </p>
                  </div>
                </div>

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
