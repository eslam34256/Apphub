# 💸 Affiliate Playbook — إزاي الفلوس بتدخل AppHub

## الدورة الكاملة (شغالة في الكود من v38)
1. الزائر يضغط أي زرار خارجي (افتح التطبيق / Google Play / الموقع / Get Deal)
2. `sendBeacon → /api/track` يسجل الحدث في `commerce_events` (أو `affiliate_clicks`)
3. لو الرابط فيه `affiliateUrl` حقيقي → الزائر بيعدّي على شبكة العمولة → لو اشترى = عمولة لك
4. أنت تشوف الأرقام في: `GET /api/track/stats?days=30` بهيدر `Authorization: Bearer <CRON_SECRET>`

## ⚠️ قاعدة الأمانة (اللي بتبني الثقة)
- أي رابط عمولة لازم يظهر تحته شارة «رابط بعمولة» (موجود تلقائيًا في TrackedAffiliateLink)
- ممنوع روابط مختلقة أو ref وهمي — الشبكات بتقفل الحسابات دي فورًا
- صفحة /disclosure فيها الإفصاح الكامل

## 🎯 الشبكات اللي تقدم فيها (بالأولوية)
| الشبكة | تغطي إيه في AppHub | عمولة نموذجية | فين تحط الرابط |
|---|---|---|---|
| **Amazon Associates** | عروض Amazon + صفحات أجهزة/سماعات | 1–4% | `lib/affiliate.ts` (amazon) + deals.affiliateUrl |
| **Noon Affiliate** (عبر شبكات مثل Admitad) | عروض نون | 2–6% | noon + deals |
| **Admitad / Impact** | Coursera / VPNات / SaaS / hosting | حسب البرنامج | lib/affiliate + deals |
| **Booking / Agoda affiliates** | فئة السفر | 3–5% | deals.affiliateUrl |
| **برامج مباشرة** (NordVPN, Surfshark...) | رادار الأدوات/VPN | 20–40% 🔥 | lib/affiliate.ts |

## ✅ خطوات الاعتماد (أسبوع واحد)
1. قدم في Amazon Associates + Admitad (محتاج دومين + وصف الموقع — عندك الاتنين)
2. لحد ما الاعتماد ييجي: الروابط العادية شغالة والتتبع بيجمع أرقام حقيقية (ده بيقوي طلبك!)
3. أول ما الاعتماد ييجي: استبدل الـ url في `lib/affiliate.ts` وبرّكب `affiliateUrl` على العروض في الداتابيز — الشارة والتتبع بيظهروا لوحدهم

## 📊 إزاي تقرأ الأرقام (قرار بيزنس مش تخمين)
```bash
curl -H "Authorization: Bearer $CRON_SECRET" "https://APP/api/track/stats?days=30"
```
- أي target كليكاته كتير وتحويلة صفر → غيّر العرض أو الشبكة
- أي شبكة عمولتها < 1% والكليكات عالية → فاوض برنامج أعلى أو sponsored

## 🔜 v39 (الباقي من الخطة)
- باقات المعلنين بأسعار واضحة في /advertise (Starter/Growth/Premium)
- AppHub Business lead-gen form للشركات
