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
      } catch (err) {
        router.push("/login");
      }
    };

    fetchData();
  }, [router]);

  return (
    <div>
      <Navbar />

      <div className="p-4">
        <h2 className="text-xl">Balance: ₹{balance}</h2>

        <TransferForm csrfToken={csrfToken} />
      </div>
    </div>
  );
}