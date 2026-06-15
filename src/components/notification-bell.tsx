"use client";
import { useEffect, useState } from "react";
import { getMyNotifications, markAllRead } from "@/lib/notifications";
type Notif = { id:string; title:string; body:string; read:boolean; link?:string; created_at:string };
export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  useEffect(() => { getMyNotifications().then(data => setNotifications(data as Notif[])); }, []);
  async function handleOpen() {
    setOpen(p => !p);
    if (unread > 0) { await markAllRead(); setNotifications(p => p.map(n => ({ ...n, read: true }))); }
  }
  return (
    <div className="relative">
      <button onClick={handleOpen} className="relative flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200">
        🔔
        {unread > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">{unread}</span>}
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b p-4"><h3 className="font-bold">الإشعارات</h3></div>
          <div className="max-h-72 overflow-y-auto">
            {!notifications.length ? <p className="p-4 text-center text-sm text-slate-500">مفيش إشعارات</p> :
              notifications.map(n => (
                <div key={n.id} className={`border-b p-4 text-sm ${n.read ? "bg-white" : "bg-blue-50"}`}>
                  <p className="font-bold">{n.title}</p>
                  <p className="mt-1 text-slate-600">{n.body}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(n.created_at).toLocaleDateString("ar-EG")}</p>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
}
