"use client";

import { useEffect, useState } from "react";
import API from "../../utils/api";
import Navbar from "../../components/Navbar";
import TransferForm from "../../components/TransferForm";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await API.get("/auth/me");

        const bal = await API.get("/bank/balance");
        setBalance(bal.data.balance);

        const token = localStorage.getItem("csrfToken");
        setCsrfToken(token);
      } catch {
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900">Account Dashboard</h1>
          <p className="text-slate-500">Welcome back to your secure banking portal.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-6 border-l-4 border-l-primary bg-white">
              <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Total Balance</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900">₹{balance.toLocaleString()}</span>
                <span className="text-slate-400 font-medium text-sm">INR</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase">
                  <span>Account Number</span>
                  <span className="text-slate-600">•••• 8921</span>
                </div>
              </div>
            </div>

            <div className="card p-5 bg-primary/5 border-primary/10">
              <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                Security Tip
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Always verify the recipient's account details before confirming any transfer. SecureBank will never ask for your OTP over the phone.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card overflow-hidden bg-white">
              <div className="bg-slate-50 border-b p-4 px-6 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">New Transaction</h3>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  Real-time Transfer
                </span>
              </div>
              <div className="p-6">
                <TransferForm csrfToken={csrfToken} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 text-center text-slate-400 text-xs mt-auto">
        SecureBank Corporate Banking System | 256-bit AES Encryption
      </footer>
    </div>
  );
}