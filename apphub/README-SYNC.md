# 🔄 دليل المزامنة v35 (بديل عن الباتشات — بدون صراعات git)

الملف ده جوّا ZIP المزامنة. نفّذ بالترتيب في **Git Bash**:

```bash
# 1) اتأكد إن مفيش am معلق وإنك نظيف
cd /d/apphub
git am --abort 2>/dev/null
git status --porcelain        # المفروض فاضي (أو ملفات قليلة تعرفها)

# 2) فُكّ الـ ZIP في فولدر تاني (من Windows Explorer أو من هنا):
#    زر يمين على apphub-sync-v35.zip → Extract All → اختر D:\
#    هيطلعلك فولدر D:\apphub-sync-v35

# 3) انسخ كل حاجة فوق فولدر المشروع (الـ .git و .env.local بتوعك مش هيتمسحوا — مش موجودين في الـ ZIP)
cp -rf /d/apphub-sync-v35/. /d/apphub/

# 4) ارفع كل حاجة
cd /d/apphub
git add -A
git commit -m "🔄 مزامنة كاملة v35 — اللوجو الرسمي + عدة الانتشار"
git push origin main
```

## تتأكد إنه وصل
- افتح موقعك على Vercel → لازم تشوف **زرار واتساب أخضر عائم** تحت يمين 👇🟢
- افتح `/reports/q3-2026` → التقرير شغال
- في DevTools → Application → Service Worker → النسخة **v3**

## لو عندك .env.local محليًا
الـ ZIP مش بيمسحه — متقلقش. وعلى Vercel حط الـ envs من لوحة Vercel (Settings → Environment Variables).
