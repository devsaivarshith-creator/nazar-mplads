"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  FileText,
  BarChart3,
  Shield,
  Database,
  HelpCircle,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmblemLogo } from "@/components/ui/EmblemLogo";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Explore", href: "/explore", icon: Search },
  { label: "Projects", href: "/projects", icon: FileText },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Investigations", href: "/investigations", icon: Shield },
  { label: "Sources", href: "/sources", icon: Database },
];

const BOTTOM_ITEMS = [
  { label: "Help", href: "/help", icon: HelpCircle },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-[#fcfcfb] border-r border-[#ecebe6] flex flex-col justify-between py-6 px-4 select-none shrink-0">
      <div>
        {/* Logo & Subtitle matching the real mockup */}
        <div className="px-2 mb-8">
          <Link href="/" className="group block">
            <div className="flex items-center gap-3">
              <EmblemLogo className="w-9 h-12 text-[#1c2024] shrink-0 group-hover:scale-105 transition-transform" />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl font-bold tracking-tight text-[#1c2024] group-hover:text-amber-800 transition-colors">
                    NAZAR
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-[#f1f0eb] text-[#636b74] tracking-wide border border-[#e2e0d8]">
                    Beta
                  </span>
                </div>
                <p className="text-[10px] text-[#717a84] font-medium leading-tight mt-0.5">
                  National Anomaly & Zone-based Review
                </p>
              </div>
            </div>
          </Link>
          <div className="mt-2.5 inline-flex items-center gap-1 text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium">
            <Sparkles className="w-2.5 h-2.5 text-amber-600" />
            Live Government Ingestion Active
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#f2efe9] text-[#1c2024] font-semibold shadow-xs"
                    : "text-[#586069] hover:bg-[#f7f6f2] hover:text-[#1c2024]"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-[#c25e00]" : "text-[#78828e]"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="pt-6 border-t border-[#eeece6] space-y-4">
        <nav className="space-y-1">
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#f2efe9] text-[#1c2024] font-semibold"
                    : "text-[#6c757d] hover:bg-[#f7f6f2] hover:text-[#1c2024]"
                )}
              >
                <Icon className="w-4 h-4 text-[#8a94a0]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Civic Moto & Tricolor Stripe */}
        <div className="px-3 pt-3">
          <div className="text-[10px] tracking-wider text-[#8b95a1] font-semibold uppercase leading-snug">
            Transparency Builds
            <br />A Stronger India
          </div>
          <div className="flex h-1 w-16 mt-2 rounded-full overflow-hidden">
            <div className="w-1/3 bg-[#ff9933]"></div>
            <div className="w-1/3 bg-[#f0f0f0]"></div>
            <div className="w-1/3 bg-[#138808]"></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
