"use client";

import { useActionState, type FormEvent } from "react";
import type { Role } from "@prisma/client";

import { deleteUser, type DeleteUserState } from "./delete-user-action";

type UserSummary = {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
};

const initialState: DeleteUserState = {};

export default function UserList({
  users,
  currentUserId,
}: {
  users: UserSummary[];
  currentUserId: string;
}) {
  const [state, formAction, pending] = useActionState(
    deleteUser,
    initialState,
  );

  function confirmDelete(event: FormEvent<HTMLFormElement>) {
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    if (
      !window.confirm(
        `ยืนยันการลบบัญชี ${typeof email === "string" ? email : "ผู้ใช้นี้"}? การลบไม่สามารถย้อนกลับได้`,
      )
    ) {
      event.preventDefault();
    }
  }

  return (
    <section className="mt-8 rounded-xl bg-white p-6 shadow-lg">
      <h2 className="mb-2 text-xl font-bold text-gray-900">จัดการผู้ใช้</h2>
      <p className="mb-5 text-sm text-gray-600">
        รายชื่อนี้แสดงบัญชีที่สมัครด้วยอีเมลและรหัสผ่าน
      </p>

      {state.error && (
        <p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state.success && (
        <p
          role="status"
          className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          {state.success}
        </p>
      )}

      {users.length === 0 ? (
        <p className="rounded-lg bg-gray-50 p-4 text-gray-600">
          ยังไม่มีบัญชีผู้ใช้
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;

            return (
              <li
                key={user.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="break-all font-medium text-gray-900">
                    {user.name || "ไม่ระบุชื่อ"}
                    {isCurrentUser && (
                      <span className="ml-2 text-sm font-normal text-blue-700">
                        (บัญชีของคุณ)
                      </span>
                    )}
                  </p>
                  <p className="break-all text-sm text-gray-600">{user.email}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    สิทธิ์ {user.role} · สมัครเมื่อ{" "}
                    {user.createdAt.toLocaleDateString("th-TH")}
                  </p>
                </div>
                {isCurrentUser ? (
                  <span className="shrink-0 text-sm text-gray-500">
                    ป้องกันการลบบัญชีที่ใช้งานอยู่
                  </span>
                ) : (
                  <form
                    action={formAction}
                    onSubmit={confirmDelete}
                    className="shrink-0"
                  >
                    <input type="hidden" name="userId" value={user.id} />
                    <input type="hidden" name="email" value={user.email} />
                    <button
                      type="submit"
                      disabled={pending}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {pending ? "กำลังลบ..." : "ลบผู้ใช้"}
                    </button>
                  </form>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
