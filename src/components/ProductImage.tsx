import { FlaskConical } from "lucide-react";

export function ProductImage({
  alt,
  src,
  className = "",
}: {
  alt: string;
  src?: string;
  className?: string;
}) {
  if (src) {
    return (
      <div
        className={`aspect-square w-full overflow-hidden rounded-lg border border-border bg-card ${className}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex aspect-square w-full items-center justify-center rounded-lg border border-border bg-gradient-to-br from-secondary to-background ${className}`}
    >
      <FlaskConical className="h-16 w-16 text-teal/60" strokeWidth={1.25} />
    </div>
  );
}
