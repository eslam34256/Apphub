"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  links: { href: string; label: string; icon: string }[];
  user: any;
  isAdmin: boolean;
  userName: string;
};

export function MobileMenu({ links, user, isAdmin, userName }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
        aria-label="فتح القائمة"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <>
          {/* Overlay - يغطي كل الشاشة */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              zIndex: 999998
            }}
            className="md:hidden"
          />

          {/* Sidebar - يغطي كل الشاشة من فوق لتحت */}
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "85vw",
              maxWidth: "380px",
              height: "100vh",
              backgroundColor: "#ffffff",
              zIndex: 999999,
              boxShadow: "-10px 0 30px rgba(0, 0, 0, 0.3)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
            className="md:hidden"
          >
            {/* Header - ثابت في الأعلى */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e2e8f0",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 900,
                    fontSize: "20px"
                  }}
                >
                  A
                </div>
                <div>
                  <p style={{ fontWeight: 800, fontSize: "18px", margin: 0 }}>AppHub</p>
                  <p style={{ fontSize: "10px", color: "#64748b", margin: 0 }}>دليل التطبيقات</p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#f1f5f9",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer"
                }}
                aria-label="إغلاق"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                overflowX: "hidden",
                padding: "16px",
                backgroundColor: "#ffffff",
                WebkitOverflowScrolling: "touch"
              }}
            >
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #eef2ff 0%, #fdf2f8 100%)",
                    padding: "16px",
                    marginBottom: "16px",
                    textDecoration: "none",
                    color: "inherit"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "18px"
                      }}
                    >
                      {userName[0] || "U"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, margin: 0 }}>{userName}</p>
                      <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>عرض الحساب</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    padding: "12px",
                    color: "white",
                    fontWeight: 700,
                    textDecoration: "none",
                    marginBottom: "16px"
                  }}
                >
                  سجّل دخول
                </Link>
              )}

              <div style={{ marginBottom: "16px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    padding: "0 8px"
                  }}
                >
                  القائمة
                </p>
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      marginBottom: "4px",
                      textDecoration: "none",
                      color: "#0f172a",
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {isAdmin && (
                <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px", marginBottom: "16px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#9333ea",
                      textTransform: "uppercase",
                      marginBottom: "8px",
                      padding: "0 8px"
                    }}
                  >
                    إدارة
                  </p>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "12px",
                      backgroundColor: "#faf5ff",
                      padding: "12px 16px",
                      textDecoration: "none",
                      color: "#0f172a",
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>👑</span>
                    <span>لوحة الأدمن</span>
                  </Link>
                </div>
              )}

              <Link
                href="/advertise"
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                  padding: "12px",
                  color: "white",
                  fontWeight: 700,
                  textDecoration: "none",
                  marginBottom: "16px"
                }}
              >
                📢 اعلن معانا
              </Link>

              <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "16px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                    padding: "0 8px"
                  }}
                >
                  روابط
                </p>
                <Link href="/about" onClick={() => setOpen(false)} style={{ display: "block", padding: "8px 16px", fontSize: "14px", color: "#64748b", textDecoration: "none" }}>
                  من نحن
                </Link>
                <Link href="/contact" onClick={() => setOpen(false)} style={{ display: "block", padding: "8px 16px", fontSize: "14px", color: "#64748b", textDecoration: "none" }}>
                  تواصل معانا
                </Link>
                <Link href="/privacy" onClick={() => setOpen(false)} style={{ display: "block", padding: "8px 16px", fontSize: "14px", color: "#64748b", textDecoration: "none" }}>
                  سياسة الخصوصية
                </Link>
                <Link href="/terms" onClick={() => setOpen(false)} style={{ display: "block", padding: "8px 16px", fontSize: "14px", color: "#64748b", textDecoration: "none" }}>
                  الشروط والأحكام
                </Link>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}