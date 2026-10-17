import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Username &amp; Password
        </h1>
        <p className="mb-8 text-gray-600">
          เข้าสู่ระบบเพื่อจัดการบัญชีและสิทธิ์การใช้งาน
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            href="/signup"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            สร้างบัญชี
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Admin
          </Link>
        </div>
      </section>
    </main>
  );
}
