"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px]">
      <div className="card max-w-lg w-full p-12 text-center bg-white">
        <div className="mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <div className="w-10 h-10 border-4 border-primary rounded-lg border-t-transparent shadow-sm"></div>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            SECUREBANK
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed">
            Corporate Banking Portal for CSRF Security Research and Demonstration.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push("/login")}
            className="btn-primary w-full text-lg py-4 shadow-lg shadow-blue-500/20"
          >
            Access My Account
          </button>
          
          <div className="pt-6 border-t border-slate-100 italic text-slate-400 text-sm">
            Research-Only Environment
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-slate-400 text-sm font-medium">
        © 2024 SecureBank Research Group. All Rights Reserved.
      </div>
    </div>
  );
}