import { useState, useEffect } from "react";
import {
  Menu, X, ChevronRight, MapPin, Clock,
  Heart, Users, BookOpen, Music, Baby, Globe,
  Play, ArrowRight, Phone, Mail, AlertCircle
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { useHomeContent } from "@/app/hooks/useHomeContent";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Sermons", href: "#sermons" },
  { label: "Ministries", href: "#ministries" },
  { label: "Events", href: "#events" },
  { label: "Give", href: "#give" },
];

const careItems = [
  { title: "Prayer Team", desc: "Dedicated intercessors praying for submitted requests daily.", icon: Heart },
  { title: "Counseling", desc: "Professional Christian counseling available on request.", icon: Users },
  { title: "Care Groups", desc: "Support communities for grief, recovery, and life transitions.", icon: Globe },
  { title: "Home Visitation", desc: "We come to you when you cannot come to us.", icon: MapPin },
];

const formatTime = (time: string) => {
  const [hours = "0", minutes = "0"] = time.split(":");
  const date = new Date(2000, 0, 1, Number(hours), Number(minutes));
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatDate = (date: string | null, options: Intl.DateTimeFormatOptions) =>
  date
    ? new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Jamaica",
        ...options,
      }).format(new Date(date))
    : "";

const ministryIcon = (name: string) => {
  const normalized = name.toLowerCase();
  if (normalized.includes("child")) return Baby;
  if (normalized.includes("worship") || normalized.includes("music")) return Music;
  if (normalized.includes("mission")) return Globe;
  if (normalized.includes("women") || normalized.includes("care")) return Heart;
  if (normalized.includes("group") || normalized.includes("study")) return BookOpen;
  return Users;
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const {
    serviceTimes: dynamicServiceTimes,
    latestSermon,
    events: dynamicEvents,
    ministries: dynamicMinistries,
    churchSettings,
    isLoading,
    failedSections,
  } = useHomeContent();
  const sundayServices = dynamicServiceTimes.filter(
    (service) => service.dayOfWeek === "Sunday",
  );
  const displayServiceTimes = dynamicServiceTimes.map((service) => ({
    ...service,
    day: service.dayOfWeek,
  }));
  const displayEvents = dynamicEvents.map((event) => ({
    ...event,
    month: formatDate(event.startDate, { month: "short" }).toUpperCase(),
    day: formatDate(event.startDate, { day: "numeric" }),
    time: `${formatDate(event.startDate, { hour: "numeric", minute: "2-digit" })}${event.endDate ? ` - ${formatDate(event.endDate, { hour: "numeric", minute: "2-digit" })}` : ""}`,
    tag: event.eventType ?? "Church",
  }));
  const displayMinistries = dynamicMinistries.map((ministry) => ({
    ...ministry,
    title: ministry.name,
    desc: ministry.description ?? "Find community, serve others, and grow in faith.",
    color: ministry.color ?? "#0E5AA7",
    icon: ministryIcon(ministry.name),
  }));
  const yearsActive = churchSettings.foundedYear
    ? new Date().getFullYear() - churchSettings.foundedYear
    : 20;
  const socialLinks = Object.entries(churchSettings.socialLinks).filter(
    (entry): entry is [string, string] => Boolean(entry[1]),
  );

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* NAV */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/96 dark:bg-[#0a1220]/96 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 lg:h-20">
          <a href="#" className="shrink-0">
            <div className="bg-white rounded-xl px-3 py-1.5 shadow-sm">
              <ImageWithFallback src={logoImg} alt="Liberty For Living Ministries International" className="h-8 lg:h-10 w-auto object-contain" />
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className={`text-sm font-semibold tracking-wide transition-colors hover:text-[#0E5AA7] ${scrolled ? "text-[#0d1b2e] dark:text-slate-200" : "text-white/90"}`}>{l.label}</a>
            ))}
          </nav>
          <div className="hidden lg:flex items-center gap-3">
            <a href="#visit" className="bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white text-sm font-bold px-5 py-2.5 rounded-full transition-colors shadow-md shadow-blue-900/20">Plan Your Visit</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" className={`lg:hidden p-2 rounded-lg transition-colors ${scrolled ? "text-[#0d1b2e] dark:text-white hover:bg-slate-100 dark:hover:bg-white/10" : "text-white hover:bg-white/10"}`}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="lg:hidden bg-white dark:bg-[#111c30] border-t border-border px-5 pb-6 pt-1 shadow-xl">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} onClick={() => setMenuOpen(false)} className="flex items-center justify-between py-3.5 text-[#0d1b2e] dark:text-slate-200 font-semibold border-b border-border last:border-0">
                {l.label}<ChevronRight size={16} className="text-muted-foreground" />
              </a>
            ))}
            <a href="#visit" onClick={() => setMenuOpen(false)} className="mt-5 block text-center bg-[#0E5AA7] text-white font-bold py-3.5 rounded-full shadow">Plan Your Visit</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#04183a]">
        <img src="https://images.unsplash.com/photo-1477281765962-ef34e8bb0967?w=1920&h=1080&fit=crop&auto=format" alt="Congregation worshipping with hands raised in praise" className="absolute inset-0 w-full h-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0E5AA7]/75 via-[#04183a]/65 to-[#04183a]/85" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-32">
          <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-bold tracking-widest uppercase px-5 py-2.5 rounded-full mb-10">
            <span className="w-2 h-2 rounded-full bg-[#D7261E] animate-pulse" />Welcome Home
          </div>
          <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.02] tracking-tight mb-7">Liberty.<br /><span className="text-[#ef5a50]">For Living.</span></h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">{churchSettings.tagline ?? "A community of faith where every person is seen, loved, and empowered to walk in the freedom that Christ provides."}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#visit" className="bg-[#D7261E] hover:bg-[#b81f19] text-white font-black px-9 py-4 rounded-full text-base transition-all hover:scale-105 shadow-xl shadow-red-900/40">Plan Your Visit</a>
            <a href="#sermons" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-bold px-9 py-4 rounded-full text-base transition-all flex items-center gap-2.5 justify-center"><Play size={15} className="fill-white" />Watch a Sermon</a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 pointer-events-none">
          <span className="text-[10px] tracking-widest uppercase font-semibold">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {isLoading && (
        <div className="fixed bottom-5 right-5 z-50 rounded-full bg-white/95 dark:bg-[#111c30]/95 px-4 py-2 shadow-xl backdrop-blur-md border border-[#0E5AA7]/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0E5AA7]">
            <span className="h-2 w-2 rounded-full bg-[#0E5AA7] animate-pulse" />
            Loading live church updates
          </div>
        </div>
      )}

      {!isLoading && failedSections.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-white/95 dark:bg-[#111c30]/95 px-4 py-3 shadow-xl backdrop-blur-md border border-[#0E5AA7]/10">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={16} className="text-[#D7261E] mt-0.5 shrink-0" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Some live content is temporarily unavailable. Showing trusted fallback content for {failedSections.join(", ")}.
            </p>
          </div>
        </div>
      )}

      {/* SERVICE TIMES */}
      <section className="bg-[#0E5AA7] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
          {displayServiceTimes.map((s) => (
            <div key={s.id} className="flex items-center gap-4 py-6 sm:py-8 sm:px-10 first:pl-0 last:pr-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Clock size={18} className="opacity-80" /></div>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-0.5">{s.day} — {s.label}</div>
                <div className="text-2xl font-black">{formatTime(s.time)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST SERMON */}
      <section id="sermons" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#0E5AA7] text-[10px] font-black tracking-widest uppercase mb-3">Latest Message</p>
              <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight">This Week's<br />Sermon</h2>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1.5 text-[#0E5AA7] font-bold text-sm hover:gap-3 transition-all group">All Sermons<ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></a>
          </div>
          <div className="grid lg:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/10 dark:shadow-black/40">
            <div className="lg:col-span-3 relative aspect-video lg:aspect-auto min-h-72 bg-slate-800 group cursor-pointer">
              <img src={latestSermon.thumbnailUrl ?? "https://images.unsplash.com/photo-1610414961792-b7fffebddd14?w=900&h=600&fit=crop&auto=format"} alt={latestSermon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300"><Play size={28} className="fill-white text-white ml-1" /></div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span className="bg-[#D7261E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg">{formatDate(latestSermon.sermonDate, { month: "long", day: "numeric", year: "numeric" }) || "Latest message"}</span>
                <span className="bg-black/40 backdrop-blur-sm text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full">{latestSermon.durationMinutes ? `${latestSermon.durationMinutes} min` : "Message"}</span>
              </div>
            </div>
            <div className="lg:col-span-2 bg-card p-8 lg:p-10 flex flex-col justify-center">
              <div className="text-[#0E5AA7] text-[10px] font-black tracking-widest uppercase mb-5">{latestSermon.series ? `Series: ${latestSermon.series}` : "Latest Message"}</div>
              <h3 className="text-2xl lg:text-[1.75rem] font-black text-card-foreground leading-tight mb-4">"{latestSermon.title}"</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-7">In this powerful message, Pastor Emmanuel explores how perfect love casts out all fear — and how we can step boldly into the liberty Christ has purchased for us.</p>
              <div className="flex items-center gap-3 pb-7 border-b border-border">
                <div className="w-11 h-11 rounded-full bg-[#0E5AA7]/10 flex items-center justify-center shrink-0"><BookOpen size={17} className="text-[#0E5AA7]" /></div>
                <div>
                  <div className="font-bold text-card-foreground text-sm">{latestSermon.preacherName ?? churchSettings.seniorPastor ?? "LFLMI Teaching Team"}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{latestSermon.bibleText ?? "Liberty For Living Ministries International"}</div>
                </div>
              </div>
              <div className="flex gap-3 mt-7">
                <a href={latestSermon.videoUrl ?? "#sermons"} className="flex-1 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white font-bold py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"><Play size={13} className="fill-white" />Watch Now</a>
                <a href={latestSermon.notesUrl ?? "#sermons"} className="px-5 py-3 border-2 border-border hover:border-[#0E5AA7] hover:text-[#0E5AA7] text-foreground rounded-full text-sm font-bold transition-colors">Notes</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLAN YOUR VISIT */}
      <section id="visit" className="py-24 bg-[#eef4fc] dark:bg-[#0d1829]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#D7261E] text-[10px] font-black tracking-widest uppercase mb-3">We'd Love to Meet You</p>
              <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">Planning Your<br />First Visit?</h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-10">Whether you're exploring faith for the first time or looking for a new church home, you belong here. Come as you are — we'll take care of the rest.</p>
              <div className="space-y-6 mb-10">
                {[
                  { icon: MapPin, title: "Easy to Find", desc: "Free parking available. Our friendly greeters will guide you from the moment you arrive." },
                  { icon: Baby, title: "Kids Are Welcome", desc: "Our Children's Ministry runs during every service so the whole family can worship comfortably." },
                  { icon: Heart, title: "No Pressure, Ever", desc: "Come, enjoy the worship, hear the message. No obligations — just an open, loving door." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 items-start">
                    <div className="w-11 h-11 rounded-2xl bg-[#0E5AA7]/10 flex items-center justify-center shrink-0"><item.icon size={19} className="text-[#0E5AA7]" /></div>
                    <div>
                      <div className="font-bold text-foreground text-base mb-1">{item.title}</div>
                      <div className="text-muted-foreground text-sm leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <a href="#" className="inline-flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white font-black px-9 py-4 rounded-full transition-all hover:gap-3 group shadow-lg shadow-blue-900/20">I'm Planning to Visit<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></a>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden aspect-[4/5] bg-slate-200 shadow-2xl shadow-slate-900/15">
                <img src="https://images.unsplash.com/photo-1570786032462-2efc3ca8fccd?w=700&h=875&fit=crop&auto=format" alt="People worshipping with hands raised in a bright, welcoming space" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-5 -left-5 lg:-left-8 bg-white dark:bg-[#111c30] rounded-2xl shadow-2xl p-5 max-w-[220px]">
                <div className="text-[10px] font-black text-[#0E5AA7] tracking-widest uppercase mb-2">Join Us This Sunday</div>
                <div className="font-black text-foreground text-xl leading-tight">{sundayServices.length > 0 ? sundayServices.map((service) => formatTime(service.time)).join(" & ") : "Join us this Sunday"}</div>
                <div className="text-muted-foreground text-xs mt-2 flex items-start gap-1.5 leading-snug"><MapPin size={11} className="mt-0.5 shrink-0 text-[#D7261E]" />{churchSettings.address ?? "Contact us for directions"}</div>
              </div>
              <div className="absolute -top-4 -right-4 lg:-right-6 bg-[#D7261E] text-white rounded-2xl px-4 py-3 shadow-xl">
                <div className="text-2xl font-black leading-none">5K+</div>
                <div className="text-[10px] font-semibold opacity-80 mt-0.5">Members</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS */}
      <section id="events" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#0E5AA7] text-[10px] font-black tracking-widest uppercase mb-3">What's Coming Up</p>
              <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight">Upcoming<br />Events</h2>
            </div>
            <a href="#" className="hidden sm:flex items-center gap-1.5 text-[#0E5AA7] font-bold text-sm hover:gap-3 transition-all group">Full Calendar<ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" /></a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {displayEvents.map((ev) => (
              <div key={ev.id} className="group bg-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1.5">
                <div className="bg-[#0E5AA7] px-7 pt-7 pb-10 relative overflow-hidden">
                  <span className="text-[6rem] font-black text-white/10 absolute -right-2 -top-4 select-none leading-none pointer-events-none">{ev.day}</span>
                  <div className="text-xs font-black text-white/60 tracking-widest uppercase leading-none mb-1">{ev.month}</div>
                  <div className="text-5xl font-black text-white leading-none">{ev.day}</div>
                  <span className="mt-4 inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3.5 py-1.5 rounded-full">{ev.tag}</span>
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-black text-card-foreground mb-2.5 leading-tight">{ev.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">{ev.description}</p>
                  <div className="space-y-2 text-xs text-muted-foreground mb-6">
                    <div className="flex items-center gap-2"><Clock size={12} className="text-[#0E5AA7] shrink-0" />{ev.time}</div>
                    <div className="flex items-center gap-2"><MapPin size={12} className="text-[#0E5AA7] shrink-0" />{ev.location}</div>
                  </div>
                  <button className="w-full border-2 border-border hover:border-[#0E5AA7] hover:text-[#0E5AA7] text-foreground font-bold py-3 rounded-full text-sm transition-colors">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINISTRIES */}
      <section id="ministries" className="py-24 bg-[#eef4fc] dark:bg-[#0d1829]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#D7261E] text-[10px] font-black tracking-widest uppercase mb-3">Get Involved</p>
            <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight mb-5">Find Your Place<br />to Serve & Grow</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">No matter your age or season of life, there is a ministry built for you here at Liberty For Living.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayMinistries.map((m) => (
              <div key={m.id} className="group bg-card rounded-3xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${m.color}15` }}><m.icon size={22} style={{ color: m.color }} /></div>
                <h3 className="text-xl font-black text-card-foreground mb-3">{m.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{m.desc}</p>
                <div className="flex items-center gap-1 text-sm font-bold transition-all group-hover:gap-2" style={{ color: m.color }}>Learn More<ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section id="about" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-3xl overflow-hidden aspect-square bg-slate-200 shadow-2xl shadow-slate-900/10">
                <img src="https://images.unsplash.com/photo-1528828085966-aff4e01c5f2b?w=700&h=700&fit=crop&auto=format" alt="Church congregation gathered in a spirit of praise and community" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-5 -right-5 lg:-right-8 bg-[#D7261E] text-white rounded-2xl p-6 shadow-xl">
                <div className="text-4xl font-black leading-none">{yearsActive}+</div>
                <div className="text-sm font-semibold opacity-80 mt-1.5 leading-snug">Years of<br />Ministry</div>
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#0E5AA7] text-white rounded-2xl px-5 py-4 shadow-xl">
                <div className="text-3xl font-black leading-none">8</div>
                <div className="text-xs font-semibold opacity-80 mt-1">Nations Reached</div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-[#0E5AA7] text-[10px] font-black tracking-widest uppercase mb-3">Our Story</p>
              <h2 className="text-4xl lg:text-5xl font-black text-foreground leading-tight mb-6">More Than a Church —<br /><span className="text-[#0E5AA7]">We're a Family</span></h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-5">Liberty For Living Ministries International was founded on a simple, profound conviction: that Jesus Christ came to set humanity free — and that freedom is meant to be lived out loud, together.</p>
              <p className="text-muted-foreground leading-relaxed mb-10">{churchSettings.mission ?? "Today, our congregation spans generations and nations, united by faith, love, and a commitment to see every person walk in their God-given destiny."}</p>
              <div className="grid grid-cols-3 gap-4 mb-10 py-8 border-y border-border">
                {[{ num: "5,000+", label: "Members" }, { num: "12", label: "Life Groups" }, { num: "20+", label: "Years Active" }].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-3xl lg:text-4xl font-black text-[#0E5AA7] leading-none">{s.num}</div>
                    <div className="text-muted-foreground text-xs font-semibold mt-2">{s.label}</div>
                  </div>
                ))}
              </div>
              <a href="#" className="inline-flex items-center gap-2 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white font-black px-9 py-4 rounded-full transition-all hover:gap-3 group shadow-lg shadow-blue-900/20">Our Full Story<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* PRAYER & CARE */}
      <section className="relative py-28 bg-[#04183a] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1485808269728-77bb07c059a8?w=1400&h=800&fit=crop&auto=format" alt="Hands held open in prayer" className="absolute inset-0 w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E5AA7]/85 via-[#04183a]/80 to-[#04183a]/90" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-white/55 text-[10px] font-black tracking-widest uppercase mb-3">We Care for You</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">You Don't Have<br />to Face It Alone</h2>
            <p className="text-white/65 text-lg leading-relaxed mb-10">Our Prayer & Care team is available to walk alongside you through life's most difficult moments — in prayer, in counsel, and in community.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="bg-white hover:bg-slate-50 text-[#0E5AA7] font-black px-8 py-4 rounded-full transition-colors flex items-center gap-2.5 justify-center shadow-xl"><Heart size={17} className="text-[#D7261E]" />Submit a Prayer Request</a>
              <a href="#" className="border-2 border-white/25 hover:border-white/60 text-white font-bold px-8 py-4 rounded-full transition-colors flex items-center gap-2.5 justify-center"><Phone size={17} />Talk to Someone</a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {careItems.map((item) => (
              <div key={item.title} className="bg-white/8 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/12 transition-colors">
                <item.icon size={20} className="text-white/60 mb-3" />
                <div className="font-bold text-white text-sm mb-1.5">{item.title}</div>
                <div className="text-white/50 text-xs leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="give" className="py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-block bg-[#D7261E]/10 text-[#D7261E] text-[10px] font-black tracking-widest uppercase px-5 py-2.5 rounded-full mb-10">Your Next Step</div>
          <h2 className="text-5xl lg:text-7xl font-black text-foreground leading-[1.04] tracking-tight mb-7">Join the<br /><span className="text-[#0E5AA7]">Liberty Family</span></h2>
          <p className="text-muted-foreground text-xl leading-relaxed max-w-xl mx-auto mb-14">Take your first step toward a life of purpose, community, and freedom. We would love to worship with you this Sunday.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="#visit" className="bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white font-black px-12 py-5 rounded-full text-lg transition-all hover:scale-105 shadow-xl shadow-blue-900/20">Join Us This Sunday</a>
            <a href="#" className="border-2 border-border hover:border-[#0E5AA7] hover:text-[#0E5AA7] text-foreground font-bold px-12 py-5 rounded-full text-lg transition-colors">Connect with Us</a>
          </div>
          <div className="bg-[#eef4fc] dark:bg-[#111c30] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div>
              <div className="font-black text-foreground text-base">Support the Ministry</div>
              <div className="text-muted-foreground text-sm mt-0.5">Your generosity helps us reach families and communities with the Gospel.</div>
            </div>
            <a href="#" className="shrink-0 bg-[#D7261E] hover:bg-[#b81f19] text-white font-black px-7 py-3.5 rounded-full text-sm transition-colors shadow-md shadow-red-900/20 whitespace-nowrap">Give Online</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#04183a] text-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 pb-14 border-b border-white/10">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl px-3 py-1.5 inline-block mb-5">
                <ImageWithFallback src={logoImg} alt="Liberty For Living Ministries International" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-white/45 text-sm leading-relaxed mb-6">{churchSettings.tagline ?? "Walking in freedom. Living in purpose. Together in Christ."}</p>
              <div className="space-y-2 text-white/45 text-xs">
                <div className="flex items-start gap-2"><MapPin size={12} className="mt-0.5 shrink-0 text-[#D7261E]" />{churchSettings.address ?? "Kingston, Jamaica"}</div>
                <div className="flex items-center gap-2"><Phone size={12} className="shrink-0 text-[#D7261E]" />{churchSettings.phone ?? "+1 876 555 0100"}</div>
                <div className="flex items-center gap-2"><Mail size={12} className="shrink-0 text-[#D7261E]" />{churchSettings.email ?? "hello@lflmi.org"}</div>
              </div>
            </div>
            {[
              { heading: "Explore", links: ["About Us", "Our Leadership", "Sermons", "Events", "Ministries"] },
              { heading: "Connect", links: ["Plan a Visit", "Life Groups", "Prayer Request", "Volunteer", "Contact Us"] },
              { heading: "Resources", links: ["Bible Studies", "Devotionals", "Podcast", "Newsletter", "Give Online"] },
            ].map((col) => (
              <div key={col.heading}>
                <div className="text-[10px] font-black tracking-widest uppercase text-white/35 mb-5">{col.heading}</div>
                <ul className="space-y-3">{col.links.map((l) => <li key={l}><a href="#" className="text-white/55 hover:text-white text-sm transition-colors font-medium">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
            <p className="text-white/30 text-xs">© 2025 Liberty For Living Ministries International. All rights reserved.</p>
            <div className="flex items-center gap-5">{socialLinks.map(([name, href]) => <a key={name} href={href} className="text-white/35 hover:text-white text-xs font-semibold capitalize transition-colors">{name}</a>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
