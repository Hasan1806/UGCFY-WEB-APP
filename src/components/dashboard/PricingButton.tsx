"use client";


interface PricingButtonProps {
  label?: string;
  className?: string;
}

export function PricingButton({
  label = "Go Plus",
  className = "inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-brand-black px-5 text-sm font-extrabold text-white transition hover:bg-brand-red-700",
}: PricingButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-pricing-modal"))}
      className={className}
    >
      
      {label}
    </button>
  );
}
