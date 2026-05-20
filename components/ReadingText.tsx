/** Renders reading copy with \\n\\n paragraph breaks (dramatic short-line format). */
export function ReadingText({
  text,
  className = "leading-relaxed",
}: {
  text: string;
  className?: string;
}) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  const paragraphs = trimmed.includes("\n\n")
    ? trimmed.split(/\n\n+/)
    : trimmed.split(/\n+/);

  return (
    <div className={`space-y-3 ${className}`}>
      {paragraphs.map((para, i) => (
        <p key={i} className="leading-relaxed">
          {para.trim()}
        </p>
      ))}
    </div>
  );
}
