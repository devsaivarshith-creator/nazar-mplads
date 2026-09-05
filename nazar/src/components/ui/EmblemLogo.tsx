import Image from "next/image";

export function EmblemLogo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden shadow-sm ${className}`}>
      <Image
        src="/logo.png"
        alt="NAZAR Logo"
        width={48}
        height={48}
        className="w-full h-full object-contain"
        priority
      />
    </div>
  );
}
