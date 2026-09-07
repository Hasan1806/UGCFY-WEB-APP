import React from "react";

interface LegalSectionProps {
  id?: string;
  title?: string;
  children: React.ReactNode;
}

export default function LegalSection({ id, title, children }: LegalSectionProps) {
  return (
    <section id={id} className="mt-12 first:mt-0">
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
          {title}
        </h2>
      )}
      <div className="space-y-4 text-gray-600 leading-relaxed">
        {children}
      </div>
    </section>
  );
}
