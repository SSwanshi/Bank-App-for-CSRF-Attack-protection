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
    <nav className="bg-primary text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight">SECUREBANK</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center bg-blue-900/50 px-3 py-1.5 rounded-full border border-blue-400/30">
              <span className="text-xs uppercase tracking-wider font-semibold mr-2 opacity-80">System Mode:</span>
              <span
                className={`text-sm font-bold ${
                  mode === "vulnerable" ? "text-red-300" : "text-green-300"
                }`}
              >
                {mode.toUpperCase()}
              </span>
            </div>

            <button
              onClick={toggleMode}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors border border-white/20"
            >
              Toggle Mode
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}