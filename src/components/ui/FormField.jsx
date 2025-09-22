"use client";
export function FormField({ label, id, children, hint }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

export function Input({ id, type="text", ...props }) {
  return (
    <input id={id} type={type} {...props} className={`w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-orange-600 bg-white ${props.className||''}`} />
  );
}

export function SectionCard({ title, subtitle, action, children }) {
  return (
    <section className="border border-gray-200 p-6 mb-12">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && <p className="text-gray-600 text-sm mt-1">{subtitle}</p>}
        </div>
        {action}
      </header>
      <div className="space-y-6">{children}</div>
    </section>
  );
}
