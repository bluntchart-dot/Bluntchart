export const metadata = {
  title: "Moon Story Generator — BluntChart Internal",
  robots: "noindex, nofollow",
};

export default function MoonStoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ minHeight: "100vh" }}>
      {children}
      <style>{`
        body {
          background: #F5F0E6 !important;
          color: #1A1612 !important;
        }
        .bcf, footer {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
