import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Heart, Loader2, MessageSquare, Plus, Search } from "lucide-react";
import { AdminCareDialog } from "@/app/components/admin/AdminCareDialog";
import {
  createPrayerRequest,
  getPrayerRequests,
  updatePrayerRequest,
  type PrayerRequestInput,
} from "@/lib/data";
import type { PrayerRequest } from "@/types";

export default function PrayerRequests() {
  const [items, setItems] = useState<PrayerRequest[]>([]);
  const [selected, setSelected] = useState<PrayerRequest | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState<PrayerRequest | null | undefined>();
  const [response, setResponse] = useState("");
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const requests = await getPrayerRequests();
        setItems(requests);
        setSelected(requests[0] ?? null);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load requests.");
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (status === "ALL" || item.status === status) &&
          `${item.name} ${item.requestText}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search, status],
  );

  const replace = (saved: PrayerRequest) => {
    setItems((list) => list.map((item) => (item.id === saved.id ? saved : item)));
    setSelected(saved);
  };

  const saveNew = async (input: PrayerRequestInput) => {
    const saved = await createPrayerRequest(input);
    setItems((list) => [saved, ...list]);
    setSelected(saved);
  };

  const update = async (changes: Parameters<typeof updatePrayerRequest>[1]) => {
    if (!selected) return;
    replace(await updatePrayerRequest(selected.id, changes));
  };

  return (
    <div className="flex h-full">
      <aside
        className={`${showDetail ? "hidden lg:flex" : "flex"} w-full flex-col border-r bg-white lg:w-96`}
      >
        <div className="border-b p-5">
          <div className="mb-4 flex justify-between">
            <div>
              <h1 className="font-black">Prayer Requests</h1>
              <p className="text-xs text-[#6b7897]">
                {items.filter((item) => ["NEW", "OPEN"].includes(item.status)).length} open
              </p>
            </div>
            <button
              onClick={() => setEditing(null)}
              className="rounded-xl bg-[#D7261E] px-3 py-2 text-xs font-bold text-white"
            >
              <Plus size={14} className="inline" /> New
            </button>
          </div>
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-3" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-xl bg-[#f0f4f9] py-2.5 pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {["ALL", "NEW", "OPEN", "PRAYED", "ANSWERED", "CLOSED"].map((value) => (
              <button
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-full px-2 py-1 text-[10px] font-bold ${
                  status === value ? "bg-[#0E5AA7] text-white" : "bg-[#f0f4f9]"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y overflow-y-auto">
          {filtered.map((request) => (
            <button
              key={request.id}
              onClick={() => {
                setSelected(request);
                setShowDetail(true);
              }}
              className={`w-full p-4 text-left ${selected?.id === request.id ? "bg-[#e8f0fb]" : ""}`}
            >
              <div className="flex justify-between">
                <b>{request.isAnonymous ? "Anonymous" : request.name}</b>
                <span className="text-[10px] font-bold text-[#0E5AA7]">{request.status}</span>
              </div>
              <p className="line-clamp-2 text-xs text-[#6b7897]">{request.requestText}</p>
            </button>
          ))}
        </div>
      </aside>

      <main
        className={`${showDetail ? "block" : "hidden lg:block"} flex-1 overflow-y-auto bg-[#f0f4f9] p-5 lg:p-7`}
      >
        <button
          onClick={() => setShowDetail(false)}
          className="mb-4 rounded-xl bg-[#0E5AA7] px-4 py-2 text-sm font-bold text-white lg:hidden"
        >
          Back to requests
        </button>
        {error && <div className="bg-red-50 p-3 text-red-700">{error}</div>}
        {busy ? (
          <Loader2 className="mx-auto animate-spin" />
        ) : selected ? (
          <div className="space-y-5">
            <section className="rounded-2xl bg-white p-6">
              <div className="flex gap-3">
                <Heart className="text-[#D7261E]" />
                <div>
                  <h2 className="text-xl font-black">{selected.isAnonymous ? "Anonymous" : selected.name}</h2>
                  <p className="text-xs text-[#6b7897]">
                    {selected.category} | {selected.urgency} | {selected.status}
                  </p>
                </div>
              </div>
            </section>
            <section className="rounded-2xl bg-white p-5">
              <h3 className="mb-3 font-black">Prayer Request</h3>
              <p className="rounded-xl bg-[#f0f4f9] p-4 text-sm">{selected.requestText}</p>
            </section>
            <section className="rounded-2xl bg-white p-5">
              <h3 className="mb-3 font-black">Pastoral Response</h3>
              {selected.response && (
                <p className="mb-3 rounded-xl bg-green-50 p-4 text-sm">{selected.response}</p>
              )}
              <textarea
                value={response}
                onChange={(event) => setResponse(event.target.value)}
                rows={3}
                className="mb-2 w-full rounded-xl bg-[#f0f4f9] p-3"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => void update({ response, status: "PRAYED" })}
                  className="flex-1 rounded-xl bg-[#0E5AA7] p-2.5 text-xs font-bold text-white"
                >
                  <MessageSquare size={13} className="inline" /> Save Response
                </button>
                <button
                  onClick={() => void update({ status: "ANSWERED", response: response || selected.response })}
                  className="rounded-xl bg-green-50 px-4 text-xs font-bold text-green-700"
                >
                  <CheckCircle size={13} className="inline" /> Answered
                </button>
              </div>
            </section>
            <section className="rounded-2xl bg-white p-5">
              <div className="flex flex-wrap gap-2">
                {["NEW", "OPEN", "PRAYED", "ANSWERED", "CLOSED"].map((value) => (
                  <button
                    key={value}
                    onClick={() => void update({ status: value as PrayerRequest["status"] })}
                    className={`rounded-xl px-3 py-2 text-xs font-bold ${
                      selected.status === value ? "bg-[#0E5AA7] text-white" : "bg-[#f0f4f9]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="mt-20 text-center text-sm text-[#6b7897]">Select a request</div>
        )}
      </main>

      {editing !== undefined && (
        <AdminCareDialog
          kind="prayer"
          value={editing}
          onClose={() => setEditing(undefined)}
          onSave={saveNew}
        />
      )}
    </div>
  );
}
