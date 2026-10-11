// سكريبت تحقق مؤقت: يتأكد إن مابنج الفئات الفرعية متسق مع data/apps.ts
const fs = require("fs");

const apps = fs.readFileSync("src/data/apps.ts", "utf8");
const subs = fs.readFileSync("src/data/subcategories.ts", "utf8");

// استخرج كل التطبيقات
const appRe = /slug:"([^"]+)",\s*name:"([^"]+)"[^}]*?category:"([^"]+)"/g;
let m;
const all = [], catOf = {};
while ((m = appRe.exec(apps))) { all.push(m[1]); catOf[m[1]] = m[3]; }

// استخرج المابنج (الكتلة اللي بعد SUBCATEGORY_BY_SLUG)
const mapBlock = subs.slice(subs.indexOf("SUBCATEGORY_BY_SLUG"));
const subRe = /^\s*(?:"([^"]+)"|([a-z0-9-]+)):\s*"([a-z-]+)",?/gm;
const mapped = {};
let count = 0;
while ((m = subRe.exec(mapBlock))) { mapped[m[1] || m[2]] = m[3]; count++; }

// استخرج مفاتيح الفئات الفرعية المعرفة
const defRe = /key: "([a-z-]+)", category: "([a-z-]+)"/g;
const defined = {};
while ((m = defRe.exec(subs))) defined[m[1]] = m[2];

// 1) كل مابنج لازم slug كاين ف apps.ts
let bad = 0;
for (const slug of Object.keys(mapped)) {
  if (!all.includes(slug)) { console.log("❌ مابنج لتطبيق مش موجود:", slug); bad++; }
  // subcategory key لازم يكون معرف وتبع نفس الفئة العامة
  const key = mapped[slug];
  if (!defined[key]) { console.log("❌ key مش معرف في SUBCATEGORIES:", key); bad++; }
  else if (defined[key] !== catOf[slug]) { console.log(`❌ فئة غلط: ${slug} → ${key} (course ${defined[key]} vs app ${catOf[slug]})`); bad++; }
}

// 2) تطبيقات بدون فئة فرعية (المفروض الحكومية فقط)
const unmapped = all.filter((s) => !mapped[s]);
console.log("📊 الإجمالي:", all.length, "| معيّن:", count, "| بدون فئة فرعية:", unmapped.length);
console.log("   بدون مابنج:", unmapped.map((s) => `${s}(${catOf[s]})`).join(", "));

// 3) عدد التعريفات
console.log("📁 فئات فرعية معرفة:", Object.keys(defined).length);
console.log(bad === 0 ? "✅ كل المابنج سليم" : `💥 في ${bad} مشاكل لازم تتصلح`);
