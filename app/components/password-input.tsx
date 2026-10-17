"use client";

import { useState, type ComponentProps } from "react";

type PasswordInputProps = Omit<ComponentProps<"input">, "type">;

export default function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-16 text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:outline-none ${className}`}
      />
      <button
        type="button"
        aria-label={visible ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
        className="absolute inset-y-0 right-0 rounded-r-lg px-3 text-sm font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        {visible ? "ซ่อน" : "แสดง"}
      </button>
    </div>
  );
}
