import { cn } from "@/lib/ui-utils";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
};

export function BrandLogo({ className, imageClassName }: BrandLogoProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl bg-black flex items-center justify-center flex-shrink-0", className)}>
      <img
        src="/workhub-logo.svg"
        alt="WorkHub AI logo"
        className={cn("h-full w-full object-cover", imageClassName)}
      />
    </div>
  );
}
