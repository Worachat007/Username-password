"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/app/auth";
import prisma from "@/app/lib/prisma";

export type DeleteUserState = {
  error?: string;
  success?: string;
};

export async function deleteUser(
  _previousState: DeleteUserState,
  formData: FormData,
): Promise<DeleteUserState> {
  const userId = formData.get("userId");

  if (typeof userId !== "string" || !userId) {
    return { error: "ไม่พบผู้ใช้ที่ต้องการลบ" };
  }

  const session = await auth();

  if (!session?.user) {
    return { error: "กรุณาเข้าสู่ระบบอีกครั้ง" };
  }

  const result = await prisma.$transaction(async (transaction) => {
    const admin = await transaction.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return "forbidden" as const;
    }

    if (userId === session.user.id) {
      return "self" as const;
    }

    const target = await transaction.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!target) {
      return "not-found" as const;
    }

    if (target.role === "ADMIN") {
      const adminCount = await transaction.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount <= 1) {
        return "last-admin" as const;
      }
    }

    await transaction.user.delete({ where: { id: userId } });
    return "deleted" as const;
  });

  if (result === "forbidden") {
    return { error: "ไม่มีสิทธิ์ลบผู้ใช้" };
  }

  if (result === "self") {
    return { error: "ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่ได้" };
  }

  if (result === "not-found") {
    return { error: "ไม่พบผู้ใช้นี้ อาจถูกลบไปแล้ว" };
  }

  if (result === "last-admin") {
    return { error: "ไม่สามารถลบ Admin คนสุดท้ายได้" };
  }

  revalidatePath("/admin");
  return { success: "ลบบัญชีผู้ใช้เรียบร้อยแล้ว" };
}
