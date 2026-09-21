"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";

type Props = {
  links: { href: string; label: string; icon?: string }[];
  user: any;
  isAdmin: boolean;
  userName: string;
  /** هيدر فاتح (أي صفحة غير الهوم في الأعلى): الهامبورجر يبقى غامق مش أبيض على أبيض */
  lightMode?: boolean;
};

export function MobileMenu({ links, user, isAdmin, userName, lightMode = false }: Props) {
  const { t, lang } = useLanguage();
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
        className={`xl:hidden flex items-center justify-center w-10 h-10 rounded-xl transition ${
          lightMode
            ? "bg-cream-100 border border-cream-200 hover:bg-cream-200 text-brand-900"
            : "bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white"
        }`}
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
          {/* Overlay */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(26, 26, 26, 0.6)",
              zIndex: 999998
            }}
            className="xl:hidden"
          />

          {/* Sidebar */}
          <aside
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "85vw",
              maxWidth: "380px",
              height: "100vh",
              backgroundColor: "#faf8f5",
              zIndex: 999999,
              boxShadow: "-10px 0 30px rgba(26, 41, 66, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}
            className="xl:hidden"
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e8dfd3",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #1a2942 0%, #2c3e5a 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "22px",
                    fontFamily: "var(--font-playfair), Georgia, serif"
                  }}
                >
                  A
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "20px",
                      margin: 0,
                      color: "#1a2942",
                      fontFamily: "var(--font-playfair), Georgia, serif"
                    }}
                  >
                    AppHub
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#8b7355",
                      margin: 0,
                      letterSpacing: "0.05em"
                    }}
                  >
                    {t("site_tagline")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  backgroundColor: "#f5f1ea",
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#1a2942"
                }}
                aria-label="إغلاق"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "20px",
                backgroundColor: "#faf8f5"
              }}
            >
              {/* User Card */}
              {user ? (
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #faf8f5 0%, #f5f1ea 100%)",
                    border: "1px solid #e8dfd3",
                    padding: "16px",
                    marginBottom: "20px",
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
                        background: "linear-gradient(135deg, #c9a876 0%, #b08f5d 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1a2942",
                        fontWeight: 700,
                        fontSize: "20px"
                      }}
                    >
                      {userName[0] || "U"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, margin: 0, color: "#1a2942" }}>{userName}</p>
                      <p style={{ fontSize: "12px", color: "#8b7355", margin: 0 }}>
                        {lang === "ar" ? "عرض الحساب" : "View Profile"}
                      </p>
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
                    borderRadius: "999px",
                    background: "#1a1a1a",
                    padding: "14px",
                    color: "white",
                    fontWeight: 600,
                    textDecoration: "none",
                    marginBottom: "20px"
                  }}
                >
                  {t("nav_login")}
                </Link>
              )}

              {/* Main Links */}
              <div style={{ marginBottom: "20px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#c9a876",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    padding: "0 8px",
                    letterSpacing: "0.1em"
                  }}
                >
                  {lang === "ar" ? "القائمة" : "Menu"}
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
                      padding: "14px 16px",
                      marginBottom: "4px",
                      textDecoration: "none",
                      color: "#1a2942",
                      fontWeight: 600,
                      transition: "background-color 0.2s"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f1ea")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {link.icon && <span style={{ fontSize: "20px" }}>{link.icon}</span>}
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Admin Section */}
              {isAdmin && (
                <div
                  style={{
                    borderTop: "1px solid #e8dfd3",
                    paddingTop: "16px",
                    marginBottom: "20px"
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#c9a876",
                      textTransform: "uppercase",
                      marginBottom: "12px",
                      padding: "0 8px",
                      letterSpacing: "0.1em"
                    }}
                  >
                    {lang === "ar" ? "إدارة" : "Admin"}
                  </p>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      borderRadius: "12px",
                      backgroundColor: "#f5f1ea",
                      border: "1px solid #e8dfd3",
                      padding: "14px 16px",
                      textDecoration: "none",
                      color: "#1a2942",
                      fontWeight: 600
                    }}
                  >
                    <span style={{ fontSize: "20px" }}>👑</span>
                    <span>{t("nav_admin")}</span>
                  </Link>
                </div>
              )}

              {/* Advertise CTA */}
              <Link
                href="/advertise"
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "center",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #c9a876 0%, #b08f5d 100%)",
                  padding: "14px",
                  color: "#1a2942",
                  fontWeight: 700,
                  textDecoration: "none",
                  marginBottom: "20px",
                  boxShadow: "0 4px 12px rgba(201, 168, 118, 0.3)"
                }}
              >
                📢 {t("nav_advertise")}
              </Link>

              {/* Footer Links */}
              <div style={{ borderTop: "1px solid #e8dfd3", paddingTop: "16px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#c9a876",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                    padding: "0 8px",
                    letterSpacing: "0.1em"
                  }}
                >
                  {lang === "ar" ? "روابط" : "Links"}
                </p>
                <Link
                  href="/about"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#8b7355",
                    textDecoration: "none"
                  }}
                >
                  {t("footer_about")}
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#8b7355",
                    textDecoration: "none"
                  }}
                >
                  {t("footer_contact")}
                </Link>
                <Link
                  href="/privacy"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#8b7355",
                    textDecoration: "none"
                  }}
                >
                  {t("footer_privacy")}
                </Link>
                <Link
                  href="/terms"
                  onClick={() => setOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 16px",
                    fontSize: "14px",
                    color: "#8b7355",
                    textDecoration: "none"
                  }}
                >
                  {t("footer_terms")}
                </Link>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  );
}