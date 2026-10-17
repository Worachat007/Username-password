import { Suspense } from "react";
import { connection } from "next/server";
import { auth, signOut } from "@/app/auth";
import { redirect } from "next/navigation";
import prisma from "@/app/lib/prisma";
import UserList from "./user-list";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
          <p className="text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </main>
      }
    >
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  await connection();
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (admin?.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <section className="flex flex-col gap-5 rounded-xl bg-white p-8 shadow-lg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mb-3 text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              ยินดีต้อนรับ {session.user.name ?? session.user.email}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-50"
            >
              ออกจากระบบ
            </button>
          </form>
        </section>
        <UserList users={users} currentUserId={session.user.id} />
      </div>
    </main>
  );
}
