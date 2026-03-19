"use client";

import { useState } from "react";
import API from "../../utils/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { username });

      // store csrf token
      if (res.data.csrfToken) {
        localStorage.setItem("csrfToken", res.data.csrfToken);
      } else {
        localStorage.removeItem("csrfToken");
      }

      router.push("/dashboard");
    } catch  {
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Login
      </button>
    </div>
  );
}