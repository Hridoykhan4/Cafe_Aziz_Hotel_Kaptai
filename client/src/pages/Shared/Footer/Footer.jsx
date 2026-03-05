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
  FaArrowRight,
} from "react-icons/fa";

const socials = [
  { Icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
  { Icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { Icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
];

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
        </div>
      </div>

      {/* ── main grid ── */}
      <div className="app-container py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Brand column (Spans 5) */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <p className="text-secondary font-black text-3xl tracking-tighter leading-none">
              CAFE AZIZ
            </p>
            <p className="text-white/25 text-[10px] font-bold tracking-[0.5em] uppercase mt-1.5">
              Hotel &amp; Restaurant
            </p>
          </div>

          <p className="text-white/40 text-sm leading-relaxed max-w-sm">
            A beloved Chittagong institution since 2013 — serving authentic
            flavors with genuine warmth, one guest at a time. Join us for an
            unforgettable culinary journey.
          </p>

          <div className="flex items-center gap-3 pt-2">
            {socials.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/8 text-white/40 hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300 active:scale-90"
              >
                <Icon className="text-sm" />
              </a>
            ))}
          </div>
        </div>

        {/* Modern "Quick Location" Card (Spans 4) */}
        <div className="md:col-span-4 bg-white/2 border border-white/5 rounded-3xl p-8 space-y-6">
          <h6 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-50">
            Visit Us
          </h6>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <FaMapMarkerAlt className="text-secondary text-xs" />
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                12/A Agrabad C/A, <br />
                Chittagong, Bangladesh
              </p>
            </div>
            <div className="space-y-3">
              <a
                href="tel:+8801812345678"
                className="flex items-center gap-4 text-white/40 hover:text-white transition-colors text-sm group"
              >
                <FaPhoneAlt className="text-secondary/50 group-hover:text-secondary text-xs transition-colors" />
                +880 1812-345678
              </a>
              <a
                href="mailto:hello@cafeaziz.com"
                className="flex items-center gap-4 text-white/40 hover:text-white transition-colors text-sm group"
              >
                <FaEnvelope className="text-secondary/50 group-hover:text-secondary text-xs transition-colors" />
                hello@cafeaziz.com
              </a>
            </div>
          </div>
        </div>

        {/* Modern Newsletter/Call to Action (Spans 3) */}
        <div className="md:col-span-3 space-y-6">
          <h6 className="text-white text-[10px] font-black tracking-[0.3em] uppercase opacity-50">
            Updates
          </h6>
          <p className="text-white/40 text-xs leading-relaxed">
            Subscribe to get latest offers and seasonal menu updates.
          </p>
          <div className="relative group">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-secondary/50 transition-all"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
              <FaArrowRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>

      {/* ── divider ── */}
      <div className="border-t border-white/5" />

      {/* ── bottom bar ── */}
      <div className="app-container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-white/20 text-[10px] tracking-widest uppercase font-bold">
          © {year} Cafe Aziz · Tradition Excellence
        </p>
        <div className="flex items-center gap-6">
          <p className="flex items-center gap-1.5 text-white/20 text-[10px] font-bold uppercase tracking-widest">
            Made with <FaHeart className="text-secondary text-[8px]" /> in
            Chittagong
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
