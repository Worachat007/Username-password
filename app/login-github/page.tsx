import Link from "next/link";
import GitHubSignInButton from "@/app/login/github-sign-in-button";

export default function GitHubLoginPage() {
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900">Members Only</h1>
        <p className="mt-3 text-gray-600">เข้าสู่ระบบด้วย GitHub</p>
        {githubEnabled ? (
          <div className="mt-8">
            <GitHubSignInButton />
          </div>
        ) : (
          <div
            role="status"
            className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-900"
          >
            <p className="font-medium">ยังไม่ได้ตั้งค่า GitHub OAuth</p>
            <p className="mt-2">
              ตั้งค่า AUTH_GITHUB_ID และ AUTH_GITHUB_SECRET ในไฟล์ .env.local
              แล้วเริ่มเซิร์ฟเวอร์ใหม่
            </p>
            <p className="mt-2">
              Callback URL:{" "}
              <code className="break-all">
                http://localhost:3000/api/auth/callback/github
              </code>
            </p>
          </div>
        )}
        <Link
          href="/login"
          className="mt-6 inline-block font-medium text-blue-700 hover:underline"
        >
          กลับไปหน้าเข้าสู่ระบบ
        </Link>
      </section>
    </main>
  );
}
