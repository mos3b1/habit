import Image from "next/image";
import Link from "next/link";
import logo from "../../public/brand/favicon.png"
type LogoProps = {
  href?: string;
  size?: number;        // icon size
  showText?: boolean;   // show “HabitFlow”
  className?: string;
  textClassName?: string;
  priority?: boolean;
};

/**
 * Brand Logo
 * - uses /public/brand/logo.png (best practice)
 * - text uses theme tokens so it works in dark mode
 */
export function Logo({
  href = "/",
  size = 28,
  showText = true,
  className,
  textClassName,
  priority = false,
}: LogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className ?? ""}`}>
      <Image
        src={logo}
        alt="HabitFlow logo"
        width={size}
        height={size}
        priority={priority}
      />

      {showText && (
        <span className={`text-lg font-semibold tracking-tight text-foreground ${textClassName ?? ""}`}>
          Habit<span className="text-primary">Flow</span>
        </span>
      )}
    </Link>
  );
}