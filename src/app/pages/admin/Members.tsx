import { useEffect, useMemo, useState } from "react";
import { Edit2, Loader2, Mail, Search } from "lucide-react";
import { AdminCareDialog } from "@/app/components/admin/AdminCareDialog";
import {
  getMembers,
  getPeople,
  updateMember,
  type MemberInput,
} from "@/lib/data";
import type { Member, Person } from "@/types";

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [editing, setEditing] = useState<Member | null | undefined>();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [memberRows, peopleRows] = await Promise.all([
          getMembers(),
          getPeople(),
        ]);
        setMembers(memberRows);
        setPeople(peopleRows);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load members.",
        );
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const rows = useMemo(
    () =>
      members
        .map((member) => ({
          member,
          person: people.find((person) => person.id === member.personId),
        }))
        .filter(
          (row) =>
            (status === "ALL" || row.member.status === status) &&
            `${row.person?.firstName ?? ""} ${row.person?.lastName ?? ""} ${
              row.person?.email ?? ""
            }`
              .toLowerCase()
              .includes(search.toLowerCase()),
        ),
    [members, people, search, status],
  );

  const save = async (input: MemberInput) => {
    if (!editing) return;
    const saved = await updateMember(editing.id, input);
    setMembers((list) =>
      list.map((item) => (item.id === saved.id ? saved : item)),
    );
  };

  return (
    <div className="p-4 lg:p-7">
      <div className="mb-6">
        <h1 className="text-2xl font-black">Members</h1>
        <p className="text-sm text-[#6b7897]">
          {members.filter((member) => member.status === "ACTIVE").length} active
          members · new members are added from Visitors
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-3" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl bg-white py-2.5 pl-9 pr-3"
            placeholder="Search members..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          {["ALL", "ACTIVE", "NEW", "INACTIVE"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setStatus(item)}
              className={`rounded-xl px-3 py-2 text-xs font-bold ${
                status === item ? "bg-[#0E5AA7] text-white" : "bg-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 p-3 text-red-700">{error}</div>}

      {busy ? (
        <Loader2 className="mx-auto animate-spin" />
      ) : (
        <div className="responsive-admin-table overflow-x-auto rounded-2xl bg-white">
          <table className="w-full">
            <tbody className="divide-y">
              {rows.map(({ member, person }) => (
                <tr key={member.id}>
                  <td data-label="Member" className="p-4">
                    <b>
                      {person?.firstName} {person?.lastName}
                    </b>
                    <div className="text-xs text-[#6b7897]">
                      {member.membershipNumber ?? "No membership number"}
                    </div>
                  </td>
                  <td data-label="Contact" className="p-4 text-xs">
                    {person?.email}
                    <br />
                    {person?.phone}
                  </td>
                  <td data-label="Role" className="p-4 text-sm">
                    {member.role ?? "Member"}
                  </td>
                  <td data-label="Joined" className="p-4 text-sm">
                    {new Date(member.joinDate).toLocaleDateString()}
                  </td>
                  <td data-label="Status" className="p-4">
                    <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-bold text-green-700">
                      {member.status}
                    </span>
                  </td>
                  <td data-actions="true" className="p-4">
                    <div className="flex justify-end gap-1">
                      {person?.email && (
                        <a href={`mailto:${person.email}`} className="p-2">
                          <Mail size={14} />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setEditing(member)}
                        className="p-2"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing !== undefined && editing && (
        <AdminCareDialog
          kind="member"
          value={editing}
          personId={editing.personId}
          onClose={() => setEditing(undefined)}
          onSave={save}
        />
      )}
    </div>
  );
}
