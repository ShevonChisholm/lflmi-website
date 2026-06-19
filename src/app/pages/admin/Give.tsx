import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Download,
  Edit2,
  HandCoins,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AdminCmsDialog } from "@/app/components/admin/AdminCmsDialog";
import { AdminConfirmDialog } from "@/app/components/admin/AdminConfirmDialog";
import {
  createGivingProgram,
  createGivingTransaction,
  deleteGivingProgram,
  deleteGivingTransaction,
  getGivingPrograms,
  getGivingTransactions,
  updateGivingProgram,
  updateGivingTransaction,
  type GivingProgramInput,
  type GivingTransactionInput,
} from "@/lib/data";
import type {
  GivingProgram,
  GivingTransaction,
  GivingType,
  PaymentMethod,
} from "@/types";

const givingTypes: GivingType[] = ["TITHE", "OFFERING", "DONATION", "OTHER"];
const paymentMethods: PaymentMethod[] = [
  "BANK_TRANSFER",
  "CARD",
  "CASH",
  "OTHER",
];

const fieldClass =
  "w-full rounded-xl border border-[#e8eef6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#0E5AA7]";

const money = (amount: number, currency = "JMD") =>
  new Intl.NumberFormat("en-JM", {
    style: "currency",
    currency,
  }).format(amount);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-JM", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Jamaica",
  }).format(new Date(value));

const toDatetimeLocal = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
};

const fromDatetimeLocal = (value: string) =>
  value ? new Date(value).toISOString() : new Date().toISOString();

export default function Give() {
  const [programs, setPrograms] = useState<GivingProgram[]>([]);
  const [transactions, setTransactions] = useState<GivingTransaction[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<GivingProgram | null | undefined>();
  const [deleting, setDeleting] = useState<GivingProgram | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<
    GivingTransaction | null | undefined
  >();
  const [deletingTransaction, setDeletingTransaction] =
    useState<GivingTransaction | null>(null);
  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGiving = async () => {
    const [givingPrograms, givingTransactions] = await Promise.all([
      getGivingPrograms(),
      getGivingTransactions(),
    ]);
    setPrograms(givingPrograms);
    setTransactions(givingTransactions);
  };

  useEffect(() => {
    void (async () => {
      try {
        await loadGiving();
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load giving data.",
        );
      } finally {
        setBusy(false);
      }
    })();
  }, []);

  const filteredTransactions = useMemo(
    () =>
      transactions.filter((transaction) => {
        const program = programs.find(
          (item) => item.id === transaction.programId,
        );
        return `${transaction.giverName ?? ""} ${transaction.type} ${
          transaction.paymentMethod
        } ${transaction.reference ?? ""} ${program?.name ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase());
      }),
    [programs, search, transactions],
  );

  const raisedByProgram = useMemo(() => {
    const totals = new Map<string, number>();

    for (const transaction of transactions) {
      if (!transaction.programId) continue;
      totals.set(
        transaction.programId,
        (totals.get(transaction.programId) ?? 0) + transaction.amount,
      );
    }

    return totals;
  }, [transactions]);

  const totals = useMemo(
    () => ({
      totalGiving: transactions.reduce(
        (total, transaction) => total + transaction.amount,
        0,
      ),
      transactionCount: transactions.length,
      anonymousCount: transactions.filter((transaction) => transaction.isAnonymous)
        .length,
    }),
    [transactions],
  );

  const saveProgram = async (input: GivingProgramInput) => {
    setSaving(true);
    setError("");

    try {
      const saved = editing
        ? await updateGivingProgram(editing.id, input)
        : await createGivingProgram(input);
      setPrograms((list) =>
        editing
          ? list.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...list],
      );
      setEditing(undefined);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save giving program.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeProgram = async () => {
    if (!deleting) return;

    setSaving(true);
    setError("");

    try {
      await deleteGivingProgram(deleting.id);
      setPrograms((list) => list.filter((item) => item.id !== deleting.id));
      setTransactions((list) =>
        list.map((transaction) =>
          transaction.programId === deleting.id
            ? { ...transaction, programId: null }
            : transaction,
        ),
      );
      setDeleting(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete giving program.",
      );
    } finally {
      setSaving(false);
    }
  };

  const saveTransaction = async (input: GivingTransactionInput) => {
    setSaving(true);
    setError("");

    try {
      const saved = editingTransaction
        ? await updateGivingTransaction(editingTransaction.id, input)
        : await createGivingTransaction(input);

      setTransactions((list) =>
        editingTransaction
          ? list.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...list],
      );
      setEditingTransaction(undefined);
      setPrograms(await getGivingPrograms());
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save giving transaction.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeTransaction = async () => {
    if (!deletingTransaction) return;

    setSaving(true);
    setError("");

    try {
      await deleteGivingTransaction(deletingTransaction.id);
      setTransactions((list) =>
        list.filter((item) => item.id !== deletingTransaction.id),
      );
      setDeletingTransaction(null);
      setPrograms(await getGivingPrograms());
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete giving transaction.",
      );
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const rows = [
      [
        "Program",
        "Giver",
        "Type",
        "Amount",
        "Currency",
        "Method",
        "Reference",
        "Received",
        "Anonymous",
        "Notes",
      ],
      ...filteredTransactions.map((transaction) => {
        const program = programs.find(
          (item) => item.id === transaction.programId,
        );
        return [
          program?.name ?? "",
          transaction.isAnonymous ? "Anonymous" : transaction.giverName ?? "",
          transaction.type,
          String(transaction.amount),
          transaction.currency,
          transaction.paymentMethod,
          transaction.reference ?? "",
          transaction.receivedAt,
          transaction.isAnonymous ? "Yes" : "No",
          transaction.notes ?? "",
        ];
      }),
    ];

    const blob = new Blob(
      [
        rows
          .map((row) =>
            row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","),
          )
          .join("\n"),
      ],
      { type: "text/csv" },
    );
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "giving-transactions.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6 p-5 lg:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#0d1b2e]">
            Give Programs
          </h1>
          <p className="mt-1 text-sm text-[#6b7897]">
            Track giving programs, goals, and transactions in Jamaican dollars.
          </p>
        </div>

        <div className="grid w-full gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end">
          <button
            type="button"
            onClick={() => setEditingTransaction(null)}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white"
          >
            <Plus size={16} />
            Add Transaction
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0E5AA7] px-4 py-2.5 text-sm font-bold text-white"
          >
            <Plus size={16} />
            New Program
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total giving" value={money(totals.totalGiving)} />
        <StatCard label="Transactions" value={String(totals.transactionCount)} />
        <StatCard label="Anonymous gifts" value={String(totals.anonymousCount)} />
      </div>

      {busy && programs.length === 0 ? (
        <div className="flex justify-center p-16">
          <Loader2 className="animate-spin text-[#0E5AA7]" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((item) => {
            const amountRaised = raisedByProgram.get(item.id) ?? item.amountRaised;
            const progress = item.goalAmount
              ? Math.round((amountRaised / item.goalAmount) * 100)
              : 0;

            return (
              <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-black text-[#0d1b2e]">{item.name}</h3>
                    <p className="mt-1 text-xs leading-5 text-[#6b7897]">
                      {item.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing(item)}
                      className="rounded-lg p-2 text-[#6b7897] hover:bg-[#f0f4f9]"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleting(item)}
                      className="rounded-lg p-2 text-[#D7261E] hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-2 flex items-end justify-between">
                  <div>
                    <div
                      className="text-xl font-black"
                      style={{ color: item.color ?? "#0E5AA7" }}
                    >
                      {money(amountRaised, item.currency)}
                    </div>
                    <div className="text-xs text-[#6b7897]">
                      of{" "}
                      {item.goalAmount
                        ? money(item.goalAmount, item.currency)
                        : "open goal"}
                    </div>
                  </div>
                  <div className="text-2xl font-black text-[#0d1b2e]">
                    {item.goalAmount ? `${progress}%` : "Open"}
                  </div>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[#e8eef6]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(progress, 100)}%`,
                      backgroundColor: item.color ?? "#0E5AA7",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-black text-[#0d1b2e]">Transactions</h2>
            <p className="text-xs text-[#6b7897]">
              Create, reconcile, and export giving records.
            </p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!filteredTransactions.length}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0E5AA7] disabled:opacity-40"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-3 text-[#6b7897]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search giver, program, reference, method..."
              className="w-full rounded-xl border border-[#e8eef6] bg-white py-2.5 pl-9 pr-4 text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="responsive-admin-table overflow-x-auto">
            <table className="w-full md:min-w-[920px]">
              <thead>
                <tr className="border-b border-[#e8eef6] text-left text-[10px] uppercase tracking-widest text-[#6b7897]">
                  <th className="px-5 py-4">Giver</th>
                  <th className="px-4 py-4">Program</th>
                  <th className="px-4 py-4">Type</th>
                  <th className="px-4 py-4">Method</th>
                  <th className="px-4 py-4">Reference</th>
                  <th className="px-4 py-4">Received</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8eef6]">
                {filteredTransactions.map((transaction) => {
                  const program = programs.find(
                    (item) => item.id === transaction.programId,
                  );

                  return (
                    <tr key={transaction.id}>
                      <td data-label="Giver" className="px-5 py-4 text-sm font-semibold text-[#0d1b2e]">
                        {transaction.isAnonymous
                          ? "Anonymous"
                          : transaction.giverName || "Unassigned giver"}
                      </td>
                      <td data-label="Program" className="px-4 py-4 text-xs text-[#6b7897]">
                        {program?.name ?? "No program"}
                      </td>
                      <td data-label="Type" className="px-4 py-4 text-xs text-[#6b7897]">
                        {transaction.type}
                      </td>
                      <td data-label="Method" className="px-4 py-4 text-xs text-[#6b7897]">
                        {transaction.paymentMethod.replace("_", " ")}
                      </td>
                      <td data-label="Reference" className="px-4 py-4 text-xs text-[#6b7897]">
                        {transaction.reference || "No reference"}
                      </td>
                      <td data-label="Received" className="px-4 py-4 text-xs text-[#6b7897]">
                        {formatDate(transaction.receivedAt)}
                      </td>
                      <td data-label="Amount" className="px-5 py-4 text-right text-sm font-black text-green-700">
                        {money(transaction.amount, transaction.currency)}
                      </td>
                      <td data-actions="true" className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingTransaction(transaction)}
                            className="rounded-lg p-2 text-[#6b7897] hover:bg-[#f0f4f9]"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingTransaction(transaction)}
                            className="rounded-lg p-2 text-[#D7261E] hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {!filteredTransactions.length && (
            <div className="p-8 text-center text-sm text-[#6b7897]">
              No transactions match this view.
            </div>
          )}
        </div>
      </section>

      {editing !== undefined && (
        <AdminCmsDialog
          kind="giving"
          value={editing}
          onClose={() => setEditing(undefined)}
          onSave={saveProgram}
        />
      )}

      {editingTransaction !== undefined && (
        <GivingTransactionDialog
          value={editingTransaction}
          programs={programs}
          busy={saving}
          onClose={() => setEditingTransaction(undefined)}
          onSave={saveTransaction}
        />
      )}

      {deleting && (
        <AdminConfirmDialog
          title="Delete giving program?"
          message={`Transactions remain preserved, but "${deleting.name}" will be unlinked.`}
          busy={saving}
          onCancel={() => setDeleting(null)}
          onConfirm={() => void removeProgram()}
        />
      )}

      {deletingTransaction && (
        <AdminConfirmDialog
          title="Delete giving transaction?"
          message={`This permanently removes ${money(deletingTransaction.amount, deletingTransaction.currency)} from the giving records.`}
          busy={saving}
          onCancel={() => setDeletingTransaction(null)}
          onConfirm={() => void removeTransaction()}
        />
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">
        <HandCoins size={18} />
      </div>
      <div className="text-2xl font-black text-[#0d1b2e]">{value}</div>
      <div className="text-xs font-bold text-[#6b7897]">{label}</div>
    </div>
  );
}

function GivingTransactionDialog({
  value,
  programs,
  busy,
  onClose,
  onSave,
}: {
  value: GivingTransaction | null;
  programs: GivingProgram[];
  busy: boolean;
  onClose: () => void;
  onSave: (input: GivingTransactionInput) => Promise<void>;
}) {
  const [isAnonymous, setIsAnonymous] = useState(value?.isAnonymous ?? false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get("amount") ?? 0);
    const programId = String(form.get("programId") ?? "");
    const reference = String(form.get("reference") ?? "").trim();
    const giverName = String(form.get("giverName") ?? "").trim();
    const notes = String(form.get("notes") ?? "").trim();

    void onSave({
      programId: programId || null,
      giverName: isAnonymous ? null : giverName || null,
      type: String(form.get("type") ?? "DONATION") as GivingType,
      amount,
      currency: String(form.get("currency") ?? "JMD").trim() || "JMD",
      paymentMethod: String(form.get("paymentMethod") ?? "OTHER") as PaymentMethod,
      receivedAt: fromDatetimeLocal(String(form.get("receivedAt") ?? "")),
      reference: reference || null,
      isAnonymous,
      notes: notes || null,
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center overflow-y-auto bg-[#04183a]/60 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <form
        onSubmit={submit}
        className="max-h-[100dvh] w-full max-w-3xl overflow-y-auto rounded-t-3xl bg-white p-4 shadow-2xl sm:max-h-[92vh] sm:rounded-3xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-[#0d1b2e] sm:text-xl">
              {value ? "Edit transaction" : "Add transaction"}
            </h2>
            <p className="mt-1 text-sm text-[#6b7897]">
              Record giving received by cash, transfer, card, or another method.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-xl bg-[#f0f4f9] px-3 py-2 text-sm font-bold text-[#6b7897]"
          >
            Close
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-[#0d1b2e]">
            Giving program
            <select
              name="programId"
              defaultValue={value?.programId ?? ""}
              className={`${fieldClass} mt-2`}
            >
              <option value="">No program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Giver name
            <input
              name="giverName"
              disabled={isAnonymous}
              defaultValue={value?.giverName ?? ""}
              className={`${fieldClass} mt-2 disabled:bg-[#f0f4f9]`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Type
            <select
              name="type"
              defaultValue={value?.type ?? "DONATION"}
              className={`${fieldClass} mt-2`}
            >
              {givingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Payment method
            <select
              name="paymentMethod"
              defaultValue={value?.paymentMethod ?? "OTHER"}
              className={`${fieldClass} mt-2`}
            >
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method.replace("_", " ")}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Amount
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              defaultValue={value?.amount ?? ""}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Currency
            <input
              name="currency"
              defaultValue={value?.currency ?? "JMD"}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Received date
            <input
              name="receivedAt"
              type="datetime-local"
              required
              defaultValue={toDatetimeLocal(value?.receivedAt) || toDatetimeLocal(new Date().toISOString())}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="text-sm font-bold text-[#0d1b2e]">
            Reference
            <input
              name="reference"
              defaultValue={value?.reference ?? ""}
              className={`${fieldClass} mt-2`}
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-[#e8eef6] p-4 text-sm font-bold text-[#0d1b2e] sm:col-span-2">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(event) => setIsAnonymous(event.target.checked)}
              className="h-4 w-4"
            />
            Anonymous gift
          </label>

          <label className="text-sm font-bold text-[#0d1b2e] sm:col-span-2">
            Notes
            <textarea
              name="notes"
              rows={4}
              defaultValue={value?.notes ?? ""}
              className={`${fieldClass} mt-2`}
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#f0f4f9] px-4 py-2.5 text-center text-sm font-bold text-[#6b7897]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy}
            className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
          >
            {busy && <Loader2 size={14} className="animate-spin" />}
            Save transaction
          </button>
        </div>
      </form>
    </div>
  );
}
