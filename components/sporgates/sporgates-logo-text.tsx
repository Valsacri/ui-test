import Image from "next/image"
import { cn } from "@/lib/utils"

/** Public path to the Sporgates wordmark SVG (`public/logo/logo-text.svg`). */
export const SPOGATES_LOGO_TEXT_SRC = "/logo/logo-text.svg"

const INTRINSIC_W = 375
const INTRINSIC_H = 48

type SporgatesLogoTextProps = {
  className?: string
  /** Tailwind height classes controlling rendered size (width follows aspect ratio). */
  heightClass?: string
  /** Navy wordmark on dark UI (e.g. auth panel): invert for contrast. */
  variant?: "default" | "onDark"
  priority?: boolean
}

export function SporgatesLogoText({
  className,
  heightClass = "h-7 md:h-8",
  variant = "default",
  priority = false,
}: SporgatesLogoTextProps) {
  return (
    <Image
      src={SPOGATES_LOGO_TEXT_SRC}
      alt="Sporgates"
      width={INTRINSIC_W}
      height={INTRINSIC_H}
      className={cn(
        "w-auto object-contain object-left",
        heightClass,
        variant === "onDark" && "brightness-0 invert opacity-95",
        className
      )}
      priority={priority}
    />
  )
}
