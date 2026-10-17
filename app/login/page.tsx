import { Suspense } from "react";
import Link from "next/link";
import LoginForm from "./login-form";
import GitHubSignInButton from "./github-sign-in-button";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
    registered?: string | string[];
  }>;
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const githubEnabled = Boolean(
    process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-900">
          Login
        </h1>
        <p className="mb-6 text-center text-gray-500">เข้าสู่ระบบบัญชีของคุณ</p>
        <Suspense fallback={null}>
          <LoginNotice searchParams={searchParams} />
        </Suspense>
        <LoginForm />
        {githubEnabled && (
          <>
            <div className="my-5 flex items-center gap-3 text-sm text-gray-500">
              <span className="h-px flex-1 bg-gray-200" />
              <span>หรือ</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <GitHubSignInButton />
            <p className="mt-3 text-center text-sm text-gray-600">
              <Link
                href="/login-github"
                className="font-medium text-blue-700 hover:underline"
              >
                เปิดหน้าเข้าสู่ระบบ GitHub
              </Link>
            </p>
          </>
        )}
        <p className="mt-6 text-center text-sm text-gray-600">
          ยังไม่มีบัญชี?
          <Link
            href="/signup"
            className="ml-1 font-medium text-blue-600 hover:underline"
          >
            สมัครสมาชิก
          </Link>
        </p>
      </section>
    </main>
  );
}

async function LoginNotice({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const registered = Array.isArray(params.registered)
    ? params.registered[0]
    : params.registered;
  const error = Array.isArray(params.error) ? params.error[0] : params.error;

  if (registered !== "1" && !error) {
    return null;
  }

  return (
    <div className="mb-4 space-y-2">
      {registered === "1" && (
        <p
          role="status"
          className="rounded-lg bg-green-50 p-3 text-sm text-green-700"
        >
          สร้างบัญชีเรียบร้อยแล้ว กรุณาเข้าสู่ระบบ
        </p>
      )}
      {error && (
        <p
          role="alert"
          className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          เข้าสู่ระบบด้วย GitHub ไม่สำเร็จ กรุณาเริ่มใหม่อีกครั้ง
          หากยังมีปัญหา ให้ลบคุกกี้ของ localhost แล้วลองใหม่
        </p>
      )}
    </div>
  );
}
