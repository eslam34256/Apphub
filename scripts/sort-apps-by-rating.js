// سكريبت لمرة واحدة: يعيد ترتيب التطبيقات داخل كل سكشن في data/apps.ts
// تنازليًا بالتقييم (التعادل يثبت مكانه).
// الأسلوب: بنلاقي خانات أسطر التطبيقات جوه كل سكشن (بين لافتات ═══)،
// وبنكتب التطبيقات المرتبة في نفس الخانات — فتنسيق الفواصل يفضل مظبوط 100%.
const fs = require("fs");
const FILE = "src/data/apps.ts";

const lines = fs.readFileSync(FILE, "utf8").split("\n");
const isAppLine = (l) => l.trimStart().startsWith('{ id:"');
const isBanner = (l) => /═{5,}/.test(l);
const ratingOf = (l) => {
  const m = l.match(/rating:([\d.]+)/);
  if (!m) throw new Error("سطر تطبيق بدون rating: " + l.slice(0, 80));
  return parseFloat(m[1]);
};
const slugOf = (l) => l.match(/slug:"([^"]+)"/)[1];

// السكاشن = مناطق بين لافتات ═══ (كل لافتتين بيحطوا عنوان بينهم)
const banners = lines.map((l, i) => (isBanner(l) ? i : -1)).filter((i) => i >= 0);
if (banners.length % 2 !== 0) throw new Error("عدد لافتات فردي — بنية غير متوقعة");

let total = 0;
for (let s = 0; s < banners.length; s += 2) {
  const sectionName = (lines[banners[s] + 1] || "").replace(/\/\//g, "").trim();
  const start = banners[s + 1] + 1;
  const end = banners[s + 2] ?? lines.length;

  const slots = []; // خانات التطبيقات (أرقام الأسطر)
  const entries = []; // {text, rating, origIdx}
  for (let i = start; i < end; i++) {
    if (isAppLine(lines[i])) {
      slots.push(i);
      entries.push({ text: lines[i], rating: ratingOf(lines[i]), origIdx: slots.length - 1, slug: slugOf(lines[i]) });
    }
  }
  if (!entries.length) continue;

  const sorted = [...entries].sort((a, b) => b.rating - a.rating || a.origIdx - b.origIdx);
  slots.forEach((lineIdx, k) => (lines[lineIdx] = sorted[k].text));
  total += entries.length;
  console.log(`  ${sectionName}: ${sorted.slice(0, 3).map((e) => `${e.slug}(${e.rating})`).join(" ← ")} … (${entries.length})`);
}

const appCount = lines.filter(isAppLine).length;
if (appCount !== 162) throw new Error(`💥 عدد التطبيقات ${appCount} مش 162`);
if (total !== 162) throw new Error(`💥 السكاشن جمعت ${total} مش 162`);

fs.writeFileSync(FILE, lines.join("\n"));
console.log(`✅ تمت إعادة ترتيب ${total} تطبيق في ${banners.length / 2} سكشن`);
