export function EmblemLogo({ className = "w-9 h-11" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center justify-center shrink-0 ${className}`}>
      {/* High-fidelity vector Lion Capital of Ashoka with Satyameva Jayate motto */}
      <svg
        viewBox="0 0 100 130"
        fill="currentColor"
        className="w-full h-full text-[#1c2024]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top Lions */}
        {/* Center Lion Head & Mane */}
        <path d="M50 10 C46 10 42 13 41 16 C39 19 40 23 42 26 C43 28 41 31 39 34 C37 38 38 43 41 46 C44 49 47 50 50 50 C53 50 56 49 59 46 C62 43 63 38 61 34 C59 31 57 28 58 26 C60 23 61 19 59 16 C58 13 54 10 50 10 Z" opacity="0.95" />
        {/* Crown & Forehead */}
        <path d="M47 14 C48 12 52 12 53 14 C55 17 55 20 53 22 C51 23 49 23 47 22 C45 20 45 17 47 14 Z" fill="#fff" opacity="0.3" />
        
        {/* Left Lion Profile */}
        <path d="M38 18 C33 18 28 22 27 27 C26 31 28 35 31 38 C33 40 33 44 31 47 C29 51 31 56 35 59 C37 60 40 60 42 59 C40 55 40 50 42 46 C39 43 38 38 40 34 C41 31 41 28 40 26 C38 23 37 20 38 18 Z" opacity="0.85" />
        
        {/* Right Lion Profile */}
        <path d="M62 18 C67 18 72 22 73 27 C74 31 72 35 69 38 C67 40 67 44 69 47 C71 51 69 56 65 59 C63 60 60 60 58 59 C60 55 60 50 58 46 C61 43 62 38 60 34 C59 31 59 28 60 26 C62 23 63 20 62 18 Z" opacity="0.85" />

        {/* Lion Chests & Forelegs Base */}
        <path d="M34 50 L38 68 L62 68 L66 50 C60 53 55 54 50 54 C45 54 40 53 34 50 Z" />
        <line x1="43" y1="54" x2="43" y2="68" stroke="#fff" strokeWidth="1" opacity="0.4" />
        <line x1="50" y1="54" x2="50" y2="68" stroke="#fff" strokeWidth="1" opacity="0.4" />
        <line x1="57" y1="54" x2="57" y2="68" stroke="#fff" strokeWidth="1" opacity="0.4" />

        {/* Abacus Frieze Platform */}
        <rect x="22" y="69" width="56" height="14" rx="2" fill="currentColor" />
        
        {/* Ashoka Chakra in Center of Abacus */}
        <circle cx="50" cy="76" r="5.5" fill="#fff" />
        <circle cx="50" cy="76" r="4.5" fill="currentColor" />
        <circle cx="50" cy="76" r="1.5" fill="#fff" />
        {/* Spokes */}
        <line x1="50" y1="71" x2="50" y2="81" stroke="#fff" strokeWidth="0.6" />
        <line x1="45" y1="76" x2="55" y2="76" stroke="#fff" strokeWidth="0.6" />
        <line x1="46.5" y1="72.5" x2="53.5" y2="79.5" stroke="#fff" strokeWidth="0.6" />
        <line x1="46.5" y1="79.5" x2="53.5" y2="72.5" stroke="#fff" strokeWidth="0.6" />

        {/* Galloping Horse (Left of Chakra) */}
        <path d="M31 75 C33 73 35 73 37 74 C35 75 34 77 36 78 C34 78 32 77 31 75 Z" fill="#fff" opacity="0.7" />

        {/* Bull (Right of Chakra) */}
        <path d="M69 75 C67 73 65 73 63 74 C65 75 66 77 64 78 C66 78 68 77 69 75 Z" fill="#fff" opacity="0.7" />

        {/* Bell-shaped Lotus Base / Pedestal */}
        <path d="M26 84 C26 84 34 94 50 94 C66 94 74 84 74 84 L77 87 C75 97 64 100 50 100 C36 100 25 97 23 87 Z" opacity="0.9" />
        <line x1="50" y1="86" x2="50" y2="98" stroke="#fff" strokeWidth="1" opacity="0.3" />
        <line x1="40" y1="87" x2="43" y2="97" stroke="#fff" strokeWidth="0.8" opacity="0.3" />
        <line x1="60" y1="87" x2="57" y2="97" stroke="#fff" strokeWidth="0.8" opacity="0.3" />

        {/* Base Step Plinth */}
        <rect x="20" y="101" width="60" height="3" rx="1" fill="currentColor" />

        {/* Devnagari Motto: सत्यमेव जयते */}
        <text
          x="50"
          y="114"
          textAnchor="middle"
          fontSize="8.5"
          fontFamily="serif"
          fontWeight="bold"
          fill="currentColor"
          letterSpacing="0.8"
        >
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
}
