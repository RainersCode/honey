import { ReactNode } from "react";
import { ArrowRightIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[14rem] grid-cols-3 gap-6",
        className,
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background: ReactNode;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl",
      // Dark overlay theme styling
      "shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300",
      className,
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-3 p-8 transition-all duration-300 group-hover:-translate-y-2">
      <h3 className="text-xl font-serif font-semibold text-white leading-tight drop-shadow-lg">
        {name}
      </h3>
      <p className="text-white/90 text-sm leading-relaxed max-w-lg drop-shadow-md">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute top-4 right-4 z-20 transform-gpu translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
      )}
    >
      <Button 
        variant="ghost" 
        asChild 
        size="sm" 
        className="pointer-events-auto bg-[#FF7A3D] hover:bg-[#ff6a2a] text-white rounded-full px-6 py-2 font-medium transition-colors duration-300 shadow-lg"
      >
        <a href={href}>
          {cta}
          <ArrowRightIcon className="ml-2 h-4 w-4" />
        </a>
      </Button>
    </div>
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-[#FF7A3D]/10 group-hover:to-[#FF9A6A]/10" />
  </div>
);

export { BentoCard, BentoGrid }; 