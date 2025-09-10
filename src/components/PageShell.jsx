export default function PageShell({ title, subtitle, children }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="font-hero text-3xl md:text-4xl tracking-wide title-outline">{title}</h1>
      {subtitle && (
        <p className="font-medieval text-stone-600 dark:text-stone-300 mt-1">{subtitle}</p>
      )}
      <div className="mt-6 prose prose-stone dark:prose-invert max-w-none">{children}</div>
    </div>
  )
}
