"use client";

import { useEffect, useState } from "react";
import API from "../utils/api";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [mode, setMode] = useState("vulnerable");
  const router = useRouter();

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const res = await API.get("/admin/mode");
        setMode(res.data.mode);
      } catch {
        console.log("Error fetching mode");
      }
    };

    fetchMode();
  }, []);

  const toggleMode = async () => {
    await API.post("/admin/toggle-mode");
    alert("Mode switched! Please login again.");
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <h1 className="text-lg font-bold">🏦 Bank</h1>

      <div className="flex items-center gap-4">
        <span>
          Mode:{" "}
          <span
            className={
              mode === "vulnerable" ? "text-red-400" : "text-green-400"
            }
          >
            {mode}
          </span>
        </span>

        <button
          onClick={toggleMode}
          className="bg-blue-500 px-3 py-1 rounded"
        >
          Toggle
        </button>
      </div>
    </div>
  );
}