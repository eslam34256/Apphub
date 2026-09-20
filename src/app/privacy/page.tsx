import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية — AppHub",
  description: "سياسة الخصوصية وحماية البيانات في AppHub"
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-6xl mb-3">🔒</div>
        <h1 className="text-4xl font-extrabold mb-2">سياسة الخصوصية</h1>
        <p className="text-white/90">آخر مراجعة: سبتمبر 2026</p>
      </div>

      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-soft space-y-6">
        <Section title="مقدمة">
          <p>
            في <strong>AppHub</strong>، نحن نقدّر خصوصيتك ونلتزم بحماية بياناتك الشخصية.
            هذه السياسة توضح كيف نجمع ونستخدم ونحمي معلوماتك عند استخدامك لمنصتنا.
          </p>
        </Section>

        <Section title="1. المعلومات التي نجمعها">
          <p className="mb-3">نجمع نوعين من المعلومات:</p>
          <ul className="space-y-2 mr-6 list-disc">
            <li>
              <strong>معلومات شخصية:</strong> الاسم، البريد الإلكتروني، رقم الهاتف
              (اختياري)، عند التسجيل أو التواصل معنا.
            </li>
            <li>
              <strong>معلومات الاستخدام:</strong> صفحات تزورها، التطبيقات التي تبحث عنها،
              ووقت الزيارة لتحسين تجربتك.
            </li>
            <li>
              <strong>الكوكيز:</strong> نستخدم ملفات تعريف الارتباط لتذكر تفضيلاتك.
            </li>
          </ul>
        </Section>

        <Section title="2. كيف نستخدم معلوماتك">
          <ul className="space-y-2 mr-6 list-disc">
            <li>تقديم خدماتنا وتحسينها</li>
            <li>التواصل معك بخصوص حسابك أو استفساراتك</li>
            <li>إرسال نشرات إخبارية (يمكنك إلغاء الاشتراك في أي وقت)</li>
            <li>تحليل استخدام المنصة لتطوير ميزات جديدة</li>
            <li>حماية المنصة من الاحتيال والاستخدام غير المصرح به</li>
          </ul>
        </Section>

        <Section title="3. مشاركة المعلومات">
          <p className="mb-3">
            <strong>نحن لا نبيع بياناتك الشخصية أبدًا.</strong> قد نشارك معلوماتك في الحالات التالية فقط:
          </p>
          <ul className="space-y-2 mr-6 list-disc">
            <li>بموافقتك الصريحة</li>
            <li>مع مزودي الخدمات الموثوقين (مثل Supabase للتخزين)</li>
            <li>عند الضرورة القانونية أو لحماية حقوقنا</li>
          </ul>
        </Section>

        <Section title="4. أمان البيانات">
          <p>
            نستخدم تقنيات أمان متقدمة لحماية بياناتك بما في ذلك:
          </p>
          <ul className="space-y-2 mr-6 list-disc mt-3">
            <li>🔐 تشفير SSL لكل البيانات المنقولة</li>
            <li>🛡️ Row Level Security في قاعدة البيانات</li>
            <li>🔑 تشفير كلمات المرور</li>
            <li>🚫 منع الوصول غير المصرح به</li>
          </ul>
        </Section>

        <Section title="5. حقوقك">
          <p className="mb-3">لديك الحق في:</p>
          <ul className="space-y-2 mr-6 list-disc">
            <li>الوصول لبياناتك الشخصية</li>
            <li>تعديل أو حذف بياناتك</li>
            <li>إلغاء الاشتراك من النشرات</li>
            <li>طلب نسخة من بياناتك</li>
            <li>إغلاق حسابك في أي وقت</li>
          </ul>
        </Section>

        <Section title="6. الكوكيز">
          <p>
            نستخدم الكوكيز لتحسين تجربتك. يمكنك تعطيلها من إعدادات المتصفح،
            لكن بعض الميزات قد لا تعمل بشكل صحيح.
          </p>
        </Section>

        <Section title="7. التغييرات على هذه السياسة">
          <p>
            قد نحدّث هذه السياسة من وقت لآخر. سنخبرك بأي تغييرات جوهرية عبر البريد الإلكتروني
            أو إشعار على المنصة.
          </p>
        </Section>

        <Section title="8. التواصل">
          <p>
            لأي استفسار بخصوص الخصوصية، تواصل معنا:
          </p>
          <div className="mt-3 rounded-2xl bg-brand-50 p-4">
            <p>📧 البريد: <strong>privacy@apphub.eg</strong></p>
            <p>📞 الهاتف: <strong>+20 100 000 0000</strong></p>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-brand-700 mb-3">{title}</h2>
      <div className="text-slate-600 leading-relaxed">{children}</div>
    </div>
  );
}