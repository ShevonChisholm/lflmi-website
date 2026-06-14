import { useState } from "react";
import { Save, Plus, Trash2, Globe, Phone, Mail, MapPin, Clock, Facebook, Youtube } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoImg from "@/imports/PHOTO-2025-11-20-06-26-28-removebg-preview.png";

const defaultServiceTimes = [
  { id: 1, day: "Sunday", label: "Early Service", time: "8:00 AM" },
  { id: 2, day: "Sunday", label: "Main Service", time: "10:30 AM" },
  { id: 3, day: "Wednesday", label: "Midweek Prayer", time: "7:00 PM" },
];

function Field({ label, value, onChange, type = "text", multiline = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; multiline?: boolean }) {
  return (
    <div>
      <label className="text-xs font-black text-[#0d1b2e] tracking-wide uppercase mb-1.5 block">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full px-4 py-3 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 resize-none transition-all" />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-3 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-black text-[#0d1b2e] mb-5 pb-3 border-b border-[#e8eef6]">{title}</h2>
      {children}
    </div>
  );
}

export default function About() {
  const [saved, setSaved] = useState(false);
  const [churchName, setChurchName] = useState("Liberty For Living Ministries International");
  const [tagline, setTagline] = useState("Walking in freedom. Living in purpose. Together in Christ.");
  const [bio, setBio] = useState("Liberty For Living Ministries International was founded on a simple, profound conviction: that Jesus Christ came to set humanity free — and that freedom is meant to be lived out loud, together. Today, our congregation spans generations and nations, united by faith, love, and a commitment to see every person walk in their God-given destiny.");
  const [address, setAddress] = useState("123 Liberty Way, Kingston, Jamaica");
  const [phone, setPhone] = useState("+1 876 555 0100");
  const [email, setEmail] = useState("hello@lflmi.org");
  const [website, setWebsite] = useState("www.lflmi.org");
  const [facebook, setFacebook] = useState("facebook.com/lflmi");
  const [instagram, setInstagram] = useState("instagram.com/lflmi");
  const [youtube, setYoutube] = useState("youtube.com/@lflmi");
  const [twitter, setTwitter] = useState("twitter.com/lflmi");
  const [seniorPastor, setSeniorPastor] = useState("Pastor Emmanuel Adeyemi");
  const [associatePastor, setAssociatePastor] = useState("Pastor Yemi Adeyemi");
  const [founded, setFounded] = useState("2005");
  const [vision, setVision] = useState("To see every person walk in the fullness of the liberty Christ has provided — free, purposeful, and rooted in community.");
  const [mission, setMission] = useState("To make disciples of all nations by preaching the Gospel, building authentic community, and transforming lives through the power of the Holy Spirit.");

  const [serviceTimes, setServiceTimes] = useState(defaultServiceTimes);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addServiceTime = () => {
    setServiceTimes([...serviceTimes, { id: Date.now(), day: "Sunday", label: "Service", time: "12:00 PM" }]);
  };

  const removeServiceTime = (id: number) => {
    setServiceTimes(serviceTimes.filter(s => s.id !== id));
  };

  return (
    <div className="p-5 lg:p-7 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">About & Settings</h1>
          <p className="text-sm text-[#6b7897] mt-1">Manage church information displayed on the public site</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm ${saved ? "bg-green-600 text-white" : "bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white"}`}>
          <Save size={16} />{saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Logo preview */}
      <Section title="Church Branding">
        <div className="flex items-center gap-5">
          <div className="bg-white border-2 border-[#e8eef6] rounded-2xl p-4 shadow-sm">
            <ImageWithFallback src={logoImg} alt="Church Logo" className="h-16 w-auto object-contain" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#0d1b2e] mb-1">Current Logo</div>
            <p className="text-xs text-[#6b7897] mb-3">Liberty For Living Ministries International — PNG with transparent background</p>
            <button className="text-xs font-bold text-[#0E5AA7] bg-[#0E5AA7]/10 hover:bg-[#0E5AA7]/15 px-3 py-2 rounded-xl transition-colors">Replace Logo</button>
          </div>
        </div>
      </Section>

      {/* Church Info */}
      <Section title="Church Information">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2"><Field label="Church Name" value={churchName} onChange={setChurchName} /></div>
          <div className="md:col-span-2"><Field label="Tagline / Motto" value={tagline} onChange={setTagline} /></div>
          <Field label="Founded Year" value={founded} onChange={setFounded} />
          <Field label="Senior Pastor" value={seniorPastor} onChange={setSeniorPastor} />
          <Field label="Associate Pastor" value={associatePastor} onChange={setAssociatePastor} />
        </div>
      </Section>

      {/* Vision & Mission */}
      <Section title="Vision & Mission">
        <div className="space-y-4">
          <Field label="Vision Statement" value={vision} onChange={setVision} multiline />
          <Field label="Mission Statement" value={mission} onChange={setMission} multiline />
          <Field label="About / Bio" value={bio} onChange={setBio} multiline />
        </div>
      </Section>

      {/* Contact */}
      <Section title="Contact Information">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-black text-[#0d1b2e] tracking-wide uppercase mb-1.5 block">Physical Address</label>
            <div className="relative">
              <MapPin size={14} className="absolute left-3 top-3.5 text-[#0E5AA7]" />
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
            </div>
          </div>
          {[
            { label: "Phone Number", value: phone, set: setPhone, icon: Phone },
            { label: "Email Address", value: email, set: setEmail, icon: Mail },
            { label: "Website", value: website, set: setWebsite, icon: Globe },
          ].map((f) => (
            <div key={f.label}>
              <label className="text-xs font-black text-[#0d1b2e] tracking-wide uppercase mb-1.5 block">{f.label}</label>
              <div className="relative">
                <f.icon size={14} className="absolute left-3 top-3.5 text-[#0E5AA7]" />
                <input value={f.value} onChange={(e) => f.set(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Service Times */}
      <Section title="Service Times">
        <div className="space-y-3 mb-4">
          {serviceTimes.map((s) => (
            <div key={s.id} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0E5AA7]/10 flex items-center justify-center shrink-0"><Clock size={14} className="text-[#0E5AA7]" /></div>
              <select value={s.day} onChange={(e) => setServiceTimes(st => st.map(t => t.id === s.id ? { ...t, day: e.target.value } : t))} className="bg-[#f0f4f9] rounded-xl px-3 py-2.5 text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all">
                {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(d => <option key={d}>{d}</option>)}
              </select>
              <input value={s.label} onChange={(e) => setServiceTimes(st => st.map(t => t.id === s.id ? { ...t, label: e.target.value } : t))} placeholder="Label" className="flex-1 bg-[#f0f4f9] rounded-xl px-3 py-2.5 text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
              <input value={s.time} onChange={(e) => setServiceTimes(st => st.map(t => t.id === s.id ? { ...t, time: e.target.value } : t))} placeholder="7:00 PM" className="w-28 bg-[#f0f4f9] rounded-xl px-3 py-2.5 text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
              <button onClick={() => removeServiceTime(s.id)} className="p-2 rounded-lg text-[#6b7897] hover:bg-red-50 hover:text-[#D7261E] transition-colors"><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <button onClick={addServiceTime} className="flex items-center gap-2 text-sm font-bold text-[#0E5AA7] bg-[#0E5AA7]/8 hover:bg-[#0E5AA7]/15 px-4 py-2.5 rounded-xl transition-colors">
          <Plus size={15} />Add Service Time
        </button>
      </Section>

      {/* Social Media */}
      <Section title="Social Media Links">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "Facebook", value: facebook, set: setFacebook, icon: Facebook, color: "#1877f2" },
            { label: "Instagram", value: instagram, set: setInstagram, icon: Globe, color: "#e1306c" },
            { label: "YouTube", value: youtube, set: setYoutube, icon: Youtube, color: "#ff0000" },
            { label: "Twitter / X", value: twitter, set: setTwitter, icon: Globe, color: "#1da1f2" },
          ].map((s) => (
            <div key={s.label}>
              <label className="text-xs font-black text-[#0d1b2e] tracking-wide uppercase mb-1.5 block">{s.label}</label>
              <div className="relative">
                <s.icon size={14} className="absolute left-3 top-3.5" style={{ color: s.color }} />
                <input value={s.value} onChange={(e) => s.set(e.target.value)} className="w-full pl-9 pr-4 py-3 bg-[#f0f4f9] rounded-xl text-sm text-[#0d1b2e] outline-none focus:ring-2 focus:ring-[#0E5AA7]/20 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Save CTA */}
      <div className="flex justify-end pb-4">
        <button onClick={handleSave} className={`flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all shadow ${saved ? "bg-green-600 text-white" : "bg-[#0E5AA7] hover:bg-[#0a4a8a] text-white"}`}>
          <Save size={16} />{saved ? "All changes saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
