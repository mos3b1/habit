import Image from "next/image";
import Link from "next/link";
import logo from "../app/favicon.ico"
type LogoProps = {
  href?: string;
  size?: number;          // width/height in px
  showText?: boolean;
  className?: string;
};

/**
 * Uses your real logo PNG so it looks exactly like the design.
 * Best for production branding.
 */
export function Logo({ href = "/dashboard", size = 36, showText = true, className }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className ?? ""}`}>
      <Image
        src={logo}
        alt="HabitTracker logo"
        width={size}
        height={size}
        priority
      />
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Habit<span className="text-primary">Flow</span>
        </span>
      )}
    </Link>
  );
}