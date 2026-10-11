import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * v43 — P0 أمن: حماية حواف (edge) للمسارات الخاصة.
 * الـ redirect بتاع صفحات السيرفر لوحده ساب تسريب SSG في الإنتاج —
 * فالـ middleware بيقفل الباب قبل ما أي صفحة تتعرض: مفيش كوكيز جلسة = مفيش دخول.
 * (التحقق من الدور «admin» بيفضل server-side في requireAdmin — الدفاع طبقتين)
 */
const PROTECTED_PREFIXES = ["/admin", "/advertiser-dashboard", "/profile"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PROTECTED_PREFIXES.some(p => pathname === p || pathname.startsWith(`${p}/`))) {
    const hasSession = request.cookies.getAll().some(c => /^sb-.*-auth-token/.test(c.name));
    if (!hasSession) {
      return NextResponse.redirect(new URL("/auth", request.url), 307);
    }
  }
  return updateSession(request);
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
