"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signInWithGoogle, signUpWithEmail } from "@/lib/auth";

type Mode = "login" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleEmail() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;

        setMessage("✅ تم تسجيل الدخول بنجاح");

        // Redirect للهوم
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else {
        const { error } = await signUpWithEmail(email, password, name);
        if (error) throw error;

        setMessage("✅ تم التسجيل، جاري تسجيل دخولك...");

        // سجّل دخول تلقائي بعد التسجيل
        const { error: loginError } = await signInWithEmail(email, password);
        if (loginError) {
          setMessage("✅ تم التسجيل، سجّل دخولك دلوقتي");
          setMode("login");
          setLoading(false);
          return;
        }

        // Redirect للهوم
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }
    } catch (err: any) {
      setError(err.message ?? "حصل خطأ");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message ?? "حصل خطأ");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-extrabold">
          {mode === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
        </h1>
        <p className="mb-4 text-slate-500">
          {mode === "login"
            ? "ادخل بإيميلك وكلمة السر"
            : "أنشئ حسابك وابدأ تراكم النقاط"}
        </p>

        {mode === "signup" && (
          <input
            className="mb-3 w-full rounded-2xl border px-4 py-3"
            placeholder="الاسم"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="mb-3 w-full rounded-2xl border px-4 py-3"
          placeholder="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mb-3 w-full rounded-2xl border px-4 py-3"
          placeholder="كلمة السر"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={handleEmail}
          className="mb-3 w-full rounded-2xl bg-brand-600 px-4 py-3 font-bold text-white disabled:opacity-60"
        >
          {loading ? "جاري..." : mode === "login" ? "دخول" : "تسجيل"}
        </button>

        <button
          disabled={loading}
          onClick={handleGoogle}
          className="w-full rounded-2xl border px-4 py-3 font-bold disabled:opacity-60"
        >
          متابعة بـ Google
        </button>

        {error && (
          <p className="mt-3 rounded-xl bg-rose-50 px-4 py-3 text-rose-700">
            {error}
          </p>
        )}
        {message && (
          <p className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
            {message}
          </p>
        )}

        <button
          className="mt-4 text-sm text-brand-600"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login"
            ? "مش مسجل؟ أنشئ حساب"
            : "عندك حساب؟ سجل دخول"}
        </button>
      </div>
    </div>
  );
}