"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import API from "../utils/api";

export default function TransferForm({ csrfToken }: { csrfToken: string | null }) {
  const [amount, setAmount] = useState("");
  const [to, setTo] = useState("");

  const handleTransfer = async () => {
    try {
      const res = await API.post(
        "/bank/transfer",
        { amount, to },
        {
          headers: csrfToken
            ? { "X-CSRF-Token": csrfToken }
            : {},
        }
      );

      alert(res.data.message);
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        alert(err.response?.data?.message || "Error");
      } else {
        alert("Error");
      }
    }
  };

  return (
    <div className="card p-6 max-w-md bg-white">
      <h3 className="text-lg font-bold mb-4 border-b pb-2">Send Money</h3>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-secondary mb-1">Recipient Account / Email</label>
          <input
            type="text"
            placeholder="e.g., adityaspgm@gmail.com"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-secondary mb-1">Amount (INR)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-400">₹</span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input-field pl-8"
            />
          </div>
        </div>

        <button
          onClick={handleTransfer}
          className="btn-primary w-full mt-2"
        >
          Confirm Transfer
        </button>
      </div>
    </div>
  );
}