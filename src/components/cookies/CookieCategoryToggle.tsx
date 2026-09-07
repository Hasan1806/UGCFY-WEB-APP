"use client";

import React from "react";

interface CookieCategoryToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export default function CookieCategoryToggle({
  id,
  title,
  description,
  checked,
  disabled = false,
  onChange,
}: CookieCategoryToggleProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-4">
        <label htmlFor={id} className={`font-semibold text-[15px] ${disabled ? 'text-gray-900' : 'text-gray-900 cursor-pointer'}`}>
          {title}
        </label>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          {description}
        </p>
      </div>
      <div className="shrink-0 flex items-center">
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
            focus-visible:ring-[#E11D48] focus-visible:ring-offset-2
            ${checked ? 'bg-[#E11D48]' : 'bg-gray-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <span className="sr-only">Toggle {title}</span>
          <span
            aria-hidden="true"
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  );
}
