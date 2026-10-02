"use client";

import React, { useState } from "react";
import {
  Wallet as WalletIcon,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Building2,
  FileText,
  X,
} from "lucide-react";
import { useDashboard, Transaction } from "@/context/DashboardContext";
import { AnimatePresence, motion } from "framer-motion";

export default function WalletPage() {
  const { role, brandProfile, creatorProfile, transactions, addTransaction } = useDashboard();
  const isBrand = role === "brand";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Creator Payout Request Modal
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("20000");
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (statusFilter !== "all" && tx.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCamp = tx.campaignTitle?.toLowerCase().includes(q);
      const matchBrand = tx.brandName?.toLowerCase().includes(q);
      const matchCreator = tx.creatorName?.toLowerCase().includes(q);
      const matchRef = tx.providerReference?.toLowerCase().includes(q);
      if (!matchCamp && !matchBrand && !matchCreator && !matchRef) return false;
    }
    return true;
  });

  const formatINR = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt);
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(payoutAmount) || 0;
    if (amt <= 0) return;

    addTransaction({
      brandId: "brand-1",
      creatorId: creatorProfile.id,
      creatorName: creatorProfile.name,
      type: "creator_payout",
      amount: amt,
      currency: "INR",
      status: "processing",
      providerReference: `payout_IMPS_${Date.now().toString().slice(-6)}`,
      method: "IMPS Direct Bank Payout",
    });

    setPayoutSuccess(true);
    setTimeout(() => {
      setIsPayoutModalOpen(false);
      setPayoutSuccess(false);
    }, 1500);
  };

  // =========================================================================
  // BRAND VIEW (SECTION 15: SPENDING)
  // =========================================================================
  if (isBrand) {
    const totalSpent = transactions
      .filter((t) => t.type === "campaign_funding" && t.status === "paid")
      .reduce((sum, t) => sum + t.amount, 0);

    return (
      <div className="space-y-6 pb-16 animate-in fade-in duration-300">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Spending & Financials</h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Track campaign funding, escrow balances, creator disbursements, and download tax invoices.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Spent</span>
            <p className="mt-3 text-3xl font-black text-slate-950">{formatINR(totalSpent)}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Recorded payment gate charges</p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Campaign Commitments</span>
            <p className="mt-3 text-3xl font-black text-slate-950">{formatINR(370000)}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Secured in verified escrow</p>
          </div>

          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Active Creators Paid</span>
            <p className="mt-3 text-3xl font-black text-emerald-600">{formatINR(20000)}</p>
            <p className="mt-1 text-xs text-slate-500 font-medium">Disbursed on approval</p>
          </div>
        </div>

        {/* Transactions Table & Filters */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-slate-950">Spending History</h2>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search transaction..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200/80 bg-slate-50 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-red-500 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200/80 bg-white text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {filteredTransactions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs font-bold">No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Campaign / Purpose</th>
                    <th className="py-3 px-3">Recipient / Creator</th>
                    <th className="py-3 px-3">Reference ID</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                      <td suppressHydrationWarning className="py-3.5 px-3 text-slate-950 font-bold whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-extrabold text-slate-900 block truncate max-w-[200px]">
                          {tx.campaignTitle || "Platform Escrow Funding"}
                        </span>
                        <span className="text-[10px] text-slate-400 capitalize">{tx.type.replace("_", " ")}</span>
                      </td>
                      <td className="py-3.5 px-3">{tx.creatorName || "UGCFY Escrow"}</td>
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">
                        {tx.providerReference || tx.id}
                      </td>
                      <td className="py-3.5 px-3 font-black text-slate-950 whitespace-nowrap">
                        {formatINR(tx.amount)}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                            tx.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : tx.status === "processing"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedTx(tx)}
                          className="px-2.5 py-1 rounded-xl border border-slate-200 hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Transaction Detail Modal */}
        <AnimatePresence>
          {selectedTx && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedTx(null)}
                className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="text-base font-black text-slate-950">Payment Receipt</h3>
                    <button
                      type="button"
                      onClick={() => setSelectedTx(null)}
                      className="p-1 text-slate-400 hover:text-slate-900 rounded-xl"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Transaction ID:</span>
                      <span className="font-mono font-bold text-slate-900">{selectedTx.providerReference || selectedTx.id}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Campaign:</span>
                      <span className="font-bold text-slate-900">{selectedTx.campaignTitle || "General Escrow"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Amount:</span>
                      <span className="font-black text-slate-950 text-sm">{formatINR(selectedTx.amount)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-400">Payment Status:</span>
                      <span className="font-extrabold uppercase text-emerald-600">{selectedTx.status}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Payment Method:</span>
                      <span className="font-bold text-slate-800">{selectedTx.method || "Razorpay Payment Gateway"}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setSelectedTx(null)}
                      className="px-5 py-2.5 rounded-2xl bg-slate-900 text-xs font-bold text-white hover:bg-black"
                    >
                      Close Receipt
                    </button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // =========================================================================
  // CREATOR VIEW (SECTION 16: EARNINGS)
  // =========================================================================
  const totalCreatorEarnings = transactions
    .filter((t) => t.type === "creator_payout" && t.status === "paid")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">Earnings & Payouts</h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            Track your campaign compensation, escrow milestones, and withdraw earnings.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsPayoutModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-rose-600 text-xs font-extrabold text-white hover:bg-rose-700 transition-all shadow-sm shrink-0"
        >
          Request Payout
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Earnings</span>
          <p className="mt-3 text-3xl font-black text-slate-950">{formatINR(totalCreatorEarnings || 65000)}</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Lifetime earned on UGCFY</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Available for Payout</span>
          <p className="mt-3 text-3xl font-black text-emerald-600">{formatINR(20000)}</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Ready for instant transfer</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Pending Review</span>
          <p className="mt-3 text-3xl font-black text-amber-600">{formatINR(35000)}</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Deliverables awaiting approval</p>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Paid Out</span>
          <p className="mt-3 text-3xl font-black text-slate-950">{formatINR(45000)}</p>
          <p className="mt-1 text-xs text-slate-500 font-medium">Successfully transferred to bank</p>
        </div>
      </div>

      {/* Earnings History Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-950">Earnings & Payout History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Brand / Campaign</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Transfer Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {transactions
                .filter((t) => t.type === "creator_payout")
                .map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td suppressHydrationWarning className="py-3.5 px-3 text-slate-950 font-bold whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-extrabold text-slate-900 block truncate max-w-[200px]">
                        {tx.campaignTitle || "Summer Hydration Serum Launch 2026"}
                      </span>
                      <span className="text-[10px] text-slate-400">{tx.brandName || "GlowAura D2C"}</span>
                    </td>
                    <td className="py-3.5 px-3 capitalize text-slate-600">Reel Deliverable Payout</td>
                    <td className="py-3.5 px-3 font-black text-slate-950">{formatINR(tx.amount)}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          tx.status === "paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : tx.status === "processing"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-[11px] text-slate-500">
                      {tx.providerReference || "IMPS_98112"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Request Modal */}
      <AnimatePresence>
        {isPayoutModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPayoutModalOpen(false)}
              className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200"
              >
                {payoutSuccess ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="h-14 w-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-black text-slate-950">Payout Requested!</h3>
                    <p className="text-xs text-slate-500">
                      Your payout of {formatINR(parseFloat(payoutAmount) || 0)} is being processed via IMPS to your verified bank account.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleRequestPayout} className="space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h3 className="text-base font-black text-slate-950">Request Payout</h3>
                      <button
                        type="button"
                        onClick={() => setIsPayoutModalOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-900 rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Withdrawal Amount (₹)
                      </label>
                      <input
                        type="number"
                        max={20000}
                        min={1000}
                        value={payoutAmount}
                        onChange={(e) => setPayoutAmount(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-base font-black text-slate-900 focus:outline-none focus:border-rose-500 focus:bg-white"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">Available balance: ₹20,000</p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <p className="font-extrabold text-slate-900">Verified Bank Account</p>
                      <p className="text-slate-600">HDFC Bank · A/C Ending in •••• 8821</p>
                      <p className="text-[10px] text-emerald-600 font-bold">KYC Verified for Instant IMPS</p>
                    </div>

                    <div className="pt-3 flex items-center justify-end gap-2.5">
                      <button
                        type="button"
                        onClick={() => setIsPayoutModalOpen(false)}
                        className="px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-2xl bg-rose-600 text-xs font-extrabold text-white hover:bg-rose-700 shadow-sm"
                      >
                        Confirm Withdrawal
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
