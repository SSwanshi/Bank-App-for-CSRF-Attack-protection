"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">🏦 CSRF Bank Demo</h1>

      <p className="text-gray-600">
        Demonstration of CSRF Attack and Protection
      </p>

      <button
        onClick={() => router.push("/login")}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Go to Login
      </button>
    </div>
  );
}