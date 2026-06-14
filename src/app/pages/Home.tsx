import { useState, useEffect } from "react";
import {
  Menu, X, ChevronRight, MapPin, Clock,
  Heart, Users, BookOpen, Music, Baby, Globe,
  Play, ArrowRight, Phone, Mail
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Sermons", href: "#sermons" },
  { label: "Ministries", href: "#ministries" },
  { label: "Events", href: "#events" },
  { label: "Give", href: "#give" },
];

const serviceTimes = [
  { day: "Sunday", time: "8:00 AM", label: "Early Service" },
  { day: "Sunday", time: "10:30 AM", label: "Main Service" },
  { day: "Wednesday", time: "7:00 PM", label: "Midweek Prayer" },
];

const events = [
  { month: "JUN", day: "22", title: "Family Faith Night", description: "A special evening of worship, games, and fellowship for the entire family.", time: "6:00 PM – 9:00 PM", location: "Main Sanctuary", tag: "Family" },
  { month: "JUN", day: "29", title: "Baptism Sunday", description: "Celebrate new beginnings as members of our congregation take their next step of faith.", time: "10:30 AM Service", location: "Main Sanctuary", tag: "Worship" },
  { month: "JUL", day: "5", title: "Youth Summer Retreat", description: "Three days of adventure, discipleship, and community for teens ages 13–18.", time: "Jul 5 – Jul 7", location: "Camp Freedom", tag: "Youth" },
];

const ministries = [
  { icon: Baby, title: "Children's Ministry", desc: "Safe, fun, and faith-filled environments for kids from birth through 5th grade.", color: "#0E5AA7" },
  { icon: Users, title: "Youth & Young Adults", desc: "Empowering the next generation to live bold, Spirit-led lives with purpose.", color: "#D7261E" },
  { icon: Heart, title: "Women's Fellowship", desc: "A sisterhood built on prayer, authenticity, and the transforming Word of God.", color: "#0E5AA7" },
  { icon: Globe, title: "Global Missions", desc: "Carrying the love of Christ to communities near and far around the world.", color: "#D7261E" },
  { icon: Music, title: "Worship Arts", desc: "Serving God and the congregation through music, media, and creative expression.", color: "#0E5AA7" },
  { icon: BookOpen, title: "Life Groups", desc: "Deeper community through mid-week small groups meeting all across the city.", color: "#D7261E" },
];

const careItems = [
  { title: "Prayer Team", desc: "Dedicated intercessors praying for submitted requests daily.", icon: Heart },
  { title: "Counseling", desc: "Professional Christian counseling available on request.", icon: Users },
  { title: "Care Groups", desc: "Support communities for grief, recovery, and life transitions.", icon: Globe },
  { title: "Home Visitation", desc: "We come to you when you cannot come to us.", icon: MapPin },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">A community of faith where every person is seen, loved, and empowered to walk in the freedom that Christ provides.</p>
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

      {/* SERVICE TIMES */}
      <section className="bg-[#0E5AA7] text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/15">
          {serviceTimes.map((s) => (
            <div key={s.label} className="flex items-center gap-4 py-6 sm:py-8 sm:px-10 first:pl-0 last:pr-0">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Clock size={18} className="opacity-80" /></div>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase opacity-60 mb-0.5">{s.day} — {s.label}</div>
                <div className="text-2xl font-black">{s.time}</div>
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
              <img src="https://images.unsplash.com/photo-1610414961792-b7fffebddd14?w=900&h=600&fit=crop&auto=format" alt="Pastor preaching on stage during evening service" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300"><Play size={28} className="fill-white text-white ml-1" /></div>
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <span className="bg-[#D7261E] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg">June 15, 2025</span>
                <span className="bg-black/40 backdrop-blur-sm text-white/80 text-xs font-semibold px-3 py-1.5 rounded-full">48 min</span>
              </div>
            </div>
            <div className="lg:col-span-2 bg-card p-8 lg:p-10 flex flex-col justify-center">
              <div className="text-[#0E5AA7] text-[10px] font-black tracking-widest uppercase mb-5">Series: Walking In Freedom</div>
              <h3 className="text-2xl lg:text-[1.75rem] font-black text-card-foreground leading-tight mb-4">"Unshackled: Living Free from Fear"</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-7">In this powerful message, Pastor Emmanuel explores how perfect love casts out all fear — and how we can step boldly into the liberty Christ has purchased for us.</p>
              <div className="flex items-center gap-3 pb-7 border-b border-border">
                <div className="w-11 h-11 rounded-full bg-[#0E5AA7]/10 flex items-center justify-center shrink-0"><BookOpen size={17} className="text-[#0E5AA7]" /></div>
                <div>
                  <div className="font-bold text-card-foreground text-sm">Pastor Emmanuel Adeyemi</div>
                  <div className="text-muted-foreground text-xs mt-0.5">Senior Pastor, LFLMI</div>
                </div>
              </div>
              <div className="flex gap-3 mt-7">
                <button className="flex-1 bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white font-bold py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2"><Play size={13} className="fill-white" />Watch Now</button>
                <button className="px-5 py-3 border-2 border-border hover:border-[#0E5AA7] hover:text-[#0E5AA7] text-foreground rounded-full text-sm font-bold transition-colors">Notes</button>
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
                <div className="font-black text-foreground text-xl leading-tight">8:00 AM<br />& 10:30 AM</div>
                <div className="text-muted-foreground text-xs mt-2 flex items-start gap-1.5 leading-snug"><MapPin size={11} className="mt-0.5 shrink-0 text-[#D7261E]" />123 Liberty Way, Abuja, Nigeria</div>
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
            {events.map((ev) => (
              <div key={ev.title} className="group bg-card rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1.5">
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
            {ministries.map((m) => (
              <div key={m.title} className="group bg-card rounded-3xl p-7 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer">
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
                <div className="text-4xl font-black leading-none">20+</div>
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
              <p className="text-muted-foreground leading-relaxed mb-10">Today, our congregation spans generations and nations, united by faith, love, and a commitment to see every person walk in their God-given destiny.</p>
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
              <p className="text-white/45 text-sm leading-relaxed mb-6">Walking in freedom.<br />Living in purpose.<br />Together in Christ.</p>
              <div className="space-y-2 text-white/45 text-xs">
                <div className="flex items-start gap-2"><MapPin size={12} className="mt-0.5 shrink-0 text-[#D7261E]" />123 Liberty Way, Abuja, Nigeria</div>
                <div className="flex items-center gap-2"><Phone size={12} className="shrink-0 text-[#D7261E]" />+234 800 LIBERTY</div>
                <div className="flex items-center gap-2"><Mail size={12} className="shrink-0 text-[#D7261E]" />hello@lflmi.org</div>
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
            <div className="flex items-center gap-5">{["Facebook", "Instagram", "YouTube", "Twitter"].map((s) => <a key={s} href="#" className="text-white/35 hover:text-white text-xs font-semibold transition-colors">{s}</a>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
