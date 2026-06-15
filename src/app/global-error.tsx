"use client";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Cairo, sans-serif' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fafafa',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚠️</div>
            <h1 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '10px' }}>
              حصلت مشكلة كبيرة
            </h1>
            <p style={{ color: '#64748b', marginBottom: '30px' }}>
              عذرًا، حصل خطأ غير متوقع. حاول تاني بعد شوية.
            </p>
            <button
              onClick={reset}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '16px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              جرب تاني
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}