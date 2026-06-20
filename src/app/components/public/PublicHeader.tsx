import { useEffect, useState } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";

const getScrollTop = () =>
  Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.documentElement.scrollTop || 0,
    document.body.scrollTop || 0,
  );

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Sermons", href: "/#sermons" },
  { label: "Ministries", href: "/#ministries" },
  { label: "Events", href: "/#events" },
  { label: "Give", href: "/#give" },
  { label: "Bible Reader", href: "/bible" },
];

interface PublicHeaderProps {
  transparentAtTop?: boolean;
  onPlanVisit?: () => void;
}

export function PublicHeader({
  transparentAtTop = false,
  onPlanVisit,
}: PublicHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(getScrollTop() > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });
    document.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("scroll", handleScroll, true);
    };
  }, []);

  const solidHeader = !transparentAtTop || scrolled || menuOpen;

  const handlePlanVisit = () => {
    setMenuOpen(false);

    if (onPlanVisit) {
      onPlanVisit();
      return;
    }

    window.location.href = "/#visit";
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solidHeader
          ? "bg-white dark:bg-[#0a1220] shadow-lg border-b border-slate-200 dark:border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 lg:h-20">
        <a href="/" className="shrink-0">
          <div
            className={`rounded-xl px-3 py-1.5 transition-all duration-300 ${
              solidHeader ? "bg-white shadow-sm" : "bg-white/95 shadow-sm"
            }`}
          >
            <ImageWithFallback
              src={logoImg}
              alt="Liberty For Living Ministries International"
              className="h-8 lg:h-10 w-auto object-contain"
            />
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold tracking-wide transition-colors hover:text-[#0E5AA7] ${
                solidHeader
                  ? "text-[#0d1b2e] dark:text-slate-200"
                  : "text-white/90"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlanVisit}
            className="bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-md shadow-blue-900/20"
          >
            Plan Your Visit
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          aria-label="Toggle menu"
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            solidHeader
              ? "text-[#0d1b2e] dark:text-white hover:bg-slate-100 dark:hover:bg-white/10"
              : "text-white hover:bg-white/10"
          }`}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#111c30] border-t border-border px-5 pb-6 pt-1 shadow-xl">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3.5 text-[#0d1b2e] dark:text-slate-200 font-semibold border-b border-border last:border-0"
            >
              {link.label}
              <ChevronRight size={16} className="text-muted-foreground" />
            </a>
          ))}

          <button
            type="button"
            onClick={handlePlanVisit}
            className="mt-5 block w-full text-center bg-[#0E5AA7] text-white font-bold py-3.5 rounded-full shadow"
          >
            Plan Your Visit
          </button>
        </div>
      )}
    </header>
  );
}
