import { Mail, MapPin, Phone } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import type { PublicDialogMode } from "@/app/components/public/PublicActionDialog";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";
import type { ChurchSettings } from "@/types";

interface PublicFooterProps {
  churchSettings: ChurchSettings;
  onOpenDialog: (mode: PublicDialogMode) => void;
}

const footerColumns = [
  {
    heading: "Explore",
    links: ["About Us", "Our Leadership", "Sermons", "Events", "Ministries"],
  },
  {
    heading: "Connect",
    links: [
      "Plan a Visit",
      "Life Groups",
      "Prayer Request",
      "Volunteer",
      "Contact Us",
    ],
  },
  {
    heading: "Resources",
    links: [
      "Bible Studies",
      "Devotionals",
      "Bible Reader",
      "FAQ",
      "Podcast",
      "Newsletter",
      "Give Online",
    ],
  },
];

const scrollOrNavigate = (selector: string, href: string) => {
  const target = document.querySelector(selector);

  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
    return;
  }

  window.location.href = href;
};

export function PublicFooter({
  churchSettings,
  onOpenDialog,
}: PublicFooterProps) {
  const phoneHref = `tel:${churchSettings.phone?.replace(/[^\d+]/g, "") ?? "+18765550100"}`;
  const emailHref = `mailto:${churchSettings.email ?? "hello@lflmi.org"}`;
  const socialLinks = Object.entries(churchSettings.socialLinks).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  const handleFooterLink = (label: string) => {
    if (label.includes("Prayer")) onOpenDialog("prayer");
    else if (label.includes("Visit")) onOpenDialog("visit");
    else if (label.includes("Give")) onOpenDialog("give");
    else if (label.includes("Event")) onOpenDialog("events");
    else if (label.includes("Sermon")) onOpenDialog("sermon");
    else if (label === "Bible Reader") window.location.href = "/bible";
    else if (label === "FAQ") window.location.href = "/faq";
    else if (
      label.includes("Ministr") ||
      label.includes("Life Groups") ||
      label.includes("Volunteer")
    )
      scrollOrNavigate("#ministries", "/#ministries");
    else if (label.includes("About") || label.includes("Leadership"))
      scrollOrNavigate("#about", "/#about");
    else onOpenDialog("contact");
  };

  return (
    <footer className="bg-[#04183a] text-white pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 pb-14 border-b border-white/10">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl px-3 py-1.5 inline-block mb-5">
              <ImageWithFallback
                src={logoImg}
                alt="Liberty For Living Ministries International"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-6">
              {churchSettings.tagline ??
                "Walking in freedom. Living in purpose. Together in Christ."}
            </p>
            <div className="space-y-2 text-white/45 text-xs">
              <div className="flex items-start gap-2">
                <MapPin size={12} className="mt-0.5 shrink-0 text-[#D7261E]" />
                {churchSettings.address ?? "Kingston, Jamaica"}
              </div>
              <a href={phoneHref} className="flex items-center gap-2 hover:text-white">
                <Phone size={12} className="shrink-0 text-[#D7261E]" />
                {churchSettings.phone ?? "+1 876 555 0100"}
              </a>
              <a href={emailHref} className="flex items-center gap-2 hover:text-white">
                <Mail size={12} className="shrink-0 text-[#D7261E]" />
                {churchSettings.email ?? "hello@lflmi.org"}
              </a>
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <div className="text-[10px] font-black tracking-widest uppercase text-white/35 mb-5">
                {column.heading}
              </div>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={() => handleFooterLink(link)}
                      className="text-white/55 hover:text-white text-sm transition-colors font-medium"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-white/30 text-xs">
            &copy; 2025 Liberty For Living Ministries International. All rights
            reserved.
          </p>
          <div className="flex items-center gap-5">
            {socialLinks.map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-white/35 hover:text-white text-xs font-semibold capitalize transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
