import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام — AppHub",
  description: "الشروط والأحكام لاستخدام منصة AppHub"
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-10 text-white text-center">
        <div className="text-6xl mb-3">📋</div>
        <h1 className="text-4xl font-extrabold mb-2">الشروط والأحكام</h1>
        <p className="text-white/90">آخر مراجعة: سبتمبر 2026</p>
      </div>

      <div className="rounded-3xl bg-white p-8 md:p-12 shadow-soft space-y-6">
        <Section title="1. القبول بالشروط">
          <p>
            باستخدامك لمنصة <strong>AppHub</strong>، فإنك توافق على الالتزام بهذه الشروط والأحكام.
            إذا كنت لا توافق على أي جزء منها، يُرجى عدم استخدام المنصة.
          </p>
        </Section>

        <Section title="2. الخدمات">
          <p>
            تقدم AppHub منصة لاكتشاف ومقارنة التطبيقات. نحن نوفّر:
          </p>
          <ul className="space-y-2 mr-6 list-disc mt-3">
            <li>دليل شامل للتطبيقات في المنطقة العربية</li>
            <li>مقارنات للأسعار والخدمات</li>
            <li>مراجعات وتقييمات من المستخدمين</li>
            <li>مدونة بمحتوى تقني عربي</li>
            <li>خدمات إعلانية للبراندات</li>
          </ul>
        </Section>

        <Section title="3. حساب المستخدم">
          <p className="mb-3">عند إنشاء حساب، يجب عليك:</p>
          <ul className="space-y-2 mr-6 list-disc">
            <li>تقديم معلومات صحيحة ودقيقة</li>
            <li>الحفاظ على سرية كلمة المرور</li>
            <li>إخطارنا فورًا بأي استخدام غير مصرح لحسابك</li>
            <li>عدم مشاركة حسابك مع الآخرين</li>
          </ul>
        </Section>

        <Section title="4. الاستخدام المسموح">
          <p className="mb-3">يحق لك استخدام المنصة للأغراض التالية:</p>
          <ul className="space-y-2 mr-6 list-disc">
            <li>✅ البحث عن التطبيقات ومقارنتها</li>
            <li>✅ كتابة مراجعات صادقة</li>
            <li>✅ التفاعل مع المجتمع</li>
            <li>✅ الاستفادة من الأدوات والمقارنات</li>
          </ul>
        </Section>

        <Section title="5. الاستخدام المحظور">
          <p className="mb-3">يُمنع منعًا باتًا:</p>
          <ul className="space-y-2 mr-6 list-disc">
            <li>❌ نشر محتوى مسيء أو غير قانوني</li>
            <li>❌ انتحال شخصية أي شخص أو جهة</li>
            <li>❌ محاولة اختراق المنصة</li>
            <li>❌ استخدام بوتات أو سكريبتات تلقائية</li>
            <li>❌ نسخ محتوى المنصة بدون إذن</li>
            <li>❌ نشر إعلانات بدون موافقة</li>
          </ul>
        </Section>

        <Section title="6. حقوق الملكية الفكرية">
          <p>
            كل المحتوى الموجود على AppHub (نصوص، صور، تصميم، شعار) مملوك لـ AppHub
            ومحمي بحقوق الملكية الفكرية. لا يجوز نسخه أو استخدامه بدون إذن كتابي مسبق.
          </p>
        </Section>

        <Section title="7. المحتوى المُنشأ من المستخدم">
          <p>
            عندما تنشر مراجعة أو تعليق، فأنت:
          </p>
          <ul className="space-y-2 mr-6 list-disc mt-3">
            <li>تتحمل المسؤولية الكاملة عن محتواه</li>
            <li>تمنحنا حق استخدامه على المنصة</li>
            <li>تؤكد أنه لا ينتهك حقوق أي طرف ثالث</li>
            <li>تقبل بأننا قد نحذفه إذا خالف الشروط</li>
          </ul>
        </Section>

        <Section title="8. الإعلانات والخدمات المدفوعة">
          <p>
            باشتراكك في باقات الإعلانات:
          </p>
          <ul className="space-y-2 mr-6 list-disc mt-3">
            <li>توافق على شروط الباقة المحددة</li>
            <li>الدفعات غير قابلة للاسترداد إلا في حالات استثنائية</li>
            <li>يحق لنا رفض أي إعلان لا يتوافق مع سياساتنا</li>
            <li>الإحصائيات تقريبية وقد تتغير</li>
          </ul>
        </Section>

        <Section title="9. إخلاء المسؤولية">
          <p>
            المعلومات على AppHub مقدمة "كما هي" بدون أي ضمانات. نحن نبذل قصارى جهدنا
            لضمان دقة المعلومات، لكننا لا نضمن:
          </p>
          <ul className="space-y-2 mr-6 list-disc mt-3">
            <li>دقة الأسعار في جميع الأوقات</li>
            <li>توفر التطبيقات في كل البلدان</li>
            <li>عدم انقطاع الخدمة</li>
          </ul>
        </Section>

        <Section title="10. تعديل الشروط">
          <p>
            نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم إعلامك بالتغييرات الجوهرية،
            واستمرار استخدامك للمنصة يعتبر موافقة على الشروط الجديدة.
          </p>
        </Section>

        <Section title="11. القانون المعمول به">
          <p>
            تخضع هذه الشروط لقوانين جمهورية مصر العربية، وأي نزاع يتم حله أمام المحاكم المصرية.
          </p>
        </Section>

        <Section title="12. التواصل">
          <p>
            لأي استفسارات بخصوص الشروط:
          </p>
          <div className="mt-3 rounded-2xl bg-brand-50 p-4">
            <p>📧 <strong>legal@apphub.eg</strong></p>
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