import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaUtensils,
  FaHeart,
} from "react-icons/fa";

/* ── column data ── */
const exploreLinks = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Our Menu" },
  { to: "/order/salad", label: "Order Online" },
  { to: "/contact", label: "Contact Us" },
];

const accountLinks = [
  { to: "/login", label: "Sign In" },
  { to: "/signup", label: "Create Account" },
  { to: "/dashboard/cart", label: "My Cart" },
  { to: "/dashboard/payment_history", label: "Order History" },
  { to: "/dashboard/reservation", label: "Reservations" },
];

const socials = [
  { Icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { Icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

/* ── reusable column link ── */
const ColLink = ({ to, label, external }) =>
  external ? (
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white/45 hover:text-secondary text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
    >
      {label}
    </a>
  ) : (
    <Link
      to={to}
      className="text-white/45 hover:text-secondary text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
    >
      {label}
    </Link>
  );

/* ════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════ */
const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-white/5">
      {/* ── top strip ── */}
      <div className="bg-secondary/10 border-b border-secondary/15 py-4">
        <div className="app-container flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-white/70 text-sm">
            <FaClock className="text-secondary shrink-0" />
            <span>
              Open Daily &nbsp;·&nbsp;{" "}
              <strong className="text-white">07:00 AM – 11:00 PM</strong>
            </span>
          </div>
          <Link
            to="/dashboard/reservation"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary text-white text-xs font-black tracking-widest uppercase hover:bg-secondary/90 active:scale-95 transition-all"
          >
            <FaUtensils className="text-xs" /> Book a Table
          </Link>
        </div>
      </div>

      {/* ── main grid ── */}
      <div className="app-container py-14 md:py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
        {/* Brand column */}
        <div className="sm:col-span-2 lg:col-span-1 space-y-5">
          <div>
            <p className="text-secondary font-black text-2xl tracking-tight leading-none">
              CAFE AZIZ
            </p>
            <p className="text-white/25 text-xs tracking-[0.45em] uppercase mt-1">
              Hotel &amp; Restaurant
            </p>
          </div>

          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            A beloved Chittagong institution since 2013 — serving authentic
            flavors with genuine warmth, one guest at a time.
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-2.5 pt-1">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/8 text-white/40 hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-200 active:scale-90"
              >
                <Icon className="text-xs" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="space-y-5">
          <h6 className="text-white text-xs font-black tracking-[0.3em] uppercase">
            Explore
          </h6>
          <ul className="space-y-3">
            {exploreLinks.map(({ to, label }) => (
              <li key={to}>
                <ColLink to={to} label={label} />
              </li>
            ))}
          </ul>
        </div>

        {/* My Account */}
        <div className="space-y-5">
          <h6 className="text-white text-xs font-black tracking-[0.3em] uppercase">
            My Account
          </h6>
          <ul className="space-y-3">
            {accountLinks.map(({ to, label }) => (
              <li key={to}>
                <ColLink to={to} label={label} />
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-5">
          <h6 className="text-white text-xs font-black tracking-[0.3em] uppercase">
            Get in Touch
          </h6>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-secondary mt-0.5 shrink-0 text-sm" />
              <span className="text-white/45 text-sm leading-relaxed">
                12/A Agrabad C/A,
                <br />
                Chittagong, Bangladesh
              </span>
            </li>
            <li>
              <a
                href="tel:+8801812345678"
                className="flex items-center gap-3 text-white/45 hover:text-secondary text-sm transition-colors group"
              >
                <FaPhoneAlt className="text-secondary shrink-0 text-xs" />
                +880 1812-345678
              </a>
            </li>
            <li>
              <a
                href="tel:+8801987654321"
                className="flex items-center gap-3 text-white/45 hover:text-secondary text-sm transition-colors"
              >
                <FaPhoneAlt className="text-secondary shrink-0 text-xs" />
                +880 1987-654321
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@cafeaziz.com"
                className="flex items-center gap-3 text-white/45 hover:text-secondary text-sm transition-colors"
              >
                <FaEnvelope className="text-secondary shrink-0 text-xs" />
                hello@cafeaziz.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ── divider ── */}
      <div className="border-t border-white/5" />

      {/* ── bottom bar ── */}
      <div className="app-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-white/25 text-xs tracking-wide">
          © {year} Cafe Aziz Hotel &amp; Restaurant. All rights reserved.
        </p>
        <p className="flex items-center gap-1.5 text-white/20 text-xs">
          Made with <FaHeart className="text-secondary text-[10px]" /> in
          Chittagong
        </p>
      </div>
    </footer>
  );
};

export default Footer;
