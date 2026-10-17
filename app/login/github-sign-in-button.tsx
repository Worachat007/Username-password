"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function GitHubSignInButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    setPending(true);
    setError("");

    try {
      const result = await signIn("github", {
        redirect: false,
        redirectTo: "/",
      });

      if (result.error || !result.url) {
        setError("เริ่มเข้าสู่ระบบด้วย GitHub ไม่สำเร็จ กรุณาลองอีกครั้ง");
        setPending(false);
        return;
      }

      window.location.assign(result.url);
    } catch {
      setError("เชื่อมต่อ GitHub ไม่สำเร็จ กรุณาลองอีกครั้ง");
      setPending(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleSignIn}
        disabled={pending}
        className="flex w-full items-center justify-center gap-3 rounded-lg bg-gray-950 px-4 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        <span
          aria-hidden="true"
          className="flex size-7 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-950"
        >
          GH
        </span>
        <span>{pending ? "กำลังเชื่อมต่อกับ GitHub..." : "เข้าสู่ระบบด้วย GitHub"}</span>
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
